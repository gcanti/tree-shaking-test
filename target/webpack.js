(() => {
  "use strict";
  const Function_dual = function (arity, body) {
      if ("function" == typeof arity)
        return function () {
          return arity(arguments)
            ? body.apply(this, arguments)
            : (self) => body(self, ...arguments);
        };
      switch (arity) {
        case 0:
        case 1:
          throw new RangeError(`Invalid arity ${arity}`);
        case 2:
          return function (a, b) {
            return arguments.length >= 2
              ? body(a, b)
              : function (self) {
                  return body(self, a);
                };
          };
        case 3:
          return function (a, b, c) {
            return arguments.length >= 3
              ? body(a, b, c)
              : function (self) {
                  return body(self, a, b);
                };
          };
        case 4:
          return function (a, b, c, d) {
            return arguments.length >= 4
              ? body(a, b, c, d)
              : function (self) {
                  return body(self, a, b, c);
                };
          };
        case 5:
          return function (a, b, c, d, e) {
            return arguments.length >= 5
              ? body(a, b, c, d, e)
              : function (self) {
                  return body(self, a, b, c, d);
                };
          };
        default:
          return function () {
            if (arguments.length >= arity) return body.apply(this, arguments);
            const args = arguments;
            return function (self) {
              return body(self, ...args);
            };
          };
      }
    },
    Function_identity = (a) => a,
    constant = (value) => () => value,
    constTrue = constant(!0),
    constFalse = constant(!1),
    Function_constUndefined = constant(void 0);
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
  let moduleVersion = "3.1.0";
  const getCurrentVersion = () => moduleVersion,
    globalStoreId = Symbol.for(
      `effect/GlobalValue/globalStoreId/${getCurrentVersion()}`
    );
  globalStoreId in globalThis || (globalThis[globalStoreId] = new Map());
  const globalStore = globalThis[globalStoreId],
    GlobalValue_globalValue = (id, compute) => (
      globalStore.has(id) || globalStore.set(id, compute()), globalStore.get(id)
    ),
    isString = (input) => "string" == typeof input,
    isNumber = (input) => "number" == typeof input,
    Predicate_isBoolean = (input) => "boolean" == typeof input,
    isBigInt = (input) => "bigint" == typeof input,
    isSymbol = (input) => "symbol" == typeof input,
    Predicate_isFunction = (input) => "function" == typeof input,
    isUndefined = (input) => void 0 === input,
    isNever = (_) => !1,
    isRecordOrArray = (input) => "object" == typeof input && null !== input,
    Predicate_isObject = (input) =>
      isRecordOrArray(input) || Predicate_isFunction(input),
    Predicate_hasProperty = Function_dual(
      2,
      (self, property) => Predicate_isObject(self) && property in self
    ),
    isTagged = Function_dual(
      2,
      (self, tag) => Predicate_hasProperty(self, "_tag") && self._tag === tag
    ),
    isNullable = (input) => null == input,
    isNotNullable = (input) => null != input,
    isDate = (input) => input instanceof Date,
    isIterable = (input) => Predicate_hasProperty(input, Symbol.iterator),
    isRecord = (input) => isRecordOrArray(input) && !Array.isArray(input),
    isPromiseLike = (input) =>
      Predicate_hasProperty(input, "then") && Predicate_isFunction(input.then),
    getBugErrorMessage = (message) =>
      `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`,
    GenKindTypeId = Symbol.for("effect/Gen/GenKind");
  Symbol.iterator;
  class SingleShotGen {
    self;
    called = !1;
    constructor(self) {
      this.self = self;
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
  class PCGRandom {
    _state;
    constructor(seedHi, seedLo, incHi, incLo) {
      return (
        isNullable(seedLo) && isNullable(seedHi)
          ? ((seedLo = (4294967295 * Math.random()) >>> 0), (seedHi = 0))
          : isNullable(seedLo) && ((seedLo = seedHi), (seedHi = 0)),
        isNullable(incLo) && isNullable(incHi)
          ? ((incLo = this._state ? this._state[3] : 4150755663),
            (incHi = this._state ? this._state[2] : 335903614))
          : isNullable(incLo) && ((incLo = incHi), (incHi = 0)),
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
  const YieldWrapTypeId = Symbol.for("effect/Utils/YieldWrap");
  class YieldWrap {
    #value;
    constructor(value) {
      this.#value = value;
    }
    [YieldWrapTypeId]() {
      return this.#value;
    }
  }
  const randomHashCache = GlobalValue_globalValue(
      Symbol.for("effect/Hash/randomHashCache"),
      () => new WeakMap()
    ),
    pcgr = GlobalValue_globalValue(
      Symbol.for("effect/Hash/pcgr"),
      () => new PCGRandom()
    ),
    symbol = Symbol.for("effect/Hash"),
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
          throw new Error(
            `BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`
          );
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
    isHash = (u) => Predicate_hasProperty(u, symbol),
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
    structure = (o) =>
      ((o, keys) => {
        let h = 12289;
        for (let i = 0; i < keys.length; i++)
          h ^= Function_pipe(string(keys[i]), combine(Hash_hash(o[keys[i]])));
        return optimize(h);
      })(o, Object.keys(o)),
    array = (arr) => {
      let h = 6151;
      for (let i = 0; i < arr.length; i++)
        h = Function_pipe(h, combine(Hash_hash(arr[i])));
      return optimize(h);
    },
    cached = function () {
      if (1 === arguments.length) {
        const self = arguments[0];
        return function (hash) {
          return (
            Object.defineProperty(self, symbol, {
              value: () => hash,
              enumerable: !1,
            }),
            hash
          );
        };
      }
      const self = arguments[0],
        hash = arguments[1];
      return (
        Object.defineProperty(self, symbol, {
          value: () => hash,
          enumerable: !1,
        }),
        hash
      );
    },
    Equal_symbol = Symbol.for("effect/Equal");
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
  const isEqual = (u) => Predicate_hasProperty(u, Equal_symbol),
    equivalence = () => equals,
    make = (isEquivalent) => (self, that) =>
      self === that || isEquivalent(self, that),
    Equivalence_mapInput = Function_dual(2, (self, f) =>
      make((x, y) => self(f(x), f(y)))
    ),
    isNonEmptyArray = (self) => self.length > 0,
    NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom"),
    toJSON = (x) =>
      Predicate_hasProperty(x, "toJSON") &&
      Predicate_isFunction(x.toJSON) &&
      0 === x.toJSON.length
        ? x.toJSON()
        : Array.isArray(x)
        ? x.map(toJSON)
        : x,
    format = (x) => JSON.stringify(x, null, 2);
  const toStringUnknown = (u, whitespace = 2) => {
      try {
        return "object" == typeof u
          ? stringifyCircular(u, whitespace)
          : String(u);
      } catch (_) {
        return String(u);
      }
    },
    stringifyCircular = (obj, whitespace) => {
      let cache = [];
      const retVal = JSON.stringify(
        obj,
        (_key, value) =>
          "object" == typeof value && null !== value
            ? cache.includes(value)
              ? void 0
              : cache.push(value) && value
            : value,
        whitespace
      );
      return (cache = void 0), retVal;
    },
    Pipeable_pipeArguments = (self, args) => {
      switch (args.length) {
        case 1:
          return args[0](self);
        case 2:
          return args[1](args[0](self));
        case 3:
          return args[2](args[1](args[0](self)));
        case 4:
          return args[3](args[2](args[1](args[0](self))));
        case 5:
          return args[4](args[3](args[2](args[1](args[0](self)))));
        case 6:
          return args[5](args[4](args[3](args[2](args[1](args[0](self))))));
        case 7:
          return args[6](
            args[5](args[4](args[3](args[2](args[1](args[0](self))))))
          );
        case 8:
          return args[7](
            args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))
          );
        case 9:
          return args[8](
            args[7](
              args[6](
                args[5](args[4](args[3](args[2](args[1](args[0](self))))))
              )
            )
          );
        default: {
          let ret = self;
          for (let i = 0, len = args.length; i < len; i++) ret = args[i](ret);
          return ret;
        }
      }
    },
    EffectTypeId = Symbol.for("effect/Effect"),
    StreamTypeId = Symbol.for("effect/Stream"),
    SinkTypeId = Symbol.for("effect/Sink"),
    ChannelTypeId = Symbol.for("effect/Channel"),
    effectVariance = {
      _R: (_) => _,
      _E: (_) => _,
      _A: (_) => _,
      _V: getCurrentVersion(),
    },
    EffectPrototype = {
      [EffectTypeId]: effectVariance,
      [StreamTypeId]: effectVariance,
      [SinkTypeId]: {
        _A: (_) => _,
        _In: (_) => _,
        _L: (_) => _,
        _E: (_) => _,
        _R: (_) => _,
      },
      [ChannelTypeId]: {
        _Env: (_) => _,
        _InErr: (_) => _,
        _InElem: (_) => _,
        _InDone: (_) => _,
        _OutErr: (_) => _,
        _OutElem: (_) => _,
        _OutDone: (_) => _,
      },
      [Equal_symbol](that) {
        return this === that;
      },
      [symbol]() {
        return cached(this, random(this));
      },
      [Symbol.iterator]() {
        return new SingleShotGen(new YieldWrap(this));
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    effectable_StructuralPrototype = {
      [symbol]() {
        return cached(this, structure(this));
      },
      [Equal_symbol](that) {
        const selfKeys = Object.keys(this),
          thatKeys = Object.keys(that);
        if (selfKeys.length !== thatKeys.length) return !1;
        for (const key of selfKeys)
          if (!(key in that) || !equals(this[key], that[key])) return !1;
        return !0;
      },
    },
    CommitPrototype = { ...EffectPrototype, _op: "Commit" },
    StructuralCommitPrototype = {
      ...CommitPrototype,
      ...effectable_StructuralPrototype,
    },
    TypeId = Symbol.for("effect/Option"),
    CommonProto = {
      ...EffectPrototype,
      [TypeId]: { _A: (_) => _ },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      toString() {
        return format(this.toJSON());
      },
    },
    SomeProto = Object.assign(Object.create(CommonProto), {
      _tag: "Some",
      _op: "Some",
      [Equal_symbol](that) {
        return isOption(that) && isSome(that) && equals(that.value, this.value);
      },
      [symbol]() {
        return cached(
          this,
          combine(Hash_hash(this._tag))(Hash_hash(this.value))
        );
      },
      toJSON() {
        return { _id: "Option", _tag: this._tag, value: toJSON(this.value) };
      },
    }),
    NoneHash = Hash_hash("None"),
    NoneProto = Object.assign(Object.create(CommonProto), {
      _tag: "None",
      _op: "None",
      [Equal_symbol]: (that) => isOption(that) && isNone(that),
      [symbol]: () => NoneHash,
      toJSON() {
        return { _id: "Option", _tag: this._tag };
      },
    }),
    isOption = (input) => Predicate_hasProperty(input, TypeId),
    isNone = (fa) => "None" === fa._tag,
    isSome = (fa) => "Some" === fa._tag,
    none = Object.create(NoneProto),
    option_some = (value) => {
      const a = Object.create(SomeProto);
      return (a.value = value), a;
    },
    either_TypeId = Symbol.for("effect/Either"),
    either_CommonProto = {
      ...EffectPrototype,
      [either_TypeId]: { _R: (_) => _ },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      toString() {
        return format(this.toJSON());
      },
    },
    RightProto = Object.assign(Object.create(either_CommonProto), {
      _tag: "Right",
      _op: "Right",
      [Equal_symbol](that) {
        return (
          isEither(that) && isRight(that) && equals(that.right, this.right)
        );
      },
      [symbol]() {
        return combine(Hash_hash(this._tag))(Hash_hash(this.right));
      },
      toJSON() {
        return { _id: "Either", _tag: this._tag, right: toJSON(this.right) };
      },
    }),
    LeftProto = Object.assign(Object.create(either_CommonProto), {
      _tag: "Left",
      _op: "Left",
      [Equal_symbol](that) {
        return isEither(that) && isLeft(that) && equals(that.left, this.left);
      },
      [symbol]() {
        return combine(Hash_hash(this._tag))(Hash_hash(this.left));
      },
      toJSON() {
        return { _id: "Either", _tag: this._tag, left: toJSON(this.left) };
      },
    }),
    isEither = (input) => Predicate_hasProperty(input, either_TypeId),
    isLeft = (ma) => "Left" === ma._tag,
    isRight = (ma) => "Right" === ma._tag,
    left = (left) => {
      const a = Object.create(LeftProto);
      return (a.left = left), a;
    },
    right = (right) => {
      const a = Object.create(RightProto);
      return (a.right = right), a;
    },
    Option_none = () => none,
    Option_some = option_some,
    Option_isNone = isNone,
    Option_isSome = isSome,
    match = Function_dual(2, (self, { onNone, onSome }) =>
      Option_isNone(self) ? onNone() : onSome(self.value)
    ),
    getOrElse = Function_dual(2, (self, onNone) =>
      Option_isNone(self) ? onNone() : self.value
    ),
    orElse = Function_dual(2, (self, that) =>
      Option_isNone(self) ? that() : self
    ),
    orElseSome = Function_dual(2, (self, onNone) =>
      Option_isNone(self) ? Option_some(onNone()) : self
    ),
    fromNullable = (nullableValue) =>
      null == nullableValue ? Option_none() : Option_some(nullableValue),
    getOrUndefined = getOrElse(Function_constUndefined),
    getOrThrow = Function_dual(2, (self, onNone) => {
      if (Option_isSome(self)) return self.value;
      throw onNone();
    })(() => new Error("getOrThrow called on a None")),
    map = Function_dual(2, (self, f) =>
      Option_isNone(self) ? Option_none() : Option_some(f(self.value))
    ),
    flatMap = Function_dual(2, (self, f) =>
      Option_isNone(self) ? Option_none() : f(self.value)
    ),
    filterMap = Function_dual(2, (self, f) =>
      Option_isNone(self) ? Option_none() : f(self.value)
    ),
    containsWith = (isEquivalent) =>
      Function_dual(
        2,
        (self, a) => !Option_isNone(self) && isEquivalent(self.value, a)
      ),
    contains = containsWith(equivalence());
  Symbol.iterator;
  const constEmptyIterator = { next: () => ({ done: !0, value: void 0 }) },
    Order_make = (compare) => (self, that) =>
      self === that ? 0 : compare(self, that),
    Order_number = Order_make((self, that) => (self < that ? -1 : 1)),
    Order_mapInput = Function_dual(2, (self, f) =>
      Order_make((b1, b2) => self(f(b1), f(b2)))
    ),
    greaterThan = (O) => Function_dual(2, (self, that) => 1 === O(self, that)),
    Tuple_make = (Object.fromEntries, (...elements) => elements),
    allocate = (n) => new Array(n),
    Array_makeBy = (n, f) => {
      const max = Math.max(1, Math.floor(n)),
        out = new Array(max);
      for (let i = 0; i < max; i++) out[i] = f(i);
      return out;
    },
    Array_fromIterable = (collection) =>
      Array.isArray(collection) ? collection : Array.from(collection),
    matchLeft = Function_dual(2, (self, { onEmpty, onNonEmpty }) =>
      isNonEmptyReadonlyArray(self)
        ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self))
        : onEmpty()
    ),
    Array_prepend = Function_dual(2, (self, head) => [head, ...self]),
    Array_append = Function_dual(2, (self, last) => [...self, last]),
    Array_appendAll = Function_dual(2, (self, that) =>
      Array_fromIterable(self).concat(Array_fromIterable(that))
    ),
    isArray = Array.isArray,
    isEmptyReadonlyArray = (self) => 0 === self.length,
    Array_isNonEmptyArray = isNonEmptyArray,
    isNonEmptyReadonlyArray = isNonEmptyArray,
    isOutOfBound = (i, as) => i < 0 || i >= as.length,
    Array_clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length)),
    Array_get = Function_dual(2, (self, index) => {
      const i = Math.floor(index);
      return isOutOfBound(i, self) ? Option_none() : Option_some(self[i]);
    }),
    unsafeGet = Function_dual(2, (self, index) => {
      const i = Math.floor(index);
      if (isOutOfBound(i, self)) throw new Error(`Index ${i} out of bounds`);
      return self[i];
    }),
    Array_head = Array_get(0),
    headNonEmpty = unsafeGet(0),
    lastNonEmpty = (self) => self[self.length - 1],
    tailNonEmpty = (self) => self.slice(1),
    spanIndex = (self, predicate) => {
      let i = 0;
      for (const a of self) {
        if (!predicate(a, i)) break;
        i++;
      }
      return i;
    },
    span = Function_dual(2, (self, predicate) =>
      splitAt(self, spanIndex(self, predicate))
    ),
    Array_drop = Function_dual(2, (self, n) => {
      const input = Array_fromIterable(self);
      return input.slice(Array_clamp(n, input), input.length);
    }),
    Array_reverse = (self) => Array.from(self).reverse(),
    sort = Function_dual(2, (self, O) => {
      const out = Array.from(self);
      return out.sort(O), out;
    }),
    Array_zip = Function_dual(2, (self, that) =>
      Array_zipWith(self, that, Tuple_make)
    ),
    Array_zipWith = Function_dual(3, (self, that, f) => {
      const as = Array_fromIterable(self),
        bs = Array_fromIterable(that);
      if (isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)) {
        const out = [f(headNonEmpty(as), headNonEmpty(bs))],
          len = Math.min(as.length, bs.length);
        for (let i = 1; i < len; i++) out[i] = f(as[i], bs[i]);
        return out;
      }
      return [];
    }),
    Array_equivalence = equivalence(),
    splitAt = Function_dual(2, (self, n) => {
      const input = Array.from(self),
        _n = Math.floor(n);
      return isNonEmptyReadonlyArray(input)
        ? _n >= 1
          ? splitNonEmptyAt(input, _n)
          : [[], input]
        : [input, []];
    }),
    splitNonEmptyAt = Function_dual(2, (self, n) => {
      const _n = Math.max(1, Math.floor(n));
      return _n >= self.length
        ? [copy(self), []]
        : [
            Array_prepend(self.slice(1, _n), headNonEmpty(self)),
            self.slice(_n),
          ];
    }),
    copy = (self) => self.slice(),
    unionWith = Function_dual(3, (self, that, isEquivalent) => {
      const a = Array_fromIterable(self),
        b = Array_fromIterable(that);
      if (isNonEmptyReadonlyArray(a)) {
        if (isNonEmptyReadonlyArray(b)) {
          return dedupeWith(isEquivalent)(Array_appendAll(a, b));
        }
        return a;
      }
      return b;
    }),
    Array_union = Function_dual(2, (self, that) =>
      unionWith(self, that, Array_equivalence)
    ),
    Array_of = (a) => [a],
    Array_map = Function_dual(2, (self, f) => self.map(f)),
    Array_flatMap = Function_dual(2, (self, f) => {
      if (isEmptyReadonlyArray(self)) return [];
      const out = [];
      for (let i = 0; i < self.length; i++) {
        const inner = f(self[i], i);
        for (let j = 0; j < inner.length; j++) out.push(inner[j]);
      }
      return out;
    }),
    Array_flatten = Array_flatMap(Function_identity),
    Array_reduce = Function_dual(3, (self, b, f) =>
      Array_fromIterable(self).reduce((b, a, i) => f(b, a, i), b)
    ),
    Array_unfold = (b, f) => {
      const out = [];
      let o,
        next = b;
      for (; Option_isSome((o = f(next))); ) {
        const [a, b] = o.value;
        out.push(a), (next = b);
      }
      return out;
    },
    Array_getEquivalence = (item) =>
      make((self, that) => {
        if (self.length !== that.length) return !1;
        for (let i = 0; i < self.length; i++) {
          if (!item(self[i], that[i])) return !1;
        }
        return !0;
      }),
    dedupeWith = Function_dual(2, (self, isEquivalent) => {
      const input = Array_fromIterable(self);
      if (isNonEmptyReadonlyArray(input)) {
        const out = [headNonEmpty(input)],
          rest = tailNonEmpty(input);
        for (const r of rest)
          out.every((a) => !isEquivalent(r, a)) && out.push(r);
        return out;
      }
      return [];
    }),
    dedupe = (self) => dedupeWith(self, equivalence()),
    join = Function_dual(2, (self, sep) => Array_fromIterable(self).join(sep)),
    Duration_TypeId =
      (symbol, Equal_symbol, NodeInspectSymbol, Symbol.for("effect/Duration")),
    Duration_bigint0 = BigInt(0),
    bigint24 = BigInt(24),
    bigint60 = BigInt(60),
    bigint1e3 = BigInt(1e3),
    bigint1e6 = BigInt(1e6),
    bigint1e9 = BigInt(1e9),
    DURATION_REGEX =
      /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/,
    decode = (input) => {
      if (isDuration(input)) return input;
      if (isNumber(input)) return Duration_millis(input);
      if (isBigInt(input)) return Duration_nanos(input);
      if (Array.isArray(input)) {
        if (2 === input.length && isNumber(input[0]) && isNumber(input[1]))
          return Duration_nanos(
            BigInt(input[0]) * bigint1e9 + BigInt(input[1])
          );
      } else if (isString(input)) {
        DURATION_REGEX.lastIndex = 0;
        const match = DURATION_REGEX.exec(input);
        if (match) {
          const [_, valueStr, unit] = match,
            value = Number(valueStr);
          switch (unit) {
            case "nano":
            case "nanos":
              return Duration_nanos(BigInt(valueStr));
            case "micro":
            case "micros":
              return micros(BigInt(valueStr));
            case "milli":
            case "millis":
              return Duration_millis(value);
            case "second":
            case "seconds":
              return seconds(value);
            case "minute":
            case "minutes":
              return minutes(value);
            case "hour":
            case "hours":
              return hours(value);
            case "day":
            case "days":
              return days(value);
            case "week":
            case "weeks":
              return weeks(value);
          }
        }
      }
      throw new Error("Invalid DurationInput");
    },
    zeroValue = { _tag: "Millis", millis: 0 },
    infinityValue = { _tag: "Infinity" },
    DurationProto = {
      [Duration_TypeId]: Duration_TypeId,
      [symbol]() {
        return cached(this, structure(this.value));
      },
      [Equal_symbol](that) {
        return isDuration(that) && Duration_equals(this, that);
      },
      toString() {
        return `Duration(${Duration_format(this)})`;
      },
      toJSON() {
        switch (this.value._tag) {
          case "Millis":
            return {
              _id: "Duration",
              _tag: "Millis",
              millis: this.value.millis,
            };
          case "Nanos":
            return { _id: "Duration", _tag: "Nanos", hrtime: toHrTime(this) };
          case "Infinity":
            return { _id: "Duration", _tag: "Infinity" };
        }
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    Duration_make = (input) => {
      const duration = Object.create(DurationProto);
      return (
        isNumber(input)
          ? isNaN(input) || input <= 0
            ? (duration.value = zeroValue)
            : Number.isFinite(input)
            ? Number.isInteger(input)
              ? (duration.value = { _tag: "Millis", millis: input })
              : (duration.value = {
                  _tag: "Nanos",
                  nanos: BigInt(Math.round(1e6 * input)),
                })
            : (duration.value = infinityValue)
          : (duration.value =
              input <= Duration_bigint0
                ? zeroValue
                : { _tag: "Nanos", nanos: input }),
        duration
      );
    },
    isDuration = (u) => Predicate_hasProperty(u, Duration_TypeId),
    Duration_zero = Duration_make(0),
    Duration_nanos = (nanos) => Duration_make(nanos),
    micros = (micros) => Duration_make(micros * bigint1e3),
    Duration_millis = (millis) => Duration_make(millis),
    seconds = (seconds) => Duration_make(1e3 * seconds),
    minutes = (minutes) => Duration_make(6e4 * minutes),
    hours = (hours) => Duration_make(36e5 * hours),
    days = (days) => Duration_make(864e5 * days),
    weeks = (weeks) => Duration_make(6048e5 * weeks),
    toMillis = (self) => {
      const _self = decode(self);
      switch (_self.value._tag) {
        case "Infinity":
          return 1 / 0;
        case "Nanos":
          return Number(_self.value.nanos) / 1e6;
        case "Millis":
          return _self.value.millis;
      }
    },
    toHrTime = (self) => {
      const _self = decode(self);
      switch (_self.value._tag) {
        case "Infinity":
          return [1 / 0, 0];
        case "Nanos":
          return [
            Number(_self.value.nanos / bigint1e9),
            Number(_self.value.nanos % bigint1e9),
          ];
        case "Millis":
          return [
            Math.floor(_self.value.millis / 1e3),
            Math.round((_self.value.millis % 1e3) * 1e6),
          ];
      }
    },
    matchWith = Function_dual(3, (self, that, options) => {
      const _self = decode(self),
        _that = decode(that);
      if ("Infinity" === _self.value._tag || "Infinity" === _that.value._tag)
        return options.onMillis(toMillis(_self), toMillis(_that));
      if ("Nanos" === _self.value._tag || "Nanos" === _that.value._tag) {
        const selfNanos =
            "Nanos" === _self.value._tag
              ? _self.value.nanos
              : BigInt(Math.round(1e6 * _self.value.millis)),
          thatNanos =
            "Nanos" === _that.value._tag
              ? _that.value.nanos
              : BigInt(Math.round(1e6 * _that.value.millis));
        return options.onNanos(selfNanos, thatNanos);
      }
      return options.onMillis(_self.value.millis, _that.value.millis);
    }),
    Duration_Equivalence = (self, that) =>
      matchWith(self, that, {
        onMillis: (self, that) => self === that,
        onNanos: (self, that) => self === that,
      }),
    Duration_greaterThanOrEqualTo = Function_dual(2, (self, that) =>
      matchWith(self, that, {
        onMillis: (self, that) => self >= that,
        onNanos: (self, that) => self >= that,
      })
    ),
    Duration_equals = Function_dual(2, (self, that) =>
      Duration_Equivalence(decode(self), decode(that))
    ),
    Duration_format = (self) => {
      const duration = decode(self),
        parts = [];
      if ("Infinity" === duration.value._tag) return "Infinity";
      const nanos = ((self) => {
        const _self = decode(self);
        switch (_self.value._tag) {
          case "Infinity":
            throw new Error("Cannot convert infinite duration to nanos");
          case "Nanos":
            return _self.value.nanos;
          case "Millis":
            return BigInt(Math.round(1e6 * _self.value.millis));
        }
      })(duration);
      nanos % bigint1e6 && parts.push((nanos % bigint1e6) + "ns");
      const ms = nanos / bigint1e6;
      ms % bigint1e3 !== Duration_bigint0 &&
        parts.push((ms % bigint1e3) + "ms");
      const sec = ms / bigint1e3;
      sec % bigint60 !== Duration_bigint0 && parts.push((sec % bigint60) + "s");
      const min = sec / bigint60;
      min % bigint60 !== Duration_bigint0 && parts.push((min % bigint60) + "m");
      const hr = min / bigint60;
      hr % bigint24 !== Duration_bigint0 && parts.push((hr % bigint24) + "h");
      const days = hr / bigint24;
      return (
        days !== Duration_bigint0 && parts.push(`${days}d`),
        parts.reverse().join(" ")
      );
    },
    Either_right = right,
    Either_left = left,
    Either_isLeft = isLeft,
    Either_isRight = isRight,
    mapLeft = Function_dual(2, (self, f) =>
      Either_isLeft(self) ? Either_left(f(self.left)) : Either_right(self.right)
    ),
    merge = Function_dual(2, (self, { onLeft, onRight }) =>
      Either_isLeft(self) ? onLeft(self.left) : onRight(self.right)
    )({ onLeft: Function_identity, onRight: Function_identity });
  const BUCKET_SIZE = Math.pow(2, 5),
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
  const stack_make = (value, previous) => ({ value, previous });
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
  class EmptyNode {
    _tag = "EmptyNode";
    modify(edit, _shift, f, hash, key, size) {
      const v = f(Option_none());
      return Option_isNone(v)
        ? new EmptyNode()
        : (++size.value, new LeafNode(edit, hash, key, v));
    }
  }
  function isEmptyNode(a) {
    return isTagged(a, "EmptyNode");
  }
  function canEditNode(node, edit) {
    return !isEmptyNode(node) && edit === node.edit;
  }
  class LeafNode {
    edit;
    hash;
    key;
    value;
    _tag = "LeafNode";
    constructor(edit, hash, key, value) {
      (this.edit = edit),
        (this.hash = hash),
        (this.key = key),
        (this.value = value);
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
    edit;
    hash;
    children;
    _tag = "CollisionNode";
    constructor(edit, hash, children) {
      (this.edit = edit), (this.hash = hash), (this.children = children);
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
    edit;
    mask;
    children;
    _tag = "IndexedNode";
    constructor(edit, mask, children) {
      (this.edit = edit), (this.mask = mask), (this.children = children);
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
    edit;
    size;
    children;
    _tag = "ArrayNode";
    constructor(edit, size, children) {
      (this.edit = edit), (this.size = size), (this.children = children);
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
      (stack = stack_make(res, stack)), (currentShift += 5);
    }
  }
  const HashMapTypeId = Symbol.for("effect/HashMap"),
    HashMapProto = {
      [HashMapTypeId]: HashMapTypeId,
      [Symbol.iterator]() {
        return new HashMapIterator(this, (k, v) => [k, v]);
      },
      [symbol]() {
        let hash = Hash_hash("effect/HashMap");
        for (const item of this)
          hash ^= Function_pipe(
            Hash_hash(item[0]),
            combine(Hash_hash(item[1]))
          );
        return cached(this, hash);
      },
      [Equal_symbol](that) {
        if (isHashMap(that)) {
          if (that._size !== this._size) return !1;
          for (const item of this) {
            const elem = Function_pipe(
              that,
              getHash(item[0], Hash_hash(item[0]))
            );
            if (Option_isNone(elem)) return !1;
            if (!equals(item[1], elem.value)) return !1;
          }
          return !0;
        }
        return !1;
      },
      toString() {
        return format(this.toJSON());
      },
      toJSON() {
        return { _id: "HashMap", values: Array.from(this).map(toJSON) };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    makeImpl = (editable, edit, root, size) => {
      const map = Object.create(HashMapProto);
      return (
        (map._editable = editable),
        (map._edit = edit),
        (map._root = root),
        (map._size = size),
        map
      );
    };
  class HashMapIterator {
    map;
    f;
    v;
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
    visitLazy = (node, f, cont = void 0) => {
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
    _empty = makeImpl(!1, 0, new EmptyNode(), 0),
    hashMap_empty = () => _empty,
    hashMap_fromIterable = (entries) => {
      const map = beginMutation(hashMap_empty());
      for (const entry of entries) hashMap_set(map, entry[0], entry[1]);
      return endMutation(map);
    },
    isHashMap = (u) => Predicate_hasProperty(u, HashMapTypeId),
    hashMap_get = Function_dual(2, (self, key) =>
      getHash(self, key, Hash_hash(key))
    ),
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
    hashMap_has = Function_dual(2, (self, key) =>
      Option_isSome(getHash(self, key, Hash_hash(key)))
    ),
    hashMap_set = Function_dual(3, (self, key, value) =>
      modifyAt(self, key, () => Option_some(value))
    ),
    setTree = Function_dual(3, (self, newRoot, newSize) =>
      self._editable
        ? ((self._root = newRoot), (self._size = newSize), self)
        : newRoot === self._root
        ? self
        : makeImpl(self._editable, self._edit, newRoot, newSize)
    ),
    hashMap_keys = (self) => new HashMapIterator(self, (key) => key),
    hashMap_size = (self) => self._size,
    beginMutation = (self) =>
      makeImpl(!0, self._edit + 1, self._root, self._size),
    endMutation = (self) => ((self._editable = !1), self),
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
      return Function_pipe(self, setTree(newRoot, size.value));
    }),
    hashMap_remove = Function_dual(2, (self, key) =>
      modifyAt(self, key, Option_none)
    ),
    hashMap_map = Function_dual(2, (self, f) =>
      hashMap_reduce(self, hashMap_empty(), (map, value, key) =>
        hashMap_set(map, key, f(value, key))
      )
    ),
    hashMap_forEach = Function_dual(2, (self, f) =>
      hashMap_reduce(self, void 0, (_, value, key) => f(value, key))
    ),
    hashMap_reduce = Function_dual(3, (self, zero, f) => {
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
    HashSetTypeId = Symbol.for("effect/HashSet"),
    HashSetProto = {
      [HashSetTypeId]: HashSetTypeId,
      [Symbol.iterator]() {
        return hashMap_keys(this._keyMap);
      },
      [symbol]() {
        return cached(
          this,
          combine(Hash_hash(this._keyMap))(Hash_hash("effect/HashSet"))
        );
      },
      [Equal_symbol](that) {
        return (
          !!isHashSet(that) &&
          hashMap_size(this._keyMap) === hashMap_size(that._keyMap) &&
          equals(this._keyMap, that._keyMap)
        );
      },
      toString() {
        return format(this.toJSON());
      },
      toJSON() {
        return { _id: "HashSet", values: Array.from(this).map(toJSON) };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    hashSet_makeImpl = (keyMap) => {
      const set = Object.create(HashSetProto);
      return (set._keyMap = keyMap), set;
    },
    isHashSet = (u) => Predicate_hasProperty(u, HashSetTypeId),
    hashSet_empty = hashSet_makeImpl(hashMap_empty()),
    internal_hashSet_empty = () => hashSet_empty,
    hashSet_has = Function_dual(2, (self, value) =>
      hashMap_has(self._keyMap, value)
    ),
    hashSet_beginMutation = (self) =>
      hashSet_makeImpl(beginMutation(self._keyMap)),
    hashSet_endMutation = (self) => ((self._keyMap._editable = !1), self),
    hashSet_mutate = Function_dual(2, (self, f) => {
      const transient = hashSet_beginMutation(self);
      return f(transient), hashSet_endMutation(transient);
    }),
    add = Function_dual(2, (self, value) =>
      self._keyMap._editable
        ? (hashMap_set(value, !0)(self._keyMap), self)
        : hashSet_makeImpl(hashMap_set(value, !0)(self._keyMap))
    ),
    hashSet_remove = Function_dual(2, (self, value) =>
      self._keyMap._editable
        ? (hashMap_remove(value)(self._keyMap), self)
        : hashSet_makeImpl(hashMap_remove(value)(self._keyMap))
    ),
    hashSet_difference = Function_dual(2, (self, that) =>
      hashSet_mutate(self, (set) => {
        for (const value of that) hashSet_remove(set, value);
      })
    ),
    hashSet_union = Function_dual(2, (self, that) =>
      hashSet_mutate(internal_hashSet_empty(), (set) => {
        hashSet_forEach(self, (value) => add(set, value));
        for (const value of that) add(set, value);
      })
    ),
    hashSet_forEach = Function_dual(2, (self, f) =>
      hashMap_forEach(self._keyMap, (_, k) => f(k))
    ),
    hashSet_reduce = Function_dual(3, (self, zero, f) =>
      hashMap_reduce(self._keyMap, zero, (z, _, a) => f(z, a))
    ),
    HashSet_empty = internal_hashSet_empty,
    HashSet_fromIterable = (elements) => {
      const set = hashSet_beginMutation(internal_hashSet_empty());
      for (const value of elements) add(set, value);
      return hashSet_endMutation(set);
    },
    HashSet_make = (...elements) => {
      const set = hashSet_beginMutation(internal_hashSet_empty());
      for (const value of elements) add(set, value);
      return hashSet_endMutation(set);
    },
    HashSet_has = hashSet_has,
    HashSet_size = (self) => hashMap_size(self._keyMap),
    HashSet_add = add,
    HashSet_remove = hashSet_remove,
    HashSet_difference = hashSet_difference,
    HashSet_union = hashSet_union,
    HashSet_reduce = hashSet_reduce,
    MutableRef_TypeId = Symbol.for("effect/MutableRef"),
    MutableRefProto = {
      [MutableRef_TypeId]: MutableRef_TypeId,
      toString() {
        return format(this.toJSON());
      },
      toJSON() {
        return { _id: "MutableRef", current: toJSON(this.current) };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    MutableRef_make = (value) => {
      const ref = Object.create(MutableRefProto);
      return (ref.current = value), ref;
    },
    MutableRef_get = (self) => self.current,
    MutableRef_set = Function_dual(
      2,
      (self, value) => ((self.current = value), self)
    ),
    FiberIdTypeId = Symbol.for("effect/FiberId"),
    emptyHash = string("effect/FiberId-None");
  class None {
    [FiberIdTypeId] = FiberIdTypeId;
    _tag = "None";
    id = -1;
    startTimeMillis = -1;
    [symbol]() {
      return emptyHash;
    }
    [Equal_symbol](that) {
      return isFiberId(that) && "None" === that._tag;
    }
    toString() {
      return format(this.toJSON());
    }
    toJSON() {
      return { _id: "FiberId", _tag: this._tag };
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  class Runtime {
    id;
    startTimeMillis;
    [FiberIdTypeId] = FiberIdTypeId;
    _tag = "Runtime";
    constructor(id, startTimeMillis) {
      (this.id = id), (this.startTimeMillis = startTimeMillis);
    }
    [symbol]() {
      return cached(
        this,
        string(`effect/FiberId-${this._tag}-${this.id}-${this.startTimeMillis}`)
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
    toString() {
      return format(this.toJSON());
    }
    toJSON() {
      return {
        _id: "FiberId",
        _tag: this._tag,
        id: this.id,
        startTimeMillis: this.startTimeMillis,
      };
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  const fiberId_none = new None(),
    isFiberId = (self) => Predicate_hasProperty(self, FiberIdTypeId),
    ids = (self) => {
      switch (self._tag) {
        case "None":
          return HashSet_empty();
        case "Runtime":
          return HashSet_make(self.id);
        case "Composite":
          return Function_pipe(ids(self.left), HashSet_union(ids(self.right)));
      }
    },
    _fiberCounter = GlobalValue_globalValue(
      Symbol.for("effect/Fiber/Id/_fiberCounter"),
      () => MutableRef_make(0)
    ),
    threadName = (self) =>
      Array.from(ids(self))
        .map((n) => `#${n}`)
        .join(","),
    FiberId_none = fiberId_none,
    FiberId_threadName = threadName,
    FiberId_unsafeMake = () => {
      const id = MutableRef_get(_fiberCounter);
      return (
        Function_pipe(_fiberCounter, MutableRef_set(id + 1)),
        new Runtime(id, Date.now())
      );
    },
    Number_Order = Order_number,
    ArbitraryHookId =
      (symbol, Equal_symbol, Symbol.for("@effect/schema/ArbitraryHookId"));
  const RegExp_escape = (string) =>
      string.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"),
    getKeysForIndexSignature = (input, parameter) => {
      switch (parameter._tag) {
        case "StringKeyword":
        case "TemplateLiteral":
          return Object.keys(input);
        case "SymbolKeyword":
          return Object.getOwnPropertySymbols(input);
        case "Refinement":
          return getKeysForIndexSignature(input, parameter.from);
      }
    },
    util_ownKeys = (o) =>
      Object.keys(o).concat(Object.getOwnPropertySymbols(o)),
    memoizeThunk = (f) => {
      let a,
        done = !1;
      return () => (done || ((a = f()), (done = !0)), a);
    },
    formatUnknown = (u) => {
      if (isString(u)) return JSON.stringify(u);
      if (
        isNumber(u) ||
        null == u ||
        Predicate_isBoolean(u) ||
        isSymbol(u) ||
        isDate(u)
      )
        return String(u);
      if (isBigInt(u)) return String(u) + "n";
      if (
        !Array.isArray(u) &&
        Predicate_hasProperty(u, "toString") &&
        Predicate_isFunction(u.toString) &&
        u.toString !== Object.prototype.toString
      )
        return u.toString();
      try {
        return (
          JSON.stringify(u),
          Array.isArray(u)
            ? `[${u.map(formatUnknown).join(",")}]`
            : `{${util_ownKeys(u)
                .map(
                  (k) =>
                    `${
                      isString(k) ? JSON.stringify(k) : String(k)
                    }:${formatUnknown(u[k])}`
                )
                .join(",")}}`
        );
      } catch (e) {
        return String(u);
      }
    },
    getDuplicatePropertySignatureErrorMessage = (name) =>
      `Duplicate property signature ${formatUnknown(name)}`,
    getDuplicateIndexSignatureErrorMessage = (name) =>
      `Duplicate index signature for type \`${name}\``,
    TypeAnnotationId = Symbol.for("@effect/schema/annotation/Type"),
    MessageAnnotationId = Symbol.for("@effect/schema/annotation/Message"),
    IdentifierAnnotationId = Symbol.for("@effect/schema/annotation/Identifier"),
    TitleAnnotationId = Symbol.for("@effect/schema/annotation/Title"),
    DescriptionAnnotationId = Symbol.for(
      "@effect/schema/annotation/Description"
    ),
    ExamplesAnnotationId = Symbol.for("@effect/schema/annotation/Examples"),
    DefaultAnnotationId = Symbol.for("@effect/schema/annotation/Default"),
    JSONSchemaAnnotationId = Symbol.for("@effect/schema/annotation/JSONSchema"),
    DocumentationAnnotationId = Symbol.for(
      "@effect/schema/annotation/Documentation"
    ),
    ConcurrencyAnnotationId = Symbol.for(
      "@effect/schema/annotation/Concurrency"
    ),
    BatchingAnnotationId = Symbol.for("@effect/schema/annotation/Batching"),
    SurrogateAnnotationId = Symbol.for("@effect/schema/annotation/Surrogate"),
    ParseIssueTitleAnnotationId = Symbol.for(
      "@effect/schema/annotation/ParseIssueTitle"
    ),
    getAnnotation = Function_dual(2, (annotated, key) =>
      Object.prototype.hasOwnProperty.call(annotated.annotations, key)
        ? Option_some(annotated.annotations[key])
        : Option_none()
    ),
    getMessageAnnotation = getAnnotation(MessageAnnotationId),
    getTitleAnnotation = getAnnotation(TitleAnnotationId),
    getIdentifierAnnotation = getAnnotation(IdentifierAnnotationId),
    getDescriptionAnnotation = getAnnotation(DescriptionAnnotationId),
    getConcurrencyAnnotation = getAnnotation(ConcurrencyAnnotationId),
    getBatchingAnnotation = getAnnotation(BatchingAnnotationId),
    getParseIssueTitleAnnotation = getAnnotation(ParseIssueTitleAnnotationId),
    getSurrogateAnnotation = getAnnotation(SurrogateAnnotationId),
    JSONIdentifierAnnotationId = Symbol.for(
      "@effect/schema/annotation/JSONIdentifier"
    ),
    getJSONIdentifierAnnotation = getAnnotation(JSONIdentifierAnnotationId);
  class Declaration {
    typeParameters;
    decodeUnknown;
    encodeUnknown;
    annotations;
    _tag = "Declaration";
    constructor(
      typeParameters,
      decodeUnknown,
      encodeUnknown,
      annotations = {}
    ) {
      (this.typeParameters = typeParameters),
        (this.decodeUnknown = decodeUnknown),
        (this.encodeUnknown = encodeUnknown),
        (this.annotations = annotations);
    }
    toString(verbose = !1) {
      return getOrElse(
        getExpected(this, verbose),
        () => "<declaration schema>"
      );
    }
    toJSON() {
      return {
        _tag: this._tag,
        typeParameters: this.typeParameters.map((ast) => ast.toJSON()),
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const createASTGuard = (tag) => (ast) => ast._tag === tag;
  class Literal {
    literal;
    annotations;
    _tag = "Literal";
    constructor(literal, annotations = {}) {
      (this.literal = literal), (this.annotations = annotations);
    }
    toString(verbose = !1) {
      return getOrElse(getExpected(this, verbose), () =>
        formatUnknown(this.literal)
      );
    }
    toJSON() {
      return {
        _tag: this._tag,
        literal: isBigInt(this.literal) ? String(this.literal) : this.literal,
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const isLiteral = createASTGuard("Literal");
  class UniqueSymbol {
    symbol;
    annotations;
    _tag = "UniqueSymbol";
    constructor(symbol, annotations = {}) {
      (this.symbol = symbol), (this.annotations = annotations);
    }
    toString(verbose = !1) {
      return getOrElse(getExpected(this, verbose), () =>
        formatUnknown(this.symbol)
      );
    }
    toJSON() {
      return {
        _tag: this._tag,
        symbol: String(this.symbol),
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  class NeverKeyword {
    annotations;
    _tag = "NeverKeyword";
    constructor(annotations = {}) {
      this.annotations = annotations;
    }
    toString(verbose = !1) {
      return formatKeyword(this, verbose);
    }
    toJSON() {
      return {
        _tag: this._tag,
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const neverKeyword = new NeverKeyword({ [TitleAnnotationId]: "never" });
  class UnknownKeyword {
    annotations;
    _tag = "UnknownKeyword";
    constructor(annotations = {}) {
      this.annotations = annotations;
    }
    toString(verbose = !1) {
      return formatKeyword(this, verbose);
    }
    toJSON() {
      return {
        _tag: this._tag,
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const unknownKeyword = new UnknownKeyword({ [TitleAnnotationId]: "unknown" });
  class AnyKeyword {
    annotations;
    _tag = "AnyKeyword";
    constructor(annotations = {}) {
      this.annotations = annotations;
    }
    toString(verbose = !1) {
      return formatKeyword(this, verbose);
    }
    toJSON() {
      return {
        _tag: this._tag,
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const anyKeyword = new AnyKeyword({ [TitleAnnotationId]: "any" });
  class StringKeyword {
    annotations;
    _tag = "StringKeyword";
    constructor(annotations = {}) {
      this.annotations = annotations;
    }
    toString(verbose = !1) {
      return formatKeyword(this, verbose);
    }
    toJSON() {
      return {
        _tag: this._tag,
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const stringKeyword = new StringKeyword({
      [TitleAnnotationId]: "string",
      [DescriptionAnnotationId]: "a string",
    }),
    isStringKeyword = createASTGuard("StringKeyword");
  const isNumberKeyword = createASTGuard("NumberKeyword");
  const isSymbolKeyword = createASTGuard("SymbolKeyword");
  class Element {
    type;
    isOptional;
    constructor(type, isOptional) {
      (this.type = type), (this.isOptional = isOptional);
    }
    toJSON() {
      return { type: this.type.toJSON(), isOptional: this.isOptional };
    }
    toString() {
      return String(this.type) + (this.isOptional ? "?" : "");
    }
  }
  class TupleType {
    elements;
    rest;
    isReadonly;
    annotations;
    _tag = "TupleType";
    constructor(elements, rest, isReadonly, annotations = {}) {
      (this.elements = elements),
        (this.rest = rest),
        (this.isReadonly = isReadonly),
        (this.annotations = annotations);
      let hasOptionalElement = !1,
        hasIllegalRequiredElement = !1;
      for (const e of elements)
        if (e.isOptional) hasOptionalElement = !0;
        else if (hasOptionalElement) {
          hasIllegalRequiredElement = !0;
          break;
        }
      if (hasIllegalRequiredElement || (hasOptionalElement && rest.length > 1))
        throw new Error(
          "A required element cannot follow an optional element. ts(1257)"
        );
    }
    toString(verbose = !1) {
      return getOrElse(getExpected(this, verbose), () => formatTuple(this));
    }
    toJSON() {
      return {
        _tag: this._tag,
        elements: this.elements.map((e) => e.toJSON()),
        rest: this.rest.map((ast) => ast.toJSON()),
        isReadonly: this.isReadonly,
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const formatTuple = (ast) => {
    const formattedElements = ast.elements.map(String).join(", ");
    return matchLeft(ast.rest, {
      onEmpty: () => `readonly [${formattedElements}]`,
      onNonEmpty: (head, tail) => {
        const formattedHead = String(head),
          wrappedHead = formattedHead.includes(" | ")
            ? `(${formattedHead})`
            : formattedHead;
        if (tail.length > 0) {
          const formattedTail = tail.map(String).join(", ");
          return ast.elements.length > 0
            ? `readonly [${formattedElements}, ...${wrappedHead}[], ${formattedTail}]`
            : `readonly [...${wrappedHead}[], ${formattedTail}]`;
        }
        return ast.elements.length > 0
          ? `readonly [${formattedElements}, ...${wrappedHead}[]]`
          : `ReadonlyArray<${formattedHead}>`;
      },
    });
  };
  class PropertySignature {
    name;
    type;
    isOptional;
    isReadonly;
    annotations;
    constructor(name, type, isOptional, isReadonly, annotations = {}) {
      (this.name = name),
        (this.type = type),
        (this.isOptional = isOptional),
        (this.isReadonly = isReadonly),
        (this.annotations = annotations);
    }
    toJSON() {
      return {
        name: String(this.name),
        type: this.type.toJSON(),
        isOptional: this.isOptional,
        isReadonly: this.isReadonly,
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const isParameter = (ast) => {
    switch (ast._tag) {
      case "StringKeyword":
      case "SymbolKeyword":
      case "TemplateLiteral":
        return !0;
      case "Refinement":
        return isParameter(ast.from);
    }
    return !1;
  };
  class IndexSignature {
    type;
    isReadonly;
    parameter;
    constructor(parameter, type, isReadonly) {
      if (
        ((this.type = type),
        (this.isReadonly = isReadonly),
        !isParameter(parameter))
      )
        throw new Error(
          "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types"
        );
      this.parameter = parameter;
    }
    toJSON() {
      return {
        parameter: this.parameter.toJSON(),
        type: this.type.toJSON(),
        isReadonly: this.isReadonly,
      };
    }
  }
  class TypeLiteral {
    annotations;
    _tag = "TypeLiteral";
    propertySignatures;
    indexSignatures;
    constructor(propertySignatures, indexSignatures, annotations = {}) {
      this.annotations = annotations;
      const keys = {};
      for (let i = 0; i < propertySignatures.length; i++) {
        const name = propertySignatures[i].name;
        if (Object.prototype.hasOwnProperty.call(keys, name))
          throw new Error(getDuplicatePropertySignatureErrorMessage(name));
        keys[name] = null;
      }
      const parameters = { string: !1, symbol: !1 };
      for (let i = 0; i < indexSignatures.length; i++) {
        const parameter = getParameterBase(indexSignatures[i].parameter);
        if (isStringKeyword(parameter)) {
          if (parameters.string)
            throw new Error(getDuplicateIndexSignatureErrorMessage("string"));
          parameters.string = !0;
        } else if (isSymbolKeyword(parameter)) {
          if (parameters.symbol)
            throw new Error(getDuplicateIndexSignatureErrorMessage("symbol"));
          parameters.symbol = !0;
        }
      }
      (this.propertySignatures = sortPropertySignatures(propertySignatures)),
        (this.indexSignatures = sortIndexSignatures(indexSignatures));
    }
    toString(verbose = !1) {
      return getOrElse(getExpected(this, verbose), () =>
        formatTypeLiteral(this)
      );
    }
    toJSON() {
      return {
        _tag: this._tag,
        propertySignatures: this.propertySignatures.map((ps) => ps.toJSON()),
        indexSignatures: this.indexSignatures.map((ps) => ps.toJSON()),
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const formatTypeLiteral = (ast) => {
      const formattedPropertySignatures = ast.propertySignatures
        .map(
          (ps) => String(ps.name) + (ps.isOptional ? "?" : "") + ": " + ps.type
        )
        .join("; ");
      if (ast.indexSignatures.length > 0) {
        const formattedIndexSignatures = ast.indexSignatures
          .map((is) => `[x: ${getParameterBase(is.parameter)}]: ${is.type}`)
          .join("; ");
        return ast.propertySignatures.length > 0
          ? `{ ${formattedPropertySignatures}; ${formattedIndexSignatures} }`
          : `{ ${formattedIndexSignatures} }`;
      }
      return ast.propertySignatures.length > 0
        ? `{ ${formattedPropertySignatures} }`
        : "{}";
    },
    sortCandidates = sort(
      Order_mapInput(Number_Order, (ast) => {
        switch (ast._tag) {
          case "AnyKeyword":
            return 0;
          case "UnknownKeyword":
            return 1;
          case "ObjectKeyword":
            return 2;
          case "StringKeyword":
          case "NumberKeyword":
          case "BooleanKeyword":
          case "BigIntKeyword":
          case "SymbolKeyword":
            return 3;
        }
        return 4;
      })
    ),
    literalMap = {
      string: "StringKeyword",
      number: "NumberKeyword",
      boolean: "BooleanKeyword",
      bigint: "BigIntKeyword",
    },
    AST_flatten = (candidates) =>
      Array_flatMap(candidates, (ast) =>
        isUnion(ast) ? AST_flatten(ast.types) : [ast]
      );
  class Union {
    types;
    annotations;
    static make = (candidates, annotations) => {
      const types = [],
        memo = new Set();
      for (let i = 0; i < candidates.length; i++) {
        const ast = candidates[i];
        ast === neverKeyword ||
          memo.has(ast) ||
          (memo.add(ast), types.push(ast));
      }
      return Union.union(types, annotations);
    };
    static members = (candidates, annotations) =>
      Union.union(
        ((candidates) => candidates.filter((ast) => !(ast === neverKeyword)))(
          candidates
        ),
        annotations
      );
    static unify = (candidates, annotations) =>
      Union.union(
        ((candidates) => {
          const cs = sortCandidates(candidates),
            out = [],
            uniques = {},
            literals = [];
          for (const ast of cs)
            switch (ast._tag) {
              case "NeverKeyword":
                break;
              case "AnyKeyword":
                return [anyKeyword];
              case "UnknownKeyword":
                return [unknownKeyword];
              case "ObjectKeyword":
              case "UndefinedKeyword":
              case "VoidKeyword":
              case "StringKeyword":
              case "NumberKeyword":
              case "BooleanKeyword":
              case "BigIntKeyword":
              case "SymbolKeyword":
                uniques[ast._tag] || ((uniques[ast._tag] = ast), out.push(ast));
                break;
              case "Literal": {
                const type = typeof ast.literal;
                switch (type) {
                  case "string":
                  case "number":
                  case "bigint":
                  case "boolean":
                    uniques[literalMap[type]] ||
                      literals.includes(ast.literal) ||
                      (literals.push(ast.literal), out.push(ast));
                    break;
                  case "object":
                    literals.includes(ast.literal) ||
                      (literals.push(ast.literal), out.push(ast));
                }
                break;
              }
              case "UniqueSymbol":
                uniques.SymbolKeyword ||
                  literals.includes(ast.symbol) ||
                  (literals.push(ast.symbol), out.push(ast));
                break;
              case "TupleType":
                uniques.ObjectKeyword || out.push(ast);
                break;
              case "TypeLiteral":
                0 === ast.propertySignatures.length &&
                0 === ast.indexSignatures.length
                  ? uniques["{}"] || ((uniques["{}"] = ast), out.push(ast))
                  : uniques.ObjectKeyword || out.push(ast);
                break;
              default:
                out.push(ast);
            }
          return out;
        })(AST_flatten(candidates)),
        annotations
      );
    static union = (types, annotations) =>
      isMembers(types)
        ? new Union(types, annotations)
        : 1 === types.length
        ? types[0]
        : neverKeyword;
    _tag = "Union";
    constructor(types, annotations = {}) {
      (this.types = types), (this.annotations = annotations);
    }
    toString(verbose = !1) {
      return getOrElse(getExpected(this, verbose), () =>
        this.types.map(String).join(" | ")
      );
    }
    toJSON() {
      return {
        _tag: this._tag,
        types: this.types.map((ast) => ast.toJSON()),
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const isMembers = (as) => as.length > 1,
    isUnion = createASTGuard("Union"),
    toJSONMemoMap = GlobalValue_globalValue(
      Symbol.for("@effect/schema/AST/toJSONMemoMap"),
      () => new WeakMap()
    );
  class Suspend {
    f;
    annotations;
    _tag = "Suspend";
    constructor(f, annotations = {}) {
      (this.f = f),
        (this.annotations = annotations),
        (this.f = memoizeThunk(f));
    }
    toString(verbose = !1) {
      return getExpected(this, verbose).pipe(
        orElse(() => {
          return flatMap(
            ((f = this.f),
            (...a) => {
              try {
                return Option_some(f(...a));
              } catch (e) {
                return Option_none();
              }
            })(),
            (ast) => getExpected(ast, verbose)
          );
          var f;
        }),
        getOrElse(() => "<suspended schema>")
      );
    }
    toJSON() {
      const ast = this.f();
      let out = toJSONMemoMap.get(ast);
      return (
        out ||
        (toJSONMemoMap.set(ast, { _tag: this._tag }),
        (out = {
          _tag: this._tag,
          ast: ast.toJSON(),
          annotations: toJSONAnnotations(this.annotations),
        }),
        toJSONMemoMap.set(ast, out),
        out)
      );
    }
  }
  class Refinement {
    from;
    filter;
    annotations;
    _tag = "Refinement";
    constructor(from, filter, annotations = {}) {
      (this.from = from),
        (this.filter = filter),
        (this.annotations = annotations);
    }
    toString(verbose = !1) {
      return getOrElse(getExpected(this, verbose), () => "<refinement schema>");
    }
    toJSON() {
      return {
        _tag: this._tag,
        from: this.from.toJSON(),
        annotations: toJSONAnnotations(this.annotations),
      };
    }
  }
  const isRefinement = createASTGuard("Refinement"),
    defaultParseOption = {};
  const AST_annotations = (ast, annotations) => {
      const d = Object.getOwnPropertyDescriptors(ast);
      return (
        (d.annotations.value = { ...ast.annotations, ...annotations }),
        Object.create(Object.getPrototypeOf(ast), d)
      );
    },
    getTemplateLiteralRegExp = (ast) => {
      let pattern = `^${RegExp_escape(ast.head)}`;
      for (const span of ast.spans)
        isStringKeyword(span.type)
          ? (pattern += ".*")
          : isNumberKeyword(span.type) &&
            (pattern += "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?"),
          (pattern += RegExp_escape(span.literal));
      return (pattern += "$"), new RegExp(pattern);
    },
    typeAST = (ast) => {
      switch (ast._tag) {
        case "Declaration": {
          const typeParameters = changeMap(ast.typeParameters, typeAST);
          return typeParameters === ast.typeParameters
            ? ast
            : new Declaration(
                typeParameters,
                ast.decodeUnknown,
                ast.encodeUnknown,
                ast.annotations
              );
        }
        case "TupleType": {
          const elements = changeMap(ast.elements, (e) => {
              const type = typeAST(e.type);
              return type === e.type ? e : new Element(type, e.isOptional);
            }),
            rest = changeMap(ast.rest, typeAST);
          return elements === ast.elements && rest === ast.rest
            ? ast
            : new TupleType(elements, rest, ast.isReadonly, ast.annotations);
        }
        case "TypeLiteral": {
          const propertySignatures = changeMap(ast.propertySignatures, (p) => {
              const type = typeAST(p.type);
              return type === p.type
                ? p
                : new PropertySignature(
                    p.name,
                    type,
                    p.isOptional,
                    p.isReadonly
                  );
            }),
            indexSignatures = changeMap(ast.indexSignatures, (is) => {
              const type = typeAST(is.type);
              return type === is.type
                ? is
                : new IndexSignature(is.parameter, type, is.isReadonly);
            });
          return propertySignatures === ast.propertySignatures &&
            indexSignatures === ast.indexSignatures
            ? ast
            : new TypeLiteral(
                propertySignatures,
                indexSignatures,
                ast.annotations
              );
        }
        case "Union": {
          const types = changeMap(ast.types, typeAST);
          return types === ast.types ? ast : Union.make(types, ast.annotations);
        }
        case "Suspend":
          return new Suspend(() => typeAST(ast.f()), ast.annotations);
        case "Refinement": {
          const from = typeAST(ast.from);
          return from === ast.from
            ? ast
            : new Refinement(from, ast.filter, ast.annotations);
        }
        case "Transformation":
          return typeAST(ast.to);
      }
      return ast;
    },
    createJSONIdentifierAnnotation = (annotated) =>
      match(
        ((annotated) =>
          orElse(getJSONIdentifierAnnotation(annotated), () =>
            getIdentifierAnnotation(annotated)
          ))(annotated),
        {
          onNone: () => {},
          onSome: (identifier) => ({
            [JSONIdentifierAnnotationId]: identifier,
          }),
        }
      );
  function changeMap(as, f) {
    let changed = !1;
    const out = allocate(as.length);
    for (let i = 0; i < as.length; i++) {
      const a = as[i],
        fa = f(a);
      fa !== a && (changed = !0), (out[i] = fa);
    }
    return changed ? out : as;
  }
  const encodedAST = (ast) => {
      switch (ast._tag) {
        case "Declaration": {
          const typeParameters = changeMap(ast.typeParameters, encodedAST);
          return typeParameters === ast.typeParameters
            ? ast
            : new Declaration(
                typeParameters,
                ast.decodeUnknown,
                ast.encodeUnknown,
                ast.annotations
              );
        }
        case "TupleType": {
          const elements = changeMap(ast.elements, (e) => {
              const type = encodedAST(e.type);
              return type === e.type ? e : new Element(type, e.isOptional);
            }),
            rest = changeMap(ast.rest, encodedAST);
          return elements === ast.elements && rest === ast.rest
            ? ast
            : new TupleType(
                elements,
                rest,
                ast.isReadonly,
                createJSONIdentifierAnnotation(ast)
              );
        }
        case "TypeLiteral": {
          const propertySignatures = changeMap(ast.propertySignatures, (ps) => {
              const type = encodedAST(ps.type);
              return type === ps.type
                ? ps
                : new PropertySignature(
                    ps.name,
                    type,
                    ps.isOptional,
                    ps.isReadonly
                  );
            }),
            indexSignatures = changeMap(ast.indexSignatures, (is) => {
              const type = encodedAST(is.type);
              return type === is.type
                ? is
                : new IndexSignature(is.parameter, type, is.isReadonly);
            });
          return propertySignatures === ast.propertySignatures &&
            indexSignatures === ast.indexSignatures
            ? ast
            : new TypeLiteral(
                propertySignatures,
                indexSignatures,
                createJSONIdentifierAnnotation(ast)
              );
        }
        case "Union": {
          const types = changeMap(ast.types, encodedAST);
          return types === ast.types
            ? ast
            : Union.make(types, createJSONIdentifierAnnotation(ast));
        }
        case "Suspend":
          return new Suspend(
            () => encodedAST(ast.f()),
            createJSONIdentifierAnnotation(ast)
          );
        case "Refinement":
        case "Transformation":
          return encodedAST(ast.from);
      }
      return ast;
    },
    toJSONAnnotations = (annotations) => {
      const out = {};
      for (const k of Object.getOwnPropertySymbols(annotations))
        out[String(k)] = annotations[k];
      return out;
    },
    sortPropertySignatures = sort(
      Order_mapInput(Number_Order, (ps) =>
        ((ast) => {
          switch (ast._tag) {
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
              return 5;
            case "UnknownKeyword":
            case "AnyKeyword":
              return 6;
            default:
              return 4;
          }
        })(ps.type)
      )
    ),
    sortIndexSignatures = sort(
      Order_mapInput(Number_Order, (is) => {
        switch (getParameterBase(is.parameter)._tag) {
          case "StringKeyword":
            return 2;
          case "SymbolKeyword":
            return 3;
          case "TemplateLiteral":
            return 1;
        }
      })
    ),
    getParameterBase = (ast) => {
      switch (ast._tag) {
        case "StringKeyword":
        case "SymbolKeyword":
        case "TemplateLiteral":
          return ast;
        case "Refinement":
          return getParameterBase(ast.from);
      }
    },
    formatKeyword = (ast, verbose = !1) =>
      getOrElse(getExpected(ast, verbose), () => ast._tag),
    getExpected = (ast, verbose) => {
      if (verbose) {
        const description = getDescriptionAnnotation(ast).pipe(
          orElse(() => getTitleAnnotation(ast))
        );
        return match(getIdentifierAnnotation(ast), {
          onNone: () => description,
          onSome: (identifier) =>
            match(description, {
              onNone: () => Option_some(identifier),
              onSome: (description) =>
                Option_some(`${identifier} (${description})`),
            }),
        });
      }
      return getIdentifierAnnotation(ast).pipe(
        orElse(() => getTitleAnnotation(ast)),
        orElse(() => getDescriptionAnnotation(ast))
      );
    },
    EquivalenceHookId = Symbol.for("@effect/schema/EquivalenceHookId"),
    Chunk_TypeId = Symbol.for("effect/Chunk");
  const emptyArray = [],
    Chunk_getEquivalence = (isEquivalent) =>
      make(
        (self, that) =>
          self.length === that.length &&
          toReadonlyArray(self).every((value, i) =>
            isEquivalent(value, Chunk_unsafeGet(that, i))
          )
      ),
    Chunk_equivalence = Chunk_getEquivalence(equals),
    ChunkProto = {
      [Chunk_TypeId]: { _A: (_) => _ },
      toString() {
        return format(this.toJSON());
      },
      toJSON() {
        return { _id: "Chunk", values: toReadonlyArray(this).map(toJSON) };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      [Equal_symbol](that) {
        return isChunk(that) && Chunk_equivalence(this, that);
      },
      [symbol]() {
        return cached(this, array(toReadonlyArray(this)));
      },
      [Symbol.iterator]() {
        switch (this.backing._tag) {
          case "IArray":
            return this.backing.array[Symbol.iterator]();
          case "IEmpty":
            return emptyArray[Symbol.iterator]();
          default:
            return toReadonlyArray(this)[Symbol.iterator]();
        }
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    makeChunk = (backing) => {
      const chunk = Object.create(ChunkProto);
      switch (((chunk.backing = backing), backing._tag)) {
        case "IEmpty":
          (chunk.length = 0),
            (chunk.depth = 0),
            (chunk.left = chunk),
            (chunk.right = chunk);
          break;
        case "IConcat":
          (chunk.length = backing.left.length + backing.right.length),
            (chunk.depth =
              1 + Math.max(backing.left.depth, backing.right.depth)),
            (chunk.left = backing.left),
            (chunk.right = backing.right);
          break;
        case "IArray":
          (chunk.length = backing.array.length),
            (chunk.depth = 0),
            (chunk.left = Chunk_empty),
            (chunk.right = Chunk_empty);
          break;
        case "ISingleton":
          (chunk.length = 1),
            (chunk.depth = 0),
            (chunk.left = Chunk_empty),
            (chunk.right = Chunk_empty);
          break;
        case "ISlice":
          (chunk.length = backing.length),
            (chunk.depth = backing.chunk.depth + 1),
            (chunk.left = Chunk_empty),
            (chunk.right = Chunk_empty);
      }
      return chunk;
    },
    isChunk = (u) => Predicate_hasProperty(u, Chunk_TypeId),
    Chunk_empty = makeChunk({ _tag: "IEmpty" }),
    esm_Chunk_empty = () => Chunk_empty,
    Chunk_make = (...as) =>
      1 === as.length ? Chunk_of(as[0]) : unsafeFromNonEmptyArray(as),
    Chunk_of = (a) => makeChunk({ _tag: "ISingleton", a }),
    Chunk_fromIterable = (self) =>
      isChunk(self)
        ? self
        : makeChunk({ _tag: "IArray", array: Array_fromIterable(self) }),
    copyToArray = (self, array, initial) => {
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
          break;
        case "ISlice": {
          let i = 0,
            j = initial;
          for (; i < self.length; )
            (array[j] = Chunk_unsafeGet(self, i)), (i += 1), (j += 1);
          break;
        }
      }
    },
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
            (self.left = Chunk_empty),
            (self.right = Chunk_empty),
            (self.depth = 0),
            arr
          );
        }
      }
    },
    Chunk_reverse = (self) => {
      switch (self.backing._tag) {
        case "IEmpty":
        case "ISingleton":
          return self;
        case "IArray":
          return makeChunk({
            _tag: "IArray",
            array: Array_reverse(self.backing.array),
          });
        case "IConcat":
          return makeChunk({
            _tag: "IConcat",
            left: Chunk_reverse(self.backing.right),
            right: Chunk_reverse(self.backing.left),
          });
        case "ISlice":
          return unsafeFromArray(Array_reverse(toReadonlyArray(self)));
      }
    },
    unsafeFromArray = (self) => makeChunk({ _tag: "IArray", array: self }),
    unsafeFromNonEmptyArray = (self) => unsafeFromArray(self),
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
        case "ISlice":
          return Chunk_unsafeGet(
            self.backing.chunk,
            index + self.backing.offset
          );
      }
    }),
    Chunk_append = Function_dual(2, (self, a) =>
      Chunk_appendAll(self, Chunk_of(a))
    ),
    Chunk_prepend = Function_dual(2, (self, elem) =>
      Chunk_appendAll(Chunk_of(elem), self)
    ),
    Chunk_drop = Function_dual(2, (self, n) => {
      if (n <= 0) return self;
      if (n >= self.length) return Chunk_empty;
      switch (self.backing._tag) {
        case "ISlice":
          return makeChunk({
            _tag: "ISlice",
            chunk: self.backing.chunk,
            offset: self.backing.offset + n,
            length: self.backing.length - n,
          });
        case "IConcat":
          return n > self.left.length
            ? Chunk_drop(self.right, n - self.left.length)
            : makeChunk({
                _tag: "IConcat",
                left: Chunk_drop(self.left, n),
                right: self.right,
              });
        default:
          return makeChunk({
            _tag: "ISlice",
            chunk: self,
            offset: n,
            length: self.length - n,
          });
      }
    }),
    Chunk_appendAll = Function_dual(2, (self, that) => {
      if ("IEmpty" === self.backing._tag) return that;
      if ("IEmpty" === that.backing._tag) return self;
      const diff = that.depth - self.depth;
      if (Math.abs(diff) <= 1)
        return makeChunk({ _tag: "IConcat", left: self, right: that });
      if (diff < -1) {
        if (self.left.depth >= self.right.depth) {
          const nr = Chunk_appendAll(self.right, that);
          return makeChunk({ _tag: "IConcat", left: self.left, right: nr });
        }
        {
          const nrr = Chunk_appendAll(self.right.right, that);
          if (nrr.depth === self.depth - 3) {
            const nr = makeChunk({
              _tag: "IConcat",
              left: self.right.left,
              right: nrr,
            });
            return makeChunk({ _tag: "IConcat", left: self.left, right: nr });
          }
          {
            const nl = makeChunk({
              _tag: "IConcat",
              left: self.left,
              right: self.right.left,
            });
            return makeChunk({ _tag: "IConcat", left: nl, right: nrr });
          }
        }
      }
      if (that.right.depth >= that.left.depth) {
        const nl = Chunk_appendAll(self, that.left);
        return makeChunk({ _tag: "IConcat", left: nl, right: that.right });
      }
      {
        const nll = Chunk_appendAll(self, that.left.left);
        if (nll.depth === that.depth - 3) {
          const nl = makeChunk({
            _tag: "IConcat",
            left: nll,
            right: that.left.right,
          });
          return makeChunk({ _tag: "IConcat", left: nl, right: that.right });
        }
        {
          const nr = makeChunk({
            _tag: "IConcat",
            left: that.left.right,
            right: that.right,
          });
          return makeChunk({ _tag: "IConcat", left: nll, right: nr });
        }
      }
    }),
    Chunk_isEmpty = (self) => 0 === self.length,
    isNonEmpty = (self) => self.length > 0,
    unsafeHead = (self) => Chunk_unsafeGet(self, 0),
    Chunk_headNonEmpty = unsafeHead,
    Chunk_tailNonEmpty = (self) => Chunk_drop(self, 1),
    TagTypeId = Symbol.for("effect/Context/Tag"),
    STMTypeId = Symbol.for("effect/STM"),
    context_TagProto = {
      ...EffectPrototype,
      _tag: "Tag",
      _op: "Tag",
      [STMTypeId]: effectVariance,
      [TagTypeId]: { _Service: (_) => _, _Identifier: (_) => _ },
      toString() {
        return format(this.toJSON());
      },
      toJSON() {
        return { _id: "Tag", key: this.key, stack: this.stack };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      of: (self) => self,
      context(self) {
        return context_make(this, self);
      },
    },
    context_TypeId = Symbol.for("effect/Context"),
    ContextProto = {
      [context_TypeId]: { _Services: (_) => _ },
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
      },
      [symbol]() {
        return cached(this, number(this.unsafeMap.size));
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
      toString() {
        return format(this.toJSON());
      },
      toJSON() {
        return {
          _id: "Context",
          services: Array.from(this.unsafeMap).map(toJSON),
        };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
    },
    makeContext = (unsafeMap) => {
      const context = Object.create(ContextProto);
      return (context.unsafeMap = unsafeMap), context;
    },
    isContext = (u) => Predicate_hasProperty(u, context_TypeId),
    context_empty = makeContext(new Map()),
    context_make = (tag, service) => makeContext(new Map([[tag.key, service]])),
    context_add = Function_dual(3, (self, tag, service) => {
      const map = new Map(self.unsafeMap);
      return map.set(tag.key, service), makeContext(map);
    }),
    context_unsafeGet = Function_dual(2, (self, tag) => {
      if (!self.unsafeMap.has(tag.key))
        throw ((tag) => {
          const error = new Error(
            "Service not found" + (tag.key ? `: ${String(tag.key)}` : "")
          );
          if (tag.stack) {
            const lines = tag.stack.split("\n");
            if (lines.length > 2) {
              const afterAt = lines[2].match(/at (.*)/);
              afterAt &&
                (error.message = error.message + ` (defined at ${afterAt[1]})`);
            }
          }
          if (error.stack) {
            const lines = error.stack.split("\n");
            lines.splice(1, 3), (error.stack = lines.join("\n"));
          }
          return error;
        })(tag);
      return self.unsafeMap.get(tag.key);
    }),
    context_get = context_unsafeGet,
    getOption = Function_dual(2, (self, tag) =>
      self.unsafeMap.has(tag.key)
        ? option_some(self.unsafeMap.get(tag.key))
        : none
    ),
    context_merge = Function_dual(2, (self, that) => {
      const map = new Map(self.unsafeMap);
      for (const [tag, s] of that.unsafeMap) map.set(tag, s);
      return makeContext(map);
    }),
    GenericTag = (key) => {
      const limit = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      const creationError = new Error();
      Error.stackTraceLimit = limit;
      const tag = Object.create(context_TagProto);
      return (
        Object.defineProperty(tag, "stack", { get: () => creationError.stack }),
        (tag.key = key),
        tag
      );
    },
    Context_empty = () => context_empty,
    Context_make = context_make,
    Context_add = context_add,
    Context_get = context_get,
    Context_unsafeGet = context_unsafeGet,
    Context_getOption = getOption,
    Context_merge = context_merge;
  const HashMap_empty = hashMap_empty,
    HashMap_fromIterable = hashMap_fromIterable,
    HashMap_isEmpty = (self) => self && isEmptyNode(self._root),
    HashMap_get = hashMap_get,
    HashMap_set = hashMap_set,
    HashMap_keys = hashMap_keys,
    HashMap_size = hashMap_size,
    HashMap_modifyAt = modifyAt,
    HashMap_map = hashMap_map,
    HashMap_reduce = hashMap_reduce,
    List_TypeId = Symbol.for("effect/List"),
    List_toArray = (self) => Array_fromIterable(self),
    List_getEquivalence = (isEquivalent) =>
      Equivalence_mapInput(Array_getEquivalence(isEquivalent), List_toArray),
    List_equivalence = List_getEquivalence(equals),
    ConsProto = {
      [List_TypeId]: List_TypeId,
      _tag: "Cons",
      toString() {
        return format(this.toJSON());
      },
      toJSON() {
        return {
          _id: "List",
          _tag: "Cons",
          values: List_toArray(this).map(toJSON),
        };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      [Equal_symbol](that) {
        return (
          isList(that) &&
          this._tag === that._tag &&
          List_equivalence(this, that)
        );
      },
      [symbol]() {
        return cached(this, array(List_toArray(this)));
      },
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
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    makeCons = (head, tail) => {
      const cons = Object.create(ConsProto);
      return (cons.head = head), (cons.tail = tail), cons;
    },
    NilHash = string("Nil"),
    NilProto = {
      [List_TypeId]: List_TypeId,
      _tag: "Nil",
      toString() {
        return format(this.toJSON());
      },
      toJSON: () => ({ _id: "List", _tag: "Nil" }),
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      [symbol]: () => NilHash,
      [Equal_symbol](that) {
        return isList(that) && this._tag === that._tag;
      },
      [Symbol.iterator]: () => ({ next: () => ({ done: !0, value: void 0 }) }),
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    _Nil = Object.create(NilProto),
    isList = (u) => Predicate_hasProperty(u, List_TypeId),
    isNil = (self) => "Nil" === self._tag,
    isCons = (self) => "Cons" === self._tag,
    cons = (head, tail) => makeCons(head, tail),
    List_empty = () => _Nil,
    List_of = (value) => makeCons(value, _Nil),
    List_appendAll = Function_dual(2, (self, that) =>
      List_prependAll(that, self)
    ),
    List_prepend = Function_dual(2, (self, element) => cons(element, self)),
    List_prependAll = Function_dual(2, (self, prefix) => {
      if (isNil(self)) return prefix;
      if (isNil(prefix)) return self;
      {
        const result = makeCons(prefix.head, self);
        let curr = result,
          that = prefix.tail;
        for (; !isNil(that); ) {
          const temp = makeCons(that.head, self);
          (curr.tail = temp), (curr = temp), (that = that.tail);
        }
        return result;
      }
    }),
    List_reduce = Function_dual(3, (self, zero, f) => {
      let acc = zero,
        these = self;
      for (; !isNil(these); ) (acc = f(acc, these.head)), (these = these.tail);
      return acc;
    }),
    List_reverse = (self) => {
      let result = List_empty(),
        these = self;
      for (; !isNil(these); )
        (result = List_prepend(result, these.head)), (these = these.tail);
      return result;
    },
    Structural =
      (Array.prototype,
      symbol,
      Equal_symbol,
      (function () {
        function Structural(args) {
          args && Object.assign(this, args);
        }
        return (
          (Structural.prototype = effectable_StructuralPrototype), Structural
        );
      })()),
    ChunkPatchTypeId = Symbol.for("effect/DifferChunkPatch");
  function variance(a) {
    return a;
  }
  Structural.prototype;
  const ContextPatchTypeId = Symbol.for("effect/DifferContextPatch");
  function contextPatch_variance(a) {
    return a;
  }
  const contextPatch_PatchProto = {
      ...Structural.prototype,
      [ContextPatchTypeId]: {
        _Value: contextPatch_variance,
        _Patch: contextPatch_variance,
      },
    },
    contextPatch_EmptyProto = Object.assign(
      Object.create(contextPatch_PatchProto),
      { _tag: "Empty" }
    ),
    contextPatch_empty = Object.create(contextPatch_EmptyProto),
    differ_contextPatch_empty = () => contextPatch_empty,
    contextPatch_AndThenProto = Object.assign(
      Object.create(contextPatch_PatchProto),
      { _tag: "AndThen" }
    ),
    AddServiceProto = Object.assign(Object.create(contextPatch_PatchProto), {
      _tag: "AddService",
    }),
    makeAddService = (key, service) => {
      const o = Object.create(AddServiceProto);
      return (o.key = key), (o.service = service), o;
    },
    RemoveServiceProto = Object.assign(Object.create(contextPatch_PatchProto), {
      _tag: "RemoveService",
    }),
    makeRemoveService = (key) => {
      const o = Object.create(RemoveServiceProto);
      return (o.key = key), o;
    },
    UpdateServiceProto = Object.assign(Object.create(contextPatch_PatchProto), {
      _tag: "UpdateService",
    }),
    makeUpdateService = (key, update) => {
      const o = Object.create(UpdateServiceProto);
      return (o.key = key), (o.update = update), o;
    },
    contextPatch_combine = Function_dual(2, (self, that) =>
      ((first, second) => {
        const o = Object.create(contextPatch_AndThenProto);
        return (o.first = first), (o.second = second), o;
      })(self, that)
    ),
    contextPatch_patch = Function_dual(2, (self, context) => {
      if ("Empty" === self._tag) return context;
      let wasServiceUpdated = !1,
        patches = Chunk_of(self);
      const updatedContext = new Map(context.unsafeMap);
      for (; isNonEmpty(patches); ) {
        const head = Chunk_headNonEmpty(patches),
          tail = Chunk_tailNonEmpty(patches);
        switch (head._tag) {
          case "Empty":
            patches = tail;
            break;
          case "AddService":
            updatedContext.set(head.key, head.service), (patches = tail);
            break;
          case "AndThen":
            patches = Chunk_prepend(
              Chunk_prepend(tail, head.second),
              head.first
            );
            break;
          case "RemoveService":
            updatedContext.delete(head.key), (patches = tail);
            break;
          case "UpdateService":
            updatedContext.set(
              head.key,
              head.update(updatedContext.get(head.key))
            ),
              (wasServiceUpdated = !0),
              (patches = tail);
        }
      }
      if (!wasServiceUpdated) return makeContext(updatedContext);
      const map = new Map();
      for (const [tag] of context.unsafeMap)
        updatedContext.has(tag) &&
          (map.set(tag, updatedContext.get(tag)), updatedContext.delete(tag));
      for (const [tag, s] of updatedContext) map.set(tag, s);
      return makeContext(map);
    }),
    HashMapPatchTypeId = Symbol.for("effect/DifferHashMapPatch");
  function hashMapPatch_variance(a) {
    return a;
  }
  Structural.prototype;
  const HashSetPatchTypeId = Symbol.for("effect/DifferHashSetPatch");
  function hashSetPatch_variance(a) {
    return a;
  }
  const hashSetPatch_PatchProto = {
      ...Structural.prototype,
      [HashSetPatchTypeId]: {
        _Value: hashSetPatch_variance,
        _Key: hashSetPatch_variance,
        _Patch: hashSetPatch_variance,
      },
    },
    hashSetPatch_EmptyProto = Object.assign(
      Object.create(hashSetPatch_PatchProto),
      { _tag: "Empty" }
    ),
    hashSetPatch_empty = Object.create(hashSetPatch_EmptyProto),
    differ_hashSetPatch_empty = () => hashSetPatch_empty,
    hashSetPatch_AndThenProto = Object.assign(
      Object.create(hashSetPatch_PatchProto),
      { _tag: "AndThen" }
    ),
    hashSetPatch_AddProto = Object.assign(
      Object.create(hashSetPatch_PatchProto),
      { _tag: "Add" }
    ),
    hashSetPatch_makeAdd = (value) => {
      const o = Object.create(hashSetPatch_AddProto);
      return (o.value = value), o;
    },
    hashSetPatch_RemoveProto = Object.assign(
      Object.create(hashSetPatch_PatchProto),
      { _tag: "Remove" }
    ),
    hashSetPatch_diff = (oldValue, newValue) => {
      const [removed, patch] = HashSet_reduce(
        [oldValue, differ_hashSetPatch_empty()],
        ([set, patch], value) =>
          HashSet_has(value)(set)
            ? [HashSet_remove(value)(set), patch]
            : [set, hashSetPatch_combine(hashSetPatch_makeAdd(value))(patch)]
      )(newValue);
      return HashSet_reduce(patch, (patch, value) =>
        hashSetPatch_combine(
          ((value) => {
            const o = Object.create(hashSetPatch_RemoveProto);
            return (o.value = value), o;
          })(value)
        )(patch)
      )(removed);
    },
    hashSetPatch_combine = Function_dual(2, (self, that) =>
      ((first, second) => {
        const o = Object.create(hashSetPatch_AndThenProto);
        return (o.first = first), (o.second = second), o;
      })(self, that)
    ),
    hashSetPatch_patch = Function_dual(2, (self, oldValue) => {
      if ("Empty" === self._tag) return oldValue;
      let set = oldValue,
        patches = Chunk_of(self);
      for (; isNonEmpty(patches); ) {
        const head = Chunk_headNonEmpty(patches),
          tail = Chunk_tailNonEmpty(patches);
        switch (head._tag) {
          case "Empty":
            patches = tail;
            break;
          case "AndThen":
            patches = Chunk_prepend(head.first)(
              Chunk_prepend(head.second)(tail)
            );
            break;
          case "Add":
            (set = HashSet_add(head.value)(set)), (patches = tail);
            break;
          case "Remove":
            (set = HashSet_remove(head.value)(set)), (patches = tail);
        }
      }
      return set;
    }),
    OrPatchTypeId = Symbol.for("effect/DifferOrPatch");
  function orPatch_variance(a) {
    return a;
  }
  Structural.prototype;
  const ReadonlyArrayPatchTypeId = Symbol.for(
    "effect/DifferReadonlyArrayPatch"
  );
  function readonlyArrayPatch_variance(a) {
    return a;
  }
  const readonlyArrayPatch_PatchProto = {
      ...Structural.prototype,
      [ReadonlyArrayPatchTypeId]: {
        _Value: readonlyArrayPatch_variance,
        _Patch: readonlyArrayPatch_variance,
      },
    },
    readonlyArrayPatch_EmptyProto = Object.assign(
      Object.create(readonlyArrayPatch_PatchProto),
      { _tag: "Empty" }
    ),
    readonlyArrayPatch_empty = Object.create(readonlyArrayPatch_EmptyProto),
    differ_readonlyArrayPatch_empty = () => readonlyArrayPatch_empty,
    readonlyArrayPatch_AndThenProto = Object.assign(
      Object.create(readonlyArrayPatch_PatchProto),
      { _tag: "AndThen" }
    ),
    readonlyArrayPatch_AppendProto = Object.assign(
      Object.create(readonlyArrayPatch_PatchProto),
      { _tag: "Append" }
    ),
    readonlyArrayPatch_SliceProto = Object.assign(
      Object.create(readonlyArrayPatch_PatchProto),
      { _tag: "Slice" }
    ),
    readonlyArrayPatch_UpdateProto = Object.assign(
      Object.create(readonlyArrayPatch_PatchProto),
      { _tag: "Update" }
    ),
    readonlyArrayPatch_makeUpdate = (index, patch) => {
      const o = Object.create(readonlyArrayPatch_UpdateProto);
      return (o.index = index), (o.patch = patch), o;
    },
    readonlyArrayPatch_diff = (options) => {
      let i = 0,
        patch = differ_readonlyArrayPatch_empty();
      for (; i < options.oldValue.length && i < options.newValue.length; ) {
        const oldElement = options.oldValue[i],
          newElement = options.newValue[i],
          valuePatch = options.differ.diff(oldElement, newElement);
        equals(valuePatch, options.differ.empty) ||
          (patch = readonlyArrayPatch_combine(
            patch,
            readonlyArrayPatch_makeUpdate(i, valuePatch)
          )),
          (i += 1);
      }
      return (
        i < options.oldValue.length &&
          (patch = readonlyArrayPatch_combine(
            patch,
            ((from, until) => {
              const o = Object.create(readonlyArrayPatch_SliceProto);
              return (o.from = from), (o.until = until), o;
            })(0, i)
          )),
        i < options.newValue.length &&
          (patch = readonlyArrayPatch_combine(
            patch,
            ((values) => {
              const o = Object.create(readonlyArrayPatch_AppendProto);
              return (o.values = values), o;
            })(Array_drop(i)(options.newValue))
          )),
        patch
      );
    },
    readonlyArrayPatch_combine = Function_dual(2, (self, that) =>
      ((first, second) => {
        const o = Object.create(readonlyArrayPatch_AndThenProto);
        return (o.first = first), (o.second = second), o;
      })(self, that)
    ),
    readonlyArrayPatch_patch = Function_dual(3, (self, oldValue, differ) => {
      if ("Empty" === self._tag) return oldValue;
      let readonlyArray = oldValue.slice(),
        patches = Array_of(self);
      for (; Array_isNonEmptyArray(patches); ) {
        const head = headNonEmpty(patches),
          tail = tailNonEmpty(patches);
        switch (head._tag) {
          case "Empty":
            patches = tail;
            break;
          case "AndThen":
            tail.unshift(head.first, head.second), (patches = tail);
            break;
          case "Append":
            for (const value of head.values) readonlyArray.push(value);
            patches = tail;
            break;
          case "Slice":
            (readonlyArray = readonlyArray.slice(head.from, head.until)),
              (patches = tail);
            break;
          case "Update":
            (readonlyArray[head.index] = differ.patch(
              head.patch,
              readonlyArray[head.index]
            )),
              (patches = tail);
        }
      }
      return readonlyArray;
    }),
    DifferTypeId = Symbol.for("effect/Differ"),
    DifferProto = {
      [DifferTypeId]: { _P: Function_identity, _V: Function_identity },
    },
    differ_make = (params) => {
      const differ = Object.create(DifferProto);
      return (
        (differ.empty = params.empty),
        (differ.diff = params.diff),
        (differ.combine = params.combine),
        (differ.patch = params.patch),
        differ
      );
    },
    environment = () =>
      differ_make({
        empty: differ_contextPatch_empty(),
        combine: (first, second) => contextPatch_combine(second)(first),
        diff: (oldValue, newValue) =>
          ((oldValue, newValue) => {
            const missingServices = new Map(oldValue.unsafeMap);
            let patch = differ_contextPatch_empty();
            for (const [tag, newService] of newValue.unsafeMap.entries())
              if (missingServices.has(tag)) {
                const old = missingServices.get(tag);
                missingServices.delete(tag),
                  equals(old, newService) ||
                    (patch = contextPatch_combine(
                      makeUpdateService(tag, () => newService)
                    )(patch));
              } else
                missingServices.delete(tag),
                  (patch = contextPatch_combine(
                    makeAddService(tag, newService)
                  )(patch));
            for (const [tag] of missingServices.entries())
              patch = contextPatch_combine(makeRemoveService(tag))(patch);
            return patch;
          })(oldValue, newValue),
        patch: (patch, oldValue) => contextPatch_patch(oldValue)(patch),
      }),
    hashSet = () =>
      differ_make({
        empty: differ_hashSetPatch_empty(),
        combine: (first, second) => hashSetPatch_combine(second)(first),
        diff: (oldValue, newValue) => hashSetPatch_diff(oldValue, newValue),
        patch: (patch, oldValue) => hashSetPatch_patch(oldValue)(patch),
      }),
    differ_readonlyArray = (differ) =>
      differ_make({
        empty: differ_readonlyArrayPatch_empty(),
        combine: (first, second) => readonlyArrayPatch_combine(first, second),
        diff: (oldValue, newValue) =>
          readonlyArrayPatch_diff({ oldValue, newValue, differ }),
        patch: (patch, oldValue) =>
          readonlyArrayPatch_patch(patch, oldValue, differ),
      }),
    differ_update = () => updateWith((_, a) => a),
    updateWith = (f) =>
      differ_make({
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
    active = (patch) => 255 & patch,
    enabled = (patch) => (patch >> 8) & 255,
    runtimeFlagsPatch_make = (active, enabled) =>
      (255 & active) + ((enabled & active & 255) << 8),
    runtimeFlagsPatch_empty = runtimeFlagsPatch_make(0, 0),
    exclude = Function_dual(2, (self, flag) =>
      runtimeFlagsPatch_make(active(self) & ~flag, enabled(self))
    ),
    runtimeFlagsPatch_andThen = Function_dual(2, (self, that) => self | that),
    invert = (n) => (~n >>> 0) & 255,
    runtimeFlags_enable = Function_dual(2, (self, flag) => self | flag),
    interruptible = (self) => interruption(self) && !windDown(self),
    interruption = (self) => runtimeFlags_isEnabled(self, 1),
    runtimeFlags_isEnabled = Function_dual(
      2,
      (self, flag) => 0 != (self & flag)
    ),
    runtimeFlags_make = (...flags) => flags.reduce((a, b) => a | b, 0),
    runtimeFlags_none = runtimeFlags_make(0),
    runtimeMetrics = (self) => runtimeFlags_isEnabled(self, 4),
    windDown = (self) => runtimeFlags_isEnabled(self, 16),
    runtimeFlags_diff = Function_dual(2, (self, that) =>
      runtimeFlagsPatch_make(self ^ that, that)
    ),
    runtimeFlags_patch = Function_dual(
      2,
      (self, patch) =>
        (self & (invert(active(patch)) | enabled(patch))) |
        (active(patch) & enabled(patch))
    ),
    differ = differ_make({
      empty: runtimeFlagsPatch_empty,
      diff: (oldValue, newValue) => runtimeFlags_diff(oldValue, newValue),
      combine: (first, second) => runtimeFlagsPatch_andThen(second)(first),
      patch: (_patch, oldValue) => runtimeFlags_patch(oldValue, _patch),
    }),
    RuntimeFlagsPatch_enable = (flag) => runtimeFlagsPatch_make(flag, flag),
    RuntimeFlagsPatch_disable = (flag) => runtimeFlagsPatch_make(flag, 0),
    RuntimeFlagsPatch_exclude = exclude,
    CauseTypeId = Symbol.for("effect/Cause"),
    cause_proto = {
      [CauseTypeId]: { _E: (_) => _ },
      [symbol]() {
        return Function_pipe(
          Hash_hash("effect/Cause"),
          combine(Hash_hash(flattenCause(this))),
          cached(this)
        );
      },
      [Equal_symbol](that) {
        return isCause(that) && causeEquals(this, that);
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
      toJSON() {
        switch (this._tag) {
          case "Empty":
            return { _id: "Cause", _tag: this._tag };
          case "Die":
            return {
              _id: "Cause",
              _tag: this._tag,
              defect: toJSON(this.defect),
            };
          case "Interrupt":
            return {
              _id: "Cause",
              _tag: this._tag,
              fiberId: this.fiberId.toJSON(),
            };
          case "Fail":
            return {
              _id: "Cause",
              _tag: this._tag,
              failure: toJSON(this.error),
            };
          case "Sequential":
          case "Parallel":
            return {
              _id: "Cause",
              _tag: this._tag,
              left: toJSON(this.left),
              right: toJSON(this.right),
            };
        }
      },
      toString() {
        return pretty(this);
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
    },
    cause_empty = (() => {
      const o = Object.create(cause_proto);
      return (o._tag = "Empty"), o;
    })(),
    fail = (error) => {
      const o = Object.create(cause_proto);
      return (o._tag = "Fail"), (o.error = error), o;
    },
    die = (defect) => {
      const o = Object.create(cause_proto);
      return (o._tag = "Die"), (o.defect = defect), o;
    },
    interrupt = (fiberId) => {
      const o = Object.create(cause_proto);
      return (o._tag = "Interrupt"), (o.fiberId = fiberId), o;
    },
    parallel = (left, right) => {
      const o = Object.create(cause_proto);
      return (o._tag = "Parallel"), (o.left = left), (o.right = right), o;
    },
    sequential = (left, right) => {
      const o = Object.create(cause_proto);
      return (o._tag = "Sequential"), (o.left = left), (o.right = right), o;
    },
    isCause = (u) => Predicate_hasProperty(u, CauseTypeId),
    cause_isEmpty = (self) =>
      "Empty" === self._tag ||
      cause_reduce(self, !0, (acc, cause) => {
        switch (cause._tag) {
          case "Empty":
            return Option_some(acc);
          case "Die":
          case "Fail":
          case "Interrupt":
            return Option_some(!1);
          default:
            return Option_none();
        }
      }),
    isInterrupted = (self) => Option_isSome(interruptOption(self)),
    isInterruptedOnly = (self) =>
      reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self),
    cause_failures = (self) =>
      Chunk_reverse(
        cause_reduce(self, esm_Chunk_empty(), (list, cause) =>
          "Fail" === cause._tag
            ? Option_some(Function_pipe(list, Chunk_prepend(cause.error)))
            : Option_none()
        )
      ),
    cause_defects = (self) =>
      Chunk_reverse(
        cause_reduce(self, esm_Chunk_empty(), (list, cause) =>
          "Die" === cause._tag
            ? Option_some(Function_pipe(list, Chunk_prepend(cause.defect)))
            : Option_none()
        )
      ),
    interruptors = (self) =>
      cause_reduce(self, HashSet_empty(), (set, cause) =>
        "Interrupt" === cause._tag
          ? Option_some(Function_pipe(set, HashSet_add(cause.fiberId)))
          : Option_none()
      ),
    failureOption = (self) =>
      find(self, (cause) =>
        "Fail" === cause._tag ? Option_some(cause.error) : Option_none()
      ),
    failureOrCause = (self) => {
      const option = failureOption(self);
      switch (option._tag) {
        case "None":
          return Either_right(self);
        case "Some":
          return Either_left(option.value);
      }
    },
    interruptOption = (self) =>
      find(self, (cause) =>
        "Interrupt" === cause._tag ? Option_some(cause.fiberId) : Option_none()
      ),
    stripFailures = (self) =>
      cause_match(self, {
        onEmpty: cause_empty,
        onFail: () => cause_empty,
        onDie: (defect) => die(defect),
        onInterrupt: (fiberId) => interrupt(fiberId),
        onSequential: sequential,
        onParallel: parallel,
      }),
    causeEquals = (left, right) => {
      let leftStack = Chunk_of(left),
        rightStack = Chunk_of(right);
      for (; isNonEmpty(leftStack) && isNonEmpty(rightStack); ) {
        const [leftParallel, leftSequential] = Function_pipe(
            Chunk_headNonEmpty(leftStack),
            cause_reduce(
              [HashSet_empty(), esm_Chunk_empty()],
              ([parallel, sequential], cause) => {
                const [par, seq] = evaluateCause(cause);
                return Option_some([
                  Function_pipe(parallel, HashSet_union(par)),
                  Function_pipe(sequential, Chunk_appendAll(seq)),
                ]);
              }
            )
          ),
          [rightParallel, rightSequential] = Function_pipe(
            Chunk_headNonEmpty(rightStack),
            cause_reduce(
              [HashSet_empty(), esm_Chunk_empty()],
              ([parallel, sequential], cause) => {
                const [par, seq] = evaluateCause(cause);
                return Option_some([
                  Function_pipe(parallel, HashSet_union(par)),
                  Function_pipe(sequential, Chunk_appendAll(seq)),
                ]);
              }
            )
          );
        if (!equals(leftParallel, rightParallel)) return !1;
        (leftStack = leftSequential), (rightStack = rightSequential);
      }
      return !0;
    },
    flattenCause = (cause) =>
      flattenCauseLoop(Chunk_of(cause), esm_Chunk_empty()),
    flattenCauseLoop = (causes, flattened) => {
      for (;;) {
        const [parallel, sequential] = Function_pipe(
            causes,
            Array_reduce(
              [HashSet_empty(), esm_Chunk_empty()],
              ([parallel, sequential], cause) => {
                const [par, seq] = evaluateCause(cause);
                return [
                  Function_pipe(parallel, HashSet_union(par)),
                  Function_pipe(sequential, Chunk_appendAll(seq)),
                ];
              }
            )
          ),
          updated =
            HashSet_size(parallel) > 0
              ? Function_pipe(flattened, Chunk_prepend(parallel))
              : flattened;
        if (Chunk_isEmpty(sequential)) return Chunk_reverse(updated);
        (causes = sequential), (flattened = updated);
      }
      throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"));
    },
    find = Function_dual(2, (self, pf) => {
      const stack = [self];
      for (; stack.length > 0; ) {
        const item = stack.pop(),
          option = pf(item);
        switch (option._tag) {
          case "None":
            switch (item._tag) {
              case "Sequential":
              case "Parallel":
                stack.push(item.right), stack.push(item.left);
            }
            break;
          case "Some":
            return option;
        }
      }
      return Option_none();
    }),
    evaluateCause = (self) => {
      let cause = self;
      const stack = [];
      let _parallel = HashSet_empty(),
        _sequential = esm_Chunk_empty();
      for (; void 0 !== cause; )
        switch (cause._tag) {
          case "Empty":
            if (0 === stack.length) return [_parallel, _sequential];
            cause = stack.pop();
            break;
          case "Fail":
            if (
              ((_parallel = HashSet_add(
                _parallel,
                Chunk_make(cause._tag, cause.error)
              )),
              0 === stack.length)
            )
              return [_parallel, _sequential];
            cause = stack.pop();
            break;
          case "Die":
            if (
              ((_parallel = HashSet_add(
                _parallel,
                Chunk_make(cause._tag, cause.defect)
              )),
              0 === stack.length)
            )
              return [_parallel, _sequential];
            cause = stack.pop();
            break;
          case "Interrupt":
            if (
              ((_parallel = HashSet_add(
                _parallel,
                Chunk_make(cause._tag, cause.fiberId)
              )),
              0 === stack.length)
            )
              return [_parallel, _sequential];
            cause = stack.pop();
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
              default:
                (_sequential = Chunk_prepend(_sequential, cause.right)),
                  (cause = cause.left);
            }
            break;
          case "Parallel":
            stack.push(cause.right), (cause = cause.left);
        }
      throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"));
    },
    IsInterruptedOnlyCauseReducer = {
      emptyCase: constTrue,
      failCase: constFalse,
      dieCase: constFalse,
      interruptCase: constTrue,
      sequentialCase: (_, left, right) => left && right,
      parallelCase: (_, left, right) => left && right,
    },
    cause_match = Function_dual(
      2,
      (
        self,
        { onDie, onEmpty, onFail, onInterrupt, onParallel, onSequential }
      ) =>
        reduceWithContext(self, void 0, {
          emptyCase: () => onEmpty,
          failCase: (_, error) => onFail(error),
          dieCase: (_, defect) => onDie(defect),
          interruptCase: (_, fiberId) => onInterrupt(fiberId),
          sequentialCase: (_, left, right) => onSequential(left, right),
          parallelCase: (_, left, right) => onParallel(left, right),
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
            }
            break;
          case "Right":
            accumulator.push(either.right);
        }
      }
      if (0 === accumulator.length)
        throw new Error(
          "BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues"
        );
      return accumulator.pop();
    }),
    pretty = (cause) => {
      if (isInterruptedOnly(cause))
        return "All fibers interrupted without errors.";
      const final = cause_prettyErrors(cause)
        .map((e) => {
          let message = e.message;
          if (
            (e.stack &&
              (message += `\r\n${((stack) => {
                const lines = stack.split("\n"),
                  out = [];
                for (let i = 0; i < lines.length; i++)
                  if (
                    (out.push(
                      lines[i].replace(
                        /at .*effect_instruction_i.*\((.*)\)/,
                        "at $1"
                      )
                    ),
                    lines[i].includes("effect_instruction_i"))
                  )
                    return out.join("\n");
                return out.join("\n");
              })(e.stack)}`),
            e.span)
          ) {
            let current = e.span,
              i = 0;
            for (; current && "Span" === current._tag && i < 10; )
              (message += `\r\n    at ${current.name}`),
                (current = getOrUndefined(current.parent)),
                i++;
          }
          return message;
        })
        .join("\r\n");
      return final;
    };
  class PrettyError {
    message;
    stack;
    span;
    constructor(message, stack, span) {
      (this.message = message), (this.stack = stack), (this.span = span);
    }
    toJSON() {
      const out = { message: this.message };
      return (
        this.stack && (out.stack = this.stack),
        this.span && (out.span = this.span),
        out
      );
    }
  }
  const prettyErrorMessage = (u) => {
      if ("string" == typeof u) return `Error: ${u}`;
      try {
        if (
          Predicate_hasProperty(u, "toString") &&
          Predicate_isFunction(u.toString) &&
          u.toString !== Object.prototype.toString &&
          u.toString !== globalThis.Array.prototype.toString
        )
          return u.toString();
      } catch {}
      return `Error: ${JSON.stringify(u)}`;
    },
    spanSymbol = Symbol.for("effect/SpanAnnotation"),
    defaultRenderError = (error) => {
      const span =
        Predicate_hasProperty(error, spanSymbol) && error[spanSymbol];
      return error instanceof Error
        ? new PrettyError(
            prettyErrorMessage(error),
            error.stack
              ?.split("\n")
              .filter((_) => _.match(/at (.*)/))
              .join("\n"),
            span
          )
        : new PrettyError(prettyErrorMessage(error), void 0, span);
    },
    cause_prettyErrors = (cause) =>
      reduceWithContext(cause, void 0, {
        emptyCase: () => [],
        dieCase: (_, unknownError) => [defaultRenderError(unknownError)],
        failCase: (_, error) => [defaultRenderError(error)],
        interruptCase: () => [],
        parallelCase: (_, l, r) => [...l, ...r],
        sequentialCase: (_, l, r) => [...l, ...r],
      }),
    DeferredTypeId = Symbol.for("effect/Deferred"),
    deferredVariance = { _E: (_) => _, _A: (_) => _ },
    done = (effect) => ({ _tag: "Done", effect });
  class singleShotGen_SingleShotGen {
    self;
    called = !1;
    constructor(self) {
      this.self = self;
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
      return new singleShotGen_SingleShotGen(this.self);
    }
  }
  const TracerTypeId = Symbol.for("effect/Tracer"),
    tracer_make = (options) => ({ [TracerTypeId]: TracerTypeId, ...options }),
    tracerTag = GenericTag("effect/Tracer"),
    spanTag = GenericTag("effect/ParentSpan"),
    randomHexString = (function () {
      return function (length) {
        let result = "";
        for (let i = 0; i < length; i++)
          result += "abcdef0123456789".charAt(Math.floor(16 * Math.random()));
        return result;
      };
    })();
  class NativeSpan {
    name;
    parent;
    context;
    links;
    startTime;
    kind;
    _tag = "Span";
    spanId;
    traceId = "native";
    sampled = !0;
    status;
    attributes;
    events = [];
    constructor(name, parent, context, links, startTime, kind) {
      (this.name = name),
        (this.parent = parent),
        (this.context = context),
        (this.links = links),
        (this.startTime = startTime),
        (this.kind = kind),
        (this.status = { _tag: "Started", startTime }),
        (this.attributes = new Map()),
        (this.traceId =
          "Some" === parent._tag ? parent.value.traceId : randomHexString(32)),
        (this.spanId = randomHexString(16));
    }
    end(endTime, exit) {
      this.status = {
        _tag: "Ended",
        endTime,
        exit,
        startTime: this.status.startTime,
      };
    }
    attribute(key, value) {
      this.attributes.set(key, value);
    }
    event(name, startTime, attributes) {
      this.events.push([name, startTime, attributes ?? {}]);
    }
  }
  const nativeTracer = tracer_make({
      span: (name, parent, context, links, startTime, kind) =>
        new NativeSpan(name, parent, context, links, startTime, kind),
      context: (f) => f(),
    }),
    EffectErrorTypeId = Symbol.for("effect/EffectError"),
    blocked = (blockedRequests, _continue) => {
      const effect = new EffectPrimitive("Blocked");
      return (
        (effect.effect_instruction_i0 = blockedRequests),
        (effect.effect_instruction_i1 = _continue),
        effect
      );
    },
    runRequestBlock = (blockedRequests) => {
      const effect = new EffectPrimitive("RunBlocked");
      return (effect.effect_instruction_i0 = blockedRequests), effect;
    },
    core_EffectTypeId = Symbol.for("effect/Effect");
  class RevertFlags {
    patch;
    op;
    _op = "RevertFlags";
    constructor(patch, op) {
      (this.patch = patch), (this.op = op);
    }
  }
  class EffectPrimitive {
    _op;
    effect_instruction_i0 = void 0;
    effect_instruction_i1 = void 0;
    effect_instruction_i2 = void 0;
    trace = void 0;
    [core_EffectTypeId] = effectVariance;
    constructor(_op) {
      this._op = _op;
    }
    [Equal_symbol](that) {
      return this === that;
    }
    [symbol]() {
      return cached(this, random(this));
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
    toJSON() {
      return {
        _id: "Effect",
        _op: this._op,
        effect_instruction_i0: toJSON(this.effect_instruction_i0),
        effect_instruction_i1: toJSON(this.effect_instruction_i1),
        effect_instruction_i2: toJSON(this.effect_instruction_i2),
      };
    }
    toString() {
      return format(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
    [Symbol.iterator]() {
      return new singleShotGen_SingleShotGen(new YieldWrap(this));
    }
  }
  class EffectPrimitiveFailure {
    _op;
    effect_instruction_i0 = void 0;
    effect_instruction_i1 = void 0;
    effect_instruction_i2 = void 0;
    trace = void 0;
    [core_EffectTypeId] = effectVariance;
    constructor(_op) {
      (this._op = _op), (this._tag = _op);
    }
    [Equal_symbol](that) {
      return this === that;
    }
    [symbol]() {
      return cached(this, random(this));
    }
    get cause() {
      return this.effect_instruction_i0;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
    toJSON() {
      return { _id: "Exit", _tag: this._op, cause: this.cause.toJSON() };
    }
    toString() {
      return format(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
    [Symbol.iterator]() {
      return new singleShotGen_SingleShotGen(new YieldWrap(this));
    }
  }
  class EffectPrimitiveSuccess {
    _op;
    effect_instruction_i0 = void 0;
    effect_instruction_i1 = void 0;
    effect_instruction_i2 = void 0;
    trace = void 0;
    [core_EffectTypeId] = effectVariance;
    constructor(_op) {
      (this._op = _op), (this._tag = _op);
    }
    [Equal_symbol](that) {
      return this === that;
    }
    [symbol]() {
      return cached(this, random(this));
    }
    get value() {
      return this.effect_instruction_i0;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
    toJSON() {
      return { _id: "Exit", _tag: this._op, value: toJSON(this.value) };
    }
    toString() {
      return format(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
    [Symbol.iterator]() {
      return new singleShotGen_SingleShotGen(new YieldWrap(this));
    }
  }
  const isEffect = (u) => Predicate_hasProperty(u, core_EffectTypeId),
    withFiberRuntime = (withRuntime) => {
      const effect = new EffectPrimitive("WithRuntime");
      return (effect.effect_instruction_i0 = withRuntime), effect;
    },
    acquireUseRelease = Function_dual(3, (acquire, use, release) =>
      uninterruptibleMask((restore) =>
        core_flatMap(acquire, (a) =>
          core_flatMap(core_exit(suspend(() => restore(use(a)))), (exit) =>
            suspend(() => release(a, exit)).pipe(
              matchCauseEffect({
                onFailure: (cause) => {
                  switch (exit._tag) {
                    case "Failure":
                      return failCause(
                        parallel(exit.effect_instruction_i0, cause)
                      );
                    case "Success":
                      return failCause(cause);
                  }
                },
                onSuccess: () => exit,
              })
            )
          )
        )
      )
    ),
    core_as = Function_dual(2, (self, value) =>
      core_flatMap(self, () => succeed(value))
    ),
    core_asVoid = (self) => core_as(self, void 0),
    custom = function () {
      const wrapper = new EffectPrimitive("Commit");
      switch (arguments.length) {
        case 2:
          (wrapper.effect_instruction_i0 = arguments[0]),
            (wrapper.commit = arguments[1]);
          break;
        case 3:
          (wrapper.effect_instruction_i0 = arguments[0]),
            (wrapper.effect_instruction_i1 = arguments[1]),
            (wrapper.commit = arguments[2]);
          break;
        case 4:
          (wrapper.effect_instruction_i0 = arguments[0]),
            (wrapper.effect_instruction_i1 = arguments[1]),
            (wrapper.effect_instruction_i2 = arguments[2]),
            (wrapper.commit = arguments[3]);
          break;
        default:
          throw new Error(
            getBugErrorMessage("you're not supposed to end up here")
          );
      }
      return wrapper;
    },
    core_async = (register, blockingOn = FiberId_none) =>
      custom(register, function () {
        let backingResume, pendingEffect;
        function proxyResume(effect) {
          backingResume
            ? backingResume(effect)
            : void 0 === pendingEffect && (pendingEffect = effect);
        }
        const effect = new EffectPrimitive("Async");
        let cancelerRef, controllerRef;
        return (
          (effect.effect_instruction_i0 = (resume) => {
            (backingResume = resume), pendingEffect && resume(pendingEffect);
          }),
          (effect.effect_instruction_i1 = blockingOn),
          1 !== this.effect_instruction_i0.length
            ? ((controllerRef = new AbortController()),
              (cancelerRef = this.effect_instruction_i0(
                proxyResume,
                controllerRef.signal
              )))
            : (cancelerRef = this.effect_instruction_i0(proxyResume)),
          cancelerRef || controllerRef
            ? onInterrupt(
                effect,
                (_) => (
                  controllerRef && controllerRef.abort(),
                  cancelerRef ?? core_void_
                )
              )
            : effect
        );
      }),
    catchAll = Function_dual(2, (self, f) =>
      matchEffect(self, { onFailure: f, onSuccess: succeed })
    ),
    core_spanSymbol = Symbol.for("effect/SpanAnnotation"),
    originalSymbol = Symbol.for("effect/OriginalAnnotation"),
    capture = (obj, span) =>
      Option_isSome(span)
        ? new Proxy(obj, {
            has: (target, p) =>
              p === core_spanSymbol || p === originalSymbol || p in target,
            get: (target, p) =>
              p === core_spanSymbol
                ? span.value
                : p === originalSymbol
                ? obj
                : target[p],
          })
        : obj,
    dieMessage = (message) =>
      failCauseSync(() => die(new RuntimeException(message))),
    core_either = (self) =>
      matchEffect(self, {
        onFailure: (e) => succeed(Either_left(e)),
        onSuccess: (a) => succeed(Either_right(a)),
      }),
    core_exit = (self) =>
      matchCause(self, { onFailure: exitFailCause, onSuccess: exitSucceed }),
    core_fail = (error) =>
      Predicate_isObject(error) && !(core_spanSymbol in error)
        ? withFiberRuntime((fiber) =>
            failCause(fail(capture(error, currentSpanFromFiber(fiber))))
          )
        : failCause(fail(error)),
    failSync = (evaluate) => core_flatMap(sync(evaluate), core_fail),
    failCause = (cause) => {
      const effect = new EffectPrimitiveFailure("Failure");
      return (effect.effect_instruction_i0 = cause), effect;
    },
    failCauseSync = (evaluate) => core_flatMap(sync(evaluate), failCause),
    fiberId = withFiberRuntime((state) => succeed(state.id())),
    fiberIdWith = (f) => withFiberRuntime((state) => f(state.id())),
    core_flatMap = Function_dual(2, (self, f) => {
      const effect = new EffectPrimitive("OnSuccess");
      return (
        (effect.effect_instruction_i0 = self),
        (effect.effect_instruction_i1 = f),
        effect
      );
    }),
    step = (self) => {
      const effect = new EffectPrimitive("OnStep");
      return (effect.effect_instruction_i0 = self), effect;
    },
    core_flatten = (self) => core_flatMap(self, Function_identity),
    matchCause = Function_dual(2, (self, options) =>
      matchCauseEffect(self, {
        onFailure: (cause) => succeed(options.onFailure(cause)),
        onSuccess: (a) => succeed(options.onSuccess(a)),
      })
    ),
    matchCauseEffect = Function_dual(2, (self, options) => {
      const effect = new EffectPrimitive("OnSuccessAndFailure");
      return (
        (effect.effect_instruction_i0 = self),
        (effect.effect_instruction_i1 = options.onFailure),
        (effect.effect_instruction_i2 = options.onSuccess),
        effect
      );
    }),
    matchEffect = Function_dual(2, (self, options) =>
      matchCauseEffect(self, {
        onFailure: (cause) => {
          if (cause_defects(cause).length > 0)
            return failCause(
              ((self) =>
                cause_match(self, {
                  onEmpty: cause_empty,
                  onFail: (failure) => die(failure),
                  onDie: (defect) => die(defect),
                  onInterrupt: (fiberId) => interrupt(fiberId),
                  onSequential: (left, right) => sequential(left, right),
                  onParallel: (left, right) => parallel(left, right),
                }))(cause)
            );
          const failures = cause_failures(cause);
          return failures.length > 0
            ? options.onFailure(unsafeHead(failures))
            : failCause(cause);
        },
        onSuccess: options.onSuccess,
      })
    ),
    forEachSequential = Function_dual(2, (self, f) =>
      suspend(() => {
        const arr = Array_fromIterable(self),
          ret = allocate(arr.length);
        let i = 0;
        return core_as(
          whileLoop({
            while: () => i < arr.length,
            body: () => f(arr[i], i),
            step: (b) => {
              ret[i++] = b;
            },
          }),
          ret
        );
      })
    ),
    forEachSequentialDiscard = Function_dual(2, (self, f) =>
      suspend(() => {
        const arr = Array_fromIterable(self);
        let i = 0;
        return whileLoop({
          while: () => i < arr.length,
          body: () => f(arr[i], i),
          step: () => {
            i++;
          },
        });
      })
    ),
    core_interruptible = (self) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      return (
        (effect.effect_instruction_i0 = RuntimeFlagsPatch_enable(1)),
        (effect.effect_instruction_i1 = () => self),
        effect
      );
    },
    core_map = Function_dual(2, (self, f) =>
      core_flatMap(self, (a) => sync(() => f(a)))
    ),
    core_mapBoth = Function_dual(2, (self, options) =>
      matchEffect(self, {
        onFailure: (e) => failSync(() => options.onFailure(e)),
        onSuccess: (a) => sync(() => options.onSuccess(a)),
      })
    ),
    mapError = Function_dual(2, (self, f) =>
      matchCauseEffect(self, {
        onFailure: (cause) => {
          const either = failureOrCause(cause);
          switch (either._tag) {
            case "Left":
              return failSync(() => f(either.left));
            case "Right":
              return failCause(either.right);
          }
        },
        onSuccess: succeed,
      })
    ),
    onExit = Function_dual(2, (self, cleanup) =>
      uninterruptibleMask((restore) =>
        matchCauseEffect(restore(self), {
          onFailure: (cause1) => {
            const result = exitFailCause(cause1);
            return matchCauseEffect(cleanup(result), {
              onFailure: (cause2) => exitFailCause(sequential(cause1, cause2)),
              onSuccess: () => result,
            });
          },
          onSuccess: (success) => {
            const result = exitSucceed(success);
            return core_zipRight(cleanup(result), result);
          },
        })
      )
    ),
    onInterrupt = Function_dual(2, (self, cleanup) =>
      onExit(
        self,
        exitMatch({
          onFailure: (cause) =>
            isInterruptedOnly(cause)
              ? core_asVoid(cleanup(interruptors(cause)))
              : core_void_,
          onSuccess: () => core_void_,
        })
      )
    ),
    core_orElse = Function_dual(2, (self, that) =>
      attemptOrElse(self, that, succeed)
    ),
    succeed = (value) => {
      const effect = new EffectPrimitiveSuccess("Success");
      return (effect.effect_instruction_i0 = value), effect;
    },
    suspend = (effect) => core_flatMap(sync(effect), Function_identity),
    sync = (evaluate) => {
      const effect = new EffectPrimitive("Sync");
      return (effect.effect_instruction_i0 = evaluate), effect;
    },
    core_tap = Function_dual(2, (self, f) =>
      core_flatMap(self, (a) => {
        const b = "function" == typeof f ? f(a) : f;
        return isEffect(b)
          ? core_as(b, a)
          : isPromiseLike(b)
          ? core_async((resume) => {
              b.then(
                (_) => resume(succeed(a)),
                (e) => resume(core_fail(new UnknownException(e)))
              );
            })
          : succeed(a);
      })
    ),
    transplant = (f) =>
      withFiberRuntime((state) => {
        const scope = Function_pipe(
          state.getFiberRef(currentForkScopeOverride),
          getOrElse(() => state.scope())
        );
        return f(fiberRefLocally(currentForkScopeOverride, Option_some(scope)));
      }),
    attemptOrElse = Function_dual(3, (self, that, onSuccess) =>
      matchCauseEffect(self, {
        onFailure: (cause) =>
          cause_defects(cause).length > 0
            ? failCause(
                getOrThrow(
                  ((self) =>
                    cause_match(self, {
                      onEmpty: Option_none(),
                      onFail: (failure) => Option_some(die(failure)),
                      onDie: (defect) => Option_some(die(defect)),
                      onInterrupt: () => Option_none(),
                      onSequential: (left, right) =>
                        Option_isSome(left) && Option_isSome(right)
                          ? Option_some(sequential(left.value, right.value))
                          : Option_isSome(left) && Option_isNone(right)
                          ? Option_some(left.value)
                          : Option_isNone(left) && Option_isSome(right)
                          ? Option_some(right.value)
                          : Option_none(),
                      onParallel: (left, right) =>
                        Option_isSome(left) && Option_isSome(right)
                          ? Option_some(parallel(left.value, right.value))
                          : Option_isSome(left) && Option_isNone(right)
                          ? Option_some(left.value)
                          : Option_isNone(left) && Option_isSome(right)
                          ? Option_some(right.value)
                          : Option_none(),
                    }))(cause)
                )
              )
            : that(),
        onSuccess,
      })
    ),
    uninterruptible = (self) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      return (
        (effect.effect_instruction_i0 = RuntimeFlagsPatch_disable(1)),
        (effect.effect_instruction_i1 = () => self),
        effect
      );
    },
    uninterruptibleMask = (f) =>
      custom(f, function () {
        const effect = new EffectPrimitive("UpdateRuntimeFlags");
        return (
          (effect.effect_instruction_i0 = RuntimeFlagsPatch_disable(1)),
          (effect.effect_instruction_i1 = (oldFlags) =>
            interruption(oldFlags)
              ? this.effect_instruction_i0(core_interruptible)
              : this.effect_instruction_i0(uninterruptible)),
          effect
        );
      }),
    core_void_ = succeed(void 0),
    updateRuntimeFlags = (patch) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      return (
        (effect.effect_instruction_i0 = patch),
        (effect.effect_instruction_i1 = void 0),
        effect
      );
    },
    whileLoop = (options) => {
      const effect = new EffectPrimitive("While");
      return (
        (effect.effect_instruction_i0 = options.while),
        (effect.effect_instruction_i1 = options.body),
        (effect.effect_instruction_i2 = options.step),
        effect
      );
    },
    yieldNow = (options) => {
      const effect = new EffectPrimitive("Yield");
      return void 0 !== options?.priority
        ? withSchedulingPriority(effect, options.priority)
        : effect;
    },
    core_zip = Function_dual(2, (self, that) =>
      core_flatMap(self, (a) => core_map(that, (b) => [a, b]))
    ),
    core_zipLeft = Function_dual(2, (self, that) =>
      core_flatMap(self, (a) => core_as(that, a))
    ),
    core_zipRight = Function_dual(2, (self, that) =>
      core_flatMap(self, () => that)
    ),
    never = core_async(() => {
      const interval = setInterval(() => {}, 2 ** 31 - 1);
      return sync(() => clearInterval(interval));
    }),
    interruptFiber = (self) =>
      core_flatMap(fiberId, (fiberId) =>
        Function_pipe(self, interruptAsFiber(fiberId))
      ),
    interruptAsFiber = Function_dual(2, (self, fiberId) =>
      core_flatMap(self.interruptAsFork(fiberId), () => self.await)
    ),
    logLevelAll = {
      _tag: "All",
      syslog: 0,
      label: "ALL",
      ordinal: Number.MIN_SAFE_INTEGER,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    logLevelFatal = {
      _tag: "Fatal",
      syslog: 2,
      label: "FATAL",
      ordinal: 5e4,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    logLevelError = {
      _tag: "Error",
      syslog: 3,
      label: "ERROR",
      ordinal: 4e4,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    logLevelWarning = {
      _tag: "Warning",
      syslog: 4,
      label: "WARN",
      ordinal: 3e4,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    logLevelInfo = {
      _tag: "Info",
      syslog: 6,
      label: "INFO",
      ordinal: 2e4,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    logLevelDebug = {
      _tag: "Debug",
      syslog: 7,
      label: "DEBUG",
      ordinal: 1e4,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    logLevelTrace = {
      _tag: "Trace",
      syslog: 7,
      label: "TRACE",
      ordinal: 0,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    logLevelNone = {
      _tag: "None",
      syslog: 7,
      label: "OFF",
      ordinal: Number.MAX_SAFE_INTEGER,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    FiberRefTypeId = Symbol.for("effect/FiberRef"),
    fiberRefVariance = { _A: (_) => _ },
    fiberRefGet = (self) => fiberRefModify(self, (a) => [a, a]),
    fiberRefGetWith = Function_dual(2, (self, f) =>
      core_flatMap(fiberRefGet(self), f)
    ),
    fiberRefSet = Function_dual(2, (self, value) =>
      fiberRefModify(self, () => [void 0, value])
    ),
    fiberRefModify = Function_dual(2, (self, f) =>
      withFiberRuntime((state) => {
        const [b, a] = f(state.getFiberRef(self));
        return state.setFiberRef(self, a), succeed(b);
      })
    );
  const fiberRefLocally = Function_dual(3, (use, self, value) =>
      acquireUseRelease(
        core_zipLeft(fiberRefGet(self), fiberRefSet(self, value)),
        () => use,
        (oldValue) => fiberRefSet(self, oldValue)
      )
    ),
    fiberRefUnsafeMake = (initial, options) =>
      fiberRefUnsafeMakePatch(initial, {
        differ: differ_update(),
        fork: options?.fork ?? Function_identity,
        join: options?.join,
      }),
    fiberRefUnsafeMakeContext = (initial) => {
      const differ = environment();
      return fiberRefUnsafeMakePatch(initial, { differ, fork: differ.empty });
    },
    fiberRefUnsafeMakePatch = (initial, options) => ({
      [FiberRefTypeId]: fiberRefVariance,
      initial,
      diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
      combine: (first, second) => options.differ.combine(first, second),
      patch: (patch) => (oldValue) => options.differ.patch(patch, oldValue),
      fork: options.fork,
      join: options.join ?? ((_, n) => n),
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    }),
    fiberRefUnsafeMakeRuntimeFlags = (initial) =>
      fiberRefUnsafeMakePatch(initial, { differ, fork: differ.empty }),
    currentContext = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentContext"),
      () => fiberRefUnsafeMakeContext(Context_empty())
    ),
    currentSchedulingPriority = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentSchedulingPriority"),
      () => fiberRefUnsafeMake(0)
    ),
    currentMaxOpsBeforeYield = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"),
      () => fiberRefUnsafeMake(2048)
    ),
    currentLogAnnotations = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentLogAnnotation"),
      () => fiberRefUnsafeMake(HashMap_empty())
    ),
    currentLogLevel = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentLogLevel"),
      () => fiberRefUnsafeMake(logLevelInfo)
    ),
    currentLogSpan = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentLogSpan"),
      () => fiberRefUnsafeMake(List_empty())
    ),
    withSchedulingPriority = Function_dual(2, (self, scheduler) =>
      fiberRefLocally(self, currentSchedulingPriority, scheduler)
    ),
    currentConcurrency = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentConcurrency"),
      () => fiberRefUnsafeMake("unbounded")
    ),
    currentRequestBatching = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentRequestBatching"),
      () => fiberRefUnsafeMake(!0)
    ),
    currentUnhandledErrorLogLevel = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"),
      () => fiberRefUnsafeMake(Option_some(logLevelDebug))
    ),
    currentMetricLabels = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentMetricLabels"),
      () =>
        ((initial) => {
          const differ = differ_readonlyArray(differ_update());
          return fiberRefUnsafeMakePatch(initial, {
            differ,
            fork: differ.empty,
          });
        })([])
    ),
    currentForkScopeOverride = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentForkScopeOverride"),
      () =>
        fiberRefUnsafeMake(Option_none(), {
          fork: () => Option_none(),
          join: (parent, _) => parent,
        })
    ),
    currentInterruptedCause = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentInterruptedCause"),
      () =>
        fiberRefUnsafeMake(cause_empty, {
          fork: () => cause_empty,
          join: (parent, _) => parent,
        })
    ),
    scopeAddFinalizer = (self, finalizer) =>
      self.addFinalizer(() => core_asVoid(finalizer)),
    scopeClose = (self, exit) => self.close(exit),
    scopeFork = (self, strategy) => self.fork(strategy),
    YieldableError = (function () {
      class YieldableError extends globalThis.Error {
        commit() {
          return core_fail(this);
        }
        toString() {
          return this.message ? `${this.name}: ${this.message}` : this.name;
        }
        toJSON() {
          return { ...this };
        }
        [NodeInspectSymbol]() {
          const stack = this.stack;
          return stack
            ? `${this.toString()}\n${stack.split("\n").slice(1).join("\n")}`
            : this.toString();
        }
      }
      return (
        Object.assign(YieldableError.prototype, StructuralCommitPrototype),
        YieldableError
      );
    })(),
    makeException = (proto, tag) => {
      class Base extends YieldableError {
        _tag = tag;
      }
      return (
        Object.assign(Base.prototype, proto), (Base.prototype.name = tag), Base
      );
    },
    RuntimeExceptionTypeId = Symbol.for("effect/Cause/errors/RuntimeException"),
    RuntimeException = makeException(
      { [RuntimeExceptionTypeId]: RuntimeExceptionTypeId },
      "RuntimeException"
    ),
    InterruptedExceptionTypeId = Symbol.for(
      "effect/Cause/errors/InterruptedException"
    ),
    isInterruptedException = (u) =>
      Predicate_hasProperty(u, InterruptedExceptionTypeId),
    NoSuchElementExceptionTypeId = Symbol.for(
      "effect/Cause/errors/NoSuchElement"
    ),
    NoSuchElementException = makeException(
      { [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId },
      "NoSuchElementException"
    ),
    UnknownExceptionTypeId = Symbol.for("effect/Cause/errors/UnknownException"),
    UnknownException = (function () {
      class UnknownException extends YieldableError {
        error;
        _tag = "UnknownException";
        constructor(error, message) {
          super(
            message ??
              (Predicate_hasProperty(error, "message") &&
              isString(error.message)
                ? error.message
                : void 0)
          ),
            (this.error = error);
        }
      }
      return (
        Object.assign(UnknownException.prototype, {
          [UnknownExceptionTypeId]: UnknownExceptionTypeId,
          name: "UnknownException",
        }),
        UnknownException
      );
    })(),
    exitIsExit = (u) =>
      isEffect(u) &&
      "_tag" in u &&
      ("Success" === u._tag || "Failure" === u._tag),
    exitCollectAll = (exits, options) =>
      exitCollectAllInternal(exits, options?.parallel ? parallel : sequential),
    exitFail = (error) => exitFailCause(fail(error)),
    exitFailCause = (cause) => {
      const effect = new EffectPrimitiveFailure("Failure");
      return (effect.effect_instruction_i0 = cause), effect;
    },
    exitInterrupt = (fiberId) => exitFailCause(interrupt(fiberId)),
    exitMap = Function_dual(2, (self, f) => {
      switch (self._tag) {
        case "Failure":
          return exitFailCause(self.effect_instruction_i0);
        case "Success":
          return exitSucceed(f(self.effect_instruction_i0));
      }
    }),
    exitMatch = Function_dual(2, (self, { onFailure, onSuccess }) => {
      switch (self._tag) {
        case "Failure":
          return onFailure(self.effect_instruction_i0);
        case "Success":
          return onSuccess(self.effect_instruction_i0);
      }
    }),
    exitSucceed = (value) => {
      const effect = new EffectPrimitiveSuccess("Success");
      return (effect.effect_instruction_i0 = value), effect;
    },
    exitVoid = exitSucceed(void 0),
    exitZipWith = Function_dual(3, (self, that, { onFailure, onSuccess }) => {
      switch (self._tag) {
        case "Failure":
          switch (that._tag) {
            case "Success":
              return exitFailCause(self.effect_instruction_i0);
            case "Failure":
              return exitFailCause(
                onFailure(
                  self.effect_instruction_i0,
                  that.effect_instruction_i0
                )
              );
          }
        case "Success":
          switch (that._tag) {
            case "Success":
              return exitSucceed(
                onSuccess(
                  self.effect_instruction_i0,
                  that.effect_instruction_i0
                )
              );
            case "Failure":
              return exitFailCause(that.effect_instruction_i0);
          }
      }
    }),
    exitCollectAllInternal = (exits, combineCauses) => {
      const list = Chunk_fromIterable(exits);
      return isNonEmpty(list)
        ? Function_pipe(
            Chunk_tailNonEmpty(list),
            Array_reduce(
              Function_pipe(Chunk_headNonEmpty(list), exitMap(Chunk_of)),
              (accumulator, current) =>
                Function_pipe(
                  accumulator,
                  exitZipWith(current, {
                    onSuccess: (list, value) =>
                      Function_pipe(list, Chunk_prepend(value)),
                    onFailure: combineCauses,
                  })
                )
            ),
            exitMap(Chunk_reverse),
            exitMap((chunk) => toReadonlyArray(chunk)),
            Option_some
          )
        : Option_none();
    },
    deferredUnsafeMake = (fiberId) => {
      return {
        [DeferredTypeId]: deferredVariance,
        state: MutableRef_make(((joiners = []), { _tag: "Pending", joiners })),
        blockingOn: fiberId,
        pipe() {
          return Pipeable_pipeArguments(this, arguments);
        },
      };
      var joiners;
    },
    deferredAwait = (self) =>
      core_async((resume) => {
        const state = MutableRef_get(self.state);
        switch (state._tag) {
          case "Done":
            return resume(state.effect);
          case "Pending":
            return (
              state.joiners.push(resume), deferredInterruptJoiner(self, resume)
            );
        }
      }, self.blockingOn),
    deferredUnsafeDone = (self, effect) => {
      const state = MutableRef_get(self.state);
      if ("Pending" === state._tag) {
        MutableRef_set(self.state, done(effect));
        for (let i = 0, len = state.joiners.length; i < len; i++)
          state.joiners[i](effect);
      }
    },
    deferredInterruptJoiner = (self, joiner) =>
      sync(() => {
        const state = MutableRef_get(self.state);
        if ("Pending" === state._tag) {
          const index = state.joiners.indexOf(joiner);
          index >= 0 && state.joiners.splice(index, 1);
        }
      }),
    constContext = fiberRefGet(currentContext),
    context = () => constContext,
    contextWithEffect = (f) => core_flatMap(context(), f),
    provideContext = Function_dual(2, (self, context) =>
      fiberRefLocally(currentContext, context)(self)
    ),
    mapInputContext = Function_dual(2, (self, f) =>
      contextWithEffect((context) => provideContext(self, f(context)))
    ),
    currentSpanFromFiber = (fiber) => {
      const span = fiber.getFiberRef(currentContext).unsafeMap.get(spanTag.key);
      return void 0 !== span && "Span" === span._tag
        ? Option_some(span)
        : Option_none();
    };
  const Data_Error = (function () {
      return class extends YieldableError {
        constructor(args) {
          super(), args && Object.assign(this, args);
        }
      };
    })(),
    ClockTypeId = Symbol.for("effect/Clock"),
    clockTag = GenericTag("effect/Clock"),
    globalClockScheduler = {
      unsafeSchedule(task, duration) {
        const millis = toMillis(duration);
        if (millis > 2147483647) return constFalse;
        let completed = !1;
        const handle = setTimeout(() => {
          (completed = !0), task();
        }, millis);
        return () => (clearTimeout(handle), !completed);
      },
    },
    performanceNowNanos = (function () {
      const bigint1e6 = BigInt(1e6);
      if ("undefined" == typeof performance)
        return () => BigInt(Date.now()) * bigint1e6;
      const origin =
        "timeOrigin" in performance && "number" == typeof performance.timeOrigin
          ? BigInt(Math.round(1e6 * performance.timeOrigin))
          : BigInt(Date.now()) * bigint1e6 -
            BigInt(Math.round(1e6 * performance.now()));
      return () => origin + BigInt(Math.round(1e6 * performance.now()));
    })(),
    processOrPerformanceNow = (function () {
      const processHrtime =
        "object" == typeof process &&
        "hrtime" in process &&
        "function" == typeof process.hrtime.bigint
          ? process.hrtime
          : void 0;
      if (!processHrtime) return performanceNowNanos;
      const origin = performanceNowNanos() - processHrtime.bigint();
      return () => origin + processHrtime.bigint();
    })();
  class ClockImpl {
    [ClockTypeId] = ClockTypeId;
    unsafeCurrentTimeMillis() {
      return Date.now();
    }
    unsafeCurrentTimeNanos() {
      return processOrPerformanceNow();
    }
    currentTimeMillis = sync(() => this.unsafeCurrentTimeMillis());
    currentTimeNanos = sync(() => this.unsafeCurrentTimeNanos());
    scheduler() {
      return succeed(globalClockScheduler);
    }
    sleep(duration) {
      return core_async((resume) => {
        const canceler = globalClockScheduler.unsafeSchedule(
          () => resume(core_void_),
          duration
        );
        return core_asVoid(sync(canceler));
      });
    }
  }
  const clock_make = () => new ClockImpl(),
    ConfigErrorTypeId = Symbol.for("effect/ConfigError"),
    configError_proto = {
      _tag: "ConfigError",
      [ConfigErrorTypeId]: ConfigErrorTypeId,
    },
    And = (self, that) => {
      const error = Object.create(configError_proto);
      return (
        (error._op = "And"),
        (error.left = self),
        (error.right = that),
        Object.defineProperty(error, "toString", {
          enumerable: !1,
          value() {
            return `${this.left} and ${this.right}`;
          },
        }),
        error
      );
    },
    Or = (self, that) => {
      const error = Object.create(configError_proto);
      return (
        (error._op = "Or"),
        (error.left = self),
        (error.right = that),
        Object.defineProperty(error, "toString", {
          enumerable: !1,
          value() {
            return `${this.left} or ${this.right}`;
          },
        }),
        error
      );
    },
    InvalidData = (path, message, options = { pathDelim: "." }) => {
      const error = Object.create(configError_proto);
      return (
        (error._op = "InvalidData"),
        (error.path = path),
        (error.message = message),
        Object.defineProperty(error, "toString", {
          enumerable: !1,
          value() {
            return `(Invalid data at ${Function_pipe(
              this.path,
              join(options.pathDelim)
            )}: "${this.message}")`;
          },
        }),
        error
      );
    },
    MissingData = (path, message, options = { pathDelim: "." }) => {
      const error = Object.create(configError_proto);
      return (
        (error._op = "MissingData"),
        (error.path = path),
        (error.message = message),
        Object.defineProperty(error, "toString", {
          enumerable: !1,
          value() {
            return `(Missing data at ${Function_pipe(
              this.path,
              join(options.pathDelim)
            )}: "${this.message}")`;
          },
        }),
        error
      );
    },
    SourceUnavailable = (
      path,
      message,
      cause,
      options = { pathDelim: "." }
    ) => {
      const error = Object.create(configError_proto);
      return (
        (error._op = "SourceUnavailable"),
        (error.path = path),
        (error.message = message),
        (error.cause = cause),
        Object.defineProperty(error, "toString", {
          enumerable: !1,
          value() {
            return `(Source unavailable at ${Function_pipe(
              this.path,
              join(options.pathDelim)
            )}: "${this.message}")`;
          },
        }),
        error
      );
    },
    Unsupported = (path, message, options = { pathDelim: "." }) => {
      const error = Object.create(configError_proto);
      return (
        (error._op = "Unsupported"),
        (error.path = path),
        (error.message = message),
        Object.defineProperty(error, "toString", {
          enumerable: !1,
          value() {
            return `(Unsupported operation at ${Function_pipe(
              this.path,
              join(options.pathDelim)
            )}: "${this.message}")`;
          },
        }),
        error
      );
    },
    prefixed = Function_dual(2, (self, prefix) => {
      switch (self._op) {
        case "And":
          return And(prefixed(self.left, prefix), prefixed(self.right, prefix));
        case "Or":
          return Or(prefixed(self.left, prefix), prefixed(self.right, prefix));
        case "InvalidData":
          return InvalidData([...prefix, ...self.path], self.message);
        case "MissingData":
          return MissingData([...prefix, ...self.path], self.message);
        case "SourceUnavailable":
          return SourceUnavailable(
            [...prefix, ...self.path],
            self.message,
            self.cause
          );
        case "Unsupported":
          return Unsupported([...prefix, ...self.path], self.message);
      }
    }),
    pathPatch_empty = { _tag: "Empty" },
    patch = Function_dual(2, (path, patch) => {
      let input = List_of(patch),
        output = path;
      for (; isCons(input); ) {
        const patch = input.head;
        switch (patch._tag) {
          case "Empty":
            input = input.tail;
            break;
          case "AndThen":
            input = cons(patch.first, cons(patch.second, input.tail));
            break;
          case "MapName":
            (output = Array_map(output, patch.f)), (input = input.tail);
            break;
          case "Nested":
            (output = Array_prepend(output, patch.name)), (input = input.tail);
            break;
          case "Unnested":
            if (!Function_pipe(Array_head(output), contains(patch.name)))
              return Either_left(
                MissingData(
                  output,
                  `Expected ${patch.name} to be in path in ConfigProvider#unnested`
                )
              );
            (output = tailNonEmpty(output)), (input = input.tail);
            break;
        }
      }
      return Either_right(output);
    }),
    concat = (l, r) => [...l, ...r],
    ConfigProviderTypeId = Symbol.for("effect/ConfigProvider"),
    configProviderTag = GenericTag("effect/ConfigProvider"),
    FlatConfigProviderTypeId = Symbol.for("effect/ConfigProviderFlat"),
    configProvider_make = (options) => ({
      [ConfigProviderTypeId]: ConfigProviderTypeId,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
      ...options,
    }),
    makeFlat = (options) => ({
      [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
      patch: options.patch,
      load: (path, config, split = !0) => options.load(path, config, split),
      enumerateChildren: options.enumerateChildren,
    }),
    fromFlat = (flat) =>
      configProvider_make({
        load: (config) =>
          core_flatMap(fromFlatLoop(flat, [], config, !1), (chunk) =>
            match(Array_head(chunk), {
              onNone: () =>
                core_fail(
                  MissingData(
                    [],
                    `Expected a single value having structure: ${config}`
                  )
                ),
              onSome: succeed,
            })
          ),
        flattened: flat,
      }),
    fromEnv = (config) => {
      const { pathDelim, seqDelim } = Object.assign(
          {},
          { pathDelim: "_", seqDelim: "," },
          config
        ),
        getEnv = () =>
          "undefined" != typeof process &&
          "env" in process &&
          "object" == typeof process.env
            ? process.env
            : {};
      return fromFlat(
        makeFlat({
          load: (path, primitive, split = !0) => {
            const pathString = ((path) => Function_pipe(path, join(pathDelim)))(
                path
              ),
              current = getEnv();
            return Function_pipe(
              pathString in current
                ? Option_some(current[pathString])
                : Option_none(),
              mapError(() =>
                MissingData(
                  path,
                  `Expected ${pathString} to exist in the process context`
                )
              ),
              core_flatMap((value) =>
                parsePrimitive(value, path, primitive, seqDelim, split)
              )
            );
          },
          enumerateChildren: (path) =>
            sync(() => {
              const current = getEnv(),
                keyPaths = Object.keys(current).map((value) =>
                  value.toUpperCase().split(pathDelim)
                ),
                filteredKeyPaths = keyPaths
                  .filter((keyPath) => {
                    for (let i = 0; i < path.length; i++) {
                      const pathComponent = Function_pipe(path, unsafeGet(i)),
                        currentElement = keyPath[i];
                      if (
                        void 0 === currentElement ||
                        pathComponent !== currentElement
                      )
                        return !1;
                    }
                    return !0;
                  })
                  .flatMap((keyPath) =>
                    keyPath.slice(path.length, path.length + 1)
                  );
              return HashSet_fromIterable(filteredKeyPaths);
            }),
          patch: pathPatch_empty,
        })
      );
    },
    fromFlatLoop = (flat, prefix, config, split) => {
      const op = config;
      switch (op._tag) {
        case "Constant":
          return succeed(Array_of(op.value));
        case "Described":
          return suspend(() => fromFlatLoop(flat, prefix, op.config, split));
        case "Fail":
          return core_fail(MissingData(prefix, op.message));
        case "Fallback":
          return Function_pipe(
            suspend(() => fromFlatLoop(flat, prefix, op.first, split)),
            catchAll((error1) =>
              op.condition(error1)
                ? Function_pipe(
                    fromFlatLoop(flat, prefix, op.second, split),
                    catchAll((error2) => core_fail(Or(error1, error2)))
                  )
                : core_fail(error1)
            )
          );
        case "Lazy":
          return suspend(() => fromFlatLoop(flat, prefix, op.config(), split));
        case "MapOrFail":
          return suspend(() =>
            Function_pipe(
              fromFlatLoop(flat, prefix, op.original, split),
              core_flatMap(
                forEachSequential((a) =>
                  Function_pipe(
                    op.mapOrFail(a),
                    mapError(
                      prefixed(
                        ((path, config) => {
                          let op = config;
                          if ("Nested" === op._tag) {
                            const out = path.slice();
                            for (; "Nested" === op._tag; )
                              out.push(op.name), (op = op.config);
                            return out;
                          }
                          return path;
                        })(prefix, op.original)
                      )
                    )
                  )
                )
              )
            )
          );
        case "Nested":
          return suspend(() =>
            fromFlatLoop(
              flat,
              concat(prefix, Array_of(op.name)),
              op.config,
              split
            )
          );
        case "Primitive":
          return Function_pipe(
            patch(prefix, flat.patch),
            core_flatMap((prefix) =>
              Function_pipe(
                flat.load(prefix, op, split),
                core_flatMap((values) => {
                  if (0 === values.length) {
                    const name = Function_pipe(
                      isNonEmptyReadonlyArray((self = prefix))
                        ? Option_some(lastNonEmpty(self))
                        : Option_none(),
                      getOrElse(() => "<n/a>")
                    );
                    return core_fail(
                      MissingData(
                        [],
                        `Expected ${op.description} with name ${name}`
                      )
                    );
                  }
                  var self;
                  return succeed(values);
                })
              )
            )
          );
        case "Sequence":
          return Function_pipe(
            patch(prefix, flat.patch),
            core_flatMap((patchedPrefix) =>
              Function_pipe(
                flat.enumerateChildren(patchedPrefix),
                core_flatMap(indicesFrom),
                core_flatMap((indices) =>
                  0 === indices.length
                    ? suspend(() =>
                        core_map(
                          fromFlatLoop(flat, patchedPrefix, op.config, !0),
                          Array_of
                        )
                      )
                    : Function_pipe(
                        forEachSequential(indices, (index) =>
                          fromFlatLoop(
                            flat,
                            Array_append(prefix, `[${index}]`),
                            op.config,
                            !0
                          )
                        ),
                        core_map((chunkChunk) => {
                          const flattened = Array_flatten(chunkChunk);
                          return 0 === flattened.length
                            ? Array_of([])
                            : Array_of(flattened);
                        })
                      )
                )
              )
            )
          );
        case "HashMap":
          return suspend(() =>
            Function_pipe(
              patch(prefix, flat.patch),
              core_flatMap((prefix) =>
                Function_pipe(
                  flat.enumerateChildren(prefix),
                  core_flatMap((keys) =>
                    Function_pipe(
                      keys,
                      forEachSequential((key) =>
                        fromFlatLoop(
                          flat,
                          concat(prefix, Array_of(key)),
                          op.valueConfig,
                          split
                        )
                      ),
                      core_map((matrix) =>
                        0 === matrix.length
                          ? Array_of(HashMap_empty())
                          : Function_pipe(
                              transpose(matrix),
                              Array_map((values) =>
                                HashMap_fromIterable(
                                  Array_zip(Array_fromIterable(keys), values)
                                )
                              )
                            )
                      )
                    )
                  )
                )
              )
            )
          );
        case "ZipWith":
          return suspend(() =>
            Function_pipe(
              fromFlatLoop(flat, prefix, op.left, split),
              core_either,
              core_flatMap((left) =>
                Function_pipe(
                  fromFlatLoop(flat, prefix, op.right, split),
                  core_either,
                  core_flatMap((right) => {
                    if (Either_isLeft(left) && Either_isLeft(right))
                      return core_fail(And(left.left, right.left));
                    if (Either_isLeft(left) && Either_isRight(right))
                      return core_fail(left.left);
                    if (Either_isRight(left) && Either_isLeft(right))
                      return core_fail(right.left);
                    if (Either_isRight(left) && Either_isRight(right)) {
                      const path = Function_pipe(prefix, join(".")),
                        fail = fromFlatLoopFail(prefix, path),
                        [lefts, rights] = ((leftDef, rightDef, left, right) => {
                          const leftPad = Array_unfold(left.length, (index) =>
                              index >= right.length
                                ? Option_none()
                                : Option_some([leftDef(index), index + 1])
                            ),
                            rightPad = Array_unfold(right.length, (index) =>
                              index >= left.length
                                ? Option_none()
                                : Option_some([rightDef(index), index + 1])
                            );
                          return [
                            concat(left, leftPad),
                            concat(right, rightPad),
                          ];
                        })(
                          fail,
                          fail,
                          Function_pipe(left.right, Array_map(Either_right)),
                          Function_pipe(right.right, Array_map(Either_right))
                        );
                      return Function_pipe(
                        lefts,
                        Array_zip(rights),
                        forEachSequential(([left, right]) =>
                          Function_pipe(
                            core_zip(left, right),
                            core_map(([left, right]) => op.zip(left, right))
                          )
                        )
                      );
                    }
                    throw new Error(
                      "BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues"
                    );
                  })
                )
              )
            )
          );
      }
    },
    fromFlatLoopFail = (prefix, path) => (index) =>
      Either_left(
        MissingData(
          prefix,
          `The element at index ${index} in a sequence at path "${path}" was missing`
        )
      ),
    parsePrimitive = (text, path, primitive, delimiter, split) =>
      split
        ? Function_pipe(
            ((text, delim) =>
              text.split(new RegExp(`\\s*${RegExp_escape(delim)}\\s*`)))(
              text,
              delimiter
            ),
            forEachSequential((char) => primitive.parse(char.trim())),
            mapError(prefixed(path))
          )
        : Function_pipe(
            primitive.parse(text),
            core_mapBoth({ onFailure: prefixed(path), onSuccess: Array_of })
          ),
    transpose = (array) =>
      Object.keys(array[0]).map((column) => array.map((row) => row[column])),
    indicesFrom = (quotedIndices) =>
      Function_pipe(
        forEachSequential(quotedIndices, parseQuotedIndex),
        core_mapBoth({ onFailure: () => [], onSuccess: sort(Number_Order) }),
        core_either,
        core_map(merge)
      ),
    QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/,
    parseQuotedIndex = (str) => {
      const match = str.match(QUOTED_INDEX_REGEX);
      if (null !== match) {
        const matchedIndex = match[2];
        return Function_pipe(
          void 0 !== matchedIndex && matchedIndex.length > 0
            ? Option_some(matchedIndex)
            : Option_none(),
          flatMap(parseInteger)
        );
      }
      return Option_none();
    },
    parseInteger = (str) => {
      const parsedIndex = Number.parseInt(str);
      return Number.isNaN(parsedIndex)
        ? Option_none()
        : Option_some(parsedIndex);
    },
    console_TypeId = Symbol.for("effect/Console"),
    console_consoleTag = GenericTag("effect/Console"),
    console_defaultConsole = {
      [console_TypeId]: console_TypeId,
      assert: (condition, ...args) =>
        sync(() => {
          console.assert(condition, ...args);
        }),
      clear: sync(() => {
        console.clear();
      }),
      count: (label) =>
        sync(() => {
          console.count(label);
        }),
      countReset: (label) =>
        sync(() => {
          console.countReset(label);
        }),
      debug: (...args) =>
        sync(() => {
          console.debug(...args);
        }),
      dir: (item, options) =>
        sync(() => {
          console.dir(item, options);
        }),
      dirxml: (...args) =>
        sync(() => {
          console.dirxml(...args);
        }),
      error: (...args) =>
        sync(() => {
          console.error(...args);
        }),
      group: (options) =>
        sync(
          options?.collapsed
            ? () => console.groupCollapsed(options?.label)
            : () => console.group(options?.label)
        ),
      groupEnd: sync(() => {
        console.groupEnd();
      }),
      info: (...args) =>
        sync(() => {
          console.info(...args);
        }),
      log: (...args) =>
        sync(() => {
          console.log(...args);
        }),
      table: (tabularData, properties) =>
        sync(() => {
          console.table(tabularData, properties);
        }),
      time: (label) => sync(() => console.time(label)),
      timeEnd: (label) => sync(() => console.timeEnd(label)),
      timeLog: (label, ...args) =>
        sync(() => {
          console.timeLog(label, ...args);
        }),
      trace: (...args) =>
        sync(() => {
          console.trace(...args);
        }),
      warn: (...args) =>
        sync(() => {
          console.warn(...args);
        }),
      unsafe: console,
    },
    RandomTypeId = Symbol.for("effect/Random"),
    randomTag = GenericTag("effect/Random");
  class RandomImpl {
    seed;
    [RandomTypeId] = RandomTypeId;
    PRNG;
    constructor(seed) {
      (this.seed = seed), (this.PRNG = new PCGRandom(seed));
    }
    get next() {
      return sync(() => this.PRNG.number());
    }
    get nextBoolean() {
      return core_map(this.next, (n) => n > 0.5);
    }
    get nextInt() {
      return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
    }
    nextRange(min, max) {
      return core_map(this.next, (n) => (max - min) * n + min);
    }
    nextIntBetween(min, max) {
      return sync(() => this.PRNG.integer(max - min) + min);
    }
    shuffle(elements) {
      return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
    }
  }
  const shuffleWith = (elements, nextIntBounded) =>
      suspend(() =>
        Function_pipe(
          sync(() => Array.from(elements)),
          core_flatMap((buffer) => {
            const numbers = [];
            for (let i = buffer.length; i >= 2; i -= 1) numbers.push(i);
            return Function_pipe(
              numbers,
              forEachSequentialDiscard((n) =>
                Function_pipe(
                  nextIntBounded(n),
                  core_map((k) => random_swap(buffer, n - 1, k))
                )
              ),
              core_as(Chunk_fromIterable(buffer))
            );
          })
        )
      ),
    random_swap = (buffer, index1, index2) => {
      const tmp = buffer[index1];
      return (buffer[index1] = buffer[index2]), (buffer[index2] = tmp), buffer;
    },
    random_make = (seed) => new RandomImpl(seed),
    liveServices = Function_pipe(
      Context_empty(),
      Context_add(clockTag, clock_make()),
      Context_add(console_consoleTag, console_defaultConsole),
      Context_add(randomTag, random_make((4294967296 * Math.random()) >>> 0)),
      Context_add(configProviderTag, fromEnv()),
      Context_add(tracerTag, nativeTracer)
    ),
    currentServices = GlobalValue_globalValue(
      Symbol.for("effect/DefaultServices/currentServices"),
      () => fiberRefUnsafeMakeContext(liveServices)
    ),
    Effectable_EffectTypeId = EffectTypeId;
  const executionStrategy_sequential = { _tag: "Sequential" },
    ExecutionStrategy_sequential = executionStrategy_sequential,
    ExecutionStrategy_parallel = { _tag: "Parallel" },
    ExecutionStrategy_parallelN = (parallelism) => ({
      _tag: "ParallelN",
      parallelism,
    });
  function fiberRefs_unsafeMake(fiberRefLocals) {
    return new FiberRefsImpl(fiberRefLocals);
  }
  const FiberRefsSym = Symbol.for("effect/FiberRefs");
  class FiberRefsImpl {
    locals;
    [FiberRefsSym] = FiberRefsSym;
    constructor(locals) {
      this.locals = locals;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const joinAs = Function_dual(3, (self, fiberId, that) => {
      const parentFiberRefs = new Map(self.locals);
      return (
        that.locals.forEach((childStack, fiberRef) => {
          const childValue = childStack[0][1];
          if (!childStack[0][0][Equal_symbol](fiberId)) {
            if (!parentFiberRefs.has(fiberRef)) {
              if (equals(childValue, fiberRef.initial)) return;
              return void parentFiberRefs.set(fiberRef, [
                [fiberId, fiberRef.join(fiberRef.initial, childValue)],
              ]);
            }
            const parentStack = parentFiberRefs.get(fiberRef),
              [ancestor, wasModified] = ((
                _ref,
                _parentStack,
                _childStack,
                _childModified = !1
              ) => {
                const ref = _ref;
                let ret,
                  parentStack = _parentStack,
                  childStack = _childStack,
                  childModified = _childModified;
                for (; void 0 === ret; )
                  if (
                    isNonEmptyReadonlyArray(parentStack) &&
                    isNonEmptyReadonlyArray(childStack)
                  ) {
                    const parentFiberId = headNonEmpty(parentStack)[0],
                      parentAncestors = tailNonEmpty(parentStack),
                      childFiberId = headNonEmpty(childStack)[0],
                      childRefValue = headNonEmpty(childStack)[1],
                      childAncestors = tailNonEmpty(childStack);
                    parentFiberId.startTimeMillis < childFiberId.startTimeMillis
                      ? ((childStack = childAncestors), (childModified = !0))
                      : parentFiberId.startTimeMillis >
                        childFiberId.startTimeMillis
                      ? (parentStack = parentAncestors)
                      : parentFiberId.id < childFiberId.id
                      ? ((childStack = childAncestors), (childModified = !0))
                      : parentFiberId.id > childFiberId.id
                      ? (parentStack = parentAncestors)
                      : (ret = [childRefValue, childModified]);
                  } else ret = [ref.initial, !0];
                return ret;
              })(fiberRef, parentStack, childStack);
            if (wasModified) {
              const patch = fiberRef.diff(ancestor, childValue),
                oldValue = parentStack[0][1],
                newValue = fiberRef.join(
                  oldValue,
                  fiberRef.patch(patch)(oldValue)
                );
              if (!equals(oldValue, newValue)) {
                let newStack;
                const parentFiberId = parentStack[0][0];
                (newStack = parentFiberId[Equal_symbol](fiberId)
                  ? [[parentFiberId, newValue], ...parentStack.slice(1)]
                  : [[fiberId, newValue], ...parentStack]),
                  parentFiberRefs.set(fiberRef, newStack);
              }
            }
          }
        }),
        new FiberRefsImpl(parentFiberRefs)
      );
    }),
    forkAs = Function_dual(2, (self, childId) => {
      const map = new Map();
      return unsafeForkAs(self, map, childId), new FiberRefsImpl(map);
    }),
    unsafeForkAs = (self, map, fiberId) => {
      self.locals.forEach((stack, fiberRef) => {
        const oldValue = stack[0][1],
          newValue = fiberRef.patch(fiberRef.fork)(oldValue);
        equals(oldValue, newValue)
          ? map.set(fiberRef, stack)
          : map.set(fiberRef, [[fiberId, newValue], ...stack]);
      });
    },
    delete_ = Function_dual(2, (self, fiberRef) => {
      const locals = new Map(self.locals);
      return locals.delete(fiberRef), new FiberRefsImpl(locals);
    }),
    fiberRefs_get = Function_dual(2, (self, fiberRef) =>
      self.locals.has(fiberRef)
        ? Option_some(headNonEmpty(self.locals.get(fiberRef))[1])
        : Option_none()
    ),
    getOrDefault = Function_dual(2, (self, fiberRef) =>
      Function_pipe(
        fiberRefs_get(self, fiberRef),
        getOrElse(() => fiberRef.initial)
      )
    ),
    updateAs = Function_dual(2, (self, { fiberId, fiberRef, value }) => {
      if (0 === self.locals.size)
        return new FiberRefsImpl(new Map([[fiberRef, [[fiberId, value]]]]));
      const locals = new Map(self.locals);
      return (
        unsafeUpdateAs(locals, fiberId, fiberRef, value),
        new FiberRefsImpl(locals)
      );
    }),
    unsafeUpdateAs = (locals, fiberId, fiberRef, value) => {
      const oldStack = locals.get(fiberRef) ?? [];
      let newStack;
      if (isNonEmptyReadonlyArray(oldStack)) {
        const [currentId, currentValue] = headNonEmpty(oldStack);
        if (currentId[Equal_symbol](fiberId)) {
          if (equals(currentValue, value)) return;
          newStack = [[fiberId, value], ...oldStack.slice(1)];
        } else newStack = [[fiberId, value], ...oldStack];
      } else newStack = [[fiberId, value]];
      locals.set(fiberRef, newStack);
    },
    updateManyAs = Function_dual(2, (self, { entries, forkAs }) => {
      if (0 === self.locals.size) return new FiberRefsImpl(new Map(entries));
      const locals = new Map(self.locals);
      return (
        void 0 !== forkAs && unsafeForkAs(self, locals, forkAs),
        entries.forEach(([fiberRef, values]) => {
          1 === values.length
            ? unsafeUpdateAs(locals, values[0][0], fiberRef, values[0][1])
            : values.forEach(([fiberId, value]) => {
                unsafeUpdateAs(locals, fiberId, fiberRef, value);
              });
        }),
        new FiberRefsImpl(locals)
      );
    }),
    FiberRefs_getOrDefault = getOrDefault,
    FiberRefs_updateManyAs = updateManyAs,
    FiberRefs_empty = function () {
      return fiberRefs_unsafeMake(new Map());
    },
    patch_empty = { _tag: "Empty" },
    patch_diff = (oldValue, newValue) => {
      const missingLocals = new Map(oldValue.locals);
      let patch = patch_empty;
      for (const [fiberRef, pairs] of newValue.locals.entries()) {
        const newValue = headNonEmpty(pairs)[1],
          old = missingLocals.get(fiberRef);
        if (void 0 !== old) {
          const oldValue = headNonEmpty(old)[1];
          equals(oldValue, newValue) ||
            (patch = patch_combine({
              _tag: "Update",
              fiberRef,
              patch: fiberRef.diff(oldValue, newValue),
            })(patch));
        } else
          patch = patch_combine({ _tag: "Add", fiberRef, value: newValue })(
            patch
          );
        missingLocals.delete(fiberRef);
      }
      for (const [fiberRef] of missingLocals.entries())
        patch = patch_combine({ _tag: "Remove", fiberRef })(patch);
      return patch;
    },
    patch_combine = Function_dual(2, (self, that) => ({
      _tag: "AndThen",
      first: self,
      second: that,
    })),
    patch_patch = Function_dual(3, (self, fiberId, oldValue) => {
      let fiberRefs = oldValue,
        patches = Array_of(self);
      for (; isNonEmptyReadonlyArray(patches); ) {
        const head = headNonEmpty(patches),
          tail = tailNonEmpty(patches);
        switch (head._tag) {
          case "Empty":
            patches = tail;
            break;
          case "Add":
            (fiberRefs = updateAs(fiberRefs, {
              fiberId,
              fiberRef: head.fiberRef,
              value: head.value,
            })),
              (patches = tail);
            break;
          case "Remove":
            (fiberRefs = delete_(fiberRefs, head.fiberRef)), (patches = tail);
            break;
          case "Update": {
            const value = getOrDefault(fiberRefs, head.fiberRef);
            (fiberRefs = updateAs(fiberRefs, {
              fiberId,
              fiberRef: head.fiberRef,
              value: head.fiberRef.patch(head.patch)(value),
            })),
              (patches = tail);
            break;
          }
          case "AndThen":
            patches = Array_prepend(head.first)(
              Array_prepend(head.second)(tail)
            );
        }
      }
      return fiberRefs;
    }),
    FiberRefsPatch_diff = patch_diff,
    FiberRefsPatch_patch = patch_patch,
    FiberStatusTypeId = Symbol.for("effect/FiberStatus"),
    DoneHash = string("effect/FiberStatus-Done");
  class Done {
    [FiberStatusTypeId] = FiberStatusTypeId;
    _tag = "Done";
    [symbol]() {
      return DoneHash;
    }
    [Equal_symbol](that) {
      return isFiberStatus(that) && "Done" === that._tag;
    }
  }
  class Running {
    runtimeFlags;
    [FiberStatusTypeId] = FiberStatusTypeId;
    _tag = "Running";
    constructor(runtimeFlags) {
      this.runtimeFlags = runtimeFlags;
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/FiberStatus"),
        combine(Hash_hash(this._tag)),
        combine(Hash_hash(this.runtimeFlags)),
        cached(this)
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
    runtimeFlags;
    blockingOn;
    [FiberStatusTypeId] = FiberStatusTypeId;
    _tag = "Suspended";
    constructor(runtimeFlags, blockingOn) {
      (this.runtimeFlags = runtimeFlags), (this.blockingOn = blockingOn);
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/FiberStatus"),
        combine(Hash_hash(this._tag)),
        combine(Hash_hash(this.runtimeFlags)),
        combine(Hash_hash(this.blockingOn)),
        cached(this)
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
  const isFiberStatus = (u) => Predicate_hasProperty(u, FiberStatusTypeId),
    FiberStatus_done = new Done(),
    FiberStatus_running = (runtimeFlags) => new Running(runtimeFlags),
    FiberStatus_suspended = (runtimeFlags, blockingOn) =>
      new Suspended(runtimeFlags, blockingOn),
    FiberStatus_isDone = (self) => "Done" === self._tag,
    All = logLevelAll,
    Fatal = logLevelFatal,
    LogLevel_Error = logLevelError,
    Warning = logLevelWarning,
    Info = logLevelInfo,
    Debug = logLevelDebug,
    Trace = logLevelTrace,
    LogLevel_None = logLevelNone,
    LogLevel_Order = Function_pipe(
      Number_Order,
      Order_mapInput((level) => level.ordinal)
    ),
    LogLevel_greaterThan = greaterThan(LogLevel_Order);
  class PriorityBuckets {
    buckets = [];
    scheduleTask(task, priority) {
      let bucket, index;
      for (
        index = 0;
        index < this.buckets.length && this.buckets[index][0] <= priority;
        index++
      )
        bucket = this.buckets[index];
      if (bucket) bucket[1].push(task);
      else {
        const newBuckets = [];
        for (let i = 0; i < index; i++) newBuckets.push(this.buckets[i]);
        newBuckets.push([priority, [task]]);
        for (let i = index; i < this.buckets.length; i++)
          newBuckets.push(this.buckets[i]);
        this.buckets = newBuckets;
      }
    }
  }
  class MixedScheduler {
    maxNextTickBeforeTimer;
    running = !1;
    tasks = new PriorityBuckets();
    constructor(maxNextTickBeforeTimer) {
      this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
    }
    starveInternal(depth) {
      const tasks = this.tasks.buckets;
      this.tasks.buckets = [];
      for (const [_, toRun] of tasks)
        for (let i = 0; i < toRun.length; i++) toRun[i]();
      0 === this.tasks.buckets.length
        ? (this.running = !1)
        : this.starve(depth);
    }
    starve(depth = 0) {
      depth >= this.maxNextTickBeforeTimer
        ? setTimeout(() => this.starveInternal(0), 0)
        : Promise.resolve(void 0).then(() => this.starveInternal(depth + 1));
    }
    shouldYield(fiber) {
      return (
        fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) &&
        fiber.getFiberRef(currentSchedulingPriority)
      );
    }
    scheduleTask(task, priority) {
      this.tasks.scheduleTask(task, priority),
        this.running || ((this.running = !0), this.starve());
    }
  }
  const defaultScheduler = GlobalValue_globalValue(
    Symbol.for("effect/Scheduler/defaultScheduler"),
    () => new MixedScheduler(2048)
  );
  class SyncScheduler {
    tasks = new PriorityBuckets();
    deferred = !1;
    scheduleTask(task, priority) {
      this.deferred
        ? defaultScheduler.scheduleTask(task, priority)
        : this.tasks.scheduleTask(task, priority);
    }
    shouldYield(fiber) {
      return (
        fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) &&
        fiber.getFiberRef(currentSchedulingPriority)
      );
    }
    flush() {
      for (; this.tasks.buckets.length > 0; ) {
        const tasks = this.tasks.buckets;
        this.tasks.buckets = [];
        for (const [_, toRun] of tasks)
          for (let i = 0; i < toRun.length; i++) toRun[i]();
      }
      this.deferred = !0;
    }
  }
  const currentScheduler = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentScheduler"),
      () => fiberRefUnsafeMake(defaultScheduler)
    ),
    par = (self, that) => ({ _tag: "Par", left: self, right: that }),
    seq = (self, that) => ({ _tag: "Seq", left: self, right: that }),
    blockedRequests_step = (requests) => {
      let current = requests,
        parallel = parallelCollectionEmpty(),
        stack = List_empty(),
        sequential = List_empty();
      for (;;)
        switch (current._tag) {
          case "Empty":
            if (isNil(stack)) return [parallel, sequential];
            (current = stack.head), (stack = stack.tail);
            break;
          case "Par":
            (stack = cons(current.right, stack)), (current = current.left);
            break;
          case "Seq": {
            const left = current.left,
              right = current.right;
            switch (left._tag) {
              case "Empty":
                current = right;
                break;
              case "Par": {
                const l = left.left,
                  r = left.right;
                current = par(seq(l, right), seq(r, right));
                break;
              }
              case "Seq": {
                const l = left.left,
                  r = left.right;
                current = seq(l, seq(r, right));
                break;
              }
              case "Single":
                (current = left), (sequential = cons(right, sequential));
            }
            break;
          }
          case "Single":
            if (
              ((parallel = parallelCollectionAdd(parallel, current)),
              isNil(stack))
            )
              return [parallel, sequential];
            (current = stack.head), (stack = stack.tail);
        }
      throw new Error(
        "BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues"
      );
    },
    blockedRequests_merge = (sequential, parallel) => {
      if (isNil(sequential))
        return List_of(parallelCollectionToSequentialCollection(parallel));
      if (parallelCollectionIsEmpty(parallel)) return sequential;
      const seqHeadKeys = sequentialCollectionKeys(sequential.head),
        parKeys = parallelCollectionKeys(parallel);
      return 1 === seqHeadKeys.length &&
        1 === parKeys.length &&
        equals(seqHeadKeys[0], parKeys[0])
        ? cons(
            sequentialCollectionCombine(
              sequential.head,
              parallelCollectionToSequentialCollection(parallel)
            ),
            sequential.tail
          )
        : cons(parallelCollectionToSequentialCollection(parallel), sequential);
    };
  const RequestBlockParallelTypeId = Symbol.for(
      "effect/RequestBlock/RequestBlockParallel"
    ),
    parallelVariance = { _R: (_) => _ };
  class ParallelImpl {
    map;
    [RequestBlockParallelTypeId] = parallelVariance;
    constructor(map) {
      this.map = map;
    }
  }
  const parallelCollectionEmpty = () => new ParallelImpl(HashMap_empty()),
    parallelCollectionAdd = (self, blockedRequest) =>
      new ParallelImpl(
        HashMap_modifyAt(self.map, blockedRequest.dataSource, (_) =>
          orElseSome(map(_, Chunk_append(blockedRequest.blockedRequest)), () =>
            Chunk_of(blockedRequest.blockedRequest)
          )
        )
      ),
    parallelCollectionCombine = (self, that) =>
      new ParallelImpl(
        HashMap_reduce(self.map, that.map, (map, value, key) =>
          HashMap_set(
            map,
            key,
            match(HashMap_get(map, key), {
              onNone: () => value,
              onSome: (other) => Chunk_appendAll(value, other),
            })
          )
        )
      ),
    parallelCollectionIsEmpty = (self) => HashMap_isEmpty(self.map),
    parallelCollectionKeys = (self) => Array.from(HashMap_keys(self.map)),
    parallelCollectionToSequentialCollection = (self) =>
      sequentialCollectionMake(HashMap_map(self.map, (x) => Chunk_of(x))),
    SequentialCollectionTypeId = Symbol.for(
      "effect/RequestBlock/RequestBlockSequential"
    ),
    sequentialVariance = { _R: (_) => _ };
  class SequentialImpl {
    map;
    [SequentialCollectionTypeId] = sequentialVariance;
    constructor(map) {
      this.map = map;
    }
  }
  const sequentialCollectionMake = (map) => new SequentialImpl(map),
    sequentialCollectionCombine = (self, that) =>
      new SequentialImpl(
        HashMap_reduce(that.map, self.map, (map, value, key) =>
          HashMap_set(
            map,
            key,
            match(HashMap_get(map, key), {
              onNone: () => esm_Chunk_empty(),
              onSome: (a) => Chunk_appendAll(a, value),
            })
          )
        )
      ),
    sequentialCollectionKeys = (self) => Array.from(HashMap_keys(self.map)),
    currentRequestMap = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentRequestMap"),
      () => fiberRefUnsafeMake(new Map())
    ),
    concurrency_match = (concurrency, sequential, unbounded, bounded) => {
      switch (concurrency) {
        case void 0:
          return sequential();
        case "unbounded":
          return unbounded();
        case "inherit":
          return fiberRefGetWith(currentConcurrency, (concurrency) =>
            "unbounded" === concurrency
              ? unbounded()
              : concurrency > 1
              ? bounded(concurrency)
              : sequential()
          );
        default:
          return concurrency > 1 ? bounded(concurrency) : sequential();
      }
    },
    LogSpan_render = (now) => (self) =>
      `${self.label.replace(/[\s="]/g, "_")}=${now - self.startTime}ms`,
    MetricLabelTypeId = Symbol.for("effect/MetricLabel");
  class MetricLabelImpl {
    key;
    value;
    [MetricLabelTypeId] = MetricLabelTypeId;
    _hash;
    constructor(key, value) {
      (this.key = key),
        (this.value = value),
        (this._hash = string("effect/MetricLabel" + this.key + this.value));
    }
    [symbol]() {
      return this._hash;
    }
    [Equal_symbol](that) {
      return (
        isMetricLabel(that) &&
        this.key === that.key &&
        this.value === that.value
      );
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const label_make = (key, value) => new MetricLabelImpl(key, value),
    isMetricLabel = (u) => Predicate_hasProperty(u, MetricLabelTypeId),
    interruptSignal = (cause) => ({ _tag: "InterruptSignal", cause }),
    stateful = (onFiber) => ({ _tag: "Stateful", onFiber }),
    resume = (effect) => ({ _tag: "Resume", effect }),
    FiberScopeTypeId = Symbol.for("effect/FiberScope");
  class Global {
    [FiberScopeTypeId] = FiberScopeTypeId;
    fiberId = FiberId_none;
    roots = new Set();
    add(_runtimeFlags, child) {
      this.roots.add(child),
        child.addObserver(() => {
          this.roots.delete(child);
        });
    }
  }
  class Local {
    fiberId;
    parent;
    [FiberScopeTypeId] = FiberScopeTypeId;
    constructor(fiberId, parent) {
      (this.fiberId = fiberId), (this.parent = parent);
    }
    add(_runtimeFlags, child) {
      this.parent.tell(
        stateful((parentFiber) => {
          parentFiber.addChild(child),
            child.addObserver(() => {
              parentFiber.removeChild(child);
            });
        })
      );
    }
  }
  const globalScope = GlobalValue_globalValue(
      Symbol.for("effect/FiberScope/Global"),
      () => new Global()
    ),
    FiberTypeId = Symbol.for("effect/Fiber"),
    fiberVariance = { _E: (_) => _, _A: (_) => _ },
    fiberProto = {
      [FiberTypeId]: fiberVariance,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    RuntimeFiberTypeId = Symbol.for("effect/Fiber"),
    fiber_join = (self) =>
      core_zipLeft(core_flatten(self.await), self.inheritAll),
    currentFiberURI = "effect/FiberCurrent",
    LoggerTypeId = Symbol.for("effect/Logger"),
    loggerVariance = { _Message: (_) => _, _Output: (_) => _ },
    makeLogger = (log) => ({
      [LoggerTypeId]: loggerVariance,
      log,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    }),
    stringLogger = makeLogger(
      ({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
        const nowMillis = date.getTime();
        let output = [
          `timestamp=${date.toISOString()}`,
          `level=${logLevel.label}`,
          `fiber=${threadName(fiberId)}`,
        ].join(" ");
        if (Array.isArray(message))
          for (let i = 0; i < message.length; i++) {
            const stringMessage = toStringUnknown(message[i]);
            stringMessage.length > 0 &&
              ((output += " message="),
              (output = appendQuoted(stringMessage, output)));
          }
        else {
          const stringMessage = toStringUnknown(message);
          stringMessage.length > 0 &&
            ((output += " message="),
            (output = appendQuoted(stringMessage, output)));
        }
        if (
          (null != cause &&
            "Empty" !== cause._tag &&
            ((output += " cause="),
            (output = appendQuoted(pretty(cause), output))),
          isCons(spans))
        ) {
          output += " ";
          let first = !0;
          for (const span of spans)
            first ? (first = !1) : (output += " "),
              (output += Function_pipe(span, LogSpan_render(nowMillis)));
        }
        if (Function_pipe(annotations, HashMap_size) > 0) {
          output += " ";
          let first = !0;
          for (const [key, value] of annotations)
            first ? (first = !1) : (output += " "),
              (output += filterKeyName(key)),
              (output += "="),
              (output = appendQuoted(toStringUnknown(value), output));
        }
        return output;
      }
    ),
    textOnly = /^[^\s"=]+$/,
    appendQuoted = (label, output) =>
      output +
      (label.match(textOnly)
        ? label
        : `"${label.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`),
    filterKeyName = (key) => key.replace(/[\s="]/g, "_"),
    MetricKeyTypeTypeId = Symbol.for("effect/MetricKeyType"),
    CounterKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Counter"),
    FrequencyKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Frequency"),
    GaugeKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Gauge"),
    HistogramKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Histogram"),
    SummaryKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Summary"),
    metricKeyTypeVariance = { _In: (_) => _, _Out: (_) => _ };
  class CounterKeyType {
    incremental;
    bigint;
    [MetricKeyTypeTypeId] = metricKeyTypeVariance;
    [CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
    constructor(incremental, bigint) {
      (this.incremental = incremental),
        (this.bigint = bigint),
        (this._hash = string("effect/MetricKeyType/Counter"));
    }
    _hash;
    [symbol]() {
      return this._hash;
    }
    [Equal_symbol](that) {
      return isCounterKey(that);
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  class HistogramKeyType {
    boundaries;
    [MetricKeyTypeTypeId] = metricKeyTypeVariance;
    [HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
    constructor(boundaries) {
      (this.boundaries = boundaries),
        (this._hash = Function_pipe(
          string("effect/MetricKeyType/Histogram"),
          combine(Hash_hash(this.boundaries))
        ));
    }
    _hash;
    [symbol]() {
      return this._hash;
    }
    [Equal_symbol](that) {
      return isHistogramKey(that) && equals(this.boundaries, that.boundaries);
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const isCounterKey = (u) => Predicate_hasProperty(u, CounterKeyTypeTypeId),
    isFrequencyKey = (u) => Predicate_hasProperty(u, FrequencyKeyTypeTypeId),
    isGaugeKey = (u) => Predicate_hasProperty(u, GaugeKeyTypeTypeId),
    isHistogramKey = (u) => Predicate_hasProperty(u, HistogramKeyTypeTypeId),
    isSummaryKey = (u) => Predicate_hasProperty(u, SummaryKeyTypeTypeId),
    MetricKeyTypeId = Symbol.for("effect/MetricKey"),
    metricKeyVariance = { _Type: (_) => _ },
    arrayEquivilence = Array_getEquivalence(equals);
  class MetricKeyImpl {
    name;
    keyType;
    description;
    tags;
    [MetricKeyTypeId] = metricKeyVariance;
    constructor(name, keyType, description, tags = []) {
      (this.name = name),
        (this.keyType = keyType),
        (this.description = description),
        (this.tags = tags),
        (this._hash = Function_pipe(
          string(this.name + this.description),
          combine(Hash_hash(this.keyType)),
          combine(array(this.tags))
        ));
    }
    _hash;
    [symbol]() {
      return this._hash;
    }
    [Equal_symbol](u) {
      return (
        isMetricKey(u) &&
        this.name === u.name &&
        equals(this.keyType, u.keyType) &&
        equals(this.description, u.description) &&
        arrayEquivilence(this.tags, u.tags)
      );
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const isMetricKey = (u) => Predicate_hasProperty(u, MetricKeyTypeId),
    key_counter = (name, options) =>
      new MetricKeyImpl(
        name,
        ((options) =>
          new CounterKeyType(
            options?.incremental ?? !1,
            options?.bigint ?? !1
          ))(options),
        fromNullable(options?.description)
      ),
    key_histogram = (name, boundaries, description) =>
      new MetricKeyImpl(
        name,
        ((boundaries) => new HistogramKeyType(boundaries))(boundaries),
        fromNullable(description)
      ),
    taggedWithLabels = Function_dual(2, (self, extraTags) =>
      0 === extraTags.length
        ? self
        : new MetricKeyImpl(
            self.name,
            self.keyType,
            self.description,
            Array_union(self.tags, extraTags)
          )
    ),
    MutableHashMap_TypeId = Symbol.for("effect/MutableHashMap"),
    MutableHashMapProto = {
      [MutableHashMap_TypeId]: MutableHashMap_TypeId,
      [Symbol.iterator]() {
        return new MutableHashMapIterator(this);
      },
      toString() {
        return format(this.toJSON());
      },
      toJSON() {
        return { _id: "MutableHashMap", values: Array.from(this).map(toJSON) };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    };
  class MutableHashMapIterator {
    self;
    referentialIterator;
    bucketIterator;
    constructor(self) {
      (this.self = self),
        (this.referentialIterator = self.referential[Symbol.iterator]());
    }
    next() {
      if (void 0 !== this.bucketIterator) return this.bucketIterator.next();
      const result = this.referentialIterator.next();
      return result.done
        ? ((this.bucketIterator = new BucketIterator(
            this.self.buckets.values()
          )),
          this.next())
        : result;
    }
    [Symbol.iterator]() {
      return new MutableHashMapIterator(this.self);
    }
  }
  class BucketIterator {
    backing;
    constructor(backing) {
      this.backing = backing;
    }
    currentBucket;
    next() {
      if (void 0 === this.currentBucket) {
        const result = this.backing.next();
        if (result.done) return result;
        this.currentBucket = result.value[Symbol.iterator]();
      }
      const result = this.currentBucket.next();
      return result.done
        ? ((this.currentBucket = void 0), this.next())
        : result;
    }
  }
  const MutableHashMap_empty = () => {
      const self = Object.create(MutableHashMapProto);
      return (
        (self.referential = new Map()),
        (self.buckets = new Map()),
        (self.bucketsSize = 0),
        self
      );
    },
    MutableHashMap_get = Function_dual(2, (self, key) => {
      if (!1 === isEqual(key))
        return self.referential.has(key)
          ? Option_some(self.referential.get(key))
          : Option_none();
      const hash = key[symbol](),
        bucket = self.buckets.get(hash);
      return void 0 === bucket
        ? Option_none()
        : getFromBucket(self, bucket, key);
    }),
    getFromBucket = (self, bucket, key, remove = !1) => {
      for (let i = 0, len = bucket.length; i < len; i++)
        if (key[Equal_symbol](bucket[i][0])) {
          const value = bucket[i][1];
          return (
            remove && (bucket.splice(i, 1), self.bucketsSize--),
            Option_some(value)
          );
        }
      return Option_none();
    },
    MutableHashMap_has = Function_dual(2, (self, key) =>
      Option_isSome(MutableHashMap_get(self, key))
    ),
    MutableHashMap_set = Function_dual(3, (self, key, value) => {
      if (!1 === isEqual(key)) return self.referential.set(key, value), self;
      const hash = key[symbol](),
        bucket = self.buckets.get(hash);
      return void 0 === bucket
        ? (self.buckets.set(hash, [[key, value]]), self.bucketsSize++, self)
        : (removeFromBucket(self, bucket, key),
          bucket.push([key, value]),
          self.bucketsSize++,
          self);
    }),
    removeFromBucket = (self, bucket, key) => {
      for (let i = 0, len = bucket.length; i < len; i++)
        if (key[Equal_symbol](bucket[i][0]))
          return bucket.splice(i, 1), void self.bucketsSize--;
    },
    MetricStateTypeId = Symbol.for("effect/MetricState"),
    CounterStateTypeId = Symbol.for("effect/MetricState/Counter"),
    FrequencyStateTypeId = Symbol.for("effect/MetricState/Frequency"),
    GaugeStateTypeId = Symbol.for("effect/MetricState/Gauge"),
    HistogramStateTypeId = Symbol.for("effect/MetricState/Histogram"),
    SummaryStateTypeId = Symbol.for("effect/MetricState/Summary"),
    metricStateVariance = { _A: (_) => _ };
  class CounterState {
    count;
    [MetricStateTypeId] = metricStateVariance;
    [CounterStateTypeId] = CounterStateTypeId;
    constructor(count) {
      this.count = count;
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/MetricState/Counter"),
        combine(Hash_hash(this.count)),
        cached(this)
      );
    }
    [Equal_symbol](that) {
      return isCounterState(that) && this.count === that.count;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const arrayEquals = Array_getEquivalence(equals);
  class FrequencyState {
    occurrences;
    [MetricStateTypeId] = metricStateVariance;
    [FrequencyStateTypeId] = FrequencyStateTypeId;
    constructor(occurrences) {
      this.occurrences = occurrences;
    }
    _hash;
    [symbol]() {
      return Function_pipe(
        string("effect/MetricState/Frequency"),
        combine(array(Array_fromIterable(this.occurrences.entries()))),
        cached(this)
      );
    }
    [Equal_symbol](that) {
      return (
        isFrequencyState(that) &&
        arrayEquals(
          Array_fromIterable(this.occurrences.entries()),
          Array_fromIterable(that.occurrences.entries())
        )
      );
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  class GaugeState {
    value;
    [MetricStateTypeId] = metricStateVariance;
    [GaugeStateTypeId] = GaugeStateTypeId;
    constructor(value) {
      this.value = value;
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/MetricState/Gauge"),
        combine(Hash_hash(this.value)),
        cached(this)
      );
    }
    [Equal_symbol](u) {
      return isGaugeState(u) && this.value === u.value;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  class HistogramState {
    buckets;
    count;
    min;
    max;
    sum;
    [MetricStateTypeId] = metricStateVariance;
    [HistogramStateTypeId] = HistogramStateTypeId;
    constructor(buckets, count, min, max, sum) {
      (this.buckets = buckets),
        (this.count = count),
        (this.min = min),
        (this.max = max),
        (this.sum = sum);
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/MetricState/Histogram"),
        combine(Hash_hash(this.buckets)),
        combine(Hash_hash(this.count)),
        combine(Hash_hash(this.min)),
        combine(Hash_hash(this.max)),
        combine(Hash_hash(this.sum)),
        cached(this)
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
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  class SummaryState {
    error;
    quantiles;
    count;
    min;
    max;
    sum;
    [MetricStateTypeId] = metricStateVariance;
    [SummaryStateTypeId] = SummaryStateTypeId;
    constructor(error, quantiles, count, min, max, sum) {
      (this.error = error),
        (this.quantiles = quantiles),
        (this.count = count),
        (this.min = min),
        (this.max = max),
        (this.sum = sum);
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/MetricState/Summary"),
        combine(Hash_hash(this.error)),
        combine(Hash_hash(this.quantiles)),
        combine(Hash_hash(this.count)),
        combine(Hash_hash(this.min)),
        combine(Hash_hash(this.max)),
        combine(Hash_hash(this.sum)),
        cached(this)
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
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const isCounterState = (u) => Predicate_hasProperty(u, CounterStateTypeId),
    isFrequencyState = (u) => Predicate_hasProperty(u, FrequencyStateTypeId),
    isGaugeState = (u) => Predicate_hasProperty(u, GaugeStateTypeId),
    isHistogramState = (u) => Predicate_hasProperty(u, HistogramStateTypeId),
    isSummaryState = (u) => Predicate_hasProperty(u, SummaryStateTypeId),
    MetricHookTypeId = Symbol.for("effect/MetricHook"),
    metricHookVariance = { _In: (_) => _, _Out: (_) => _ },
    hook_make = (options) => ({
      [MetricHookTypeId]: metricHookVariance,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
      ...options,
    }),
    hook_bigint0 = BigInt(0),
    hook_counter = (key) => {
      let sum = key.keyType.bigint ? hook_bigint0 : 0;
      const canUpdate = key.keyType.incremental
        ? key.keyType.bigint
          ? (value) => value >= hook_bigint0
          : (value) => value >= 0
        : (_value) => !0;
      return hook_make({
        get: () => ((count) => new CounterState(count))(sum),
        update: (value) => {
          canUpdate(value) && (sum += value);
        },
      });
    },
    hook_frequency = (key) => {
      const values = new Map();
      for (const word of key.keyType.preregisteredWords) values.set(word, 0);
      return hook_make({
        get: () => new FrequencyState(values),
        update: (word) => {
          const slotCount = values.get(word) ?? 0;
          values.set(word, slotCount + 1);
        },
      });
    },
    hook_gauge = (_key, startAt) => {
      let value = startAt;
      return hook_make({
        get: () => ((count) => new GaugeState(count))(value),
        update: (v) => {
          value = v;
        },
      });
    },
    hook_histogram = (key) => {
      const bounds = key.keyType.boundaries.values,
        size = bounds.length,
        values = new Uint32Array(size + 1),
        boundaries = new Float32Array(size);
      let count = 0,
        sum = 0,
        min = Number.MAX_VALUE,
        max = Number.MIN_VALUE;
      Function_pipe(
        bounds,
        sort(Number_Order),
        Array_map((n, i) => {
          boundaries[i] = n;
        })
      );
      const getBuckets = () => {
        const builder = allocate(size);
        let cumulated = 0;
        for (let i = 0; i < size; i++) {
          const boundary = boundaries[i];
          (cumulated += values[i]), (builder[i] = [boundary, cumulated]);
        }
        return builder;
      };
      return hook_make({
        get: () => {
          return (
            (options = { buckets: getBuckets(), count, min, max, sum }),
            new HistogramState(
              options.buckets,
              options.count,
              options.min,
              options.max,
              options.sum
            )
          );
          var options;
        },
        update: (value) => {
          let from = 0,
            to = size;
          for (; from !== to; ) {
            const mid = Math.floor(from + (to - from) / 2);
            value <= boundaries[mid] ? (to = mid) : (from = mid),
              to === from + 1 &&
                (value <= boundaries[from] ? (to = from) : (from = to));
          }
          (values[from] = values[from] + 1),
            (count += 1),
            (sum += value),
            value < min && (min = value),
            value > max && (max = value);
        },
      });
    },
    hook_summary = (key) => {
      const { error, maxAge, maxSize, quantiles } = key.keyType,
        sortedQuantiles = Function_pipe(quantiles, sort(Number_Order)),
        values = allocate(maxSize);
      let head = 0,
        count = 0,
        sum = 0,
        min = Number.MAX_VALUE,
        max = Number.MIN_VALUE;
      const snapshot = (now) => {
        const builder = [];
        let i = 0;
        for (; i !== maxSize - 1; ) {
          const item = values[i];
          if (null != item) {
            const [t, v] = item,
              age = Duration_millis(now - t);
            Duration_greaterThanOrEqualTo(age, Duration_zero) &&
              age <= maxAge &&
              builder.push(v);
          }
          i += 1;
        }
        return calculateQuantiles(
          error,
          sortedQuantiles,
          sort(builder, Number_Order)
        );
      };
      return hook_make({
        get: () => {
          return (
            (options = {
              error,
              quantiles: snapshot(Date.now()),
              count,
              min,
              max,
              sum,
            }),
            new SummaryState(
              options.error,
              options.quantiles,
              options.count,
              options.min,
              options.max,
              options.sum
            )
          );
          var options;
        },
        update: ([value, timestamp]) =>
          ((value, timestamp) => {
            maxSize > 0 &&
              ((head += 1), (values[head % maxSize] = [timestamp, value]));
            (count += 1),
              (sum += value),
              value < min && (min = value),
              value > max && (max = value);
          })(value, timestamp),
      });
    },
    calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
      const sampleCount = sortedSamples.length;
      if (!isNonEmptyReadonlyArray(sortedQuantiles)) return [];
      const head = sortedQuantiles[0],
        tail = sortedQuantiles.slice(1),
        resolvedHead = resolveQuantile(
          error,
          sampleCount,
          Option_none(),
          0,
          head,
          sortedSamples
        ),
        resolved = Array_of(resolvedHead);
      return (
        tail.forEach((quantile) => {
          resolved.push(
            resolveQuantile(
              error,
              sampleCount,
              resolvedHead.value,
              resolvedHead.consumed,
              quantile,
              resolvedHead.rest
            )
          );
        }),
        Array_map(resolved, (rq) => [rq.quantile, rq.value])
      );
    },
    resolveQuantile = (
      error,
      sampleCount,
      current,
      consumed,
      quantile,
      rest
    ) => {
      let error_1 = error,
        sampleCount_1 = sampleCount,
        current_1 = current,
        consumed_1 = consumed,
        quantile_1 = quantile,
        rest_1 = rest,
        error_2 = error,
        sampleCount_2 = sampleCount,
        current_2 = current,
        consumed_2 = consumed,
        quantile_2 = quantile,
        rest_2 = rest;
      for (;;) {
        if (!isNonEmptyReadonlyArray(rest_1))
          return {
            quantile: quantile_1,
            value: Option_none(),
            consumed: consumed_1,
            rest: [],
          };
        if (1 === quantile_1)
          return {
            quantile: quantile_1,
            value: Option_some(lastNonEmpty(rest_1)),
            consumed: consumed_1 + rest_1.length,
            rest: [],
          };
        const sameHead = span(rest_1, (n) => n <= rest_1[0]),
          desired = quantile_1 * sampleCount_1,
          allowedError = (error_1 / 2) * desired,
          candConsumed = consumed_1 + sameHead[0].length,
          candError = Math.abs(candConsumed - desired);
        if (candConsumed < desired - allowedError)
          (error_2 = error_1),
            (sampleCount_2 = sampleCount_1),
            (current_2 = Array_head(rest_1)),
            (consumed_2 = candConsumed),
            (quantile_2 = quantile_1),
            (rest_2 = sameHead[1]),
            (error_1 = error_2),
            (sampleCount_1 = sampleCount_2),
            (current_1 = current_2),
            (consumed_1 = consumed_2),
            (quantile_1 = quantile_2),
            (rest_1 = rest_2);
        else {
          if (candConsumed > desired + allowedError)
            return {
              quantile: quantile_1,
              value: current_1,
              consumed: consumed_1,
              rest: rest_1,
            };
          switch (current_1._tag) {
            case "None":
              (error_2 = error_1),
                (sampleCount_2 = sampleCount_1),
                (current_2 = Array_head(rest_1)),
                (consumed_2 = candConsumed),
                (quantile_2 = quantile_1),
                (rest_2 = sameHead[1]),
                (error_1 = error_2),
                (sampleCount_1 = sampleCount_2),
                (current_1 = current_2),
                (consumed_1 = consumed_2),
                (quantile_1 = quantile_2),
                (rest_1 = rest_2);
              continue;
            case "Some":
              if (candError < Math.abs(desired - current_1.value)) {
                (error_2 = error_1),
                  (sampleCount_2 = sampleCount_1),
                  (current_2 = Array_head(rest_1)),
                  (consumed_2 = candConsumed),
                  (quantile_2 = quantile_1),
                  (rest_2 = sameHead[1]),
                  (error_1 = error_2),
                  (sampleCount_1 = sampleCount_2),
                  (current_1 = current_2),
                  (consumed_1 = consumed_2),
                  (quantile_1 = quantile_2),
                  (rest_1 = rest_2);
                continue;
              }
              return {
                quantile: quantile_1,
                value: Option_some(current_1.value),
                consumed: consumed_1,
                rest: rest_1,
              };
          }
        }
      }
      throw new Error(
        "BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues"
      );
    },
    MetricPairTypeId = Symbol.for("effect/MetricPair"),
    metricPairVariance = { _Type: (_) => _ },
    pair_unsafeMake = (metricKey, metricState) => ({
      [MetricPairTypeId]: metricPairVariance,
      metricKey,
      metricState,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    }),
    MetricRegistryTypeId = Symbol.for("effect/MetricRegistry");
  class MetricRegistryImpl {
    [MetricRegistryTypeId] = MetricRegistryTypeId;
    map = MutableHashMap_empty();
    snapshot() {
      const result = [];
      for (const [key, hook] of this.map)
        result.push(pair_unsafeMake(key, hook.get()));
      return result;
    }
    get(key) {
      const hook = Function_pipe(
        this.map,
        MutableHashMap_get(key),
        getOrUndefined
      );
      if (null == hook) {
        if (isCounterKey(key.keyType)) return this.getCounter(key);
        if (isGaugeKey(key.keyType)) return this.getGauge(key);
        if (isFrequencyKey(key.keyType)) return this.getFrequency(key);
        if (isHistogramKey(key.keyType)) return this.getHistogram(key);
        if (isSummaryKey(key.keyType)) return this.getSummary(key);
        throw new Error(
          "BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues"
        );
      }
      return hook;
    }
    getCounter(key) {
      let value = Function_pipe(
        this.map,
        MutableHashMap_get(key),
        getOrUndefined
      );
      if (null == value) {
        const counter = hook_counter(key);
        Function_pipe(this.map, MutableHashMap_has(key)) ||
          Function_pipe(this.map, MutableHashMap_set(key, counter)),
          (value = counter);
      }
      return value;
    }
    getFrequency(key) {
      let value = Function_pipe(
        this.map,
        MutableHashMap_get(key),
        getOrUndefined
      );
      if (null == value) {
        const frequency = hook_frequency(key);
        Function_pipe(this.map, MutableHashMap_has(key)) ||
          Function_pipe(this.map, MutableHashMap_set(key, frequency)),
          (value = frequency);
      }
      return value;
    }
    getGauge(key) {
      let value = Function_pipe(
        this.map,
        MutableHashMap_get(key),
        getOrUndefined
      );
      if (null == value) {
        const gauge = hook_gauge(0, key.keyType.bigint ? BigInt(0) : 0);
        Function_pipe(this.map, MutableHashMap_has(key)) ||
          Function_pipe(this.map, MutableHashMap_set(key, gauge)),
          (value = gauge);
      }
      return value;
    }
    getHistogram(key) {
      let value = Function_pipe(
        this.map,
        MutableHashMap_get(key),
        getOrUndefined
      );
      if (null == value) {
        const histogram = hook_histogram(key);
        Function_pipe(this.map, MutableHashMap_has(key)) ||
          Function_pipe(this.map, MutableHashMap_set(key, histogram)),
          (value = histogram);
      }
      return value;
    }
    getSummary(key) {
      let value = Function_pipe(
        this.map,
        MutableHashMap_get(key),
        getOrUndefined
      );
      if (null == value) {
        const summary = hook_summary(key);
        Function_pipe(this.map, MutableHashMap_has(key)) ||
          Function_pipe(this.map, MutableHashMap_set(key, summary)),
          (value = summary);
      }
      return value;
    }
  }
  const MetricTypeId = Symbol.for("effect/Metric"),
    metricVariance = { _Type: (_) => _, _In: (_) => _, _Out: (_) => _ },
    globalMetricRegistry = GlobalValue_globalValue(
      Symbol.for("effect/Metric/globalMetricRegistry"),
      () => new MetricRegistryImpl()
    ),
    metric_make = function (keyType, unsafeUpdate, unsafeValue) {
      const metric = Object.assign(
        (effect) => core_tap(effect, (a) => metric_update(metric, a)),
        {
          [MetricTypeId]: metricVariance,
          keyType,
          unsafeUpdate,
          unsafeValue,
          register() {
            return this.unsafeValue([]), this;
          },
          pipe() {
            return Pipeable_pipeArguments(this, arguments);
          },
        }
      );
      return metric;
    },
    metric_counter = (name, options) =>
      fromMetricKey(key_counter(name, options)),
    fromMetricKey = (key) => {
      let untaggedHook;
      const hookCache = new WeakMap(),
        hook = (extraTags) => {
          if (0 === extraTags.length)
            return (
              void 0 !== untaggedHook ||
                (untaggedHook = globalMetricRegistry.get(key)),
              untaggedHook
            );
          let hook = hookCache.get(extraTags);
          return (
            void 0 !== hook ||
              ((hook = globalMetricRegistry.get(
                taggedWithLabels(key, extraTags)
              )),
              hookCache.set(extraTags, hook)),
            hook
          );
        };
      return metric_make(
        key.keyType,
        (input, extraTags) => hook(extraTags).update(input),
        (extraTags) => hook(extraTags).get()
      );
    },
    metric_histogram = (name, boundaries, description) =>
      fromMetricKey(key_histogram(name, boundaries, description)),
    metric_tagged = Function_dual(3, (self, key, value) =>
      metric_taggedWithLabels(self, [label_make(key, value)])
    ),
    metric_taggedWithLabels = Function_dual(2, (self, extraTags) =>
      metric_make(
        self.keyType,
        (input, extraTags1) =>
          self.unsafeUpdate(input, Array_union(extraTags, extraTags1)),
        (extraTags1) => self.unsafeValue(Array_union(extraTags, extraTags1))
      )
    ),
    metric_update = Function_dual(2, (self, input) =>
      fiberRefGetWith(currentMetricLabels, (tags) =>
        sync(() => self.unsafeUpdate(input, tags))
      )
    ),
    MetricBoundariesTypeId = Symbol.for("effect/MetricBoundaries");
  class MetricBoundariesImpl {
    values;
    [MetricBoundariesTypeId] = MetricBoundariesTypeId;
    constructor(values) {
      (this.values = values),
        (this._hash = Function_pipe(
          string("effect/MetricBoundaries"),
          combine(array(this.values))
        ));
    }
    _hash;
    [symbol]() {
      return this._hash;
    }
    [Equal_symbol](u) {
      return isMetricBoundaries(u) && equals(this.values, u.values);
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const isMetricBoundaries = (u) =>
      Predicate_hasProperty(u, MetricBoundariesTypeId),
    boundaries_fromIterable = (iterable) => {
      const values = Function_pipe(
        iterable,
        Array_appendAll(Chunk_of(Number.POSITIVE_INFINITY)),
        dedupe
      );
      return new MetricBoundariesImpl(values);
    },
    exponential = (options) =>
      Function_pipe(
        Array_makeBy(
          options.count - 1,
          (i) => options.start * Math.pow(options.factor, i)
        ),
        unsafeFromArray,
        boundaries_fromIterable
      ),
    RequestTypeId = Symbol.for("effect/Request"),
    request_complete = Function_dual(2, (self, result) =>
      fiberRefGetWith(currentRequestMap, (map) =>
        sync(() => {
          if (map.has(self)) {
            const entry = map.get(self);
            entry.state.completed ||
              ((entry.state.completed = !0),
              deferredUnsafeDone(entry.result, result));
          }
        })
      )
    );
  const SupervisorTypeId = Symbol.for("effect/Supervisor"),
    supervisorVariance = { _T: (_) => _ };
  class ProxySupervisor {
    underlying;
    value0;
    [SupervisorTypeId] = supervisorVariance;
    constructor(underlying, value0) {
      (this.underlying = underlying), (this.value0 = value0);
    }
    get value() {
      return this.value0;
    }
    onStart(context, effect, parent, fiber) {
      this.underlying.onStart(context, effect, parent, fiber);
    }
    onEnd(value, fiber) {
      this.underlying.onEnd(value, fiber);
    }
    onEffect(fiber, effect) {
      this.underlying.onEffect(fiber, effect);
    }
    onSuspend(fiber) {
      this.underlying.onSuspend(fiber);
    }
    onResume(fiber) {
      this.underlying.onResume(fiber);
    }
    map(f) {
      return new ProxySupervisor(this, Function_pipe(this.value, core_map(f)));
    }
    zip(right) {
      return new Zip(this, right);
    }
  }
  class Zip {
    left;
    right;
    _tag = "Zip";
    [SupervisorTypeId] = supervisorVariance;
    constructor(left, right) {
      (this.left = left), (this.right = right);
    }
    get value() {
      return core_zip(this.left.value, this.right.value);
    }
    onStart(context, effect, parent, fiber) {
      this.left.onStart(context, effect, parent, fiber),
        this.right.onStart(context, effect, parent, fiber);
    }
    onEnd(value, fiber) {
      this.left.onEnd(value, fiber), this.right.onEnd(value, fiber);
    }
    onEffect(fiber, effect) {
      this.left.onEffect(fiber, effect), this.right.onEffect(fiber, effect);
    }
    onSuspend(fiber) {
      this.left.onSuspend(fiber), this.right.onSuspend(fiber);
    }
    onResume(fiber) {
      this.left.onResume(fiber), this.right.onResume(fiber);
    }
    map(f) {
      return new ProxySupervisor(this, Function_pipe(this.value, core_map(f)));
    }
    zip(right) {
      return new Zip(this, right);
    }
  }
  const isZip = (self) =>
    Predicate_hasProperty(self, SupervisorTypeId) && isTagged(self, "Zip");
  class Const {
    effect;
    [SupervisorTypeId] = supervisorVariance;
    constructor(effect) {
      this.effect = effect;
    }
    get value() {
      return this.effect;
    }
    onStart(_context, _effect, _parent, _fiber) {}
    onEnd(_value, _fiber) {}
    onEffect(_fiber, _effect) {}
    onSuspend(_fiber) {}
    onResume(_fiber) {}
    map(f) {
      return new ProxySupervisor(this, Function_pipe(this.value, core_map(f)));
    }
    zip(right) {
      return new Zip(this, right);
    }
    onRun(execution, _fiber) {
      return execution();
    }
  }
  const supervisor_none = GlobalValue_globalValue(
      "effect/Supervisor/none",
      () => ((effect) => new Const(effect))(core_void_)
    ),
    supervisor_patch_empty = { _tag: "Empty" },
    supervisor_patch_combine = (self, that) => ({
      _tag: "AndThen",
      first: self,
      second: that,
    }),
    patchLoop = (_supervisor, _patches) => {
      let supervisor = _supervisor,
        patches = _patches;
      for (; isNonEmpty(patches); ) {
        const head = Chunk_headNonEmpty(patches);
        switch (head._tag) {
          case "Empty":
            patches = Chunk_tailNonEmpty(patches);
            break;
          case "AddSupervisor":
            (supervisor = supervisor.zip(head.supervisor)),
              (patches = Chunk_tailNonEmpty(patches));
            break;
          case "RemoveSupervisor":
            (supervisor = removeSupervisor(supervisor, head.supervisor)),
              (patches = Chunk_tailNonEmpty(patches));
            break;
          case "AndThen":
            patches = Chunk_prepend(head.first)(
              Chunk_prepend(head.second)(Chunk_tailNonEmpty(patches))
            );
        }
      }
      return supervisor;
    },
    removeSupervisor = (self, that) =>
      equals(self, that)
        ? supervisor_none
        : isZip(self)
        ? removeSupervisor(self.left, that).zip(
            removeSupervisor(self.right, that)
          )
        : self,
    patch_toSet = (self) =>
      equals(self, supervisor_none)
        ? HashSet_empty()
        : isZip(self)
        ? Function_pipe(
            patch_toSet(self.left),
            HashSet_union(patch_toSet(self.right))
          )
        : HashSet_make(self),
    patch_differ = differ_make({
      empty: supervisor_patch_empty,
      patch: (self, supervisor) => patchLoop(supervisor, Chunk_of(self)),
      combine: supervisor_patch_combine,
      diff: (oldValue, newValue) => {
        if (equals(oldValue, newValue)) return supervisor_patch_empty;
        const oldSupervisors = patch_toSet(oldValue),
          newSupervisors = patch_toSet(newValue),
          added = Function_pipe(
            newSupervisors,
            HashSet_difference(oldSupervisors),
            HashSet_reduce(supervisor_patch_empty, (patch, supervisor) =>
              supervisor_patch_combine(patch, {
                _tag: "AddSupervisor",
                supervisor,
              })
            )
          ),
          removed = Function_pipe(
            oldSupervisors,
            HashSet_difference(newSupervisors),
            HashSet_reduce(supervisor_patch_empty, (patch, supervisor) =>
              supervisor_patch_combine(patch, {
                _tag: "RemoveSupervisor",
                supervisor,
              })
            )
          );
        return supervisor_patch_combine(added, removed);
      },
    }),
    fiberStarted = metric_counter("effect_fiber_started", { incremental: !0 }),
    fiberActive = metric_counter("effect_fiber_active"),
    fiberSuccesses = metric_counter("effect_fiber_successes", {
      incremental: !0,
    }),
    fiberFailures = metric_counter("effect_fiber_failures", {
      incremental: !0,
    }),
    fiberLifetimes = metric_tagged(
      metric_histogram(
        "effect_fiber_lifetimes",
        exponential({ start: 0.5, factor: 2, count: 35 })
      ),
      "time_unit",
      "milliseconds"
    ),
    runtimeFiberVariance = { _E: (_) => _, _A: (_) => _ },
    fiberRuntime_absurd = (_) => {
      throw new Error(
        `BUG: FiberRuntime - ${toStringUnknown(
          _
        )} - please report an issue at https://github.com/Effect-TS/effect/issues`
      );
    },
    YieldedOp = Symbol.for("effect/internal/fiberRuntime/YieldedOp"),
    yieldedOpChannel = GlobalValue_globalValue(
      "effect/internal/fiberRuntime/yieldedOpChannel",
      () => ({ currentOp: null })
    ),
    contOpSuccess = {
      OnSuccess: (_, cont, value) => cont.effect_instruction_i1(value),
      OnStep: (_, _cont, value) => exitSucceed(exitSucceed(value)),
      OnSuccessAndFailure: (_, cont, value) =>
        cont.effect_instruction_i2(value),
      RevertFlags: (self, cont, value) => (
        self.patchRuntimeFlags(self._runtimeFlags, cont.patch),
        interruptible(self._runtimeFlags) && self.isInterrupted()
          ? exitFailCause(self.getInterruptedCause())
          : exitSucceed(value)
      ),
      While: (self, cont, value) => (
        cont.effect_instruction_i2(value),
        cont.effect_instruction_i0()
          ? (self.pushStack(cont), cont.effect_instruction_i1())
          : core_void_
      ),
    },
    drainQueueWhileRunningTable = {
      InterruptSignal: (self, runtimeFlags, cur, message) => (
        self.processNewInterruptSignal(message.cause),
        interruptible(runtimeFlags) ? exitFailCause(message.cause) : cur
      ),
      Resume: (_self, _runtimeFlags, _cur, _message) => {
        throw new Error(
          "It is illegal to have multiple concurrent run loops in a single fiber"
        );
      },
      Stateful: (self, runtimeFlags, cur, message) => (
        message.onFiber(self, FiberStatus_running(runtimeFlags)), cur
      ),
      YieldNow: (_self, _runtimeFlags, cur, _message) =>
        core_flatMap(yieldNow(), () => cur),
    },
    runBlockedRequests = (self) =>
      forEachSequentialDiscard(
        ((self) => {
          let current = List_of(self),
            updated = List_empty();
          for (;;) {
            const [parallel, sequential] = List_reduce(
              current,
              [parallelCollectionEmpty(), List_empty()],
              ([parallel, sequential], blockedRequest) => {
                const [par, seq] = blockedRequests_step(blockedRequest);
                return [
                  parallelCollectionCombine(parallel, par),
                  List_appendAll(sequential, seq),
                ];
              }
            );
            if (
              ((updated = blockedRequests_merge(updated, parallel)),
              isNil(sequential))
            )
              return List_reverse(updated);
            current = sequential;
          }
          throw new Error(
            "BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues"
          );
        })(self),
        (requestsByRequestResolver) =>
          forEachConcurrentDiscard(
            ((self) => Array.from(self.map))(requestsByRequestResolver),
            ([dataSource, sequential]) => {
              const map = new Map(),
                arr = [];
              for (const block of sequential) {
                arr.push(toReadonlyArray(block));
                for (const entry of block) map.set(entry.request, entry);
              }
              const flat = arr.flat();
              return fiberRefLocally(
                invokeWithInterrupt(dataSource.runAll(arr), flat, () =>
                  flat.forEach((entry) => {
                    entry.listeners.interrupted = !0;
                  })
                ),
                currentRequestMap,
                map
              );
            },
            !1,
            !1
          )
      );
  class FiberRuntime {
    [FiberTypeId] = fiberVariance;
    [RuntimeFiberTypeId] = runtimeFiberVariance;
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
    _fiberRefs;
    _fiberId;
    _runtimeFlags;
    _queue = new Array();
    _children = null;
    _observers = new Array();
    _running = !1;
    _stack = [];
    _asyncInterruptor = null;
    _asyncBlockingOn = null;
    _exitValue = null;
    _steps = [];
    _supervisor;
    _scheduler;
    _tracer;
    currentOpCount = 0;
    isYielding = !1;
    constructor(fiberId, fiberRefs0, runtimeFlags0) {
      if (
        ((this._runtimeFlags = runtimeFlags0),
        (this._fiberId = fiberId),
        (this._fiberRefs = fiberRefs0),
        (this._supervisor = this.getFiberRef(currentSupervisor)),
        (this._scheduler = this.getFiberRef(currentScheduler)),
        runtimeMetrics(runtimeFlags0))
      ) {
        const tags = this.getFiberRef(currentMetricLabels);
        fiberStarted.unsafeUpdate(1, tags), fiberActive.unsafeUpdate(1, tags);
      }
      this._tracer = Context_get(this.getFiberRef(currentServices), tracerTag);
    }
    id() {
      return this._fiberId;
    }
    resume(effect) {
      this.tell(resume(effect));
    }
    get status() {
      return this.ask((_, status) => status);
    }
    get runtimeFlags() {
      return this.ask((state, status) =>
        FiberStatus_isDone(status) ? state._runtimeFlags : status.runtimeFlags
      );
    }
    scope() {
      return new Local((fiber = this).id(), fiber);
      var fiber;
    }
    get children() {
      return this.ask((fiber) => Array.from(fiber.getChildren()));
    }
    getChildren() {
      return (
        null === this._children && (this._children = new Set()), this._children
      );
    }
    getInterruptedCause() {
      return this.getFiberRef(currentInterruptedCause);
    }
    fiberRefs() {
      return this.ask((fiber) => fiber.getFiberRefs());
    }
    ask(f) {
      return suspend(() => {
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
      });
    }
    tell(message) {
      this._queue.push(message),
        this._running ||
          ((this._running = !0), this.drainQueueLaterOnExecutor());
    }
    get await() {
      return core_async((resume) => {
        const cb = (exit) => resume(succeed(exit));
        return (
          this.tell(
            stateful((fiber, _) => {
              null !== fiber._exitValue
                ? cb(this._exitValue)
                : fiber.addObserver(cb);
            })
          ),
          sync(() =>
            this.tell(
              stateful((fiber, _) => {
                fiber.removeObserver(cb);
              })
            )
          )
        );
      }, this.id());
    }
    get inheritAll() {
      return withFiberRuntime((parentFiber, parentStatus) => {
        const parentFiberId = parentFiber.id(),
          parentFiberRefs = parentFiber.getFiberRefs(),
          parentRuntimeFlags = parentStatus.runtimeFlags,
          childFiberRefs = this.getFiberRefs(),
          updatedFiberRefs = joinAs(
            parentFiberRefs,
            parentFiberId,
            childFiberRefs
          );
        parentFiber.setFiberRefs(updatedFiberRefs);
        const updatedRuntimeFlags =
            parentFiber.getFiberRef(currentRuntimeFlags),
          patch = Function_pipe(
            runtimeFlags_diff(parentRuntimeFlags, updatedRuntimeFlags),
            RuntimeFlagsPatch_exclude(1),
            RuntimeFlagsPatch_exclude(16)
          );
        return updateRuntimeFlags(patch);
      });
    }
    get poll() {
      return sync(() => fromNullable(this._exitValue));
    }
    unsafePoll() {
      return this._exitValue;
    }
    interruptAsFork(fiberId) {
      return sync(() => this.tell(interruptSignal(interrupt(fiberId))));
    }
    unsafeInterruptAsFork(fiberId) {
      this.tell(interruptSignal(interrupt(fiberId)));
    }
    addObserver(observer) {
      null !== this._exitValue
        ? observer(this._exitValue)
        : this._observers.push(observer);
    }
    removeObserver(observer) {
      this._observers = this._observers.filter((o) => o !== observer);
    }
    getFiberRefs() {
      return (
        this.setFiberRef(currentRuntimeFlags, this._runtimeFlags),
        this._fiberRefs
      );
    }
    unsafeDeleteFiberRef(fiberRef) {
      this._fiberRefs = delete_(this._fiberRefs, fiberRef);
    }
    getFiberRef(fiberRef) {
      return this._fiberRefs.locals.has(fiberRef)
        ? this._fiberRefs.locals.get(fiberRef)[0][1]
        : fiberRef.initial;
    }
    setFiberRef(fiberRef, value) {
      (this._fiberRefs = updateAs(this._fiberRefs, {
        fiberId: this._fiberId,
        fiberRef,
        value,
      })),
        this.refreshRefCache();
    }
    refreshRefCache() {
      (this._tracer = Context_get(
        this.getFiberRef(currentServices),
        tracerTag
      )),
        (this._supervisor = this.getFiberRef(currentSupervisor)),
        (this._scheduler = this.getFiberRef(currentScheduler));
    }
    setFiberRefs(fiberRefs) {
      (this._fiberRefs = fiberRefs), this.refreshRefCache();
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
            evaluationSignal =
              0 === this._queue.length
                ? "Done"
                : this.evaluateMessageWhileSuspended(
                    this._queue.splice(0, 1)[0]
                  );
        } finally {
          (this._running = !1), (globalThis[currentFiberURI] = prev);
        }
        this._queue.length > 0 && !this._running
          ? ((this._running = !0),
            "Yield" === evaluationSignal
              ? (this.drainQueueLaterOnExecutor(), (recurse = !1))
              : (recurse = !0))
          : (recurse = !1);
      }
    }
    drainQueueLaterOnExecutor() {
      this._scheduler.scheduleTask(
        this.run,
        this.getFiberRef(currentSchedulingPriority)
      );
    }
    drainQueueWhileRunning(runtimeFlags, cur0) {
      let cur = cur0;
      for (; this._queue.length > 0; ) {
        const message = this._queue.splice(0, 1)[0];
        cur = drainQueueWhileRunningTable[message._tag](
          this,
          runtimeFlags,
          cur,
          message
        );
      }
      return cur;
    }
    isInterrupted() {
      return !cause_isEmpty(this.getFiberRef(currentInterruptedCause));
    }
    addInterruptedCause(cause) {
      const oldSC = this.getFiberRef(currentInterruptedCause);
      this.setFiberRef(currentInterruptedCause, sequential(oldSC, cause));
    }
    processNewInterruptSignal(cause) {
      this.addInterruptedCause(cause), this.sendInterruptSignalToAllChildren();
    }
    sendInterruptSignalToAllChildren() {
      if (null === this._children || 0 === this._children.size) return !1;
      let told = !1;
      for (const child of this._children)
        child.tell(interruptSignal(interrupt(this.id()))), (told = !0);
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
                isDone = !0;
              })
            : core_asVoid(next.value.await);
        };
        return whileLoop({ while: () => !isDone, body, step: () => {} });
      }
      return null;
    }
    reportExitValue(exit) {
      if (runtimeMetrics(this._runtimeFlags)) {
        const tags = this.getFiberRef(currentMetricLabels),
          startTimeMillis = this.id().startTimeMillis,
          endTimeMillis = Date.now();
        switch (
          (fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags),
          fiberActive.unsafeUpdate(-1, tags),
          exit._tag)
        ) {
          case "Success":
            fiberSuccesses.unsafeUpdate(1, tags);
            break;
          case "Failure":
            fiberFailures.unsafeUpdate(1, tags);
        }
      }
      if ("Failure" === exit._tag) {
        const level = this.getFiberRef(currentUnhandledErrorLogLevel);
        isInterruptedOnly(exit.cause) ||
          "Some" !== level._tag ||
          this.log(
            "Fiber terminated with an unhandled error",
            exit.cause,
            level
          );
      }
    }
    setExitValue(exit) {
      (this._exitValue = exit), this.reportExitValue(exit);
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
        minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
      if (LogLevel_greaterThan(minimumLogLevel, logLevel)) return;
      const spans = this.getFiberRef(currentLogSpan),
        annotations = this.getFiberRef(currentLogAnnotations),
        loggers = this.getLoggers(),
        contextMap = this.getFiberRefs();
      if (HashSet_size(loggers) > 0) {
        const clockService = Context_get(
            this.getFiberRef(currentServices),
            clockTag
          ),
          date = new Date(clockService.unsafeCurrentTimeMillis());
        for (const logger of loggers)
          logger.log({
            fiberId: this.id(),
            logLevel,
            message,
            cause,
            context: contextMap,
            spans,
            annotations,
            date,
          });
      }
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
                ? FiberStatus_done
                : FiberStatus_suspended(
                    this._runtimeFlags,
                    this._asyncBlockingOn
                  )
            ),
            "Continue"
          );
        default:
          return fiberRuntime_absurd(message);
      }
    }
    evaluateEffect(effect0) {
      this._supervisor.onResume(this);
      try {
        let effect =
          interruptible(this._runtimeFlags) && this.isInterrupted()
            ? exitFailCause(this.getInterruptedCause())
            : effect0;
        for (; null !== effect; ) {
          const eff = effect,
            exit = this.runLoop(eff);
          if (exit === YieldedOp) {
            const op = yieldedOpChannel.currentOp;
            (yieldedOpChannel.currentOp = null),
              "Yield" === op._op
                ? ((self = this._runtimeFlags),
                  runtimeFlags_isEnabled(self, 32)
                    ? (this.tell({ _tag: "YieldNow" }),
                      this.tell(resume(exitVoid)),
                      (effect = null))
                    : (effect = exitVoid))
                : "Async" === op._op && (effect = null);
          } else {
            this._runtimeFlags = Function_pipe(
              this._runtimeFlags,
              runtimeFlags_enable(16)
            );
            const interruption = this.interruptAllChildren();
            null !== interruption
              ? (effect = core_flatMap(interruption, () => exit))
              : (0 === this._queue.length
                  ? this.setExitValue(exit)
                  : this.tell(resume(exit)),
                (effect = null));
          }
        }
      } finally {
        this._supervisor.onSuspend(this);
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
            this._queue.length > 0 && this.drainQueueLaterOnExecutor();
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
        alreadyCalled || ((alreadyCalled = !0), this.tell(resume(effect)));
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
        "OnStep" === cont._op &&
          this._steps.push({
            refs: this.getFiberRefs(),
            flags: this._runtimeFlags,
          });
    }
    popStack() {
      const item = this._stack.pop();
      if (item) return "OnStep" === item._op && this._steps.pop(), item;
    }
    getNextSuccessCont() {
      let frame = this.popStack();
      for (; frame; ) {
        if ("OnFailure" !== frame._op) return frame;
        frame = this.popStack();
      }
    }
    getNextFailCont() {
      let frame = this.popStack();
      for (; frame; ) {
        if ("OnSuccess" !== frame._op && "While" !== frame._op) return frame;
        frame = this.popStack();
      }
    }
    Tag(op) {
      return core_map(fiberRefGet(currentContext), (context) =>
        Context_unsafeGet(context, op)
      );
    }
    Left(op) {
      return core_fail(op.left);
    }
    None(_) {
      return core_fail(new NoSuchElementException());
    }
    Right(op) {
      return exitSucceed(op.right);
    }
    Some(op) {
      return exitSucceed(op.value);
    }
    Sync(op) {
      const value = op.effect_instruction_i0(),
        cont = this.getNextSuccessCont();
      return void 0 !== cont
        ? (cont._op in contOpSuccess || fiberRuntime_absurd(cont),
          contOpSuccess[cont._op](this, cont, value))
        : ((yieldedOpChannel.currentOp = exitSucceed(value)), YieldedOp);
    }
    Success(op) {
      const oldCur = op,
        cont = this.getNextSuccessCont();
      return void 0 !== cont
        ? (cont._op in contOpSuccess || fiberRuntime_absurd(cont),
          contOpSuccess[cont._op](this, cont, oldCur.effect_instruction_i0))
        : ((yieldedOpChannel.currentOp = oldCur), YieldedOp);
    }
    Failure(op) {
      const cause = op.effect_instruction_i0,
        cont = this.getNextFailCont();
      if (void 0 === cont)
        return (yieldedOpChannel.currentOp = exitFailCause(cause)), YieldedOp;
      switch (cont._op) {
        case "OnFailure":
        case "OnSuccessAndFailure":
          return interruptible(this._runtimeFlags) && this.isInterrupted()
            ? exitFailCause(stripFailures(cause))
            : cont.effect_instruction_i1(cause);
        case "OnStep":
          return interruptible(this._runtimeFlags) && this.isInterrupted()
            ? exitFailCause(stripFailures(cause))
            : exitSucceed(exitFailCause(cause));
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
      return op.effect_instruction_i0(
        this,
        FiberStatus_running(this._runtimeFlags)
      );
    }
    Blocked(op) {
      const refs = this.getFiberRefs(),
        flags = this._runtimeFlags;
      if (this._steps.length > 0) {
        const frames = [],
          snap = this._steps[this._steps.length - 1];
        let frame = this.popStack();
        for (; frame && "OnStep" !== frame._op; )
          frames.push(frame), (frame = this.popStack());
        this.setFiberRefs(snap.refs), (this._runtimeFlags = snap.flags);
        const patchRefs = FiberRefsPatch_diff(snap.refs, refs),
          patchFlags = runtimeFlags_diff(snap.flags, flags);
        return exitSucceed(
          blocked(
            op.effect_instruction_i0,
            withFiberRuntime((newFiber) => {
              for (; frames.length > 0; ) newFiber.pushStack(frames.pop());
              return (
                newFiber.setFiberRefs(
                  FiberRefsPatch_patch(
                    newFiber.id(),
                    newFiber.getFiberRefs()
                  )(patchRefs)
                ),
                (newFiber._runtimeFlags = runtimeFlags_patch(patchFlags)(
                  newFiber._runtimeFlags
                )),
                op.effect_instruction_i1
              );
            })
          )
        );
      }
      return uninterruptibleMask((restore) =>
        core_flatMap(
          forkDaemon(runRequestBlock(op.effect_instruction_i0)),
          () => restore(op.effect_instruction_i1)
        )
      );
    }
    RunBlocked(op) {
      return runBlockedRequests(op.effect_instruction_i0);
    }
    UpdateRuntimeFlags(op) {
      const updateFlags = op.effect_instruction_i0,
        oldRuntimeFlags = this._runtimeFlags,
        newRuntimeFlags = runtimeFlags_patch(oldRuntimeFlags, updateFlags);
      if (interruptible(newRuntimeFlags) && this.isInterrupted())
        return exitFailCause(this.getInterruptedCause());
      if (
        (this.patchRuntimeFlags(this._runtimeFlags, updateFlags),
        op.effect_instruction_i1)
      ) {
        const revertFlags = runtimeFlags_diff(newRuntimeFlags, oldRuntimeFlags);
        return (
          this.pushStack(new RevertFlags(revertFlags, op)),
          op.effect_instruction_i1(oldRuntimeFlags)
        );
      }
      return exitVoid;
    }
    OnSuccess(op) {
      return this.pushStack(op), op.effect_instruction_i0;
    }
    OnStep(op) {
      return this.pushStack(op), op.effect_instruction_i0;
    }
    OnFailure(op) {
      return this.pushStack(op), op.effect_instruction_i0;
    }
    OnSuccessAndFailure(op) {
      return this.pushStack(op), op.effect_instruction_i0;
    }
    Async(op) {
      return (
        (this._asyncBlockingOn = op.effect_instruction_i1),
        this.initiateAsync(this._runtimeFlags, op.effect_instruction_i0),
        (yieldedOpChannel.currentOp = op),
        YieldedOp
      );
    }
    Yield(op) {
      return (
        (this.isYielding = !1), (yieldedOpChannel.currentOp = op), YieldedOp
      );
    }
    While(op) {
      const check = op.effect_instruction_i0,
        body = op.effect_instruction_i1;
      return check() ? (this.pushStack(op), body()) : exitVoid;
    }
    Commit(op) {
      return op.commit();
    }
    runLoop(effect0) {
      let cur = effect0;
      for (this.currentOpCount = 0; ; ) {
        if (
          (0 != (2 & this._runtimeFlags) &&
            this._supervisor.onEffect(this, cur),
          this._queue.length > 0 &&
            (cur = this.drainQueueWhileRunning(this._runtimeFlags, cur)),
          !this.isYielding)
        ) {
          this.currentOpCount += 1;
          const shouldYield = this._scheduler.shouldYield(this);
          if (!1 !== shouldYield) {
            (this.isYielding = !0), (this.currentOpCount = 0);
            const oldCur = cur;
            cur = core_flatMap(
              yieldNow({ priority: shouldYield }),
              () => oldCur
            );
          }
        }
        try {
          if (
            (("_op" in cur && cur._op in this) || fiberRuntime_absurd(cur),
            (cur = this._tracer.context(
              () =>
                getCurrentVersion() !== cur[Effectable_EffectTypeId]._V
                  ? dieMessage(
                      `Cannot execute an Effect versioned ${
                        cur[Effectable_EffectTypeId]._V
                      } with a Runtime of version ${getCurrentVersion()}`
                    )
                  : this[cur._op](cur),
              this
            )),
            cur === YieldedOp)
          ) {
            const op = yieldedOpChannel.currentOp;
            return "Yield" === op._op || "Async" === op._op
              ? YieldedOp
              : ((yieldedOpChannel.currentOp = null),
                "Success" === op._op || "Failure" === op._op
                  ? op
                  : exitFailCause(die(op)));
          }
        } catch (e) {
          cur = Predicate_hasProperty(e, EffectErrorTypeId)
            ? exitFailCause(e.cause)
            : isInterruptedException(e)
            ? exitFailCause(sequential(die(e), interrupt(FiberId_none)))
            : exitFailCause(die(e));
        }
      }
    }
    run = () => {
      this.drainQueueOnCurrentThread();
    };
  }
  const currentMinimumLogLevel = GlobalValue_globalValue(
      "effect/FiberRef/currentMinimumLogLevel",
      () =>
        fiberRefUnsafeMake(
          ((literal) => {
            switch (literal) {
              case "All":
                return All;
              case "Debug":
                return Debug;
              case "Error":
                return LogLevel_Error;
              case "Fatal":
                return Fatal;
              case "Info":
                return Info;
              case "Trace":
                return Trace;
              case "None":
                return LogLevel_None;
              case "Warning":
                return Warning;
            }
          })("Info")
        )
    ),
    loggerWithConsoleLog = (self) =>
      makeLogger((opts) => {
        const services = FiberRefs_getOrDefault(opts.context, currentServices);
        Context_get(services, console_consoleTag).unsafe.log(self.log(opts));
      }),
    defaultLogger = GlobalValue_globalValue(
      Symbol.for("effect/Logger/defaultLogger"),
      () => loggerWithConsoleLog(stringLogger)
    ),
    tracerLogger = GlobalValue_globalValue(
      Symbol.for("effect/Logger/tracerLogger"),
      () =>
        makeLogger(
          ({ annotations, cause, context, fiberId, logLevel, message }) => {
            const span = flatMap(
                fiberRefs_get(context, currentContext),
                Context_getOption(spanTag)
              ),
              clockService = map(fiberRefs_get(context, currentServices), (_) =>
                Context_get(_, clockTag)
              );
            if (
              "None" === span._tag ||
              "ExternalSpan" === span.value._tag ||
              "None" === clockService._tag
            )
              return;
            const attributes = Object.fromEntries(
              HashMap_map(annotations, toStringUnknown)
            );
            (attributes["effect.fiberId"] = FiberId_threadName(fiberId)),
              (attributes["effect.logLevel"] = logLevel.label),
              null !== cause &&
                "Empty" !== cause._tag &&
                (attributes["effect.cause"] = pretty(cause)),
              span.value.event(
                String(message),
                clockService.value.unsafeCurrentTimeNanos(),
                attributes
              );
          }
        )
    ),
    currentLoggers = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentLoggers"),
      () =>
        ((initial) => {
          const differ = hashSet();
          return fiberRefUnsafeMakePatch(initial, {
            differ,
            fork: differ.empty,
          });
        })(HashSet_make(defaultLogger, tracerLogger))
    ),
    fiberRuntime_forEach = Function_dual(
      (args) => isIterable(args[0]),
      (self, f, options) =>
        withFiberRuntime((r) => {
          const isRequestBatchingEnabled =
            !0 === options?.batching ||
            ("inherit" === options?.batching &&
              r.getFiberRef(currentRequestBatching));
          return options?.discard
            ? concurrency_match(
                options.concurrency,
                () =>
                  finalizersMask(ExecutionStrategy_sequential)((restore) =>
                    isRequestBatchingEnabled
                      ? forEachConcurrentDiscard(
                          self,
                          (a, i) => restore(f(a, i)),
                          !0,
                          !1,
                          1
                        )
                      : forEachSequentialDiscard(self, (a, i) =>
                          restore(f(a, i))
                        )
                  ),
                () =>
                  finalizersMask(ExecutionStrategy_parallel)((restore) =>
                    forEachConcurrentDiscard(
                      self,
                      (a, i) => restore(f(a, i)),
                      isRequestBatchingEnabled,
                      !1
                    )
                  ),
                (n) =>
                  finalizersMask(ExecutionStrategy_parallelN(n))((restore) =>
                    forEachConcurrentDiscard(
                      self,
                      (a, i) => restore(f(a, i)),
                      isRequestBatchingEnabled,
                      !1,
                      n
                    )
                  )
              )
            : concurrency_match(
                options?.concurrency,
                () =>
                  finalizersMask(ExecutionStrategy_sequential)((restore) =>
                    isRequestBatchingEnabled
                      ? forEachParN(self, 1, (a, i) => restore(f(a, i)), !0)
                      : forEachSequential(self, (a, i) => restore(f(a, i)))
                  ),
                () =>
                  finalizersMask(ExecutionStrategy_parallel)((restore) =>
                    forEachParUnbounded(
                      self,
                      (a, i) => restore(f(a, i)),
                      isRequestBatchingEnabled
                    )
                  ),
                (n) =>
                  finalizersMask(ExecutionStrategy_parallelN(n))((restore) =>
                    forEachParN(
                      self,
                      n,
                      (a, i) => restore(f(a, i)),
                      isRequestBatchingEnabled
                    )
                  )
              );
        })
    ),
    forEachParUnbounded = (self, f, batching) =>
      suspend(() => {
        const as = Array_fromIterable(self),
          array = new Array(as.length);
        return core_zipRight(
          forEachConcurrentDiscard(
            as,
            (a, i) => core_flatMap(f(a, i), (b) => sync(() => (array[i] = b))),
            batching,
            !1
          ),
          succeed(array)
        );
      }),
    forEachConcurrentDiscard = (self, f, batching, processAll, n) =>
      uninterruptibleMask((restore) =>
        transplant((graft) =>
          withFiberRuntime((parent) => {
            let todos = Array.from(self).reverse(),
              target = todos.length;
            if (0 === target) return core_void_;
            let counter = 0,
              interrupted = !1;
            const fibersCount = n ? Math.min(todos.length, n) : todos.length,
              fibers = new Set(),
              results = new Array(),
              startOrder = new Array(),
              joinOrder = new Array(),
              residual = new Array(),
              collectExits = () => {
                const exits = results
                  .filter(({ exit }) => "Failure" === exit._tag)
                  .sort((a, b) =>
                    a.index < b.index ? -1 : a.index === b.index ? 0 : 1
                  )
                  .map(({ exit }) => exit);
                return 0 === exits.length && exits.push(exitVoid), exits;
              },
              runFiber = (eff, interruptImmediately = !1) => {
                const runnable = uninterruptible(graft(eff)),
                  fiber = unsafeForkUnstarted(
                    runnable,
                    parent,
                    parent._runtimeFlags,
                    globalScope
                  );
                return (
                  parent._scheduler.scheduleTask(() => {
                    interruptImmediately &&
                      fiber.unsafeInterruptAsFork(parent.id()),
                      fiber.resume(runnable);
                  }, 0),
                  fiber
                );
              },
              onInterruptSignal = () => {
                processAll || ((target -= todos.length), (todos = [])),
                  (interrupted = !0),
                  fibers.forEach((fiber) => {
                    fiber._scheduler.scheduleTask(() => {
                      fiber.unsafeInterruptAsFork(parent.id());
                    }, 0);
                  });
              },
              stepOrExit = batching ? step : core_exit,
              processingFiber = runFiber(
                core_async((resume) => {
                  const pushResult = (res, index) => {
                      "Blocked" === res._op
                        ? residual.push(res)
                        : (results.push({ index, exit: res }),
                          "Failure" !== res._op ||
                            interrupted ||
                            onInterruptSignal());
                    },
                    next = () => {
                      if (todos.length > 0) {
                        const a = todos.pop();
                        let index = counter++;
                        const returnNextElement = () => {
                            const a = todos.pop();
                            return (
                              (index = counter++),
                              core_flatMap(yieldNow(), () =>
                                core_flatMap(
                                  stepOrExit(restore(f(a, index))),
                                  onRes
                                )
                              )
                            );
                          },
                          onRes = (res) =>
                            todos.length > 0 &&
                            (pushResult(res, index), todos.length > 0)
                              ? returnNextElement()
                              : succeed(res),
                          todo = core_flatMap(
                            stepOrExit(restore(f(a, index))),
                            onRes
                          ),
                          fiber = runFiber(todo);
                        startOrder.push(fiber),
                          fibers.add(fiber),
                          interrupted &&
                            fiber._scheduler.scheduleTask(() => {
                              fiber.unsafeInterruptAsFork(parent.id());
                            }, 0),
                          fiber.addObserver((wrapped) => {
                            let exit;
                            if (
                              ((exit =
                                "Failure" === wrapped._op
                                  ? wrapped
                                  : wrapped.effect_instruction_i0),
                              joinOrder.push(fiber),
                              fibers.delete(fiber),
                              pushResult(exit, index),
                              results.length === target)
                            )
                              resume(
                                succeed(
                                  getOrElse(
                                    exitCollectAll(collectExits(), {
                                      parallel: !0,
                                    }),
                                    () => exitVoid
                                  )
                                )
                              );
                            else if (
                              residual.length + results.length ===
                              target
                            ) {
                              const requests = residual
                                .map((blocked) => blocked.effect_instruction_i0)
                                .reduce(par);
                              resume(
                                succeed(
                                  blocked(
                                    requests,
                                    forEachConcurrentDiscard(
                                      [
                                        getOrElse(
                                          exitCollectAll(collectExits(), {
                                            parallel: !0,
                                          }),
                                          () => exitVoid
                                        ),
                                        ...residual.map(
                                          (blocked) =>
                                            blocked.effect_instruction_i1
                                        ),
                                      ],
                                      (i) => i,
                                      batching,
                                      !0,
                                      n
                                    )
                                  )
                                )
                              );
                            } else next();
                          });
                      }
                    };
                  for (let i = 0; i < fibersCount; i++) next();
                })
              );
            return core_asVoid(
              onExit(
                core_flatten(restore(fiber_join(processingFiber))),
                exitMatch({
                  onFailure: () => {
                    onInterruptSignal();
                    const target = residual.length + 1,
                      concurrency = Math.min(
                        "number" == typeof n ? n : residual.length,
                        residual.length
                      ),
                      toPop = Array.from(residual);
                    return core_async((cb) => {
                      const exits = [];
                      let count = 0,
                        index = 0;
                      const check = (index, hitNext) => (exit) => {
                          (exits[index] = exit),
                            count++,
                            count === target &&
                              cb(
                                getOrThrow(
                                  exitCollectAll(exits, { parallel: !0 })
                                )
                              ),
                            toPop.length > 0 && hitNext && next();
                        },
                        next = () => {
                          runFiber(toPop.pop(), !0).addObserver(
                            check(index, !0)
                          ),
                            index++;
                        };
                      processingFiber.addObserver(check(index, !1)), index++;
                      for (let i = 0; i < concurrency; i++) next();
                    });
                  },
                  onSuccess: () =>
                    forEachSequential(joinOrder, (f) => f.inheritAll),
                })
              )
            );
          })
        )
      ),
    forEachParN = (self, n, f, batching) =>
      suspend(() => {
        const as = Array_fromIterable(self),
          array = new Array(as.length);
        return core_zipRight(
          forEachConcurrentDiscard(
            as,
            (a, i) => core_map(f(a, i), (b) => (array[i] = b)),
            batching,
            !1,
            n
          ),
          succeed(array)
        );
      }),
    forkDaemon = (self) => forkWithScopeOverride(self, globalScope),
    unsafeFork = (
      effect,
      parentFiber,
      parentRuntimeFlags,
      overrideScope = null
    ) => {
      const childFiber = unsafeMakeChildFiber(
        effect,
        parentFiber,
        parentRuntimeFlags,
        overrideScope
      );
      return childFiber.resume(effect), childFiber;
    },
    unsafeForkUnstarted = (
      effect,
      parentFiber,
      parentRuntimeFlags,
      overrideScope = null
    ) =>
      unsafeMakeChildFiber(
        effect,
        parentFiber,
        parentRuntimeFlags,
        overrideScope
      ),
    unsafeMakeChildFiber = (
      effect,
      parentFiber,
      parentRuntimeFlags,
      overrideScope = null
    ) => {
      const childId = FiberId_unsafeMake(),
        parentFiberRefs = parentFiber.getFiberRefs(),
        childFiberRefs = forkAs(parentFiberRefs, childId),
        childFiber = new FiberRuntime(
          childId,
          childFiberRefs,
          parentRuntimeFlags
        ),
        childContext = getOrDefault(childFiberRefs, currentContext),
        supervisor = childFiber._supervisor;
      supervisor.onStart(
        childContext,
        effect,
        Option_some(parentFiber),
        childFiber
      ),
        childFiber.addObserver((exit) => supervisor.onEnd(exit, childFiber));
      return (
        (null !== overrideScope
          ? overrideScope
          : Function_pipe(
              parentFiber.getFiberRef(currentForkScopeOverride),
              getOrElse(() => parentFiber.scope())
            )
        ).add(parentRuntimeFlags, childFiber),
        childFiber
      );
    },
    forkWithScopeOverride = (self, scopeOverride) =>
      withFiberRuntime((parentFiber, parentStatus) =>
        succeed(
          unsafeFork(
            self,
            parentFiber,
            parentStatus.runtimeFlags,
            scopeOverride
          )
        )
      ),
    parallelFinalizers = (self) =>
      contextWithEffect((context) =>
        match(Context_getOption(context, scopeTag), {
          onNone: () => self,
          onSome: (scope) => {
            switch (scope.strategy._tag) {
              case "Parallel":
                return self;
              case "Sequential":
              case "ParallelN":
                return core_flatMap(
                  scopeFork(scope, ExecutionStrategy_parallel),
                  (inner) => scopeExtend(self, inner)
                );
            }
          },
        })
      ),
    parallelNFinalizers = (parallelism) => (self) =>
      contextWithEffect((context) =>
        match(Context_getOption(context, scopeTag), {
          onNone: () => self,
          onSome: (scope) =>
            "ParallelN" === scope.strategy._tag &&
            scope.strategy.parallelism === parallelism
              ? self
              : core_flatMap(
                  scopeFork(scope, ExecutionStrategy_parallelN(parallelism)),
                  (inner) => scopeExtend(self, inner)
                ),
        })
      ),
    finalizersMask = (strategy) => (self) =>
      contextWithEffect((context) =>
        match(Context_getOption(context, scopeTag), {
          onNone: () => self(Function_identity),
          onSome: (scope) => {
            const patch =
              "Parallel" === strategy._tag
                ? parallelFinalizers
                : "Sequential" === strategy._tag
                ? sequentialFinalizers
                : parallelNFinalizers(strategy.parallelism);
            switch (scope.strategy._tag) {
              case "Parallel":
                return patch(self(parallelFinalizers));
              case "Sequential":
                return patch(self(sequentialFinalizers));
              case "ParallelN":
                return patch(
                  self(parallelNFinalizers(scope.strategy.parallelism))
                );
            }
          },
        })
      ),
    sequentialFinalizers = (self) =>
      contextWithEffect((context) =>
        match(Context_getOption(context, scopeTag), {
          onNone: () => self,
          onSome: (scope) => {
            switch (scope.strategy._tag) {
              case "Sequential":
                return self;
              case "Parallel":
              case "ParallelN":
                return core_flatMap(
                  scopeFork(scope, ExecutionStrategy_sequential),
                  (inner) => scopeExtend(self, inner)
                );
            }
          },
        })
      ),
    scopeTag = GenericTag("effect/Scope"),
    scopeExtend = Function_dual(2, (effect, scope) =>
      mapInputContext(effect, Context_merge(Context_make(scopeTag, scope)))
    ),
    fiberRefUnsafeMakeSupervisor = (initial) =>
      fiberRefUnsafeMakePatch(initial, {
        differ: patch_differ,
        fork: supervisor_patch_empty,
      }),
    currentRuntimeFlags = fiberRefUnsafeMakeRuntimeFlags(runtimeFlags_none),
    currentSupervisor = fiberRefUnsafeMakeSupervisor(supervisor_none),
    invokeWithInterrupt = (self, entries, onInterrupt) =>
      fiberIdWith((id) =>
        core_flatMap(
          core_flatMap(forkDaemon(core_interruptible(self)), (processing) =>
            core_async((cb) => {
              const counts = entries.map((_) => _.listeners.count),
                checkDone = () => {
                  counts.every((count) => 0 === count) &&
                    entries.every(
                      (_) =>
                        "Pending" === _.result.state.current._tag ||
                        !(
                          "Done" !== _.result.state.current._tag ||
                          !exitIsExit(_.result.state.current.effect) ||
                          "Failure" !== _.result.state.current.effect._tag ||
                          !isInterrupted(_.result.state.current.effect.cause)
                        )
                    ) &&
                    (cleanup.forEach((f) => f()),
                    onInterrupt?.(),
                    cb(interruptFiber(processing)));
                };
              processing.addObserver((exit) => {
                cleanup.forEach((f) => f()), cb(exit);
              });
              const cleanup = entries.map((r, i) => {
                const observer = (count) => {
                  (counts[i] = count), checkDone();
                };
                return (
                  r.listeners.addObserver(observer),
                  () => r.listeners.removeObserver(observer)
                );
              });
              return (
                checkDone(),
                sync(() => {
                  cleanup.forEach((f) => f());
                })
              );
            })
          ),
          () =>
            suspend(() => {
              const residual = entries.flatMap((entry) =>
                entry.state.completed ? [] : [entry]
              );
              return forEachSequentialDiscard(residual, (entry) =>
                request_complete(entry.request, exitInterrupt(id))
              );
            })
        )
      );
  const Scope_close = scopeClose,
    Scope_fork = scopeFork,
    runtime_unsafeFork = (runtime) => (self, options) => {
      const fiberId = FiberId_unsafeMake(),
        fiberRefUpdates = [[currentContext, [[fiberId, runtime.context]]]];
      options?.scheduler &&
        fiberRefUpdates.push([
          currentScheduler,
          [[fiberId, options.scheduler]],
        ]);
      let fiberRefs = FiberRefs_updateManyAs(runtime.fiberRefs, {
        entries: fiberRefUpdates,
        forkAs: fiberId,
      });
      options?.updateRefs &&
        (fiberRefs = options.updateRefs(fiberRefs, fiberId));
      const fiberRuntime = new FiberRuntime(
        fiberId,
        fiberRefs,
        runtime.runtimeFlags
      );
      let effect = self;
      options?.scope &&
        (effect = core_flatMap(
          Scope_fork(options.scope, executionStrategy_sequential),
          (closeableScope) =>
            core_zipRight(
              scopeAddFinalizer(
                closeableScope,
                fiberIdWith((id) =>
                  equals(id, fiberRuntime.id())
                    ? core_void_
                    : interruptAsFiber(fiberRuntime, id)
                )
              ),
              onExit(self, (exit) => Scope_close(closeableScope, exit))
            )
        ));
      const supervisor = fiberRuntime._supervisor;
      return (
        supervisor !== supervisor_none &&
          (supervisor.onStart(
            runtime.context,
            effect,
            Option_none(),
            fiberRuntime
          ),
          fiberRuntime.addObserver((exit) =>
            supervisor.onEnd(exit, fiberRuntime)
          )),
        globalScope.add(runtime.runtimeFlags, fiberRuntime),
        !1 === options?.immediate
          ? fiberRuntime.resume(effect)
          : fiberRuntime.start(effect),
        fiberRuntime
      );
    },
    unsafeRunSync = (runtime) => (effect) => {
      const result = unsafeRunSyncExit(runtime)(effect);
      if ("Failure" === result._tag)
        throw fiberFailure(result.effect_instruction_i0);
      return result.effect_instruction_i0;
    };
  class AsyncFiberExceptionImpl extends Error {
    fiber;
    _tag = "AsyncFiberException";
    constructor(fiber) {
      super(
        `Fiber #${
          fiber.id().id
        } cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`
      ),
        (this.fiber = fiber),
        (this.name = this._tag),
        (this.stack = this.message);
    }
  }
  const FiberFailureId = Symbol.for("effect/Runtime/FiberFailure"),
    FiberFailureCauseId = Symbol.for("effect/Runtime/FiberFailure/Cause");
  class FiberFailureImpl extends Error {
    [FiberFailureId];
    [FiberFailureCauseId];
    constructor(cause) {
      super(),
        (this[FiberFailureId] = FiberFailureId),
        (this[FiberFailureCauseId] = cause);
      const prettyErrors = cause_prettyErrors(cause);
      if (prettyErrors.length > 0) {
        const head = prettyErrors[0];
        (this.name = head.message.split(":")[0]),
          (this.message = head.message.substring(this.name.length + 2)),
          (this.stack = pretty(cause));
      }
      this.name = `(FiberFailure) ${this.name}`;
    }
    toJSON() {
      return { _id: "FiberFailure", cause: this[FiberFailureCauseId].toJSON() };
    }
    toString() {
      return "(FiberFailure) " + pretty(this[FiberFailureCauseId]);
    }
    [NodeInspectSymbol]() {
      return this.toString();
    }
  }
  const fiberFailure = (cause) => {
      const limit = Error.stackTraceLimit;
      Error.stackTraceLimit = 0;
      const error = new FiberFailureImpl(cause);
      return (Error.stackTraceLimit = limit), error;
    },
    fastPath = (effect) => {
      const op = effect;
      switch (op._op) {
        case "Failure":
        case "Success":
          return op;
        case "Left":
          return exitFail(op.left);
        case "Right":
          return exitSucceed(op.right);
        case "Some":
          return exitSucceed(op.value);
        case "None":
          return exitFail(NoSuchElementException());
      }
    },
    unsafeRunSyncExit = (runtime) => (effect) => {
      const op = fastPath(effect);
      if (op) return op;
      const scheduler = new SyncScheduler(),
        fiberRuntime = runtime_unsafeFork(runtime)(effect, { scheduler });
      scheduler.flush();
      const result = fiberRuntime.unsafePoll();
      if (result) return result;
      throw ((fiber) => {
        const limit = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        const error = new AsyncFiberExceptionImpl(fiber);
        return (Error.stackTraceLimit = limit), error;
      })(fiberRuntime);
    };
  class RuntimeImpl {
    context;
    runtimeFlags;
    fiberRefs;
    constructor(context, runtimeFlags, fiberRefs) {
      (this.context = context),
        (this.runtimeFlags = runtimeFlags),
        (this.fiberRefs = fiberRefs);
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const runtime_make = (options) =>
      new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs),
    defaultRuntimeFlags = runtimeFlags_make(1, 32, 4),
    defaultRuntime = runtime_make({
      context: Context_empty(),
      runtimeFlags: defaultRuntimeFlags,
      fiberRefs: FiberRefs_empty(),
    }),
    unsafeRunSyncEffect = unsafeRunSync(defaultRuntime);
  const MutableList_TypeId = Symbol.for("effect/MutableList"),
    MutableQueue_TypeId =
      (Symbol.iterator, NodeInspectSymbol, Symbol.for("effect/MutableQueue"));
  Symbol.iterator;
  const Effect_forEach = fiberRuntime_forEach,
    Effect_succeed = succeed,
    Effect_suspend = suspend,
    _void = core_void_,
    Effect_catchAll = catchAll,
    Effect_map = core_map,
    Effect_mapError = mapError,
    Effect_either = core_either,
    Effect_flatMap = core_flatMap,
    Effect_matchEffect = matchEffect,
    Effect_orElse = core_orElse,
    runSync = unsafeRunSyncEffect,
    TreeFormatter_make = (value, forest = []) => ({ value, forest }),
    formatIssue = (issue) =>
      Effect_map(TreeFormatter_go(issue), (tree) => drawTree(tree)),
    formatIssueSync = (issue) => runSync(formatIssue(issue)),
    drawTree = (tree) => tree.value + draw("\n", tree.forest),
    draw = (indentation, forest) => {
      let r = "";
      const len = forest.length;
      let tree;
      for (let i = 0; i < len; i++) {
        tree = forest[i];
        const isLast = i === len - 1;
        (r += indentation + (isLast ? "└" : "├") + "─ " + tree.value),
          (r += draw(
            indentation + (len > 1 && !isLast ? "│  " : "   "),
            tree.forest
          ));
      }
      return r;
    },
    formatTransformationKind = (kind) => {
      switch (kind) {
        case "Encoded":
          return "Encoded side transformation failure";
        case "Transformation":
          return "Transformation process failure";
        case "Type":
          return "Type side transformation failure";
      }
    },
    formatRefinementKind = (kind) => {
      switch (kind) {
        case "From":
          return "From side refinement failure";
        case "Predicate":
          return "Predicate refinement failure";
      }
    },
    getMessage = (issue) =>
      Effect_catchAll(
        ((issue) => {
          switch (issue._tag) {
            case "Refinement":
              if ("From" === issue.kind) return getMessage(issue.error);
              break;
            case "Transformation":
              return getMessage(issue.error);
          }
          return Option_none();
        })(issue),
        () =>
          ((issue) =>
            getMessageAnnotation(issue.ast).pipe(
              Effect_flatMap((annotation) => {
                const out = annotation(issue);
                return isString(out) ? Effect_succeed(out) : out;
              })
            ))(issue)
      ),
    TreeFormatter_getParseIssueTitleAnnotation = (issue) =>
      filterMap(getParseIssueTitleAnnotation(issue.ast), (annotation) =>
        fromNullable(annotation(issue))
      ),
    getParseIssueTitle = (issue) =>
      getOrElse(TreeFormatter_getParseIssueTitleAnnotation(issue), () =>
        String(issue.ast)
      ),
    formatForbiddenMessage = (e) => getOrElse(e.message, () => "is forbidden"),
    getTree = (issue, onFailure) =>
      Effect_matchEffect(getMessage(issue), {
        onFailure,
        onSuccess: (message) => Effect_succeed(TreeFormatter_make(message)),
      }),
    TreeFormatter_go = (e) => {
      switch (e._tag) {
        case "Type":
          return Effect_map(
            ((e) =>
              getMessage(e).pipe(
                Effect_orElse(() =>
                  TreeFormatter_getParseIssueTitleAnnotation(e)
                ),
                Effect_orElse(() => e.message),
                Effect_catchAll(() =>
                  Effect_succeed(
                    `Expected ${e.ast.toString(!0)}, actual ${formatUnknown(
                      e.actual
                    )}`
                  )
                )
              ))(e),
            TreeFormatter_make
          );
        case "Forbidden":
          return Effect_succeed(
            TreeFormatter_make(getParseIssueTitle(e), [
              TreeFormatter_make(formatForbiddenMessage(e)),
            ])
          );
        case "Unexpected":
          return Effect_succeed(
            TreeFormatter_make(`is unexpected, expected ${e.ast.toString(!0)}`)
          );
        case "Missing":
          return Effect_succeed(TreeFormatter_make("is missing"));
        case "Union":
          return getTree(e, () =>
            Effect_map(
              Effect_forEach(e.errors, (e) =>
                "Member" === e._tag
                  ? Effect_map(TreeFormatter_go(e.error), (tree) =>
                      TreeFormatter_make("Union member", [tree])
                    )
                  : TreeFormatter_go(e)
              ),
              (forest) => TreeFormatter_make(getParseIssueTitle(e), forest)
            )
          );
        case "TupleType":
          return getTree(e, () =>
            Effect_map(
              Effect_forEach(e.errors, (index) =>
                Effect_map(TreeFormatter_go(index.error), (tree) =>
                  TreeFormatter_make(`[${index.index}]`, [tree])
                )
              ),
              (forest) => TreeFormatter_make(getParseIssueTitle(e), forest)
            )
          );
        case "TypeLiteral":
          return getTree(e, () =>
            Effect_map(
              Effect_forEach(e.errors, (key) =>
                Effect_map(TreeFormatter_go(key.error), (tree) =>
                  TreeFormatter_make(`[${formatUnknown(key.key)}]`, [tree])
                )
              ),
              (forest) => TreeFormatter_make(getParseIssueTitle(e), forest)
            )
          );
        case "Transformation":
          return getTree(e, () =>
            Effect_map(TreeFormatter_go(e.error), (tree) =>
              TreeFormatter_make(getParseIssueTitle(e), [
                TreeFormatter_make(formatTransformationKind(e.kind), [tree]),
              ])
            )
          );
        case "Refinement":
          return getTree(e, () =>
            Effect_map(TreeFormatter_go(e.error), (tree) =>
              TreeFormatter_make(getParseIssueTitle(e), [
                TreeFormatter_make(formatRefinementKind(e.kind), [tree]),
              ])
            )
          );
        case "Declaration":
          return getTree(e, () => {
            const error = e.error;
            return "Type" === error._tag && error.ast === e.ast
              ? TreeFormatter_go(error)
              : Effect_map(TreeFormatter_go(error), (tree) =>
                  TreeFormatter_make(getParseIssueTitle(e), [tree])
                );
          });
      }
    };
  class ParseResult_Declaration {
    ast;
    actual;
    error;
    _tag = "Declaration";
    constructor(ast, actual, error) {
      (this.ast = ast), (this.actual = actual), (this.error = error);
    }
  }
  class ParseResult_Refinement {
    ast;
    actual;
    kind;
    error;
    _tag = "Refinement";
    constructor(ast, actual, kind, error) {
      (this.ast = ast),
        (this.actual = actual),
        (this.kind = kind),
        (this.error = error);
    }
  }
  class ParseResult_TupleType {
    ast;
    actual;
    errors;
    output;
    _tag = "TupleType";
    constructor(ast, actual, errors, output = []) {
      (this.ast = ast),
        (this.actual = actual),
        (this.errors = errors),
        (this.output = output);
    }
  }
  class Index {
    index;
    error;
    _tag = "Index";
    constructor(index, error) {
      (this.index = index), (this.error = error);
    }
  }
  class ParseResult_TypeLiteral {
    ast;
    actual;
    errors;
    output;
    _tag = "TypeLiteral";
    constructor(ast, actual, errors, output = {}) {
      (this.ast = ast),
        (this.actual = actual),
        (this.errors = errors),
        (this.output = output);
    }
  }
  class ParseResult_Key {
    key;
    error;
    _tag = "Key";
    constructor(key, error) {
      (this.key = key), (this.error = error);
    }
  }
  class Unexpected {
    ast;
    _tag = "Unexpected";
    constructor(ast) {
      this.ast = ast;
    }
  }
  class ParseResult_Transformation {
    ast;
    actual;
    kind;
    error;
    _tag = "Transformation";
    constructor(ast, actual, kind, error) {
      (this.ast = ast),
        (this.actual = actual),
        (this.kind = kind),
        (this.error = error);
    }
  }
  class Type {
    ast;
    actual;
    _tag = "Type";
    message;
    constructor(ast, actual, message) {
      (this.ast = ast),
        (this.actual = actual),
        (this.message = fromNullable(message));
    }
  }
  class Forbidden {
    ast;
    actual;
    _tag = "Forbidden";
    message;
    constructor(ast, actual, message) {
      (this.ast = ast),
        (this.actual = actual),
        (this.message = fromNullable(message));
    }
  }
  class Missing {
    _tag = "Missing";
  }
  const missing = new Missing();
  class Member {
    ast;
    error;
    _tag = "Member";
    constructor(ast, error) {
      (this.ast = ast), (this.error = error);
    }
  }
  class ParseResult_Union {
    ast;
    actual;
    errors;
    _tag = "Union";
    constructor(ast, actual, errors) {
      (this.ast = ast), (this.actual = actual), (this.errors = errors);
    }
  }
  class ParseError extends ((tag) => {
    class Base extends Data_Error {
      _tag = tag;
    }
    return (Base.prototype.name = tag), Base;
  })("ParseError") {
    get message() {
      return this.toString();
    }
    toString() {
      return formatIssueSync(this.error);
    }
    toJSON() {
      return { _id: "ParseError", message: this.toString() };
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  const parseError = (issue) => new ParseError({ error: issue }),
    ParseResult_flatMap = Function_dual(2, (self, f) => {
      const s = self;
      return "Left" === s._tag
        ? s
        : "Right" === s._tag
        ? f(s.right)
        : Effect_flatMap(self, f);
    }),
    ParseResult_map = Function_dual(2, (self, f) => {
      const s = self;
      return "Left" === s._tag
        ? s
        : "Right" === s._tag
        ? Either_right(f(s.right))
        : Effect_map(self, f);
    }),
    ParseResult_mapError = Function_dual(2, (self, f) => {
      const s = self;
      return "Left" === s._tag
        ? Either_left(f(s.left))
        : "Right" === s._tag
        ? s
        : Effect_mapError(self, f);
    }),
    eitherOrUndefined = (self) => {
      const s = self;
      if ("Left" === s._tag || "Right" === s._tag) return s;
    },
    mergeParseOptions = (a, b) => {
      if (void 0 === a) return b;
      if (void 0 === b) return a;
      const out = {};
      return (
        (out.errors = b.errors ?? a.errors),
        (out.onExcessProperty = b.onExcessProperty ?? a.onExcessProperty),
        out
      );
    },
    getEither = (ast, isDecoding, options) => {
      const parser = goMemo(ast, isDecoding);
      return (u, overrideOptions) =>
        parser(u, mergeParseOptions(options, overrideOptions));
    },
    ParseResult_decodeUnknownEither = (schema, options) =>
      getEither(schema.ast, !0, options),
    decodeMemoMap = GlobalValue_globalValue(
      Symbol.for("@effect/schema/Parser/decodeMemoMap"),
      () => new WeakMap()
    ),
    encodeMemoMap = GlobalValue_globalValue(
      Symbol.for("@effect/schema/Parser/encodeMemoMap"),
      () => new WeakMap()
    ),
    goMemo = (ast, isDecoding) => {
      const memoMap = isDecoding ? decodeMemoMap : encodeMemoMap,
        memo = memoMap.get(ast);
      if (memo) return memo;
      const parser = ParseResult_go(ast, isDecoding);
      return memoMap.set(ast, parser), parser;
    },
    getConcurrency = (ast) => getOrUndefined(getConcurrencyAnnotation(ast)),
    getBatching = (ast) => getOrUndefined(getBatchingAnnotation(ast)),
    ParseResult_go = (ast, isDecoding) => {
      switch (ast._tag) {
        case "Refinement":
          if (isDecoding) {
            const from = goMemo(ast.from, !0);
            return (i, options) =>
              handleForbidden(
                ParseResult_flatMap(
                  ParseResult_mapError(
                    from(i, options),
                    (e) => new ParseResult_Refinement(ast, i, "From", e)
                  ),
                  (a) =>
                    match(ast.filter(a, options ?? defaultParseOption, ast), {
                      onNone: () => Either_right(a),
                      onSome: (e) =>
                        Either_left(
                          new ParseResult_Refinement(ast, i, "Predicate", e)
                        ),
                    })
                ),
                ast,
                i,
                options
              );
          }
          {
            const from = goMemo(typeAST(ast), !0),
              to = goMemo(dropRightRefinement(ast.from), !1);
            return (i, options) =>
              handleForbidden(
                ParseResult_flatMap(from(i, options), (a) => to(a, options)),
                ast,
                i,
                options
              );
          }
        case "Transformation": {
          const transform = getFinalTransformation(
              ast.transformation,
              isDecoding
            ),
            from = isDecoding ? goMemo(ast.from, !0) : goMemo(ast.to, !1),
            to = isDecoding ? goMemo(ast.to, !0) : goMemo(ast.from, !1);
          return (i1, options) =>
            handleForbidden(
              ParseResult_flatMap(
                ParseResult_mapError(
                  from(i1, options),
                  (e) =>
                    new ParseResult_Transformation(
                      ast,
                      i1,
                      isDecoding ? "Encoded" : "Type",
                      e
                    )
                ),
                (a) =>
                  ParseResult_flatMap(
                    ParseResult_mapError(
                      transform(a, options ?? defaultParseOption, ast),
                      (e) =>
                        new ParseResult_Transformation(
                          ast,
                          i1,
                          "Transformation",
                          e
                        )
                    ),
                    (i2) =>
                      ParseResult_mapError(
                        to(i2, options),
                        (e) =>
                          new ParseResult_Transformation(
                            ast,
                            i1,
                            isDecoding ? "Type" : "Encoded",
                            e
                          )
                      )
                  )
              ),
              ast,
              i1,
              options
            );
        }
        case "Declaration": {
          const parse = isDecoding
            ? ast.decodeUnknown(...ast.typeParameters)
            : ast.encodeUnknown(...ast.typeParameters);
          return (i, options) =>
            handleForbidden(
              ParseResult_mapError(
                parse(i, options ?? defaultParseOption, ast),
                (e) => new ParseResult_Declaration(ast, i, e)
              ),
              ast,
              i,
              options
            );
        }
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
          return Either_right;
        case "StringKeyword":
          return fromRefinement(ast, isString);
        case "NumberKeyword":
          return fromRefinement(ast, isNumber);
        case "BooleanKeyword":
          return fromRefinement(ast, Predicate_isBoolean);
        case "BigIntKeyword":
          return fromRefinement(ast, isBigInt);
        case "SymbolKeyword":
          return fromRefinement(ast, isSymbol);
        case "ObjectKeyword":
          return fromRefinement(ast, Predicate_isObject);
        case "Enums":
          return fromRefinement(ast, (u) =>
            ast.enums.some(([_, value]) => value === u)
          );
        case "TemplateLiteral": {
          const regex = getTemplateLiteralRegExp(ast);
          return fromRefinement(ast, (u) => isString(u) && regex.test(u));
        }
        case "TupleType": {
          const elements = ast.elements.map((e) => goMemo(e.type, isDecoding)),
            rest = ast.rest.map((ast) => goMemo(ast, isDecoding));
          let requiredLen = ast.elements.filter((e) => !e.isOptional).length;
          ast.rest.length > 0 && (requiredLen += ast.rest.length - 1);
          const expectedAST = Union.make(
              ast.elements.map((_, i) => new Literal(i))
            ),
            concurrency = getConcurrency(ast),
            batching = getBatching(ast);
          return (input, options) => {
            if (!isArray(input)) return Either_left(new Type(ast, input));
            const allErrors = "all" === options?.errors,
              es = [];
            let stepKey = 0;
            const len = input.length;
            for (let i = len; i <= requiredLen - 1; i++) {
              const e = new Index(i, missing);
              if (!allErrors)
                return Either_left(new ParseResult_TupleType(ast, input, [e]));
              es.push([stepKey++, e]);
            }
            if (0 === ast.rest.length)
              for (let i = ast.elements.length; i <= len - 1; i++) {
                const e = new Index(i, new Unexpected(expectedAST));
                if (!allErrors)
                  return Either_left(
                    new ParseResult_TupleType(ast, input, [e])
                  );
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
                  eu = eitherOrUndefined(te);
                if (eu) {
                  if (Either_isLeft(eu)) {
                    const e = new Index(i, eu.left);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return Either_left(
                      new ParseResult_TupleType(
                        ast,
                        input,
                        [e],
                        sortByIndex(output)
                      )
                    );
                  }
                  output.push([stepKey++, eu.right]);
                } else {
                  const nk = stepKey++,
                    index = i;
                  queue || (queue = []),
                    queue.push(({ es, output }) =>
                      Effect_flatMap(Effect_either(te), (t) => {
                        if (Either_isLeft(t)) {
                          const e = new Index(index, t.left);
                          return allErrors
                            ? (es.push([nk, e]), _void)
                            : Either_left(
                                new ParseResult_TupleType(
                                  ast,
                                  input,
                                  [e],
                                  sortByIndex(output)
                                )
                              );
                        }
                        return output.push([nk, t.right]), _void;
                      })
                    );
                }
              }
            if (isNonEmptyReadonlyArray(rest)) {
              const [head, ...tail] = rest;
              for (; i < len - tail.length; i++) {
                const te = head(input[i], options),
                  eu = eitherOrUndefined(te);
                if (eu) {
                  if (Either_isLeft(eu)) {
                    const e = new Index(i, eu.left);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return Either_left(
                      new ParseResult_TupleType(
                        ast,
                        input,
                        [e],
                        sortByIndex(output)
                      )
                    );
                  }
                  output.push([stepKey++, eu.right]);
                } else {
                  const nk = stepKey++,
                    index = i;
                  queue || (queue = []),
                    queue.push(({ es, output }) =>
                      Effect_flatMap(Effect_either(te), (t) => {
                        if (Either_isLeft(t)) {
                          const e = new Index(index, t.left);
                          return allErrors
                            ? (es.push([nk, e]), _void)
                            : Either_left(
                                new ParseResult_TupleType(
                                  ast,
                                  input,
                                  [e],
                                  sortByIndex(output)
                                )
                              );
                        }
                        return output.push([nk, t.right]), _void;
                      })
                    );
                }
              }
              for (let j = 0; j < tail.length; j++)
                if (((i += j), !(len < i + 1))) {
                  const te = tail[j](input[i], options),
                    eu = eitherOrUndefined(te);
                  if (eu) {
                    if (Either_isLeft(eu)) {
                      const e = new Index(i, eu.left);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return Either_left(
                        new ParseResult_TupleType(
                          ast,
                          input,
                          [e],
                          sortByIndex(output)
                        )
                      );
                    }
                    output.push([stepKey++, eu.right]);
                  } else {
                    const nk = stepKey++,
                      index = i;
                    queue || (queue = []),
                      queue.push(({ es, output }) =>
                        Effect_flatMap(Effect_either(te), (t) => {
                          if (Either_isLeft(t)) {
                            const e = new Index(index, t.left);
                            return allErrors
                              ? (es.push([nk, e]), _void)
                              : Either_left(
                                  new ParseResult_TupleType(
                                    ast,
                                    input,
                                    [e],
                                    sortByIndex(output)
                                  )
                                );
                          }
                          return output.push([nk, t.right]), _void;
                        })
                      );
                  }
                }
            }
            const computeResult = ({ es, output }) =>
              Array_isNonEmptyArray(es)
                ? Either_left(
                    new ParseResult_TupleType(
                      ast,
                      input,
                      sortByIndex(es),
                      sortByIndex(output)
                    )
                  )
                : Either_right(sortByIndex(output));
            if (queue && queue.length > 0) {
              const cqueue = queue;
              return Effect_suspend(() => {
                const state = { es: copy(es), output: copy(output) };
                return Effect_flatMap(
                  Effect_forEach(cqueue, (f) => f(state), {
                    concurrency,
                    batching,
                    discard: !0,
                  }),
                  () => computeResult(state)
                );
              });
            }
            return computeResult({ output, es });
          };
        }
        case "TypeLiteral": {
          if (
            0 === ast.propertySignatures.length &&
            0 === ast.indexSignatures.length
          )
            return fromRefinement(ast, isNotNullable);
          const propertySignatures = [],
            expectedKeys = {};
          for (const ps of ast.propertySignatures)
            propertySignatures.push([goMemo(ps.type, isDecoding), ps]),
              (expectedKeys[ps.name] = null);
          const indexSignatures = ast.indexSignatures.map((is) => [
              goMemo(is.parameter, isDecoding),
              goMemo(is.type, isDecoding),
              is.parameter,
            ]),
            expectedAST = Union.make(
              ast.indexSignatures
                .map((is) => is.parameter)
                .concat(
                  util_ownKeys(expectedKeys).map((key) =>
                    isSymbol(key) ? new UniqueSymbol(key) : new Literal(key)
                  )
                )
            ),
            expected = goMemo(expectedAST, isDecoding),
            concurrency = getConcurrency(ast),
            batching = getBatching(ast);
          return (input, options) => {
            if (!isRecord(input)) return Either_left(new Type(ast, input));
            const allErrors = "all" === options?.errors,
              es = [];
            let stepKey = 0;
            const onExcessPropertyError = "error" === options?.onExcessProperty,
              output = {};
            if (
              onExcessPropertyError ||
              "preserve" === options?.onExcessProperty
            )
              for (const key of util_ownKeys(input)) {
                const eu = eitherOrUndefined(expected(key, options));
                if (Either_isLeft(eu)) {
                  if (onExcessPropertyError) {
                    const e = new ParseResult_Key(
                      key,
                      new Unexpected(expectedAST)
                    );
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return Either_left(
                      new ParseResult_TypeLiteral(ast, input, [e], output)
                    );
                  }
                  output[key] = input[key];
                }
              }
            let queue;
            const isExact = !0 === options?.isExact;
            for (let i = 0; i < propertySignatures.length; i++) {
              const ps = propertySignatures[i][1],
                name = ps.name,
                hasKey = Object.prototype.hasOwnProperty.call(input, name);
              if (!hasKey) {
                if (ps.isOptional) continue;
                if (isExact) {
                  const e = new ParseResult_Key(name, missing);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  }
                  return Either_left(
                    new ParseResult_TypeLiteral(ast, input, [e], output)
                  );
                }
              }
              const te = (0, propertySignatures[i][0])(input[name], options),
                eu = eitherOrUndefined(te);
              if (eu) {
                if (Either_isLeft(eu)) {
                  const e = new ParseResult_Key(
                    name,
                    hasKey ? eu.left : missing
                  );
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  }
                  return Either_left(
                    new ParseResult_TypeLiteral(ast, input, [e], output)
                  );
                }
                output[name] = eu.right;
              } else {
                const nk = stepKey++,
                  index = name;
                queue || (queue = []),
                  queue.push(({ es, output }) =>
                    Effect_flatMap(Effect_either(te), (t) => {
                      if (Either_isLeft(t)) {
                        const e = new ParseResult_Key(
                          index,
                          hasKey ? t.left : missing
                        );
                        return allErrors
                          ? (es.push([nk, e]), _void)
                          : Either_left(
                              new ParseResult_TypeLiteral(
                                ast,
                                input,
                                [e],
                                output
                              )
                            );
                      }
                      return (output[index] = t.right), _void;
                    })
                  );
              }
            }
            for (let i = 0; i < indexSignatures.length; i++) {
              const indexSignature = indexSignatures[i],
                parameter = indexSignature[0],
                type = indexSignature[1],
                keys = getKeysForIndexSignature(input, indexSignature[2]);
              for (const key of keys) {
                const keu = eitherOrUndefined(parameter(key, options));
                if (keu && Either_isRight(keu)) {
                  const vpr = type(input[key], options),
                    veu = eitherOrUndefined(vpr);
                  if (veu) {
                    if (Either_isLeft(veu)) {
                      const e = new ParseResult_Key(key, veu.left);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return Either_left(
                        new ParseResult_TypeLiteral(ast, input, [e], output)
                      );
                    }
                    Object.prototype.hasOwnProperty.call(expectedKeys, key) ||
                      (output[key] = veu.right);
                  } else {
                    const nk = stepKey++,
                      index = key;
                    queue || (queue = []),
                      queue.push(({ es, output }) =>
                        Effect_flatMap(Effect_either(vpr), (tv) => {
                          if (Either_isLeft(tv)) {
                            const e = new ParseResult_Key(index, tv.left);
                            return allErrors
                              ? (es.push([nk, e]), _void)
                              : Either_left(
                                  new ParseResult_TypeLiteral(
                                    ast,
                                    input,
                                    [e],
                                    output
                                  )
                                );
                          }
                          return (
                            Object.prototype.hasOwnProperty.call(
                              expectedKeys,
                              key
                            ) || (output[key] = tv.right),
                            _void
                          );
                        })
                      );
                  }
                }
              }
            }
            const computeResult = ({ es, output }) =>
              Array_isNonEmptyArray(es)
                ? Either_left(
                    new ParseResult_TypeLiteral(
                      ast,
                      input,
                      sortByIndex(es),
                      output
                    )
                  )
                : Either_right(output);
            if (queue && queue.length > 0) {
              const cqueue = queue;
              return Effect_suspend(() => {
                const state = {
                  es: copy(es),
                  output: Object.assign({}, output),
                };
                return Effect_flatMap(
                  Effect_forEach(cqueue, (f) => f(state), {
                    concurrency,
                    batching,
                    discard: !0,
                  }),
                  () => computeResult(state)
                );
              });
            }
            return computeResult({ es, output });
          };
        }
        case "Union": {
          const searchTree = getSearchTree(ast.types, isDecoding),
            ownKeys = util_ownKeys(searchTree.keys),
            len = ownKeys.length,
            map = new Map();
          for (let i = 0; i < ast.types.length; i++)
            map.set(ast.types[i], goMemo(ast.types[i], isDecoding));
          const concurrency = getConcurrency(ast) ?? 1,
            batching = getBatching(ast);
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
                    if (Object.prototype.hasOwnProperty.call(buckets, literal))
                      candidates = candidates.concat(buckets[literal]);
                    else {
                      const literals = Union.make(
                        searchTree.keys[name].literals
                      );
                      es.push([
                        stepKey++,
                        new ParseResult_TypeLiteral(
                          new TypeLiteral(
                            [new PropertySignature(name, literals, !1, !0)],
                            []
                          ),
                          input,
                          [
                            new ParseResult_Key(
                              name,
                              new Type(literals, input[name])
                            ),
                          ]
                        ),
                      ]);
                    }
                  } else {
                    const literals = Union.make(searchTree.keys[name].literals);
                    es.push([
                      stepKey++,
                      new ParseResult_TypeLiteral(
                        new TypeLiteral(
                          [new PropertySignature(name, literals, !1, !0)],
                          []
                        ),
                        input,
                        [new ParseResult_Key(name, missing)]
                      ),
                    ]);
                  }
                }
              else es.push([stepKey++, new Type(ast, input)]);
            searchTree.otherwise.length > 0 &&
              (candidates = candidates.concat(searchTree.otherwise));
            for (let i = 0; i < candidates.length; i++) {
              const candidate = candidates[i],
                pr = map.get(candidate)(input, options),
                eu =
                  queue && 0 !== queue.length ? void 0 : eitherOrUndefined(pr);
              if (eu) {
                if (Either_isRight(eu)) return Either_right(eu.right);
                es.push([stepKey++, new Member(candidate, eu.left)]);
              } else {
                const nk = stepKey++;
                queue || (queue = []),
                  queue.push((state) =>
                    Effect_suspend(() =>
                      "finalResult" in state
                        ? _void
                        : Effect_flatMap(
                            Effect_either(pr),
                            (t) => (
                              Either_isRight(t)
                                ? (state.finalResult = Either_right(t.right))
                                : state.es.push([
                                    nk,
                                    new Member(candidate, t.left),
                                  ]),
                              _void
                            )
                          )
                    )
                  );
              }
            }
            const computeResult = (es) =>
              Array_isNonEmptyArray(es)
                ? 1 === es.length && "Type" === es[0][1]._tag
                  ? Either_left(es[0][1])
                  : Either_left(
                      new ParseResult_Union(ast, input, sortByIndex(es))
                    )
                : Either_left(new Type(neverKeyword, input));
            if (queue && queue.length > 0) {
              const cqueue = queue;
              return Effect_suspend(() => {
                const state = { es: copy(es) };
                return Effect_flatMap(
                  Effect_forEach(cqueue, (f) => f(state), {
                    concurrency,
                    batching,
                    discard: !0,
                  }),
                  () =>
                    "finalResult" in state
                      ? state.finalResult
                      : computeResult(state.es)
                );
              });
            }
            return computeResult(es);
          };
        }
        case "Suspend": {
          const get = memoizeThunk(() =>
            goMemo(AST_annotations(ast.f(), ast.annotations), isDecoding)
          );
          return (a, options) => get()(a, options);
        }
      }
    },
    fromRefinement = (ast, refinement) => (u) =>
      refinement(u) ? Either_right(u) : Either_left(new Type(ast, u)),
    getLiterals = (ast, isDecoding) => {
      switch (ast._tag) {
        case "Declaration": {
          const annotation = getSurrogateAnnotation(ast);
          if (Option_isSome(annotation))
            return getLiterals(annotation.value, isDecoding);
          break;
        }
        case "TypeLiteral": {
          const out = [];
          for (let i = 0; i < ast.propertySignatures.length; i++) {
            const propertySignature = ast.propertySignatures[i],
              type = isDecoding
                ? encodedAST(propertySignature.type)
                : typeAST(propertySignature.type);
            isLiteral(type) &&
              !propertySignature.isOptional &&
              out.push([propertySignature.name, type]);
          }
          return out;
        }
        case "Refinement":
          return getLiterals(ast.from, isDecoding);
        case "Suspend":
          return getLiterals(ast.f(), isDecoding);
        case "Transformation":
          return getLiterals(isDecoding ? ast.from : ast.to, isDecoding);
      }
      return [];
    },
    getSearchTree = (members, isDecoding) => {
      const keys = {},
        otherwise = [];
      for (let i = 0; i < members.length; i++) {
        const member = members[i],
          tags = getLiterals(member, isDecoding);
        if (tags.length > 0)
          for (let j = 0; j < tags.length; j++) {
            const [key, literal] = tags[j],
              hash = String(literal.literal);
            keys[key] = keys[key] || { buckets: {}, literals: [] };
            const buckets = keys[key].buckets;
            if (!Object.prototype.hasOwnProperty.call(buckets, hash)) {
              (buckets[hash] = [member]), keys[key].literals.push(literal);
              break;
            }
            j < tags.length - 1 ||
              (buckets[hash].push(member), keys[key].literals.push(literal));
          }
        else otherwise.push(member);
      }
      return { keys, otherwise };
    },
    dropRightRefinement = (ast) =>
      isRefinement(ast) ? dropRightRefinement(ast.from) : ast,
    handleForbidden = (effect, ast, actual, options) => {
      const eu = eitherOrUndefined(effect);
      if (eu) return eu;
      if (!0 === options?.isEffectAllowed) return effect;
      try {
        return runSync(Effect_either(effect));
      } catch (e) {
        return Either_left(
          new Forbidden(
            ast,
            actual,
            "cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work"
          )
        );
      }
    };
  function sortByIndex(es) {
    return es
      .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
      .map(([_, a]) => a);
  }
  const getFinalTransformation = (transformation, isDecoding) => {
      switch (transformation._tag) {
        case "FinalTransformation":
          return isDecoding ? transformation.decode : transformation.encode;
        case "ComposeTransformation":
          return Either_right;
        case "TypeLiteralTransformation":
          return (input) => {
            let out = Either_right(input);
            for (const pst of transformation.propertySignatureTransformations) {
              const [from, to] = isDecoding
                  ? [pst.from, pst.to]
                  : [pst.to, pst.from],
                transformation = isDecoding ? pst.decode : pst.encode,
                f = (input) => {
                  const o = transformation(
                    Object.prototype.hasOwnProperty.call(input, from)
                      ? Option_some(input[from])
                      : Option_none()
                  );
                  return (
                    delete input[from],
                    Option_isSome(o) && (input[to] = o.value),
                    input
                  );
                };
              out = ParseResult_map(out, f);
            }
            return out;
          };
      }
    },
    PrettyHookId = Symbol.for("@effect/schema/PrettyHookId"),
    Schema_TypeId = Symbol.for("@effect/schema/Schema"),
    Schema_variance = { _A: (_) => _, _I: (_) => _, _R: (_) => _ },
    toASTAnnotations = (annotations) => {
      if (!annotations) return {};
      const out = {},
        custom = Object.getOwnPropertySymbols(annotations);
      for (const sym of custom) out[sym] = annotations[sym];
      if (void 0 !== annotations.typeId) {
        const typeId = annotations.typeId;
        "object" == typeof typeId
          ? ((out[TypeAnnotationId] = typeId.id),
            (out[typeId.id] = typeId.annotation))
          : (out[TypeAnnotationId] = typeId);
      }
      const move = (from, to) => {
        void 0 !== annotations[from] && (out[to] = annotations[from]);
      };
      return (
        move("message", MessageAnnotationId),
        move("identifier", IdentifierAnnotationId),
        move("title", TitleAnnotationId),
        move("description", DescriptionAnnotationId),
        move("examples", ExamplesAnnotationId),
        move("default", DefaultAnnotationId),
        move("documentation", DocumentationAnnotationId),
        move("jsonSchema", JSONSchemaAnnotationId),
        move("arbitrary", ArbitraryHookId),
        move("pretty", PrettyHookId),
        move("equivalence", EquivalenceHookId),
        move("concurrency", ConcurrencyAnnotationId),
        move("batching", BatchingAnnotationId),
        move("parseIssueTitle", ParseIssueTitleAnnotationId),
        out
      );
    };
  class SchemaImpl {
    ast;
    [Schema_TypeId] = Schema_variance;
    constructor(ast) {
      this.ast = ast;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
    annotations(annotations) {
      return new SchemaImpl(
        AST_annotations(this.ast, toASTAnnotations(annotations))
      );
    }
    toString() {
      return String(this.ast);
    }
  }
  const decodeUnknownEither = (schema, options) => {
      const decodeUnknownEither = ParseResult_decodeUnknownEither(
        schema,
        options
      );
      return (u, overrideOptions) =>
        mapLeft(decodeUnknownEither(u, overrideOptions), parseError);
    },
    Schema_make = (ast) => new SchemaImpl(ast);
  const $String = Schema_make(stringKeyword);
  decodeUnknownEither($String)("");
})();
