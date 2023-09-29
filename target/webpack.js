(() => {
  "use strict";
  const isFunction = (input) => "function" == typeof input,
    dual = function (arity, body) {
      if ("function" == typeof arity)
        return function () {
          return arity(arguments)
            ? body.apply(this, arguments)
            : (self) => body(self, ...arguments);
        };
      switch (arity) {
        case 0:
          return body;
        case 1:
          return function (a) {
            return arguments.length >= 1
              ? body(a)
              : function () {
                  return body(a);
                };
          };
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
    identity = (a) => a,
    constant = (value) => () => value,
    constTrue = constant(!0),
    constFalse = constant(!1),
    constNull = constant(null),
    constUndefined = constant(void 0);
  function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
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
  const make = (isEquivalent) => (self, that) =>
      self === that || isEquivalent(self, that),
    mapInput = dual(2, (self, f) => make((x, y) => self(f(x), f(y)))),
    array = (item) =>
      make((self, that) => {
        if (self.length !== that.length) return !1;
        for (let i = 0; i < self.length; i++) {
          if (!item(self[i], that[i])) return !1;
        }
        return !0;
      });
  const Order_2f11aa24_esm_make = (compare) => (self, that) =>
      self === that ? 0 : compare(self, that),
    Order_2f11aa24_esm_number = Order_2f11aa24_esm_make((self, that) =>
      self < that ? -1 : 1
    ),
    Order_2f11aa24_esm_combineMany = dual(2, (self, collection) =>
      Order_2f11aa24_esm_make((a1, a2) => {
        let out = self(a1, a2);
        if (0 !== out) return out;
        for (const O of collection)
          if (((out = O(a1, a2)), 0 !== out)) return out;
        return out;
      })
    ),
    empty = () => Order_2f11aa24_esm_make(() => 0),
    Order_2f11aa24_esm_combineAll = (collection) =>
      Order_2f11aa24_esm_combineMany(empty(), collection),
    Order_2f11aa24_esm_mapInput = dual(2, (self, f) =>
      Order_2f11aa24_esm_make((b1, b2) => self(f(b1), f(b2)))
    ),
    Order_2f11aa24_esm_array = (O) =>
      Order_2f11aa24_esm_make((self, that) => {
        const aLen = self.length,
          bLen = that.length,
          len = Math.min(aLen, bLen);
        for (let i = 0; i < len; i++) {
          const o = O(self[i], that[i]);
          if (0 !== o) return o;
        }
        return Order_2f11aa24_esm_number(aLen, bLen);
      }),
    min = (O) =>
      dual(2, (self, that) =>
        self === that || O(self, that) < 1 ? self : that
      ),
    max = (O) =>
      dual(2, (self, that) =>
        self === that || O(self, that) > -1 ? self : that
      );
  const Predicate_52271838_esm_isFunction = isFunction,
    isObject = (input) =>
      ("object" == typeof input && null != input) ||
      Predicate_52271838_esm_isFunction(input),
    isNullable = (input) => null == input;
  const globalStoreId = Symbol.for("effect/GlobalValue/globalStoreId");
  globalStoreId in globalThis || (globalThis[globalStoreId] = new Map());
  const globalStore = globalThis[globalStoreId],
    globalValue = (id, compute) => (
      globalStore.has(id) || globalStore.set(id, compute()), globalStore.get(id)
    );
  const GenKindTypeId = Symbol.for("effect/Gen/GenKind");
  class GenKindImpl {
    constructor(value) {
      this.value = value;
    }
    get _F() {
      return identity;
    }
    get _R() {
      return (_) => _;
    }
    get _O() {
      return (_) => _;
    }
    get _E() {
      return (_) => _;
    }
    [GenKindTypeId] = GenKindTypeId;
    [Symbol.iterator]() {
      return new SingleShotGen(this);
    }
  }
  class SingleShotGen {
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
  const adapter = () =>
    function () {
      let x = arguments[0];
      for (let i = 1; i < arguments.length; i++) x = arguments[i](x);
      return new GenKindImpl(x);
    };
  class PCGRandom {
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
  const randomHashCache = globalValue(
      Symbol.for("effect/Hash/randomHashCache"),
      () => new WeakMap()
    ),
    pcgr = globalValue(Symbol.for("effect/Hash/pcgr"), () => new PCGRandom()),
    Hash_039222d1_esm_symbol = Symbol.for("effect/Hash"),
    hash = (self) => {
      switch (typeof self) {
        case "number":
          return Hash_039222d1_esm_number(self);
        case "bigint":
          return Hash_039222d1_esm_string(self.toString(10));
        case "boolean":
        case "symbol":
          return Hash_039222d1_esm_string(String(self));
        case "string":
          return Hash_039222d1_esm_string(self);
        case "undefined":
          return Hash_039222d1_esm_string("undefined");
        case "function":
        case "object":
          return null === self
            ? Hash_039222d1_esm_string("null")
            : isHash(self)
            ? self[Hash_039222d1_esm_symbol]()
            : random(self);
        default:
          throw new Error("Bug in Equal.hash");
      }
    },
    random = (self) => (
      randomHashCache.has(self) ||
        randomHashCache.set(
          self,
          Hash_039222d1_esm_number(pcgr.integer(Number.MAX_SAFE_INTEGER))
        ),
      randomHashCache.get(self)
    ),
    Hash_039222d1_esm_combine = (b) => (self) => (53 * self) ^ b,
    optimize = (n) => (3221225471 & n) | ((n >>> 1) & 1073741824),
    isHash = (u) =>
      "object" == typeof u && null !== u && Hash_039222d1_esm_symbol in u,
    Hash_039222d1_esm_number = (n) => {
      if (n != n || n === 1 / 0) return 0;
      let h = 0 | n;
      for (h !== n && (h ^= 4294967295 * n); n > 4294967295; )
        h ^= n /= 4294967295;
      return optimize(n);
    },
    Hash_039222d1_esm_string = (str) => {
      let h = 5381,
        i = str.length;
      for (; i; ) h = (33 * h) ^ str.charCodeAt(--i);
      return optimize(h);
    },
    structureKeys = (o, keys) => {
      let h = 12289;
      for (let i = 0; i < keys.length; i++)
        h ^= pipe(
          Hash_039222d1_esm_string(keys[i]),
          Hash_039222d1_esm_combine(hash(o[keys[i]]))
        );
      return optimize(h);
    },
    structure = (o) => structureKeys(o, Object.keys(o)),
    Hash_039222d1_esm_array = (arr) => {
      let h = 6151;
      for (let i = 0; i < arr.length; i++)
        h = pipe(h, Hash_039222d1_esm_combine(hash(arr[i])));
      return optimize(h);
    };
  const Equal_7d4ae7e7_esm_symbol = Symbol.for("effect/Equal");
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
      hash(self) === hash(that) &&
      self[Equal_7d4ae7e7_esm_symbol](that)
    );
  }
  const isEqual = (u) =>
      "object" == typeof u && null !== u && Equal_7d4ae7e7_esm_symbol in u,
    equivalence = () => (self, that) => equals(self, that);
  const NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom"),
    toJSON = (x) =>
      "object" == typeof x &&
      null !== x &&
      "toJSON" in x &&
      "function" == typeof x.toJSON &&
      0 === x.toJSON.length
        ? x.toJSON()
        : Array.isArray(x)
        ? x.map(toJSON)
        : x,
    Inspectable_bda84223_esm_toString = (x) => JSON.stringify(x, null, 2);
  Array.prototype;
  const StructProto = {
      [Hash_039222d1_esm_symbol]() {
        return structure(this);
      },
      [Equal_7d4ae7e7_esm_symbol](that) {
        const selfKeys = Object.keys(this),
          thatKeys = Object.keys(that);
        if (selfKeys.length !== thatKeys.length) return !1;
        for (const key of selfKeys)
          if (!(key in that) || !equals(this[key], that[key])) return !1;
        return !0;
      },
    },
    Structural$1 = (function () {
      function Structural(args) {
        args && Object.assign(this, args);
      }
      return (Structural.prototype = StructProto), Structural;
    })(),
    Structural = Structural$1;
  const pipeArguments = (self, args) => {
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
            args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))
          )
        );
      default: {
        let ret = self;
        for (let i = 0, len = args.length; i < len; i++) ret = args[i](ret);
        return ret;
      }
    }
  };
  const EffectTypeId = Symbol.for("effect/Effect"),
    StreamTypeId = Symbol.for("effect/Stream"),
    SinkTypeId = Symbol.for("effect/Sink"),
    ChannelTypeId = Symbol.for("effect/Channel"),
    effectVariance = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
    EffectProto = {
      [EffectTypeId]: effectVariance,
      [StreamTypeId]: effectVariance,
      [SinkTypeId]: {
        _R: (_) => _,
        _E: (_) => _,
        _In: (_) => _,
        _L: (_) => _,
        _Z: (_) => _,
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
      [Equal_7d4ae7e7_esm_symbol](that) {
        return this === that;
      },
      [Hash_039222d1_esm_symbol]() {
        return random(this);
      },
      pipe() {
        return pipeArguments(this, arguments);
      },
    },
    EffectProtoCommit = { ...EffectProto, _op: "Commit" },
    EffectProtoCommitStructural = {
      ...EffectProtoCommit,
      ...Structural.prototype,
    },
    StructuralBase = (function () {
      function Base() {}
      return (Base.prototype = EffectProtoCommitStructural), Base;
    })(),
    TypeId$1 = Symbol.for("effect/Option"),
    CommonProto$1 = {
      ...EffectProto,
      [TypeId$1]: { _A: (_) => _ },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      toString() {
        return Inspectable_bda84223_esm_toString(this.toJSON());
      },
    },
    SomeProto = Object.assign(Object.create(CommonProto$1), {
      _tag: "Some",
      _op: "Some",
      [Equal_7d4ae7e7_esm_symbol](that) {
        return isOption(that) && isSome(that) && equals(that.value, this.value);
      },
      [Hash_039222d1_esm_symbol]() {
        return Hash_039222d1_esm_combine(hash(this._tag))(hash(this.value));
      },
      toJSON() {
        return { _id: "Option", _tag: this._tag, value: toJSON(this.value) };
      },
    }),
    NoneProto = Object.assign(Object.create(CommonProto$1), {
      _tag: "None",
      _op: "None",
      [Equal_7d4ae7e7_esm_symbol]: (that) => isOption(that) && isNone(that),
      [Hash_039222d1_esm_symbol]() {
        return Hash_039222d1_esm_combine(hash(this._tag));
      },
      toJSON() {
        return { _id: "Option", _tag: this._tag };
      },
    }),
    isOption = (input) =>
      "object" == typeof input && null != input && TypeId$1 in input,
    isNone = (fa) => "None" === fa._tag,
    isSome = (fa) => "Some" === fa._tag,
    none = Object.create(NoneProto),
    Either_be9c40b9_esm_some = (value) => {
      const a = Object.create(SomeProto);
      return (a.value = value), a;
    },
    TypeId = Symbol.for("effect/Either"),
    CommonProto = {
      ...EffectProto,
      [TypeId]: { _A: (_) => _ },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      toString() {
        return Inspectable_bda84223_esm_toString(this.toJSON());
      },
    },
    RightProto = Object.assign(Object.create(CommonProto), {
      _tag: "Right",
      _op: "Right",
      [Equal_7d4ae7e7_esm_symbol](that) {
        return (
          isEither(that) && isRight(that) && equals(that.right, this.right)
        );
      },
      [Hash_039222d1_esm_symbol]() {
        return Hash_039222d1_esm_combine(hash(this._tag))(hash(this.right));
      },
      toJSON() {
        return { _id: "Either", _tag: this._tag, right: toJSON(this.right) };
      },
    }),
    LeftProto = Object.assign(Object.create(CommonProto), {
      _tag: "Left",
      _op: "Left",
      [Equal_7d4ae7e7_esm_symbol](that) {
        return isEither(that) && isLeft(that) && equals(that.left, this.left);
      },
      [Hash_039222d1_esm_symbol]() {
        return Hash_039222d1_esm_combine(hash(this._tag))(hash(this.left));
      },
      toJSON() {
        return { _id: "Either", _tag: this._tag, left: toJSON(this.left) };
      },
    }),
    isEither = (input) =>
      "object" == typeof input && null != input && TypeId in input,
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
    getLeft = (self) =>
      isRight(self) ? none : Either_be9c40b9_esm_some(self.left),
    getRight = (self) =>
      isLeft(self) ? none : Either_be9c40b9_esm_some(self.right),
    fromOption = dual(2, (self, onNone) =>
      isNone(self) ? left(onNone()) : right(self.value)
    ),
    Either_09270bbc_esm_TypeId = TypeId,
    Either_09270bbc_esm_right = right,
    Either_09270bbc_esm_left = left,
    fromNullable = dual(2, (self, onNullable) =>
      null == self
        ? Either_09270bbc_esm_left(onNullable(self))
        : Either_09270bbc_esm_right(self)
    ),
    Either_09270bbc_esm_fromOption = fromOption,
    Either_09270bbc_esm_isEither = isEither,
    Either_09270bbc_esm_isLeft = isLeft,
    Either_09270bbc_esm_isRight = isRight,
    Either_09270bbc_esm_getRight = getRight,
    Either_09270bbc_esm_getLeft = getLeft,
    mapBoth = dual(2, (self, { onLeft, onRight }) =>
      Either_09270bbc_esm_isLeft(self)
        ? Either_09270bbc_esm_left(onLeft(self.left))
        : Either_09270bbc_esm_right(onRight(self.right))
    ),
    mapLeft = dual(2, (self, f) =>
      Either_09270bbc_esm_isLeft(self)
        ? Either_09270bbc_esm_left(f(self.left))
        : Either_09270bbc_esm_right(self.right)
    ),
    map = dual(2, (self, f) =>
      Either_09270bbc_esm_isRight(self)
        ? Either_09270bbc_esm_right(f(self.right))
        : Either_09270bbc_esm_left(self.left)
    ),
    Either_09270bbc_esm_match = dual(2, (self, { onLeft, onRight }) =>
      Either_09270bbc_esm_isLeft(self) ? onLeft(self.left) : onRight(self.right)
    ),
    merge = Either_09270bbc_esm_match({ onLeft: identity, onRight: identity }),
    getOrElse = dual(2, (self, onLeft) =>
      Either_09270bbc_esm_isLeft(self) ? onLeft(self.left) : self.right
    ),
    getOrNull = getOrElse(constNull),
    getOrUndefined = getOrElse(constUndefined),
    getOrThrowWith = dual(2, (self, onLeft) => {
      if (Either_09270bbc_esm_isRight(self)) return self.right;
      throw onLeft(self.left);
    }),
    getOrThrow = getOrThrowWith(() => new Error("getOrThrow called on a Left")),
    orElse = dual(2, (self, that) =>
      Either_09270bbc_esm_isLeft(self)
        ? that(self.left)
        : Either_09270bbc_esm_right(self.right)
    ),
    flatMap = dual(2, (self, f) =>
      Either_09270bbc_esm_isLeft(self)
        ? Either_09270bbc_esm_left(self.left)
        : f(self.right)
    ),
    Either_09270bbc_esm_adapter = adapter();
  var Either = Object.freeze({
    __proto__: null,
    TypeId: Either_09270bbc_esm_TypeId,
    right: Either_09270bbc_esm_right,
    left: Either_09270bbc_esm_left,
    fromNullable,
    fromOption: Either_09270bbc_esm_fromOption,
    try: (evaluate) => {
      if (Predicate_52271838_esm_isFunction(evaluate))
        try {
          return Either_09270bbc_esm_right(evaluate());
        } catch (e) {
          return Either_09270bbc_esm_left(e);
        }
      else
        try {
          return Either_09270bbc_esm_right(evaluate.try());
        } catch (e) {
          return Either_09270bbc_esm_left(evaluate.catch(e));
        }
    },
    isEither: Either_09270bbc_esm_isEither,
    isLeft: Either_09270bbc_esm_isLeft,
    isRight: Either_09270bbc_esm_isRight,
    getRight: Either_09270bbc_esm_getRight,
    getLeft: Either_09270bbc_esm_getLeft,
    getEquivalence: (EE, EA) =>
      make(
        (x, y) =>
          x === y ||
          (Either_09270bbc_esm_isLeft(x)
            ? Either_09270bbc_esm_isLeft(y) && EE(x.left, y.left)
            : Either_09270bbc_esm_isRight(y) && EA(x.right, y.right))
      ),
    mapBoth,
    mapLeft,
    map,
    match: Either_09270bbc_esm_match,
    merge,
    getOrElse,
    getOrNull,
    getOrUndefined,
    getOrThrowWith,
    getOrThrow,
    orElse,
    flatMap,
    all: (input) => {
      if (Symbol.iterator in input) {
        const out = [];
        for (const e of input) {
          if (Either_09270bbc_esm_isLeft(e)) return e;
          out.push(e.right);
        }
        return Either_09270bbc_esm_right(out);
      }
      const out = {};
      for (const key of Object.keys(input)) {
        const e = input[key];
        if (Either_09270bbc_esm_isLeft(e)) return e;
        out[key] = e.right;
      }
      return Either_09270bbc_esm_right(out);
    },
    reverse: (self) =>
      Either_09270bbc_esm_isLeft(self)
        ? Either_09270bbc_esm_right(self.left)
        : Either_09270bbc_esm_left(self.right),
    gen: (f) => {
      const iterator = f(Either_09270bbc_esm_adapter);
      let state = iterator.next();
      if (state.done) return Either_09270bbc_esm_right(void 0);
      {
        let current = state.value.value;
        if (Either_09270bbc_esm_isLeft(current)) return current;
        for (; !state.done; )
          if (
            ((state = iterator.next(current.right)),
            !state.done &&
              ((current = state.value.value),
              Either_09270bbc_esm_isLeft(current)))
          )
            return current;
        return Either_09270bbc_esm_right(state.value);
      }
    },
  });
  const Option_1d073850_esm_none = () => none,
    Option_1d073850_esm_some = Either_be9c40b9_esm_some,
    Option_1d073850_esm_isNone = isNone,
    Option_1d073850_esm_isSome = isSome,
    Option_1d073850_esm_getOrElse = dual(2, (self, onNone) =>
      Option_1d073850_esm_isNone(self) ? onNone() : self.value
    ),
    Option_1d073850_esm_getOrUndefined =
      Option_1d073850_esm_getOrElse(constUndefined),
    toArray = (self) => (Option_1d073850_esm_isNone(self) ? [] : [self.value]);
  const isNonEmptyArray = (self) => self.length > 0,
    collect = dual(2, (self, f) => {
      const out = [];
      for (const key of Object.keys(self)) out.push(f(key, self[key]));
      return out;
    }),
    toEntries = collect((key, value) => [key, value]);
  const ReadonlyArray_199ff80e_esm_make = (...elements) => elements,
    makeBy = (n, f) => {
      const max = Math.max(1, Math.floor(n)),
        out = [f(0)];
      for (let i = 1; i < max; i++) out.push(f(i));
      return out;
    },
    replicate = dual(2, (a, n) => makeBy(n, () => a)),
    ReadonlyArray_199ff80e_esm_fromIterable = (collection) =>
      Array.isArray(collection) ? collection : Array.from(collection),
    fromRecord = toEntries,
    ReadonlyArray_199ff80e_esm_fromOption = toArray,
    ReadonlyArray_199ff80e_esm_match = dual(
      2,
      (self, { onEmpty, onNonEmpty }) =>
        isNonEmptyReadonlyArray(self) ? onNonEmpty(self) : onEmpty()
    ),
    matchLeft = dual(2, (self, { onEmpty, onNonEmpty }) =>
      isNonEmptyReadonlyArray(self)
        ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self))
        : onEmpty()
    ),
    matchRight = dual(2, (self, { onEmpty, onNonEmpty }) =>
      isNonEmptyReadonlyArray(self)
        ? onNonEmpty(initNonEmpty(self), lastNonEmpty(self))
        : onEmpty()
    ),
    prepend = dual(2, (self, head) => [head, ...self]),
    prependAll = dual(2, (self, that) =>
      ReadonlyArray_199ff80e_esm_fromIterable(that).concat(
        ReadonlyArray_199ff80e_esm_fromIterable(self)
      )
    ),
    prependAllNonEmpty = dual(2, (self, that) => prependAll(self, that)),
    append = dual(2, (self, last) => [...self, last]),
    appendAll = dual(2, (self, that) =>
      ReadonlyArray_199ff80e_esm_fromIterable(self).concat(
        ReadonlyArray_199ff80e_esm_fromIterable(that)
      )
    ),
    appendAllNonEmpty = dual(2, (self, that) => appendAll(self, that)),
    scan = dual(3, (self, b, f) => {
      const out = [b];
      let i = 0;
      for (const a of self) (out[i + 1] = f(out[i], a)), i++;
      return out;
    }),
    scanRight = dual(3, (self, b, f) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self),
        out = new Array(input.length + 1);
      out[input.length] = b;
      for (let i = input.length - 1; i >= 0; i--)
        out[i] = f(out[i + 1], input[i]);
      return out;
    }),
    isEmptyArray = (self) => 0 === self.length,
    isEmptyReadonlyArray = isEmptyArray,
    ReadonlyArray_199ff80e_esm_isNonEmptyArray = isNonEmptyArray,
    isNonEmptyReadonlyArray = isNonEmptyArray,
    isOutOfBound = (i, as) => i < 0 || i >= as.length,
    ReadonlyArray_199ff80e_esm_clamp = (i, as) =>
      Math.floor(Math.min(Math.max(0, i), as.length)),
    ReadonlyArray_199ff80e_esm_get = dual(2, (self, index) => {
      const i = Math.floor(index);
      return isOutOfBound(i, self)
        ? Option_1d073850_esm_none()
        : Option_1d073850_esm_some(self[i]);
    }),
    unsafeGet = dual(2, (self, index) => {
      const i = Math.floor(index);
      if (isOutOfBound(i, self)) throw new Error(`Index ${i} out of bounds`);
      return self[i];
    }),
    head = ReadonlyArray_199ff80e_esm_get(0),
    headNonEmpty = unsafeGet(0),
    last = (self) =>
      isNonEmptyReadonlyArray(self)
        ? Option_1d073850_esm_some(lastNonEmpty(self))
        : Option_1d073850_esm_none(),
    lastNonEmpty = (self) => self[self.length - 1],
    tailNonEmpty = (self) => self.slice(1),
    initNonEmpty = (self) => self.slice(0, -1),
    take = dual(2, (self, n) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return input.slice(0, ReadonlyArray_199ff80e_esm_clamp(n, input));
    }),
    takeRight = dual(2, (self, n) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self),
        i = ReadonlyArray_199ff80e_esm_clamp(n, input);
      return 0 === i ? [] : input.slice(-i);
    }),
    takeWhile = dual(2, (self, predicate) => {
      const out = [];
      for (const a of self) {
        if (!predicate(a)) break;
        out.push(a);
      }
      return out;
    }),
    spanIndex = (self, predicate) => {
      let i = 0;
      for (const a of self) {
        if (!predicate(a)) break;
        i++;
      }
      return i;
    },
    span = dual(2, (self, predicate) =>
      splitAt(self, spanIndex(self, predicate))
    ),
    drop = dual(2, (self, n) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return input.slice(
        ReadonlyArray_199ff80e_esm_clamp(n, input),
        input.length
      );
    }),
    dropRight = dual(2, (self, n) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return input.slice(
        0,
        input.length - ReadonlyArray_199ff80e_esm_clamp(n, input)
      );
    }),
    dropWhile = dual(2, (self, predicate) =>
      ReadonlyArray_199ff80e_esm_fromIterable(self).slice(
        spanIndex(self, predicate)
      )
    ),
    findFirstIndex = dual(2, (self, predicate) => {
      let i = 0;
      for (const a of self) {
        if (predicate(a)) return Option_1d073850_esm_some(i);
        i++;
      }
      return Option_1d073850_esm_none();
    }),
    findLastIndex = dual(2, (self, predicate) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      for (let i = input.length - 1; i >= 0; i--)
        if (predicate(input[i])) return Option_1d073850_esm_some(i);
      return Option_1d073850_esm_none();
    }),
    findFirst = dual(2, (self, predicate) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      for (let i = 0; i < input.length; i++)
        if (predicate(input[i])) return Option_1d073850_esm_some(input[i]);
      return Option_1d073850_esm_none();
    }),
    findLast = dual(2, (self, predicate) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      for (let i = input.length - 1; i >= 0; i--)
        if (predicate(input[i])) return Option_1d073850_esm_some(input[i]);
      return Option_1d073850_esm_none();
    }),
    insertAt = dual(3, (self, i, b) => {
      const out = Array.from(self);
      return i < 0 || i > out.length
        ? Option_1d073850_esm_none()
        : (out.splice(i, 0, b), Option_1d073850_esm_some(out));
    }),
    replace = dual(3, (self, i, b) => modify(self, i, () => b)),
    ReadonlyArray_199ff80e_esm_replaceOption = dual(3, (self, i, b) =>
      ReadonlyArray_199ff80e_esm_modifyOption(self, i, () => b)
    ),
    modify = dual(3, (self, i, f) =>
      Option_1d073850_esm_getOrElse(
        ReadonlyArray_199ff80e_esm_modifyOption(self, i, f),
        () => Array.from(self)
      )
    ),
    ReadonlyArray_199ff80e_esm_modifyOption = dual(3, (self, i, f) => {
      const out = Array.from(self);
      if (isOutOfBound(i, out)) return Option_1d073850_esm_none();
      const next = f(out[i]);
      return (out[i] = next), Option_1d073850_esm_some(out);
    }),
    ReadonlyArray_199ff80e_esm_remove = dual(2, (self, i) => {
      const out = Array.from(self);
      return isOutOfBound(i, out) || out.splice(i, 1), out;
    }),
    ReadonlyArray_199ff80e_esm_reverse = (self) => Array.from(self).reverse(),
    sort = dual(2, (self, O) => {
      const out = Array.from(self);
      return out.sort(O), out;
    }),
    sortWith = dual(3, (self, f, order) =>
      sort(self, Order_2f11aa24_esm_mapInput(order, f))
    ),
    sortNonEmpty = dual(2, (self, O) => sort(O)(self)),
    sortByNonEmpty = (...orders) =>
      sortNonEmpty(Order_2f11aa24_esm_combineAll(orders)),
    zip = dual(2, (self, that) =>
      ReadonlyArray_199ff80e_esm_zipWith(self, that, (a, b) => [a, b])
    ),
    ReadonlyArray_199ff80e_esm_zipWith = dual(3, (self, that, f) => {
      const as = ReadonlyArray_199ff80e_esm_fromIterable(self),
        bs = ReadonlyArray_199ff80e_esm_fromIterable(that);
      return isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)
        ? zipNonEmptyWith(bs, f)(as)
        : [];
    }),
    zipNonEmpty = dual(2, (self, that) =>
      zipNonEmptyWith(self, that, (a, b) => [a, b])
    ),
    zipNonEmptyWith = dual(3, (self, that, f) => {
      const cs = [f(headNonEmpty(self), headNonEmpty(that))],
        len = Math.min(self.length, that.length);
      for (let i = 1; i < len; i++) cs[i] = f(self[i], that[i]);
      return cs;
    }),
    unzip = (self) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return isNonEmptyReadonlyArray(input) ? unzipNonEmpty(input) : [[], []];
    },
    unzipNonEmpty = (self) => {
      const fa = [self[0][0]],
        fb = [self[0][1]];
      for (let i = 1; i < self.length; i++)
        (fa[i] = self[i][0]), (fb[i] = self[i][1]);
      return [fa, fb];
    },
    intersperse = dual(2, (self, middle) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return isNonEmptyReadonlyArray(input)
        ? intersperseNonEmpty(input, middle)
        : [];
    }),
    intersperseNonEmpty = dual(2, (self, middle) => {
      const out = [headNonEmpty(self)],
        tail = tailNonEmpty(self);
      for (let i = 0; i < tail.length; i++)
        i < tail.length && out.push(middle), out.push(tail[i]);
      return out;
    }),
    modifyNonEmptyHead = dual(2, (self, f) => [
      f(headNonEmpty(self)),
      ...tailNonEmpty(self),
    ]),
    setNonEmptyHead = dual(2, (self, b) => modifyNonEmptyHead(self, () => b)),
    modifyNonEmptyLast = dual(2, (self, f) =>
      append(initNonEmpty(self), f(lastNonEmpty(self)))
    ),
    setNonEmptyLast = dual(2, (self, b) => modifyNonEmptyLast(self, () => b)),
    rotate = dual(2, (self, n) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return isNonEmptyReadonlyArray(input) ? rotateNonEmpty(input, n) : [];
    }),
    rotateNonEmpty = dual(2, (self, n) => {
      const len = self.length,
        m = Math.round(n) % len;
      if (isOutOfBound(Math.abs(m), self) || 0 === m) return copy(self);
      if (m < 0) {
        const [f, s] = splitNonEmptyAt(self, -m);
        return appendAllNonEmpty(s, f);
      }
      return rotateNonEmpty(self, m - len);
    }),
    ReadonlyArray_199ff80e_esm_containsWith = (isEquivalent) =>
      dual(2, (self, a) => {
        for (const i of self) if (isEquivalent(a, i)) return !0;
        return !1;
      }),
    ReadonlyArray_199ff80e_esm_equivalence = equivalence(),
    ReadonlyArray_199ff80e_esm_contains =
      ReadonlyArray_199ff80e_esm_containsWith(
        ReadonlyArray_199ff80e_esm_equivalence
      ),
    dedupeNonEmptyWith = dual(2, (self, isEquivalent) => {
      const out = [headNonEmpty(self)],
        rest = tailNonEmpty(self);
      for (const a of rest)
        out.every((o) => !isEquivalent(a, o)) && out.push(a);
      return out;
    }),
    dedupeNonEmpty = dedupeNonEmptyWith(equivalence()),
    chop = dual(2, (self, f) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return isNonEmptyReadonlyArray(input) ? chopNonEmpty(input, f) : [];
    }),
    chopNonEmpty = dual(2, (self, f) => {
      const [b, rest] = f(self),
        out = [b];
      let next = rest;
      for (; isNonEmptyArray(next); ) {
        const [b, rest] = f(next);
        out.push(b), (next = rest);
      }
      return out;
    }),
    splitAt = dual(2, (self, n) => {
      const input = Array.from(self);
      return n >= 1 && isNonEmptyReadonlyArray(input)
        ? splitNonEmptyAt(input, n)
        : isEmptyReadonlyArray(input)
        ? [input, []]
        : [[], input];
    }),
    copy = (self) => self.slice(),
    splitNonEmptyAt = dual(2, (self, n) => {
      const m = Math.max(1, n);
      return m >= self.length
        ? [copy(self), []]
        : [prepend(self.slice(1, m), headNonEmpty(self)), self.slice(m)];
    }),
    chunksOf = dual(2, (self, n) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return isNonEmptyReadonlyArray(input) ? chunksOfNonEmpty(input, n) : [];
    }),
    chunksOfNonEmpty = dual(2, (self, n) =>
      chopNonEmpty(self, splitNonEmptyAt(n))
    ),
    groupWith = dual(2, (self, isEquivalent) =>
      chopNonEmpty(self, (as) => {
        const h = headNonEmpty(as),
          out = [h];
        let i = 1;
        for (; i < as.length; i++) {
          const a = as[i];
          if (!isEquivalent(a, h)) break;
          out.push(a);
        }
        return [out, as.slice(i)];
      })
    ),
    group = groupWith(equivalence()),
    groupBy = dual(2, (self, f) => {
      const out = {};
      for (const a of self) {
        const k = f(a);
        Object.prototype.hasOwnProperty.call(out, k)
          ? out[k].push(a)
          : (out[k] = [a]);
      }
      return out;
    }),
    unionWith = (isEquivalent) =>
      dual(2, (self, that) => {
        const a = ReadonlyArray_199ff80e_esm_fromIterable(self),
          b = ReadonlyArray_199ff80e_esm_fromIterable(that);
        return isNonEmptyReadonlyArray(a) && isNonEmptyReadonlyArray(b)
          ? unionNonEmptyWith(isEquivalent)(a, b)
          : isNonEmptyReadonlyArray(a)
          ? a
          : b;
      }),
    union = unionWith(ReadonlyArray_199ff80e_esm_equivalence),
    unionNonEmptyWith = (isEquivalent) => {
      const dedupe = dedupeNonEmptyWith(isEquivalent);
      return dual(2, (self, that) => dedupe(appendAllNonEmpty(self, that)));
    },
    unionNonEmpty = unionNonEmptyWith(ReadonlyArray_199ff80e_esm_equivalence),
    intersectionWith = (isEquivalent) => {
      const has = ReadonlyArray_199ff80e_esm_containsWith(isEquivalent);
      return dual(2, (self, that) =>
        ReadonlyArray_199ff80e_esm_fromIterable(self).filter((a) =>
          has(that, a)
        )
      );
    },
    intersection = intersectionWith(ReadonlyArray_199ff80e_esm_equivalence),
    differenceWith = (isEquivalent) => {
      const has = ReadonlyArray_199ff80e_esm_containsWith(isEquivalent);
      return dual(2, (self, that) =>
        ReadonlyArray_199ff80e_esm_fromIterable(self).filter(
          (a) => !has(that, a)
        )
      );
    },
    difference = differenceWith(ReadonlyArray_199ff80e_esm_equivalence),
    ReadonlyArray_199ff80e_esm_empty = () => [],
    of = (a) => [a],
    ReadonlyArray_199ff80e_esm_map = dual(2, (self, f) => self.map(f)),
    mapNonEmpty = ReadonlyArray_199ff80e_esm_map,
    ReadonlyArray_199ff80e_esm_flatMap = dual(2, (self, f) => {
      if (isEmptyReadonlyArray(self)) return [];
      const out = [];
      for (let i = 0; i < self.length; i++) out.push(...f(self[i], i));
      return out;
    }),
    flatMapNonEmpty = ReadonlyArray_199ff80e_esm_flatMap,
    ReadonlyArray_199ff80e_esm_flatten =
      ReadonlyArray_199ff80e_esm_flatMap(identity),
    flattenNonEmpty = flatMapNonEmpty(identity),
    ReadonlyArray_199ff80e_esm_filterMap = dual(2, (self, f) => {
      const as = ReadonlyArray_199ff80e_esm_fromIterable(self),
        out = [];
      for (let i = 0; i < as.length; i++) {
        const o = f(as[i], i);
        Option_1d073850_esm_isSome(o) && out.push(o.value);
      }
      return out;
    }),
    filterMapWhile = dual(2, (self, f) => {
      const out = [];
      for (const a of self) {
        const b = f(a);
        if (!Option_1d073850_esm_isSome(b)) break;
        out.push(b.value);
      }
      return out;
    }),
    ReadonlyArray_199ff80e_esm_partitionMap = dual(2, (self, f) => {
      const left = [],
        right = [],
        as = ReadonlyArray_199ff80e_esm_fromIterable(self);
      for (let i = 0; i < as.length; i++) {
        const e = f(as[i], i);
        Either_09270bbc_esm_isLeft(e) ? left.push(e.left) : right.push(e.right);
      }
      return [left, right];
    }),
    ReadonlyArray_199ff80e_esm_compact =
      ReadonlyArray_199ff80e_esm_filterMap(identity),
    ReadonlyArray_199ff80e_esm_filter = dual(2, (self, predicate) => {
      const as = ReadonlyArray_199ff80e_esm_fromIterable(self),
        out = [];
      for (let i = 0; i < as.length; i++)
        predicate(as[i], i) && out.push(as[i]);
      return out;
    }),
    ReadonlyArray_199ff80e_esm_partition = dual(2, (self, predicate) => {
      const left = [],
        right = [],
        as = ReadonlyArray_199ff80e_esm_fromIterable(self);
      for (let i = 0; i < as.length; i++)
        predicate(as[i], i) ? right.push(as[i]) : left.push(as[i]);
      return [left, right];
    }),
    ReadonlyArray_199ff80e_esm_separate =
      ReadonlyArray_199ff80e_esm_partitionMap(identity),
    reduce = dual(3, (self, b, f) =>
      ReadonlyArray_199ff80e_esm_fromIterable(self).reduce(
        (b, a, i) => f(b, a, i),
        b
      )
    ),
    reduceRight = dual(3, (self, b, f) =>
      ReadonlyArray_199ff80e_esm_fromIterable(self).reduceRight(
        (b, a, i) => f(b, a, i),
        b
      )
    ),
    ReadonlyArray_199ff80e_esm_fromNullable = (a) => (null == a ? [] : [a]),
    ReadonlyArray_199ff80e_esm_flatMapNullable = dual(2, (self, f) =>
      isNonEmptyReadonlyArray(self)
        ? ReadonlyArray_199ff80e_esm_fromNullable(f(headNonEmpty(self)))
        : []
    ),
    ReadonlyArray_199ff80e_esm_every = dual(2, (self, refinement) =>
      self.every(refinement)
    ),
    ReadonlyArray_199ff80e_esm_some = dual(2, (self, predicate) =>
      self.some(predicate)
    ),
    extend = dual(2, (self, f) => self.map((_, i, as) => f(as.slice(i)))),
    ReadonlyArray_199ff80e_esm_min = dual(2, (self, O) => self.reduce(min(O))),
    ReadonlyArray_199ff80e_esm_max = dual(2, (self, O) => self.reduce(max(O))),
    unfold = (b, f) => {
      const out = [];
      let o,
        next = b;
      for (; Option_1d073850_esm_isSome((o = f(next))); ) {
        const [a, b] = o.value;
        out.push(a), (next = b);
      }
      return out;
    },
    ReadonlyArray_199ff80e_esm_getOrder = Order_2f11aa24_esm_array,
    ReadonlyArray_199ff80e_esm_getEquivalence = array,
    forEach = dual(2, (self, f) =>
      ReadonlyArray_199ff80e_esm_fromIterable(self).forEach((a, i) => f(a, i))
    ),
    dedupeWith = dual(2, (self, isEquivalent) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return isNonEmptyReadonlyArray(input)
        ? dedupeNonEmptyWith(isEquivalent)(input)
        : [];
    }),
    dedupe = dedupeWith(equivalence()),
    dedupeAdjacentWith = dual(2, (self, isEquivalent) => {
      const out = [];
      let lastA = Option_1d073850_esm_none();
      for (const a of self)
        (!Option_1d073850_esm_isNone(lastA) && isEquivalent(a, lastA.value)) ||
          (out.push(a), (lastA = Option_1d073850_esm_some(a)));
      return out;
    }),
    dedupeAdjacent = dedupeAdjacentWith(equivalence()),
    join = dual(2, (self, sep) =>
      ReadonlyArray_199ff80e_esm_fromIterable(self).join(sep)
    ),
    mapAccum = dual(3, (self, s, f) => {
      let s1 = s;
      const out = [];
      for (const a of self) {
        const r = f(s1, a);
        (s1 = r[0]), out.push(r[1]);
      }
      return [s1, out];
    }),
    cartesianWith = dual(3, (self, that, f) =>
      ReadonlyArray_199ff80e_esm_flatMap(self, (a) =>
        ReadonlyArray_199ff80e_esm_map(that, (b) => f(a, b))
      )
    ),
    cartesian = dual(2, (self, that) =>
      cartesianWith(self, that, (a, b) => [a, b])
    );
  var ReadonlyArray = Object.freeze({
    __proto__: null,
    make: ReadonlyArray_199ff80e_esm_make,
    makeBy,
    range: (start, end) =>
      start <= end ? makeBy(end - start + 1, (i) => start + i) : [start],
    replicate,
    fromIterable: ReadonlyArray_199ff80e_esm_fromIterable,
    fromRecord,
    fromOption: ReadonlyArray_199ff80e_esm_fromOption,
    match: ReadonlyArray_199ff80e_esm_match,
    matchLeft,
    matchRight,
    prepend,
    prependAll,
    prependAllNonEmpty,
    append,
    appendAll,
    appendAllNonEmpty,
    scan,
    scanRight,
    isEmptyArray,
    isEmptyReadonlyArray,
    isNonEmptyArray: ReadonlyArray_199ff80e_esm_isNonEmptyArray,
    isNonEmptyReadonlyArray,
    length: (self) => self.length,
    get: ReadonlyArray_199ff80e_esm_get,
    unsafeGet,
    unprepend: (self) => [headNonEmpty(self), tailNonEmpty(self)],
    unappend: (self) => [initNonEmpty(self), lastNonEmpty(self)],
    head,
    headNonEmpty,
    last,
    lastNonEmpty,
    tail: (self) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return isNonEmptyReadonlyArray(input)
        ? Option_1d073850_esm_some(tailNonEmpty(input))
        : Option_1d073850_esm_none();
    },
    tailNonEmpty,
    init: (self) => {
      const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
      return isNonEmptyReadonlyArray(input)
        ? Option_1d073850_esm_some(initNonEmpty(input))
        : Option_1d073850_esm_none();
    },
    initNonEmpty,
    take,
    takeRight,
    takeWhile,
    span,
    drop,
    dropRight,
    dropWhile,
    findFirstIndex,
    findLastIndex,
    findFirst,
    findLast,
    insertAt,
    replace,
    replaceOption: ReadonlyArray_199ff80e_esm_replaceOption,
    modify,
    modifyOption: ReadonlyArray_199ff80e_esm_modifyOption,
    remove: ReadonlyArray_199ff80e_esm_remove,
    reverse: ReadonlyArray_199ff80e_esm_reverse,
    reverseNonEmpty: (self) => [
      lastNonEmpty(self),
      ...self.slice(0, -1).reverse(),
    ],
    sort,
    sortWith,
    sortNonEmpty,
    sortBy:
      (...orders) =>
      (self) => {
        const input = ReadonlyArray_199ff80e_esm_fromIterable(self);
        return isNonEmptyReadonlyArray(input)
          ? sortByNonEmpty(...orders)(input)
          : [];
      },
    sortByNonEmpty,
    zip,
    zipWith: ReadonlyArray_199ff80e_esm_zipWith,
    zipNonEmpty,
    zipNonEmptyWith,
    unzip,
    unzipNonEmpty,
    intersperse,
    intersperseNonEmpty,
    modifyNonEmptyHead,
    setNonEmptyHead,
    modifyNonEmptyLast,
    setNonEmptyLast,
    rotate,
    rotateNonEmpty,
    containsWith: ReadonlyArray_199ff80e_esm_containsWith,
    contains: ReadonlyArray_199ff80e_esm_contains,
    dedupeNonEmptyWith,
    dedupeNonEmpty,
    chop,
    chopNonEmpty,
    splitAt,
    copy,
    splitNonEmptyAt,
    chunksOf,
    chunksOfNonEmpty,
    groupWith,
    group,
    groupBy,
    unionWith,
    union,
    unionNonEmptyWith,
    unionNonEmpty,
    intersectionWith,
    intersection,
    differenceWith,
    difference,
    empty: ReadonlyArray_199ff80e_esm_empty,
    of,
    map: ReadonlyArray_199ff80e_esm_map,
    mapNonEmpty,
    flatMap: ReadonlyArray_199ff80e_esm_flatMap,
    flatMapNonEmpty,
    flatten: ReadonlyArray_199ff80e_esm_flatten,
    flattenNonEmpty,
    filterMap: ReadonlyArray_199ff80e_esm_filterMap,
    filterMapWhile,
    partitionMap: ReadonlyArray_199ff80e_esm_partitionMap,
    compact: ReadonlyArray_199ff80e_esm_compact,
    filter: ReadonlyArray_199ff80e_esm_filter,
    partition: ReadonlyArray_199ff80e_esm_partition,
    separate: ReadonlyArray_199ff80e_esm_separate,
    reduce,
    reduceRight,
    liftPredicate: (predicate) => (b) => predicate(b) ? [b] : [],
    liftOption:
      (f) =>
      (...a) =>
        ReadonlyArray_199ff80e_esm_fromOption(f(...a)),
    fromNullable: ReadonlyArray_199ff80e_esm_fromNullable,
    liftNullable:
      (f) =>
      (...a) =>
        ReadonlyArray_199ff80e_esm_fromNullable(f(...a)),
    flatMapNullable: ReadonlyArray_199ff80e_esm_flatMapNullable,
    liftEither:
      (f) =>
      (...a) => {
        const e = f(...a);
        return Either_09270bbc_esm_isLeft(e) ? [] : [e.right];
      },
    every: ReadonlyArray_199ff80e_esm_every,
    some: ReadonlyArray_199ff80e_esm_some,
    extend,
    min: ReadonlyArray_199ff80e_esm_min,
    max: ReadonlyArray_199ff80e_esm_max,
    unfold,
    getOrder: ReadonlyArray_199ff80e_esm_getOrder,
    getEquivalence: ReadonlyArray_199ff80e_esm_getEquivalence,
    forEach,
    dedupeWith,
    dedupe,
    dedupeAdjacentWith,
    dedupeAdjacent,
    join,
    mapAccum,
    cartesianWith,
    cartesian,
  });
  const TagTypeId = Symbol.for("effect/Context/Tag"),
    STMTypeId = Symbol.for("effect/STM"),
    Context_fcee7bba_esm_TypeId =
      (NodeInspectSymbol, Symbol.for("effect/Context")),
    ContextProto = {
      [Context_fcee7bba_esm_TypeId]: { _S: (_) => _ },
      [Equal_7d4ae7e7_esm_symbol](that) {
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
      [Hash_039222d1_esm_symbol]() {
        return Hash_039222d1_esm_number(this.unsafeMap.size);
      },
      pipe() {
        return pipeArguments(this, arguments);
      },
      toString() {
        return Inspectable_bda84223_esm_toString(this.toJSON());
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
    isContext = (u) =>
      "object" == typeof u && null !== u && Context_fcee7bba_esm_TypeId in u,
    Context_fcee7bba_esm_make = (tag, service) =>
      makeContext(new Map([[tag, service]]));
  const Chunk_98371336_esm_TypeId = Symbol.for("effect/Chunk");
  const emptyArray = [],
    Chunk_98371336_esm_getEquivalence = (isEquivalent) =>
      make((self, that) =>
        toReadonlyArray(self).every((value, i) =>
          isEquivalent(value, Chunk_98371336_esm_unsafeGet(that, i))
        )
      ),
    Chunk_98371336_esm_equivalence = Chunk_98371336_esm_getEquivalence(equals),
    ChunkProto = {
      [Chunk_98371336_esm_TypeId]: { _A: (_) => _ },
      toString() {
        return Inspectable_bda84223_esm_toString(this.toJSON());
      },
      toJSON() {
        return { _id: "Chunk", values: toReadonlyArray(this).map(toJSON) };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      [Equal_7d4ae7e7_esm_symbol](that) {
        return isChunk(that) && Chunk_98371336_esm_equivalence(this, that);
      },
      [Hash_039222d1_esm_symbol]() {
        return Hash_039222d1_esm_array(toReadonlyArray(this));
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
        return pipeArguments(this, arguments);
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
            (chunk.left = Chunk_98371336_esm_empty),
            (chunk.right = Chunk_98371336_esm_empty);
          break;
        case "ISingleton":
          (chunk.length = 1),
            (chunk.depth = 0),
            (chunk.left = Chunk_98371336_esm_empty),
            (chunk.right = Chunk_98371336_esm_empty);
          break;
        case "ISlice":
          (chunk.length = backing.length),
            (chunk.depth = backing.chunk.depth + 1),
            (chunk.left = Chunk_98371336_esm_empty),
            (chunk.right = Chunk_98371336_esm_empty);
      }
      return chunk;
    },
    isChunk = (u) => isObject(u) && Chunk_98371336_esm_TypeId in u,
    Chunk_98371336_esm_empty = makeChunk({ _tag: "IEmpty" }),
    dist_Chunk_98371336_esm_empty = () => Chunk_98371336_esm_empty,
    Chunk_98371336_esm_of = (a) => makeChunk({ _tag: "ISingleton", a }),
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
            (array[j] = Chunk_98371336_esm_unsafeGet(self, i)),
              (i += 1),
              (j += 1);
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
            (self.left = Chunk_98371336_esm_empty),
            (self.right = Chunk_98371336_esm_empty),
            (self.depth = 0),
            arr
          );
        }
      }
    },
    Chunk_98371336_esm_reverse = (self) => {
      switch (self.backing._tag) {
        case "IEmpty":
        case "ISingleton":
          return self;
        case "IArray":
          return makeChunk({
            _tag: "IArray",
            array: ReadonlyArray_199ff80e_esm_reverse(self.backing.array),
          });
        case "IConcat":
          return makeChunk({
            _tag: "IConcat",
            left: Chunk_98371336_esm_reverse(self.backing.right),
            right: Chunk_98371336_esm_reverse(self.backing.left),
          });
        case "ISlice":
          return unsafeFromArray(
            ReadonlyArray_199ff80e_esm_reverse(toReadonlyArray(self))
          );
      }
    },
    unsafeFromArray = (self) => makeChunk({ _tag: "IArray", array: self }),
    Chunk_98371336_esm_unsafeGet = dual(2, (self, index) => {
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
            ? Chunk_98371336_esm_unsafeGet(self.left, index)
            : Chunk_98371336_esm_unsafeGet(
                self.right,
                index - self.left.length
              );
        case "ISlice":
          return Chunk_98371336_esm_unsafeGet(
            self.backing.chunk,
            index + self.backing.offset
          );
      }
    }),
    Chunk_98371336_esm_prepend = dual(2, (self, elem) =>
      Chunk_98371336_esm_appendAllNonEmpty(Chunk_98371336_esm_of(elem), self)
    ),
    Chunk_98371336_esm_appendAll = dual(2, (self, that) => {
      if ("IEmpty" === self.backing._tag) return that;
      if ("IEmpty" === that.backing._tag) return self;
      const diff = that.depth - self.depth;
      if (Math.abs(diff) <= 1)
        return makeChunk({ _tag: "IConcat", left: self, right: that });
      if (diff < -1) {
        if (self.left.depth >= self.right.depth) {
          const nr = Chunk_98371336_esm_appendAll(self.right, that);
          return makeChunk({ _tag: "IConcat", left: self.left, right: nr });
        }
        {
          const nrr = Chunk_98371336_esm_appendAll(self.right.right, that);
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
        const nl = Chunk_98371336_esm_appendAll(self, that.left);
        return makeChunk({ _tag: "IConcat", left: nl, right: that.right });
      }
      {
        const nll = Chunk_98371336_esm_appendAll(self, that.left.left);
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
    Chunk_98371336_esm_appendAllNonEmpty = dual(2, (self, that) =>
      Chunk_98371336_esm_appendAll(self, that)
    ),
    isEmpty = (self) => 0 === self.length,
    isNonEmpty = (self) => self.length > 0,
    unsafeHead = (self) => Chunk_98371336_esm_unsafeGet(self, 0),
    Chunk_98371336_esm_headNonEmpty = unsafeHead;
  class Stack {
    constructor(value, previous) {
      (this.value = value), (this.previous = previous);
    }
  }
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
      const v = f(Option_1d073850_esm_none());
      return Option_1d073850_esm_isNone(v)
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
          : Option_1d073850_esm_isNone(v)
          ? (--size.value, new EmptyNode())
          : canEditNode(this, edit)
          ? ((this.value = v), this)
          : new LeafNode(edit, hash, key, v);
      }
      const v = f(Option_1d073850_esm_none());
      return Option_1d073850_esm_isNone(v)
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
      const v = f(Option_1d073850_esm_none());
      return Option_1d073850_esm_isNone(v)
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
            : Option_1d073850_esm_isNone(newValue)
            ? (--size.value, arraySpliceOut(mutate, i, list))
            : arrayUpdate(
                mutate,
                i,
                new LeafNode(edit, hash, key, newValue),
                list
              );
        }
      }
      const newValue = f(Option_1d073850_esm_none());
      return Option_1d073850_esm_isNone(newValue)
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
      (stack = new Stack(res, stack)), (currentShift += 5);
    }
  }
  const HashMapTypeId = Symbol.for("effect/HashMap"),
    HashMapProto = {
      [HashMapTypeId]: HashMapTypeId,
      [Symbol.iterator]() {
        return new HashMapIterator(this, (k, v) => [k, v]);
      },
      [Hash_039222d1_esm_symbol]() {
        let hash$1 = hash("HashMap");
        for (const item of this)
          hash$1 ^= Hash_039222d1_esm_combine(hash(item[0]))(hash(item[1]));
        return hash$1;
      },
      [Equal_7d4ae7e7_esm_symbol](that) {
        if (isHashMap(that)) {
          if (that._size !== this._size) return !1;
          for (const item of this) {
            const elem = pipe(that, getHash(item[0], hash(item[0])));
            if (Option_1d073850_esm_isNone(elem)) return !1;
            if (!equals(item[1], elem.value)) return !1;
          }
          return !0;
        }
        return !1;
      },
      toString() {
        return Inspectable_bda84223_esm_toString(this.toJSON());
      },
      toJSON() {
        return { _id: "HashMap", values: Array.from(this).map(toJSON) };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      pipe() {
        return pipeArguments(this, arguments);
      },
    },
    makeImpl$1 = (editable, edit, root, size) => {
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
    constructor(map, f) {
      (this.map = map),
        (this.f = f),
        (this.v = visitLazy(this.map._root, this.f, void 0));
    }
    next() {
      if (Option_1d073850_esm_isNone(this.v))
        return { done: !0, value: void 0 };
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
        : Option_1d073850_esm_none(),
    visitLazy = (node, f, cont = void 0) => {
      switch (node._tag) {
        case "LeafNode":
          return Option_1d073850_esm_isSome(node.value)
            ? Option_1d073850_esm_some({
                value: f(node.key, node.value.value),
                cont,
              })
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
    _empty$1 = makeImpl$1(!1, 0, new EmptyNode(), 0),
    empty$1 = () => _empty$1,
    isHashMap = (u) => isObject(u) && HashMapTypeId in u,
    getHash = dual(3, (self, key, hash) => {
      let node = self._root,
        shift = 0;
      for (;;)
        switch (node._tag) {
          case "LeafNode":
            return equals(key, node.key)
              ? node.value
              : Option_1d073850_esm_none();
          case "CollisionNode":
            if (hash === node.hash) {
              const children = node.children;
              for (let i = 0, len = children.length; i < len; ++i) {
                const child = children[i];
                if ("key" in child && equals(key, child.key))
                  return child.value;
              }
            }
            return Option_1d073850_esm_none();
          case "IndexedNode": {
            const bit = toBitmap(hashFragment(shift, hash));
            if (node.mask & bit) {
              (node = node.children[fromBitmap(node.mask, bit)]), (shift += 5);
              break;
            }
            return Option_1d073850_esm_none();
          }
          case "ArrayNode":
            if (((node = node.children[hashFragment(shift, hash)]), node)) {
              shift += 5;
              break;
            }
            return Option_1d073850_esm_none();
          default:
            return Option_1d073850_esm_none();
        }
    }),
    set = dual(3, (self, key, value) =>
      modifyAt(self, key, () => Option_1d073850_esm_some(value))
    ),
    setTree = dual(3, (self, newRoot, newSize) =>
      self._editable
        ? ((self._root = newRoot), (self._size = newSize), self)
        : newRoot === self._root
        ? self
        : makeImpl$1(self._editable, self._edit, newRoot, newSize)
    ),
    keys = (self) => new HashMapIterator(self, (key) => key),
    size$1 = (self) => self._size,
    beginMutation$1 = (self) =>
      makeImpl$1(!0, self._edit + 1, self._root, self._size),
    modifyAt = dual(3, (self, key, f) => modifyHash(self, key, hash(key), f)),
    modifyHash = dual(4, (self, key, hash, f) => {
      const size = { value: self._size },
        newRoot = self._root.modify(
          self._editable ? self._edit : NaN,
          0,
          f,
          hash,
          key,
          size
        );
      return pipe(self, setTree(newRoot, size.value));
    }),
    forEach$1 = dual(2, (self, f) =>
      reduce$1(self, void 0, (_, value, key) => f(value, key))
    ),
    reduce$1 = dual(3, (self, zero, f) => {
      const root = self._root;
      if ("LeafNode" === root._tag)
        return Option_1d073850_esm_isSome(root.value)
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
              ? Option_1d073850_esm_isSome(child.value) &&
                (zero = f(zero, child.value.value, child.key))
              : toVisit.push(child.children));
        }
      return zero;
    }),
    HashSetTypeId = Symbol.for("effect/HashSet"),
    HashSetProto = {
      [HashSetTypeId]: HashSetTypeId,
      [Symbol.iterator]() {
        return keys(this._keyMap);
      },
      [Hash_039222d1_esm_symbol]() {
        return Hash_039222d1_esm_combine(hash(this._keyMap))(hash("HashSet"));
      },
      [Equal_7d4ae7e7_esm_symbol](that) {
        return (
          !!isHashSet(that) &&
          size$1(this._keyMap) === size$1(that._keyMap) &&
          equals(this._keyMap, that._keyMap)
        );
      },
      toString() {
        return Inspectable_bda84223_esm_toString(this.toJSON());
      },
      toJSON() {
        return { _id: "HashSet", values: Array.from(this).map(toJSON) };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      pipe() {
        return pipeArguments(this, arguments);
      },
    },
    makeImpl = (keyMap) => {
      const set = Object.create(HashSetProto);
      return (set._keyMap = keyMap), set;
    },
    isHashSet = (u) => isObject(u) && HashSetTypeId in u,
    HashSet_d051e0ea_esm_empty = makeImpl(empty$1()),
    dist_HashSet_d051e0ea_esm_empty = () => HashSet_d051e0ea_esm_empty,
    beginMutation = (self) => makeImpl(beginMutation$1(self._keyMap)),
    endMutation = (self) => ((self._keyMap._editable = !1), self),
    mutate = dual(2, (self, f) => {
      const transient = beginMutation(self);
      return f(transient), endMutation(transient);
    }),
    HashSet_d051e0ea_esm_add = dual(2, (self, value) =>
      self._keyMap._editable
        ? (set(value, !0)(self._keyMap), self)
        : makeImpl(set(value, !0)(self._keyMap))
    ),
    HashSet_d051e0ea_esm_union = dual(2, (self, that) =>
      mutate(dist_HashSet_d051e0ea_esm_empty(), (set) => {
        HashSet_d051e0ea_esm_forEach(self, (value) =>
          HashSet_d051e0ea_esm_add(set, value)
        );
        for (const value of that) HashSet_d051e0ea_esm_add(set, value);
      })
    ),
    HashSet_d051e0ea_esm_forEach = dual(2, (self, f) =>
      forEach$1(self._keyMap, (_, k) => f(k))
    );
  const HashSet_dff2542b_esm_empty = dist_HashSet_d051e0ea_esm_empty,
    HashSet_dff2542b_esm_size = (self) => size$1(self._keyMap),
    HashSet_dff2542b_esm_add = HashSet_d051e0ea_esm_add,
    HashSet_dff2542b_esm_union = HashSet_d051e0ea_esm_union;
  const ChunkPatchTypeId = Symbol.for("effect/DifferChunkPatch");
  function variance$4(a) {
    return a;
  }
  Structural.prototype;
  const ContextPatchTypeId = Symbol.for("effect/DifferContextPatch");
  function variance$3(a) {
    return a;
  }
  Structural.prototype;
  const HashMapPatchTypeId = Symbol.for("effect/DifferHashMapPatch");
  function variance$2(a) {
    return a;
  }
  Structural.prototype;
  const HashSetPatchTypeId = Symbol.for("effect/DifferHashSetPatch");
  function variance$1(a) {
    return a;
  }
  Structural.prototype;
  const OrPatchTypeId = Symbol.for("effect/DifferOrPatch");
  function variance(a) {
    return a;
  }
  Structural.prototype;
  const DifferTypeId = Symbol.for("effect/Differ"),
    DifferProto = { [DifferTypeId]: { _P: identity, _V: identity } },
    Differ_3be1df41_esm_make$1 = (params) => {
      const differ = Object.create(DifferProto);
      return (
        (differ.empty = params.empty),
        (differ.diff = params.diff),
        (differ.combine = params.combine),
        (differ.patch = params.patch),
        differ
      );
    },
    updateWith$1 = (f) =>
      Differ_3be1df41_esm_make$1({
        empty: identity,
        combine: (first, second) =>
          first === identity
            ? second
            : second === identity
            ? first
            : (a) => second(first(a)),
        diff: (oldValue, newValue) =>
          equals(oldValue, newValue) ? identity : constant(newValue),
        patch: (patch, oldValue) => f(oldValue, patch(oldValue)),
      }),
    update = () => updateWith$1((_, a) => a);
  const FiberIdTypeId$1 = Symbol.for("effect/FiberId");
  class None {
    [FiberIdTypeId$1] = FiberIdTypeId$1;
    _tag = "None";
    [Hash_039222d1_esm_symbol]() {
      return pipe(
        hash("effect/FiberId"),
        Hash_039222d1_esm_combine(hash(this._tag))
      );
    }
    [Equal_7d4ae7e7_esm_symbol](that) {
      return isFiberId$1(that) && "None" === that._tag;
    }
    toString() {
      return Inspectable_bda84223_esm_toString(this.toJSON());
    }
    toJSON() {
      return { _id: "FiberId", _tag: this._tag };
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  const none$1 = new None(),
    isFiberId$1 = (self) =>
      "object" == typeof self && null != self && FiberIdTypeId$1 in self,
    FiberId_556ab9ef_esm_none = none$1;
  const List_c066a506_esm_TypeId = Symbol.for("effect/List"),
    List_c066a506_esm_toReadonlyArray = (self) => Array.from(self),
    List_c066a506_esm_getEquivalence = (isEquivalent) =>
      mapInput(
        ReadonlyArray_199ff80e_esm_getEquivalence(isEquivalent),
        List_c066a506_esm_toReadonlyArray
      ),
    List_c066a506_esm_equivalence = List_c066a506_esm_getEquivalence(equals),
    NilProto =
      (NodeInspectSymbol,
      Equal_7d4ae7e7_esm_symbol,
      Hash_039222d1_esm_symbol,
      Symbol.iterator,
      {
        [List_c066a506_esm_TypeId]: List_c066a506_esm_TypeId,
        _tag: "Nil",
        toString() {
          return Inspectable_bda84223_esm_toString(this.toJSON());
        },
        toJSON: () => ({ _id: "List", _tag: "Nil" }),
        [NodeInspectSymbol]() {
          return this.toJSON();
        },
        [Hash_039222d1_esm_symbol]() {
          return Hash_039222d1_esm_array(
            List_c066a506_esm_toReadonlyArray(this)
          );
        },
        [Equal_7d4ae7e7_esm_symbol](that) {
          return isList(that) && this._tag === that._tag;
        },
        [Symbol.iterator]: () => ({
          next: () => ({ done: !0, value: void 0 }),
        }),
        pipe() {
          return pipeArguments(this, arguments);
        },
      }),
    _Nil = Object.create(NilProto),
    isList = (u) => isObject(u) && List_c066a506_esm_TypeId in u,
    isCons = (self) => "Cons" === self._tag,
    nil = () => _Nil,
    List_c066a506_esm_empty = nil;
  const make$2 = (active, enabled) =>
      (255 & active) + ((enabled & active & 255) << 8),
    enable$2 = (flag) => make$2(flag, flag),
    disable$2 = (flag) => make$2(flag, 0),
    interruption = (self) => isEnabled$1(self, 1),
    isEnabled$1 = dual(2, (self, flag) => 0 != (self & flag)),
    enable = enable$2,
    disable = disable$2;
  const CauseTypeId = Symbol.for("effect/Cause"),
    proto = {
      [CauseTypeId]: { _E: (_) => _ },
      [Hash_039222d1_esm_symbol]() {
        return pipe(
          hash("effect/Cause"),
          Hash_039222d1_esm_combine(hash(flattenCause(this)))
        );
      },
      [Equal_7d4ae7e7_esm_symbol](that) {
        return isCause(that) && causeEquals(this, that);
      },
      pipe() {
        return pipeArguments(this, arguments);
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
              errors: toJSON(prettyErrors(this)),
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
    fail$1 = (error) => {
      const o = Object.create(proto);
      return (o._tag = "Fail"), (o.error = error), o;
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
    isInterruptedOnly = (self) =>
      reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self),
    interruptors = (self) =>
      core_9f5f0dc2_esm_reduce$1(
        self,
        HashSet_dff2542b_esm_empty(),
        (set, cause) =>
          "Interrupt" === cause._tag
            ? Option_1d073850_esm_some(
                pipe(set, HashSet_dff2542b_esm_add(cause.fiberId))
              )
            : Option_1d073850_esm_none()
      ),
    causeEquals = (left, right) => {
      let leftStack = Chunk_98371336_esm_of(left),
        rightStack = Chunk_98371336_esm_of(right);
      for (; isNonEmpty(leftStack) && isNonEmpty(rightStack); ) {
        const [leftParallel, leftSequential] = pipe(
            Chunk_98371336_esm_headNonEmpty(leftStack),
            core_9f5f0dc2_esm_reduce$1(
              [HashSet_dff2542b_esm_empty(), dist_Chunk_98371336_esm_empty()],
              ([parallel, sequential], cause) => {
                const [par, seq] = evaluateCause(cause);
                return Option_1d073850_esm_some([
                  pipe(parallel, HashSet_dff2542b_esm_union(par)),
                  pipe(sequential, Chunk_98371336_esm_appendAll(seq)),
                ]);
              }
            )
          ),
          [rightParallel, rightSequential] = pipe(
            Chunk_98371336_esm_headNonEmpty(rightStack),
            core_9f5f0dc2_esm_reduce$1(
              [HashSet_dff2542b_esm_empty(), dist_Chunk_98371336_esm_empty()],
              ([parallel, sequential], cause) => {
                const [par, seq] = evaluateCause(cause);
                return Option_1d073850_esm_some([
                  pipe(parallel, HashSet_dff2542b_esm_union(par)),
                  pipe(sequential, Chunk_98371336_esm_appendAll(seq)),
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
      flattenCauseLoop(
        Chunk_98371336_esm_of(cause),
        dist_Chunk_98371336_esm_empty()
      ),
    flattenCauseLoop = (causes, flattened) => {
      for (;;) {
        const [parallel, sequential] = pipe(
            causes,
            reduce(
              [HashSet_dff2542b_esm_empty(), dist_Chunk_98371336_esm_empty()],
              ([parallel, sequential], cause) => {
                const [par, seq] = evaluateCause(cause);
                return [
                  pipe(parallel, HashSet_dff2542b_esm_union(par)),
                  pipe(sequential, Chunk_98371336_esm_appendAll(seq)),
                ];
              }
            )
          ),
          updated =
            HashSet_dff2542b_esm_size(parallel) > 0
              ? pipe(flattened, Chunk_98371336_esm_prepend(parallel))
              : flattened;
        if (isEmpty(sequential)) return Chunk_98371336_esm_reverse(updated);
        (causes = sequential), (flattened = updated);
      }
      throw new Error(
        "BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues"
      );
    },
    evaluateCause = (self) => {
      let cause = self;
      const stack = [];
      let _parallel = HashSet_dff2542b_esm_empty(),
        _sequential = dist_Chunk_98371336_esm_empty();
      for (; void 0 !== cause; )
        switch (cause._tag) {
          case "Empty":
            if (0 === stack.length) return [_parallel, _sequential];
            cause = stack.pop();
            break;
          case "Fail":
            if (0 === stack.length)
              return [
                pipe(_parallel, HashSet_dff2542b_esm_add(cause.error)),
                _sequential,
              ];
            (_parallel = pipe(
              _parallel,
              HashSet_dff2542b_esm_add(cause.error)
            )),
              (cause = stack.pop());
            break;
          case "Die":
            if (0 === stack.length)
              return [
                pipe(_parallel, HashSet_dff2542b_esm_add(cause.defect)),
                _sequential,
              ];
            (_parallel = pipe(
              _parallel,
              HashSet_dff2542b_esm_add(cause.defect)
            )),
              (cause = stack.pop());
            break;
          case "Interrupt":
            if (0 === stack.length)
              return [
                pipe(_parallel, HashSet_dff2542b_esm_add(cause.fiberId)),
                _sequential,
              ];
            (_parallel = pipe(
              _parallel,
              HashSet_dff2542b_esm_add(cause.fiberId)
            )),
              (cause = stack.pop());
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
                (_sequential = pipe(
                  _sequential,
                  Chunk_98371336_esm_prepend(cause.right)
                )),
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
    IsInterruptedOnlyCauseReducer = {
      emptyCase: constTrue,
      failCase: constFalse,
      dieCase: constFalse,
      interruptCase: constTrue,
      sequentialCase: (_, left, right) => left && right,
      parallelCase: (_, left, right) => left && right,
    },
    core_9f5f0dc2_esm_reduce$1 = dual(3, (self, zero, pf) => {
      let accumulator = zero,
        cause = self;
      const causes = [];
      for (; void 0 !== cause; ) {
        const option = pf(accumulator, cause);
        switch (
          ((accumulator = Option_1d073850_esm_isSome(option)
            ? option.value
            : accumulator),
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
    reduceWithContext = dual(3, (self, context, reducer) => {
      const input = [self],
        output = [];
      for (; input.length > 0; ) {
        const cause = input.pop();
        switch (cause._tag) {
          case "Empty":
            output.push(Either_09270bbc_esm_right(reducer.emptyCase(context)));
            break;
          case "Fail":
            output.push(
              Either_09270bbc_esm_right(reducer.failCase(context, cause.error))
            );
            break;
          case "Die":
            output.push(
              Either_09270bbc_esm_right(reducer.dieCase(context, cause.defect))
            );
            break;
          case "Interrupt":
            output.push(
              Either_09270bbc_esm_right(
                reducer.interruptCase(context, cause.fiberId)
              )
            );
            break;
          case "Sequential":
            input.push(cause.right),
              input.push(cause.left),
              output.push(Either_09270bbc_esm_left({ _tag: "SequentialCase" }));
            break;
          case "Parallel":
            input.push(cause.right),
              input.push(cause.left),
              output.push(Either_09270bbc_esm_left({ _tag: "ParallelCase" }));
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
          "BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/io/issues"
        );
      return accumulator.pop();
    }),
    pretty = (cause) => {
      if (isInterruptedOnly(cause))
        return "All fibers interrupted without errors.";
      const final = prettyErrors(cause)
        .map((e) => {
          let message = e.message;
          if (
            (e.stack &&
              (message += `\r\n${((stack) => {
                const lines = stack.split("\n"),
                  out = [];
                for (let i = 0; i < lines.length; i++) {
                  if (
                    lines[i].includes("EffectPrimitive") ||
                    lines[i].includes("Generator.next") ||
                    lines[i].includes("FiberRuntime")
                  )
                    return out.join("\n");
                  out.push(lines[i]);
                }
                return out.join("\n");
              })(e.stack)}`),
            e.span)
          ) {
            let current = e.span,
              i = 0;
            for (; current && "Span" === current._tag && i < 10; )
              (message += `\r\n    at ${current.name}`),
                (current = Option_1d073850_esm_getOrUndefined(current.parent)),
                i++;
          }
          return message;
        })
        .join("\r\n");
      return final;
    };
  class PrettyError {
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
      if (
        "object" == typeof u &&
        null != u &&
        "toString" in u &&
        "function" == typeof u.toString &&
        u.toString !== Object.prototype.toString
      )
        return u.toString();
      if (
        "object" == typeof u &&
        null !== u &&
        "message" in u &&
        "string" == typeof u.message
      ) {
        const raw = JSON.parse(JSON.stringify(u)),
          keys = new Set(Object.keys(raw));
        if (
          (keys.delete("name"),
          keys.delete("message"),
          keys.delete("_tag"),
          0 === keys.size)
        ) {
          return `${
            "name" in u && "string" == typeof u.name ? u.name : "Error"
          }${"_tag" in u && "string" == typeof u._tag ? `(${u._tag})` : ""}: ${
            u.message
          }`;
        }
      }
      return `Error: ${JSON.stringify(u)}`;
    },
    spanSymbol$1 = Symbol.for("effect/SpanAnnotation"),
    defaultRenderError = (error) => {
      const span =
        "object" == typeof error &&
        null !== error &&
        spanSymbol$1 in error &&
        error[spanSymbol$1];
      return "object" == typeof error &&
        null !== error &&
        error instanceof Error
        ? new PrettyError(
            prettyErrorMessage(error),
            error.stack
              ?.split("\n")
              .filter((_) => !_.startsWith("Error"))
              .join("\n"),
            span
          )
        : new PrettyError(prettyErrorMessage(error), void 0, span);
    },
    prettyErrors = (cause) =>
      reduceWithContext(cause, void 0, {
        emptyCase: () => [],
        dieCase: (_, unknownError) => [defaultRenderError(unknownError)],
        failCase: (_, error) => [defaultRenderError(error)],
        interruptCase: () => [],
        parallelCase: (_, l, r) => [...l, ...r],
        sequentialCase: (_, l, r) => [...l, ...r],
      });
  const blocked = (blockedRequests, _continue) => {
      const effect = new EffectPrimitive("Blocked");
      return (effect.i0 = blockedRequests), (effect.i1 = _continue), effect;
    },
    core_9f5f0dc2_esm_EffectTypeId = Symbol.for("effect/Effect");
  class EffectPrimitive {
    i0 = void 0;
    i1 = void 0;
    i2 = void 0;
    trace = void 0;
    [core_9f5f0dc2_esm_EffectTypeId] = core_9f5f0dc2_esm_effectVariance;
    constructor(_op) {
      this._op = _op;
    }
    [Equal_7d4ae7e7_esm_symbol](that) {
      return this === that;
    }
    [Hash_039222d1_esm_symbol]() {
      return random(this);
    }
    pipe() {
      return pipeArguments(this, arguments);
    }
    toJSON() {
      return {
        _id: "Effect",
        _op: this._op,
        i0: toJSON(this.i0),
        i1: toJSON(this.i1),
        i2: toJSON(this.i2),
      };
    }
    toString() {
      return Inspectable_bda84223_esm_toString(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  class EffectPrimitiveFailure {
    i0 = void 0;
    i1 = void 0;
    i2 = void 0;
    trace = void 0;
    [core_9f5f0dc2_esm_EffectTypeId] = core_9f5f0dc2_esm_effectVariance;
    constructor(_op) {
      (this._op = _op), (this._tag = _op);
    }
    [Equal_7d4ae7e7_esm_symbol](that) {
      return this === that;
    }
    [Hash_039222d1_esm_symbol]() {
      return random(this);
    }
    get cause() {
      return this.i0;
    }
    pipe() {
      return pipeArguments(this, arguments);
    }
    toJSON() {
      return { _id: "Exit", _tag: this._op, cause: this.cause.toJSON() };
    }
    toString() {
      return Inspectable_bda84223_esm_toString(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  class EffectPrimitiveSuccess {
    i0 = void 0;
    i1 = void 0;
    i2 = void 0;
    trace = void 0;
    [core_9f5f0dc2_esm_EffectTypeId] = core_9f5f0dc2_esm_effectVariance;
    constructor(_op) {
      (this._op = _op), (this._tag = _op);
    }
    [Equal_7d4ae7e7_esm_symbol](that) {
      return this === that;
    }
    [Hash_039222d1_esm_symbol]() {
      return random(this);
    }
    get value() {
      return this.i0;
    }
    pipe() {
      return pipeArguments(this, arguments);
    }
    toJSON() {
      return { _id: "Exit", _tag: this._op, value: toJSON(this.value) };
    }
    toString() {
      return Inspectable_bda84223_esm_toString(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  const core_9f5f0dc2_esm_effectVariance = {
      _R: (_) => _,
      _E: (_) => _,
      _A: (_) => _,
    },
    withFiberRuntime = (withRuntime) => {
      const effect = new EffectPrimitive("WithRuntime");
      return (effect.i0 = withRuntime), effect;
    },
    core_9f5f0dc2_esm_as = dual(2, (self, value) =>
      core_9f5f0dc2_esm_flatMap(self, () => succeed(value))
    ),
    core_9f5f0dc2_esm_asUnit = (self) => core_9f5f0dc2_esm_as(self, void 0),
    core_9f5f0dc2_esm_async = (
      register,
      blockingOn = FiberId_556ab9ef_esm_none
    ) =>
      suspend(() => {
        let cancelerRef, controllerRef;
        const effect = new EffectPrimitive("Async");
        if (1 !== register.length) {
          const controller = new AbortController();
          (controllerRef = controller),
            (effect.i0 = (resume) => {
              cancelerRef = register(resume, controller.signal);
            });
        } else
          effect.i0 = (resume) => {
            cancelerRef = register(resume);
          };
        return (
          (effect.i1 = blockingOn),
          onInterrupt(
            effect,
            () => (
              controllerRef && controllerRef.abort(),
              cancelerRef ?? core_9f5f0dc2_esm_unit
            )
          )
        );
      }),
    asyncEither = (register, blockingOn = FiberId_556ab9ef_esm_none) =>
      core_9f5f0dc2_esm_async((resume) => {
        const result = register(resume);
        if (!Either_09270bbc_esm_isRight(result)) return result.left;
        resume(result.right);
      }, blockingOn),
    spanSymbol = Symbol.for("effect/SpanAnnotation"),
    originalSymbol = Symbol.for("effect/OriginalAnnotation"),
    capture = (obj, span) => {
      if (isCons(span)) {
        const head = span.head;
        if ("Span" === head._tag)
          return new Proxy(obj, {
            has: (target, p) =>
              p === spanSymbol || p === originalSymbol || p in target,
            get: (target, p) =>
              p === spanSymbol ? head : p === originalSymbol ? obj : target[p],
          });
      }
      return obj;
    },
    fail = (error) =>
      "object" != typeof error || null === error || spanSymbol in error
        ? failCause(fail$1(error))
        : withFiberRuntime((fiber) =>
            failCause(
              fail$1(capture(error, fiber.getFiberRef(currentTracerSpan)))
            )
          ),
    failCause = (cause) => {
      const effect = new EffectPrimitiveFailure("Failure");
      return (effect.i0 = cause), effect;
    },
    core_9f5f0dc2_esm_flatMap = dual(2, (self, f) => {
      const effect = new EffectPrimitive("OnSuccess");
      return (effect.i0 = self), (effect.i1 = f), effect;
    }),
    step = (self) => {
      const effect = new EffectPrimitive("OnStep");
      return (effect.i0 = self), (effect.i1 = exitSucceed), effect;
    },
    flatMapStep = (self, f) => {
      const effect = new EffectPrimitive("OnStep");
      return (effect.i0 = self), (effect.i1 = f), effect;
    },
    matchCauseEffect = dual(2, (self, { onFailure, onSuccess }) => {
      const effect = new EffectPrimitive("OnSuccessAndFailure");
      return (
        (effect.i0 = self),
        (effect.i1 = onFailure),
        (effect.i2 = onSuccess),
        effect
      );
    }),
    core_9f5f0dc2_esm_interruptible = (self) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      effect.i0 = enable(1);
      const _continue = (orBlock) =>
        "Blocked" === orBlock._tag
          ? blocked(orBlock.i0, core_9f5f0dc2_esm_interruptible(orBlock.i1))
          : orBlock;
      return (effect.i1 = () => flatMapStep(self, _continue)), effect;
    },
    onExit = dual(2, (self, cleanup) =>
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
            return core_9f5f0dc2_esm_zipRight(cleanup(result), result);
          },
        })
      )
    ),
    onInterrupt = dual(2, (self, cleanup) =>
      onExit(
        self,
        exitMatch({
          onFailure: (cause) =>
            isInterruptedOnly(cause)
              ? core_9f5f0dc2_esm_asUnit(cleanup(interruptors(cause)))
              : core_9f5f0dc2_esm_unit,
          onSuccess: () => core_9f5f0dc2_esm_unit,
        })
      )
    ),
    succeed = (value) => {
      const effect = new EffectPrimitiveSuccess("Success");
      return (effect.i0 = value), effect;
    },
    suspend = (effect) => core_9f5f0dc2_esm_flatMap(sync(effect), identity),
    sync = (evaluate) => {
      const effect = new EffectPrimitive("Sync");
      return (effect.i0 = evaluate), effect;
    },
    uninterruptible = (self) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      (effect.i0 = disable(1)),
        (effect.i1 = () => flatMapStep(self, _continue));
      const _continue = (orBlock) =>
        "Blocked" === orBlock._tag
          ? blocked(orBlock.i0, uninterruptible(orBlock.i1))
          : orBlock;
      return effect;
    },
    uninterruptibleMask = (f) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      effect.i0 = disable(1);
      return (
        (effect.i1 = (oldFlags) =>
          interruption(oldFlags)
            ? step(f(core_9f5f0dc2_esm_interruptible))
            : step(f(uninterruptible))),
        core_9f5f0dc2_esm_flatMap(effect, (step) =>
          "Blocked" === step._op
            ? blocked(step.i0, uninterruptible(step.i1))
            : step
        )
      );
    },
    core_9f5f0dc2_esm_unit = succeed(void 0),
    core_9f5f0dc2_esm_zipRight = dual(2, (self, that) =>
      core_9f5f0dc2_esm_flatMap(self, () => that)
    ),
    never = asyncEither(() => {
      const interval = setInterval(() => {}, 2 ** 31 - 1);
      return Either_09270bbc_esm_left(sync(() => clearInterval(interval)));
    }),
    FiberRefTypeId =
      (Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Symbol.for("effect/FiberRef")),
    fiberRefVariance = { _A: (_) => _ };
  const fiberRefUnsafeMake = (initial, options) =>
      fiberRefUnsafeMakePatch(initial, {
        differ: update(),
        fork: options?.fork ?? identity,
        join: options?.join,
      }),
    fiberRefUnsafeMakePatch = (initial, options) => ({
      [FiberRefTypeId]: fiberRefVariance,
      initial,
      diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
      combine: (first, second) => options.differ.combine(first, second),
      patch: (patch) => (oldValue) => options.differ.patch(patch, oldValue),
      fork: options.fork,
      join: options.join ?? ((_, n) => n),
      pipe() {
        return pipeArguments(this, arguments);
      },
    }),
    currentTracerSpan = globalValue(
      Symbol.for("effect/FiberRef/currentTracerSpan"),
      () => fiberRefUnsafeMake(List_c066a506_esm_empty())
    ),
    exitFailCause = (cause) => {
      const effect = new EffectPrimitiveFailure("Failure");
      return (effect.i0 = cause), effect;
    },
    exitMatch = dual(2, (self, { onFailure, onSuccess }) => {
      switch (self._tag) {
        case "Failure":
          return onFailure(self.i0);
        case "Success":
          return onSuccess(self.i0);
      }
    }),
    exitSucceed = (value) => {
      const effect = new EffectPrimitiveSuccess("Success");
      return (effect.i0 = value), effect;
    };
  const MutableHashMap_b3ab7261_esm_TypeId = Symbol.for(
    "effect/MutableHashMap"
  );
  Symbol.iterator;
  const MutableList_8c671944_esm_TypeId = Symbol.for("effect/MutableList");
  Symbol.iterator;
  const MutableQueue_54a4b584_esm_TypeId = Symbol.for("effect/MutableQueue");
  Symbol.iterator;
  const isBun = "undefined" != typeof process && !!process?.isBun;
  isBun ? clearInterval : clearTimeout, isBun || setTimeout;
  const defaultServices_86214de4_esm_TypeId = Symbol("effect/Console");
  console;
  Symbol.iterator;
  Symbol.iterator;
  const FiberTypeId = Symbol.for("effect/Fiber"),
    fiberVariance = { _E: (_) => _, _A: (_) => _ },
    fiberProto = {
      [FiberTypeId]: fiberVariance,
      pipe() {
        return pipeArguments(this, arguments);
      },
    };
  const Direction$1 = { Forward: 0, Backward: 1 };
  class RedBlackTreeIterator {
    count = 0;
    constructor(self, stack, direction) {
      (this.self = self), (this.stack = stack), (this.direction = direction);
    }
    clone() {
      return new RedBlackTreeIterator(
        this.self,
        this.stack.slice(),
        this.direction
      );
    }
    reversed() {
      return new RedBlackTreeIterator(
        this.self,
        this.stack.slice(),
        this.direction === Direction$1.Forward
          ? Direction$1.Backward
          : Direction$1.Forward
      );
    }
    next() {
      const entry = this.entry;
      switch (
        (this.count++,
        this.direction === Direction$1.Forward
          ? this.moveNext()
          : this.movePrev(),
        entry._tag)
      ) {
        case "None":
          return { done: !0, value: this.count };
        case "Some":
          return { done: !1, value: entry.value };
      }
    }
    get key() {
      return this.stack.length > 0
        ? Option_1d073850_esm_some(this.stack[this.stack.length - 1].key)
        : Option_1d073850_esm_none();
    }
    get value() {
      return this.stack.length > 0
        ? Option_1d073850_esm_some(this.stack[this.stack.length - 1].value)
        : Option_1d073850_esm_none();
    }
    get entry() {
      return this.stack.length > 0
        ? Option_1d073850_esm_some([
            this.stack[this.stack.length - 1].key,
            this.stack[this.stack.length - 1].value,
          ])
        : Option_1d073850_esm_none();
    }
    get index() {
      let idx = 0;
      const stack = this.stack;
      if (0 === stack.length) {
        const r = this.self._root;
        return null != r ? r.count : 0;
      }
      null != stack[stack.length - 1].left &&
        (idx = stack[stack.length - 1].left.count);
      for (let s = stack.length - 2; s >= 0; --s)
        stack[s + 1] === stack[s].right &&
          (++idx, null != stack[s].left && (idx += stack[s].left.count));
      return idx;
    }
    moveNext() {
      const stack = this.stack;
      if (0 === stack.length) return;
      let n = stack[stack.length - 1];
      if (null != n.right)
        for (n = n.right; null != n; ) stack.push(n), (n = n.left);
      else
        for (
          stack.pop();
          stack.length > 0 && stack[stack.length - 1].right === n;

        )
          (n = stack[stack.length - 1]), stack.pop();
    }
    get hasNext() {
      const stack = this.stack;
      if (0 === stack.length) return !1;
      if (null != stack[stack.length - 1].right) return !0;
      for (let s = stack.length - 1; s > 0; --s)
        if (stack[s - 1].left === stack[s]) return !0;
      return !1;
    }
    movePrev() {
      const stack = this.stack;
      if (0 === stack.length) return;
      let n = stack[stack.length - 1];
      if (null != n && null != n.left)
        for (n = n.left; null != n; ) stack.push(n), (n = n.right);
      else
        for (
          stack.pop();
          stack.length > 0 && stack[stack.length - 1].left === n;

        )
          (n = stack[stack.length - 1]), stack.pop();
    }
    get hasPrev() {
      const stack = this.stack;
      if (0 === stack.length) return !1;
      if (null != stack[stack.length - 1].left) return !0;
      for (let s = stack.length - 1; s > 0; --s)
        if (stack[s - 1].right === stack[s]) return !0;
      return !1;
    }
  }
  const RedBlackTreeTypeId = Symbol.for("effect/RedBlackTree"),
    isRedBlackTree$1 =
      (Hash_039222d1_esm_symbol,
      Equal_7d4ae7e7_esm_symbol,
      Symbol.iterator,
      NodeInspectSymbol,
      (u) => isObject(u) && RedBlackTreeTypeId in u),
    keys$1 = (self, direction) => {
      const begin = self[Symbol.iterator]();
      let count = 0;
      return {
        [Symbol.iterator]: () => keys$1(self, direction),
        next: () => {
          count++;
          const entry = begin.key;
          switch (
            (direction === Direction$1.Forward
              ? begin.moveNext()
              : begin.movePrev(),
            entry._tag)
          ) {
            case "None":
              return { done: !0, value: count };
            case "Some":
              return { done: !1, value: entry.value };
          }
        },
      };
    },
    RedBlackTree_22839235_esm_keys = (self) =>
      keys$1(self, Direction$1.Forward);
  const SortedSet_3339ea7f_esm_TypeId = Symbol.for("effect/SortedSet"),
    isSortedSet =
      (Hash_039222d1_esm_symbol,
      Equal_7d4ae7e7_esm_symbol,
      Symbol.iterator,
      NodeInspectSymbol,
      (u) => isObject(u) && SortedSet_3339ea7f_esm_TypeId in u);
  const Effect_d5910dae_esm_fail = fail;
  const Effectable_ec9e4204_esm_StructuralBase = StructuralBase;
  Effectable_ec9e4204_esm_StructuralBase.prototype;
  const MutableHashSet_ec9f7a0b_esm_TypeId = Symbol.for(
    "effect/MutableHashSet"
  );
  Symbol.iterator;
  Symbol.iterator;
  const SortedMap_44f47d83_esm_TypeId = Symbol.for("effect/SortedMap"),
    isSortedMap =
      (Hash_039222d1_esm_symbol,
      Equal_7d4ae7e7_esm_symbol,
      Symbol.iterator,
      NodeInspectSymbol,
      (u) => isObject(u) && SortedMap_44f47d83_esm_TypeId in u);
  Symbol.iterator;
  const program = ReadonlyArray.head([2, 3, 5]).pipe(
    Either.fromOption(() => "empty array"),
    Either.flatMap((b) =>
      ((a, b) =>
        0 === b ? Either.left("cannot divide by zero") : Either.right(a / b))(
        10,
        b
      )
    ),
    Either.match({
      onLeft: (e) => `Error: ${e}`,
      onRight: (a) => `Result: ${a}`,
    })
  );
  console.log(program);
})();
