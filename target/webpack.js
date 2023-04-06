(() => {
  "use strict";
  const Function_dual = (arity, body) => {
      const isDataFirst =
        "number" == typeof arity ? (args) => args.length >= arity : arity;
      return function () {
        return isDataFirst(arguments)
          ? body.apply(this, arguments)
          : (self) => body(self, ...arguments);
      };
    },
    Function_identity = (a) => a,
    constant = (value) => () => value;
  function Function_pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
    switch (arguments.length) {
      case 1:
        return a;
      case 2:
        return ab(a);
      case 3:
        return bc(ab(a));
      case 4:
        return cd(bc(ab(a)));
      case 5:
        return de(cd(bc(ab(a))));
      case 6:
        return ef(de(cd(bc(ab(a)))));
      case 7:
        return fg(ef(de(cd(bc(ab(a))))));
      case 8:
        return gh(fg(ef(de(cd(bc(ab(a)))))));
      case 9:
        return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
      default: {
        let ret = arguments[0];
        for (let i = 1; i < arguments.length; i++) ret = arguments[i](ret);
        return ret;
      }
    }
  }
  const globalStoreId = Symbol.for("@effect/data/Global/globalStoreId");
  globalStoreId in globalThis || (globalThis[globalStoreId] = new Map());
  const globalStore = globalThis[globalStoreId],
    globalValue = (id, compute) => (
      globalStore.has(id) || globalStore.set(id, compute()), globalStore.get(id)
    );
  function isNothing(value) {
    return null == value;
  }
  class PCGRandom {
    constructor(seedHi, seedLo, incHi, incLo) {
      return (
        isNothing(seedLo) && isNothing(seedHi)
          ? ((seedLo = (4294967295 * Math.random()) >>> 0), (seedHi = 0))
          : isNothing(seedLo) && ((seedLo = seedHi), (seedHi = 0)),
        isNothing(incLo) && isNothing(incHi)
          ? ((incLo = this._state ? this._state[3] : 4150755663),
            (incHi = this._state ? this._state[2] : 335903614))
          : isNothing(incLo) && ((incLo = incHi), (incHi = 0)),
        (this._state = new Int32Array([
          0,
          0,
          incHi >>> 0,
          (1 | (incLo || 0)) >>> 0,
        ])),
        this._next(),
        add64(
          this._state,
          this._state[0],
          this._state[1],
          seedHi >>> 0,
          seedLo >>> 0
        ),
        this._next(),
        this
      );
    }
    getState() {
      return [this._state[0], this._state[1], this._state[2], this._state[3]];
    }
    setState(state) {
      (this._state[0] = state[0]),
        (this._state[1] = state[1]),
        (this._state[2] = state[2]),
        (this._state[3] = 1 | state[3]);
    }
    integer(max) {
      if (!max) return this._next();
      if (0 == ((max >>>= 0) & (max - 1))) return this._next() & (max - 1);
      let num = 0;
      const skew = (-max >>> 0) % max >>> 0;
      for (num = this._next(); num < skew; num = this._next());
      return num % max;
    }
    number() {
      return (
        (134217728 * (1 * (67108863 & this._next())) +
          1 * (134217727 & this._next())) /
        9007199254740992
      );
    }
    _next() {
      const oldHi = this._state[0] >>> 0,
        oldLo = this._state[1] >>> 0;
      !(function (out, aHi, aLo, bHi, bLo) {
        let c1 = ((aLo >>> 16) * (65535 & bLo)) >>> 0,
          c0 = ((65535 & aLo) * (bLo >>> 16)) >>> 0,
          lo = ((65535 & aLo) * (65535 & bLo)) >>> 0,
          hi =
            ((aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16))) >>> 0;
        (c0 = (c0 << 16) >>> 0),
          (lo = (lo + c0) >>> 0),
          lo >>> 0 < c0 >>> 0 && (hi = (hi + 1) >>> 0);
        (c1 = (c1 << 16) >>> 0),
          (lo = (lo + c1) >>> 0),
          lo >>> 0 < c1 >>> 0 && (hi = (hi + 1) >>> 0);
        (hi = (hi + Math.imul(aLo, bHi)) >>> 0),
          (hi = (hi + Math.imul(aHi, bLo)) >>> 0),
          (out[0] = hi),
          (out[1] = lo);
      })(this._state, oldHi, oldLo, 1481765933, 1284865837),
        add64(
          this._state,
          this._state[0],
          this._state[1],
          this._state[2],
          this._state[3]
        );
      let xsHi = oldHi >>> 18,
        xsLo = ((oldLo >>> 18) | (oldHi << 14)) >>> 0;
      (xsHi = (xsHi ^ oldHi) >>> 0), (xsLo = (xsLo ^ oldLo) >>> 0);
      const xorshifted = ((xsLo >>> 27) | (xsHi << 5)) >>> 0,
        rot = oldHi >>> 27;
      return (
        ((xorshifted >>> rot) | (xorshifted << (((-rot >>> 0) & 31) >>> 0))) >>>
        0
      );
    }
  }
  function add64(out, aHi, aLo, bHi, bLo) {
    let hi = (aHi + bHi) >>> 0;
    const lo = (aLo + bLo) >>> 0;
    lo >>> 0 < aLo >>> 0 && (hi = (hi + 1) | 0), (out[0] = hi), (out[1] = lo);
  }
  const randomHashCache = globalValue(
      Symbol.for("@effect/data/Hash/randomHashCache"),
      () => new WeakMap()
    ),
    pcgr = globalValue(
      Symbol.for("@effect/data/Hash/pcgr"),
      () => new PCGRandom()
    ),
    symbol = Symbol.for("@effect/data/Hash"),
    Hash_hash = (self) => {
      switch (typeof self) {
        case "number":
          return number(self);
        case "bigint":
          return string(self.toString(10));
        case "boolean":
        case "symbol":
          return string(String(self));
        case "string":
          return string(self);
        case "undefined":
          return string("undefined");
        case "function":
        case "object":
          return null === self
            ? string("null")
            : isHash(self)
            ? self[symbol]()
            : random(self);
        default:
          throw new Error("Bug in Equal.hashGeneric");
      }
    },
    random = (self) => (
      randomHashCache.has(self) ||
        randomHashCache.set(
          self,
          number(pcgr.integer(Number.MAX_SAFE_INTEGER))
        ),
      randomHashCache.get(self)
    ),
    combine = (b) => (self) => (53 * self) ^ b,
    optimize = (n) => (3221225471 & n) | ((n >>> 1) & 1073741824),
    isHash = (u) => "object" == typeof u && null !== u && symbol in u,
    number = (n) => {
      if (n != n || n === 1 / 0) return 0;
      let h = 0 | n;
      for (h !== n && (h ^= 4294967295 * n); n > 4294967295; )
        h ^= n /= 4294967295;
      return optimize(n);
    },
    string = (str) => {
      let h = 5381,
        i = str.length;
      for (; i; ) h = (33 * h) ^ str.charCodeAt(--i);
      return optimize(h);
    },
    array = (arr) => {
      let h = 6151;
      for (let i = 0; i < arr.length; i++) h = combine(Hash_hash(arr[i]))(h);
      return optimize(h);
    },
    Equal_symbol = Symbol.for("@effect/data/Equal");
  function equals() {
    return 1 === arguments.length
      ? (self) => compareBoth(self, arguments[0])
      : compareBoth(arguments[0], arguments[1]);
  }
  function compareBoth(self, that) {
    if (self === that) return !0;
    const selfType = typeof self;
    return (
      selfType === typeof that &&
      !(
        ("object" !== selfType && "function" !== selfType) ||
        null === self ||
        null === that ||
        !isEqual(self) ||
        !isEqual(that)
      ) &&
      Hash_hash(self) === Hash_hash(that) &&
      self[Equal_symbol](that)
    );
  }
  const isEqual = (u) =>
    "object" == typeof u && null !== u && Equal_symbol in u;
  var _a;
  const runtimeDebug = globalValue(
      Symbol.for("@effect/data/Debug/runtimeDebug"),
      () => ({
        reportUnhandled: !0,
        minumumLogLevel: "Info",
        traceStackLimit: 5,
        tracingEnabled: !0,
        parseStack: (error) => {
          const stack = error.stack;
          if (stack) {
            const lines = stack.split("\n");
            let starts = 0;
            for (let i = 0; i < lines.length; i++)
              lines[i].startsWith("Error") && (starts = i);
            const frames = [];
            for (let i = starts + 1; i < lines.length; i++)
              if (lines[i].includes("at")) {
                const blocks = lines[i]
                    .split(" ")
                    .filter((i) => i.length > 0 && "at" !== i),
                  name =
                    2 !== blocks.length || blocks[0].includes("<anonymous>")
                      ? void 0
                      : blocks[0],
                  matchFrame = (
                    2 === blocks.length ? blocks[1] : blocks[0]
                  )?.match(/\(?(.*):(\d+):(\d+)/);
                matchFrame
                  ? frames.push({
                      name,
                      fileName: matchFrame[1],
                      line: Number.parseInt(matchFrame[2]),
                      column: Number.parseInt(matchFrame[3]),
                    })
                  : frames.push(void 0);
              } else frames.push(void 0);
            return frames;
          }
          return [];
        },
        filterStackFrame: (_) =>
          null != _ && !_.fileName.match(/\/internal_effect_untraced/),
      })
    ),
    sourceLocationProto = Object.setPrototypeOf(
      {
        toFrame() {
          if ("parsed" in this) return this.parsed;
          const stack = runtimeDebug.parseStack(this);
          return (
            stack && stack.length >= 2 && stack[0] && stack[1]
              ? (this.parsed = {
                  ...stack[this.depth - 1],
                  name: stack[this.depth - 2]?.name,
                })
              : (this.parsed = void 0),
            this.parsed
          );
        },
      },
      Error.prototype
    ),
    sourceLocation = (error) => (
      (error.depth = Error.stackTraceLimit),
      Object.setPrototypeOf(error, sourceLocationProto),
      error
    ),
    bodyWithTrace = (body) => {
      if (!runtimeDebug.tracingEnabled) return body(void 0, restoreOff);
      runtimeDebug.tracingEnabled = !1;
      try {
        const limit = Error.stackTraceLimit;
        Error.stackTraceLimit = 3;
        const source = sourceLocation(new Error());
        return (Error.stackTraceLimit = limit), body(source, restoreOn);
      } finally {
        runtimeDebug.tracingEnabled = !0;
      }
    },
    methodWithTrace = (body) =>
      function () {
        if (!runtimeDebug.tracingEnabled)
          return body(void 0, restoreOff).apply(this, arguments);
        runtimeDebug.tracingEnabled = !1;
        try {
          const limit = Error.stackTraceLimit;
          Error.stackTraceLimit = 2;
          const error = sourceLocation(new Error());
          return (
            (Error.stackTraceLimit = limit),
            body(error, restoreOn).apply(this, arguments)
          );
        } finally {
          runtimeDebug.tracingEnabled = !0;
        }
      },
    dualWithTrace = (dfLen, body) => {
      const isDataFirst =
        "number" == typeof dfLen ? (args) => args.length === dfLen : dfLen;
      return function () {
        if (!runtimeDebug.tracingEnabled) {
          const f = body(void 0, restoreOff);
          return isDataFirst(arguments)
            ? untraced(() => f.apply(this, arguments))
            : (self) => untraced(() => f(self, ...arguments));
        }
        runtimeDebug.tracingEnabled = !1;
        try {
          const limit = Error.stackTraceLimit;
          Error.stackTraceLimit = 2;
          const source = sourceLocation(new Error());
          Error.stackTraceLimit = limit;
          const f = body(source, restoreOn);
          return isDataFirst(arguments)
            ? untraced(() => f.apply(this, arguments))
            : (self) => untraced(() => f(self, ...arguments));
        } finally {
          runtimeDebug.tracingEnabled = !0;
        }
      };
    },
    untraced = (body) => {
      if (!runtimeDebug.tracingEnabled) return body(restoreOff);
      runtimeDebug.tracingEnabled = !1;
      try {
        return body(restoreOn);
      } finally {
        runtimeDebug.tracingEnabled = !0;
      }
    },
    Debug_untracedMethod = (body) =>
      function () {
        if (!runtimeDebug.tracingEnabled)
          return untraced(() => body(restoreOff).apply(this, arguments));
        runtimeDebug.tracingEnabled = !1;
        try {
          return untraced(() => body(restoreOn).apply(this, arguments));
        } finally {
          runtimeDebug.tracingEnabled = !0;
        }
      },
    restoreOn = (body) =>
      function () {
        if (runtimeDebug.tracingEnabled) return body.apply(this, arguments);
        runtimeDebug.tracingEnabled = !0;
        try {
          return body.apply(this, arguments);
        } finally {
          runtimeDebug.tracingEnabled = !1;
        }
      },
    restoreOff = (body) =>
      function () {
        if (!runtimeDebug.tracingEnabled) return body.apply(this, arguments);
        runtimeDebug.tracingEnabled = !1;
        try {
          return body.apply(this, arguments);
        } finally {
          runtimeDebug.tracingEnabled = !0;
        }
      },
    EffectTypeId = Symbol.for("@effect/io/Effect");
  class TracedPrimitive {
    [((_a = EffectTypeId), Equal_symbol)](that) {
      return this === that;
    }
    [symbol]() {
      return random(this);
    }
    constructor(i0, trace) {
      (this.i0 = i0),
        (this.trace = trace),
        (this._tag = "Traced"),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this[_a] = effectVariance);
    }
    traced(trace) {
      return trace ? new TracedPrimitive(this, trace) : this;
    }
  }
  const effectVariance = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
    makeTraced = (self, source) => new TracedPrimitive(self, source);
  var Option_a, _b;
  const Option_effectVariance = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
    Option_EffectTypeId = Symbol.for("@effect/io/Effect");
  class Some {
    [((Option_a = Option_EffectTypeId), Equal_symbol)](that) {
      return isOption(that) && isSome(that) && equals(that.i0, this.i0);
    }
    [symbol]() {
      return Hash_hash(this.i0);
    }
    toJSON() {
      return { _tag: this._tag, value: this.i0 };
    }
    get value() {
      return this.i0;
    }
    constructor(i0) {
      (this.i0 = i0),
        (this._tag = "Some"),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this.trace = void 0),
        (this[Option_a] = Option_effectVariance);
    }
    traced(trace) {
      return trace ? makeTraced(this, trace) : this;
    }
  }
  class None {
    constructor() {
      (this._tag = "None"),
        (this.i0 = void 0),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this.trace = void 0),
        (this[_b] = Option_effectVariance);
    }
    [((_b = Option_EffectTypeId), Equal_symbol)](that) {
      return isOption(that) && isNone(that);
    }
    [symbol]() {
      return Hash_hash(this._tag);
    }
    toJSON() {
      return { _tag: this._tag };
    }
    traced(trace) {
      return trace ? makeTraced(this, trace) : this;
    }
  }
  const isOption = (input) =>
      "object" == typeof input &&
      null != input &&
      "_tag" in input &&
      ("None" === input._tag || "Some" === input._tag) &&
      isEqual(input),
    isNone = (fa) => "None" === fa._tag,
    isSome = (fa) => "Some" === fa._tag,
    none = new None(),
    some = (a) => new Some(a);
  var Either_a, Either_b;
  const Either_effectVariance = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
    Either_EffectTypeId = Symbol.for("@effect/io/Effect");
  class Right {
    [((Either_a = Either_EffectTypeId), Equal_symbol)](that) {
      return isEither(that) && isRight(that) && equals(that.i0, this.i0);
    }
    [symbol]() {
      return Hash_hash(this.i0);
    }
    get right() {
      return this.i0;
    }
    constructor(i0) {
      (this.i0 = i0),
        (this._tag = "Right"),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this.trace = void 0),
        (this[Either_a] = Either_effectVariance);
    }
    toJSON() {
      return { _tag: this._tag, right: this.i0 };
    }
    traced(trace) {
      return trace ? makeTraced(this, trace) : this;
    }
  }
  class Left {
    [((Either_b = Either_EffectTypeId), Equal_symbol)](that) {
      return isEither(that) && isLeft(that) && equals(that.i0, this.i0);
    }
    [symbol]() {
      return Hash_hash(this.i0);
    }
    get left() {
      return this.i0;
    }
    constructor(i0) {
      (this.i0 = i0),
        (this._tag = "Left"),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this.trace = void 0),
        (this[Either_b] = Either_effectVariance);
    }
    toJSON() {
      return { _tag: this._tag, left: this.i0 };
    }
    traced(trace) {
      return trace ? makeTraced(this, trace) : this;
    }
  }
  const isEither = (input) =>
      "object" == typeof input &&
      null != input &&
      "_tag" in input &&
      ("Left" === input._tag || "Right" === input._tag) &&
      isEqual(input),
    isLeft = (ma) => "Left" === ma._tag,
    isRight = (ma) => "Right" === ma._tag,
    left = (e) => new Left(e),
    right = (a) => new Right(a),
    isString = (input) => "string" == typeof input,
    isNumber = (input) => "number" == typeof input,
    isBoolean = (input) => "boolean" == typeof input,
    isBigint = (input) => "bigint" == typeof input,
    isSymbol = (input) => "symbol" == typeof input,
    isUndefined = (input) => void 0 === input,
    isNever = (_) => !1,
    isObject = (input) => "object" == typeof input && null != input,
    isNotNullable = (input) => null != input,
    isRecord = (input) => isObject(input) && !Array.isArray(input),
    make = (compare) => ({
      compare: (self, that) => (self === that ? 0 : compare(self, that)),
    }),
    Order_number = make((self, that) => (self < that ? -1 : 1)),
    reverse = (O) => make((self, that) => O.compare(that, self)),
    Order_contramap = Function_dual(2, (self, f) =>
      make((b1, b2) => self.compare(f(b1), f(b2)))
    );
  Order_number.compare;
  const Semigroup_make = (
      combine,
      combineMany = (self, collection) => {
        return ((b = self),
        (f = combine),
        function (iterable) {
          if (Array.isArray(iterable)) return iterable.reduce(f, b);
          let result = b;
          for (const n of iterable) result = f(result, n);
          return result;
        })(collection);
        var b, f;
      }
    ) => ({ combine, combineMany }),
    Semigroup_string = Semigroup_make((self, that) => self + that),
    numberSum = Semigroup_make((self, that) => self + that),
    numberMultiply = Semigroup_make(
      (self, that) => self * that,
      (self, collection) => {
        if (0 === self) return 0;
        let out = self;
        for (const n of collection) {
          if (0 === n) return 0;
          out *= n;
        }
        return out;
      }
    ),
    fromSemigroup = (S, empty) => ({
      combine: S.combine,
      combineMany: S.combineMany,
      empty,
      combineAll: (collection) => S.combineMany(empty, collection),
    }),
    Monoid_numberSum = fromSemigroup(numberSum, 0),
    Monoid_numberMultiply = fromSemigroup(numberMultiply, 1),
    Order = (numberSum.combine, numberMultiply.combine, Order_number),
    MonoidSum = Monoid_numberSum,
    MonoidMultiply = Monoid_numberMultiply,
    Option_none = (MonoidSum.combineAll, MonoidMultiply.combineAll, () => none),
    Option_some = some,
    Option_isNone = isNone,
    Option_isSome = isSome,
    fromNullable = (nullableValue) =>
      null == nullableValue ? Option_none() : Option_some(nullableValue),
    Option_map = Function_dual(2, (self, f) =>
      Option_isNone(self) ? Option_none() : Option_some(f(self.value))
    ),
    Either_right = right,
    Either_left = left,
    Either_isLeft = isLeft,
    Either_isRight = isRight,
    isNonEmptyArray = (self) => self.length > 0;
  Semigroup_string.combine;
  class LinesIterator {
    constructor(s, stripped = !1) {
      (this.s = s),
        (this.stripped = stripped),
        (this.index = 0),
        (this.length = s.length);
    }
    next() {
      if (this.done) return { done: !0, value: void 0 };
      const start = this.index;
      for (; !this.done && !isLineBreak(this.s[this.index]); )
        this.index = this.index + 1;
      let end = this.index;
      if (!this.done) {
        const char = this.s[this.index];
        (this.index = this.index + 1),
          !this.done &&
            isLineBreak2(char, this.s[this.index]) &&
            (this.index = this.index + 1),
          this.stripped || (end = this.index);
      }
      return { done: !1, value: this.s.substring(start, end) };
    }
    [Symbol.iterator]() {
      return new LinesIterator(this.s, this.stripped);
    }
    get done() {
      return this.index >= this.length;
    }
  }
  const isLineBreak = (char) => {
      const code = char.charCodeAt(0);
      return 13 === code || 10 === code;
    },
    isLineBreak2 = (char0, char1) =>
      13 === char0.charCodeAt(0) && 10 === char1.charCodeAt(0),
    mjs_ReadonlyArray_fromIterable = (collection) =>
      Array.isArray(collection) ? collection : Array.from(collection),
    isEmptyReadonlyArray = (self) => 0 === self.length,
    ReadonlyArray_isNonEmptyArray = isNonEmptyArray,
    isOutOfBound = (i, as) => i < 0 || i >= as.length,
    ReadonlyArray_clamp = (i, as) =>
      Math.floor(Math.min(Math.max(0, i), as.length)),
    headNonEmpty = Function_dual(2, (self, index) => {
      const i = Math.floor(index);
      if (isOutOfBound(i, self)) throw new Error(`Index ${i} out of bounds`);
      return self[i];
    })(0),
    tailNonEmpty = (self) => self.slice(1),
    drop = Function_dual(2, (self, n) => {
      const input = mjs_ReadonlyArray_fromIterable(self);
      return input.slice(ReadonlyArray_clamp(n, input), input.length);
    }),
    sort = Function_dual(2, (self, O) => {
      const out = Array.from(self);
      return out.sort(O.compare), out;
    }),
    ReadonlyArray_map = Function_dual(2, (self, f) => self.map(f)),
    mapNonEmpty = ReadonlyArray_map,
    ReadonlyArray_flatMap = Function_dual(2, (self, f) => {
      if (isEmptyReadonlyArray(self)) return [];
      const out = [];
      for (let i = 0; i < self.length; i++) out.push(...f(self[i], i));
      return out;
    }),
    ReadonlyArray_reduce = Function_dual(3, (self, b, f) =>
      mjs_ReadonlyArray_fromIterable(self).reduce((b, a, i) => f(b, a, i), b)
    );
  const TitleAnnotationId = "@effect/schema/TitleAnnotationId",
    hasTransformation = (ast) =>
      isRefinement(ast) ||
      isTransform(ast) ||
      isLazy(ast) ||
      ("hasTransformation" in ast && ast.hasTransformation),
    createDeclaration = (typeParameters, type, decode, annotations = {}) => ({
      _tag: "Declaration",
      typeParameters,
      type,
      decode,
      annotations,
      hasTransformation:
        hasTransformation(type) || typeParameters.some(hasTransformation),
    }),
    isLiteral = (ast) => "Literal" === ast._tag,
    neverKeyword = {
      _tag: "NeverKeyword",
      annotations: { [TitleAnnotationId]: "never" },
    },
    unknownKeyword = {
      _tag: "UnknownKeyword",
      annotations: { [TitleAnnotationId]: "unknown" },
    },
    isUnknownKeyword = (ast) => "UnknownKeyword" === ast._tag,
    anyKeyword = {
      _tag: "AnyKeyword",
      annotations: { [TitleAnnotationId]: "any" },
    },
    isAnyKeyword = (ast) => "AnyKeyword" === ast._tag,
    stringKeyword = {
      _tag: "StringKeyword",
      annotations: { [TitleAnnotationId]: "string" },
    },
    isStringKeyword = (ast) => "StringKeyword" === ast._tag,
    numberKeyword = {
      _tag: "NumberKeyword",
      annotations: { [TitleAnnotationId]: "number" },
    },
    isNumberKeyword = (ast) => "NumberKeyword" === ast._tag,
    isBooleanKeyword = (ast) => "BooleanKeyword" === ast._tag,
    isBigIntKeyword = (ast) => "BigIntKeyword" === ast._tag,
    symbolKeyword = {
      _tag: "SymbolKeyword",
      annotations: { [TitleAnnotationId]: "symbol" },
    },
    isSymbolKeyword = (ast) => "SymbolKeyword" === ast._tag,
    createTuple = (elements, rest, isReadonly, annotations = {}) => ({
      _tag: "Tuple",
      elements,
      rest,
      isReadonly,
      annotations,
      hasTransformation:
        elements.some((e) => hasTransformation(e.type)) ||
        (Option_isSome(rest) && rest.value.some(hasTransformation)),
    }),
    createPropertySignature = (
      name,
      type,
      isOptional,
      isReadonly,
      annotations = {}
    ) => ({ name, type, isOptional, isReadonly, annotations }),
    createIndexSignature = (parameter, type, isReadonly) => {
      if ("NeverKeyword" === _getParameterKeyof(parameter)._tag)
        throw new Error(
          "An index signature parameter type must be 'string', 'symbol', a template literal type or a refinement of the previous types"
        );
      return { parameter, type, isReadonly };
    },
    createTypeLiteral = (
      propertySignatures,
      indexSignatures,
      annotations = {}
    ) => ({
      _tag: "TypeLiteral",
      propertySignatures: sortByCardinalityAsc(propertySignatures),
      indexSignatures: sortByCardinalityAsc(indexSignatures),
      annotations,
      hasTransformation:
        propertySignatures.some((p) => hasTransformation(p.type)) ||
        indexSignatures.some((is) => hasTransformation(is.type)),
    }),
    createUnion = (candidates, annotations = {}) => {
      const types = unify(candidates);
      switch (types.length) {
        case 0:
          return neverKeyword;
        case 1:
          return types[0];
        default:
          return {
            _tag: "Union",
            types: sortByWeightDesc(types),
            annotations,
            hasTransformation: types.some(hasTransformation),
          };
      }
    },
    createLazy = (f, annotations = {}) => ({ _tag: "Lazy", f, annotations }),
    isLazy = (ast) => "Lazy" === ast._tag,
    isRefinement = (ast) => "Refinement" === ast._tag,
    isTransform = (ast) => "Transform" === ast._tag,
    getFrom = (ast) => {
      if (hasTransformation(ast))
        switch (ast._tag) {
          case "Declaration":
            return createDeclaration(
              ast.typeParameters.map(getFrom),
              getFrom(ast.type),
              ast.decode,
              ast.annotations
            );
          case "Tuple":
            return createTuple(
              ast.elements.map((e) => ({ ...e, type: getFrom(e.type) })),
              Option_map(ast.rest, mapNonEmpty(getFrom)),
              ast.isReadonly
            );
          case "TypeLiteral":
            return createTypeLiteral(
              ast.propertySignatures.map((p) => ({
                ...p,
                type: getFrom(p.type),
              })),
              ast.indexSignatures.map((is) => ({
                ...is,
                type: getFrom(is.type),
              }))
            );
          case "Union":
            return createUnion(ast.types.map(getFrom));
          case "Lazy":
            return createLazy(() => getFrom(ast.f()));
          case "Refinement":
          case "Transform":
            return getFrom(ast.from);
        }
      return ast;
    },
    _getCardinality = (ast) => {
      switch (ast._tag) {
        case "Declaration":
          return _getCardinality(ast.type);
        case "NeverKeyword":
          return 0;
        case "Literal":
        case "UndefinedKeyword":
        case "VoidKeyword":
        case "UniqueSymbol":
          return 1;
        case "BooleanKeyword":
          return 2;
        case "StringKeyword":
        case "NumberKeyword":
        case "BigIntKeyword":
        case "SymbolKeyword":
          return 3;
        case "ObjectKeyword":
          return 4;
        case "UnknownKeyword":
        case "AnyKeyword":
          return 6;
        case "Refinement":
        case "Transform":
          return _getCardinality(ast.to);
        default:
          return 5;
      }
    },
    sortByCardinalityAsc = sort(
      Function_pipe(
        Order,
        Order_contramap(({ type }) => _getCardinality(type))
      )
    ),
    _getWeight = (ast) => {
      switch (ast._tag) {
        case "Declaration":
          return _getWeight(ast.type);
        case "Tuple":
          return (
            ast.elements.length +
            (Option_isSome(ast.rest) ? ast.rest.value.length : 0)
          );
        case "TypeLiteral": {
          const out =
            ast.propertySignatures.length + ast.indexSignatures.length;
          return 0 === out ? -2 : out;
        }
        case "Union":
          return ast.types.reduce((n, member) => n + _getWeight(member), 0);
        case "Lazy":
          return 10;
        case "Refinement":
        case "Transform":
          return _getWeight(ast.to);
        case "ObjectKeyword":
          return -1;
        case "UnknownKeyword":
        case "AnyKeyword":
          return -2;
        default:
          return 0;
      }
    },
    sortByWeightDesc = sort(reverse(Order_contramap(Order, _getWeight))),
    unify = (candidates) => {
      let i,
        out = Function_pipe(
          candidates,
          ReadonlyArray_flatMap((ast) => {
            switch (ast._tag) {
              case "NeverKeyword":
                return [];
              case "Union":
                return ast.types;
              default:
                return [ast];
            }
          })
        );
      return out.some(isAnyKeyword)
        ? [anyKeyword]
        : out.some(isUnknownKeyword)
        ? [unknownKeyword]
        : (-1 !== (i = out.findIndex(isStringKeyword)) &&
            (out = out.filter(
              (m, j) =>
                j === i ||
                (!isStringKeyword(m) &&
                  !(isLiteral(m) && "string" == typeof m.literal))
            )),
          -1 !== (i = out.findIndex(isNumberKeyword)) &&
            (out = out.filter(
              (m, j) =>
                j === i ||
                (!isNumberKeyword(m) &&
                  !(isLiteral(m) && "number" == typeof m.literal))
            )),
          -1 !== (i = out.findIndex(isBooleanKeyword)) &&
            (out = out.filter(
              (m, j) =>
                j === i ||
                (!isBooleanKeyword(m) &&
                  !(isLiteral(m) && "boolean" == typeof m.literal))
            )),
          -1 !== (i = out.findIndex(isBigIntKeyword)) &&
            (out = out.filter(
              (m, j) =>
                j === i ||
                (!isBigIntKeyword(m) &&
                  !(isLiteral(m) && "bigint" == typeof m.literal))
            )),
          -1 !== (i = out.findIndex(isSymbolKeyword)) &&
            (out = out.filter(
              (m, j) =>
                j === i || (!isSymbolKeyword(m) && !("UniqueSymbol" === m._tag))
            )),
          out);
    },
    _getParameterKeyof = (ast) => {
      switch (ast._tag) {
        case "StringKeyword":
        case "SymbolKeyword":
        case "TemplateLiteral":
          return ast;
        case "Refinement":
          return _getParameterKeyof(ast.to);
      }
      return neverKeyword;
    },
    getKeysForIndexSignature = (input, parameter) => {
      switch (parameter._tag) {
        case "StringKeyword":
        case "TemplateLiteral":
          return Object.keys(input);
        case "SymbolKeyword":
          return Object.getOwnPropertySymbols(input);
        case "Refinement":
        case "Transform":
          return getKeysForIndexSignature(input, parameter.from);
      }
      return [];
    },
    common_ownKeys = (o) =>
      Object.keys(o).concat(Object.getOwnPropertySymbols(o)),
    TypeId = Symbol.for("@effect/data/Chunk"),
    emptyArray = [];
  class ChunkImpl {
    constructor(backing) {
      switch (((this.backing = backing), (this._id = TypeId), backing._tag)) {
        case "IEmpty":
          (this.length = 0),
            (this.depth = 0),
            (this.left = this),
            (this.right = this);
          break;
        case "IConcat":
          (this.length = backing.left.length + backing.right.length),
            (this.depth =
              1 + Math.max(backing.left.depth, backing.right.depth)),
            (this.left = backing.left),
            (this.right = backing.right);
          break;
        case "IArray":
          (this.length = backing.array.length),
            (this.depth = 0),
            (this.left = _empty),
            (this.right = _empty);
          break;
        case "ISingleton":
          (this.length = 1),
            (this.depth = 0),
            (this.left = _empty),
            (this.right = _empty);
      }
    }
    toString() {
      return `Chunk(${toReadonlyArray(this).map(String).join(", ")})`;
    }
    toJSON() {
      return { _tag: "Chunk", values: toReadonlyArray(this) };
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.toJSON();
    }
    [Equal_symbol](that) {
      return (
        !(!isChunk(that) || this.length !== that.length) &&
        toReadonlyArray(this).every((value, i) =>
          equals(value, Chunk_unsafeGet(that, i))
        )
      );
    }
    [symbol]() {
      return array(toReadonlyArray(this));
    }
    [Symbol.iterator]() {
      switch (this.backing._tag) {
        case "IArray":
          return this.backing.array[Symbol.iterator]();
        case "IEmpty":
          return emptyArray[Symbol.iterator]();
        default:
          return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  }
  const copyToArray = (self, array, initial) => {
      switch (self.backing._tag) {
        case "IArray":
          !(function (src, srcPos, dest, destPos, len) {
            for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++)
              dest[destPos + i - srcPos] = src[i];
          })(self.backing.array, 0, array, initial, self.length);
          break;
        case "IConcat":
          copyToArray(self.left, array, initial),
            copyToArray(self.right, array, initial + self.left.length);
          break;
        case "ISingleton":
          array[initial] = self.backing.a;
      }
    },
    isChunk = (u) =>
      "object" == typeof u && null != u && "_id" in u && u._id === TypeId,
    _empty = new ChunkImpl({ _tag: "IEmpty" }),
    Chunk_empty = () => _empty,
    toReadonlyArray = (self) => {
      switch (self.backing._tag) {
        case "IEmpty":
          return emptyArray;
        case "IArray":
          return self.backing.array;
        default: {
          const arr = new Array(self.length);
          return (
            copyToArray(self, arr, 0),
            (self.backing = { _tag: "IArray", array: arr }),
            (self.left = _empty),
            (self.right = _empty),
            (self.depth = 0),
            arr
          );
        }
      }
    },
    unsafeFromArray = (self) => new ChunkImpl({ _tag: "IArray", array: self }),
    Chunk_unsafeGet = Function_dual(2, (self, index) => {
      switch (self.backing._tag) {
        case "IEmpty":
          throw new Error("Index out of bounds");
        case "ISingleton":
          if (0 !== index) throw new Error("Index out of bounds");
          return self.backing.a;
        case "IArray":
          if (index >= self.length || index < 0)
            throw new Error("Index out of bounds");
          return self.backing.array[index];
        case "IConcat":
          return index < self.left.length
            ? Chunk_unsafeGet(self.left, index)
            : Chunk_unsafeGet(self.right, index - self.left.length);
      }
    }),
    Chunk_prepend = Function_dual(2, (self, a) =>
      Chunk_concat(Chunk_of(a), self)
    ),
    Chunk_drop = Function_dual(2, (self, n) =>
      n <= 0
        ? self
        : n >= self.length
        ? _empty
        : unsafeFromArray(drop(n)(toReadonlyArray(self)))
    ),
    Chunk_concat = Function_dual(2, (self, that) => {
      if ("IEmpty" === self.backing._tag) return that;
      if ("IEmpty" === that.backing._tag) return self;
      const diff = that.depth - self.depth;
      if (Math.abs(diff) <= 1)
        return new ChunkImpl({ _tag: "IConcat", left: self, right: that });
      if (diff < -1) {
        if (self.left.depth >= self.right.depth) {
          const nr = Chunk_concat(that)(self.right);
          return new ChunkImpl({ _tag: "IConcat", left: self.left, right: nr });
        }
        {
          const nrr = Chunk_concat(that)(self.right.right);
          if (nrr.depth === self.depth - 3) {
            const nr = new ChunkImpl({
              _tag: "IConcat",
              left: self.right.left,
              right: nrr,
            });
            return new ChunkImpl({
              _tag: "IConcat",
              left: self.left,
              right: nr,
            });
          }
          {
            const nl = new ChunkImpl({
              _tag: "IConcat",
              left: self.left,
              right: self.right.left,
            });
            return new ChunkImpl({ _tag: "IConcat", left: nl, right: nrr });
          }
        }
      }
      if (that.right.depth >= that.left.depth) {
        const nl = Chunk_concat(that.left)(self);
        return new ChunkImpl({ _tag: "IConcat", left: nl, right: that.right });
      }
      {
        const nll = Chunk_concat(that.left.left)(self);
        if (nll.depth === that.depth - 3) {
          const nl = new ChunkImpl({
            _tag: "IConcat",
            left: nll,
            right: that.left.right,
          });
          return new ChunkImpl({
            _tag: "IConcat",
            left: nl,
            right: that.right,
          });
        }
        {
          const nr = new ChunkImpl({
            _tag: "IConcat",
            left: that.left.right,
            right: that.right,
          });
          return new ChunkImpl({ _tag: "IConcat", left: nll, right: nr });
        }
      }
    }),
    Chunk_isEmpty = (self) => 0 === self.length,
    Chunk_isNonEmpty = (self) => self.length > 0,
    Chunk_reduce = Function_dual(3, (self, b, f) =>
      ReadonlyArray_reduce(b, f)(toReadonlyArray(self))
    ),
    Chunk_of = (a) => new ChunkImpl({ _tag: "ISingleton", a }),
    Chunk_reverse = (self) =>
      unsafeFromArray(
        ((self) => Array.from(self).reverse())(toReadonlyArray(self))
      ),
    unsafeHead = (self) => Chunk_unsafeGet(0)(self),
    Chunk_headNonEmpty = unsafeHead,
    Chunk_tailNonEmpty = (self) => Chunk_drop(self, 1);
  const Context_EffectTypeId = Symbol.for("@effect/io/Effect");
  class TagImpl {
    [(Context_EffectTypeId, Equal_symbol)](that) {
      return this === that;
    }
    [symbol]() {
      return random(this);
    }
    get [TagTypeId]() {
      return { _S: (_) => _, _I: (_) => _ };
    }
    constructor(id) {
      if (
        ((this._tag = "Tag"),
        (this.i0 = void 0),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this.trace = void 0),
        (this[Context_a] = Context_effectVariance),
        void 0 !== id)
      )
        return globalValue(id, () => this);
    }
    traced(trace) {
      return trace ? makeTraced(this, trace) : this;
    }
  }
  const ContextTypeId = Symbol.for("@effect/data/Context");
  class ContextImpl {
    [Equal_symbol](that) {
      if (isContext(that) && this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys())
          if (
            !that.unsafeMap.has(k) ||
            !equals(this.unsafeMap.get(k), that.unsafeMap.get(k))
          )
            return !1;
        return !0;
      }
      return !1;
    }
    [symbol]() {
      return number(this.unsafeMap.size);
    }
    constructor(unsafeMap) {
      (this.unsafeMap = unsafeMap),
        (this._id = ContextTypeId),
        (this._S = (_) => _);
    }
  }
  const isContext = (u) =>
      "object" == typeof u &&
      null !== u &&
      "_id" in u &&
      u._id === ContextTypeId,
    Context_unsafeGet = Function_dual(2, (self, tag) => {
      if (!self.unsafeMap.has(tag)) throw new Error("Service not found");
      return self.unsafeMap.get(tag);
    }),
    mjs_Context_empty = () => new ContextImpl(new Map()),
    mjs_Context_unsafeGet = Context_unsafeGet;
  const ContextPatchTypeId = Symbol.for("@effect/data/Differ/ContextPatch");
  function ContextPatch_variance(a) {
    return a;
  }
  class ContextPatch_Empty {
    constructor() {
      (this._tag = "Empty"),
        (this._Input = ContextPatch_variance),
        (this._Output = ContextPatch_variance),
        (this._id = ContextPatchTypeId);
    }
    [symbol]() {
      return string("ContextPatch(Empty)");
    }
    [Equal_symbol](that) {
      return (
        "object" == typeof that &&
        null !== that &&
        "_id" in that &&
        that._id === this._id &&
        "_tag" in that &&
        that._tag === this._id
      );
    }
  }
  class ContextPatch_AndThen {
    constructor(first, second) {
      (this.first = first),
        (this.second = second),
        (this._tag = "AndThen"),
        (this._id = ContextPatchTypeId),
        (this._Input = ContextPatch_variance),
        (this._Output = ContextPatch_variance);
    }
    [symbol]() {
      return string("ContextPatch(AndThen)");
    }
    [Equal_symbol](that) {
      return (
        "object" == typeof that &&
        null !== that &&
        "_id" in that &&
        that._id === this._id &&
        "_tag" in that &&
        that._tag === this._id &&
        equals(this.first, that.first) &&
        equals(this.second, that.second)
      );
    }
  }
  class AddService {
    constructor(tag, service) {
      (this.tag = tag),
        (this.service = service),
        (this._tag = "AddService"),
        (this._id = ContextPatchTypeId),
        (this._Input = ContextPatch_variance),
        (this._Output = ContextPatch_variance);
    }
    [symbol]() {
      return string("ContextPatch(AddService)");
    }
    [Equal_symbol](that) {
      return (
        "object" == typeof that &&
        null !== that &&
        "_id" in that &&
        that._id === this._id &&
        "_tag" in that &&
        that._tag === this._id &&
        equals(this.tag, that.tag) &&
        equals(this.service, that.service)
      );
    }
  }
  class RemoveService {
    constructor(tag) {
      (this.tag = tag),
        (this._tag = "RemoveService"),
        (this._id = ContextPatchTypeId),
        (this._Input = ContextPatch_variance),
        (this._Output = ContextPatch_variance);
    }
    [symbol]() {
      return string("ContextPatch(RemoveService)");
    }
    [Equal_symbol](that) {
      return (
        "object" == typeof that &&
        null !== that &&
        "_id" in that &&
        that._id === this._id &&
        "_tag" in that &&
        that._tag === this._id &&
        equals(this.tag, that.tag)
      );
    }
  }
  class UpdateService {
    constructor(tag, update) {
      (this.tag = tag),
        (this.update = update),
        (this._tag = "UpdateService"),
        (this._id = ContextPatchTypeId),
        (this._Input = ContextPatch_variance),
        (this._Output = ContextPatch_variance);
    }
    [symbol]() {
      return string("ContextPatch(AndThen)");
    }
    [Equal_symbol](that) {
      return (
        "object" == typeof that &&
        null !== that &&
        "_id" in that &&
        that._id === this._id &&
        "_tag" in that &&
        that._tag === this._id &&
        equals(this.tag, that.tag) &&
        equals(this.update, that.update)
      );
    }
  }
  const ContextPatch_empty = () => new ContextPatch_Empty(),
    ContextPatch_combine = Function_dual(
      2,
      (self, that) => new ContextPatch_AndThen(self, that)
    ),
    ContextPatch_patch = Function_dual(2, (self, context) => {
      let wasServiceUpdated = !1,
        patches = Chunk_of(self);
      const updatedContext = new Map(context.unsafeMap);
      for (; Chunk_isNonEmpty(patches); ) {
        const head = Chunk_headNonEmpty(patches),
          tail = Chunk_tailNonEmpty(patches);
        switch (head._tag) {
          case "Empty":
            patches = tail;
            break;
          case "AddService":
            updatedContext.set(head.tag, head.service), (patches = tail);
            break;
          case "AndThen":
            patches = Chunk_prepend(
              Chunk_prepend(tail, head.second),
              head.first
            );
            break;
          case "RemoveService":
            updatedContext.delete(head.tag), (patches = tail);
            break;
          case "UpdateService":
            updatedContext.set(
              head.tag,
              head.update(updatedContext.get(head.tag))
            ),
              (wasServiceUpdated = !0),
              (patches = tail);
        }
      }
      if (!wasServiceUpdated) return new ContextImpl(updatedContext);
      const map = new Map();
      for (const [tag] of context.unsafeMap)
        updatedContext.has(tag) &&
          (map.set(tag, updatedContext.get(tag)), updatedContext.delete(tag));
      for (const [tag, s] of updatedContext) map.set(tag, s);
      return new ContextImpl(map);
    }),
    Differ_ContextPatch_empty = ContextPatch_empty,
    Differ_ContextPatch_diff = (oldValue, newValue) => {
      const missingServices = new Map(oldValue.unsafeMap);
      let patch = ContextPatch_empty();
      for (const [tag, newService] of newValue.unsafeMap.entries())
        if (missingServices.has(tag)) {
          const old = missingServices.get(tag);
          missingServices.delete(tag),
            equals(old, newService) ||
              (patch = ContextPatch_combine(
                new UpdateService(tag, () => newService)
              )(patch));
        } else
          missingServices.delete(tag),
            (patch = ContextPatch_combine(new AddService(tag, newService))(
              patch
            ));
      for (const [tag] of missingServices.entries())
        patch = ContextPatch_combine(new RemoveService(tag))(patch);
      return patch;
    },
    Differ_ContextPatch_combine = ContextPatch_combine,
    Differ_ContextPatch_patch = ContextPatch_patch,
    BUCKET_SIZE = Math.pow(2, 5),
    MASK = BUCKET_SIZE - 1,
    MAX_INDEX_NODE = BUCKET_SIZE / 2,
    MIN_ARRAY_NODE = BUCKET_SIZE / 4;
  function hashFragment(shift, h) {
    return (h >>> shift) & MASK;
  }
  function toBitmap(x) {
    return 1 << x;
  }
  function fromBitmap(bitmap, bit) {
    return (
      (x = bitmap & (bit - 1)),
      (x =
        ((x =
          (858993459 & (x -= (x >> 1) & 1431655765)) + ((x >> 2) & 858993459)) +
          (x >> 4)) &
        252645135),
      127 & ((x += x >> 8) + (x >> 16))
    );
    var x;
  }
  function arrayUpdate(mutate, at, v, arr) {
    let out = arr;
    if (!mutate) {
      const len = arr.length;
      out = new Array(len);
      for (let i = 0; i < len; ++i) out[i] = arr[i];
    }
    return (out[at] = v), out;
  }
  function arraySpliceOut(mutate, at, arr) {
    const newLen = arr.length - 1;
    let i = 0,
      g = 0,
      out = arr;
    if (mutate) i = g = at;
    else for (out = new Array(newLen); i < at; ) out[g++] = arr[i++];
    for (++i; i <= newLen; ) out[g++] = arr[i++];
    return mutate && (out.length = newLen), out;
  }
  class Stack {
    constructor(value, previous) {
      (this.value = value), (this.previous = previous);
    }
  }
  class EmptyNode {
    constructor() {
      this._tag = "EmptyNode";
    }
    modify(edit, _shift, f, hash, key, size) {
      const v = f(Option_none());
      return Option_isNone(v)
        ? new EmptyNode()
        : (++size.value, new LeafNode(edit, hash, key, v));
    }
  }
  function isEmptyNode(a) {
    return a instanceof EmptyNode;
  }
  function canEditNode(node, edit) {
    return !isEmptyNode(node) && edit === node.edit;
  }
  class LeafNode {
    constructor(edit, hash, key, value) {
      (this.edit = edit),
        (this.hash = hash),
        (this.key = key),
        (this.value = value),
        (this._tag = "LeafNode");
    }
    modify(edit, shift, f, hash, key, size) {
      if (equals(key, this.key)) {
        const v = f(this.value);
        return v === this.value
          ? this
          : Option_isNone(v)
          ? (--size.value, new EmptyNode())
          : canEditNode(this, edit)
          ? ((this.value = v), this)
          : new LeafNode(edit, hash, key, v);
      }
      const v = f(Option_none());
      return Option_isNone(v)
        ? this
        : (++size.value,
          mergeLeaves(
            edit,
            shift,
            this.hash,
            this,
            hash,
            new LeafNode(edit, hash, key, v)
          ));
    }
  }
  class CollisionNode {
    constructor(edit, hash, children) {
      (this.edit = edit),
        (this.hash = hash),
        (this.children = children),
        (this._tag = "CollisionNode");
    }
    modify(edit, shift, f, hash, key, size) {
      if (hash === this.hash) {
        const canEdit = canEditNode(this, edit),
          list = this.updateCollisionList(
            canEdit,
            edit,
            this.hash,
            this.children,
            f,
            key,
            size
          );
        return list === this.children
          ? this
          : list.length > 1
          ? new CollisionNode(edit, this.hash, list)
          : list[0];
      }
      const v = f(Option_none());
      return Option_isNone(v)
        ? this
        : (++size.value,
          mergeLeaves(
            edit,
            shift,
            this.hash,
            this,
            hash,
            new LeafNode(edit, hash, key, v)
          ));
    }
    updateCollisionList(mutate, edit, hash, list, f, key, size) {
      const len = list.length;
      for (let i = 0; i < len; ++i) {
        const child = list[i];
        if ("key" in child && equals(key, child.key)) {
          const value = child.value,
            newValue = f(value);
          return newValue === value
            ? list
            : Option_isNone(newValue)
            ? (--size.value, arraySpliceOut(mutate, i, list))
            : arrayUpdate(
                mutate,
                i,
                new LeafNode(edit, hash, key, newValue),
                list
              );
        }
      }
      const newValue = f(Option_none());
      return Option_isNone(newValue)
        ? list
        : (++size.value,
          arrayUpdate(
            mutate,
            len,
            new LeafNode(edit, hash, key, newValue),
            list
          ));
    }
  }
  class IndexedNode {
    constructor(edit, mask, children) {
      (this.edit = edit),
        (this.mask = mask),
        (this.children = children),
        (this._tag = "IndexedNode");
    }
    modify(edit, shift, f, hash, key, size) {
      const mask = this.mask,
        children = this.children,
        frag = hashFragment(shift, hash),
        bit = toBitmap(frag),
        indx = fromBitmap(mask, bit),
        exists = mask & bit,
        canEdit = canEditNode(this, edit);
      if (!exists) {
        const _newChild = new EmptyNode().modify(
          edit,
          shift + 5,
          f,
          hash,
          key,
          size
        );
        return _newChild
          ? children.length >= MAX_INDEX_NODE
            ? (function (edit, frag, child, bitmap, subNodes) {
                const arr = [];
                let bit = bitmap,
                  count = 0;
                for (let i = 0; bit; ++i)
                  1 & bit && (arr[i] = subNodes[count++]), (bit >>>= 1);
                return (arr[frag] = child), new ArrayNode(edit, count + 1, arr);
              })(edit, frag, _newChild, mask, children)
            : new IndexedNode(
                edit,
                mask | bit,
                (function (mutate, at, v, arr) {
                  const len = arr.length;
                  if (mutate) {
                    let i = len;
                    for (; i >= at; ) arr[i--] = arr[i];
                    return (arr[at] = v), arr;
                  }
                  let i = 0,
                    g = 0;
                  const out = new Array(len + 1);
                  for (; i < at; ) out[g++] = arr[i++];
                  for (out[at] = v; i < len; ) out[++g] = arr[i++];
                  return out;
                })(canEdit, indx, _newChild, children)
              )
          : this;
      }
      const current = children[indx],
        child = current.modify(edit, shift + 5, f, hash, key, size);
      if (current === child) return this;
      let newChildren,
        bitmap = mask;
      if (isEmptyNode(child)) {
        if (((bitmap &= ~bit), !bitmap)) return new EmptyNode();
        if (
          children.length <= 2 &&
          (isEmptyNode((node = children[1 ^ indx])) ||
            "LeafNode" === node._tag ||
            "CollisionNode" === node._tag)
        )
          return children[1 ^ indx];
        newChildren = arraySpliceOut(canEdit, indx, children);
      } else newChildren = arrayUpdate(canEdit, indx, child, children);
      var node;
      return canEdit
        ? ((this.mask = bitmap), (this.children = newChildren), this)
        : new IndexedNode(edit, bitmap, newChildren);
    }
  }
  class ArrayNode {
    constructor(edit, size, children) {
      (this.edit = edit),
        (this.size = size),
        (this.children = children),
        (this._tag = "ArrayNode");
    }
    modify(edit, shift, f, hash, key, size) {
      let count = this.size;
      const children = this.children,
        frag = hashFragment(shift, hash),
        child = children[frag],
        newChild = (child || new EmptyNode()).modify(
          edit,
          shift + 5,
          f,
          hash,
          key,
          size
        );
      if (child === newChild) return this;
      const canEdit = canEditNode(this, edit);
      let newChildren;
      if (isEmptyNode(child) && !isEmptyNode(newChild))
        ++count, (newChildren = arrayUpdate(canEdit, frag, newChild, children));
      else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
        if ((--count, count <= MIN_ARRAY_NODE))
          return (function (edit, count, removed, elements) {
            const children = new Array(count - 1);
            let g = 0,
              bitmap = 0;
            for (let i = 0, len = elements.length; i < len; ++i)
              if (i !== removed) {
                const elem = elements[i];
                elem &&
                  !isEmptyNode(elem) &&
                  ((children[g++] = elem), (bitmap |= 1 << i));
              }
            return new IndexedNode(edit, bitmap, children);
          })(edit, count, frag, children);
        newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children);
      } else newChildren = arrayUpdate(canEdit, frag, newChild, children);
      return canEdit
        ? ((this.size = count), (this.children = newChildren), this)
        : new ArrayNode(edit, count, newChildren);
    }
  }
  function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
    if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1]);
    const subH1 = hashFragment(shift, h1),
      subH2 = hashFragment(shift, h2);
    if (subH1 === subH2)
      return (child) =>
        new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child]);
    {
      const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
      return new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), children);
    }
  }
  function mergeLeaves(edit, shift, h1, n1, h2, n2) {
    let stack,
      currentShift = shift;
    for (;;) {
      const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
      if ("function" != typeof res) {
        let final = res;
        for (; null != stack; )
          (final = stack.value(final)), (stack = stack.previous);
        return final;
      }
      (stack = new Stack(res, stack)), (currentShift += 5);
    }
  }
  const HashMapTypeId = Symbol.for("@effect/data/HashMap");
  class HashMapImpl {
    constructor(_editable, _edit, _root, _size) {
      (this._editable = _editable),
        (this._edit = _edit),
        (this._root = _root),
        (this._size = _size),
        (this._id = HashMapTypeId);
    }
    [Symbol.iterator]() {
      return new HashMapIterator(this, (k, v) => [k, v]);
    }
    [symbol]() {
      let hash = Hash_hash("HashMap");
      for (const item of this)
        hash ^= combine(Hash_hash(item[0]))(Hash_hash(item[1]));
      return hash;
    }
    [Equal_symbol](that) {
      if (isHashMap(that)) {
        if (that._size !== this._size) return !1;
        for (const item of this) {
          const elem = getHash(item[0], Hash_hash(item[0]))(that);
          if (Option_isNone(elem)) return !1;
          if (!equals(item[1], elem.value)) return !1;
        }
        return !0;
      }
      return !1;
    }
    toString() {
      return `HashMap(${Array.from(this)
        .map(([k, v]) => `[${String(k)}, ${String(v)}]`)
        .join(", ")})`;
    }
    toJSON() {
      return { _tag: "HashMap", values: Array.from(this) };
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.toJSON();
    }
  }
  class HashMapIterator {
    constructor(map, f) {
      (this.map = map),
        (this.f = f),
        (this.v = visitLazy(this.map._root, this.f, void 0));
    }
    next() {
      if (Option_isNone(this.v)) return { done: !0, value: void 0 };
      const v0 = this.v.value;
      return (this.v = applyCont(v0.cont)), { done: !1, value: v0.value };
    }
    [Symbol.iterator]() {
      return new HashMapIterator(this.map, this.f);
    }
  }
  const applyCont = (cont) =>
      cont
        ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4])
        : Option_none(),
    visitLazy = (node, f, cont) => {
      switch (node._tag) {
        case "LeafNode":
          return Option_isSome(node.value)
            ? Option_some({ value: f(node.key, node.value.value), cont })
            : applyCont(cont);
        case "CollisionNode":
        case "ArrayNode":
        case "IndexedNode": {
          const children = node.children;
          return visitLazyChildren(children.length, children, 0, f, cont);
        }
        default:
          return applyCont(cont);
      }
    },
    visitLazyChildren = (len, children, i, f, cont) => {
      for (; i < len; ) {
        const child = children[i++];
        if (child && !isEmptyNode(child))
          return visitLazy(child, f, [len, children, i, f, cont]);
      }
      return applyCont(cont);
    },
    HashMap_empty = () => new HashMapImpl(!1, 0, new EmptyNode(), 0),
    isHashMap = (u) =>
      "object" == typeof u &&
      null != u &&
      "_id" in u &&
      u._id === HashMapTypeId,
    getHash = Function_dual(3, (self, key, hash) => {
      let node = self._root,
        shift = 0;
      for (;;)
        switch (node._tag) {
          case "LeafNode":
            return equals(key, node.key) ? node.value : Option_none();
          case "CollisionNode":
            if (hash === node.hash) {
              const children = node.children;
              for (let i = 0, len = children.length; i < len; ++i) {
                const child = children[i];
                if ("key" in child && equals(key, child.key))
                  return child.value;
              }
            }
            return Option_none();
          case "IndexedNode": {
            const bit = toBitmap(hashFragment(shift, hash));
            if (node.mask & bit) {
              (node = node.children[fromBitmap(node.mask, bit)]), (shift += 5);
              break;
            }
            return Option_none();
          }
          case "ArrayNode":
            if (((node = node.children[hashFragment(shift, hash)]), node)) {
              shift += 5;
              break;
            }
            return Option_none();
          default:
            return Option_none();
        }
    }),
    set = Function_dual(3, (self, key, value) =>
      modifyAt(self, key, () => Option_some(value))
    ),
    setTree = Function_dual(3, (self, newRoot, newSize) =>
      self._editable
        ? ((self._root = newRoot), (self._size = newSize), self)
        : newRoot === self._root
        ? self
        : new HashMapImpl(self._editable, self._edit, newRoot, newSize)
    ),
    keys = (self) => new HashMapIterator(self, (key) => key),
    HashMap_size = (self) => self._size,
    beginMutation = (self) =>
      new HashMapImpl(!0, self._edit + 1, self._root, self._size),
    modifyAt = Function_dual(3, (self, key, f) =>
      modifyHash(self, key, Hash_hash(key), f)
    ),
    modifyHash = Function_dual(4, (self, key, hash, f) => {
      const size = { value: self._size },
        newRoot = self._root.modify(
          self._editable ? self._edit : NaN,
          0,
          f,
          hash,
          key,
          size
        );
      return setTree(newRoot, size.value)(self);
    }),
    forEachWithIndex = Function_dual(2, (self, f) =>
      HashMap_reduceWithIndex(self, void 0, (_, value, key) => f(value, key))
    ),
    HashMap_reduceWithIndex = Function_dual(3, (self, zero, f) => {
      const root = self._root;
      if ("LeafNode" === root._tag)
        return Option_isSome(root.value)
          ? f(zero, root.value.value, root.key)
          : zero;
      if ("EmptyNode" === root._tag) return zero;
      const toVisit = [root.children];
      let children;
      for (; (children = toVisit.pop()); )
        for (let i = 0, len = children.length; i < len; ) {
          const child = children[i++];
          child &&
            !isEmptyNode(child) &&
            ("LeafNode" === child._tag
              ? Option_isSome(child.value) &&
                (zero = f(zero, child.value.value, child.key))
              : toVisit.push(child.children));
        }
      return zero;
    }),
    HashSetTypeId = Symbol.for("@effect/data/HashSet");
  class HashSetImpl {
    constructor(_keyMap) {
      (this._keyMap = _keyMap), (this._id = HashSetTypeId);
    }
    [Symbol.iterator]() {
      return keys(this._keyMap);
    }
    [symbol]() {
      return combine(Hash_hash(this._keyMap))(Hash_hash("HashSet"));
    }
    [Equal_symbol](that) {
      return (
        !!isHashSet(that) &&
        HashMap_size(this._keyMap) === HashMap_size(that._keyMap) &&
        equals(this._keyMap, that._keyMap)
      );
    }
    toString() {
      return `HashSet(${Array.from(this).map(String).join(", ")})`;
    }
    toJSON() {
      return { _tag: "HashSet", values: Array.from(this) };
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.toJSON();
    }
  }
  const isHashSet = (u) =>
      "object" == typeof u &&
      null != u &&
      "_id" in u &&
      u._id === HashSetTypeId,
    HashSet_empty = () => new HashSetImpl(HashMap_empty()),
    HashSet_beginMutation = (self) =>
      new HashSetImpl(beginMutation(self._keyMap)),
    HashSet_endMutation = (self) => ((self._keyMap._editable = !1), self),
    HashSet_mutate = Function_dual(2, (self, f) => {
      const transient = HashSet_beginMutation(self);
      return f(transient), HashSet_endMutation(transient);
    }),
    HashSet_add = Function_dual(2, (self, value) =>
      self._keyMap._editable
        ? (set(value, !0)(self._keyMap), self)
        : new HashSetImpl(set(value, !0)(self._keyMap))
    ),
    HashSet_union = Function_dual(2, (self, that) =>
      HashSet_mutate(HashSet_empty(), (set) => {
        HashSet_forEach(self, (value) => HashSet_add(set, value));
        for (const value of that) HashSet_add(set, value);
      })
    ),
    HashSet_forEach = Function_dual(2, (self, f) =>
      forEachWithIndex(self._keyMap, (_, k) => f(k))
    );
  const mjs_HashSet_empty = HashSet_empty,
    mjs_HashSet_size = (self) => HashMap_size(self._keyMap),
    mjs_HashSet_add = HashSet_add,
    mjs_HashSet_union = HashSet_union;
  const DifferTypeId = Symbol.for("@effect/data/Differ");
  class DifferImpl {
    constructor(params) {
      (this._id = DifferTypeId),
        (this._P = Function_identity),
        (this._V = Function_identity),
        (this.empty = params.empty),
        (this.diff = params.diff),
        (this.combine = params.combine),
        (this.patch = params.patch);
    }
  }
  const Differ_make = (params) => new DifferImpl(params),
    updateWith = (f) =>
      Differ_make({
        empty: Function_identity,
        combine: (first, second) =>
          first === Function_identity
            ? second
            : second === Function_identity
            ? first
            : (a) => second(first(a)),
        diff: (oldValue, newValue) =>
          equals(oldValue, newValue) ? Function_identity : constant(newValue),
        patch: (patch, oldValue) => f(oldValue, patch(oldValue)),
      }),
    Differ_diff = Function_dual(3, (self, oldValue, newValue) =>
      self.diff(oldValue, newValue)
    ),
    Differ_combine = Function_dual(3, (self, first, second) =>
      self.combine(first, second)
    ),
    Differ_patch = Function_dual(3, (self, patch, oldValue) =>
      self.patch(patch, oldValue)
    ),
    Differ_environment = () =>
      Differ_make({
        empty: Differ_ContextPatch_empty(),
        combine: (first, second) => Differ_ContextPatch_combine(second)(first),
        diff: (oldValue, newValue) =>
          Differ_ContextPatch_diff(oldValue, newValue),
        patch: (patch, oldValue) => Differ_ContextPatch_patch(oldValue)(patch),
      }),
    Differ_update = () => updateWith((_, a) => a);
  class MutableRefImpl {
    constructor(current) {
      (this.current = current),
        (this._T = (_) => _),
        (this._id = MutableRef_TypeId);
    }
    toString() {
      return `MutableRef(${String(this.current)})`;
    }
    toJSON() {
      return { _tag: "MutableRef", current: this.current };
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.toJSON();
    }
  }
  const FiberIdTypeId = Symbol.for("@effect/io/Fiber/Id");
  class fiberId_None {
    constructor() {
      (this[fiberId_a] = FiberIdTypeId), (this._tag = "None");
    }
    [(FiberIdTypeId, symbol)]() {
      return combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Id"));
    }
    [Equal_symbol](that) {
      return isFiberId(that) && "None" === that._tag;
    }
  }
  class Runtime {
    constructor(id, startTimeMillis) {
      (this.id = id),
        (this.startTimeMillis = startTimeMillis),
        (this[fiberId_b] = FiberIdTypeId),
        (this._tag = "Runtime");
    }
    [(FiberIdTypeId, symbol)]() {
      return combine(Hash_hash(this.startTimeMillis))(
        combine(Hash_hash(this.id))(
          combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Id"))
        )
      );
    }
    [Equal_symbol](that) {
      return (
        isFiberId(that) &&
        "Runtime" === that._tag &&
        this.id === that.id &&
        this.startTimeMillis === that.startTimeMillis
      );
    }
  }
  class Composite {
    constructor(left, right) {
      (this.left = left),
        (this.right = right),
        (this[_c] = FiberIdTypeId),
        (this._tag = "Composite");
    }
    [(FiberIdTypeId, symbol)]() {
      return combine(Hash_hash(this.right))(
        combine(Hash_hash(this.left))(
          combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Id"))
        )
      );
    }
    [Equal_symbol](that) {
      return (
        isFiberId(that) &&
        "Composite" === that._tag &&
        equals(this.left, that.left) &&
        equals(this.right, that.right)
      );
    }
  }
  const CauseTypeId = Symbol.for("@effect/io/Cause"),
    proto = {
      [CauseTypeId]: { _E: (_) => _ },
      [symbol]() {
        return combine(Hash_hash(flattenCause(this)))(
          Hash_hash("@effect/io/Cause")
        );
      },
      [Equal_symbol](that) {
        return isCause(that) && causeEquals(this, that);
      },
    },
    cause_empty = (() => {
      const o = Object.create(proto);
      return (o._tag = "Empty"), o;
    })(),
    die = (defect) => {
      const o = Object.create(proto);
      return (o._tag = "Die"), (o.defect = defect), o;
    },
    interrupt = (fiberId) => {
      const o = Object.create(proto);
      return (o._tag = "Interrupt"), (o.fiberId = fiberId), o;
    },
    annotated = (cause, annotation) => {
      const o = Object.create(proto);
      return (
        (o._tag = "Annotated"),
        (o.cause = cause),
        (o.annotation = annotation),
        o
      );
    },
    parallel = (left, right) => {
      const o = Object.create(proto);
      return (o._tag = "Parallel"), (o.left = left), (o.right = right), o;
    },
    sequential = (left, right) => {
      const o = Object.create(proto);
      return (o._tag = "Sequential"), (o.left = left), (o.right = right), o;
    },
    isCause = (u) => "object" == typeof u && null != u && CauseTypeId in u,
    isEmptyType = (self) => "Empty" === self._tag,
    cause_failures = (self) =>
      Chunk_reverse(
        cause_reduce(self, Chunk_empty(), (list, cause) =>
          "Fail" === cause._tag
            ? Option_some(Chunk_prepend(cause.error)(list))
            : Option_none()
        )
      ),
    cause_defects = (self) =>
      Chunk_reverse(
        cause_reduce(self, Chunk_empty(), (list, cause) =>
          "Die" === cause._tag
            ? Option_some(Chunk_prepend(cause.defect)(list))
            : Option_none()
        )
      ),
    causeEquals = (left, right) => {
      let leftStack = Chunk_of(left),
        rightStack = Chunk_of(right);
      for (; Chunk_isNonEmpty(leftStack) && Chunk_isNonEmpty(rightStack); ) {
        const [leftParallel, leftSequential] = cause_reduce(
            [mjs_HashSet_empty(), Chunk_empty()],
            ([parallel, sequential], cause) => {
              const [par, seq] = evaluateCause(cause);
              return Option_some([
                mjs_HashSet_union(par)(parallel),
                Chunk_concat(seq)(sequential),
              ]);
            }
          )(Chunk_headNonEmpty(leftStack)),
          [rightParallel, rightSequential] = cause_reduce(
            [mjs_HashSet_empty(), Chunk_empty()],
            ([parallel, sequential], cause) => {
              const [par, seq] = evaluateCause(cause);
              return Option_some([
                mjs_HashSet_union(par)(parallel),
                Chunk_concat(seq)(sequential),
              ]);
            }
          )(Chunk_headNonEmpty(rightStack));
        if (!equals(leftParallel, rightParallel)) return !1;
        (leftStack = leftSequential), (rightStack = rightSequential);
      }
      return !0;
    },
    flattenCause = (cause) => flattenCauseLoop(Chunk_of(cause), Chunk_empty()),
    flattenCauseLoop = (causes, flattened) => {
      for (;;) {
        const [parallel, sequential] = Chunk_reduce(
            [mjs_HashSet_empty(), Chunk_empty()],
            ([parallel, sequential], cause) => {
              const [par, seq] = evaluateCause(cause);
              return [
                mjs_HashSet_union(par)(parallel),
                Chunk_concat(seq)(sequential),
              ];
            }
          )(causes),
          updated =
            mjs_HashSet_size(parallel) > 0
              ? Chunk_prepend(parallel)(flattened)
              : flattened;
        if (Chunk_isEmpty(sequential)) return Chunk_reverse(updated);
        (causes = sequential), (flattened = updated);
      }
      throw new Error(
        "BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues"
      );
    },
    evaluateCause = (self) => {
      let cause = self;
      const stack = [];
      let _parallel = mjs_HashSet_empty(),
        _sequential = Chunk_empty();
      for (; void 0 !== cause; )
        switch (cause._tag) {
          case "Empty":
            if (0 === stack.length) return [_parallel, _sequential];
            cause = stack.pop();
            break;
          case "Fail":
            if (0 === stack.length)
              return [mjs_HashSet_add(cause.error)(_parallel), _sequential];
            (_parallel = mjs_HashSet_add(cause.error)(_parallel)),
              (cause = stack.pop());
            break;
          case "Die":
            if (0 === stack.length)
              return [mjs_HashSet_add(cause.defect)(_parallel), _sequential];
            (_parallel = mjs_HashSet_add(cause.defect)(_parallel)),
              (cause = stack.pop());
            break;
          case "Interrupt":
            if (0 === stack.length)
              return [mjs_HashSet_add(cause.fiberId)(_parallel), _sequential];
            (_parallel = mjs_HashSet_add(cause.fiberId)(_parallel)),
              (cause = stack.pop());
            break;
          case "Annotated":
            cause = cause.cause;
            break;
          case "Sequential":
            switch (cause.left._tag) {
              case "Empty":
                cause = cause.right;
                break;
              case "Sequential":
                cause = sequential(
                  cause.left.left,
                  sequential(cause.left.right, cause.right)
                );
                break;
              case "Parallel":
                cause = parallel(
                  sequential(cause.left.left, cause.right),
                  sequential(cause.left.right, cause.right)
                );
                break;
              case "Annotated":
                cause = sequential(cause.left.cause, cause.right);
                break;
              default:
                (_sequential = Chunk_prepend(cause.right)(_sequential)),
                  (cause = cause.left);
            }
            break;
          case "Parallel":
            stack.push(cause.right), (cause = cause.left);
        }
      throw new Error(
        "BUG: Cause.evaluateCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues"
      );
    },
    cause_match = Function_dual(
      8,
      (
        self,
        emptyCase,
        failCase,
        dieCase,
        interruptCase,
        annotatedCase,
        sequentialCase,
        parallelCase
      ) =>
        reduceWithContext(self, void 0, {
          emptyCase: () => emptyCase,
          failCase: (_, error) => failCase(error),
          dieCase: (_, defect) => dieCase(defect),
          interruptCase: (_, fiberId) => interruptCase(fiberId),
          annotatedCase: (_, value, annotation) =>
            annotatedCase(value, annotation),
          sequentialCase: (_, left, right) => sequentialCase(left, right),
          parallelCase: (_, left, right) => parallelCase(left, right),
        })
    ),
    cause_reduce = Function_dual(3, (self, zero, pf) => {
      let accumulator = zero,
        cause = self;
      const causes = [];
      for (; void 0 !== cause; ) {
        const option = pf(accumulator, cause);
        switch (
          ((accumulator = Option_isSome(option) ? option.value : accumulator),
          cause._tag)
        ) {
          case "Sequential":
          case "Parallel":
            causes.push(cause.right), (cause = cause.left);
            break;
          case "Annotated":
            cause = cause.cause;
            break;
          default:
            cause = void 0;
        }
        void 0 === cause && causes.length > 0 && (cause = causes.pop());
      }
      return accumulator;
    }),
    reduceWithContext = Function_dual(3, (self, context, reducer) => {
      const input = [self],
        output = [];
      for (; input.length > 0; ) {
        const cause = input.pop();
        switch (cause._tag) {
          case "Empty":
            output.push(Either_right(reducer.emptyCase(context)));
            break;
          case "Fail":
            output.push(Either_right(reducer.failCase(context, cause.error)));
            break;
          case "Die":
            output.push(Either_right(reducer.dieCase(context, cause.defect)));
            break;
          case "Interrupt":
            output.push(
              Either_right(reducer.interruptCase(context, cause.fiberId))
            );
            break;
          case "Annotated":
            input.push(cause.cause),
              output.push(
                Either_left({
                  _tag: "AnnotatedCase",
                  annotation: cause.annotation,
                })
              );
            break;
          case "Sequential":
            input.push(cause.right),
              input.push(cause.left),
              output.push(Either_left({ _tag: "SequentialCase" }));
            break;
          case "Parallel":
            input.push(cause.right),
              input.push(cause.left),
              output.push(Either_left({ _tag: "ParallelCase" }));
        }
      }
      const accumulator = [];
      for (; output.length > 0; ) {
        const either = output.pop();
        switch (either._tag) {
          case "Left":
            switch (either.left._tag) {
              case "SequentialCase": {
                const left = accumulator.pop(),
                  right = accumulator.pop(),
                  value = reducer.sequentialCase(context, left, right);
                accumulator.push(value);
                break;
              }
              case "ParallelCase": {
                const left = accumulator.pop(),
                  right = accumulator.pop(),
                  value = reducer.parallelCase(context, left, right);
                accumulator.push(value);
                break;
              }
              case "AnnotatedCase": {
                const cause = accumulator.pop(),
                  value = reducer.annotatedCase(
                    context,
                    cause,
                    either.left.annotation
                  );
                accumulator.push(value);
                break;
              }
            }
            break;
          case "Right":
            accumulator.push(either.right);
        }
      }
      if (0 === accumulator.length)
        throw new Error(
          "BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/io/issues"
        );
      return accumulator.pop();
    }),
    StackAnnotationTypeId = Symbol.for("@effect/io/Cause/StackAnnotation");
  var core_a, core_b, core_c;
  const core_EffectTypeId = Symbol.for("@effect/io/Effect");
  class EffectPrimitive {
    constructor(_tag) {
      (this._tag = _tag),
        (this.i0 = void 0),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this.trace = void 0),
        (this[core_a] = core_effectVariance);
    }
    [((core_a = core_EffectTypeId), Equal_symbol)](that) {
      return this === that;
    }
    [symbol]() {
      return random(this);
    }
    traced(trace) {
      if (trace) {
        const effect = new EffectPrimitive("Traced");
        return (effect.i0 = this), (effect.trace = trace), effect;
      }
      return this;
    }
  }
  class EffectPrimitiveFailure {
    constructor(_tag) {
      (this._tag = _tag),
        (this.i0 = void 0),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this.trace = void 0),
        (this[core_b] = core_effectVariance);
    }
    [((core_b = core_EffectTypeId), Equal_symbol)](that) {
      return this === that;
    }
    [symbol]() {
      return random(this);
    }
    get cause() {
      return this.i0;
    }
    traced(trace) {
      if (trace) {
        const effect = new EffectPrimitive("Traced");
        return (effect.i0 = this), (effect.trace = trace), effect;
      }
      return this;
    }
  }
  class EffectPrimitiveSuccess {
    constructor(_tag) {
      (this._tag = _tag),
        (this.i0 = void 0),
        (this.i1 = void 0),
        (this.i2 = void 0),
        (this.trace = void 0),
        (this[core_c] = core_effectVariance);
    }
    [((core_c = core_EffectTypeId), Equal_symbol)](that) {
      return this === that;
    }
    [symbol]() {
      return random(this);
    }
    get value() {
      return this.i0;
    }
    traced(trace) {
      if (trace) {
        const effect = new EffectPrimitive("Traced");
        return (effect.i0 = this), (effect.trace = trace), effect;
      }
      return this;
    }
  }
  const core_effectVariance = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
    core_either = methodWithTrace(
      (trace) => (self) =>
        matchEffect(
          (e) => succeed(Either_left(e)),
          (a) => succeed(Either_right(a))
        )(self).traced(trace)
    ),
    failCause = methodWithTrace((trace) => (cause) => {
      const effect = new EffectPrimitiveFailure("Failure");
      return (effect.i0 = cause), trace ? effect.traced(trace) : effect;
    }),
    core_flatMap = dualWithTrace(2, (trace, restore) => (self, f) => {
      const effect = new EffectPrimitive("OnSuccess");
      return (
        (effect.i0 = self),
        (effect.i1 = restore(f)),
        trace ? effect.traced(trace) : effect
      );
    }),
    matchCauseEffect = dualWithTrace(
      3,
      (trace, restore) => (self, onFailure, onSuccess) => {
        const effect = new EffectPrimitive("OnSuccessAndFailure");
        return (
          (effect.i0 = self),
          (effect.i1 = restore(onFailure)),
          (effect.i2 = restore(onSuccess)),
          trace ? effect.traced(trace) : effect
        );
      }
    ),
    matchEffect = dualWithTrace(
      3,
      (trace, restore) => (self, onFailure, onSuccess) =>
        matchCauseEffect(
          self,
          (cause) => {
            const failures = cause_failures(cause);
            return cause_defects(cause).length > 0
              ? failCause(
                  ((self) =>
                    cause_match(
                      self,
                      cause_empty,
                      (failure) => die(failure),
                      (defect) => die(defect),
                      (fiberId) => interrupt(fiberId),
                      (cause, annotation) =>
                        isEmptyType(cause)
                          ? cause
                          : annotated(cause, annotation),
                      (left, right) => sequential(left, right),
                      (left, right) => parallel(left, right)
                    ))(cause)
                )
              : failures.length > 0
              ? restore(onFailure)(unsafeHead(failures))
              : failCause(cause);
          },
          onSuccess
        ).traced(trace)
    ),
    forEachDiscard = dualWithTrace(
      2,
      (trace, restore) => (self, f) =>
        suspend(() => {
          const arr = Array.from(self);
          let i = 0;
          return whileLoop(
            () => i < arr.length,
            () => restore(f)(arr[i++]),
            () => {}
          );
        }).traced(trace)
    ),
    core_map = dualWithTrace(
      2,
      (trace, restore) => (self, f) =>
        core_flatMap((a) => sync(() => restore(f)(a)))(self).traced(trace)
    ),
    succeed = methodWithTrace((trace) => (value) => {
      const effect = new EffectPrimitiveSuccess("Success");
      return (effect.i0 = value), trace ? effect.traced(trace) : effect;
    }),
    suspend = methodWithTrace(
      (trace, restore) => (effect) =>
        core_flatMap(Function_identity)(sync(restore(effect))).traced(trace)
    ),
    sync = methodWithTrace((trace, restore) => (evaluate) => {
      const effect = new EffectPrimitive("Sync");
      return (
        (effect.i0 = restore(evaluate)), trace ? effect.traced(trace) : effect
      );
    }),
    core_unit = methodWithTrace(
      (trace) => (_) => succeed(void 0).traced(trace)
    ),
    whileLoop = methodWithTrace((trace, restore) => (check, body, process) => {
      const effect = new EffectPrimitive("While");
      return (
        (effect.i0 = restore(check)),
        (effect.i1 = restore(body)),
        (effect.i2 = restore(process)),
        trace ? effect.traced(trace) : effect
      );
    }),
    withFiberRuntime = methodWithTrace((trace, restore) => (withRuntime) => {
      const effect = new EffectPrimitive("WithRuntime");
      return (
        (effect.i0 = restore(withRuntime)),
        trace ? effect.traced(trace) : effect
      );
    }),
    logLevelAll = {
      _tag: "All",
      syslog: 0,
      label: "ALL",
      ordinal: Number.MIN_SAFE_INTEGER,
    },
    logLevelInfo = { _tag: "Info", syslog: 6, label: "INFO", ordinal: 2e4 },
    logLevelDebug = { _tag: "Debug", syslog: 7, label: "DEBUG", ordinal: 1e4 },
    logLevelNone = {
      _tag: "None",
      syslog: 7,
      label: "OFF",
      ordinal: Number.MAX_SAFE_INTEGER,
    },
    FiberRefTypeId = Symbol.for("@effect/io/FiberRef"),
    fiberRefVariance = { _A: (_) => _ },
    fiberRefGet = methodWithTrace(
      (trace) => (self) => fiberRefModify(self, (a) => [a, a]).traced(trace)
    ),
    fiberRefModify = dualWithTrace(
      2,
      (trace, restore) => (self, f) =>
        withFiberRuntime((state) => {
          const [b, a] = restore(f)(state.getFiberRef(self));
          return state.setFiberRef(self, a), succeed(b);
        }).traced(trace)
    ),
    fiberRefUnsafeMake = (
      initial,
      fork = Function_identity,
      join = (_, a) => a
    ) => fiberRefUnsafeMakePatch(initial, Differ_update(), fork, join),
    fiberRefUnsafeMakeContext = (initial) =>
      fiberRefUnsafeMakePatch(
        initial,
        Differ_environment(),
        Differ_ContextPatch_empty()
      ),
    fiberRefUnsafeMakePatch = (initial, differ, fork, join = (_, n) => n) => ({
      [FiberRefTypeId]: fiberRefVariance,
      initial,
      diff: (oldValue, newValue) => Differ_diff(oldValue, newValue)(differ),
      combine: (first, second) => Differ_combine(first, second)(differ),
      patch: (patch) => (oldValue) => Differ_patch(patch, oldValue)(differ),
      fork,
      join,
    }),
    currentContext = fiberRefUnsafeMakeContext(mjs_Context_empty());
  const ClockTypeId = Symbol.for("@effect/io/Clock");
  const ListTypeId = Symbol.for("@effect/data/List");
  class ConsImpl {
    constructor(head, tail) {
      (this.head = head),
        (this.tail = tail),
        (this._tag = "Cons"),
        (this[List_a] = listVariance);
    }
    toString() {
      return `List.Cons(${List_toReadonlyArray(this).map(String).join(", ")})`;
    }
    toJSON() {
      return { _tag: "List.Cons", values: List_toReadonlyArray(this) };
    }
    [(ListTypeId, Symbol.for("nodejs.util.inspect.custom"))]() {
      return this.toJSON();
    }
    [Equal_symbol](that) {
      return (
        isList(that) &&
        this._tag === that._tag &&
        equalsWith(this, that, equals)
      );
    }
    [symbol]() {
      return string("@effect/data/List");
    }
    [Symbol.iterator]() {
      let done = !1,
        self = this;
      return {
        next() {
          if (done) return this.return();
          if ("Nil" === self._tag) return (done = !0), this.return();
          const value = self.head;
          return (self = self.tail), { done, value };
        },
        return: (value) => (done || (done = !0), { done: !0, value }),
      };
    }
  }
  class NilImpl {
    constructor() {
      (this._tag = "Nil"), (this[List_b] = listVariance);
    }
    toString() {
      return "List.Nil";
    }
    toJSON() {
      return { _tag: "List.Nil" };
    }
    [(ListTypeId, Symbol.for("nodejs.util.inspect.custom"))]() {
      return this.toJSON();
    }
    [symbol]() {
      return array(Array.from(this));
    }
    [Equal_symbol](that) {
      return isList(that) && this._tag === that._tag;
    }
    [Symbol.iterator]() {
      return { next: () => ({ done: !0, value: void 0 }) };
    }
  }
  const RandomTypeId = Symbol.for("@effect/io/Random");
  const Duration_TypeId = Symbol.for("@effect/data/Duration");
  class DurationImpl {
    constructor(millis) {
      (this.millis = millis), (this._id = Duration_TypeId);
    }
    [symbol]() {
      return Hash_hash(this.millis);
    }
    [Equal_symbol](that) {
      return isDuration(that) && this.millis === that.millis;
    }
  }
  const isDuration = (u) =>
      "object" == typeof u &&
      null != u &&
      "_id" in u &&
      u._id === Duration_TypeId,
    zero = new DurationImpl(0);
  fromSemigroup(
    Semigroup_make(
      Function_dual(
        2,
        (self, that) => new DurationImpl(self.millis + that.millis)
      )
    ),
    zero
  ).combineAll;
  const FiberRefsSym = Symbol.for("@effect/io/FiberRefs");
  const MetricLabelTypeId = Symbol.for("@effect/io/Metric/Label");
  class MetricLabelImpl {
    constructor(key, value) {
      (this.key = key),
        (this.value = value),
        (this[label_a] = MetricLabelTypeId);
    }
    [(MetricLabelTypeId, symbol)]() {
      return combine(Hash_hash(this.value))(
        combine(Hash_hash(this.key))(Hash_hash("@effect/io/Metric/Label"))
      );
    }
    [Equal_symbol](that) {
      return (
        isMetricLabel(that) &&
        this.key === that.key &&
        this.value === that.value
      );
    }
  }
  class SingleShotGen {
    constructor(self) {
      (this.self = self), (this.called = !1);
    }
    next(a) {
      return this.called
        ? { value: a, done: !0 }
        : ((this.called = !0), { value: this.self, done: !1 });
    }
    return(a) {
      return { value: a, done: !0 };
    }
    throw(e) {
      throw e;
    }
    [Symbol.iterator]() {
      return new SingleShotGen(this.self);
    }
  }
  const All = logLevelAll,
    Fatal = { _tag: "Fatal", syslog: 2, label: "FATAL", ordinal: 5e4 },
    Level_Error = { _tag: "Error", syslog: 3, label: "ERROR", ordinal: 4e4 },
    Warning = { _tag: "Warning", syslog: 4, label: "WARN", ordinal: 3e4 },
    Info = logLevelInfo,
    Level_Debug = logLevelDebug,
    Trace = { _tag: "Trace", syslog: 7, label: "TRACE", ordinal: 0 },
    Level_None = logLevelNone,
    fromLiteral = (_) => {
      switch (_) {
        case "All":
          return All;
        case "Debug":
          return Level_Debug;
        case "Error":
          return Level_Error;
        case "Fatal":
          return Fatal;
        case "Info":
          return Info;
        case "Trace":
          return Trace;
        case "None":
          return Level_None;
        case "Warning":
          return Warning;
      }
    };
  const RefTypeId = Symbol.for("@effect/io/Ref");
  class EffectGen {
    constructor(value) {
      this.value = value;
    }
    [Symbol.iterator]() {
      return new SingleShotGen(this);
    }
  }
  class MutableHashMapImpl {
    constructor() {
      (this._id = MutableHashMap_TypeId),
        (this.backingMap = MutableRef_make(mjs_HashMap_empty()));
    }
    [Symbol.iterator]() {
      return this.backingMap.current[Symbol.iterator]();
    }
    toString() {
      return `MutableHashMap(${Array.from(this)
        .map(([k, v]) => `[${String(k)}, ${String(v)}]`)
        .join(", ")})`;
    }
    toJSON() {
      return { _tag: "MutableHashMap", values: Array.from(this) };
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.toJSON();
    }
  }
  const FiberStatusTypeId = Symbol.for("@effect/io/Fiber/Status");
  class Done {
    constructor() {
      (this[fiberStatus_a] = FiberStatusTypeId), (this._tag = "Done");
    }
    [(FiberStatusTypeId, symbol)]() {
      return combine(Hash_hash(this._tag))(
        Hash_hash("@effect/io/Fiber/Status")
      );
    }
    [Equal_symbol](that) {
      return isFiberStatus(that) && "Done" === that._tag;
    }
  }
  class Running {
    constructor(runtimeFlags) {
      (this.runtimeFlags = runtimeFlags),
        (this[fiberStatus_b] = FiberStatusTypeId),
        (this._tag = "Running");
    }
    [(FiberStatusTypeId, symbol)]() {
      return combine(Hash_hash(this.runtimeFlags))(
        combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Status"))
      );
    }
    [Equal_symbol](that) {
      return (
        isFiberStatus(that) &&
        "Running" === that._tag &&
        this.runtimeFlags === that.runtimeFlags
      );
    }
  }
  class Suspended {
    constructor(runtimeFlags, blockingOn) {
      (this.runtimeFlags = runtimeFlags),
        (this.blockingOn = blockingOn),
        (this[fiberStatus_c] = FiberStatusTypeId),
        (this._tag = "Suspended");
    }
    [(FiberStatusTypeId, symbol)]() {
      return combine(Hash_hash(this.blockingOn))(
        combine(Hash_hash(this.runtimeFlags))(
          combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Status"))
        )
      );
    }
    [Equal_symbol](that) {
      return (
        isFiberStatus(that) &&
        "Suspended" === that._tag &&
        this.runtimeFlags === that.runtimeFlags &&
        equals(this.blockingOn, that.blockingOn)
      );
    }
  }
  const FiberScopeTypeId = Symbol.for("@effect/io/Fiber/Scope");
  const FiberTypeId = Symbol.for("@effect/io/Fiber"),
    RuntimeFiberTypeId = Symbol.for("@effect/io/Fiber");
  class MutableListImpl {
    constructor() {
      (this._id = MutableList_TypeId),
        (this.head = void 0),
        (this.tail = void 0),
        (this._length = 0);
    }
    [Symbol.iterator]() {
      let done = !1,
        head = this.head;
      return {
        next() {
          if (done) return this.return();
          if (null == head) return (done = !0), this.return();
          const value = head.value;
          return (head = head.next), { done, value };
        },
        return: (value) => (done || (done = !0), { done: !0, value }),
      };
    }
    toString() {
      return `MutableList(${Array.from(this).map(String).join(", ")})`;
    }
    toJSON() {
      return { _tag: "MutableList", values: Array.from(this) };
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.toJSON();
    }
  }
  class MutableQueueImpl {
    constructor(capacity) {
      (this.capacity = capacity),
        (this._tag = "Bounded"),
        (this._id = MutableQueue_TypeId),
        (this.queue = new MutableListImpl());
    }
    [Symbol.iterator]() {
      return Array.from(this.queue)[Symbol.iterator]();
    }
    toString() {
      return `MutableQueue(${Array.from(this).map(String).join(", ")})`;
    }
    toJSON() {
      return { _tag: "MutableQueue", values: Array.from(this) };
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.toJSON();
    }
  }
  const MetricKeyTypeTypeId = Symbol.for("@effect/io/Metric/KeyType"),
    CounterKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Counter"),
    FrequencyKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Frequency"),
    GaugeKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Gauge"),
    HistogramKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Histogram"),
    SummaryKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Summary");
  class CounterKeyType {
    constructor() {
      (this[keyType_a] = metricKeyTypeVariance),
        (this[keyType_b] = CounterKeyTypeTypeId);
    }
    [(MetricKeyTypeTypeId, CounterKeyTypeTypeId, symbol)]() {
      return Hash_hash("effect/io/Metric/KeyType/Counter");
    }
    [Equal_symbol](that) {
      return isCounterKey(that);
    }
  }
  class FrequencyKeyType {
    constructor() {
      (this[keyType_c] = metricKeyTypeVariance),
        (this[_d] = FrequencyKeyTypeTypeId);
    }
    [(MetricKeyTypeTypeId, FrequencyKeyTypeTypeId, symbol)]() {
      return Hash_hash("effect/io/Metric/KeyType/Frequency");
    }
    [Equal_symbol](that) {
      return isFrequencyKey(that);
    }
  }
  class GaugeKeyType {
    constructor() {
      (this[_e] = metricKeyTypeVariance), (this[_f] = GaugeKeyTypeTypeId);
    }
    [(MetricKeyTypeTypeId, GaugeKeyTypeTypeId, symbol)]() {
      return Hash_hash("effect/io/Metric/KeyType/Gauge");
    }
    [Equal_symbol](that) {
      return isGaugeKey(that);
    }
  }
  class HistogramKeyType {
    constructor(boundaries) {
      (this.boundaries = boundaries),
        (this[_g] = metricKeyTypeVariance),
        (this[_h] = HistogramKeyTypeTypeId);
    }
    [(MetricKeyTypeTypeId, HistogramKeyTypeTypeId, symbol)]() {
      return combine(Hash_hash(this.boundaries))(
        Hash_hash("effect/io/Metric/KeyType/Histogram")
      );
    }
    [Equal_symbol](that) {
      return isHistogramKey(that) && equals(this.boundaries, that.boundaries);
    }
  }
  class SummaryKeyType {
    constructor(maxAge, maxSize, error, quantiles) {
      (this.maxAge = maxAge),
        (this.maxSize = maxSize),
        (this.error = error),
        (this.quantiles = quantiles),
        (this[_j] = metricKeyTypeVariance),
        (this[_k] = SummaryKeyTypeTypeId);
    }
    [(MetricKeyTypeTypeId, SummaryKeyTypeTypeId, symbol)]() {
      return Hash.combine(Hash.hash(this.quantiles))(
        Hash.combine(Hash.hash(this.error))(
          Hash.combine(Hash.hash(this.maxSize))(
            Hash.combine(Hash.hash(this.maxAge))(
              Hash.hash("effect/io/Metric/KeyType/Summary")
            )
          )
        )
      );
    }
    [Equal_symbol](that) {
      return (
        isSummaryKey(that) &&
        Equal.equals(this.maxAge, that.maxAge) &&
        this.maxSize === that.maxSize &&
        this.error === that.error &&
        Equal.equals(this.quantiles, that.quantiles)
      );
    }
  }
  const MetricKeyTypeId = Symbol.for("@effect/io/Metric/Key");
  class MetricKeyImpl {
    constructor(name, keyType, tags = mjs_HashSet_empty()) {
      (this.name = name),
        (this.keyType = keyType),
        (this.tags = tags),
        (this[key_a] = metricKeyVariance);
    }
    [(MetricKeyTypeId, symbol)]() {
      return combine(Hash_hash(this.tags))(
        combine(Hash_hash(this.keyType))(Hash_hash(this.name))
      );
    }
    [Equal_symbol](u) {
      return (
        isMetricKey(u) &&
        this.name === u.name &&
        equals(this.keyType, u.keyType) &&
        equals(this.tags, u.tags)
      );
    }
  }
  const MetricStateTypeId = Symbol.for("@effect/io/Metric/State"),
    CounterStateTypeId = Symbol.for("effect/io/Metric/State/Counter"),
    FrequencyStateTypeId = Symbol.for("effect/io/Metric/State/Frequency"),
    GaugeStateTypeId = Symbol.for("effect/io/Metric/State/Gauge"),
    HistogramStateTypeId = Symbol.for("effect/io/Metric/State/Histogram"),
    SummaryStateTypeId = Symbol.for("effect/io/Metric/State/Summary");
  class CounterState {
    constructor(count) {
      (this.count = count),
        (this[state_a] = metricStateVariance),
        (this[state_b] = CounterStateTypeId);
    }
    [(MetricStateTypeId, CounterStateTypeId, symbol)]() {
      return combine(Hash_hash(this.count))(
        Hash_hash("effect/io/Metric/State/Counter")
      );
    }
    [Equal_symbol](that) {
      return isCounterState(that) && this.count === that.count;
    }
  }
  class FrequencyState {
    constructor(occurrences) {
      (this.occurrences = occurrences),
        (this[state_c] = metricStateVariance),
        (this[state_d] = FrequencyStateTypeId);
    }
    [(MetricStateTypeId, FrequencyStateTypeId, symbol)]() {
      return combine(Hash_hash(this.occurrences))(
        Hash_hash("effect/io/Metric/State/Frequency")
      );
    }
    [Equal_symbol](that) {
      return (
        isFrequencyState(that) && equals(this.occurrences, that.occurrences)
      );
    }
  }
  class GaugeState {
    constructor(value) {
      (this.value = value),
        (this[state_e] = metricStateVariance),
        (this[state_f] = GaugeStateTypeId);
    }
    [(MetricStateTypeId, GaugeStateTypeId, symbol)]() {
      return combine(Hash_hash(this.value))(
        Hash_hash("effect/io/Metric/State/Gauge")
      );
    }
    [Equal_symbol](u) {
      return isGaugeState(u) && this.value === u.value;
    }
  }
  class HistogramState {
    constructor(buckets, count, min, max, sum) {
      (this.buckets = buckets),
        (this.count = count),
        (this.min = min),
        (this.max = max),
        (this.sum = sum),
        (this[state_g] = metricStateVariance),
        (this[state_h] = HistogramStateTypeId);
    }
    [(MetricStateTypeId, HistogramStateTypeId, symbol)]() {
      return combine(Hash_hash(this.sum))(
        combine(Hash_hash(this.max))(
          combine(Hash_hash(this.min))(
            combine(Hash_hash(this.count))(
              combine(Hash_hash(this.buckets))(
                Hash_hash("effect/io/Metric/State/Histogram")
              )
            )
          )
        )
      );
    }
    [Equal_symbol](that) {
      return (
        isHistogramState(that) &&
        equals(this.buckets, that.buckets) &&
        this.count === that.count &&
        this.min === that.min &&
        this.max === that.max &&
        this.sum === that.sum
      );
    }
  }
  class SummaryState {
    constructor(error, quantiles, count, min, max, sum) {
      (this.error = error),
        (this.quantiles = quantiles),
        (this.count = count),
        (this.min = min),
        (this.max = max),
        (this.sum = sum),
        (this[state_j] = metricStateVariance),
        (this[state_k] = SummaryStateTypeId);
    }
    [(MetricStateTypeId, SummaryStateTypeId, symbol)]() {
      return combine(Hash_hash(this.sum))(
        combine(Hash_hash(this.max))(
          combine(Hash_hash(this.min))(
            combine(Hash_hash(this.count))(
              combine(Hash_hash(this.quantiles))(
                combine(Hash_hash(this.error))(
                  Hash_hash("effect/io/Metric/State/Summary")
                )
              )
            )
          )
        )
      );
    }
    [Equal_symbol](that) {
      return (
        isSummaryState(that) &&
        this.error === that.error &&
        equals(this.quantiles, that.quantiles) &&
        this.count === that.count &&
        this.min === that.min &&
        this.max === that.max &&
        this.sum === that.sum
      );
    }
  }
  const MetricRegistryTypeId = Symbol.for("@effect/io/Metric/Registry");
  const MetricBoundariesTypeId = Symbol.for("@effect/io/Metric/Boundaries");
  class MetricBoundariesImpl {
    constructor(values) {
      (this.values = values), (this[boundaries_a] = MetricBoundariesTypeId);
    }
    [(MetricBoundariesTypeId, symbol)]() {
      return combine(Hash_hash(this.values))(
        Hash_hash("@effect/io/Metric/Boundaries")
      );
    }
    [Equal_symbol](u) {
      return isMetricBoundaries(u) && equals(this.values, u.values);
    }
  }
  const SupervisorTypeId = Symbol.for("@effect/io/Supervisor");
  class FiberRuntime {
    constructor(fiberId, fiberRefs0, runtimeFlags0) {
      if (
        ((this[fiberRuntime_a] = fiberVariance),
        (this[fiberRuntime_b] = runtimeFiberVariance),
        (this._queue = new MutableQueueImpl()),
        (this._children = null),
        (this._observers = new Array()),
        (this._running = !1),
        (this._stack = []),
        (this._asyncInterruptor = null),
        (this._asyncBlockingOn = null),
        (this._exitValue = null),
        (this._traceStack = []),
        (this.run = () => {
          this.drainQueueOnCurrentThread();
        }),
        (this._runtimeFlags = runtimeFlags0),
        (this._fiberId = fiberId),
        (this._fiberRefs = fiberRefs0),
        runtimeMetrics(runtimeFlags0))
      ) {
        const tags = this.getFiberRef(currentTags);
        fibersStarted.unsafeUpdate(1, tags);
      }
    }
    id() {
      return this._fiberId;
    }
    resume(effect) {
      this.tell(resume(effect));
    }
    status() {
      return this.ask((_, status) => status);
    }
    runtimeFlags() {
      return this.ask((state, status) =>
        Status_isDone(status) ? state._runtimeFlags : status.runtimeFlags
      );
    }
    scope() {
      return new Local(this.id(), fiber);
      var fiber;
    }
    children() {
      return this.ask((fiber) => Chunk_fromIterable(fiber.getChildren()));
    }
    getChildren() {
      return (
        null === this._children && (this._children = new Set()), this._children
      );
    }
    getSupervisor() {
      return this.getFiberRef(currentSupervisor);
    }
    getInterruptedCause() {
      return this.getFiberRef(interruptedCause);
    }
    fiberRefs() {
      return this.ask((fiber) => fiber.unsafeGetFiberRefs());
    }
    ask(f) {
      return untraced(() =>
        suspend(() => {
          const deferred = deferredUnsafeMake(this._fiberId);
          return (
            this.tell(
              stateful((fiber, status) => {
                deferredUnsafeDone(
                  deferred,
                  sync(() => f(fiber, status))
                );
              })
            ),
            deferredAwait(deferred)
          );
        })
      );
    }
    tell(message) {
      offer(message)(this._queue),
        this._running ||
          ((this._running = !0), this.drainQueueLaterOnExecutor());
    }
    await() {
      return untraced(() =>
        asyncInterrupt((resume) => {
          const cb = (exit) => resume(succeed(exit));
          return (
            this.tell(
              stateful((fiber, _) => {
                null !== fiber._exitValue
                  ? cb(this._exitValue)
                  : fiber.unsafeAddObserver(cb);
              })
            ),
            sync(() =>
              this.tell(
                stateful((fiber, _) => {
                  fiber.unsafeRemoveObserver(cb);
                })
              )
            )
          );
        }, this.id())
      );
    }
    inheritAll() {
      return untraced(() =>
        withFiberRuntime((parentFiber, parentStatus) => {
          const parentFiberId = parentFiber.id(),
            parentFiberRefs = parentFiber.unsafeGetFiberRefs(),
            parentRuntimeFlags = parentStatus.runtimeFlags,
            childFiberRefs = this.unsafeGetFiberRefs(),
            updatedFiberRefs = joinAs(
              parentFiberRefs,
              parentFiberId,
              childFiberRefs
            );
          parentFiber.setFiberRefs(updatedFiberRefs);
          const updatedRuntimeFlags =
              parentFiber.getFiberRef(currentRuntimeFlags),
            patch = Patch_exclude(16)(
              Patch_exclude(1)(
                runtimeFlags_diff(parentRuntimeFlags, updatedRuntimeFlags)
              )
            );
          return updateRuntimeFlags(patch);
        })
      );
    }
    poll() {
      return untraced(() => sync(() => fromNullable(this._exitValue)));
    }
    unsafePoll() {
      return this._exitValue;
    }
    interruptAsFork(fiberId) {
      return untraced(() =>
        sync(() => this.tell(interruptSignal(interrupt(fiberId))))
      );
    }
    unsafeAddObserver(observer) {
      null !== this._exitValue
        ? observer(this._exitValue)
        : this._observers.push(observer);
    }
    unsafeRemoveObserver(observer) {
      this._observers = this._observers.filter((o) => o !== observer);
    }
    unsafeGetFiberRefs() {
      return (
        this.setFiberRef(currentRuntimeFlags, this._runtimeFlags),
        this._fiberRefs
      );
    }
    unsafeDeleteFiberRef(fiberRef) {
      this._fiberRefs = delete_(this._fiberRefs, fiberRef);
    }
    getFiberRef(fiberRef) {
      return getOrDefault(this._fiberRefs, fiberRef);
    }
    setFiberRef(fiberRef, value) {
      this._fiberRefs = updatedAs(
        this._fiberRefs,
        this._fiberId,
        fiberRef,
        value
      );
    }
    setFiberRefs(fiberRefs) {
      this._fiberRefs = fiberRefs;
    }
    addChild(child) {
      this.getChildren().add(child);
    }
    removeChild(child) {
      this.getChildren().delete(child);
    }
    drainQueueOnCurrentThread() {
      let recurse = !0;
      for (; recurse; ) {
        let evaluationSignal = "Continue";
        const prev = globalThis[currentFiberURI];
        globalThis[currentFiberURI] = this;
        try {
          for (; "Continue" === evaluationSignal; )
            MutableQueue_isEmpty(this._queue)
              ? "Done"
              : this.evaluateMessageWhileSuspended(
                  MutableQueue_poll(null)(this._queue)
                );
        } finally {
          (this._running = !1), (globalThis[currentFiberURI] = prev);
        }
        MutableQueue_isEmpty(this._queue) || this._running
          ? !1
          : ((this._running = !0),
            "Yield" === evaluationSignal
              ? (this.drainQueueLaterOnExecutor(), !1)
              : !0);
      }
    }
    drainQueueLaterOnExecutor() {
      this.getFiberRef(currentScheduler).scheduleTask(this.run);
    }
    drainQueueWhileRunning(runtimeFlags, cur0) {
      let cur = cur0;
      for (; !MutableQueue_isEmpty(this._queue); ) {
        const message = MutableQueue_poll(void 0)(this._queue);
        drainQueueWhileRunningTable[message._tag](
          this,
          runtimeFlags,
          cur,
          message
        );
      }
      return cur;
    }
    isInterrupted() {
      return !cause_isEmpty(this.getFiberRef(interruptedCause));
    }
    addInterruptedCause(cause) {
      const oldSC = this.getFiberRef(interruptedCause);
      this.setFiberRef(interruptedCause, sequential(oldSC, cause));
    }
    processNewInterruptSignal(cause) {
      this.addInterruptedCause(cause), this.sendInterruptSignalToAllChildren();
    }
    sendInterruptSignalToAllChildren() {
      if (null === this._children || 0 === this._children.size) return !1;
      let told = !1;
      for (const child of this._children)
        child.tell(interruptSignal(interrupt(this.id()))), !0;
      return told;
    }
    interruptAllChildren() {
      if (this.sendInterruptSignalToAllChildren()) {
        const it = this._children.values();
        this._children = null;
        let isDone = !1;
        const body = () => {
          const next = it.next();
          return next.done
            ? sync(() => {
                !0;
              })
            : core_asUnit(next.value.await());
        };
        return whileLoop(
          () => !isDone,
          () => body(),
          () => {}
        );
      }
      return null;
    }
    reportExitValue(exit) {
      if (runtimeMetrics(this._runtimeFlags)) {
        const tags = this.getFiberRef(currentTags);
        switch (exit._tag) {
          case "Success":
            fiberSuccesses.unsafeUpdate(1, tags);
            break;
          case "Failure":
            fiberFailures.unsafeUpdate(1, tags);
        }
      }
      if ("Failure" === exit._tag) {
        const level = this.getFiberRef(unhandledErrorLogLevel);
        isInterruptedOnly(exit.cause) ||
          "Some" !== level._tag ||
          this.log(
            "Fiber terminated with a non handled error",
            exit.cause,
            level
          );
      }
    }
    setExitValue(exit) {
      if (((this._exitValue = exit), runtimeMetrics(this._runtimeFlags))) {
        const tags = this.getFiberRef(currentTags),
          startTimeMillis = this.id().startTimeMillis,
          endTimeMillis = new Date().getTime();
        fiberLifetimes.unsafeUpdate(
          (endTimeMillis - startTimeMillis) / 1e3,
          tags
        );
      }
      this.reportExitValue(exit);
      for (let i = this._observers.length - 1; i >= 0; i--)
        this._observers[i](exit);
    }
    getLoggers() {
      return this.getFiberRef(currentLoggers);
    }
    log(message, cause, overrideLogLevel) {
      const logLevel = Option_isSome(overrideLogLevel)
          ? overrideLogLevel.value
          : this.getFiberRef(currentLogLevel),
        spans = this.getFiberRef(currentLogSpan),
        annotations = this.getFiberRef(currentLogAnnotations),
        loggers = this.getLoggers(),
        contextMap = this.unsafeGetFiberRefs();
      mjs_HashSet_forEach((logger) => {
        logger.log(
          this.id(),
          logLevel,
          message,
          cause,
          contextMap,
          spans,
          annotations
        );
      })(loggers);
    }
    evaluateMessageWhileSuspended(message) {
      switch (message._tag) {
        case "YieldNow":
          return "Yield";
        case "InterruptSignal":
          return (
            this.processNewInterruptSignal(message.cause),
            null !== this._asyncInterruptor &&
              (this._asyncInterruptor(exitFailCause(message.cause)),
              (this._asyncInterruptor = null)),
            "Continue"
          );
        case "Resume":
          return (
            (this._asyncInterruptor = null),
            (this._asyncBlockingOn = null),
            this.evaluateEffect(message.effect),
            "Continue"
          );
        case "Stateful":
          return (
            message.onFiber(
              this,
              null !== this._exitValue
                ? Status_done
                : Status_suspended(this._runtimeFlags, this._asyncBlockingOn)
            ),
            "Continue"
          );
        default:
          return fiberRuntime_absurd(message);
      }
    }
    evaluateEffect(effect0) {
      this.getSupervisor().onResume(this);
      try {
        let effect =
          interruptible(this._runtimeFlags) && this.isInterrupted()
            ? exitFailCause(this.getInterruptedCause())
            : effect0;
        for (; null !== effect; )
          try {
            const exit = this.runLoop(effect);
            this._runtimeFlags = runtimeFlags_enable(16)(this._runtimeFlags);
            const interruption = this.interruptAllChildren();
            null !== interruption
              ? untraced(() => core_flatMap(interruption, () => exit))
              : (MutableQueue_isEmpty(this._queue)
                  ? this.setExitValue(exit)
                  : this.tell(resume(exit)),
                null);
          } catch (e) {
            if (!isEffect(e)) throw e;
            "Yield" === e._tag
              ? (this._runtimeFlags,
                runtimeFlags_isEnabled(self, 32)
                  ? (this.tell({ _tag: "YieldNow" }),
                    this.tell(resume(exitUnit())),
                    null)
                  : exitUnit())
              : "Async" === e._tag && null;
          }
      } finally {
        this.getSupervisor().onSuspend(this);
      }
      var self;
    }
    start(effect) {
      if (this._running) this.tell(resume(effect));
      else {
        this._running = !0;
        const prev = globalThis[currentFiberURI];
        globalThis[currentFiberURI] = this;
        try {
          this.evaluateEffect(effect);
        } finally {
          (this._running = !1),
            (globalThis[currentFiberURI] = prev),
            MutableQueue_isEmpty(this._queue) ||
              this.drainQueueLaterOnExecutor();
        }
      }
    }
    startFork(effect) {
      this.tell(resume(effect));
    }
    patchRuntimeFlags(oldRuntimeFlags, patch) {
      const newRuntimeFlags = runtimeFlags_patch(oldRuntimeFlags, patch);
      return (
        (globalThis[currentFiberURI] = this),
        (this._runtimeFlags = newRuntimeFlags),
        newRuntimeFlags
      );
    }
    initiateAsync(runtimeFlags, asyncRegister) {
      let alreadyCalled = !1;
      const callback = (effect) => {
        alreadyCalled || (!0, this.tell(resume(effect)));
      };
      interruptible(runtimeFlags) && (this._asyncInterruptor = callback);
      try {
        asyncRegister(callback);
      } catch (e) {
        callback(failCause(die(e)));
      }
    }
    pushStack(cont) {
      this._stack.push(cont),
        "trace" in cont && cont.trace && this._traceStack.push(cont.trace);
    }
    popStack() {
      const item = this._stack.pop();
      if (item)
        return "trace" in item && item.trace && this._traceStack.pop(), item;
    }
    getNextSuccessCont() {
      let frame = this.popStack();
      for (; frame; ) {
        if ("OnFailure" !== frame._tag && "Traced" !== frame._tag) return frame;
        this.popStack();
      }
    }
    getNextFailCont() {
      let frame = this.popStack();
      for (; frame; ) {
        if (
          "OnSuccess" !== frame._tag &&
          "While" !== frame._tag &&
          "Traced" !== frame._tag
        )
          return frame;
        this.popStack();
      }
    }
    [(FiberTypeId, RuntimeFiberTypeId, "Tag")](op) {
      return core_map(fiberRefGet(currentContext), (context) =>
        mjs_Context_unsafeGet(context, op)
      );
    }
    Left(op) {
      return exitFail(op.i0);
    }
    None(_) {
      return exitFail(NoSuchElementException());
    }
    Right(op) {
      return exitSucceed(op.i0);
    }
    Some(op) {
      return exitSucceed(op.i0);
    }
    Sync(op) {
      const value = op.i0(),
        cont = this.getNextSuccessCont();
      if (void 0 !== cont)
        return (
          cont._tag in contOpSuccess || fiberRuntime_absurd(cont),
          contOpSuccess[cont._tag](this, cont, value)
        );
      throw exitSucceed(value);
    }
    Success(op) {
      const oldCur = op,
        cont = this.getNextSuccessCont();
      if (void 0 !== cont)
        return (
          cont._tag in contOpSuccess || fiberRuntime_absurd(cont),
          contOpSuccess[cont._tag](this, cont, oldCur.i0)
        );
      throw oldCur;
    }
    Failure(op) {
      let cause = op.i0;
      if ("Annotated" === cause._tag && isStackAnnotation(cause.annotation)) {
        const stack = cause.annotation.stack,
          currentStack = this.stackToLines();
        annotated(
          cause.cause,
          new StackAnnotation(
            Chunk_take(runtimeDebug.traceStackLimit)(
              dedupeAdjacent(
                0 === stack.length
                  ? currentStack
                  : 0 === currentStack.length ||
                    unsafeLast(stack) === unsafeLast(currentStack)
                  ? stack
                  : Chunk_concat(currentStack)(stack)
              )
            ),
            cause.annotation.seq
          )
        );
      } else
        annotated(
          op.i0,
          new StackAnnotation(
            this.stackToLines(),
            ((self) => getAndUpdate(self, (n) => n + 1))(globalErrorSeq)
          )
        );
      const cont = this.getNextFailCont();
      if (void 0 === cont) throw exitFailCause(cause);
      switch (cont._tag) {
        case "OnFailure":
        case "OnSuccessAndFailure":
          return interruptible(this._runtimeFlags) && this.isInterrupted()
            ? exitFailCause(stripFailures(cause))
            : cont.i1(cause);
        case "RevertFlags":
          return (
            this.patchRuntimeFlags(this._runtimeFlags, cont.patch),
            interruptible(this._runtimeFlags) && this.isInterrupted()
              ? exitFailCause(sequential(cause, this.getInterruptedCause()))
              : exitFailCause(cause)
          );
        default:
          fiberRuntime_absurd(cont);
      }
    }
    WithRuntime(op) {
      return op.i0(this, Status_running(this._runtimeFlags));
    }
    UpdateRuntimeFlags(op) {
      if (void 0 === op.i1)
        return this.patchRuntimeFlags(this._runtimeFlags, op.i0), exitUnit();
      {
        const updateFlags = op.i0,
          oldRuntimeFlags = this._runtimeFlags,
          newRuntimeFlags = runtimeFlags_patch(oldRuntimeFlags, updateFlags);
        if (newRuntimeFlags === oldRuntimeFlags) return op.i1(oldRuntimeFlags);
        if (interruptible(newRuntimeFlags) && this.isInterrupted())
          return exitFailCause(this.getInterruptedCause());
        {
          this.patchRuntimeFlags(this._runtimeFlags, updateFlags);
          const revertFlags = runtimeFlags_diff(
            newRuntimeFlags,
            oldRuntimeFlags
          );
          return (
            this.pushStack(new RevertFlags(revertFlags)), op.i1(oldRuntimeFlags)
          );
        }
      }
    }
    OnSuccess(op) {
      return this.pushStack(op), op.i0;
    }
    Traced(op) {
      return this.pushStack(op), op.i0;
    }
    OnFailure(op) {
      return this.pushStack(op), op.i0;
    }
    OnSuccessAndFailure(op) {
      return this.pushStack(op), op.i0;
    }
    Async(op) {
      throw (
        ((this._asyncBlockingOn = op.i1),
        this.initiateAsync(this._runtimeFlags, op.i0),
        op)
      );
    }
    Yield(op) {
      throw op;
    }
    While(op) {
      const check = op.i0,
        body = op.i1;
      return check() ? (this.pushStack(op), body()) : exitUnit();
    }
    Commit(op) {
      return op.commit();
    }
    runLoop(effect0) {
      let cur = effect0,
        ops = 0;
      for (;;) {
        if (
          (this._runtimeFlags,
          runtimeFlags_isEnabled(self, 2) &&
            this.getSupervisor().onEffect(this, cur),
          this.drainQueueWhileRunning(this._runtimeFlags, cur),
          1,
          ops >= 2048)
        ) {
          0;
          const oldCur = cur;
          core_flatMap(() => oldCur)(yieldNow());
        }
        try {
          cur._tag in this || fiberRuntime_absurd(cur), this[cur._tag](cur);
        } catch (e) {
          if (isEffect(e)) {
            if ("Yield" === e._tag || "Async" === e._tag) throw e;
            if ("Success" === e._tag || "Failure" === e._tag) return e;
          } else
            "object" == typeof e && null != u && EffectErrorTypeId in u
              ? exitFailCause(e.cause)
              : isInterruptedException(e)
              ? exitFailCause(sequential(die(e), interrupt(Id_none)))
              : exitFailCause(die(e));
        }
      }
      var u, self;
    }
    stackToLines() {
      if (0 === this._traceStack.length) return Chunk_empty();
      const lines = [];
      let current = this._traceStack.length - 1;
      for (; current >= 0 && lines.length < runtimeDebug.traceStackLimit; ) {
        const value = this._traceStack[current];
        lines.push(value), 1;
      }
      return unsafeFromArray(lines);
    }
  }
  runtimeDebug.minumumLogLevel;
  const ScheduleTypeId = Symbol.for("@effect/io/Schedule"),
    ScheduleDriverTypeId = Symbol.for("@effect/io/Schedule/Driver");
  const memoKeySymbol = Symbol.for("@effect/io/Effect/memoizeFunction.key");
  class Key {
    constructor(a, eq) {
      (this.a = a), (this.eq = eq), (this[circular_a] = memoKeySymbol);
    }
    [(memoKeySymbol, Equal_symbol)](that) {
      return (
        "object" == typeof that &&
        null !== that &&
        memoKeySymbol in that &&
        (this.eq ? this.eq(this.a, that.a) : equals(this.a, that.a))
      );
    }
    [symbol]() {
      return this.eq ? 0 : Hash_hash(this.a);
    }
  }
  const SynchronizedTypeId = Symbol.for("@effect/io/Ref/Synchronized");
  class AsyncFiber {
    constructor(fiber) {
      (this.fiber = fiber), (this._tag = "AsyncFiber");
    }
    toString() {
      return `Fiber #${this.fiber.id().id} has suspended work asyncroniously`;
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.toString();
    }
  }
  const Effect_either = core_either,
    Effect_flatMap = core_flatMap,
    Effect_forEachDiscard = forEachDiscard,
    Effect_suspend = suspend,
    Effect_unit = core_unit,
    parseError = (errors) => ({ _tag: "ParseError", errors }),
    type = (expected, actual, message) => ({
      _tag: "Type",
      expected,
      actual,
      message: fromNullable(message),
    }),
    forbidden = { _tag: "Forbidden" },
    ParseResult_index = (index, errors) => ({ _tag: "Index", index, errors }),
    ParseResult_key = (key, errors) => ({ _tag: "Key", key, errors }),
    missing = { _tag: "Missing" },
    unexpected = (actual) => ({ _tag: "Unexpected", actual }),
    unionMember = (errors) => ({ _tag: "UnionMember", errors }),
    success = Either_right,
    failure = (e) => Either_left(parseError([e])),
    failures = (es) => Either_left(parseError(es)),
    eitherOrUndefined = (self) => {
      const s = self;
      if ("Left" === s._tag || "Right" === s._tag) return s;
    },
    ParseResult_flatMap = (self, f) => {
      const s = self;
      return "Left" === s._tag
        ? s
        : "Right" === s._tag
        ? f(s.right)
        : bodyWithTrace((trace, restore) =>
            Effect_flatMap(self, (a) => restore(f)(a)).traced(trace)
          );
    },
    Schema_make = (ast) => ({ ast }),
    OptionalSchemaId = Symbol.for("@effect/schema/Schema/OptionalSchema"),
    Schema_struct = (fields) =>
      Schema_make(
        createTypeLiteral(
          common_ownKeys(fields).map((key) => {
            return createPropertySignature(
              key,
              fields[key].ast,
              "_id" in (schema = fields[key]) &&
                schema._id === OptionalSchemaId,
              !0
            );
            var schema;
          }),
          []
        )
      );
  const Schema_string = Schema_make(stringKeyword),
    Schema_number = Schema_make(numberKeyword),
    getEither = (ast) => {
      const parser = go(ast);
      return (input, options) => parser(input, options);
    },
    parseEither = (schema) => getEither(schema.ast),
    go = Debug_untracedMethod(() => (ast, isBoundary = !0) => {
      if (!1 === isBoundary && !hasTransformation(ast)) return success;
      switch (ast._tag) {
        case "Refinement":
        case "Transform": {
          const to = go(ast.to, !1);
          if (isBoundary) {
            const from = go(ast.from);
            return (i1, options) => {
              const conditional = ParseResult_flatMap(
                  from(i1, options),
                  to === success
                    ? (a) => ast.decode(a, options)
                    : (a) =>
                        ParseResult_flatMap(ast.decode(a, options), (i2) =>
                          to(i2, options)
                        )
                ),
                either = eitherOrUndefined(conditional);
              return (
                either ||
                (!0 === options?.isEffectAllowed
                  ? conditional
                  : failure(forbidden))
              );
            };
          }
          return to === success
            ? ast.decode
            : (a, options) =>
                ParseResult_flatMap(ast.decode(a, options), (i2) =>
                  to(i2, options)
                );
        }
        case "Declaration":
          return (i, options) => {
            const conditional = ast.decode(...ast.typeParameters)(i, options),
              either = eitherOrUndefined(conditional);
            return (
              either ||
              (!0 === options?.isEffectAllowed
                ? conditional
                : failure(forbidden))
            );
          };
        case "Literal":
          return fromRefinement(ast, (u) => u === ast.literal);
        case "UniqueSymbol":
          return fromRefinement(ast, (u) => u === ast.symbol);
        case "UndefinedKeyword":
        case "VoidKeyword":
          return fromRefinement(ast, isUndefined);
        case "NeverKeyword":
          return fromRefinement(ast, isNever);
        case "UnknownKeyword":
        case "AnyKeyword":
          return success;
        case "StringKeyword":
          return fromRefinement(ast, isString);
        case "NumberKeyword":
          return fromRefinement(ast, isNumber);
        case "BooleanKeyword":
          return fromRefinement(ast, isBoolean);
        case "BigIntKeyword":
          return fromRefinement(ast, isBigint);
        case "SymbolKeyword":
          return fromRefinement(ast, isSymbol);
        case "ObjectKeyword":
          return fromRefinement(ast, isObject);
        case "Enums":
          return fromRefinement(ast, (u) =>
            ast.enums.some(([_, value]) => value === u)
          );
        case "TemplateLiteral": {
          const regex = getTemplateLiteralRegex(ast);
          return fromRefinement(ast, (u) => isString(u) && regex.test(u));
        }
        case "Tuple": {
          const elements = ast.elements.map((e) => go(e.type, isBoundary)),
            rest = Function_pipe(
              ast.rest,
              Option_map(mapNonEmpty((ast) => go(ast)))
            );
          let requiredLen = ast.elements.filter((e) => !e.isOptional).length;
          return (
            Option_isSome(ast.rest) &&
              (requiredLen += ast.rest.value.length - 1),
            (input, options) => {
              if (!Array.isArray(input))
                return failure(type(unknownArray, input));
              const allErrors = "all" === options?.errors,
                es = [];
              let stepKey = 0;
              const len = input.length;
              for (let i = len; i <= requiredLen - 1; i++) {
                const e = ParseResult_index(i, [missing]);
                if (!allErrors) return failure(e);
                es.push([stepKey++, e]);
              }
              if (Option_isNone(ast.rest))
                for (let i = ast.elements.length; i <= len - 1; i++) {
                  const e = ParseResult_index(i, [unexpected(input[i])]);
                  if (!allErrors)
                    return failures(mutableAppend(sortByIndex(es), e));
                  es.push([stepKey++, e]);
                }
              const output = [];
              let queue,
                i = 0;
              for (; i < elements.length; i++)
                if (len < i + 1) {
                  if (ast.elements[i].isOptional) continue;
                } else {
                  const te = (0, elements[i])(input[i], options),
                    t = eitherOrUndefined(te);
                  if (t) {
                    if (Either_isLeft(t)) {
                      const e = ParseResult_index(i, t.left.errors);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                    output.push([stepKey++, t.right]);
                  } else {
                    const nk = stepKey++,
                      index = i;
                    queue || (queue = []),
                      queue.push(
                        Debug_untracedMethod(
                          () =>
                            ({ es, output }) =>
                              Effect_flatMap(Effect_either(te), (t) => {
                                if (Either_isLeft(t)) {
                                  const e = ParseResult_index(
                                    index,
                                    t.left.errors
                                  );
                                  return allErrors
                                    ? (es.push([nk, e]), Effect_unit())
                                    : failures(
                                        mutableAppend(sortByIndex(es), e)
                                      );
                                }
                                return (
                                  output.push([nk, t.right]), Effect_unit()
                                );
                              })
                        )
                      );
                  }
                }
              if (Option_isSome(rest)) {
                const head = headNonEmpty(rest.value),
                  tail = tailNonEmpty(rest.value);
                for (; i < len - tail.length; i++) {
                  const te = head(input[i], options),
                    t = eitherOrUndefined(te);
                  if (t) {
                    if (Either_isLeft(t)) {
                      const e = ParseResult_index(i, t.left.errors);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                    output.push([stepKey++, t.right]);
                  } else {
                    const nk = stepKey++,
                      index = i;
                    queue || (queue = []),
                      queue.push(
                        Debug_untracedMethod(
                          () =>
                            ({ es, output }) =>
                              Effect_flatMap(Effect_either(te), (t) => {
                                if (Either_isLeft(t)) {
                                  const e = ParseResult_index(
                                    index,
                                    t.left.errors
                                  );
                                  return allErrors
                                    ? (es.push([nk, e]), Effect_unit())
                                    : failures(
                                        mutableAppend(sortByIndex(es), e)
                                      );
                                }
                                return (
                                  output.push([nk, t.right]), Effect_unit()
                                );
                              })
                        )
                      );
                  }
                }
                for (let j = 0; j < tail.length; j++)
                  if (((i += j), !(len < i + 1))) {
                    const te = tail[j](input[i], options),
                      t = eitherOrUndefined(te);
                    if (t) {
                      if (Either_isLeft(t)) {
                        const e = ParseResult_index(i, t.left.errors);
                        if (allErrors) {
                          es.push([stepKey++, e]);
                          continue;
                        }
                        return failures(mutableAppend(sortByIndex(es), e));
                      }
                      output.push([stepKey++, t.right]);
                    } else {
                      const nk = stepKey++,
                        index = i;
                      queue || (queue = []),
                        queue.push(
                          Debug_untracedMethod(
                            () =>
                              ({ es, output }) =>
                                Effect_flatMap(Effect_either(te), (t) => {
                                  if (Either_isLeft(t)) {
                                    const e = ParseResult_index(
                                      index,
                                      t.left.errors
                                    );
                                    return allErrors
                                      ? (es.push([nk, e]), Effect_unit())
                                      : failures(
                                          mutableAppend(sortByIndex(es), e)
                                        );
                                  }
                                  return (
                                    output.push([nk, t.right]), Effect_unit()
                                  );
                                })
                          )
                        );
                    }
                  }
              }
              const computeResult = ({ es, output }) =>
                ReadonlyArray_isNonEmptyArray(es)
                  ? failures(sortByIndex(es))
                  : success(sortByIndex(output));
              if (queue && queue.length > 0) {
                const cqueue = queue;
                return untraced(() =>
                  Effect_suspend(() => {
                    const state = {
                      es: Array.from(es),
                      output: Array.from(output),
                    };
                    return Effect_flatMap(
                      Effect_forEachDiscard(cqueue, (f) => f(state)),
                      () => computeResult(state)
                    );
                  })
                );
              }
              return computeResult({ output, es });
            }
          );
        }
        case "TypeLiteral": {
          if (
            0 === ast.propertySignatures.length &&
            0 === ast.indexSignatures.length
          )
            return fromRefinement(ast, isNotNullable);
          const propertySignaturesTypes = ast.propertySignatures.map((f) =>
              go(f.type, isBoundary)
            ),
            indexSignatures = ast.indexSignatures.map((is) => [
              go(is.parameter, isBoundary),
              go(is.type, isBoundary),
            ]),
            expectedKeys = {};
          for (let i = 0; i < propertySignaturesTypes.length; i++)
            expectedKeys[ast.propertySignatures[i].name] = null;
          return (input, options) => {
            if (!isRecord(input)) return failure(type(unknownRecord, input));
            const allErrors = "all" === options?.errors,
              es = [];
            let stepKey = 0;
            for (let i = 0; i < propertySignaturesTypes.length; i++) {
              const ps = ast.propertySignatures[i],
                name = ps.name;
              if (
                !Object.prototype.hasOwnProperty.call(input, name) &&
                !ps.isOptional
              ) {
                const e = ParseResult_key(name, [missing]);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                }
                return failure(e);
              }
            }
            if (
              "error" === options?.onExcessProperty &&
              0 === indexSignatures.length
            )
              for (const key of common_ownKeys(input))
                if (!Object.prototype.hasOwnProperty.call(expectedKeys, key)) {
                  const e = ParseResult_key(key, [unexpected(input[key])]);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  }
                  return failures(mutableAppend(sortByIndex(es), e));
                }
            const output = {};
            let queue;
            for (let i = 0; i < propertySignaturesTypes.length; i++) {
              const ps = ast.propertySignatures[i],
                parser = propertySignaturesTypes[i],
                name = ps.name;
              if (Object.prototype.hasOwnProperty.call(input, name)) {
                const te = parser(input[name], options),
                  t = eitherOrUndefined(te);
                if (t) {
                  if (Either_isLeft(t)) {
                    const e = ParseResult_key(name, t.left.errors);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                  output[name] = t.right;
                } else {
                  const nk = stepKey++,
                    index = name;
                  queue || (queue = []),
                    queue.push(
                      Debug_untracedMethod(
                        () =>
                          ({ es, output }) =>
                            Effect_flatMap(Effect_either(te), (t) => {
                              if (Either_isLeft(t)) {
                                const e = ParseResult_key(index, t.left.errors);
                                return allErrors
                                  ? (es.push([nk, e]), Effect_unit())
                                  : failures(mutableAppend(sortByIndex(es), e));
                              }
                              return (output[index] = t.right), Effect_unit();
                            })
                      )
                    );
                }
              }
            }
            if (indexSignatures.length > 0)
              for (let i = 0; i < indexSignatures.length; i++) {
                const parameter = indexSignatures[i][0],
                  type = indexSignatures[i][1],
                  keys = getKeysForIndexSignature(
                    input,
                    ast.indexSignatures[i].parameter
                  );
                for (const key of keys) {
                  if (Object.prototype.hasOwnProperty.call(expectedKeys, key))
                    continue;
                  const te = parameter(key, options),
                    t = eitherOrUndefined(te);
                  if (t && Either_isLeft(t)) {
                    const e = ParseResult_key(key, t.left.errors);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                  const tve = type(input[key], options),
                    tv = eitherOrUndefined(tve);
                  if (tv) {
                    if (Either_isLeft(tv)) {
                      const e = ParseResult_key(key, tv.left.errors);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                    output[key] = tv.right;
                  } else {
                    const nk = stepKey++,
                      index = key;
                    queue || (queue = []),
                      queue.push(
                        Debug_untracedMethod(
                          () =>
                            ({ es, output }) =>
                              Effect_flatMap(Effect_either(tve), (tv) => {
                                if (Either_isLeft(tv)) {
                                  const e = ParseResult_key(
                                    index,
                                    tv.left.errors
                                  );
                                  return allErrors
                                    ? (es.push([nk, e]), Effect_unit())
                                    : failures(
                                        mutableAppend(sortByIndex(es), e)
                                      );
                                }
                                return (output[key] = tv.right), Effect_unit();
                              })
                        )
                      );
                  }
                }
              }
            const computeResult = ({ es, output }) =>
              ReadonlyArray_isNonEmptyArray(es)
                ? failures(sortByIndex(es))
                : success(output);
            if (queue && queue.length > 0) {
              const cqueue = queue;
              return untraced(() =>
                Effect_suspend(() => {
                  const state = {
                    es: Array.from(es),
                    output: Object.assign({}, output),
                  };
                  return Effect_flatMap(
                    Effect_forEachDiscard(cqueue, (f) => f(state)),
                    () => computeResult(state)
                  );
                })
              );
            }
            return computeResult({ es, output });
          };
        }
        case "Union": {
          const searchTree = _getSearchTree(ast.types),
            ownKeys = common_ownKeys(searchTree.keys),
            len = ownKeys.length,
            map = new Map();
          for (let i = 0; i < ast.types.length; i++)
            map.set(ast.types[i], go(ast.types[i], !0));
          return (input, options) => {
            const es = [];
            let queue,
              stepKey = 0,
              candidates = [];
            if (len > 0)
              if (isRecord(input))
                for (let i = 0; i < len; i++) {
                  const name = ownKeys[i],
                    buckets = searchTree.keys[name].buckets;
                  if (Object.prototype.hasOwnProperty.call(input, name)) {
                    const literal = String(input[name]);
                    Object.prototype.hasOwnProperty.call(buckets, literal)
                      ? (candidates = candidates.concat(buckets[literal]))
                      : es.push([
                          stepKey++,
                          ParseResult_key(name, [
                            type(searchTree.keys[name].ast, input[name]),
                          ]),
                        ]);
                  } else es.push([stepKey++, ParseResult_key(name, [missing])]);
                }
              else es.push([stepKey++, type(unknownRecord, input)]);
            searchTree.otherwise.length > 0 &&
              (candidates = candidates.concat(searchTree.otherwise));
            for (let i = 0; i < candidates.length; i++) {
              const te = map.get(candidates[i])(input, options),
                t =
                  queue && 0 !== queue.length ? void 0 : eitherOrUndefined(te);
              if (t) {
                if (Either_isRight(t)) return success(t.right);
                es.push([stepKey++, unionMember(t.left.errors)]);
              } else {
                const nk = stepKey++;
                queue || (queue = []),
                  queue.push(
                    Debug_untracedMethod(
                      () => (state) =>
                        Effect_suspend(() =>
                          "finalResult" in state
                            ? Effect_unit()
                            : Effect_flatMap(
                                Effect_either(te),
                                (t) => (
                                  Either_isRight(t)
                                    ? (state.finalResult = success(t.right))
                                    : state.es.push([
                                        nk,
                                        unionMember(t.left.errors),
                                      ]),
                                  Effect_unit()
                                )
                              )
                        )
                    )
                  );
              }
            }
            const computeResult = (es) =>
              ReadonlyArray_isNonEmptyArray(es)
                ? failures(sortByIndex(es))
                : failure(type(neverKeyword, input));
            if (queue && queue.length > 0) {
              const cqueue = queue;
              return untraced(() =>
                Effect_suspend(() => {
                  const state = { es: Array.from(es) };
                  return Effect_flatMap(
                    Effect_forEachDiscard(cqueue, (f) => f(state)),
                    () =>
                      "finalResult" in state
                        ? state.finalResult
                        : computeResult(state.es)
                  );
                })
              );
            }
            return computeResult(es);
          };
        }
        case "Lazy": {
          const get = ((f) => {
            const cache = new Map();
            return (a) => {
              if (!cache.has(a)) {
                const b = f(a);
                return cache.set(a, b), b;
              }
              return cache.get(a);
            };
          })(() => go(ast.f(), isBoundary));
          return (a, options) => get()(a, options);
        }
      }
    }),
    fromRefinement = (ast, refinement) => (u) =>
      refinement(u) ? success(u) : failure(type(ast, u)),
    _getLiterals = (ast) => {
      switch (ast._tag) {
        case "Declaration":
          return _getLiterals(ast.type);
        case "TypeLiteral": {
          const out = [];
          for (let i = 0; i < ast.propertySignatures.length; i++) {
            const propertySignature = ast.propertySignatures[i],
              type = getFrom(propertySignature.type);
            isLiteral(type) &&
              !propertySignature.isOptional &&
              out.push([propertySignature.name, type]);
          }
          return out;
        }
        case "Refinement":
        case "Transform":
          return _getLiterals(ast.from);
      }
      return [];
    },
    _getSearchTree = (members) => {
      const keys = {},
        otherwise = [];
      for (let i = 0; i < members.length; i++) {
        const member = members[i],
          tags = _getLiterals(member);
        if (tags.length > 0)
          for (let j = 0; j < tags.length; j++) {
            const [key, literal] = tags[j],
              hash = String(literal.literal);
            keys[key] = keys[key] || { buckets: {}, ast: neverKeyword };
            const buckets = keys[key].buckets;
            if (!Object.prototype.hasOwnProperty.call(buckets, hash)) {
              (buckets[hash] = [member]),
                (keys[key].ast = createUnion([keys[key].ast, literal]));
              break;
            }
            j < tags.length - 1 ||
              (buckets[hash].push(member),
              (keys[key].ast = createUnion([keys[key].ast, literal])));
          }
        else otherwise.push(member);
      }
      return { keys, otherwise };
    },
    unknownArray = createTuple([], Option_some([unknownKeyword]), !0, {
      "@effect/schema/DescriptionAnnotationId": "a generic array",
    }),
    unknownRecord = createTypeLiteral(
      [],
      [
        createIndexSignature(stringKeyword, unknownKeyword, !0),
        createIndexSignature(symbolKeyword, unknownKeyword, !0),
      ],
      { "@effect/schema/DescriptionAnnotationId": "a generic object" }
    ),
    mutableAppend = (self, a) => (self.push(a), self),
    getTemplateLiteralRegex = (ast) => {
      let pattern = `^${ast.head}`;
      for (const span of ast.spans)
        isStringKeyword(span.type)
          ? (pattern += ".*")
          : isNumberKeyword(span.type) && (pattern += "-?\\d+(\\.\\d+)?"),
          (pattern += span.literal);
      return (pattern += "$"), new RegExp(pattern);
    };
  function sortByIndex(es) {
    return es
      .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
      .map(([_, a]) => a);
  }
  parseEither(Schema_struct({ name: Schema_string, age: Schema_number }))({});
})();
