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
    Function_constTrue = constant(!0),
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
  const globalStoreId = Symbol.for(
    "effect/GlobalValue/globalStoreId/2.0.0-next.55"
  );
  globalStoreId in globalThis || (globalThis[globalStoreId] = new Map());
  const globalStore = globalThis[globalStoreId],
    GlobalValue_globalValue = (id, compute) => (
      globalStore.has(id) || globalStore.set(id, compute()), globalStore.get(id)
    ),
    isString = (input) => "string" == typeof input,
    isNumber = (input) => "number" == typeof input,
    isBoolean = (input) => "boolean" == typeof input,
    isBigInt = (input) => "bigint" == typeof input,
    isSymbol = (input) => "symbol" == typeof input,
    Predicate_isFunction = (input) => "function" == typeof input,
    isUndefined = (input) => void 0 === input,
    isNever = (_) => !1,
    isRecordOrArray = (input) => "object" == typeof input && null !== input,
    isObject = (input) => isRecordOrArray(input) || Predicate_isFunction(input),
    Predicate_hasProperty = Function_dual(
      2,
      (self, property) => isObject(self) && property in self
    ),
    isTagged = Function_dual(
      2,
      (self, tag) => Predicate_hasProperty(self, "_tag") && self._tag === tag
    ),
    isNullable = (input) => null == input,
    isNotNullable = (input) => null != input,
    isIterable = (input) => Predicate_hasProperty(input, Symbol.iterator),
    isRecord = (input) => isRecordOrArray(input) && !Array.isArray(input),
    GenKindTypeId = Symbol.for("effect/Gen/GenKind");
  Symbol.iterator;
  Symbol.iterator;
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
    equivalence = () => (self, that) => equals(self, that),
    NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom"),
    toJSON = (x) =>
      Predicate_hasProperty(x, "toJSON") &&
      Predicate_isFunction(x.toJSON) &&
      0 === x.toJSON.length
        ? x.toJSON()
        : Array.isArray(x)
        ? x.map(toJSON)
        : x,
    Inspectable_toString = (x) => JSON.stringify(x, null, 2),
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
    StructProto =
      (Array.prototype,
      symbol,
      Equal_symbol,
      {
        [symbol]() {
          return structure(this);
        },
        [Equal_symbol](that) {
          const selfKeys = Object.keys(this),
            thatKeys = Object.keys(that);
          if (selfKeys.length !== thatKeys.length) return !1;
          for (const key of selfKeys)
            if (!(key in that) || !equals(this[key], that[key])) return !1;
          return !0;
        },
      }),
    Structural = (function () {
      function Structural(args) {
        args && Object.assign(this, args);
      }
      return (Structural.prototype = StructProto), Structural;
    })(),
    EffectTypeId = Symbol.for("effect/Effect"),
    StreamTypeId = Symbol.for("effect/Stream"),
    SinkTypeId = Symbol.for("effect/Sink"),
    ChannelTypeId = Symbol.for("effect/Channel"),
    effectVariance = {
      _R: (_) => _,
      _E: (_) => _,
      _A: (_) => _,
      _V: "2.0.0-next.55",
    },
    EffectPrototype = {
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
      [Equal_symbol](that) {
        return this === that;
      },
      [symbol]() {
        return random(this);
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    },
    CommitPrototype = { ...EffectPrototype, _op: "Commit" },
    TypeId = (Structural.prototype, Symbol.for("effect/Option")),
    CommonProto = {
      ...EffectPrototype,
      [TypeId]: { _A: (_) => _ },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      toString() {
        return Inspectable_toString(this.toJSON());
      },
    },
    SomeProto = Object.assign(Object.create(CommonProto), {
      _tag: "Some",
      _op: "Some",
      [Equal_symbol](that) {
        return isOption(that) && isSome(that) && equals(that.value, this.value);
      },
      [symbol]() {
        return combine(Hash_hash(this._tag))(Hash_hash(this.value));
      },
      toJSON() {
        return { _id: "Option", _tag: this._tag, value: toJSON(this.value) };
      },
    }),
    NoneProto = Object.assign(Object.create(CommonProto), {
      _tag: "None",
      _op: "None",
      [Equal_symbol]: (that) => isOption(that) && isNone(that),
      [symbol]() {
        return combine(Hash_hash(this._tag));
      },
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
      [either_TypeId]: { _A: (_) => _ },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      toString() {
        return Inspectable_toString(this.toJSON());
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
    fromOption = Function_dual(2, (self, onNone) =>
      isNone(self) ? left(onNone()) : right(self.value)
    ),
    Either_right = right,
    Either_left = left,
    Either_fromOption = fromOption,
    Either_isLeft = isLeft,
    Either_isRight = isRight,
    match = Function_dual(2, (self, { onLeft, onRight }) =>
      Either_isLeft(self) ? onLeft(self.left) : onRight(self.right)
    ),
    merge = match({ onLeft: Function_identity, onRight: Function_identity }),
    flatMap = Function_dual(2, (self, f) =>
      Either_isLeft(self) ? Either_left(self.left) : f(self.right)
    ),
    make = (isEquivalent) => (self, that) =>
      self === that || isEquivalent(self, that),
    Equivalence_mapInput = Function_dual(2, (self, f) =>
      make((x, y) => self(f(x), f(y)))
    ),
    isNonEmptyArray = (self) => self.length > 0,
    Option_none = () => none,
    Option_some = option_some,
    Option_isOption = isOption,
    Option_isNone = isNone,
    Option_isSome = isSome,
    Option_match = Function_dual(2, (self, { onNone, onSome }) =>
      Option_isNone(self) ? onNone() : onSome(self.value)
    ),
    Option_getOrElse = Function_dual(2, (self, onNone) =>
      Option_isNone(self) ? onNone() : self.value
    ),
    Option_orElse = Function_dual(2, (self, that) =>
      Option_isNone(self) ? that() : self
    ),
    Option_fromNullable = (nullableValue) =>
      null == nullableValue ? Option_none() : Option_some(nullableValue),
    Option_getOrUndefined = Option_getOrElse(Function_constUndefined),
    Option_map = Function_dual(2, (self, f) =>
      Option_isNone(self) ? Option_none() : Option_some(f(self.value))
    ),
    Option_flatMap = Function_dual(2, (self, f) =>
      Option_isNone(self) ? Option_none() : f(self.value)
    ),
    flatten = Option_flatMap(Function_identity),
    Option_getEquivalence = (isEquivalent) =>
      make(
        (x, y) =>
          x === y ||
          (Option_isNone(x)
            ? Option_isNone(y)
            : !Option_isNone(y) && isEquivalent(x.value, y.value))
      ),
    containsWith = (isEquivalent) =>
      Function_dual(
        2,
        (self, a) => !Option_isNone(self) && isEquivalent(self.value, a)
      ),
    contains = containsWith(equivalence()),
    Order_make = (compare) => (self, that) =>
      self === that ? 0 : compare(self, that),
    Order_number = Order_make((self, that) => (self < that ? -1 : 1)),
    reverse = (O) => Order_make((self, that) => O(that, self)),
    Order_mapInput = Function_dual(2, (self, f) =>
      Order_make((b1, b2) => self(f(b1), f(b2)))
    ),
    Order_all = (collection) =>
      Order_make((x, y) => {
        const len = Math.min(x.length, y.length);
        let collectionLength = 0;
        for (const O of collection) {
          if (collectionLength >= len) break;
          const o = O(x[collectionLength], y[collectionLength]);
          if (0 !== o) return o;
          collectionLength++;
        }
        return 0;
      }),
    Order_tuple = (...elements) => Order_all(elements),
    greaterThan = (O) => Function_dual(2, (self, that) => 1 === O(self, that)),
    max = (O) =>
      Function_dual(2, (self, that) =>
        self === that || O(self, that) > -1 ? self : that
      ),
    makeBy = (n, f) => {
      const max = Math.max(1, Math.floor(n)),
        out = [f(0)];
      for (let i = 1; i < max; i++) out.push(f(i));
      return out;
    },
    ReadonlyArray_fromIterable = (collection) =>
      Array.isArray(collection) ? collection : Array.from(collection),
    prepend = Function_dual(2, (self, head) => [head, ...self]),
    append = Function_dual(2, (self, last) => [...self, last]),
    isEmptyReadonlyArray = (self) => 0 === self.length,
    ReadonlyArray_isNonEmptyArray = isNonEmptyArray,
    isNonEmptyReadonlyArray = isNonEmptyArray,
    isOutOfBound = (i, as) => i < 0 || i >= as.length,
    ReadonlyArray_get = Function_dual(2, (self, index) => {
      const i = Math.floor(index);
      return isOutOfBound(i, self) ? Option_none() : Option_some(self[i]);
    }),
    unsafeGet = Function_dual(2, (self, index) => {
      const i = Math.floor(index);
      if (isOutOfBound(i, self)) throw new Error(`Index ${i} out of bounds`);
      return self[i];
    }),
    head = ReadonlyArray_get(0),
    headNonEmpty = unsafeGet(0),
    lastNonEmpty = (self) => self[self.length - 1],
    tailNonEmpty = (self) => self.slice(1),
    ReadonlyArray_reverse = (self) => Array.from(self).reverse(),
    sort = Function_dual(2, (self, O) => {
      const out = Array.from(self);
      return out.sort(O), out;
    }),
    zip = Function_dual(2, (self, that) =>
      ReadonlyArray_zipWith(self, that, (a, b) => [a, b])
    ),
    ReadonlyArray_zipWith = Function_dual(3, (self, that, f) => {
      const as = ReadonlyArray_fromIterable(self),
        bs = ReadonlyArray_fromIterable(that);
      return isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)
        ? zipNonEmptyWith(bs, f)(as)
        : [];
    }),
    zipNonEmptyWith = Function_dual(3, (self, that, f) => {
      const cs = [f(headNonEmpty(self), headNonEmpty(that))],
        len = Math.min(self.length, that.length);
      for (let i = 1; i < len; i++) cs[i] = f(self[i], that[i]);
      return cs;
    }),
    dedupeNonEmptyWith = Function_dual(2, (self, isEquivalent) => {
      const out = [headNonEmpty(self)],
        rest = tailNonEmpty(self);
      for (const a of rest)
        out.every((o) => !isEquivalent(a, o)) && out.push(a);
      return out;
    });
  const of = (a) => [a],
    ReadonlyArray_map = Function_dual(2, (self, f) => self.map(f)),
    ReadonlyArray_flatMap = Function_dual(2, (self, f) => {
      if (isEmptyReadonlyArray(self)) return [];
      const out = [];
      for (let i = 0; i < self.length; i++) out.push(...f(self[i], i));
      return out;
    }),
    ReadonlyArray_flatten = ReadonlyArray_flatMap(Function_identity),
    ReadonlyArray_reduce = Function_dual(3, (self, b, f) =>
      ReadonlyArray_fromIterable(self).reduce((b, a, i) => f(b, a, i), b)
    ),
    unfold = (b, f) => {
      const out = [];
      let o,
        next = b;
      for (; Option_isSome((o = f(next))); ) {
        const [a, b] = o.value;
        out.push(a), (next = b);
      }
      return out;
    },
    ReadonlyArray_getEquivalence = (item) =>
      make((self, that) => {
        if (self.length !== that.length) return !1;
        for (let i = 0; i < self.length; i++) {
          if (!item(self[i], that[i])) return !1;
        }
        return !0;
      }),
    dedupeWith = Function_dual(2, (self, isEquivalent) => {
      const input = ReadonlyArray_fromIterable(self);
      return isNonEmptyReadonlyArray(input)
        ? dedupeNonEmptyWith(isEquivalent)(input)
        : [];
    }),
    dedupe = dedupeWith(equivalence()),
    join = Function_dual(2, (self, sep) =>
      ReadonlyArray_fromIterable(self).join(sep)
    );
  const Number_Order = Order_number,
    ArbitraryHookId = Symbol.for("@effect/schema/ArbitraryHookId"),
    PrettyHookId = Symbol.for("@effect/schema/PrettyHookId"),
    EquivalenceHookId = Symbol.for("@effect/schema/EquivalenceHookId"),
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
    common_ownKeys =
      (Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      (o) => Object.keys(o).concat(Object.getOwnPropertySymbols(o))),
    memoizeThunk = (f) => {
      let a,
        done = !1;
      return () => (done || ((a = f()), (done = !0)), a);
    },
    IdentifierAnnotationId = Symbol.for("@effect/schema/annotation/Identifier"),
    TitleAnnotationId = Symbol.for("@effect/schema/annotation/Title"),
    DescriptionAnnotationId = Symbol.for(
      "@effect/schema/annotation/Description"
    ),
    createDeclaration = (typeParameters, type, decode, annotations = {}) => ({
      _tag: "Declaration",
      typeParameters,
      type,
      decode,
      annotations,
    }),
    createLiteral = (literal, annotations = {}) => ({
      _tag: "Literal",
      literal,
      annotations,
    }),
    isLiteral = (ast) => "Literal" === ast._tag,
    voidKeyword = {
      _tag: "VoidKeyword",
      annotations: { [TitleAnnotationId]: "void" },
    },
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
      annotations: {
        [TitleAnnotationId]: "string",
        [DescriptionAnnotationId]: "a string",
      },
    },
    isStringKeyword = (ast) => "StringKeyword" === ast._tag,
    numberKeyword = {
      _tag: "NumberKeyword",
      annotations: {
        [TitleAnnotationId]: "number",
        [DescriptionAnnotationId]: "a number",
      },
    },
    isNumberKeyword = (ast) => "NumberKeyword" === ast._tag,
    isBooleanKeyword = (ast) => "BooleanKeyword" === ast._tag,
    isBigIntKeyword = (ast) => "BigIntKeyword" === ast._tag,
    symbolKeyword = {
      _tag: "SymbolKeyword",
      annotations: {
        [TitleAnnotationId]: "symbol",
        [DescriptionAnnotationId]: "a symbol",
      },
    },
    isSymbolKeyword = (ast) => "SymbolKeyword" === ast._tag,
    objectKeyword = {
      _tag: "ObjectKeyword",
      annotations: {
        [TitleAnnotationId]: "object",
        [DescriptionAnnotationId]: "an object",
      },
    },
    createElement = (type, isOptional) => ({ type, isOptional }),
    createTuple = (elements, rest, isReadonly, annotations = {}) => ({
      _tag: "Tuple",
      elements,
      rest,
      isReadonly,
      annotations,
    }),
    createPropertySignature = (
      name,
      type,
      isOptional,
      isReadonly,
      annotations = {}
    ) => ({ name, type, isOptional, isReadonly, annotations }),
    isParameter = (ast) => {
      switch (ast._tag) {
        case "StringKeyword":
        case "SymbolKeyword":
        case "TemplateLiteral":
          return !0;
        case "Refinement":
          return isParameter(ast.from);
        default:
          return !1;
      }
    },
    createIndexSignature = (parameter, type, isReadonly) => {
      if (isParameter(parameter)) return { parameter, type, isReadonly };
      throw new Error(
        "An index signature parameter type must be 'string', 'symbol', a template literal type or a refinement of the previous types"
      );
    },
    createTypeLiteral = (
      propertySignatures,
      indexSignatures,
      annotations = {}
    ) => {
      const keys = {};
      for (let i = 0; i < propertySignatures.length; i++) {
        const name = propertySignatures[i].name;
        if (Object.prototype.hasOwnProperty.call(keys, name))
          throw new Error(`Duplicate property signature ${String(name)}`);
        keys[name] = null;
      }
      const parameters = { string: !1, symbol: !1 };
      for (let i = 0; i < indexSignatures.length; i++) {
        const parameter = getParameterBase(indexSignatures[i].parameter);
        if (isStringKeyword(parameter)) {
          if (parameters.string)
            throw new Error("Duplicate index signature for type `string`");
          parameters.string = !0;
        } else if (isSymbolKeyword(parameter)) {
          if (parameters.symbol)
            throw new Error("Duplicate index signature for type `symbol`");
          parameters.symbol = !0;
        }
      }
      return {
        _tag: "TypeLiteral",
        propertySignatures: sortPropertySignatures(propertySignatures),
        indexSignatures,
        annotations,
      };
    },
    createUnion = (candidates, annotations = {}) => {
      const types = unify(candidates);
      return ((as) => as.length > 1)(types)
        ? { _tag: "Union", types: sortUnionMembers(types), annotations }
        : isNonEmptyReadonlyArray(types)
        ? types[0]
        : neverKeyword;
    },
    createLazy = (f, annotations = {}) => ({
      _tag: "Lazy",
      f: memoizeThunk(f),
      annotations,
    }),
    createRefinement = (from, filter, annotations = {}) =>
      isTransform(from)
        ? createTransform(
            from.from,
            createRefinement(from.to, filter, annotations),
            from.transformation,
            from.annotations
          )
        : { _tag: "Refinement", from, filter, annotations },
    createTransform = (from, to, transformation, annotations = {}) => ({
      _tag: "Transform",
      from,
      to,
      transformation,
      annotations,
    }),
    isTransform = (ast) => "Transform" === ast._tag,
    createFinalPropertySignatureTransformation = (decode, encode) => ({
      _tag: "FinalPropertySignatureTransformation",
      decode,
      encode,
    }),
    createPropertySignatureTransform = (
      from,
      to,
      propertySignatureTransformation
    ) => ({ from, to, propertySignatureTransformation }),
    createTypeLiteralTransformation = (propertySignatureTransformations) => {
      const keys = {};
      for (const pst of propertySignatureTransformations) {
        const key = pst.from;
        if (keys[key])
          throw new Error(
            `Duplicate property signature transformation ${String(key)}`
          );
        keys[key] = !0;
      }
      return {
        _tag: "TypeLiteralTransformation",
        propertySignatureTransformations,
      };
    },
    AST_to = (ast) => {
      switch (ast._tag) {
        case "Declaration":
          return createDeclaration(
            ast.typeParameters.map(AST_to),
            AST_to(ast.type),
            ast.decode,
            ast.annotations
          );
        case "Tuple":
          return createTuple(
            ast.elements.map((e) =>
              createElement(AST_to(e.type), e.isOptional)
            ),
            Option_map(ast.rest, ReadonlyArray_map(AST_to)),
            ast.isReadonly,
            ast.annotations
          );
        case "TypeLiteral":
          return createTypeLiteral(
            ast.propertySignatures.map((p) =>
              createPropertySignature(
                p.name,
                AST_to(p.type),
                p.isOptional,
                p.isReadonly,
                p.annotations
              )
            ),
            ((ps) =>
              ps.map((is) =>
                createIndexSignature(
                  is.parameter,
                  AST_to(is.type),
                  is.isReadonly
                )
              ))(ast.indexSignatures),
            ast.annotations
          );
        case "Union":
          return createUnion(ast.types.map(AST_to), ast.annotations);
        case "Lazy":
          return createLazy(() => AST_to(ast.f()), ast.annotations);
        case "Refinement":
          return createRefinement(
            AST_to(ast.from),
            ast.filter,
            ast.annotations
          );
        case "Transform":
          return AST_to(ast.to);
      }
      return ast;
    },
    from = (ast) => {
      switch (ast._tag) {
        case "Declaration":
          return createDeclaration(
            ast.typeParameters.map(from),
            from(ast.type),
            ast.decode,
            ast.annotations
          );
        case "Tuple":
          return createTuple(
            ast.elements.map((e) => createElement(from(e.type), e.isOptional)),
            Option_map(ast.rest, ReadonlyArray_map(from)),
            ast.isReadonly
          );
        case "TypeLiteral":
          return createTypeLiteral(
            ast.propertySignatures.map((p) =>
              createPropertySignature(
                p.name,
                from(p.type),
                p.isOptional,
                p.isReadonly
              )
            ),
            ast.indexSignatures.map((is) =>
              createIndexSignature(is.parameter, from(is.type), is.isReadonly)
            )
          );
        case "Union":
          return createUnion(ast.types.map(from));
        case "Lazy":
          return createLazy(() => from(ast.f()));
        case "Refinement":
        case "Transform":
          return from(ast.from);
      }
      return ast;
    },
    getCardinality = (ast) => {
      switch (ast._tag) {
        case "Declaration":
          return getCardinality(ast.type);
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
    },
    sortPropertySignatures = sort(
      Function_pipe(
        Number_Order,
        Order_mapInput((ps) => getCardinality(ps.type))
      )
    ),
    WeightOrder = Order_tuple(Number_Order, Number_Order, Number_Order),
    maxWeight = max(WeightOrder),
    emptyWeight = [0, 0, 0],
    getWeight = (ast) => {
      switch (ast._tag) {
        case "Tuple":
          return [
            2,
            ast.elements.length,
            Option_isSome(ast.rest) ? ast.rest.value.length : 0,
          ];
        case "TypeLiteral": {
          const y = ast.propertySignatures.length,
            z = ast.indexSignatures.length;
          return y + z === 0 ? [-4, 0, 0] : [4, y, z];
        }
        case "Declaration": {
          const [_, y, z] = getWeight(ast.type);
          return [6, y, z];
        }
        case "Lazy":
          return [8, 0, 0];
        case "Union":
          return ast.types.map(getWeight).reduce(maxWeight, emptyWeight);
        case "Refinement": {
          const [x, y, z] = getWeight(ast.from);
          return [x + 1, y, z];
        }
        case "Transform":
          return getWeight(ast.from);
        case "ObjectKeyword":
          return [-2, 0, 0];
        case "UnknownKeyword":
        case "AnyKeyword":
          return [-4, 0, 0];
        default:
          return emptyWeight;
      }
    },
    sortUnionMembers = sort(reverse(Order_mapInput(WeightOrder, getWeight))),
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
        return Inspectable_toString(this.toJSON());
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
        return array(toReadonlyArray(this));
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
            (chunk.left = _empty),
            (chunk.right = _empty);
          break;
        case "ISingleton":
          (chunk.length = 1),
            (chunk.depth = 0),
            (chunk.left = _empty),
            (chunk.right = _empty);
          break;
        case "ISlice":
          (chunk.length = backing.length),
            (chunk.depth = backing.chunk.depth + 1),
            (chunk.left = _empty),
            (chunk.right = _empty);
      }
      return chunk;
    },
    isChunk = (u) => Predicate_hasProperty(u, Chunk_TypeId),
    _empty = makeChunk({ _tag: "IEmpty" }),
    Chunk_empty = () => _empty,
    Chunk_of = (a) => makeChunk({ _tag: "ISingleton", a }),
    Chunk_fromIterable = (self) =>
      isChunk(self)
        ? self
        : makeChunk({
            _tag: "IArray",
            array: ReadonlyArray_fromIterable(self),
          }),
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
            (self.left = _empty),
            (self.right = _empty),
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
            array: ReadonlyArray_reverse(self.backing.array),
          });
        case "IConcat":
          return makeChunk({
            _tag: "IConcat",
            left: Chunk_reverse(self.backing.right),
            right: Chunk_reverse(self.backing.left),
          });
        case "ISlice":
          return unsafeFromArray(ReadonlyArray_reverse(toReadonlyArray(self)));
      }
    },
    Chunk_get = Function_dual(2, (self, index) =>
      index < 0 || index >= self.length
        ? Option_none()
        : Option_some(Chunk_unsafeGet(self, index))
    ),
    unsafeFromArray = (self) => makeChunk({ _tag: "IArray", array: self }),
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
      Chunk_appendAllNonEmpty(self, Chunk_of(a))
    ),
    Chunk_prepend = Function_dual(2, (self, elem) =>
      Chunk_appendAllNonEmpty(Chunk_of(elem), self)
    ),
    Chunk_take = Function_dual(2, (self, n) => {
      if (n <= 0) return _empty;
      if (n >= self.length) return self;
      switch (self.backing._tag) {
        case "ISlice":
          return makeChunk({
            _tag: "ISlice",
            chunk: self.backing.chunk,
            length: n,
            offset: self.backing.offset,
          });
        case "IConcat":
          return n > self.left.length
            ? makeChunk({
                _tag: "IConcat",
                left: self.left,
                right: Chunk_take(self.right, n - self.left.length),
              })
            : Chunk_take(self.left, n);
        default:
          return makeChunk({
            _tag: "ISlice",
            chunk: self,
            offset: 0,
            length: n,
          });
      }
    }),
    Chunk_drop = Function_dual(2, (self, n) => {
      if (n <= 0) return self;
      if (n >= self.length) return _empty;
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
    Chunk_appendAllNonEmpty = Function_dual(2, (self, that) =>
      Chunk_appendAll(self, that)
    ),
    isEmpty = (self) => 0 === self.length,
    isNonEmpty = (self) => self.length > 0,
    Chunk_head = Chunk_get(0),
    unsafeHead = (self) => Chunk_unsafeGet(self, 0),
    Chunk_headNonEmpty = unsafeHead,
    Chunk_map = Function_dual(2, (self, f) =>
      "ISingleton" === self.backing._tag
        ? Chunk_of(f(self.backing.a, 0))
        : unsafeFromArray(
            Function_pipe(
              toReadonlyArray(self),
              ReadonlyArray_map((a, i) => f(a, i))
            )
          )
    ),
    Chunk_sort = Function_dual(2, (self, O) =>
      unsafeFromArray(sort(toReadonlyArray(self), O))
    ),
    Chunk_splitAt = Function_dual(2, (self, n) => [
      Chunk_take(self, n),
      Chunk_drop(self, n),
    ]),
    splitWhere = Function_dual(2, (self, predicate) => {
      let i = 0;
      for (const a of toReadonlyArray(self)) {
        if (predicate(a)) break;
        i++;
      }
      return Chunk_splitAt(self, i);
    }),
    Chunk_tailNonEmpty = (self) => Chunk_drop(self, 1),
    Chunk_dedupe = (self) => unsafeFromArray(dedupe(toReadonlyArray(self))),
    TagTypeId = Symbol.for("effect/Context/Tag"),
    STMTypeId = Symbol.for("effect/STM"),
    TagProto = {
      ...EffectPrototype,
      _tag: "Tag",
      _op: "Tag",
      [STMTypeId]: effectVariance,
      [TagTypeId]: { _S: (_) => _, _I: (_) => _ },
      toString() {
        return Inspectable_toString(this.toJSON());
      },
      toJSON() {
        return { _id: "Tag", identifier: this.identifier, stack: this.stack };
      },
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      of: (self) => self,
      context(self) {
        return context_make(this, self);
      },
    },
    tagRegistry = GlobalValue_globalValue(
      "effect/Context/Tag/tagRegistry",
      () => new Map()
    ),
    context_TypeId = Symbol.for("effect/Context"),
    ContextProto = {
      [context_TypeId]: { _S: (_) => _ },
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
        return number(this.unsafeMap.size);
      },
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
      toString() {
        return Inspectable_toString(this.toJSON());
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
    context_make = (tag, service) => makeContext(new Map([[tag, service]])),
    add = Function_dual(3, (self, tag, service) => {
      const map = new Map(self.unsafeMap);
      return map.set(tag, service), makeContext(map);
    }),
    context_unsafeGet = Function_dual(2, (self, tag) => {
      if (!self.unsafeMap.has(tag))
        throw ((tag) => {
          const error = new Error(
            "Service not found" +
              (tag.identifier ? `: ${String(tag.identifier)}` : "")
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
      return self.unsafeMap.get(tag);
    }),
    context_get = context_unsafeGet,
    getOption = Function_dual(2, (self, tag) =>
      self.unsafeMap.has(tag) ? option_some(self.unsafeMap.get(tag)) : none
    ),
    context_merge = Function_dual(2, (self, that) => {
      const map = new Map(self.unsafeMap);
      for (const [tag, s] of that.unsafeMap) map.set(tag, s);
      return makeContext(map);
    }),
    Tag = (identifier) => {
      if (identifier && tagRegistry.has(identifier))
        return tagRegistry.get(identifier);
      const limit = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      const creationError = new Error();
      Error.stackTraceLimit = limit;
      const tag = Object.create(TagProto);
      return (
        Object.defineProperty(tag, "stack", { get: () => creationError.stack }),
        identifier &&
          ((tag.identifier = identifier), tagRegistry.set(identifier, tag)),
        tag
      );
    },
    Context_empty = () => context_empty,
    Context_make = context_make,
    Context_add = add,
    Context_get = context_get,
    Context_unsafeGet = context_unsafeGet,
    Context_getOption = getOption,
    Context_merge = context_merge,
    Duration_TypeId = Symbol.for("effect/Duration"),
    bigint1e3 = BigInt(1e3),
    bigint1e9 = BigInt(1e9),
    DURATION_REGEX =
      /^(-?\d+(?:\.\d+)?)\s+(nanos|micros|millis|seconds|minutes|hours|days|weeks)$/,
    Duration_decode = (input) => {
      if (isDuration(input)) return input;
      if (isNumber(input)) return millis(input);
      if (isBigInt(input)) return Duration_nanos(input);
      {
        DURATION_REGEX.lastIndex = 0;
        const match = DURATION_REGEX.exec(input);
        if (match) {
          const [_, valueStr, unit] = match,
            value = Number(valueStr);
          switch (unit) {
            case "nanos":
              return Duration_nanos(BigInt(valueStr));
            case "micros":
              return micros(BigInt(valueStr));
            case "millis":
              return millis(value);
            case "seconds":
              return seconds(value);
            case "minutes":
              return minutes(value);
            case "hours":
              return hours(value);
            case "days":
              return days(value);
            case "weeks":
              return weeks(value);
          }
        }
      }
      throw new Error("Invalid duration input");
    },
    zeroValue = { _tag: "Millis", millis: 0 },
    infinityValue = { _tag: "Infinity" },
    DurationProto = {
      [Duration_TypeId]: Duration_TypeId,
      [symbol]() {
        return structure(this.value);
      },
      [Equal_symbol](that) {
        return isDuration(that) && Duration_equals(this, that);
      },
      toString() {
        return Inspectable_toString(this.toJSON());
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
          ? isNaN(input) || input < 0
            ? (duration.value = zeroValue)
            : Number.isFinite(input)
            ? Number.isInteger(input)
              ? (duration.value = { _tag: "Millis", millis: input })
              : (duration.value = {
                  _tag: "Nanos",
                  nanos: BigInt(Math.round(1e6 * input)),
                })
            : (duration.value = infinityValue)
          : input < BigInt(0)
          ? (duration.value = zeroValue)
          : (duration.value = { _tag: "Nanos", nanos: input }),
        duration
      );
    },
    isDuration = (u) => Predicate_hasProperty(u, Duration_TypeId),
    zero = Duration_make(0),
    Duration_nanos = (nanos) => Duration_make(nanos),
    micros = (micros) => Duration_make(micros * bigint1e3),
    millis = (millis) => Duration_make(millis),
    seconds = (seconds) => Duration_make(1e3 * seconds),
    minutes = (minutes) => Duration_make(6e4 * minutes),
    hours = (hours) => Duration_make(36e5 * hours),
    days = (days) => Duration_make(864e5 * days),
    weeks = (weeks) => Duration_make(6048e5 * weeks),
    toMillis = (self) => {
      const _self = Duration_decode(self);
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
      const _self = Duration_decode(self);
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
      const _self = Duration_decode(self),
        _that = Duration_decode(that);
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
    Duration_greaterThanOrEqualTo = Function_dual(2, (self, that) =>
      matchWith(self, that, {
        onMillis: (self, that) => self >= that,
        onNanos: (self, that) => self >= that,
      })
    ),
    Duration_equals = Function_dual(2, (self, that) =>
      ((self, that) =>
        matchWith(self, that, {
          onMillis: (self, that) => self === that,
          onNanos: (self, that) => self === that,
        }))(Duration_decode(self), Duration_decode(that))
    ),
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
  class Stack {
    value;
    previous;
    constructor(value, previous) {
      (this.value = value), (this.previous = previous);
    }
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
      (stack = new Stack(res, stack)), (currentShift += 5);
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
        return hash;
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
        return Inspectable_toString(this.toJSON());
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
    hashMap_empty = makeImpl(!1, 0, new EmptyNode(), 0),
    internal_hashMap_empty = () => hashMap_empty,
    hashMap_fromIterable = (entries) => {
      const map = beginMutation(internal_hashMap_empty());
      for (const entry of entries) set(map, entry[0], entry[1]);
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
    set = Function_dual(3, (self, key, value) =>
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
      hashMap_reduce(self, internal_hashMap_empty(), (map, value, key) =>
        set(map, key, f(value, key))
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
        return combine(Hash_hash(this._keyMap))(Hash_hash("effect/HashSet"));
      },
      [Equal_symbol](that) {
        return (
          !!isHashSet(that) &&
          hashMap_size(this._keyMap) === hashMap_size(that._keyMap) &&
          equals(this._keyMap, that._keyMap)
        );
      },
      toString() {
        return Inspectable_toString(this.toJSON());
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
    hashSet_empty = hashSet_makeImpl(internal_hashMap_empty()),
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
    hashSet_add = Function_dual(2, (self, value) =>
      self._keyMap._editable
        ? (set(value, !0)(self._keyMap), self)
        : hashSet_makeImpl(set(value, !0)(self._keyMap))
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
        hashSet_forEach(self, (value) => hashSet_add(set, value));
        for (const value of that) hashSet_add(set, value);
      })
    ),
    hashSet_forEach = Function_dual(2, (self, f) =>
      hashMap_forEach(self._keyMap, (_, k) => f(k))
    ),
    hashSet_reduce = Function_dual(3, (self, zero, f) =>
      hashMap_reduce(self._keyMap, zero, (z, _, a) => f(z, a))
    ),
    HashSet_isHashSet = isHashSet,
    HashSet_empty = internal_hashSet_empty,
    HashSet_fromIterable = (elements) => {
      const set = hashSet_beginMutation(internal_hashSet_empty());
      for (const value of elements) hashSet_add(set, value);
      return hashSet_endMutation(set);
    },
    HashSet_make = (...elements) => {
      const set = hashSet_beginMutation(internal_hashSet_empty());
      for (const value of elements) hashSet_add(set, value);
      return hashSet_endMutation(set);
    },
    HashSet_has = hashSet_has,
    HashSet_size = (self) => hashMap_size(self._keyMap),
    HashSet_add = hashSet_add,
    HashSet_remove = hashSet_remove,
    HashSet_difference = hashSet_difference,
    HashSet_union = hashSet_union,
    HashSet_reduce = hashSet_reduce,
    MutableRef_TypeId = Symbol.for("effect/MutableRef"),
    MutableRefProto = {
      [MutableRef_TypeId]: MutableRef_TypeId,
      toString() {
        return Inspectable_toString(this.toJSON());
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
    setAndGet = Function_dual(
      2,
      (self, value) => ((self.current = value), self.current)
    ),
    MutableRef_update = Function_dual(2, (self, f) =>
      MutableRef_set(self, f(MutableRef_get(self)))
    ),
    updateAndGet = Function_dual(2, (self, f) =>
      setAndGet(self, f(MutableRef_get(self)))
    ),
    FiberIdTypeId = Symbol.for("effect/FiberId");
  class None {
    [FiberIdTypeId] = FiberIdTypeId;
    _tag = "None";
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/FiberId"),
        combine(Hash_hash(this._tag))
      );
    }
    [Equal_symbol](that) {
      return isFiberId(that) && "None" === that._tag;
    }
    toString() {
      return Inspectable_toString(this.toJSON());
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
      return Function_pipe(
        Hash_hash("effect/FiberId"),
        combine(Hash_hash(this._tag)),
        combine(Hash_hash(this.id)),
        combine(Hash_hash(this.startTimeMillis))
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
      return Inspectable_toString(this.toJSON());
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
        new Runtime(id, new Date().getTime())
      );
    };
  const HashMap_empty = internal_hashMap_empty,
    HashMap_make = (...entries) => hashMap_fromIterable(entries),
    HashMap_fromIterable = hashMap_fromIterable,
    HashMap_isEmpty = (self) => self && isEmptyNode(self._root),
    HashMap_get = hashMap_get,
    HashMap_set = set,
    HashMap_keys = hashMap_keys,
    HashMap_size = hashMap_size,
    HashMap_map = hashMap_map,
    HashMap_reduce = hashMap_reduce,
    List_TypeId = Symbol.for("effect/List"),
    List_toArray = (self) => Array.from(self),
    List_getEquivalence = (isEquivalent) =>
      Equivalence_mapInput(
        ReadonlyArray_getEquivalence(isEquivalent),
        List_toArray
      ),
    List_equivalence = List_getEquivalence(equals),
    ConsProto = {
      [List_TypeId]: List_TypeId,
      _tag: "Cons",
      toString() {
        return Inspectable_toString(this.toJSON());
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
        return array(List_toArray(this));
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
    NilProto = {
      [List_TypeId]: List_TypeId,
      _tag: "Nil",
      toString() {
        return Inspectable_toString(this.toJSON());
      },
      toJSON: () => ({ _id: "List", _tag: "Nil" }),
      [NodeInspectSymbol]() {
        return this.toJSON();
      },
      [symbol]() {
        return array(List_toArray(this));
      },
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
    makeAddService = (tag, service) => {
      const o = Object.create(AddServiceProto);
      return (o.tag = tag), (o.service = service), o;
    },
    RemoveServiceProto = Object.assign(Object.create(contextPatch_PatchProto), {
      _tag: "RemoveService",
    }),
    makeRemoveService = (tag) => {
      const o = Object.create(RemoveServiceProto);
      return (o.tag = tag), o;
    },
    UpdateServiceProto = Object.assign(Object.create(contextPatch_PatchProto), {
      _tag: "UpdateService",
    }),
    makeUpdateService = (tag, update) => {
      const o = Object.create(UpdateServiceProto);
      return (o.tag = tag), (o.update = update), o;
    },
    contextPatch_combine = Function_dual(2, (self, that) =>
      ((first, second) => {
        const o = Object.create(contextPatch_AndThenProto);
        return (o.first = first), (o.second = second), o;
      })(self, that)
    ),
    contextPatch_patch = Function_dual(2, (self, context) => {
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
  const DifferTypeId = Symbol.for("effect/Differ"),
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
    andThen = Function_dual(2, (self, that) => self | that),
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
      combine: (first, second) => andThen(second)(first),
      patch: (_patch, oldValue) => runtimeFlags_patch(oldValue, _patch),
    }),
    RuntimeFlagsPatch_enable = (flag) => runtimeFlagsPatch_make(flag, flag),
    RuntimeFlagsPatch_disable = (flag) => runtimeFlagsPatch_make(flag, 0),
    RuntimeFlagsPatch_exclude = exclude,
    CauseTypeId = Symbol.for("effect/Cause"),
    proto = {
      [CauseTypeId]: { _E: (_) => _ },
      [symbol]() {
        return Function_pipe(
          Hash_hash("effect/Cause"),
          combine(Hash_hash(flattenCause(this)))
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
      const o = Object.create(proto);
      return (o._tag = "Empty"), o;
    })(),
    fail = (error) => {
      const o = Object.create(proto);
      return (o._tag = "Fail"), (o.error = error), o;
    },
    die = (defect) => {
      const o = Object.create(proto);
      return (o._tag = "Die"), (o.defect = defect), o;
    },
    interrupt = (fiberId) => {
      const o = Object.create(proto);
      return (o._tag = "Interrupt"), (o.fiberId = fiberId), o;
    },
    parallel = (left, right) => {
      const o = Object.create(proto);
      return (o._tag = "Parallel"), (o.left = left), (o.right = right), o;
    },
    sequential = (left, right) => {
      const o = Object.create(proto);
      return (o._tag = "Sequential"), (o.left = left), (o.right = right), o;
    },
    isCause = (u) => Predicate_hasProperty(u, CauseTypeId),
    isInterruptedOnly = (self) =>
      reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self),
    cause_failures = (self) =>
      Chunk_reverse(
        cause_reduce(self, Chunk_empty(), (list, cause) =>
          "Fail" === cause._tag
            ? Option_some(Function_pipe(list, Chunk_prepend(cause.error)))
            : Option_none()
        )
      ),
    cause_defects = (self) =>
      Chunk_reverse(
        cause_reduce(self, Chunk_empty(), (list, cause) =>
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
              [HashSet_empty(), Chunk_empty()],
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
              [HashSet_empty(), Chunk_empty()],
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
    flattenCause = (cause) => flattenCauseLoop(Chunk_of(cause), Chunk_empty()),
    flattenCauseLoop = (causes, flattened) => {
      for (;;) {
        const [parallel, sequential] = Function_pipe(
            causes,
            ReadonlyArray_reduce(
              [HashSet_empty(), Chunk_empty()],
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
        if (isEmpty(sequential)) return Chunk_reverse(updated);
        (causes = sequential), (flattened = updated);
      }
      throw new Error(
        "BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/effect/issues"
      );
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
        _sequential = Chunk_empty();
      for (; void 0 !== cause; )
        switch (cause._tag) {
          case "Empty":
            if (0 === stack.length) return [_parallel, _sequential];
            cause = stack.pop();
            break;
          case "Fail":
            if (
              ((_parallel = HashSet_add(_parallel, cause.error)),
              0 === stack.length)
            )
              return [_parallel, _sequential];
            cause = stack.pop();
            break;
          case "Die":
            if (
              ((_parallel = HashSet_add(_parallel, cause.defect)),
              0 === stack.length)
            )
              return [_parallel, _sequential];
            cause = stack.pop();
            break;
          case "Interrupt":
            if (
              ((_parallel = HashSet_add(_parallel, cause.fiberId)),
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
      throw new Error(
        "BUG: Cause.evaluateCauseLoop - please report an issue at https://github.com/Effect-TS/effect/issues"
      );
    },
    IsInterruptedOnlyCauseReducer = {
      emptyCase: Function_constTrue,
      failCase: constFalse,
      dieCase: constFalse,
      interruptCase: Function_constTrue,
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
    makeException = (proto, tag) => {
      const _tag = { value: tag, enumerable: !0 },
        protoWithToString = {
          ...proto,
          toString() {
            return `${this._tag}: ${this.message}`;
          },
        };
      return (message) => {
        const properties = { _tag };
        return (
          isString(message) &&
            (properties.message = { value: message, enumerable: !0 }),
          Object.create(protoWithToString, properties)
        );
      };
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
                (current = Option_getOrUndefined(current.parent)),
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
  const prettyErrorMessage = (u) =>
      "string" == typeof u
        ? `Error: ${u}`
        : Predicate_hasProperty(u, "toString") &&
          Predicate_isFunction(u.toString) &&
          u.toString !== Object.prototype.toString
        ? u.toString()
        : `Error: ${JSON.stringify(u)}`,
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
    pending = (joiners) => ({ _tag: "Pending", joiners }),
    done = (effect) => ({ _tag: "Done", effect }),
    TracerTypeId = Symbol.for("effect/Tracer"),
    tracer_make = (options) => ({ [TracerTypeId]: TracerTypeId, ...options }),
    tracerTag = Tag(Symbol.for("effect/Tracer")),
    spanTag = Tag(Symbol.for("effect/ParentSpan")),
    tracer_ids = GlobalValue_globalValue("effect/Tracer/SpanId.ids", () =>
      MutableRef_make(0)
    );
  class NativeSpan {
    name;
    parent;
    context;
    links;
    startTime;
    _tag = "Span";
    spanId;
    traceId = "native";
    sampled = !0;
    status;
    attributes;
    events = [];
    constructor(name, parent, context, links, startTime) {
      var self;
      (this.name = name),
        (this.parent = parent),
        (this.context = context),
        (this.links = links),
        (this.startTime = startTime),
        (this.status = { _tag: "Started", startTime }),
        (this.attributes = new Map()),
        (this.spanId = `span${
          ((self = tracer_ids), updateAndGet(self, (n) => n + 1))
        }`);
    }
    end = (endTime, exit) => {
      this.status = {
        _tag: "Ended",
        endTime,
        exit,
        startTime: this.status.startTime,
      };
    };
    attribute = (key, value) => {
      this.attributes.set(key, value);
    };
    event = (name, startTime, attributes) => {
      this.events.push([name, startTime, attributes ?? {}]);
    };
  }
  const nativeTracer = tracer_make({
      span: (name, parent, context, links, startTime) =>
        new NativeSpan(name, parent, context, links, startTime),
      context: (f) => f(),
    }),
    EffectErrorTypeId = Symbol.for("effect/EffectError"),
    core_blocked = (blockedRequests, _continue) => {
      const effect = new EffectPrimitive("Blocked");
      return (effect.i0 = blockedRequests), (effect.i1 = _continue), effect;
    },
    runRequestBlock = (blockedRequests) => {
      const effect = new EffectPrimitive("RunBlocked");
      return (effect.i0 = blockedRequests), effect;
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
    i0 = void 0;
    i1 = void 0;
    i2 = void 0;
    trace = void 0;
    [core_EffectTypeId] = effectVariance;
    constructor(_op) {
      this._op = _op;
    }
    [Equal_symbol](that) {
      return this === that;
    }
    [symbol]() {
      return random(this);
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
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
      return Inspectable_toString(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  class EffectPrimitiveFailure {
    _op;
    i0 = void 0;
    i1 = void 0;
    i2 = void 0;
    trace = void 0;
    [core_EffectTypeId] = effectVariance;
    constructor(_op) {
      (this._op = _op), (this._tag = _op);
    }
    [Equal_symbol](that) {
      return this === that;
    }
    [symbol]() {
      return random(this);
    }
    get cause() {
      return this.i0;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
    toJSON() {
      return { _id: "Exit", _tag: this._op, cause: this.cause.toJSON() };
    }
    toString() {
      return Inspectable_toString(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  class EffectPrimitiveSuccess {
    _op;
    i0 = void 0;
    i1 = void 0;
    i2 = void 0;
    trace = void 0;
    [core_EffectTypeId] = effectVariance;
    constructor(_op) {
      (this._op = _op), (this._tag = _op);
    }
    [Equal_symbol](that) {
      return this === that;
    }
    [symbol]() {
      return random(this);
    }
    get value() {
      return this.i0;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
    toJSON() {
      return { _id: "Exit", _tag: this._op, value: toJSON(this.value) };
    }
    toString() {
      return Inspectable_toString(this.toJSON());
    }
    [NodeInspectSymbol]() {
      return this.toJSON();
    }
  }
  const isEffect = (u) => Predicate_hasProperty(u, core_EffectTypeId),
    withFiberRuntime = (withRuntime) => {
      const effect = new EffectPrimitive("WithRuntime");
      return (effect.i0 = withRuntime), effect;
    },
    acquireUseRelease = Function_dual(3, (acquire, use, release) =>
      uninterruptibleMask((restore) =>
        core_flatMap(acquire, (a) =>
          core_flatMap(
            core_exit(suspend(() => restore(step(use(a))))),
            (exit) => {
              if ("Success" === exit._tag && "Blocked" === exit.value._op) {
                const value = exit.value;
                return core_blocked(
                  value.i0,
                  acquireUseRelease(succeed(a), () => value.i1, release)
                );
              }
              const flat = exitFlatten(exit);
              return suspend(() => release(a, flat)).pipe(
                matchCauseEffect({
                  onFailure: (cause) => {
                    switch (flat._tag) {
                      case "Failure":
                        return failCause(parallel(flat.i0, cause));
                      case "Success":
                        return failCause(cause);
                    }
                  },
                  onSuccess: () => flat,
                })
              );
            }
          )
        )
      )
    ),
    core_as = Function_dual(2, (self, value) =>
      core_flatMap(self, () => succeed(value))
    ),
    core_asUnit = (self) => core_as(self, void 0),
    core_async = (register, blockingOn = FiberId_none) =>
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
              controllerRef && controllerRef.abort(), cancelerRef ?? core_unit
            )
          )
        );
      }),
    asyncEither = (register, blockingOn = FiberId_none) =>
      core_async((resume) => {
        const result = register(resume);
        if (!Either_isRight(result)) return result.left;
        resume(result.right);
      }, blockingOn),
    catchAllCause = Function_dual(2, (self, f) => {
      const effect = new EffectPrimitive("OnFailure");
      return (effect.i0 = self), (effect.i1 = f), effect;
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
      failCauseSync(() => die(RuntimeException(message))),
    core_either = (self) =>
      matchEffect(self, {
        onFailure: (e) => succeed(Either_left(e)),
        onSuccess: (a) => succeed(Either_right(a)),
      }),
    core_exit = (self) =>
      matchCause(self, { onFailure: exitFailCause, onSuccess: exitSucceed }),
    core_fail = (error) =>
      isObject(error) && !(core_spanSymbol in error)
        ? withFiberRuntime((fiber) =>
            failCause(fail(capture(error, currentSpanFromFiber(fiber))))
          )
        : failCause(fail(error)),
    failSync = (evaluate) => core_flatMap(sync(evaluate), core_fail),
    failCause = (cause) => {
      const effect = new EffectPrimitiveFailure("Failure");
      return (effect.i0 = cause), effect;
    },
    failCauseSync = (evaluate) => core_flatMap(sync(evaluate), failCause),
    fiberId = withFiberRuntime((state) => succeed(state.id())),
    fiberIdWith = (f) => withFiberRuntime((state) => f(state.id())),
    core_flatMap = Function_dual(2, (self, f) => {
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
    matchCause = Function_dual(2, (self, { onFailure, onSuccess }) =>
      matchCauseEffect(self, {
        onFailure: (cause) => succeed(onFailure(cause)),
        onSuccess: (a) => succeed(onSuccess(a)),
      })
    ),
    matchCauseEffect = Function_dual(2, (self, { onFailure, onSuccess }) => {
      const effect = new EffectPrimitive("OnSuccessAndFailure");
      return (
        (effect.i0 = self),
        (effect.i1 = onFailure),
        (effect.i2 = onSuccess),
        effect
      );
    }),
    matchEffect = Function_dual(2, (self, { onFailure, onSuccess }) =>
      matchCauseEffect(self, {
        onFailure: (cause) => {
          const failures = cause_failures(cause);
          return cause_defects(cause).length > 0
            ? failCause(
                ((self) =>
                  cause_match(self, {
                    onEmpty: cause_empty,
                    onFail: (failure) => die(failure),
                    onDie: (defect) => die(defect),
                    onInterrupt: (fiberId) => interrupt(fiberId),
                    onSequential: (left, right) => sequential(left, right),
                    onParallel: (left, right) => parallel(left, right),
                  }))(cause)
              )
            : failures.length > 0
            ? onFailure(unsafeHead(failures))
            : failCause(cause);
        },
        onSuccess,
      })
    ),
    forEachSequential = Function_dual(2, (self, f) =>
      suspend(() => {
        const arr = ReadonlyArray_fromIterable(self),
          ret = new Array(arr.length);
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
        const arr = ReadonlyArray_fromIterable(self);
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
      effect.i0 = RuntimeFlagsPatch_enable(1);
      const _continue = (orBlock) =>
        "Blocked" === orBlock._tag
          ? core_blocked(orBlock.i0, core_interruptible(orBlock.i1))
          : orBlock;
      return (effect.i1 = () => flatMapStep(self, _continue)), effect;
    },
    core_map = Function_dual(2, (self, f) =>
      core_flatMap(self, (a) => sync(() => f(a)))
    ),
    core_mapBoth = Function_dual(2, (self, { onFailure, onSuccess }) =>
      matchEffect(self, {
        onFailure: (e) => failSync(() => onFailure(e)),
        onSuccess: (a) => sync(() => onSuccess(a)),
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
              ? core_asUnit(cleanup(interruptors(cause)))
              : core_unit,
          onSuccess: () => core_unit,
        })
      )
    ),
    succeed = (value) => {
      const effect = new EffectPrimitiveSuccess("Success");
      return (effect.i0 = value), effect;
    },
    suspend = (effect) => core_flatMap(sync(effect), Function_identity),
    sync = (evaluate) => {
      const effect = new EffectPrimitive("Sync");
      return (effect.i0 = evaluate), effect;
    },
    core_tap = Function_dual(2, (self, f) =>
      core_flatMap(self, (a) => core_as(f(a), a))
    ),
    transplant = (f) =>
      withFiberRuntime((state) => {
        const scope = Function_pipe(
          state.getFiberRef(currentForkScopeOverride),
          Option_getOrElse(() => state.scope())
        );
        return f(fiberRefLocally(currentForkScopeOverride, Option_some(scope)));
      }),
    uninterruptible = (self) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      (effect.i0 = RuntimeFlagsPatch_disable(1)),
        (effect.i1 = () => flatMapStep(self, _continue));
      const _continue = (orBlock) =>
        "Blocked" === orBlock._tag
          ? core_blocked(orBlock.i0, uninterruptible(orBlock.i1))
          : orBlock;
      return effect;
    },
    uninterruptibleMask = (f) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      effect.i0 = RuntimeFlagsPatch_disable(1);
      return (
        (effect.i1 = (oldFlags) =>
          interruption(oldFlags)
            ? step(f(core_interruptible))
            : step(f(uninterruptible))),
        core_flatMap(effect, (step) =>
          "Blocked" === step._op
            ? core_blocked(step.i0, uninterruptible(step.i1))
            : step
        )
      );
    },
    core_unit = succeed(void 0),
    updateRuntimeFlags = (patch) => {
      const effect = new EffectPrimitive("UpdateRuntimeFlags");
      return (effect.i0 = patch), (effect.i1 = void 0), effect;
    },
    whileLoop = (options) => {
      const effect = new EffectPrimitive("While");
      return (
        (effect.i0 = options.while),
        (effect.i1 = options.body),
        (effect.i2 = options.step),
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
    never = asyncEither(() => {
      const interval = setInterval(() => {}, 2 ** 31 - 1);
      return Either_left(sync(() => clearInterval(interval)));
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
      core_flatMap(
        acquireUseRelease(
          core_zipLeft(fiberRefGet(self), fiberRefSet(self, value)),
          () => step(use),
          (oldValue) => fiberRefSet(self, oldValue)
        ),
        (res) =>
          "Blocked" === res._op
            ? core_blocked(res.i0, fiberRefLocally(res.i1, self, value))
            : res
      )
    ),
    fiberRefUnsafeMake = (initial, options) =>
      fiberRefUnsafeMakePatch(initial, {
        differ: differ_update(),
        fork: options?.fork ?? Function_identity,
        join: options?.join,
      }),
    fiberRefUnsafeMakeHashSet = (initial) => {
      const differ = hashSet();
      return fiberRefUnsafeMakePatch(initial, { differ, fork: differ.empty });
    },
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
      () => fiberRefUnsafeMakeHashSet(HashSet_empty())
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
    ScopeTypeId = Symbol.for("effect/Scope"),
    scopeFork = (self, strategy) => self.fork(strategy),
    exitIsFailure = (self) => "Failure" === self._tag,
    exitCollectAll = (exits, options) =>
      exitCollectAllInternal(exits, options?.parallel ? parallel : sequential),
    exitFailCause = (cause) => {
      const effect = new EffectPrimitiveFailure("Failure");
      return (effect.i0 = cause), effect;
    },
    exitFlatMap = Function_dual(2, (self, f) => {
      switch (self._tag) {
        case "Failure":
          return exitFailCause(self.i0);
        case "Success":
          return f(self.i0);
      }
    }),
    exitFlatten = (self) => Function_pipe(self, exitFlatMap(Function_identity)),
    exitInterrupt = (fiberId) => exitFailCause(interrupt(fiberId)),
    exitMap = Function_dual(2, (self, f) => {
      switch (self._tag) {
        case "Failure":
          return exitFailCause(self.i0);
        case "Success":
          return exitSucceed(f(self.i0));
      }
    }),
    exitMatch = Function_dual(2, (self, { onFailure, onSuccess }) => {
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
    },
    exitUnit = exitSucceed(void 0),
    exitZipWith = Function_dual(3, (self, that, { onFailure, onSuccess }) => {
      switch (self._tag) {
        case "Failure":
          switch (that._tag) {
            case "Success":
              return exitFailCause(self.i0);
            case "Failure":
              return exitFailCause(onFailure(self.i0, that.i0));
          }
        case "Success":
          switch (that._tag) {
            case "Success":
              return exitSucceed(onSuccess(self.i0, that.i0));
            case "Failure":
              return exitFailCause(that.i0);
          }
      }
    }),
    exitCollectAllInternal = (exits, combineCauses) => {
      const list = Chunk_fromIterable(exits);
      return isNonEmpty(list)
        ? Function_pipe(
            Chunk_tailNonEmpty(list),
            ReadonlyArray_reduce(
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
            exitMap((chunk) => Array.from(chunk)),
            Option_some
          )
        : Option_none();
    },
    deferredUnsafeMake = (fiberId) => ({
      [DeferredTypeId]: deferredVariance,
      state: MutableRef_make(pending([])),
      blockingOn: fiberId,
      pipe() {
        return Pipeable_pipeArguments(this, arguments);
      },
    }),
    deferredAwait = (self) =>
      asyncEither((k) => {
        const state = MutableRef_get(self.state);
        switch (state._tag) {
          case "Done":
            return Either_right(state.effect);
          case "Pending":
            return (
              Function_pipe(
                self.state,
                MutableRef_set(pending([k, ...state.joiners]))
              ),
              Either_left(deferredInterruptJoiner(self, k))
            );
        }
      }, self.blockingOn),
    deferredCompleteWith = Function_dual(2, (self, effect) =>
      sync(() => {
        const state = MutableRef_get(self.state);
        switch (state._tag) {
          case "Done":
            return !1;
          case "Pending":
            Function_pipe(self.state, MutableRef_set(done(effect)));
            for (let i = 0; i < state.joiners.length; i++)
              state.joiners[i](effect);
            return !0;
        }
      })
    ),
    deferredFail = Function_dual(2, (self, error) =>
      deferredCompleteWith(self, core_fail(error))
    ),
    deferredSucceed = Function_dual(2, (self, value) =>
      deferredCompleteWith(self, succeed(value))
    ),
    deferredUnsafeDone = (self, effect) => {
      const state = MutableRef_get(self.state);
      if ("Pending" === state._tag) {
        Function_pipe(self.state, MutableRef_set(done(effect)));
        for (let i = state.joiners.length - 1; i >= 0; i--)
          state.joiners[i](effect);
      }
    },
    deferredInterruptJoiner = (self, joiner) =>
      sync(() => {
        const state = MutableRef_get(self.state);
        "Pending" === state._tag &&
          Function_pipe(
            self.state,
            MutableRef_set(pending(state.joiners.filter((j) => j !== joiner)))
          );
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
      const span = fiber.getFiberRef(currentContext).unsafeMap.get(spanTag);
      return void 0 !== span && "Span" === span._tag
        ? Option_some(span)
        : Option_none();
    },
    isBun = "undefined" != typeof process && !!process?.isBun,
    clear = isBun ? (id) => clearInterval(id) : (id) => clearTimeout(id),
    timeout_set = isBun
      ? (fn, ms) => {
          const id = setInterval(() => {
            fn(), clearInterval(id);
          }, ms);
          return id;
        }
      : (fn, ms) => setTimeout(fn, ms),
    ClockTypeId = Symbol.for("effect/Clock"),
    clockTag = Tag(ClockTypeId),
    globalClockScheduler = {
      unsafeSchedule(task, duration) {
        const millis = toMillis(duration);
        if (millis > 2147483647) return constFalse;
        let completed = !1;
        const handle = timeout_set(() => {
          (completed = !0), task();
        }, millis);
        return () => (clear(handle), !completed);
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
      return asyncEither((cb) => {
        const canceler = globalClockScheduler.unsafeSchedule(
          () => cb(core_unit),
          duration
        );
        return Either_left(core_asUnit(sync(canceler)));
      });
    }
  }
  const clock_make = () => new ClockImpl(),
    ConfigErrorTypeId = Symbol.for("effect/ConfigError"),
    configError_proto = { [ConfigErrorTypeId]: ConfigErrorTypeId },
    And = (self, that) => {
      const error = Object.create(configError_proto);
      return (
        (error._tag = "And"),
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
        (error._tag = "Or"),
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
        (error._tag = "InvalidData"),
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
        (error._tag = "MissingData"),
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
        (error._tag = "SourceUnavailable"),
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
        (error._tag = "Unsupported"),
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
      switch (self._tag) {
        case "And":
          return And(prefixed(prefix)(self.left), prefixed(prefix)(self.right));
        case "Or":
          return Or(prefixed(prefix)(self.left), prefixed(prefix)(self.right));
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
            (output = ReadonlyArray_map(output, patch.f)), (input = input.tail);
            break;
          case "Nested":
            (output = prepend(output, patch.name)), (input = input.tail);
            break;
          case "Unnested":
            if (!Function_pipe(head(output), contains(patch.name)))
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
    configProviderTag = Tag(ConfigProviderTypeId),
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
            Option_match(head(chunk), {
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
    fromEnv = (config = {}) => {
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
                keys = Object.keys(current),
                keyPaths = Array.from(keys).map((value) =>
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
          return succeed(of(op.value));
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
                  Function_pipe(op.mapOrFail(a), mapError(prefixed(prefix)))
                )
              )
            )
          );
        case "Nested":
          return suspend(() =>
            fromFlatLoop(flat, concat(prefix, of(op.name)), op.config, split)
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
                      Option_getOrElse(() => "<n/a>")
                    );
                    return core_fail(
                      (
                        (name) => (self) =>
                          MissingData(
                            [],
                            `Expected ${self.description} with name ${name}`
                          )
                      )(name)
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
                          of
                        )
                      )
                    : Function_pipe(
                        forEachSequential(indices, (index) =>
                          fromFlatLoop(
                            flat,
                            append(prefix, `[${index}]`),
                            op.config,
                            !0
                          )
                        ),
                        core_map((chunkChunk) => {
                          const flattened = ReadonlyArray_flatten(chunkChunk);
                          return 0 === flattened.length
                            ? of([])
                            : of(flattened);
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
                          concat(prefix, of(key)),
                          op.valueConfig,
                          split
                        )
                      ),
                      core_map((values) => {
                        if (0 === values.length) return of(HashMap_empty());
                        const matrix = values.map((x) => Array.from(x));
                        return Function_pipe(
                          transpose(matrix),
                          ReadonlyArray_map((values) =>
                            HashMap_fromIterable(
                              zip(ReadonlyArray_fromIterable(keys), values)
                            )
                          )
                        );
                      })
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
                          const leftPad = unfold(left.length, (index) =>
                              index >= right.length
                                ? Option_none()
                                : Option_some([leftDef(index), index + 1])
                            ),
                            rightPad = unfold(right.length, (index) =>
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
                          Function_pipe(
                            left.right,
                            ReadonlyArray_map(Either_right)
                          ),
                          Function_pipe(
                            right.right,
                            ReadonlyArray_map(Either_right)
                          )
                        );
                      return Function_pipe(
                        lefts,
                        zip(rights),
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
              text.split(new RegExp(`\\s*${escapeRegex(delim)}\\s*`)))(
              text,
              delimiter
            ),
            forEachSequential((char) => primitive.parse(char.trim())),
            mapError(prefixed(path))
          )
        : Function_pipe(
            primitive.parse(text),
            core_map(of),
            mapError(prefixed(path))
          ),
    transpose = (array) =>
      Object.keys(array[0]).map((column) => array.map((row) => row[column])),
    escapeRegex = (string) => string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&"),
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
          Option_flatMap(parseInteger)
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
    consoleTag = Tag(console_TypeId),
    defaultConsole = {
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
    randomTag = Tag(RandomTypeId);
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
                  core_map((k) => swap(buffer, n - 1, k))
                )
              ),
              core_as(Chunk_fromIterable(buffer))
            );
          })
        )
      ),
    swap = (buffer, index1, index2) => {
      const tmp = buffer[index1];
      return (buffer[index1] = buffer[index2]), (buffer[index2] = tmp), buffer;
    },
    random_make = (seed) => new RandomImpl(seed),
    liveServices = Function_pipe(
      Context_empty(),
      Context_add(clockTag, clock_make()),
      Context_add(consoleTag, defaultConsole),
      Context_add(randomTag, random_make((4294967296 * Math.random()) >>> 0)),
      Context_add(configProviderTag, fromEnv()),
      Context_add(tracerTag, nativeTracer)
    ),
    currentServices = GlobalValue_globalValue(
      Symbol.for("effect/DefaultServices/currentServices"),
      () => fiberRefUnsafeMakeContext(liveServices)
    );
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
  const findAncestor = (
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
            : parentFiberId.startTimeMillis > childFiberId.startTimeMillis
            ? (parentStack = parentAncestors)
            : parentFiberId.id < childFiberId.id
            ? ((childStack = childAncestors), (childModified = !0))
            : parentFiberId.id > childFiberId.id
            ? (parentStack = parentAncestors)
            : (ret = [childRefValue, childModified]);
        } else ret = [ref.initial, !0];
      return ret;
    },
    joinAs = Function_dual(3, (self, fiberId, that) => {
      const parentFiberRefs = new Map(self.locals);
      for (const [fiberRef, childStack] of that.locals) {
        const childValue = headNonEmpty(childStack)[1];
        if (!equals(headNonEmpty(childStack)[0], fiberId)) {
          if (!parentFiberRefs.has(fiberRef)) {
            if (equals(childValue, fiberRef.initial)) continue;
            parentFiberRefs.set(fiberRef, [
              [fiberId, fiberRef.join(fiberRef.initial, childValue)],
            ]);
            continue;
          }
          const parentStack = parentFiberRefs.get(fiberRef),
            [ancestor, wasModified] = findAncestor(
              fiberRef,
              parentStack,
              childStack
            );
          if (wasModified) {
            const patch = fiberRef.diff(ancestor, childValue),
              oldValue = headNonEmpty(parentStack)[1],
              newValue = fiberRef.join(
                oldValue,
                fiberRef.patch(patch)(oldValue)
              );
            if (!equals(oldValue, newValue)) {
              let newStack;
              const parentFiberId = headNonEmpty(parentStack)[0];
              (newStack = equals(parentFiberId, fiberId)
                ? prepend([parentFiberId, newValue])(tailNonEmpty(parentStack))
                : prepend([fiberId, newValue])(parentStack)),
                parentFiberRefs.set(fiberRef, newStack);
            }
          }
        }
      }
      return new FiberRefsImpl(new Map(parentFiberRefs));
    }),
    forkAs = Function_dual(2, (self, childId) => {
      const map = new Map();
      for (const [fiberRef, stack] of self.locals.entries()) {
        const oldValue = headNonEmpty(stack)[1],
          newValue = fiberRef.patch(fiberRef.fork)(oldValue);
        equals(oldValue, newValue)
          ? map.set(fiberRef, stack)
          : map.set(fiberRef, prepend([childId, newValue])(stack));
      }
      return new FiberRefsImpl(map);
    }),
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
        Option_getOrElse(() => fiberRef.initial)
      )
    ),
    updatedAs = Function_dual(2, (self, { fiberId, fiberRef, value }) => {
      const oldStack = self.locals.has(fiberRef)
        ? self.locals.get(fiberRef)
        : [];
      let newStack;
      if (isEmptyReadonlyArray(oldStack)) newStack = of([fiberId, value]);
      else {
        const [currentId, currentValue] = headNonEmpty(oldStack);
        if (equals(currentId, fiberId)) {
          if (equals(currentValue, value)) return self;
          newStack = prepend([fiberId, value])(tailNonEmpty(oldStack));
        } else newStack = prepend([fiberId, value])(oldStack);
      }
      const locals = new Map(self.locals);
      return new FiberRefsImpl(locals.set(fiberRef, newStack));
    }),
    FiberRefs_getOrDefault = getOrDefault,
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
    LogLevel_greaterThan = greaterThan(LogLevel_Order),
    LogSpan_render = (now) => (self) =>
      `${self.label.replace(/[\s="]/g, "_")}=${now - self.startTime}ms`;
  const MetricLabelTypeId = Symbol.for("effect/MetricLabel");
  class MetricLabelImpl {
    key;
    value;
    [MetricLabelTypeId] = MetricLabelTypeId;
    constructor(key, value) {
      (this.key = key), (this.value = value);
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/MetricLabel"),
        combine(Hash_hash(this.key)),
        combine(Hash_hash(this.value))
      );
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
    isMetricLabel = (u) => Predicate_hasProperty(u, MetricLabelTypeId);
  Symbol.iterator;
  Symbol.iterator;
  const MutableHashMap_TypeId = Symbol.for("effect/MutableHashMap"),
    MutableHashMapProto = {
      [MutableHashMap_TypeId]: MutableHashMap_TypeId,
      [Symbol.iterator]() {
        return this.backingMap.current[Symbol.iterator]();
      },
      toString() {
        return Inspectable_toString(this.toJSON());
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
    },
    fromHashMap = (backingMap) => {
      const map = Object.create(MutableHashMapProto);
      return (map.backingMap = MutableRef_make(backingMap)), map;
    },
    MutableHashMap_empty = () => fromHashMap(HashMap_empty()),
    MutableHashMap_get = Function_dual(2, (self, key) =>
      HashMap_get(self.backingMap.current, key)
    ),
    MutableHashMap_has = Function_dual(2, (self, key) =>
      Option_isSome(MutableHashMap_get(self, key))
    ),
    MutableHashMap_set = Function_dual(
      3,
      (self, key, value) => (
        MutableRef_update(self.backingMap, HashMap_set(key, value)), self
      )
    );
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
        ? timeout_set(() => this.starveInternal(0), 0)
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
  const currentScheduler = GlobalValue_globalValue(
      Symbol.for("effect/FiberRef/currentScheduler"),
      () => fiberRefUnsafeMake(defaultScheduler)
    ),
    executionStrategy_sequential = { _tag: "Sequential" },
    executionStrategy_parallel = { _tag: "Parallel" },
    FiberStatusTypeId = Symbol.for("effect/FiberStatus");
  class Done {
    [FiberStatusTypeId] = FiberStatusTypeId;
    _tag = "Done";
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/FiberStatus"),
        combine(Hash_hash(this._tag))
      );
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
        combine(Hash_hash(this.runtimeFlags))
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
        combine(Hash_hash(this.blockingOn))
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
    currentFiberURI = "effect/FiberCurrent",
    Effectable_EffectTypeId = EffectTypeId;
  const ExecutionStrategy_sequential = executionStrategy_sequential,
    ExecutionStrategy_parallel = executionStrategy_parallel,
    ExecutionStrategy_parallelN = (parallelism) => ({
      _tag: "ParallelN",
      parallelism,
    }),
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
              ((parallel = parallelCollectionCombine(
                parallel,
                parallelCollectionMake(
                  current.dataSource,
                  current.blockedRequest
                )
              )),
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
    parallelCollectionMake = (dataSource, blockedRequest) =>
      new ParallelImpl(HashMap_make([dataSource, Array.of(blockedRequest)])),
    parallelCollectionCombine = (self, that) =>
      new ParallelImpl(
        HashMap_reduce(self.map, that.map, (map, value, key) =>
          HashMap_set(
            map,
            key,
            Option_match(HashMap_get(map, key), {
              onNone: () => value,
              onSome: (a) => [...a, ...value],
            })
          )
        )
      ),
    parallelCollectionIsEmpty = (self) => HashMap_isEmpty(self.map),
    parallelCollectionKeys = (self) => Array.from(HashMap_keys(self.map)),
    parallelCollectionToSequentialCollection = (self) =>
      sequentialCollectionMake(HashMap_map(self.map, (x) => Array.of(x))),
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
            Option_match(HashMap_get(map, key), {
              onNone: () => [],
              onSome: (a) => [...a, ...value],
            })
          )
        )
      ),
    sequentialCollectionKeys = (self) => Array.from(HashMap_keys(self.map)),
    completedRequestMap_currentRequestMap = GlobalValue_globalValue(
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
        const stringMessage = serializeUnknown(message);
        if (
          (stringMessage.length > 0 &&
            ((output += " message="),
            (output = appendQuoted(stringMessage, output))),
          null != cause &&
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
              (output = appendQuoted(serializeUnknown(value), output));
        }
        return output;
      }
    ),
    serializeUnknown = (u) => {
      try {
        return "object" == typeof u ? JSON.stringify(u) : String(u);
      } catch (_) {
        return String(u);
      }
    },
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
      (this.incremental = incremental), (this.bigint = bigint);
    }
    [symbol]() {
      return Hash_hash("effect/MetricKeyType/Counter");
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
      this.boundaries = boundaries;
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/MetricKeyType/Histogram"),
        combine(Hash_hash(this.boundaries))
      );
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
    metricKeyVariance = { _Type: (_) => _ };
  class MetricKeyImpl {
    name;
    keyType;
    description;
    tags;
    [MetricKeyTypeId] = metricKeyVariance;
    constructor(name, keyType, description, tags = HashSet_empty()) {
      (this.name = name),
        (this.keyType = keyType),
        (this.description = description),
        (this.tags = tags);
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash(this.name),
        combine(Hash_hash(this.keyType)),
        combine(Hash_hash(this.description)),
        combine(Hash_hash(this.tags))
      );
    }
    [Equal_symbol](u) {
      return (
        isMetricKey(u) &&
        this.name === u.name &&
        equals(this.keyType, u.keyType) &&
        equals(this.description, u.description) &&
        equals(this.tags, u.tags)
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
        Option_fromNullable(options?.description)
      ),
    key_histogram = (name, boundaries, description) =>
      new MetricKeyImpl(
        name,
        ((boundaries) => new HistogramKeyType(boundaries))(boundaries),
        Option_fromNullable(description)
      ),
    taggedWithLabelSet = Function_dual(2, (self, extraTags) =>
      0 === HashSet_size(extraTags)
        ? self
        : new MetricKeyImpl(
            self.name,
            self.keyType,
            self.description,
            Function_pipe(self.tags, HashSet_union(extraTags))
          )
    ),
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
        combine(Hash_hash(this.count))
      );
    }
    [Equal_symbol](that) {
      return isCounterState(that) && this.count === that.count;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  class FrequencyState {
    occurrences;
    [MetricStateTypeId] = metricStateVariance;
    [FrequencyStateTypeId] = FrequencyStateTypeId;
    constructor(occurrences) {
      this.occurrences = occurrences;
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/MetricState/Frequency"),
        combine(Hash_hash(this.occurrences))
      );
    }
    [Equal_symbol](that) {
      return (
        isFrequencyState(that) && equals(this.occurrences, that.occurrences)
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
        combine(Hash_hash(this.value))
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
        combine(Hash_hash(this.sum))
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
        combine(Hash_hash(this.sum))
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
    hook_frequency = (_key) => {
      let count = 0;
      const values = new Map();
      return hook_make({
        get: () => {
          return (
            (occurrences = HashMap_fromIterable(values.entries())),
            new FrequencyState(occurrences)
          );
          var occurrences;
        },
        update: (word) => {
          count += 1;
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
        Chunk_sort(Number_Order),
        Chunk_map((n, i) => {
          boundaries[i] = n;
        })
      );
      const getBuckets = () => {
        const builder = Array(size);
        let cumulated = 0;
        for (let i = 0; i < size; i++) {
          const boundary = boundaries[i];
          (cumulated += values[i]), (builder[i] = [boundary, cumulated]);
        }
        return unsafeFromArray(builder);
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
        sortedQuantiles = Function_pipe(quantiles, Chunk_sort(Number_Order)),
        values = Array(maxSize);
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
              age = millis(now - t);
            Duration_greaterThanOrEqualTo(age, zero) &&
              age <= maxAge &&
              builder.push(v);
          }
          i += 1;
        }
        return calculateQuantiles(
          error,
          sortedQuantiles,
          Function_pipe(unsafeFromArray(builder), Chunk_sort(Number_Order))
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
      if (isEmpty(sortedQuantiles)) return Chunk_empty();
      const head = unsafeHead(sortedQuantiles),
        tail = Function_pipe(sortedQuantiles, Chunk_drop(1)),
        resolved = Function_pipe(
          tail,
          ReadonlyArray_reduce(
            Chunk_of(
              resolveQuantile(
                error,
                sampleCount,
                Option_none(),
                0,
                head,
                sortedSamples
              )
            ),
            (accumulator, quantile) => {
              const h = unsafeHead(accumulator);
              return Function_pipe(
                accumulator,
                Chunk_append(
                  resolveQuantile(
                    error,
                    sampleCount,
                    h.value,
                    h.consumed,
                    quantile,
                    h.rest
                  )
                )
              );
            }
          )
        );
      return Function_pipe(
        resolved,
        Chunk_map((rq) => [rq.quantile, rq.value])
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
        if (isEmpty(rest_1))
          return {
            quantile: quantile_1,
            value: Option_none(),
            consumed: consumed_1,
            rest: Chunk_empty(),
          };
        if (1 === quantile_1)
          return {
            quantile: quantile_1,
            value: Option_some(
              ((self = rest_1), Chunk_unsafeGet(self, self.length - 1))
            ),
            consumed: consumed_1 + rest_1.length,
            rest: Chunk_empty(),
          };
        const sameHead = Function_pipe(
            rest_1,
            splitWhere((n) => n > unsafeHead(rest_1))
          ),
          desired = quantile_1 * sampleCount_1,
          allowedError = (error_1 / 2) * desired,
          candConsumed = consumed_1 + sameHead[0].length,
          candError = Math.abs(candConsumed - desired);
        if (candConsumed < desired - allowedError)
          (error_2 = error_1),
            (sampleCount_2 = sampleCount_1),
            (current_2 = Chunk_head(rest_1)),
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
                (current_2 = Chunk_head(rest_1)),
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
                  (current_2 = Chunk_head(rest_1)),
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
      var self;
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
      return HashSet_fromIterable(result);
    }
    get(key) {
      const hook = Function_pipe(
        this.map,
        MutableHashMap_get(key),
        Option_getOrUndefined
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
        Option_getOrUndefined
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
        Option_getOrUndefined
      );
      if (null == value) {
        const frequency = hook_frequency();
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
        Option_getOrUndefined
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
        Option_getOrUndefined
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
        Option_getOrUndefined
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
        (effect) =>
          core_tap(effect, (a) => sync(() => unsafeUpdate(a, HashSet_empty()))),
        {
          [MetricTypeId]: metricVariance,
          keyType,
          unsafeUpdate,
          unsafeValue,
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
      const hook = (extraTags) => {
        const fullKey = Function_pipe(key, taggedWithLabelSet(extraTags));
        return globalMetricRegistry.get(fullKey);
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
      metric_taggedWithLabels(self, HashSet_make(label_make(key, value)))
    ),
    metric_taggedWithLabels = Function_dual(2, (self, extraTagsIterable) => {
      const extraTags = HashSet_isHashSet(extraTagsIterable)
        ? extraTagsIterable
        : HashSet_fromIterable(extraTagsIterable);
      return metric_make(
        self.keyType,
        (input, extraTags1) =>
          self.unsafeUpdate(
            input,
            Function_pipe(extraTags, HashSet_union(extraTags1))
          ),
        (extraTags1) =>
          self.unsafeValue(Function_pipe(extraTags, HashSet_union(extraTags1)))
      );
    }),
    MetricBoundariesTypeId = Symbol.for("effect/MetricBoundaries");
  class MetricBoundariesImpl {
    values;
    [MetricBoundariesTypeId] = MetricBoundariesTypeId;
    constructor(values) {
      this.values = values;
    }
    [symbol]() {
      return Function_pipe(
        Hash_hash("effect/MetricBoundaries"),
        combine(Hash_hash(this.values))
      );
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
    fromChunk = (chunk) => {
      const values = Function_pipe(
        chunk,
        Chunk_appendAll(Chunk_of(Number.POSITIVE_INFINITY)),
        Chunk_dedupe
      );
      return new MetricBoundariesImpl(values);
    },
    exponential = (options) =>
      Function_pipe(
        makeBy(
          options.count - 1,
          (i) => options.start * Math.pow(options.factor, i)
        ),
        unsafeFromArray,
        fromChunk
      ),
    request_complete = Function_dual(2, (self, result) =>
      fiberRefGetWith(completedRequestMap_currentRequestMap, (map) =>
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
      () => ((effect) => new Const(effect))(core_unit)
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
    fiberStarted = metric_counter("effect_fiber_started"),
    fiberActive = metric_counter("effect_fiber_active"),
    fiberSuccesses = metric_counter("effect_fiber_successes"),
    fiberFailures = metric_counter("effect_fiber_failures"),
    fiberLifetimes = metric_tagged(
      metric_histogram(
        "effect_fiber_lifetimes",
        exponential({ start: 1, factor: 1.3, count: 100 })
      ),
      "time_unit",
      "milliseconds"
    ),
    runtimeFiberVariance = { _E: (_) => _, _A: (_) => _ },
    fiberRuntime_absurd = (_) => {
      throw new Error(
        `BUG: FiberRuntime - ${JSON.stringify(
          _
        )} - please report an issue at https://github.com/Effect-TS/effect/issues`
      );
    },
    contOpSuccess = {
      OnSuccess: (_, cont, value) => cont.i1(value),
      OnStep: (_, cont, value) => cont.i1(exitSucceed(value)),
      OnSuccessAndFailure: (_, cont, value) => cont.i2(value),
      RevertFlags: (self, cont, value) => (
        self.patchRuntimeFlags(self._runtimeFlags, cont.patch),
        interruptible(self._runtimeFlags) && self.isInterrupted()
          ? exitFailCause(self.getInterruptedCause())
          : exitSucceed(value)
      ),
      While: (self, cont, value) => (
        cont.i2(value),
        cont.i0() ? (self.pushStack(cont), cont.i1()) : core_unit
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
          forEachParUnboundedDiscard(
            ((self) => Array.from(self.map))(requestsByRequestResolver),
            ([dataSource, sequential]) => {
              const map = new Map();
              for (const block of sequential)
                for (const entry of block) map.set(entry.request, entry);
              return fiberRefLocally(
                invokeWithInterrupt(
                  dataSource.runAll(sequential),
                  sequential.flat()
                ),
                completedRequestMap_currentRequestMap,
                map
              );
            },
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
    _steps = [!1];
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
      return sync(() => Option_fromNullable(this._exitValue));
    }
    unsafePoll() {
      return this._exitValue;
    }
    interruptAsFork(fiberId) {
      return sync(() => this.tell(interruptSignal(interrupt(fiberId))));
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
      (this._fiberRefs = updatedAs(this._fiberRefs, {
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
      return !(
        "Empty" === (self = this.getFiberRef(currentInterruptedCause))._tag ||
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
        })
      );
      var self;
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
            : core_asUnit(next.value.await);
        };
        return whileLoop({ while: () => !isDone, body, step: () => {} });
      }
      return null;
    }
    reportExitValue(exit) {
      if (runtimeMetrics(this._runtimeFlags)) {
        const tags = this.getFiberRef(currentMetricLabels);
        switch ((fiberActive.unsafeUpdate(-1, tags), exit._tag)) {
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
            "Fiber terminated with a non handled error",
            exit.cause,
            level
          );
      }
    }
    setExitValue(exit) {
      if (((this._exitValue = exit), runtimeMetrics(this._runtimeFlags))) {
        const tags = this.getFiberRef(currentMetricLabels),
          startTimeMillis = this.id().startTimeMillis,
          endTimeMillis = new Date().getTime();
        fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
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
        for (; null !== effect; )
          try {
            const eff = effect,
              exit = this.runLoop(eff);
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
          } catch (e) {
            if (!isEffect(e)) throw e;
            "Yield" === e._op
              ? ((self = this._runtimeFlags),
                runtimeFlags_isEnabled(self, 32)
                  ? (this.tell({ _tag: "YieldNow" }),
                    this.tell(resume(exitUnit)),
                    (effect = null))
                  : (effect = exitUnit))
              : "Async" === e._op && (effect = null);
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
        "OnStep" === cont._op && this._steps.push(!0),
        "RevertFlags" === cont._op && this._steps.push(!1);
    }
    popStack() {
      const item = this._stack.pop();
      if (item)
        return (
          ("OnStep" !== item._op && "RevertFlags" !== item._op) ||
            this._steps.pop(),
          item
        );
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
      return core_map(fiberRefGet(currentContext), (context) => {
        try {
          return Context_unsafeGet(context, op);
        } catch (e) {
          throw (console.log(e), e);
        }
      });
    }
    Left(op) {
      return core_fail(op.left);
    }
    None(_) {
      return core_fail(NoSuchElementException());
    }
    Right(op) {
      return exitSucceed(op.right);
    }
    Some(op) {
      return exitSucceed(op.value);
    }
    Sync(op) {
      const value = op.i0(),
        cont = this.getNextSuccessCont();
      if (void 0 !== cont)
        return (
          cont._op in contOpSuccess || fiberRuntime_absurd(cont),
          contOpSuccess[cont._op](this, cont, value)
        );
      throw exitSucceed(value);
    }
    Success(op) {
      const oldCur = op,
        cont = this.getNextSuccessCont();
      if (void 0 !== cont)
        return (
          cont._op in contOpSuccess || fiberRuntime_absurd(cont),
          contOpSuccess[cont._op](this, cont, oldCur.i0)
        );
      throw oldCur;
    }
    Failure(op) {
      const cause = op.i0,
        cont = this.getNextFailCont();
      if (void 0 === cont) throw exitFailCause(cause);
      switch (cont._op) {
        case "OnFailure":
        case "OnSuccessAndFailure":
          return interruptible(this._runtimeFlags) && this.isInterrupted()
            ? exitFailCause(stripFailures(cause))
            : cont.i1(cause);
        case "OnStep":
          return interruptible(this._runtimeFlags) && this.isInterrupted()
            ? exitFailCause(stripFailures(cause))
            : cont.i1(exitFailCause(cause));
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
      return op.i0(this, FiberStatus_running(this._runtimeFlags));
    }
    Blocked(op) {
      if (this._steps[this._steps.length - 1]) {
        const nextOp = this.popStack();
        if (nextOp)
          switch (nextOp._op) {
            case "OnStep":
              return nextOp.i1(op);
            case "OnSuccess":
              return core_blocked(op.i0, core_flatMap(op.i1, nextOp.i1));
            case "OnSuccessAndFailure":
              return core_blocked(
                op.i0,
                matchCauseEffect(op.i1, {
                  onFailure: nextOp.i1,
                  onSuccess: nextOp.i2,
                })
              );
            case "OnFailure":
              return core_blocked(op.i0, catchAllCause(op.i1, nextOp.i1));
            case "While":
              return core_blocked(
                op.i0,
                core_flatMap(
                  op.i1,
                  (a) => (
                    nextOp.i2(a),
                    nextOp.i0()
                      ? whileLoop({
                          while: nextOp.i0,
                          body: nextOp.i1,
                          step: nextOp.i2,
                        })
                      : core_unit
                  )
                )
              );
            case "RevertFlags":
              this.pushStack(nextOp);
          }
      }
      return uninterruptibleMask((restore) =>
        core_flatMap(fork(runRequestBlock(op.i0)), () => restore(op.i1))
      );
    }
    RunBlocked(op) {
      return runBlockedRequests(op.i0);
    }
    UpdateRuntimeFlags(op) {
      const updateFlags = op.i0,
        oldRuntimeFlags = this._runtimeFlags,
        newRuntimeFlags = runtimeFlags_patch(oldRuntimeFlags, updateFlags);
      if (interruptible(newRuntimeFlags) && this.isInterrupted())
        return exitFailCause(this.getInterruptedCause());
      if ((this.patchRuntimeFlags(this._runtimeFlags, updateFlags), op.i1)) {
        const revertFlags = runtimeFlags_diff(newRuntimeFlags, oldRuntimeFlags);
        return (
          this.pushStack(new RevertFlags(revertFlags, op)),
          op.i1(oldRuntimeFlags)
        );
      }
      return exitUnit;
    }
    OnSuccess(op) {
      return this.pushStack(op), op.i0;
    }
    OnStep(op) {
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
      throw ((this.isYielding = !1), op);
    }
    While(op) {
      const check = op.i0,
        body = op.i1;
      return check() ? (this.pushStack(op), body()) : exitUnit;
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
          ("_op" in cur && cur._op in this) ||
            (console.log(cur), fiberRuntime_absurd(cur)),
            (cur = this._tracer.context(
              () =>
                "2.0.0-next.55" !== cur[Effectable_EffectTypeId]._V
                  ? dieMessage(
                      `Cannot execute an Effect versioned ${cur[Effectable_EffectTypeId]._V} with a Runtime of version 2.0.0-next.55`
                    )
                  : this[cur._op](cur),
              this
            ));
        } catch (e) {
          if (isEffect(e)) {
            if ("Yield" === e._op || "Async" === e._op) throw e;
            if ("Success" === e._op || "Failure" === e._op) return e;
          } else
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
    getConsole = (refs) => {
      const defaultServicesValue = FiberRefs_getOrDefault(
        refs,
        currentServices
      );
      return Context_get(defaultServicesValue, consoleTag).unsafe;
    },
    defaultLogger = GlobalValue_globalValue(
      Symbol.for("effect/Logger/defaultLogger"),
      () =>
        makeLogger((options) => {
          const formatted = stringLogger.log(options);
          getConsole(options.context).log(formatted);
        })
    ),
    tracerLogger = GlobalValue_globalValue(
      Symbol.for("effect/Logger/tracerLogger"),
      () =>
        makeLogger(
          ({ annotations, cause, context, fiberId, logLevel, message }) => {
            const span = Option_flatMap(
                fiberRefs_get(context, currentContext),
                Context_getOption(spanTag)
              ),
              clockService = Option_map(
                fiberRefs_get(context, currentServices),
                (_) => Context_get(_, clockTag)
              );
            if (
              "None" === span._tag ||
              "ExternalSpan" === span.value._tag ||
              "None" === clockService._tag
            )
              return;
            const attributes = Object.fromEntries(
              HashMap_map(annotations, (value) => serializeUnknown(value))
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
      () => fiberRefUnsafeMakeHashSet(HashSet_make(defaultLogger, tracerLogger))
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
                      ? forEachBatchedDiscard(self, (a, i) => restore(f(a, i)))
                      : forEachSequentialDiscard(self, (a, i) =>
                          restore(f(a, i))
                        )
                  ),
                () =>
                  finalizersMask(ExecutionStrategy_parallel)((restore) =>
                    forEachParUnboundedDiscard(
                      self,
                      (a, i) => restore(f(a, i)),
                      isRequestBatchingEnabled
                    )
                  ),
                (n) =>
                  finalizersMask(ExecutionStrategy_parallelN(n))((restore) =>
                    forEachParNDiscard(
                      self,
                      n,
                      (a, i) => restore(f(a, i)),
                      isRequestBatchingEnabled
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
        const as = ReadonlyArray_fromIterable(self),
          array = new Array(as.length);
        return core_zipRight(
          forEachParUnboundedDiscard(
            as,
            (a, i) => core_flatMap(f(a, i), (b) => sync(() => (array[i] = b))),
            batching
          ),
          succeed(array)
        );
      }),
    forEachBatchedDiscard = (self, f) =>
      suspend(() => {
        const as = ReadonlyArray_fromIterable(self),
          size = as.length;
        if (0 === size) return core_unit;
        if (1 === size) return core_asUnit(f(as[0], 0));
        const effects = as.map(f),
          blocked = new Array(),
          loop = (i) =>
            i === effects.length
              ? suspend(() => {
                  if (blocked.length > 0) {
                    const requests = blocked.map((b) => b.i0).reduce(par);
                    return core_blocked(
                      requests,
                      forEachBatchedDiscard(
                        blocked.map((b) => b.i1),
                        Function_identity
                      )
                    );
                  }
                  return core_unit;
                })
              : flatMapStep(effects[i], (s) =>
                  "Blocked" === s._op
                    ? (blocked.push(s), loop(i + 1))
                    : "Failure" === s._op
                    ? suspend(() => {
                        if (blocked.length > 0) {
                          const requests = blocked.map((b) => b.i0).reduce(par);
                          return core_blocked(
                            requests,
                            core_flatMap(
                              forEachBatchedDiscard(
                                blocked.map((b) => b.i1),
                                Function_identity
                              ),
                              () => s
                            )
                          );
                        }
                        return core_unit;
                      })
                    : loop(i + 1)
                );
        return loop(0);
      }),
    forEachParUnboundedDiscard = (self, f, batching) =>
      suspend(() => {
        const as = ReadonlyArray_fromIterable(self),
          size = as.length;
        return 0 === size
          ? core_unit
          : 1 === size
          ? core_asUnit(f(as[0], 0))
          : uninterruptibleMask((restore) => {
              const deferred = deferredUnsafeMake(FiberId_none);
              let ref = 0;
              const residual = [],
                joinOrder = [],
                process = transplant((graft) =>
                  forEachSequential(as, (a, i) =>
                    Function_pipe(
                      graft(
                        Function_pipe(
                          suspend(() =>
                            restore((batching ? step : core_exit)(f(a, i)))
                          ),
                          core_flatMap((exit) => {
                            if ("Failure" === exit._op) {
                              if (residual.length > 0) {
                                const requests = residual
                                    .map((blocked) => blocked.i0)
                                    .reduce(par),
                                  _continue = forEachParUnboundedDiscard(
                                    residual,
                                    (blocked) => blocked.i1,
                                    batching
                                  );
                                return core_blocked(
                                  requests,
                                  matchCauseEffect(_continue, {
                                    onFailure: (cause) =>
                                      core_zipRight(
                                        deferredFail(deferred, void 0),
                                        failCause(parallel(cause, exit.cause))
                                      ),
                                    onSuccess: () =>
                                      core_zipRight(
                                        deferredFail(deferred, void 0),
                                        failCause(exit.cause)
                                      ),
                                  })
                                );
                              }
                              return core_zipRight(
                                deferredFail(deferred, void 0),
                                failCause(exit.cause)
                              );
                            }
                            if (
                              ("Blocked" === exit._op && residual.push(exit),
                              ref + 1 === size)
                            ) {
                              if (residual.length > 0) {
                                const requests = residual
                                    .map((blocked) => blocked.i0)
                                    .reduce(par),
                                  _continue = forEachParUnboundedDiscard(
                                    residual,
                                    (blocked) => blocked.i1,
                                    batching
                                  );
                                return deferredSucceed(
                                  deferred,
                                  core_blocked(requests, _continue)
                                );
                              }
                              deferredUnsafeDone(
                                deferred,
                                exitSucceed(exitUnit)
                              );
                            } else ref += 1;
                            return core_unit;
                          })
                        )
                      ),
                      forkDaemon,
                      core_map(
                        (fiber) => (
                          fiber.addObserver(() => {
                            joinOrder.push(fiber);
                          }),
                          fiber
                        )
                      )
                    )
                  )
                );
              return core_flatMap(process, (fibers) =>
                matchCauseEffect(restore(deferredAwait(deferred)), {
                  onFailure: (cause) =>
                    core_flatMap(
                      forEachParUnbounded(fibers, interruptFiber, batching),
                      (exits) => {
                        const exit = exitCollectAll(exits, { parallel: !0 });
                        return "Some" === exit._tag && exitIsFailure(exit.value)
                          ? failCause(
                              parallel(stripFailures(cause), exit.value.i0)
                            )
                          : failCause(stripFailures(cause));
                      }
                    ),
                  onSuccess: (rest) =>
                    core_flatMap(rest, () =>
                      forEachSequentialDiscard(joinOrder, (f) => f.inheritAll)
                    ),
                })
              );
            });
      }),
    forEachParN = (self, n, f, batching) =>
      suspend(() => {
        const as = ReadonlyArray_fromIterable(self),
          array = new Array(as.length);
        return core_zipRight(
          forEachParNDiscard(
            as,
            n,
            (a, i) => core_map(f(a, i), (b) => (array[i] = b)),
            batching
          ),
          succeed(array)
        );
      }),
    forEachParNDiscard = (self, n, f, batching) =>
      suspend(() => {
        let i = 0;
        const iterator = self[Symbol.iterator](),
          residual = [],
          worker = core_flatMap(
            sync(() => iterator.next()),
            (next) =>
              next.done
                ? core_unit
                : core_flatMap(
                    (batching ? step : core_exit)(
                      core_asUnit(f(next.value, i++))
                    ),
                    (res) => {
                      switch (res._op) {
                        case "Blocked":
                          return residual.push(res), worker;
                        case "Failure":
                          return res;
                        case "Success":
                          return worker;
                      }
                    }
                  )
          ),
          effects = [];
        for (let i = 0; i < n; i++) effects.push(worker);
        return core_flatMap(
          core_exit(
            forEachParUnboundedDiscard(effects, Function_identity, batching)
          ),
          (exit) => {
            if (0 === residual.length) return exit;
            const requests = residual.map((blocked) => blocked.i0).reduce(par),
              _continue = forEachParNDiscard(
                residual,
                n,
                (blocked) => blocked.i1,
                batching
              );
            return "Failure" === exit._tag
              ? core_blocked(
                  requests,
                  matchCauseEffect(_continue, {
                    onFailure: (cause) =>
                      exitFailCause(parallel(exit.cause, cause)),
                    onSuccess: () => exit,
                  })
                )
              : core_blocked(requests, _continue);
          }
        );
      }),
    fork = (self) =>
      withFiberRuntime((state, status) =>
        succeed(unsafeFork(self, state, status.runtimeFlags))
      ),
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
              Option_getOrElse(() => parentFiber.scope())
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
        Option_match(Context_getOption(context, scopeTag), {
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
        Option_match(Context_getOption(context, scopeTag), {
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
        Option_match(Context_getOption(context, scopeTag), {
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
        Option_match(Context_getOption(context, scopeTag), {
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
    scopeTag = Tag(ScopeTypeId),
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
    invokeWithInterrupt = (dataSource, all) =>
      fiberIdWith((id) =>
        core_flatMap(
          core_flatMap(
            forkDaemon(core_interruptible(dataSource)),
            (processing) =>
              core_async((cb) => {
                const counts = all.map((_) => _.listeners.count),
                  checkDone = () => {
                    counts.every((count) => 0 === count) &&
                      (cleanup.forEach((f) => f()),
                      cb(interruptFiber(processing)));
                  };
                processing.addObserver((exit) => {
                  cleanup.forEach((f) => f()), cb(exit);
                });
                const cleanup = all.map((r, i) => {
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
              const residual = all.flatMap((entry) =>
                entry.state.completed ? [] : [entry]
              );
              return forEachSequentialDiscard(residual, (entry) =>
                request_complete(entry.request, exitInterrupt(id))
              );
            })
        )
      );
  const MutableList_TypeId = Symbol.for("effect/MutableList");
  Symbol.iterator;
  const MutableQueue_TypeId = Symbol.for("effect/MutableQueue");
  Symbol.iterator;
  const Effect_forEach = fiberRuntime_forEach,
    Effect_suspend = suspend,
    Effect_unit = core_unit,
    Effect_map = core_map,
    Effect_either = core_either,
    Effect_flatMap = core_flatMap,
    parseError = (errors) => ({ _tag: "ParseError", errors }),
    type = (expected, actual, message) => ({
      _tag: "Type",
      expected,
      actual,
      message: Option_fromNullable(message),
    }),
    forbidden = { _tag: "Forbidden" },
    ParseResult_index = (index, errors) => ({ _tag: "Index", index, errors }),
    ParseResult_key = (key, errors) => ({ _tag: "Key", key, errors }),
    missing = { _tag: "Missing" },
    unexpected = (actual) => ({ _tag: "Unexpected", actual }),
    unionMember = (errors) => ({ _tag: "UnionMember", errors }),
    success = Either_right,
    ParseResult_fail = Either_left,
    failure = (e) => ParseResult_fail(parseError([e])),
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
        : Effect_flatMap(self, f);
    },
    ParseResult_map = (self, f) => {
      const s = self;
      return "Left" === s._tag
        ? s
        : "Right" === s._tag
        ? Either_right(f(s.right))
        : Effect_map(self, f);
    },
    getEither = (ast, isDecoding) => goMemo(ast, isDecoding),
    getEffect = (ast, isDecoding) => {
      const parser = goMemo(ast, isDecoding);
      return (input, options) =>
        parser(input, { ...options, isEffectAllowed: !0 });
    },
    Parser_parse = (schema) => getEffect(schema.ast, !0),
    validateEither = (schema) => getEither(AST_to(schema.ast), !0),
    defaultParseOption = {},
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
      const parser = go(ast, isDecoding);
      return memoMap.set(ast, parser), parser;
    },
    go = (ast, isDecoding) => {
      switch (ast._tag) {
        case "Refinement":
          if (isDecoding) {
            const from = goMemo(ast.from, !0);
            return (i, options) =>
              handleForbidden(
                ParseResult_flatMap(from(i, options), (a) =>
                  Option_match(
                    ast.filter(a, options ?? defaultParseOption, ast),
                    { onNone: () => success(a), onSome: ParseResult_fail }
                  )
                ),
                options
              );
          }
          {
            const from = goMemo(AST_to(ast), !0),
              to = goMemo(dropRightRefinement(ast.from), !1);
            return (i, options) =>
              handleForbidden(
                ParseResult_flatMap(from(i, options), (a) => to(a, options)),
                options
              );
          }
        case "Transform": {
          const transform = getFinalTransformation(
              ast.transformation,
              isDecoding
            ),
            from = isDecoding ? goMemo(ast.from, !0) : goMemo(ast.to, !1),
            to = isDecoding ? goMemo(ast.to, !0) : goMemo(ast.from, !1);
          return (i1, options) =>
            handleForbidden(
              ParseResult_flatMap(from(i1, options), (a) =>
                ParseResult_flatMap(
                  transform(a, options ?? defaultParseOption, ast),
                  (i2) => to(i2, options)
                )
              ),
              options
            );
        }
        case "Declaration": {
          const parse = ast.decode(isDecoding, ...ast.typeParameters);
          return (i, options) =>
            handleForbidden(
              parse(i, options ?? defaultParseOption, ast),
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
          return success;
        case "StringKeyword":
          return fromRefinement(ast, isString);
        case "NumberKeyword":
          return fromRefinement(ast, isNumber);
        case "BooleanKeyword":
          return fromRefinement(ast, isBoolean);
        case "BigIntKeyword":
          return fromRefinement(ast, isBigInt);
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
          const elements = ast.elements.map((e) => goMemo(e.type, isDecoding)),
            rest = Option_map(
              ast.rest,
              ReadonlyArray_map((ast) => goMemo(ast, isDecoding))
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
                    eu = eitherOrUndefined(te);
                  if (eu) {
                    if (Either_isLeft(eu)) {
                      const e = ParseResult_index(i, eu.left.errors);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                    output.push([stepKey++, eu.right]);
                  } else {
                    const nk = stepKey++,
                      index = i;
                    queue || (queue = []),
                      queue.push(({ es, output }) =>
                        Effect_flatMap(Effect_either(te), (t) => {
                          if (Either_isLeft(t)) {
                            const e = ParseResult_index(index, t.left.errors);
                            return allErrors
                              ? (es.push([nk, e]), Effect_unit)
                              : failures(mutableAppend(sortByIndex(es), e));
                          }
                          return output.push([nk, t.right]), Effect_unit;
                        })
                      );
                  }
                }
              if (Option_isSome(rest)) {
                const [head, ...tail] = rest.value;
                for (; i < len - tail.length; i++) {
                  const te = head(input[i], options),
                    eu = eitherOrUndefined(te);
                  if (eu) {
                    if (Either_isLeft(eu)) {
                      const e = ParseResult_index(i, eu.left.errors);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                    output.push([stepKey++, eu.right]);
                  } else {
                    const nk = stepKey++,
                      index = i;
                    queue || (queue = []),
                      queue.push(({ es, output }) =>
                        Effect_flatMap(Effect_either(te), (t) => {
                          if (Either_isLeft(t)) {
                            const e = ParseResult_index(index, t.left.errors);
                            return allErrors
                              ? (es.push([nk, e]), Effect_unit)
                              : failures(mutableAppend(sortByIndex(es), e));
                          }
                          return output.push([nk, t.right]), Effect_unit;
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
                        const e = ParseResult_index(i, eu.left.errors);
                        if (allErrors) {
                          es.push([stepKey++, e]);
                          continue;
                        }
                        return failures(mutableAppend(sortByIndex(es), e));
                      }
                      output.push([stepKey++, eu.right]);
                    } else {
                      const nk = stepKey++,
                        index = i;
                      queue || (queue = []),
                        queue.push(({ es, output }) =>
                          Effect_flatMap(Effect_either(te), (t) => {
                            if (Either_isLeft(t)) {
                              const e = ParseResult_index(index, t.left.errors);
                              return allErrors
                                ? (es.push([nk, e]), Effect_unit)
                                : failures(mutableAppend(sortByIndex(es), e));
                            }
                            return output.push([nk, t.right]), Effect_unit;
                          })
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
                return Effect_suspend(() => {
                  const state = {
                    es: Array.from(es),
                    output: Array.from(output),
                  };
                  return Effect_flatMap(
                    Effect_forEach(cqueue, (f) => f(state), {
                      concurrency: "unbounded",
                      discard: !0,
                    }),
                    () => computeResult(state)
                  );
                });
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
          const propertySignatures = [],
            expectedKeys = {};
          for (const ps of ast.propertySignatures)
            propertySignatures.push(goMemo(ps.type, isDecoding)),
              (expectedKeys[ps.name] = null);
          const indexSignatures = [],
            expectedKeyTypes = {};
          for (const is of ast.indexSignatures) {
            indexSignatures.push([
              goMemo(is.parameter, isDecoding),
              goMemo(is.type, isDecoding),
            ]);
            const base = getParameterBase(is.parameter);
            isSymbolKeyword(base)
              ? (expectedKeyTypes.symbol = !0)
              : (expectedKeyTypes.string = !0);
          }
          return (input, options) => {
            if (!isRecord(input)) return failure(type(unknownRecord, input));
            const allErrors = "all" === options?.errors,
              es = [];
            let stepKey = 0;
            if ("error" === options?.onExcessProperty)
              for (const key of common_ownKeys(input))
                if (
                  !Object.prototype.hasOwnProperty.call(expectedKeys, key) &&
                  !(typeof key in expectedKeyTypes)
                ) {
                  const e = ParseResult_key(key, [unexpected(input[key])]);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  }
                  return failures(mutableAppend(sortByIndex(es), e));
                }
            const output = {};
            let queue;
            for (let i = 0; i < propertySignatures.length; i++) {
              const ps = ast.propertySignatures[i],
                parser = propertySignatures[i],
                name = ps.name;
              if (Object.prototype.hasOwnProperty.call(input, name)) {
                const te = parser(input[name], options),
                  eu = eitherOrUndefined(te);
                if (eu) {
                  if (Either_isLeft(eu)) {
                    const e = ParseResult_key(name, eu.left.errors);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                  output[name] = eu.right;
                } else {
                  const nk = stepKey++,
                    index = name;
                  queue || (queue = []),
                    queue.push(({ es, output }) =>
                      Effect_flatMap(Effect_either(te), (t) => {
                        if (Either_isLeft(t)) {
                          const e = ParseResult_key(index, t.left.errors);
                          return allErrors
                            ? (es.push([nk, e]), Effect_unit)
                            : failures(mutableAppend(sortByIndex(es), e));
                        }
                        return (output[index] = t.right), Effect_unit;
                      })
                    );
                }
              } else if (!ps.isOptional) {
                const e = ParseResult_key(name, [missing]);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                }
                return failure(e);
              }
            }
            for (let i = 0; i < indexSignatures.length; i++) {
              const parameter = indexSignatures[i][0],
                type = indexSignatures[i][1],
                keys = getKeysForIndexSignature(
                  input,
                  ast.indexSignatures[i].parameter
                );
              for (const key of keys)
                if (!Object.prototype.hasOwnProperty.call(expectedKeys, key)) {
                  const keu = eitherOrUndefined(parameter(key, options));
                  if (keu && Either_isLeft(keu)) {
                    const e = ParseResult_key(key, keu.left.errors);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                  const vpr = type(input[key], options),
                    veu = eitherOrUndefined(vpr);
                  if (veu) {
                    if (Either_isLeft(veu)) {
                      const e = ParseResult_key(key, veu.left.errors);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return failures(mutableAppend(sortByIndex(es), e));
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
                            const e = ParseResult_key(index, tv.left.errors);
                            return allErrors
                              ? (es.push([nk, e]), Effect_unit)
                              : failures(mutableAppend(sortByIndex(es), e));
                          }
                          return (
                            Object.prototype.hasOwnProperty.call(
                              expectedKeys,
                              key
                            ) || (output[key] = tv.right),
                            Effect_unit
                          );
                        })
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
              return Effect_suspend(() => {
                const state = {
                  es: Array.from(es),
                  output: Object.assign({}, output),
                };
                return Effect_flatMap(
                  Effect_forEach(cqueue, (f) => f(state), {
                    concurrency: "unbounded",
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
            ownKeys = common_ownKeys(searchTree.keys),
            len = ownKeys.length,
            map = new Map();
          for (let i = 0; i < ast.types.length; i++)
            map.set(ast.types[i], goMemo(ast.types[i], isDecoding));
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
              const pr = map.get(candidates[i])(input, options),
                eu =
                  queue && 0 !== queue.length ? void 0 : eitherOrUndefined(pr);
              if (eu) {
                if (Either_isRight(eu)) return success(eu.right);
                es.push([stepKey++, unionMember(eu.left.errors)]);
              } else {
                const nk = stepKey++;
                queue || (queue = []),
                  queue.push((state) =>
                    Effect_suspend(() =>
                      "finalResult" in state
                        ? Effect_unit
                        : Effect_flatMap(
                            Effect_either(pr),
                            (t) => (
                              Either_isRight(t)
                                ? (state.finalResult = success(t.right))
                                : state.es.push([
                                    nk,
                                    unionMember(t.left.errors),
                                  ]),
                              Effect_unit
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
              return Effect_suspend(() => {
                const state = { es: Array.from(es) };
                return Effect_flatMap(
                  Effect_forEach(cqueue, (f) => f(state), {
                    concurrency: 1,
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
        case "Lazy": {
          const get = memoizeThunk(() => goMemo(ast.f(), isDecoding));
          return (a, options) => get()(a, options);
        }
      }
    },
    fromRefinement = (ast, refinement) => (u) =>
      refinement(u) ? success(u) : failure(type(ast, u)),
    getLiterals = (ast, isDecoding) => {
      switch (ast._tag) {
        case "Declaration":
          return getLiterals(ast.type, isDecoding);
        case "TypeLiteral": {
          const out = [];
          for (let i = 0; i < ast.propertySignatures.length; i++) {
            const propertySignature = ast.propertySignatures[i],
              type = isDecoding
                ? from(propertySignature.type)
                : AST_to(propertySignature.type);
            isLiteral(type) &&
              !propertySignature.isOptional &&
              out.push([propertySignature.name, type]);
          }
          return out;
        }
        case "Refinement":
          return getLiterals(ast.from, isDecoding);
        case "Transform":
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
    dropRightRefinement = (ast) =>
      ((ast) => "Refinement" === ast._tag)(ast)
        ? dropRightRefinement(ast.from)
        : ast,
    handleForbidden = (conditional, options) => {
      const eu = eitherOrUndefined(conditional);
      return (
        eu ||
        (!0 === options?.isEffectAllowed ? conditional : failure(forbidden))
      );
    },
    unknownArray = createTuple([], Option_some([unknownKeyword]), !0, {
      [DescriptionAnnotationId]: "a generic array",
    }),
    unknownRecord = createTypeLiteral(
      [],
      [
        createIndexSignature(stringKeyword, unknownKeyword, !0),
        createIndexSignature(symbolKeyword, unknownKeyword, !0),
      ],
      { [DescriptionAnnotationId]: "a generic object" }
    ),
    mutableAppend = (self, a) => (self.push(a), self),
    getTemplateLiteralRegex = (ast) => {
      let pattern = `^${ast.head}`;
      for (const span of ast.spans)
        isStringKeyword(span.type)
          ? (pattern += ".*")
          : isNumberKeyword(span.type) &&
            (pattern += "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?"),
          (pattern += span.literal);
      return (pattern += "$"), new RegExp(pattern);
    };
  function sortByIndex(es) {
    return es
      .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
      .map(([_, a]) => a);
  }
  const getFinalPropertySignatureTransformation = (
      transformation,
      isDecoding
    ) => {
      if ("FinalPropertySignatureTransformation" === transformation._tag)
        return isDecoding ? transformation.decode : transformation.encode;
    },
    getFinalTransformation = (transformation, isDecoding) => {
      switch (transformation._tag) {
        case "FinalTransformation":
          return isDecoding ? transformation.decode : transformation.encode;
        case "ComposeTransformation":
          return success;
        case "TypeLiteralTransformation":
          return (input) => {
            let out = Either_right(input);
            for (const pst of transformation.propertySignatureTransformations) {
              const [from, to] = isDecoding
                  ? [pst.from, pst.to]
                  : [pst.to, pst.from],
                transform = getFinalPropertySignatureTransformation(
                  pst.propertySignatureTransformation,
                  isDecoding
                ),
                f = (input) => {
                  const o = transform(
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
    Schema_TypeId = Symbol.for("@effect/schema/Schema"),
    Schema_variance = { From: (_) => _, To: (_) => _ };
  class SchemaImpl {
    ast;
    [Schema_TypeId] = Schema_variance;
    constructor(ast) {
      this.ast = ast;
    }
    pipe() {
      return Pipeable_pipeArguments(this, arguments);
    }
  }
  const Schema_make = (ast) => new SchemaImpl(ast),
    literal = (...literals) =>
      Schema_union(
        ...literals.map((literal) =>
          ((value) => Schema_make(createLiteral(value)))(literal)
        )
      ),
    declare = (typeParameters, type, decode, annotations) =>
      Schema_make(
        createDeclaration(
          typeParameters.map((tp) => tp.ast),
          type.ast,
          (isDecoding, ...typeParameters) =>
            decode(isDecoding, ...typeParameters.map(Schema_make)),
          annotations
        )
      ),
    _void = Schema_make(voidKeyword),
    Schema_number = Schema_make(numberKeyword),
    object = Schema_make(objectKeyword),
    Schema_union = (...members) =>
      Schema_make(createUnion(members.map((m) => m.ast)));
  const Schema_struct = (fields) => {
    const ownKeys = common_ownKeys(fields),
      pss = [],
      froms = [],
      tos = [],
      propertySignatureTransformations = [];
    for (let i = 0; i < ownKeys.length; i++) {
      const key = ownKeys[i],
        field = fields[key];
      if ("config" in field) {
        const config = field.config,
          from = config.ast,
          to = AST_to(from),
          annotations = config.annotations;
        switch (config._tag) {
          case "PropertySignature":
            pss.push(createPropertySignature(key, from, !1, !0, annotations)),
              froms.push(createPropertySignature(key, from, !1, !0)),
              tos.push(createPropertySignature(key, to, !1, !0, annotations));
            break;
          case "Optional":
            pss.push(createPropertySignature(key, from, !0, !0, annotations)),
              froms.push(createPropertySignature(key, from, !0, !0)),
              tos.push(createPropertySignature(key, to, !0, !0, annotations));
            break;
          case "Default":
            froms.push(createPropertySignature(key, from, !0, !0)),
              tos.push(createPropertySignature(key, to, !1, !0, annotations)),
              propertySignatureTransformations.push(
                createPropertySignatureTransform(
                  key,
                  key,
                  createFinalPropertySignatureTransformation(
                    Option_orElse(() => Option_some(config.value())),
                    Function_identity
                  )
                )
              );
            break;
          case "Option":
            froms.push(createPropertySignature(key, from, !0, !0)),
              tos.push(
                createPropertySignature(
                  key,
                  optionFromSelf(Schema_make(to)).ast,
                  !1,
                  !0,
                  annotations
                )
              ),
              propertySignatureTransformations.push(
                createPropertySignatureTransform(
                  key,
                  key,
                  createFinalPropertySignatureTransformation(
                    Option_some,
                    flatten
                  )
                )
              );
        }
      } else
        pss.push(createPropertySignature(key, field.ast, !1, !0)),
          froms.push(createPropertySignature(key, field.ast, !1, !0)),
          tos.push(createPropertySignature(key, AST_to(field.ast), !1, !0));
    }
    return isNonEmptyReadonlyArray(propertySignatureTransformations)
      ? Schema_make(
          createTransform(
            createTypeLiteral(froms, []),
            createTypeLiteral(tos, []),
            createTypeLiteralTransformation(propertySignatureTransformations)
          )
        )
      : Schema_make(createTypeLiteral(pss, []));
  };
  const optionArbitrary = (value) => (fc) =>
      fc.oneof(fc.constant(Option_none()), value(fc).map(Option_some)),
    optionPretty = (value) =>
      Option_match({
        onNone: () => "none()",
        onSome: (a) => `some(${value(a)})`,
      }),
    optionInline = (value) =>
      Schema_union(
        Schema_struct({ _tag: literal("None") }),
        Schema_struct({ _tag: literal("Some"), value })
      ),
    optionFromSelf = (value) =>
      declare(
        [value],
        optionInline(value),
        (isDecoding, value) => {
          const parse = isDecoding
            ? Parser_parse(value)
            : ((schema) => getEffect(schema.ast, !1))(value);
          return (u, options, ast) =>
            Option_isOption(u)
              ? Option_isNone(u)
                ? success(Option_none())
                : ParseResult_map(parse(u.value, options), Option_some)
              : failure(type(ast, u));
        },
        {
          [IdentifierAnnotationId]: "Option",
          [PrettyHookId]: optionPretty,
          [ArbitraryHookId]: optionArbitrary,
          [EquivalenceHookId]: Option_getEquivalence,
        }
      ),
    program = head([2, 3, 5]).pipe(
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
  const valid = ((schema) => {
    const getEither = validateEither(schema);
    return (a) => Either_isRight(getEither(a));
  })(Schema_struct({ void: _void, number: Schema_number, object }));
  console.log(
    valid({
      undefined: void 0,
      void: void 0,
      bigint: BigInt(1),
      boolean: !0,
      number: 1,
      object: {},
    })
  );
})();
