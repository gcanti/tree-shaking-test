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
  };
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
    globalValue = (id, compute) => (
      globalStore.has(id) || globalStore.set(id, compute()), globalStore.get(id)
    ),
    Predicate_isFunction = (input) => "function" == typeof input,
    isRecordOrArray = (input) => "object" == typeof input && null !== input,
    hasProperty = Function_dual(
      2,
      (self, property) =>
        ((input) => isRecordOrArray(input) || Predicate_isFunction(input))(
          self
        ) && property in self
    ),
    isNullable = (input) => null == input,
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
  const randomHashCache = globalValue(
      Symbol.for("effect/Hash/randomHashCache"),
      () => new WeakMap()
    ),
    pcgr = globalValue(Symbol.for("effect/Hash/pcgr"), () => new PCGRandom()),
    symbol = Symbol.for("effect/Hash"),
    hash = (self) => {
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
    isHash = (u) => hasProperty(u, symbol),
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
          h ^= Function_pipe(string(keys[i]), combine(hash(o[keys[i]])));
        return optimize(h);
      })(o, Object.keys(o)),
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
      hash(self) === hash(that) &&
      self[Equal_symbol](that)
    );
  }
  const isEqual = (u) => hasProperty(u, Equal_symbol),
    NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom"),
    toJSON = (x) =>
      hasProperty(x, "toJSON") &&
      Predicate_isFunction(x.toJSON) &&
      0 === x.toJSON.length
        ? x.toJSON()
        : Array.isArray(x)
        ? x.map(toJSON)
        : x,
    format = (x) => JSON.stringify(x, null, 2);
  const EffectTypeId = Symbol.for("effect/Effect"),
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
        return ((self, args) => {
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
                args[6](
                  args[5](args[4](args[3](args[2](args[1](args[0](self))))))
                )
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
              for (let i = 0, len = args.length; i < len; i++)
                ret = args[i](ret);
              return ret;
            }
          }
        })(this, arguments);
      },
    },
    StructuralPrototype = {
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
        return cached(this, combine(hash(this._tag))(hash(this.value)));
      },
      toJSON() {
        return { _id: "Option", _tag: this._tag, value: toJSON(this.value) };
      },
    }),
    NoneHash = hash("None"),
    NoneProto = Object.assign(Object.create(CommonProto), {
      _tag: "None",
      _op: "None",
      [Equal_symbol]: (that) => isOption(that) && isNone(that),
      [symbol]: () => NoneHash,
      toJSON() {
        return { _id: "Option", _tag: this._tag };
      },
    }),
    isOption = (input) => hasProperty(input, TypeId),
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
        return combine(hash(this._tag))(hash(this.right));
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
        return combine(hash(this._tag))(hash(this.left));
      },
      toJSON() {
        return { _id: "Either", _tag: this._tag, left: toJSON(this.left) };
      },
    }),
    isEither = (input) => hasProperty(input, either_TypeId),
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
    fromOption = Function_dual(2, (self, onNone) =>
      isNone(self) ? left(onNone()) : right(self.value)
    ),
    Either_right = right,
    Either_left = left,
    Either_fromOption = fromOption,
    Either_isLeft = isLeft,
    match = Function_dual(2, (self, { onLeft, onRight }) =>
      Either_isLeft(self) ? onLeft(self.left) : onRight(self.right)
    ),
    flatMap = Function_dual(2, (self, f) =>
      Either_isLeft(self) ? Either_left(self.left) : f(self.right)
    ),
    Option_none = () => none,
    Option_some = option_some;
  Symbol.iterator;
  const constEmptyIterator = { next: () => ({ done: !0, value: void 0 }) },
    isOutOfBound =
      (Object.fromEntries, Array.isArray, (i, as) => i < 0 || i >= as.length),
    program = Function_dual(2, (self, index) => {
      const i = Math.floor(index);
      return isOutOfBound(i, self) ? Option_none() : Option_some(self[i]);
    })(0)([2, 3, 5]).pipe(
      Either_fromOption(() => "empty array"),
      flatMap((b) =>
        ((a, b) =>
          0 === b ? Either_left("cannot divide by zero") : Either_right(a / b))(
          10,
          b
        )
      ),
      match({ onLeft: (e) => `Error: ${e}`, onRight: (a) => `Result: ${a}` })
    );
  console.log(program);
})();
