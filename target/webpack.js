(() => {
  "use strict";
  var util, objectUtil;
  !(function (util) {
    (util.assertEqual = (val) => val),
      (util.assertIs = function (_arg) {}),
      (util.assertNever = function (_x) {
        throw new Error();
      }),
      (util.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) obj[item] = item;
        return obj;
      }),
      (util.getValidEnumValues = (obj) => {
        const validKeys = util
            .objectKeys(obj)
            .filter((k) => "number" != typeof obj[obj[k]]),
          filtered = {};
        for (const k of validKeys) filtered[k] = obj[k];
        return util.objectValues(filtered);
      }),
      (util.objectValues = (obj) =>
        util.objectKeys(obj).map(function (e) {
          return obj[e];
        })),
      (util.objectKeys =
        "function" == typeof Object.keys
          ? (obj) => Object.keys(obj)
          : (object) => {
              const keys = [];
              for (const key in object)
                Object.prototype.hasOwnProperty.call(object, key) &&
                  keys.push(key);
              return keys;
            }),
      (util.find = (arr, checker) => {
        for (const item of arr) if (checker(item)) return item;
      }),
      (util.isInteger =
        "function" == typeof Number.isInteger
          ? (val) => Number.isInteger(val)
          : (val) =>
              "number" == typeof val &&
              isFinite(val) &&
              Math.floor(val) === val),
      (util.joinValues = function (array, separator = " | ") {
        return array
          .map((val) => ("string" == typeof val ? `'${val}'` : val))
          .join(separator);
      }),
      (util.jsonStringifyReplacer = (_, value) =>
        "bigint" == typeof value ? value.toString() : value);
  })(util || (util = {})),
    (function (objectUtil) {
      objectUtil.mergeShapes = (first, second) => ({ ...first, ...second });
    })(objectUtil || (objectUtil = {}));
  const ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set",
    ]),
    getParsedType = (data) => {
      switch (typeof data) {
        case "undefined":
          return ZodParsedType.undefined;
        case "string":
          return ZodParsedType.string;
        case "number":
          return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
          return ZodParsedType.boolean;
        case "function":
          return ZodParsedType.function;
        case "bigint":
          return ZodParsedType.bigint;
        case "symbol":
          return ZodParsedType.symbol;
        case "object":
          return Array.isArray(data)
            ? ZodParsedType.array
            : null === data
            ? ZodParsedType.null
            : data.then &&
              "function" == typeof data.then &&
              data.catch &&
              "function" == typeof data.catch
            ? ZodParsedType.promise
            : "undefined" != typeof Map && data instanceof Map
            ? ZodParsedType.map
            : "undefined" != typeof Set && data instanceof Set
            ? ZodParsedType.set
            : "undefined" != typeof Date && data instanceof Date
            ? ZodParsedType.date
            : ZodParsedType.object;
        default:
          return ZodParsedType.unknown;
      }
    },
    ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite",
    ]);
  class ZodError extends Error {
    constructor(issues) {
      super(),
        (this.issues = []),
        (this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        }),
        (this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        });
      const actualProto = new.target.prototype;
      Object.setPrototypeOf
        ? Object.setPrototypeOf(this, actualProto)
        : (this.__proto__ = actualProto),
        (this.name = "ZodError"),
        (this.issues = issues);
    }
    get errors() {
      return this.issues;
    }
    format(_mapper) {
      const mapper =
          _mapper ||
          function (issue) {
            return issue.message;
          },
        fieldErrors = { _errors: [] },
        processError = (error) => {
          for (const issue of error.issues)
            if ("invalid_union" === issue.code)
              issue.unionErrors.map(processError);
            else if ("invalid_return_type" === issue.code)
              processError(issue.returnTypeError);
            else if ("invalid_arguments" === issue.code)
              processError(issue.argumentsError);
            else if (0 === issue.path.length)
              fieldErrors._errors.push(mapper(issue));
            else {
              let curr = fieldErrors,
                i = 0;
              for (; i < issue.path.length; ) {
                const el = issue.path[i];
                i === issue.path.length - 1
                  ? ((curr[el] = curr[el] || { _errors: [] }),
                    curr[el]._errors.push(mapper(issue)))
                  : (curr[el] = curr[el] || { _errors: [] }),
                  (curr = curr[el]),
                  i++;
              }
            }
        };
      return processError(this), fieldErrors;
    }
    static assert(value) {
      if (!(value instanceof ZodError))
        throw new Error(`Not a ZodError: ${value}`);
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return 0 === this.issues.length;
    }
    flatten(mapper = (issue) => issue.message) {
      const fieldErrors = {},
        formErrors = [];
      for (const sub of this.issues)
        sub.path.length > 0
          ? ((fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || []),
            fieldErrors[sub.path[0]].push(mapper(sub)))
          : formErrors.push(mapper(sub));
      return { formErrors, fieldErrors };
    }
    get formErrors() {
      return this.flatten();
    }
  }
  ZodError.create = (issues) => new ZodError(issues);
  const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        message =
          issue.received === ZodParsedType.undefined
            ? "Required"
            : `Expected ${issue.expected}, received ${issue.received}`;
        break;
      case ZodIssueCode.invalid_literal:
        message = `Invalid literal value, expected ${JSON.stringify(
          issue.expected,
          util.jsonStringifyReplacer
        )}`;
        break;
      case ZodIssueCode.unrecognized_keys:
        message = `Unrecognized key(s) in object: ${util.joinValues(
          issue.keys,
          ", "
        )}`;
        break;
      case ZodIssueCode.invalid_union:
        message = "Invalid input";
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = `Invalid discriminator value. Expected ${util.joinValues(
          issue.options
        )}`;
        break;
      case ZodIssueCode.invalid_enum_value:
        message = `Invalid enum value. Expected ${util.joinValues(
          issue.options
        )}, received '${issue.received}'`;
        break;
      case ZodIssueCode.invalid_arguments:
        message = "Invalid function arguments";
        break;
      case ZodIssueCode.invalid_return_type:
        message = "Invalid function return type";
        break;
      case ZodIssueCode.invalid_date:
        message = "Invalid date";
        break;
      case ZodIssueCode.invalid_string:
        "object" == typeof issue.validation
          ? "includes" in issue.validation
            ? ((message = `Invalid input: must include "${issue.validation.includes}"`),
              "number" == typeof issue.validation.position &&
                (message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`))
            : "startsWith" in issue.validation
            ? (message = `Invalid input: must start with "${issue.validation.startsWith}"`)
            : "endsWith" in issue.validation
            ? (message = `Invalid input: must end with "${issue.validation.endsWith}"`)
            : util.assertNever(issue.validation)
          : (message =
              "regex" !== issue.validation
                ? `Invalid ${issue.validation}`
                : "Invalid");
        break;
      case ZodIssueCode.too_small:
        message =
          "array" === issue.type
            ? `Array must contain ${
                issue.exact
                  ? "exactly"
                  : issue.inclusive
                  ? "at least"
                  : "more than"
              } ${issue.minimum} element(s)`
            : "string" === issue.type
            ? `String must contain ${
                issue.exact ? "exactly" : issue.inclusive ? "at least" : "over"
              } ${issue.minimum} character(s)`
            : "number" === issue.type
            ? `Number must be ${
                issue.exact
                  ? "exactly equal to "
                  : issue.inclusive
                  ? "greater than or equal to "
                  : "greater than "
              }${issue.minimum}`
            : "date" === issue.type
            ? `Date must be ${
                issue.exact
                  ? "exactly equal to "
                  : issue.inclusive
                  ? "greater than or equal to "
                  : "greater than "
              }${new Date(Number(issue.minimum))}`
            : "Invalid input";
        break;
      case ZodIssueCode.too_big:
        message =
          "array" === issue.type
            ? `Array must contain ${
                issue.exact
                  ? "exactly"
                  : issue.inclusive
                  ? "at most"
                  : "less than"
              } ${issue.maximum} element(s)`
            : "string" === issue.type
            ? `String must contain ${
                issue.exact ? "exactly" : issue.inclusive ? "at most" : "under"
              } ${issue.maximum} character(s)`
            : "number" === issue.type
            ? `Number must be ${
                issue.exact
                  ? "exactly"
                  : issue.inclusive
                  ? "less than or equal to"
                  : "less than"
              } ${issue.maximum}`
            : "bigint" === issue.type
            ? `BigInt must be ${
                issue.exact
                  ? "exactly"
                  : issue.inclusive
                  ? "less than or equal to"
                  : "less than"
              } ${issue.maximum}`
            : "date" === issue.type
            ? `Date must be ${
                issue.exact
                  ? "exactly"
                  : issue.inclusive
                  ? "smaller than or equal to"
                  : "smaller than"
              } ${new Date(Number(issue.maximum))}`
            : "Invalid input";
        break;
      case ZodIssueCode.custom:
        message = "Invalid input";
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = "Intersection results could not be merged";
        break;
      case ZodIssueCode.not_multiple_of:
        message = `Number must be a multiple of ${issue.multipleOf}`;
        break;
      case ZodIssueCode.not_finite:
        message = "Number must be finite";
        break;
      default:
        (message = _ctx.defaultError), util.assertNever(issue);
    }
    return { message };
  };
  let overrideErrorMap = errorMap;
  function getErrorMap() {
    return overrideErrorMap;
  }
  const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params,
      fullPath = [...path, ...(issueData.path || [])],
      fullIssue = { ...issueData, path: fullPath };
    if (void 0 !== issueData.message)
      return { ...issueData, path: fullPath, message: issueData.message };
    let errorMessage = "";
    const maps = errorMaps
      .filter((m) => !!m)
      .slice()
      .reverse();
    for (const map of maps)
      errorMessage = map(fullIssue, {
        data,
        defaultError: errorMessage,
      }).message;
    return { ...issueData, path: fullPath, message: errorMessage };
  };
  function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap(),
      issue = makeIssue({
        issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          overrideMap,
          overrideMap === errorMap ? void 0 : errorMap,
        ].filter((x) => !!x),
      });
    ctx.common.issues.push(issue);
  }
  class ParseStatus {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      "valid" === this.value && (this.value = "dirty");
    }
    abort() {
      "aborted" !== this.value && (this.value = "aborted");
    }
    static mergeArray(status, results) {
      const arrayValue = [];
      for (const s of results) {
        if ("aborted" === s.status) return INVALID;
        "dirty" === s.status && status.dirty(), arrayValue.push(s.value);
      }
      return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
      const syncPairs = [];
      for (const pair of pairs) {
        const key = await pair.key,
          value = await pair.value;
        syncPairs.push({ key, value });
      }
      return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
      const finalObject = {};
      for (const pair of pairs) {
        const { key, value } = pair;
        if ("aborted" === key.status) return INVALID;
        if ("aborted" === value.status) return INVALID;
        "dirty" === key.status && status.dirty(),
          "dirty" === value.status && status.dirty(),
          "__proto__" === key.value ||
            (void 0 === value.value && !pair.alwaysSet) ||
            (finalObject[key.value] = value.value);
      }
      return { status: status.value, value: finalObject };
    }
  }
  const INVALID = Object.freeze({ status: "aborted" }),
    DIRTY = (value) => ({ status: "dirty", value }),
    OK = (value) => ({ status: "valid", value }),
    isAborted = (x) => "aborted" === x.status,
    isDirty = (x) => "dirty" === x.status,
    isValid = (x) => "valid" === x.status,
    isAsync = (x) => "undefined" != typeof Promise && x instanceof Promise;
  function __classPrivateFieldGet(receiver, state, kind, f) {
    if ("a" === kind && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (
      "function" == typeof state
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    return "m" === kind
      ? f
      : "a" === kind
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  }
  function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if ("m" === kind) throw new TypeError("Private method is not writable");
    if ("a" === kind && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (
      "function" == typeof state
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return (
      "a" === kind
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  }
  var errorUtil, _ZodEnum_cache, _ZodNativeEnum_cache;
  "function" == typeof SuppressedError && SuppressedError,
    (function (errorUtil) {
      (errorUtil.errToObj = (message) =>
        "string" == typeof message ? { message } : message || {}),
        (errorUtil.toString = (message) =>
          "string" == typeof message
            ? message
            : null == message
            ? void 0
            : message.message);
    })(errorUtil || (errorUtil = {}));
  class ParseInputLazyPath {
    constructor(parent, value, path, key) {
      (this._cachedPath = []),
        (this.parent = parent),
        (this.data = value),
        (this._path = path),
        (this._key = key);
    }
    get path() {
      return (
        this._cachedPath.length ||
          (this._key instanceof Array
            ? this._cachedPath.push(...this._path, ...this._key)
            : this._cachedPath.push(...this._path, this._key)),
        this._cachedPath
      );
    }
  }
  const handleResult = (ctx, result) => {
    if (isValid(result)) return { success: !0, data: result.value };
    if (!ctx.common.issues.length)
      throw new Error("Validation failed but no issues detected.");
    return {
      success: !1,
      get error() {
        if (this._error) return this._error;
        const error = new ZodError(ctx.common.issues);
        return (this._error = error), this._error;
      },
    };
  };
  function processCreateParams(params) {
    if (!params) return {};
    const { errorMap, invalid_type_error, required_error, description } =
      params;
    if (errorMap && (invalid_type_error || required_error))
      throw new Error(
        'Can\'t use "invalid_type_error" or "required_error" in conjunction with custom error map.'
      );
    if (errorMap) return { errorMap, description };
    return {
      errorMap: (iss, ctx) => {
        var _a, _b;
        const { message } = params;
        return "invalid_enum_value" === iss.code
          ? { message: null != message ? message : ctx.defaultError }
          : void 0 === ctx.data
          ? {
              message:
                null !== (_a = null != message ? message : required_error) &&
                void 0 !== _a
                  ? _a
                  : ctx.defaultError,
            }
          : "invalid_type" !== iss.code
          ? { message: ctx.defaultError }
          : {
              message:
                null !==
                  (_b = null != message ? message : invalid_type_error) &&
                void 0 !== _b
                  ? _b
                  : ctx.defaultError,
            };
      },
      description,
    };
  }
  class ZodType {
    constructor(def) {
      (this.spa = this.safeParseAsync),
        (this._def = def),
        (this.parse = this.parse.bind(this)),
        (this.safeParse = this.safeParse.bind(this)),
        (this.parseAsync = this.parseAsync.bind(this)),
        (this.safeParseAsync = this.safeParseAsync.bind(this)),
        (this.spa = this.spa.bind(this)),
        (this.refine = this.refine.bind(this)),
        (this.refinement = this.refinement.bind(this)),
        (this.superRefine = this.superRefine.bind(this)),
        (this.optional = this.optional.bind(this)),
        (this.nullable = this.nullable.bind(this)),
        (this.nullish = this.nullish.bind(this)),
        (this.array = this.array.bind(this)),
        (this.promise = this.promise.bind(this)),
        (this.or = this.or.bind(this)),
        (this.and = this.and.bind(this)),
        (this.transform = this.transform.bind(this)),
        (this.brand = this.brand.bind(this)),
        (this.default = this.default.bind(this)),
        (this.catch = this.catch.bind(this)),
        (this.describe = this.describe.bind(this)),
        (this.pipe = this.pipe.bind(this)),
        (this.readonly = this.readonly.bind(this)),
        (this.isNullable = this.isNullable.bind(this)),
        (this.isOptional = this.isOptional.bind(this));
    }
    get description() {
      return this._def.description;
    }
    _getType(input) {
      return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
      return (
        ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent,
        }
      );
    }
    _processInputParams(input) {
      return {
        status: new ParseStatus(),
        ctx: {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent,
        },
      };
    }
    _parseSync(input) {
      const result = this._parse(input);
      if (isAsync(result))
        throw new Error("Synchronous parse encountered promise.");
      return result;
    }
    _parseAsync(input) {
      const result = this._parse(input);
      return Promise.resolve(result);
    }
    parse(data, params) {
      const result = this.safeParse(data, params);
      if (result.success) return result.data;
      throw result.error;
    }
    safeParse(data, params) {
      var _a;
      const ctx = {
          common: {
            issues: [],
            async:
              null !== (_a = null == params ? void 0 : params.async) &&
              void 0 !== _a &&
              _a,
            contextualErrorMap: null == params ? void 0 : params.errorMap,
          },
          path: (null == params ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data),
        },
        result = this._parseSync({ data, path: ctx.path, parent: ctx });
      return handleResult(ctx, result);
    }
    async parseAsync(data, params) {
      const result = await this.safeParseAsync(data, params);
      if (result.success) return result.data;
      throw result.error;
    }
    async safeParseAsync(data, params) {
      const ctx = {
          common: {
            issues: [],
            contextualErrorMap: null == params ? void 0 : params.errorMap,
            async: !0,
          },
          path: (null == params ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data),
        },
        maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx }),
        result = await (isAsync(maybeAsyncResult)
          ? maybeAsyncResult
          : Promise.resolve(maybeAsyncResult));
      return handleResult(ctx, result);
    }
    refine(check, message) {
      const getIssueProperties = (val) =>
        "string" == typeof message || void 0 === message
          ? { message }
          : "function" == typeof message
          ? message(val)
          : message;
      return this._refinement((val, ctx) => {
        const result = check(val),
          setError = () =>
            ctx.addIssue({
              code: ZodIssueCode.custom,
              ...getIssueProperties(val),
            });
        return "undefined" != typeof Promise && result instanceof Promise
          ? result.then((data) => !!data || (setError(), !1))
          : !!result || (setError(), !1);
      });
    }
    refinement(check, refinementData) {
      return this._refinement(
        (val, ctx) =>
          !!check(val) ||
          (ctx.addIssue(
            "function" == typeof refinementData
              ? refinementData(val, ctx)
              : refinementData
          ),
          !1)
      );
    }
    _refinement(refinement) {
      return new ZodEffects({
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "refinement", refinement },
      });
    }
    superRefine(refinement) {
      return this._refinement(refinement);
    }
    optional() {
      return ZodOptional.create(this, this._def);
    }
    nullable() {
      return ZodNullable.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return ZodArray.create(this, this._def);
    }
    promise() {
      return ZodPromise.create(this, this._def);
    }
    or(option) {
      return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
      return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
      return new ZodEffects({
        ...processCreateParams(this._def),
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "transform", transform },
      });
    }
    default(def) {
      const defaultValueFunc = "function" == typeof def ? def : () => def;
      return new ZodDefault({
        ...processCreateParams(this._def),
        innerType: this,
        defaultValue: defaultValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
      });
    }
    brand() {
      return new ZodBranded({
        typeName: ZodFirstPartyTypeKind.ZodBranded,
        type: this,
        ...processCreateParams(this._def),
      });
    }
    catch(def) {
      const catchValueFunc = "function" == typeof def ? def : () => def;
      return new ZodCatch({
        ...processCreateParams(this._def),
        innerType: this,
        catchValue: catchValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
      });
    }
    describe(description) {
      return new (0, this.constructor)({ ...this._def, description });
    }
    pipe(target) {
      return ZodPipeline.create(this, target);
    }
    readonly() {
      return ZodReadonly.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  }
  const cuidRegex = /^c[^\s-]{8,}$/i,
    cuid2Regex = /^[0-9a-z]+$/,
    ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/,
    uuidRegex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
    nanoidRegex = /^[a-z0-9_-]{21}$/i,
    durationRegex =
      /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
    emailRegex =
      /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  let emojiRegex;
  const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    ipv6Regex =
      /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    base64Regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    dateRegexSource =
      "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",
    dateRegex = new RegExp(`^${dateRegexSource}$`);
  function timeRegexSource(args) {
    let regex = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
    return (
      args.precision
        ? (regex = `${regex}\\.\\d{${args.precision}}`)
        : null == args.precision && (regex = `${regex}(\\.\\d+)?`),
      regex
    );
  }
  function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    return (
      opts.push(args.local ? "Z?" : "Z"),
      args.offset && opts.push("([+-]\\d{2}:?\\d{2})"),
      (regex = `${regex}(${opts.join("|")})`),
      new RegExp(`^${regex}$`)
    );
  }
  class ZodString extends ZodType {
    _parse(input) {
      this._def.coerce && (input.data = String(input.data));
      if (this._getType(input) !== ZodParsedType.string) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      const status = new ParseStatus();
      let ctx;
      for (const check of this._def.checks)
        if ("min" === check.kind)
          input.data.length < check.value &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: !0,
              exact: !1,
              message: check.message,
            }),
            status.dirty());
        else if ("max" === check.kind)
          input.data.length > check.value &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: !0,
              exact: !1,
              message: check.message,
            }),
            status.dirty());
        else if ("length" === check.kind) {
          const tooBig = input.data.length > check.value,
            tooSmall = input.data.length < check.value;
          (tooBig || tooSmall) &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            tooBig
              ? addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: !0,
                  exact: !0,
                  message: check.message,
                })
              : tooSmall &&
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: !0,
                  exact: !0,
                  message: check.message,
                }),
            status.dirty());
        } else if ("email" === check.kind)
          emailRegex.test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              validation: "email",
              code: ZodIssueCode.invalid_string,
              message: check.message,
            }),
            status.dirty());
        else if ("emoji" === check.kind)
          emojiRegex ||
            (emojiRegex = new RegExp(
              "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
              "u"
            )),
            emojiRegex.test(input.data) ||
              ((ctx = this._getOrReturnCtx(input, ctx)),
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message,
              }),
              status.dirty());
        else if ("uuid" === check.kind)
          uuidRegex.test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              validation: "uuid",
              code: ZodIssueCode.invalid_string,
              message: check.message,
            }),
            status.dirty());
        else if ("nanoid" === check.kind)
          nanoidRegex.test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              validation: "nanoid",
              code: ZodIssueCode.invalid_string,
              message: check.message,
            }),
            status.dirty());
        else if ("cuid" === check.kind)
          cuidRegex.test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              validation: "cuid",
              code: ZodIssueCode.invalid_string,
              message: check.message,
            }),
            status.dirty());
        else if ("cuid2" === check.kind)
          cuid2Regex.test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              validation: "cuid2",
              code: ZodIssueCode.invalid_string,
              message: check.message,
            }),
            status.dirty());
        else if ("ulid" === check.kind)
          ulidRegex.test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              validation: "ulid",
              code: ZodIssueCode.invalid_string,
              message: check.message,
            }),
            status.dirty());
        else if ("url" === check.kind)
          try {
            new URL(input.data);
          } catch (_a) {
            (ctx = this._getOrReturnCtx(input, ctx)),
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message,
              }),
              status.dirty();
          }
        else if ("regex" === check.kind) {
          check.regex.lastIndex = 0;
          check.regex.test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              validation: "regex",
              code: ZodIssueCode.invalid_string,
              message: check.message,
            }),
            status.dirty());
        } else if ("trim" === check.kind) input.data = input.data.trim();
        else if ("includes" === check.kind)
          input.data.includes(check.value, check.position) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { includes: check.value, position: check.position },
              message: check.message,
            }),
            status.dirty());
        else if ("toLowerCase" === check.kind)
          input.data = input.data.toLowerCase();
        else if ("toUpperCase" === check.kind)
          input.data = input.data.toUpperCase();
        else if ("startsWith" === check.kind)
          input.data.startsWith(check.value) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { startsWith: check.value },
              message: check.message,
            }),
            status.dirty());
        else if ("endsWith" === check.kind)
          input.data.endsWith(check.value) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { endsWith: check.value },
              message: check.message,
            }),
            status.dirty());
        else if ("datetime" === check.kind) {
          datetimeRegex(check).test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "datetime",
              message: check.message,
            }),
            status.dirty());
        } else if ("date" === check.kind) {
          dateRegex.test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "date",
              message: check.message,
            }),
            status.dirty());
        } else if ("time" === check.kind) {
          new RegExp(`^${timeRegexSource(check)}$`).test(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "time",
              message: check.message,
            }),
            status.dirty());
        } else
          "duration" === check.kind
            ? durationRegex.test(input.data) ||
              ((ctx = this._getOrReturnCtx(input, ctx)),
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message,
              }),
              status.dirty())
            : "ip" === check.kind
            ? ((ip = input.data),
              (("v4" !== (version = check.version) && version) ||
                !ipv4Regex.test(ip)) &&
                (("v6" !== version && version) || !ipv6Regex.test(ip)) &&
                ((ctx = this._getOrReturnCtx(input, ctx)),
                addIssueToContext(ctx, {
                  validation: "ip",
                  code: ZodIssueCode.invalid_string,
                  message: check.message,
                }),
                status.dirty()))
            : "base64" === check.kind
            ? base64Regex.test(input.data) ||
              ((ctx = this._getOrReturnCtx(input, ctx)),
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message,
              }),
              status.dirty())
            : util.assertNever(check);
      var ip, version;
      return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
      return this.refinement((data) => regex.test(data), {
        validation,
        code: ZodIssueCode.invalid_string,
        ...errorUtil.errToObj(message),
      });
    }
    _addCheck(check) {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, check],
      });
    }
    email(message) {
      return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
      return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
      return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
      return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
      return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
      return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
      return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
      return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
      return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    ip(options) {
      return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
      var _a, _b;
      return "string" == typeof options
        ? this._addCheck({
            kind: "datetime",
            precision: null,
            offset: !1,
            local: !1,
            message: options,
          })
        : this._addCheck({
            kind: "datetime",
            precision:
              void 0 === (null == options ? void 0 : options.precision)
                ? null
                : null == options
                ? void 0
                : options.precision,
            offset:
              null !== (_a = null == options ? void 0 : options.offset) &&
              void 0 !== _a &&
              _a,
            local:
              null !== (_b = null == options ? void 0 : options.local) &&
              void 0 !== _b &&
              _b,
            ...errorUtil.errToObj(null == options ? void 0 : options.message),
          });
    }
    date(message) {
      return this._addCheck({ kind: "date", message });
    }
    time(options) {
      return "string" == typeof options
        ? this._addCheck({ kind: "time", precision: null, message: options })
        : this._addCheck({
            kind: "time",
            precision:
              void 0 === (null == options ? void 0 : options.precision)
                ? null
                : null == options
                ? void 0
                : options.precision,
            ...errorUtil.errToObj(null == options ? void 0 : options.message),
          });
    }
    duration(message) {
      return this._addCheck({
        kind: "duration",
        ...errorUtil.errToObj(message),
      });
    }
    regex(regex, message) {
      return this._addCheck({
        kind: "regex",
        regex,
        ...errorUtil.errToObj(message),
      });
    }
    includes(value, options) {
      return this._addCheck({
        kind: "includes",
        value,
        position: null == options ? void 0 : options.position,
        ...errorUtil.errToObj(null == options ? void 0 : options.message),
      });
    }
    startsWith(value, message) {
      return this._addCheck({
        kind: "startsWith",
        value,
        ...errorUtil.errToObj(message),
      });
    }
    endsWith(value, message) {
      return this._addCheck({
        kind: "endsWith",
        value,
        ...errorUtil.errToObj(message),
      });
    }
    min(minLength, message) {
      return this._addCheck({
        kind: "min",
        value: minLength,
        ...errorUtil.errToObj(message),
      });
    }
    max(maxLength, message) {
      return this._addCheck({
        kind: "max",
        value: maxLength,
        ...errorUtil.errToObj(message),
      });
    }
    length(len, message) {
      return this._addCheck({
        kind: "length",
        value: len,
        ...errorUtil.errToObj(message),
      });
    }
    nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }],
      });
    }
    toLowerCase() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }],
      });
    }
    toUpperCase() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }],
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((ch) => "datetime" === ch.kind);
    }
    get isDate() {
      return !!this._def.checks.find((ch) => "date" === ch.kind);
    }
    get isTime() {
      return !!this._def.checks.find((ch) => "time" === ch.kind);
    }
    get isDuration() {
      return !!this._def.checks.find((ch) => "duration" === ch.kind);
    }
    get isEmail() {
      return !!this._def.checks.find((ch) => "email" === ch.kind);
    }
    get isURL() {
      return !!this._def.checks.find((ch) => "url" === ch.kind);
    }
    get isEmoji() {
      return !!this._def.checks.find((ch) => "emoji" === ch.kind);
    }
    get isUUID() {
      return !!this._def.checks.find((ch) => "uuid" === ch.kind);
    }
    get isNANOID() {
      return !!this._def.checks.find((ch) => "nanoid" === ch.kind);
    }
    get isCUID() {
      return !!this._def.checks.find((ch) => "cuid" === ch.kind);
    }
    get isCUID2() {
      return !!this._def.checks.find((ch) => "cuid2" === ch.kind);
    }
    get isULID() {
      return !!this._def.checks.find((ch) => "ulid" === ch.kind);
    }
    get isIP() {
      return !!this._def.checks.find((ch) => "ip" === ch.kind);
    }
    get isBase64() {
      return !!this._def.checks.find((ch) => "base64" === ch.kind);
    }
    get minLength() {
      let min = null;
      for (const ch of this._def.checks)
        "min" === ch.kind &&
          (null === min || ch.value > min) &&
          (min = ch.value);
      return min;
    }
    get maxLength() {
      let max = null;
      for (const ch of this._def.checks)
        "max" === ch.kind &&
          (null === max || ch.value < max) &&
          (max = ch.value);
      return max;
    }
  }
  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length,
      stepDecCount = (step.toString().split(".")[1] || "").length,
      decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    return (
      (parseInt(val.toFixed(decCount).replace(".", "")) %
        parseInt(step.toFixed(decCount).replace(".", ""))) /
      Math.pow(10, decCount)
    );
  }
  ZodString.create = (params) => {
    var _a;
    return new ZodString({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodString,
      coerce:
        null !== (_a = null == params ? void 0 : params.coerce) &&
        void 0 !== _a &&
        _a,
      ...processCreateParams(params),
    });
  };
  class ZodNumber extends ZodType {
    constructor() {
      super(...arguments),
        (this.min = this.gte),
        (this.max = this.lte),
        (this.step = this.multipleOf);
    }
    _parse(input) {
      this._def.coerce && (input.data = Number(input.data));
      if (this._getType(input) !== ZodParsedType.number) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.number,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      let ctx;
      const status = new ParseStatus();
      for (const check of this._def.checks)
        if ("int" === check.kind)
          util.isInteger(input.data) ||
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: "integer",
              received: "float",
              message: check.message,
            }),
            status.dirty());
        else if ("min" === check.kind) {
          (check.inclusive
            ? input.data < check.value
            : input.data <= check.value) &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: !1,
              message: check.message,
            }),
            status.dirty());
        } else if ("max" === check.kind) {
          (check.inclusive
            ? input.data > check.value
            : input.data >= check.value) &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: !1,
              message: check.message,
            }),
            status.dirty());
        } else
          "multipleOf" === check.kind
            ? 0 !== floatSafeRemainder(input.data, check.value) &&
              ((ctx = this._getOrReturnCtx(input, ctx)),
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message,
              }),
              status.dirty())
            : "finite" === check.kind
            ? Number.isFinite(input.data) ||
              ((ctx = this._getOrReturnCtx(input, ctx)),
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message,
              }),
              status.dirty())
            : util.assertNever(check);
      return { status: status.value, value: input.data };
    }
    gte(value, message) {
      return this.setLimit("min", value, !0, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, !1, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, !0, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, !1, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodNumber({
        ...this._def,
        checks: [
          ...this._def.checks,
          { kind, value, inclusive, message: errorUtil.toString(message) },
        ],
      });
    }
    _addCheck(check) {
      return new ZodNumber({
        ...this._def,
        checks: [...this._def.checks, check],
      });
    }
    int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message),
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !1,
        message: errorUtil.toString(message),
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !1,
        message: errorUtil.toString(message),
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !0,
        message: errorUtil.toString(message),
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !0,
        message: errorUtil.toString(message),
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message),
      });
    }
    finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message),
      });
    }
    safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: !0,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message),
      })._addCheck({
        kind: "max",
        inclusive: !0,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message),
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks)
        "min" === ch.kind &&
          (null === min || ch.value > min) &&
          (min = ch.value);
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks)
        "max" === ch.kind &&
          (null === max || ch.value < max) &&
          (max = ch.value);
      return max;
    }
    get isInt() {
      return !!this._def.checks.find(
        (ch) =>
          "int" === ch.kind ||
          ("multipleOf" === ch.kind && util.isInteger(ch.value))
      );
    }
    get isFinite() {
      let max = null,
        min = null;
      for (const ch of this._def.checks) {
        if (
          "finite" === ch.kind ||
          "int" === ch.kind ||
          "multipleOf" === ch.kind
        )
          return !0;
        "min" === ch.kind
          ? (null === min || ch.value > min) && (min = ch.value)
          : "max" === ch.kind &&
            (null === max || ch.value < max) &&
            (max = ch.value);
      }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  }
  ZodNumber.create = (params) =>
    new ZodNumber({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodNumber,
      coerce: (null == params ? void 0 : params.coerce) || !1,
      ...processCreateParams(params),
    });
  class ZodBigInt extends ZodType {
    constructor() {
      super(...arguments), (this.min = this.gte), (this.max = this.lte);
    }
    _parse(input) {
      this._def.coerce && (input.data = BigInt(input.data));
      if (this._getType(input) !== ZodParsedType.bigint) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.bigint,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      let ctx;
      const status = new ParseStatus();
      for (const check of this._def.checks)
        if ("min" === check.kind) {
          (check.inclusive
            ? input.data < check.value
            : input.data <= check.value) &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              type: "bigint",
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message,
            }),
            status.dirty());
        } else if ("max" === check.kind) {
          (check.inclusive
            ? input.data > check.value
            : input.data >= check.value) &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              type: "bigint",
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message,
            }),
            status.dirty());
        } else
          "multipleOf" === check.kind
            ? input.data % check.value !== BigInt(0) &&
              ((ctx = this._getOrReturnCtx(input, ctx)),
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message,
              }),
              status.dirty())
            : util.assertNever(check);
      return { status: status.value, value: input.data };
    }
    gte(value, message) {
      return this.setLimit("min", value, !0, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, !1, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, !0, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, !1, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodBigInt({
        ...this._def,
        checks: [
          ...this._def.checks,
          { kind, value, inclusive, message: errorUtil.toString(message) },
        ],
      });
    }
    _addCheck(check) {
      return new ZodBigInt({
        ...this._def,
        checks: [...this._def.checks, check],
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !1,
        message: errorUtil.toString(message),
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !1,
        message: errorUtil.toString(message),
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !0,
        message: errorUtil.toString(message),
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !0,
        message: errorUtil.toString(message),
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message),
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks)
        "min" === ch.kind &&
          (null === min || ch.value > min) &&
          (min = ch.value);
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks)
        "max" === ch.kind &&
          (null === max || ch.value < max) &&
          (max = ch.value);
      return max;
    }
  }
  ZodBigInt.create = (params) => {
    var _a;
    return new ZodBigInt({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodBigInt,
      coerce:
        null !== (_a = null == params ? void 0 : params.coerce) &&
        void 0 !== _a &&
        _a,
      ...processCreateParams(params),
    });
  };
  class ZodBoolean extends ZodType {
    _parse(input) {
      this._def.coerce && (input.data = Boolean(input.data));
      if (this._getType(input) !== ZodParsedType.boolean) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.boolean,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      return OK(input.data);
    }
  }
  ZodBoolean.create = (params) =>
    new ZodBoolean({
      typeName: ZodFirstPartyTypeKind.ZodBoolean,
      coerce: (null == params ? void 0 : params.coerce) || !1,
      ...processCreateParams(params),
    });
  class ZodDate extends ZodType {
    _parse(input) {
      this._def.coerce && (input.data = new Date(input.data));
      if (this._getType(input) !== ZodParsedType.date) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.date,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      if (isNaN(input.data.getTime())) {
        return (
          addIssueToContext(this._getOrReturnCtx(input), {
            code: ZodIssueCode.invalid_date,
          }),
          INVALID
        );
      }
      const status = new ParseStatus();
      let ctx;
      for (const check of this._def.checks)
        "min" === check.kind
          ? input.data.getTime() < check.value &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              message: check.message,
              inclusive: !0,
              exact: !1,
              minimum: check.value,
              type: "date",
            }),
            status.dirty())
          : "max" === check.kind
          ? input.data.getTime() > check.value &&
            ((ctx = this._getOrReturnCtx(input, ctx)),
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              message: check.message,
              inclusive: !0,
              exact: !1,
              maximum: check.value,
              type: "date",
            }),
            status.dirty())
          : util.assertNever(check);
      return { status: status.value, value: new Date(input.data.getTime()) };
    }
    _addCheck(check) {
      return new ZodDate({
        ...this._def,
        checks: [...this._def.checks, check],
      });
    }
    min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message),
      });
    }
    max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message),
      });
    }
    get minDate() {
      let min = null;
      for (const ch of this._def.checks)
        "min" === ch.kind &&
          (null === min || ch.value > min) &&
          (min = ch.value);
      return null != min ? new Date(min) : null;
    }
    get maxDate() {
      let max = null;
      for (const ch of this._def.checks)
        "max" === ch.kind &&
          (null === max || ch.value < max) &&
          (max = ch.value);
      return null != max ? new Date(max) : null;
    }
  }
  ZodDate.create = (params) =>
    new ZodDate({
      checks: [],
      coerce: (null == params ? void 0 : params.coerce) || !1,
      typeName: ZodFirstPartyTypeKind.ZodDate,
      ...processCreateParams(params),
    });
  class ZodSymbol extends ZodType {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.symbol) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.symbol,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      return OK(input.data);
    }
  }
  ZodSymbol.create = (params) =>
    new ZodSymbol({
      typeName: ZodFirstPartyTypeKind.ZodSymbol,
      ...processCreateParams(params),
    });
  class ZodUndefined extends ZodType {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.undefined,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      return OK(input.data);
    }
  }
  ZodUndefined.create = (params) =>
    new ZodUndefined({
      typeName: ZodFirstPartyTypeKind.ZodUndefined,
      ...processCreateParams(params),
    });
  class ZodNull extends ZodType {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.null) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.null,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      return OK(input.data);
    }
  }
  ZodNull.create = (params) =>
    new ZodNull({
      typeName: ZodFirstPartyTypeKind.ZodNull,
      ...processCreateParams(params),
    });
  class ZodAny extends ZodType {
    constructor() {
      super(...arguments), (this._any = !0);
    }
    _parse(input) {
      return OK(input.data);
    }
  }
  ZodAny.create = (params) =>
    new ZodAny({
      typeName: ZodFirstPartyTypeKind.ZodAny,
      ...processCreateParams(params),
    });
  class ZodUnknown extends ZodType {
    constructor() {
      super(...arguments), (this._unknown = !0);
    }
    _parse(input) {
      return OK(input.data);
    }
  }
  ZodUnknown.create = (params) =>
    new ZodUnknown({
      typeName: ZodFirstPartyTypeKind.ZodUnknown,
      ...processCreateParams(params),
    });
  class ZodNever extends ZodType {
    _parse(input) {
      const ctx = this._getOrReturnCtx(input);
      return (
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.never,
          received: ctx.parsedType,
        }),
        INVALID
      );
    }
  }
  ZodNever.create = (params) =>
    new ZodNever({
      typeName: ZodFirstPartyTypeKind.ZodNever,
      ...processCreateParams(params),
    });
  class ZodVoid extends ZodType {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.void,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      return OK(input.data);
    }
  }
  ZodVoid.create = (params) =>
    new ZodVoid({
      typeName: ZodFirstPartyTypeKind.ZodVoid,
      ...processCreateParams(params),
    });
  class ZodArray extends ZodType {
    _parse(input) {
      const { ctx, status } = this._processInputParams(input),
        def = this._def;
      if (ctx.parsedType !== ZodParsedType.array)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType,
          }),
          INVALID
        );
      if (null !== def.exactLength) {
        const tooBig = ctx.data.length > def.exactLength.value,
          tooSmall = ctx.data.length < def.exactLength.value;
        (tooBig || tooSmall) &&
          (addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
            minimum: tooSmall ? def.exactLength.value : void 0,
            maximum: tooBig ? def.exactLength.value : void 0,
            type: "array",
            inclusive: !0,
            exact: !0,
            message: def.exactLength.message,
          }),
          status.dirty());
      }
      if (
        (null !== def.minLength &&
          ctx.data.length < def.minLength.value &&
          (addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: !0,
            exact: !1,
            message: def.minLength.message,
          }),
          status.dirty()),
        null !== def.maxLength &&
          ctx.data.length > def.maxLength.value &&
          (addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: !0,
            exact: !1,
            message: def.maxLength.message,
          }),
          status.dirty()),
        ctx.common.async)
      )
        return Promise.all(
          [...ctx.data].map((item, i) =>
            def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i))
          )
        ).then((result) => ParseStatus.mergeArray(status, result));
      const result = [...ctx.data].map((item, i) =>
        def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i))
      );
      return ParseStatus.mergeArray(status, result);
    }
    get element() {
      return this._def.type;
    }
    min(minLength, message) {
      return new ZodArray({
        ...this._def,
        minLength: { value: minLength, message: errorUtil.toString(message) },
      });
    }
    max(maxLength, message) {
      return new ZodArray({
        ...this._def,
        maxLength: { value: maxLength, message: errorUtil.toString(message) },
      });
    }
    length(len, message) {
      return new ZodArray({
        ...this._def,
        exactLength: { value: len, message: errorUtil.toString(message) },
      });
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }
  function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
      const newShape = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
      }
      return new ZodObject({ ...schema._def, shape: () => newShape });
    }
    return schema instanceof ZodArray
      ? new ZodArray({ ...schema._def, type: deepPartialify(schema.element) })
      : schema instanceof ZodOptional
      ? ZodOptional.create(deepPartialify(schema.unwrap()))
      : schema instanceof ZodNullable
      ? ZodNullable.create(deepPartialify(schema.unwrap()))
      : schema instanceof ZodTuple
      ? ZodTuple.create(schema.items.map((item) => deepPartialify(item)))
      : schema;
  }
  ZodArray.create = (schema, params) =>
    new ZodArray({
      type: schema,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: ZodFirstPartyTypeKind.ZodArray,
      ...processCreateParams(params),
    });
  class ZodObject extends ZodType {
    constructor() {
      super(...arguments),
        (this._cached = null),
        (this.nonstrict = this.passthrough),
        (this.augment = this.extend);
    }
    _getCached() {
      if (null !== this._cached) return this._cached;
      const shape = this._def.shape(),
        keys = util.objectKeys(shape);
      return (this._cached = { shape, keys });
    }
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.object) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      const { status, ctx } = this._processInputParams(input),
        { shape, keys: shapeKeys } = this._getCached(),
        extraKeys = [];
      if (
        !(
          this._def.catchall instanceof ZodNever &&
          "strip" === this._def.unknownKeys
        )
      )
        for (const key in ctx.data)
          shapeKeys.includes(key) || extraKeys.push(key);
      const pairs = [];
      for (const key of shapeKeys) {
        const keyValidator = shape[key],
          value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: keyValidator._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
          ),
          alwaysSet: key in ctx.data,
        });
      }
      if (this._def.catchall instanceof ZodNever) {
        const unknownKeys = this._def.unknownKeys;
        if ("passthrough" === unknownKeys)
          for (const key of extraKeys)
            pairs.push({
              key: { status: "valid", value: key },
              value: { status: "valid", value: ctx.data[key] },
            });
        else if ("strict" === unknownKeys)
          extraKeys.length > 0 &&
            (addIssueToContext(ctx, {
              code: ZodIssueCode.unrecognized_keys,
              keys: extraKeys,
            }),
            status.dirty());
        else if ("strip" !== unknownKeys)
          throw new Error(
            "Internal ZodObject error: invalid unknownKeys value."
          );
      } else {
        const catchall = this._def.catchall;
        for (const key of extraKeys) {
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: catchall._parse(
              new ParseInputLazyPath(ctx, value, ctx.path, key)
            ),
            alwaysSet: key in ctx.data,
          });
        }
      }
      return ctx.common.async
        ? Promise.resolve()
            .then(async () => {
              const syncPairs = [];
              for (const pair of pairs) {
                const key = await pair.key,
                  value = await pair.value;
                syncPairs.push({ key, value, alwaysSet: pair.alwaysSet });
              }
              return syncPairs;
            })
            .then((syncPairs) => ParseStatus.mergeObjectSync(status, syncPairs))
        : ParseStatus.mergeObjectSync(status, pairs);
    }
    get shape() {
      return this._def.shape();
    }
    strict(message) {
      return (
        errorUtil.errToObj,
        new ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...(void 0 !== message
            ? {
                errorMap: (issue, ctx) => {
                  var _a, _b, _c, _d;
                  const defaultError =
                    null !==
                      (_c =
                        null === (_b = (_a = this._def).errorMap) ||
                        void 0 === _b
                          ? void 0
                          : _b.call(_a, issue, ctx).message) && void 0 !== _c
                      ? _c
                      : ctx.defaultError;
                  return "unrecognized_keys" === issue.code
                    ? {
                        message:
                          null !== (_d = errorUtil.errToObj(message).message) &&
                          void 0 !== _d
                            ? _d
                            : defaultError,
                      }
                    : { message: defaultError };
                },
              }
            : {}),
        })
      );
    }
    strip() {
      return new ZodObject({ ...this._def, unknownKeys: "strip" });
    }
    passthrough() {
      return new ZodObject({ ...this._def, unknownKeys: "passthrough" });
    }
    extend(augmentation) {
      return new ZodObject({
        ...this._def,
        shape: () => ({ ...this._def.shape(), ...augmentation }),
      });
    }
    merge(merging) {
      return new ZodObject({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: () => ({ ...this._def.shape(), ...merging._def.shape() }),
        typeName: ZodFirstPartyTypeKind.ZodObject,
      });
    }
    setKey(key, schema) {
      return this.augment({ [key]: schema });
    }
    catchall(index) {
      return new ZodObject({ ...this._def, catchall: index });
    }
    pick(mask) {
      const shape = {};
      return (
        util.objectKeys(mask).forEach((key) => {
          mask[key] && this.shape[key] && (shape[key] = this.shape[key]);
        }),
        new ZodObject({ ...this._def, shape: () => shape })
      );
    }
    omit(mask) {
      const shape = {};
      return (
        util.objectKeys(this.shape).forEach((key) => {
          mask[key] || (shape[key] = this.shape[key]);
        }),
        new ZodObject({ ...this._def, shape: () => shape })
      );
    }
    deepPartial() {
      return deepPartialify(this);
    }
    partial(mask) {
      const newShape = {};
      return (
        util.objectKeys(this.shape).forEach((key) => {
          const fieldSchema = this.shape[key];
          mask && !mask[key]
            ? (newShape[key] = fieldSchema)
            : (newShape[key] = fieldSchema.optional());
        }),
        new ZodObject({ ...this._def, shape: () => newShape })
      );
    }
    required(mask) {
      const newShape = {};
      return (
        util.objectKeys(this.shape).forEach((key) => {
          if (mask && !mask[key]) newShape[key] = this.shape[key];
          else {
            let newField = this.shape[key];
            for (; newField instanceof ZodOptional; )
              newField = newField._def.innerType;
            newShape[key] = newField;
          }
        }),
        new ZodObject({ ...this._def, shape: () => newShape })
      );
    }
    keyof() {
      return createZodEnum(util.objectKeys(this.shape));
    }
  }
  (ZodObject.create = (shape, params) =>
    new ZodObject({
      shape: () => shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params),
    })),
    (ZodObject.strictCreate = (shape, params) =>
      new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
      })),
    (ZodObject.lazycreate = (shape, params) =>
      new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
      }));
  class ZodUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input),
        options = this._def.options;
      if (ctx.common.async)
        return Promise.all(
          options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: { ...ctx.common, issues: [] },
              parent: null,
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx,
              }),
              ctx: childCtx,
            };
          })
        ).then(function (results) {
          for (const result of results)
            if ("valid" === result.result.status) return result.result;
          for (const result of results)
            if ("dirty" === result.result.status)
              return (
                ctx.common.issues.push(...result.ctx.common.issues),
                result.result
              );
          const unionErrors = results.map(
            (result) => new ZodError(result.ctx.common.issues)
          );
          return (
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_union,
              unionErrors,
            }),
            INVALID
          );
        });
      {
        let dirty;
        const issues = [];
        for (const option of options) {
          const childCtx = {
              ...ctx,
              common: { ...ctx.common, issues: [] },
              parent: null,
            },
            result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx,
            });
          if ("valid" === result.status) return result;
          "dirty" !== result.status ||
            dirty ||
            (dirty = { result, ctx: childCtx }),
            childCtx.common.issues.length &&
              issues.push(childCtx.common.issues);
        }
        if (dirty)
          return (
            ctx.common.issues.push(...dirty.ctx.common.issues), dirty.result
          );
        const unionErrors = issues.map((issues) => new ZodError(issues));
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors,
          }),
          INVALID
        );
      }
    }
    get options() {
      return this._def.options;
    }
  }
  ZodUnion.create = (types, params) =>
    new ZodUnion({
      options: types,
      typeName: ZodFirstPartyTypeKind.ZodUnion,
      ...processCreateParams(params),
    });
  const getDiscriminator = (type) =>
    type instanceof ZodLazy
      ? getDiscriminator(type.schema)
      : type instanceof ZodEffects
      ? getDiscriminator(type.innerType())
      : type instanceof ZodLiteral
      ? [type.value]
      : type instanceof ZodEnum
      ? type.options
      : type instanceof ZodNativeEnum
      ? util.objectValues(type.enum)
      : type instanceof ZodDefault
      ? getDiscriminator(type._def.innerType)
      : type instanceof ZodUndefined
      ? [void 0]
      : type instanceof ZodNull
      ? [null]
      : type instanceof ZodOptional
      ? [void 0, ...getDiscriminator(type.unwrap())]
      : type instanceof ZodNullable
      ? [null, ...getDiscriminator(type.unwrap())]
      : type instanceof ZodBranded || type instanceof ZodReadonly
      ? getDiscriminator(type.unwrap())
      : type instanceof ZodCatch
      ? getDiscriminator(type._def.innerType)
      : [];
  class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType,
          }),
          INVALID
        );
      const discriminator = this.discriminator,
        discriminatorValue = ctx.data[discriminator],
        option = this.optionsMap.get(discriminatorValue);
      return option
        ? ctx.common.async
          ? option._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          : option._parseSync({ data: ctx.data, path: ctx.path, parent: ctx })
        : (addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator],
          }),
          INVALID);
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    static create(discriminator, options, params) {
      const optionsMap = new Map();
      for (const type of options) {
        const discriminatorValues = getDiscriminator(type.shape[discriminator]);
        if (!discriminatorValues.length)
          throw new Error(
            `A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`
          );
        for (const value of discriminatorValues) {
          if (optionsMap.has(value))
            throw new Error(
              `Discriminator property ${String(
                discriminator
              )} has duplicate value ${String(value)}`
            );
          optionsMap.set(value, type);
        }
      }
      return new ZodDiscriminatedUnion({
        typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
        discriminator,
        options,
        optionsMap,
        ...processCreateParams(params),
      });
    }
  }
  function mergeValues(a, b) {
    const aType = getParsedType(a),
      bType = getParsedType(b);
    if (a === b) return { valid: !0, data: a };
    if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
      const bKeys = util.objectKeys(b),
        sharedKeys = util
          .objectKeys(a)
          .filter((key) => -1 !== bKeys.indexOf(key)),
        newObj = { ...a, ...b };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) return { valid: !1 };
        newObj[key] = sharedValue.data;
      }
      return { valid: !0, data: newObj };
    }
    if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
      if (a.length !== b.length) return { valid: !1 };
      const newArray = [];
      for (let index = 0; index < a.length; index++) {
        const sharedValue = mergeValues(a[index], b[index]);
        if (!sharedValue.valid) return { valid: !1 };
        newArray.push(sharedValue.data);
      }
      return { valid: !0, data: newArray };
    }
    return aType === ZodParsedType.date &&
      bType === ZodParsedType.date &&
      +a == +b
      ? { valid: !0, data: a }
      : { valid: !1 };
  }
  class ZodIntersection extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input),
        handleParsed = (parsedLeft, parsedRight) => {
          if (isAborted(parsedLeft) || isAborted(parsedRight)) return INVALID;
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          return merged.valid
            ? ((isDirty(parsedLeft) || isDirty(parsedRight)) && status.dirty(),
              { status: status.value, value: merged.data })
            : (addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_intersection_types,
              }),
              INVALID);
        };
      return ctx.common.async
        ? Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx,
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx,
            }),
          ]).then(([left, right]) => handleParsed(left, right))
        : handleParsed(
            this._def.left._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx,
            }),
            this._def.right._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx,
            })
          );
    }
  }
  ZodIntersection.create = (left, right, params) =>
    new ZodIntersection({
      left,
      right,
      typeName: ZodFirstPartyTypeKind.ZodIntersection,
      ...processCreateParams(params),
    });
  class ZodTuple extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.array)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType,
          }),
          INVALID
        );
      if (ctx.data.length < this._def.items.length)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: !0,
            exact: !1,
            type: "array",
          }),
          INVALID
        );
      !this._def.rest &&
        ctx.data.length > this._def.items.length &&
        (addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array",
        }),
        status.dirty());
      const items = [...ctx.data]
        .map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          return schema
            ? schema._parse(
                new ParseInputLazyPath(ctx, item, ctx.path, itemIndex)
              )
            : null;
        })
        .filter((x) => !!x);
      return ctx.common.async
        ? Promise.all(items).then((results) =>
            ParseStatus.mergeArray(status, results)
          )
        : ParseStatus.mergeArray(status, items);
    }
    get items() {
      return this._def.items;
    }
    rest(rest) {
      return new ZodTuple({ ...this._def, rest });
    }
  }
  ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas))
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new ZodTuple({
      items: schemas,
      typeName: ZodFirstPartyTypeKind.ZodTuple,
      rest: null,
      ...processCreateParams(params),
    });
  };
  class ZodRecord extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType,
          }),
          INVALID
        );
      const pairs = [],
        keyType = this._def.keyType,
        valueType = this._def.valueType;
      for (const key in ctx.data)
        pairs.push({
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
          value: valueType._parse(
            new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)
          ),
          alwaysSet: key in ctx.data,
        });
      return ctx.common.async
        ? ParseStatus.mergeObjectAsync(status, pairs)
        : ParseStatus.mergeObjectSync(status, pairs);
    }
    get element() {
      return this._def.valueType;
    }
    static create(first, second, third) {
      return new ZodRecord(
        second instanceof ZodType
          ? {
              keyType: first,
              valueType: second,
              typeName: ZodFirstPartyTypeKind.ZodRecord,
              ...processCreateParams(third),
            }
          : {
              keyType: ZodString.create(),
              valueType: first,
              typeName: ZodFirstPartyTypeKind.ZodRecord,
              ...processCreateParams(second),
            }
      );
    }
  }
  class ZodMap extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.map)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.map,
            received: ctx.parsedType,
          }),
          INVALID
        );
      const keyType = this._def.keyType,
        valueType = this._def.valueType,
        pairs = [...ctx.data.entries()].map(([key, value], index) => ({
          key: keyType._parse(
            new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])
          ),
          value: valueType._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])
          ),
        }));
      if (ctx.common.async) {
        const finalMap = new Map();
        return Promise.resolve().then(async () => {
          for (const pair of pairs) {
            const key = await pair.key,
              value = await pair.value;
            if ("aborted" === key.status || "aborted" === value.status)
              return INVALID;
            ("dirty" !== key.status && "dirty" !== value.status) ||
              status.dirty(),
              finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        });
      }
      {
        const finalMap = new Map();
        for (const pair of pairs) {
          const key = pair.key,
            value = pair.value;
          if ("aborted" === key.status || "aborted" === value.status)
            return INVALID;
          ("dirty" !== key.status && "dirty" !== value.status) ||
            status.dirty(),
            finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      }
    }
  }
  ZodMap.create = (keyType, valueType, params) =>
    new ZodMap({
      valueType,
      keyType,
      typeName: ZodFirstPartyTypeKind.ZodMap,
      ...processCreateParams(params),
    });
  class ZodSet extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.set)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.set,
            received: ctx.parsedType,
          }),
          INVALID
        );
      const def = this._def;
      null !== def.minSize &&
        ctx.data.size < def.minSize.value &&
        (addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: def.minSize.message,
        }),
        status.dirty()),
        null !== def.maxSize &&
          ctx.data.size > def.maxSize.value &&
          (addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: !0,
            exact: !1,
            message: def.maxSize.message,
          }),
          status.dirty());
      const valueType = this._def.valueType;
      function finalizeSet(elements) {
        const parsedSet = new Set();
        for (const element of elements) {
          if ("aborted" === element.status) return INVALID;
          "dirty" === element.status && status.dirty(),
            parsedSet.add(element.value);
        }
        return { status: status.value, value: parsedSet };
      }
      const elements = [...ctx.data.values()].map((item, i) =>
        valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i))
      );
      return ctx.common.async
        ? Promise.all(elements).then((elements) => finalizeSet(elements))
        : finalizeSet(elements);
    }
    min(minSize, message) {
      return new ZodSet({
        ...this._def,
        minSize: { value: minSize, message: errorUtil.toString(message) },
      });
    }
    max(maxSize, message) {
      return new ZodSet({
        ...this._def,
        maxSize: { value: maxSize, message: errorUtil.toString(message) },
      });
    }
    size(size, message) {
      return this.min(size, message).max(size, message);
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }
  ZodSet.create = (valueType, params) =>
    new ZodSet({
      valueType,
      minSize: null,
      maxSize: null,
      typeName: ZodFirstPartyTypeKind.ZodSet,
      ...processCreateParams(params),
    });
  class ZodFunction extends ZodType {
    constructor() {
      super(...arguments), (this.validate = this.implement);
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.function)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.function,
            received: ctx.parsedType,
          }),
          INVALID
        );
      function makeArgsIssue(args, error) {
        return makeIssue({
          data: args,
          path: ctx.path,
          errorMaps: [
            ctx.common.contextualErrorMap,
            ctx.schemaErrorMap,
            getErrorMap(),
            errorMap,
          ].filter((x) => !!x),
          issueData: {
            code: ZodIssueCode.invalid_arguments,
            argumentsError: error,
          },
        });
      }
      function makeReturnsIssue(returns, error) {
        return makeIssue({
          data: returns,
          path: ctx.path,
          errorMaps: [
            ctx.common.contextualErrorMap,
            ctx.schemaErrorMap,
            getErrorMap(),
            errorMap,
          ].filter((x) => !!x),
          issueData: {
            code: ZodIssueCode.invalid_return_type,
            returnTypeError: error,
          },
        });
      }
      const params = { errorMap: ctx.common.contextualErrorMap },
        fn = ctx.data;
      if (this._def.returns instanceof ZodPromise) {
        const me = this;
        return OK(async function (...args) {
          const error = new ZodError([]),
            parsedArgs = await me._def.args
              .parseAsync(args, params)
              .catch((e) => {
                throw (error.addIssue(makeArgsIssue(args, e)), error);
              }),
            result = await Reflect.apply(fn, this, parsedArgs);
          return await me._def.returns._def.type
            .parseAsync(result, params)
            .catch((e) => {
              throw (error.addIssue(makeReturnsIssue(result, e)), error);
            });
        });
      }
      {
        const me = this;
        return OK(function (...args) {
          const parsedArgs = me._def.args.safeParse(args, params);
          if (!parsedArgs.success)
            throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
          const result = Reflect.apply(fn, this, parsedArgs.data),
            parsedReturns = me._def.returns.safeParse(result, params);
          if (!parsedReturns.success)
            throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
          return parsedReturns.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...items) {
      return new ZodFunction({
        ...this._def,
        args: ZodTuple.create(items).rest(ZodUnknown.create()),
      });
    }
    returns(returnType) {
      return new ZodFunction({ ...this._def, returns: returnType });
    }
    implement(func) {
      return this.parse(func);
    }
    strictImplement(func) {
      return this.parse(func);
    }
    static create(args, returns, params) {
      return new ZodFunction({
        args: args || ZodTuple.create([]).rest(ZodUnknown.create()),
        returns: returns || ZodUnknown.create(),
        typeName: ZodFirstPartyTypeKind.ZodFunction,
        ...processCreateParams(params),
      });
    }
  }
  class ZodLazy extends ZodType {
    get schema() {
      return this._def.getter();
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      return this._def
        .getter()
        ._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
  }
  ZodLazy.create = (getter, params) =>
    new ZodLazy({
      getter,
      typeName: ZodFirstPartyTypeKind.ZodLazy,
      ...processCreateParams(params),
    });
  class ZodLiteral extends ZodType {
    _parse(input) {
      if (input.data !== this._def.value) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_literal,
            expected: this._def.value,
          }),
          INVALID
        );
      }
      return { status: "valid", value: input.data };
    }
    get value() {
      return this._def.value;
    }
  }
  function createZodEnum(values, params) {
    return new ZodEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodEnum,
      ...processCreateParams(params),
    });
  }
  ZodLiteral.create = (value, params) =>
    new ZodLiteral({
      value,
      typeName: ZodFirstPartyTypeKind.ZodLiteral,
      ...processCreateParams(params),
    });
  class ZodEnum extends ZodType {
    constructor() {
      super(...arguments), _ZodEnum_cache.set(this, void 0);
    }
    _parse(input) {
      if ("string" != typeof input.data) {
        const ctx = this._getOrReturnCtx(input),
          expectedValues = this._def.values;
        return (
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type,
          }),
          INVALID
        );
      }
      if (
        (__classPrivateFieldGet(this, _ZodEnum_cache, "f") ||
          __classPrivateFieldSet(
            this,
            _ZodEnum_cache,
            new Set(this._def.values),
            "f"
          ),
        !__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data))
      ) {
        const ctx = this._getOrReturnCtx(input),
          expectedValues = this._def.values;
        return (
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues,
          }),
          INVALID
        );
      }
      return OK(input.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      const enumValues = {};
      for (const val of this._def.values) enumValues[val] = val;
      return enumValues;
    }
    get Values() {
      const enumValues = {};
      for (const val of this._def.values) enumValues[val] = val;
      return enumValues;
    }
    get Enum() {
      const enumValues = {};
      for (const val of this._def.values) enumValues[val] = val;
      return enumValues;
    }
    extract(values, newDef = this._def) {
      return ZodEnum.create(values, { ...this._def, ...newDef });
    }
    exclude(values, newDef = this._def) {
      return ZodEnum.create(
        this.options.filter((opt) => !values.includes(opt)),
        { ...this._def, ...newDef }
      );
    }
  }
  (_ZodEnum_cache = new WeakMap()), (ZodEnum.create = createZodEnum);
  class ZodNativeEnum extends ZodType {
    constructor() {
      super(...arguments), _ZodNativeEnum_cache.set(this, void 0);
    }
    _parse(input) {
      const nativeEnumValues = util.getValidEnumValues(this._def.values),
        ctx = this._getOrReturnCtx(input);
      if (
        ctx.parsedType !== ZodParsedType.string &&
        ctx.parsedType !== ZodParsedType.number
      ) {
        const expectedValues = util.objectValues(nativeEnumValues);
        return (
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type,
          }),
          INVALID
        );
      }
      if (
        (__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f") ||
          __classPrivateFieldSet(
            this,
            _ZodNativeEnum_cache,
            new Set(util.getValidEnumValues(this._def.values)),
            "f"
          ),
        !__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(
          input.data
        ))
      ) {
        const expectedValues = util.objectValues(nativeEnumValues);
        return (
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues,
          }),
          INVALID
        );
      }
      return OK(input.data);
    }
    get enum() {
      return this._def.values;
    }
  }
  (_ZodNativeEnum_cache = new WeakMap()),
    (ZodNativeEnum.create = (values, params) =>
      new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params),
      }));
  class ZodPromise extends ZodType {
    unwrap() {
      return this._def.type;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.promise && !1 === ctx.common.async)
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.promise,
            received: ctx.parsedType,
          }),
          INVALID
        );
      const promisified =
        ctx.parsedType === ZodParsedType.promise
          ? ctx.data
          : Promise.resolve(ctx.data);
      return OK(
        promisified.then((data) =>
          this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap,
          })
        )
      );
    }
  }
  ZodPromise.create = (schema, params) =>
    new ZodPromise({
      type: schema,
      typeName: ZodFirstPartyTypeKind.ZodPromise,
      ...processCreateParams(params),
    });
  class ZodEffects extends ZodType {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
        ? this._def.schema.sourceType()
        : this._def.schema;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input),
        effect = this._def.effect || null,
        checkCtx = {
          addIssue: (arg) => {
            addIssueToContext(ctx, arg),
              arg.fatal ? status.abort() : status.dirty();
          },
          get path() {
            return ctx.path;
          },
        };
      if (
        ((checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx)),
        "preprocess" === effect.type)
      ) {
        const processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async)
          return Promise.resolve(processed).then(async (processed) => {
            if ("aborted" === status.value) return INVALID;
            const result = await this._def.schema._parseAsync({
              data: processed,
              path: ctx.path,
              parent: ctx,
            });
            return "aborted" === result.status
              ? INVALID
              : "dirty" === result.status || "dirty" === status.value
              ? DIRTY(result.value)
              : result;
          });
        {
          if ("aborted" === status.value) return INVALID;
          const result = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx,
          });
          return "aborted" === result.status
            ? INVALID
            : "dirty" === result.status || "dirty" === status.value
            ? DIRTY(result.value)
            : result;
        }
      }
      if ("refinement" === effect.type) {
        const executeRefinement = (acc) => {
          const result = effect.refinement(acc, checkCtx);
          if (ctx.common.async) return Promise.resolve(result);
          if (result instanceof Promise)
            throw new Error(
              "Async refinement encountered during synchronous parse operation. Use .parseAsync instead."
            );
          return acc;
        };
        if (!1 === ctx.common.async) {
          const inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx,
          });
          return "aborted" === inner.status
            ? INVALID
            : ("dirty" === inner.status && status.dirty(),
              executeRefinement(inner.value),
              { status: status.value, value: inner.value });
        }
        return this._def.schema
          ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          .then((inner) =>
            "aborted" === inner.status
              ? INVALID
              : ("dirty" === inner.status && status.dirty(),
                executeRefinement(inner.value).then(() => ({
                  status: status.value,
                  value: inner.value,
                })))
          );
      }
      if ("transform" === effect.type) {
        if (!1 === ctx.common.async) {
          const base = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx,
          });
          if (!isValid(base)) return base;
          const result = effect.transform(base.value, checkCtx);
          if (result instanceof Promise)
            throw new Error(
              "Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead."
            );
          return { status: status.value, value: result };
        }
        return this._def.schema
          ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          .then((base) =>
            isValid(base)
              ? Promise.resolve(effect.transform(base.value, checkCtx)).then(
                  (result) => ({ status: status.value, value: result })
                )
              : base
          );
      }
      util.assertNever(effect);
    }
  }
  (ZodEffects.create = (schema, effect, params) =>
    new ZodEffects({
      schema,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect,
      ...processCreateParams(params),
    })),
    (ZodEffects.createWithPreprocess = (preprocess, schema, params) =>
      new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params),
      }));
  class ZodOptional extends ZodType {
    _parse(input) {
      return this._getType(input) === ZodParsedType.undefined
        ? OK(void 0)
        : this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodOptional.create = (type, params) =>
    new ZodOptional({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodOptional,
      ...processCreateParams(params),
    });
  class ZodNullable extends ZodType {
    _parse(input) {
      return this._getType(input) === ZodParsedType.null
        ? OK(null)
        : this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodNullable.create = (type, params) =>
    new ZodNullable({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodNullable,
      ...processCreateParams(params),
    });
  class ZodDefault extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      let data = ctx.data;
      return (
        ctx.parsedType === ZodParsedType.undefined &&
          (data = this._def.defaultValue()),
        this._def.innerType._parse({ data, path: ctx.path, parent: ctx })
      );
    }
    removeDefault() {
      return this._def.innerType;
    }
  }
  ZodDefault.create = (type, params) =>
    new ZodDefault({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
      defaultValue:
        "function" == typeof params.default
          ? params.default
          : () => params.default,
      ...processCreateParams(params),
    });
  class ZodCatch extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input),
        newCtx = { ...ctx, common: { ...ctx.common, issues: [] } },
        result = this._def.innerType._parse({
          data: newCtx.data,
          path: newCtx.path,
          parent: { ...newCtx },
        });
      return isAsync(result)
        ? result.then((result) => ({
            status: "valid",
            value:
              "valid" === result.status
                ? result.value
                : this._def.catchValue({
                    get error() {
                      return new ZodError(newCtx.common.issues);
                    },
                    input: newCtx.data,
                  }),
          }))
        : {
            status: "valid",
            value:
              "valid" === result.status
                ? result.value
                : this._def.catchValue({
                    get error() {
                      return new ZodError(newCtx.common.issues);
                    },
                    input: newCtx.data,
                  }),
          };
    }
    removeCatch() {
      return this._def.innerType;
    }
  }
  ZodCatch.create = (type, params) =>
    new ZodCatch({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
      catchValue:
        "function" == typeof params.catch ? params.catch : () => params.catch,
      ...processCreateParams(params),
    });
  class ZodNaN extends ZodType {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.nan) {
        const ctx = this._getOrReturnCtx(input);
        return (
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.nan,
            received: ctx.parsedType,
          }),
          INVALID
        );
      }
      return { status: "valid", value: input.data };
    }
  }
  ZodNaN.create = (params) =>
    new ZodNaN({
      typeName: ZodFirstPartyTypeKind.ZodNaN,
      ...processCreateParams(params),
    });
  const BRAND = Symbol("zod_brand");
  class ZodBranded extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input),
        data = ctx.data;
      return this._def.type._parse({ data, path: ctx.path, parent: ctx });
    }
    unwrap() {
      return this._def.type;
    }
  }
  class ZodPipeline extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.common.async) {
        return (async () => {
          const inResult = await this._def.in._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx,
          });
          return "aborted" === inResult.status
            ? INVALID
            : "dirty" === inResult.status
            ? (status.dirty(), DIRTY(inResult.value))
            : this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx,
              });
        })();
      }
      {
        const inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        return "aborted" === inResult.status
          ? INVALID
          : "dirty" === inResult.status
          ? (status.dirty(), { status: "dirty", value: inResult.value })
          : this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx,
            });
      }
    }
    static create(a, b) {
      return new ZodPipeline({
        in: a,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline,
      });
    }
  }
  class ZodReadonly extends ZodType {
    _parse(input) {
      const result = this._def.innerType._parse(input);
      return (
        isValid(result) && (result.value = Object.freeze(result.value)), result
      );
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  function custom(check, params = {}, fatal) {
    return check
      ? ZodAny.create().superRefine((data, ctx) => {
          var _a, _b;
          if (!check(data)) {
            const p =
                "function" == typeof params
                  ? params(data)
                  : "string" == typeof params
                  ? { message: params }
                  : params,
              _fatal =
                null ===
                  (_b =
                    null !== (_a = p.fatal) && void 0 !== _a ? _a : fatal) ||
                void 0 === _b ||
                _b,
              p2 = "string" == typeof p ? { message: p } : p;
            ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
          }
        })
      : ZodAny.create();
  }
  ZodReadonly.create = (type, params) =>
    new ZodReadonly({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodReadonly,
      ...processCreateParams(params),
    });
  const late = { object: ZodObject.lazycreate };
  var ZodFirstPartyTypeKind;
  !(function (ZodFirstPartyTypeKind) {
    (ZodFirstPartyTypeKind.ZodString = "ZodString"),
      (ZodFirstPartyTypeKind.ZodNumber = "ZodNumber"),
      (ZodFirstPartyTypeKind.ZodNaN = "ZodNaN"),
      (ZodFirstPartyTypeKind.ZodBigInt = "ZodBigInt"),
      (ZodFirstPartyTypeKind.ZodBoolean = "ZodBoolean"),
      (ZodFirstPartyTypeKind.ZodDate = "ZodDate"),
      (ZodFirstPartyTypeKind.ZodSymbol = "ZodSymbol"),
      (ZodFirstPartyTypeKind.ZodUndefined = "ZodUndefined"),
      (ZodFirstPartyTypeKind.ZodNull = "ZodNull"),
      (ZodFirstPartyTypeKind.ZodAny = "ZodAny"),
      (ZodFirstPartyTypeKind.ZodUnknown = "ZodUnknown"),
      (ZodFirstPartyTypeKind.ZodNever = "ZodNever"),
      (ZodFirstPartyTypeKind.ZodVoid = "ZodVoid"),
      (ZodFirstPartyTypeKind.ZodArray = "ZodArray"),
      (ZodFirstPartyTypeKind.ZodObject = "ZodObject"),
      (ZodFirstPartyTypeKind.ZodUnion = "ZodUnion"),
      (ZodFirstPartyTypeKind.ZodDiscriminatedUnion = "ZodDiscriminatedUnion"),
      (ZodFirstPartyTypeKind.ZodIntersection = "ZodIntersection"),
      (ZodFirstPartyTypeKind.ZodTuple = "ZodTuple"),
      (ZodFirstPartyTypeKind.ZodRecord = "ZodRecord"),
      (ZodFirstPartyTypeKind.ZodMap = "ZodMap"),
      (ZodFirstPartyTypeKind.ZodSet = "ZodSet"),
      (ZodFirstPartyTypeKind.ZodFunction = "ZodFunction"),
      (ZodFirstPartyTypeKind.ZodLazy = "ZodLazy"),
      (ZodFirstPartyTypeKind.ZodLiteral = "ZodLiteral"),
      (ZodFirstPartyTypeKind.ZodEnum = "ZodEnum"),
      (ZodFirstPartyTypeKind.ZodEffects = "ZodEffects"),
      (ZodFirstPartyTypeKind.ZodNativeEnum = "ZodNativeEnum"),
      (ZodFirstPartyTypeKind.ZodOptional = "ZodOptional"),
      (ZodFirstPartyTypeKind.ZodNullable = "ZodNullable"),
      (ZodFirstPartyTypeKind.ZodDefault = "ZodDefault"),
      (ZodFirstPartyTypeKind.ZodCatch = "ZodCatch"),
      (ZodFirstPartyTypeKind.ZodPromise = "ZodPromise"),
      (ZodFirstPartyTypeKind.ZodBranded = "ZodBranded"),
      (ZodFirstPartyTypeKind.ZodPipeline = "ZodPipeline"),
      (ZodFirstPartyTypeKind.ZodReadonly = "ZodReadonly");
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
  const stringType = ZodString.create,
    numberType = ZodNumber.create,
    nanType = ZodNaN.create,
    bigIntType = ZodBigInt.create,
    booleanType = ZodBoolean.create,
    dateType = ZodDate.create,
    symbolType = ZodSymbol.create,
    undefinedType = ZodUndefined.create,
    nullType = ZodNull.create,
    anyType = ZodAny.create,
    unknownType = ZodUnknown.create,
    neverType = ZodNever.create,
    voidType = ZodVoid.create,
    arrayType = ZodArray.create,
    objectType = ZodObject.create,
    strictObjectType = ZodObject.strictCreate,
    unionType = ZodUnion.create,
    discriminatedUnionType = ZodDiscriminatedUnion.create,
    intersectionType = ZodIntersection.create,
    tupleType = ZodTuple.create,
    recordType = ZodRecord.create,
    mapType = ZodMap.create,
    setType = ZodSet.create,
    functionType = ZodFunction.create,
    lazyType = ZodLazy.create,
    literalType = ZodLiteral.create,
    enumType = ZodEnum.create,
    nativeEnumType = ZodNativeEnum.create,
    promiseType = ZodPromise.create,
    effectsType = ZodEffects.create,
    optionalType = ZodOptional.create,
    nullableType = ZodNullable.create,
    preprocessType = ZodEffects.createWithPreprocess,
    pipelineType = ZodPipeline.create,
    coerce = {
      string: (arg) => ZodString.create({ ...arg, coerce: !0 }),
      number: (arg) => ZodNumber.create({ ...arg, coerce: !0 }),
      boolean: (arg) => ZodBoolean.create({ ...arg, coerce: !0 }),
      bigint: (arg) => ZodBigInt.create({ ...arg, coerce: !0 }),
      date: (arg) => ZodDate.create({ ...arg, coerce: !0 }),
    },
    NEVER = INVALID;
  Object.freeze({
    __proto__: null,
    defaultErrorMap: errorMap,
    setErrorMap: function (map) {
      overrideErrorMap = map;
    },
    getErrorMap,
    makeIssue,
    EMPTY_PATH: [],
    addIssueToContext,
    ParseStatus,
    INVALID,
    DIRTY,
    OK,
    isAborted,
    isDirty,
    isValid,
    isAsync,
    get util() {
      return util;
    },
    get objectUtil() {
      return objectUtil;
    },
    ZodParsedType,
    getParsedType,
    ZodType,
    datetimeRegex,
    ZodString,
    ZodNumber,
    ZodBigInt,
    ZodBoolean,
    ZodDate,
    ZodSymbol,
    ZodUndefined,
    ZodNull,
    ZodAny,
    ZodUnknown,
    ZodNever,
    ZodVoid,
    ZodArray,
    ZodObject,
    ZodUnion,
    ZodDiscriminatedUnion,
    ZodIntersection,
    ZodTuple,
    ZodRecord,
    ZodMap,
    ZodSet,
    ZodFunction,
    ZodLazy,
    ZodLiteral,
    ZodEnum,
    ZodNativeEnum,
    ZodPromise,
    ZodEffects,
    ZodTransformer: ZodEffects,
    ZodOptional,
    ZodNullable,
    ZodDefault,
    ZodCatch,
    ZodNaN,
    BRAND,
    ZodBranded,
    ZodPipeline,
    ZodReadonly,
    custom,
    Schema: ZodType,
    ZodSchema: ZodType,
    late,
    get ZodFirstPartyTypeKind() {
      return ZodFirstPartyTypeKind;
    },
    coerce,
    any: anyType,
    array: arrayType,
    bigint: bigIntType,
    boolean: booleanType,
    date: dateType,
    discriminatedUnion: discriminatedUnionType,
    effect: effectsType,
    enum: enumType,
    function: functionType,
    instanceof: (
      cls,
      params = { message: `Input not instance of ${cls.name}` }
    ) => custom((data) => data instanceof cls, params),
    intersection: intersectionType,
    lazy: lazyType,
    literal: literalType,
    map: mapType,
    nan: nanType,
    nativeEnum: nativeEnumType,
    never: neverType,
    null: nullType,
    nullable: nullableType,
    number: numberType,
    object: objectType,
    oboolean: () => booleanType().optional(),
    onumber: () => numberType().optional(),
    optional: optionalType,
    ostring: () => stringType().optional(),
    pipeline: pipelineType,
    preprocess: preprocessType,
    promise: promiseType,
    record: recordType,
    set: setType,
    strictObject: strictObjectType,
    string: stringType,
    symbol: symbolType,
    transformer: effectsType,
    tuple: tupleType,
    undefined: undefinedType,
    union: unionType,
    unknown: unknownType,
    void: voidType,
    NEVER,
    ZodIssueCode,
    quotelessJson: (obj) =>
      JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, "$1:"),
    ZodError,
  })
    .string()
    .safeParse("");
})();
