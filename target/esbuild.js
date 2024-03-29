var __defProp = Object.defineProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Function.js
var isFunction = (input2) => typeof input2 === "function";
var dual = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      if (arity(arguments)) {
        return body.apply(this, arguments);
      }
      return (self) => body(self, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self) {
          return body(self, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self) {
          return body(self, a, b);
        };
      };
    case 4:
      return function(a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function(self) {
          return body(self, a, b, c);
        };
      };
    case 5:
      return function(a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function(self) {
          return body(self, a, b, c, d);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args = arguments;
        return function(self) {
          return body(self, ...args);
        };
      };
  }
};
var identity = (a) => a;
var constant = (value) => () => value;
var constNull = /* @__PURE__ */ constant(null);
var constUndefined = /* @__PURE__ */ constant(void 0);
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
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/internal/version.js
var moduleVersion = "2.0.0-next.55";

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/GlobalValue.js
var globalStoreId = /* @__PURE__ */ Symbol.for(`effect/GlobalValue/globalStoreId/${moduleVersion}`);
if (!(globalStoreId in globalThis)) {
  ;
  globalThis[globalStoreId] = /* @__PURE__ */ new Map();
}
var globalStore = globalThis[globalStoreId];
var globalValue = (id, compute) => {
  if (!globalStore.has(id)) {
    globalStore.set(id, compute());
  }
  return globalStore.get(id);
};

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Predicate.js
var isFunction2 = isFunction;
var isRecordOrArray = (input2) => typeof input2 === "object" && input2 !== null;
var isObject = (input2) => isRecordOrArray(input2) || isFunction2(input2);
var hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObject(self) && property in self);
var isNullable = (input2) => input2 === null || input2 === void 0;

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Utils.js
var GenKindTypeId = /* @__PURE__ */ Symbol.for("effect/Gen/GenKind");
var GenKindImpl = class {
  value;
  constructor(value) {
    this.value = value;
  }
  /**
   * @since 2.0.0
   */
  get _F() {
    return identity;
  }
  /**
   * @since 2.0.0
   */
  get _R() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _O() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _E() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  [GenKindTypeId] = GenKindTypeId;
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SingleShotGen = class _SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  /**
   * @since 2.0.0
   */
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  /**
   * @since 2.0.0
   */
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new _SingleShotGen(this.self);
  }
};
var adapter = () => (
  // @ts-expect-error
  function() {
    let x = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      x = arguments[i](x);
    }
    return new GenKindImpl(x);
  }
);
var defaultIncHi = 335903614;
var defaultIncLo = 4150755663;
var MUL_HI = 1481765933 >>> 0;
var MUL_LO = 1284865837 >>> 0;
var BIT_53 = 9007199254740992;
var BIT_27 = 134217728;
var PCGRandom = class {
  _state;
  constructor(seedHi, seedLo, incHi, incLo) {
    if (isNullable(seedLo) && isNullable(seedHi)) {
      seedLo = Math.random() * 4294967295 >>> 0;
      seedHi = 0;
    } else if (isNullable(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if (isNullable(incLo) && isNullable(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo;
      incHi = this._state ? this._state[2] : defaultIncHi;
    } else if (isNullable(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(state) {
    this._state[0] = state[0];
    this._state[1] = state[1];
    this._state[2] = state[2];
    this._state[3] = state[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(max3) {
    if (!max3) {
      return this._next();
    }
    max3 = max3 >>> 0;
    if ((max3 & max3 - 1) === 0) {
      return this._next() & max3 - 1;
    }
    let num = 0;
    const skew = (-max3 >>> 0) % max3 >>> 0;
    for (num = this._next(); num < skew; num = this._next()) {
    }
    return num % max3;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  /** @internal */
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
};
function mul64(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
  let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
function add64(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
}

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Hash.js
var randomHashCache = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
var pcgr = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Hash/pcgr"), () => new PCGRandom());
var symbol = /* @__PURE__ */ Symbol.for("effect/Hash");
var hash = (self) => {
  switch (typeof self) {
    case "number":
      return number(self);
    case "bigint":
      return string(self.toString(10));
    case "boolean":
      return string(String(self));
    case "symbol":
      return string(String(self));
    case "string":
      return string(self);
    case "undefined":
      return string("undefined");
    case "function":
    case "object": {
      if (self === null) {
        return string("null");
      }
      if (isHash(self)) {
        return self[symbol]();
      } else {
        return random(self);
      }
    }
    default:
      throw new Error(`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
};
var random = (self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, number(pcgr.integer(Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
var combine = (b) => (self) => self * 53 ^ b;
var optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
var isHash = (u) => hasProperty(u, symbol);
var number = (n) => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 4294967295;
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295;
  }
  return optimize(n);
};
var string = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
var structureKeys = (o, keys) => {
  let h = 12289;
  for (let i = 0; i < keys.length; i++) {
    h ^= pipe(string(keys[i]), combine(hash(o[keys[i]])));
  }
  return optimize(h);
};
var structure = (o) => structureKeys(o, Object.keys(o));
var array = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(hash(arr[i])));
  }
  return optimize(h);
};

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Equal.js
var symbol2 = /* @__PURE__ */ Symbol.for("effect/Equal");
function equals() {
  if (arguments.length === 1) {
    return (self) => compareBoth(self, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
  if (self === that) {
    return true;
  }
  const selfType = typeof self;
  if (selfType !== typeof that) {
    return false;
  }
  if ((selfType === "object" || selfType === "function") && self !== null && that !== null) {
    if (isEqual(self) && isEqual(that)) {
      return hash(self) === hash(that) && self[symbol2](that);
    }
  }
  return false;
}
var isEqual = (u) => hasProperty(u, symbol2);
var equivalence = () => (self, that) => equals(self, that);

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Equivalence.js
var make = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
var array2 = (item) => make((self, that) => {
  if (self.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self.length; i++) {
    const isEq = item(self[i], that[i]);
    if (!isEq) {
      return false;
    }
  }
  return true;
});

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Inspectable.js
var NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
var toJSON = (x) => {
  if (hasProperty(x, "toJSON") && isFunction2(x["toJSON"]) && x["toJSON"].length === 0) {
    return x.toJSON();
  } else if (Array.isArray(x)) {
    return x.map(toJSON);
  }
  return x;
};
var toString = (x) => JSON.stringify(x, null, 2);

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Pipeable.js
var pipeArguments = (self, args) => {
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
      return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))));
    case 8:
      return args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))));
    case 9:
      return args[8](args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))));
    default: {
      let ret = self;
      for (let i = 0, len = args.length; i < len; i++) {
        ret = args[i](ret);
      }
      return ret;
    }
  }
};

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/internal/data.js
var ArrayProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Array.prototype), {
  [symbol]() {
    return array(this);
  },
  [symbol2](that) {
    if (Array.isArray(that) && this.length === that.length) {
      return this.every((v, i) => equals(v, that[i]));
    } else {
      return false;
    }
  }
});
var StructProto = {
  [symbol]() {
    return structure(this);
  },
  [symbol2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key of selfKeys) {
      if (!(key in that && equals(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  }
};
var Structural = /* @__PURE__ */ function() {
  function Structural2(args) {
    if (args) {
      Object.assign(this, args);
    }
  }
  Structural2.prototype = StructProto;
  return Structural2;
}();

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/internal/opCodes/effect.js
var OP_COMMIT = "Commit";

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/internal/effectable.js
var EffectTypeId = /* @__PURE__ */ Symbol.for("effect/Effect");
var StreamTypeId = /* @__PURE__ */ Symbol.for("effect/Stream");
var SinkTypeId = /* @__PURE__ */ Symbol.for("effect/Sink");
var ChannelTypeId = /* @__PURE__ */ Symbol.for("effect/Channel");
var effectVariance = {
  _R: (_) => _,
  _E: (_) => _,
  _A: (_) => _,
  _V: moduleVersion
};
var sinkVariance = {
  _R: (_) => _,
  _E: (_) => _,
  _In: (_) => _,
  _L: (_) => _,
  _Z: (_) => _
};
var channelVariance = {
  _Env: (_) => _,
  _InErr: (_) => _,
  _InElem: (_) => _,
  _InDone: (_) => _,
  _OutErr: (_) => _,
  _OutElem: (_) => _,
  _OutDone: (_) => _
};
var EffectPrototype = {
  [EffectTypeId]: effectVariance,
  [StreamTypeId]: effectVariance,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol2](that) {
    return this === that;
  },
  [symbol]() {
    return random(this);
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var CommitPrototype = {
  ...EffectPrototype,
  _op: OP_COMMIT
};
var StructuralCommitPrototype = {
  ...CommitPrototype,
  ...Structural.prototype
};

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/internal/option.js
var TypeId = /* @__PURE__ */ Symbol.for("effect/Option");
var CommonProto = {
  ...EffectPrototype,
  [TypeId]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return toString(this.toJSON());
  }
};
var SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(that.value, this.value);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.value));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJSON(this.value)
    };
  }
});
var NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return combine(hash(this._tag));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
var isOption = (input2) => hasProperty(input2, TypeId);
var isNone = (fa) => fa._tag === "None";
var isSome = (fa) => fa._tag === "Some";
var none = /* @__PURE__ */ Object.create(NoneProto);
var some = (value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/internal/either.js
var TypeId2 = /* @__PURE__ */ Symbol.for("effect/Either");
var CommonProto2 = {
  ...EffectPrototype,
  [TypeId2]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return toString(this.toJSON());
  }
};
var RightProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Right",
  _op: "Right",
  [symbol2](that) {
    return isEither(that) && isRight(that) && equals(that.right, this.right);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: toJSON(this.right)
    };
  }
});
var LeftProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Left",
  _op: "Left",
  [symbol2](that) {
    return isEither(that) && isLeft(that) && equals(that.left, this.left);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: toJSON(this.left)
    };
  }
});
var isEither = (input2) => hasProperty(input2, TypeId2);
var isLeft = (ma) => ma._tag === "Left";
var isRight = (ma) => ma._tag === "Right";
var left = (left3) => {
  const a = Object.create(LeftProto);
  a.left = left3;
  return a;
};
var right = (right3) => {
  const a = Object.create(RightProto);
  a.right = right3;
  return a;
};
var getLeft = (self) => isRight(self) ? none : some(self.left);
var getRight = (self) => isLeft(self) ? none : some(self.right);
var fromOption = /* @__PURE__ */ dual(2, (self, onNone) => isNone(self) ? left(onNone()) : right(self.value));

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Order.js
var make2 = (compare) => (self, that) => self === that ? 0 : compare(self, that);
var number2 = /* @__PURE__ */ make2((self, that) => self < that ? -1 : 1);
var combineMany = /* @__PURE__ */ dual(2, (self, collection) => make2((a1, a2) => {
  let out = self(a1, a2);
  if (out !== 0) {
    return out;
  }
  for (const O of collection) {
    out = O(a1, a2);
    if (out !== 0) {
      return out;
    }
  }
  return out;
}));
var empty = () => make2(() => 0);
var combineAll = (collection) => combineMany(empty(), collection);
var mapInput = /* @__PURE__ */ dual(2, (self, f) => make2((b1, b2) => self(f(b1), f(b2))));
var array3 = (O) => make2((self, that) => {
  const aLen = self.length;
  const bLen = that.length;
  const len = Math.min(aLen, bLen);
  for (let i = 0; i < len; i++) {
    const o = O(self[i], that[i]);
    if (o !== 0) {
      return o;
    }
  }
  return number2(aLen, bLen);
});
var min = (O) => dual(2, (self, that) => self === that || O(self, that) < 1 ? self : that);
var max = (O) => dual(2, (self, that) => self === that || O(self, that) > -1 ? self : that);

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Option.js
var none2 = () => none;
var some2 = some;
var isNone2 = isNone;
var isSome2 = isSome;
var getOrElse = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? onNone() : self.value);
var toArray = (self) => isNone2(self) ? [] : [self.value];

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/Either.js
var Either_exports = {};
__export(Either_exports, {
  TypeId: () => TypeId3,
  all: () => all,
  ap: () => ap,
  flatMap: () => flatMap,
  flip: () => flip,
  fromNullable: () => fromNullable,
  fromOption: () => fromOption2,
  gen: () => gen,
  getEquivalence: () => getEquivalence,
  getLeft: () => getLeft2,
  getOrElse: () => getOrElse2,
  getOrNull: () => getOrNull,
  getOrThrow: () => getOrThrow,
  getOrThrowWith: () => getOrThrowWith,
  getOrUndefined: () => getOrUndefined,
  getRight: () => getRight2,
  isEither: () => isEither2,
  isLeft: () => isLeft2,
  isRight: () => isRight2,
  left: () => left2,
  map: () => map,
  mapBoth: () => mapBoth,
  mapLeft: () => mapLeft,
  match: () => match,
  merge: () => merge,
  orElse: () => orElse,
  right: () => right2,
  try: () => try_,
  zipWith: () => zipWith
});
var TypeId3 = TypeId2;
var right2 = right;
var left2 = left;
var fromNullable = /* @__PURE__ */ dual(2, (self, onNullable) => self == null ? left2(onNullable(self)) : right2(self));
var fromOption2 = fromOption;
var try_ = (evaluate) => {
  if (isFunction2(evaluate)) {
    try {
      return right2(evaluate());
    } catch (e) {
      return left2(e);
    }
  } else {
    try {
      return right2(evaluate.try());
    } catch (e) {
      return left2(evaluate.catch(e));
    }
  }
};
var isEither2 = isEither;
var isLeft2 = isLeft;
var isRight2 = isRight;
var getRight2 = getRight;
var getLeft2 = getLeft;
var getEquivalence = (EE, EA) => make((x, y) => x === y || (isLeft2(x) ? isLeft2(y) && EE(x.left, y.left) : isRight2(y) && EA(x.right, y.right)));
var mapBoth = /* @__PURE__ */ dual(2, (self, {
  onLeft,
  onRight
}) => isLeft2(self) ? left2(onLeft(self.left)) : right2(onRight(self.right)));
var mapLeft = /* @__PURE__ */ dual(2, (self, f) => isLeft2(self) ? left2(f(self.left)) : right2(self.right));
var map = /* @__PURE__ */ dual(2, (self, f) => isRight2(self) ? right2(f(self.right)) : left2(self.left));
var match = /* @__PURE__ */ dual(2, (self, {
  onLeft,
  onRight
}) => isLeft2(self) ? onLeft(self.left) : onRight(self.right));
var merge = /* @__PURE__ */ match({
  onLeft: identity,
  onRight: identity
});
var getOrElse2 = /* @__PURE__ */ dual(2, (self, onLeft) => isLeft2(self) ? onLeft(self.left) : self.right);
var getOrNull = /* @__PURE__ */ getOrElse2(constNull);
var getOrUndefined = /* @__PURE__ */ getOrElse2(constUndefined);
var getOrThrowWith = /* @__PURE__ */ dual(2, (self, onLeft) => {
  if (isRight2(self)) {
    return self.right;
  }
  throw onLeft(self.left);
});
var getOrThrow = /* @__PURE__ */ getOrThrowWith(() => new Error("getOrThrow called on a Left"));
var orElse = /* @__PURE__ */ dual(2, (self, that) => isLeft2(self) ? that(self.left) : right2(self.right));
var flatMap = /* @__PURE__ */ dual(2, (self, f) => isLeft2(self) ? left2(self.left) : f(self.right));
var zipWith = /* @__PURE__ */ dual(3, (self, that, f) => flatMap(self, (a) => map(that, (b) => f(a, b))));
var ap = /* @__PURE__ */ dual(2, (self, that) => zipWith(self, that, (f, a) => f(a)));
var all = (input2) => {
  if (Symbol.iterator in input2) {
    const out2 = [];
    for (const e of input2) {
      if (isLeft2(e)) {
        return e;
      }
      out2.push(e.right);
    }
    return right2(out2);
  }
  const out = {};
  for (const key of Object.keys(input2)) {
    const e = input2[key];
    if (isLeft2(e)) {
      return e;
    }
    out[key] = e.right;
  }
  return right2(out);
};
var flip = (self) => isLeft2(self) ? right2(self.left) : left2(self.right);
var adapter2 = /* @__PURE__ */ adapter();
var gen = (f) => {
  const iterator = f(adapter2);
  let state = iterator.next();
  if (state.done) {
    return right2(state.value);
  } else {
    let current = state.value.value;
    if (isLeft2(current)) {
      return current;
    }
    while (!state.done) {
      state = iterator.next(current.right);
      if (!state.done) {
        current = state.value.value;
        if (isLeft2(current)) {
          return current;
        }
      }
    }
    return right2(state.value);
  }
};

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/ReadonlyArray.js
var ReadonlyArray_exports = {};
__export(ReadonlyArray_exports, {
  append: () => append,
  appendAll: () => appendAll,
  appendAllNonEmpty: () => appendAllNonEmpty,
  cartesian: () => cartesian,
  cartesianWith: () => cartesianWith,
  chop: () => chop,
  chopNonEmpty: () => chopNonEmpty,
  chunksOf: () => chunksOf,
  chunksOfNonEmpty: () => chunksOfNonEmpty,
  compact: () => compact,
  contains: () => contains,
  containsWith: () => containsWith,
  copy: () => copy,
  dedupe: () => dedupe,
  dedupeAdjacent: () => dedupeAdjacent,
  dedupeAdjacentWith: () => dedupeAdjacentWith,
  dedupeNonEmpty: () => dedupeNonEmpty,
  dedupeNonEmptyWith: () => dedupeNonEmptyWith,
  dedupeWith: () => dedupeWith,
  difference: () => difference,
  differenceWith: () => differenceWith,
  drop: () => drop,
  dropRight: () => dropRight,
  dropWhile: () => dropWhile,
  empty: () => empty2,
  every: () => every,
  extend: () => extend,
  filter: () => filter,
  filterMap: () => filterMap,
  filterMapWhile: () => filterMapWhile,
  findFirst: () => findFirst,
  findFirstIndex: () => findFirstIndex,
  findLast: () => findLast,
  findLastIndex: () => findLastIndex,
  flatMap: () => flatMap2,
  flatMapNonEmpty: () => flatMapNonEmpty,
  flatMapNullable: () => flatMapNullable,
  flatten: () => flatten,
  flattenNonEmpty: () => flattenNonEmpty,
  forEach: () => forEach,
  fromIterable: () => fromIterable,
  fromNullable: () => fromNullable2,
  fromOption: () => fromOption3,
  fromRecord: () => fromRecord,
  get: () => get,
  getEquivalence: () => getEquivalence2,
  getOrder: () => getOrder,
  group: () => group,
  groupBy: () => groupBy,
  groupWith: () => groupWith,
  head: () => head,
  headNonEmpty: () => headNonEmpty,
  init: () => init,
  initNonEmpty: () => initNonEmpty,
  insertAt: () => insertAt,
  intersection: () => intersection,
  intersectionWith: () => intersectionWith,
  intersperse: () => intersperse,
  intersperseNonEmpty: () => intersperseNonEmpty,
  isEmptyArray: () => isEmptyArray,
  isEmptyReadonlyArray: () => isEmptyReadonlyArray,
  isNonEmptyArray: () => isNonEmptyArray2,
  isNonEmptyReadonlyArray: () => isNonEmptyReadonlyArray,
  join: () => join,
  last: () => last,
  lastNonEmpty: () => lastNonEmpty,
  length: () => length,
  liftEither: () => liftEither,
  liftNullable: () => liftNullable,
  liftOption: () => liftOption,
  liftPredicate: () => liftPredicate,
  make: () => make3,
  makeBy: () => makeBy,
  map: () => map2,
  mapAccum: () => mapAccum,
  match: () => match2,
  matchLeft: () => matchLeft,
  matchRight: () => matchRight,
  max: () => max2,
  min: () => min2,
  modify: () => modify,
  modifyNonEmptyHead: () => modifyNonEmptyHead,
  modifyNonEmptyLast: () => modifyNonEmptyLast,
  modifyOption: () => modifyOption,
  of: () => of,
  partition: () => partition,
  partitionMap: () => partitionMap,
  prepend: () => prepend,
  prependAll: () => prependAll,
  prependAllNonEmpty: () => prependAllNonEmpty,
  range: () => range,
  reduce: () => reduce,
  reduceRight: () => reduceRight,
  remove: () => remove,
  replace: () => replace,
  replaceOption: () => replaceOption,
  replicate: () => replicate,
  reverse: () => reverse,
  reverseNonEmpty: () => reverseNonEmpty,
  rotate: () => rotate,
  rotateNonEmpty: () => rotateNonEmpty,
  scan: () => scan,
  scanRight: () => scanRight,
  separate: () => separate,
  setNonEmptyHead: () => setNonEmptyHead,
  setNonEmptyLast: () => setNonEmptyLast,
  some: () => some3,
  sort: () => sort,
  sortBy: () => sortBy,
  sortByNonEmpty: () => sortByNonEmpty,
  sortNonEmpty: () => sortNonEmpty,
  sortWith: () => sortWith,
  span: () => span,
  splitAt: () => splitAt,
  splitNonEmptyAt: () => splitNonEmptyAt,
  tail: () => tail,
  tailNonEmpty: () => tailNonEmpty,
  take: () => take,
  takeRight: () => takeRight,
  takeWhile: () => takeWhile,
  unappend: () => unappend,
  unfold: () => unfold,
  union: () => union,
  unionNonEmpty: () => unionNonEmpty,
  unionNonEmptyWith: () => unionNonEmptyWith,
  unionWith: () => unionWith,
  unprepend: () => unprepend,
  unsafeGet: () => unsafeGet,
  unzip: () => unzip,
  unzipNonEmpty: () => unzipNonEmpty,
  zip: () => zip,
  zipNonEmpty: () => zipNonEmpty,
  zipNonEmptyWith: () => zipNonEmptyWith,
  zipWith: () => zipWith2
});

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/internal/readonlyArray.js
var isNonEmptyArray = (self) => self.length > 0;

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/ReadonlyRecord.js
var collect = /* @__PURE__ */ dual(2, (self, f) => {
  const out = [];
  for (const key of Object.keys(self)) {
    out.push(f(key, self[key]));
  }
  return out;
});
var toEntries = /* @__PURE__ */ collect((key, value) => [key, value]);

// node_modules/.pnpm/effect@2.0.0-next.55/node_modules/effect/dist/esm/ReadonlyArray.js
var make3 = (...elements) => elements;
var makeBy = (n, f) => {
  const max3 = Math.max(1, Math.floor(n));
  const out = [f(0)];
  for (let i = 1; i < max3; i++) {
    out.push(f(i));
  }
  return out;
};
var range = (start, end) => start <= end ? makeBy(end - start + 1, (i) => start + i) : [start];
var replicate = /* @__PURE__ */ dual(2, (a, n) => makeBy(n, () => a));
var fromIterable = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
var fromRecord = toEntries;
var fromOption3 = toArray;
var match2 = /* @__PURE__ */ dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(self) : onEmpty());
var matchLeft = /* @__PURE__ */ dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self)) : onEmpty());
var matchRight = /* @__PURE__ */ dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(initNonEmpty(self), lastNonEmpty(self)) : onEmpty());
var prepend = /* @__PURE__ */ dual(2, (self, head2) => [head2, ...self]);
var prependAll = /* @__PURE__ */ dual(2, (self, that) => fromIterable(that).concat(fromIterable(self)));
var prependAllNonEmpty = /* @__PURE__ */ dual(2, (self, that) => prependAll(self, that));
var append = /* @__PURE__ */ dual(2, (self, last2) => [...self, last2]);
var appendAll = /* @__PURE__ */ dual(2, (self, that) => fromIterable(self).concat(fromIterable(that)));
var appendAllNonEmpty = /* @__PURE__ */ dual(2, (self, that) => appendAll(self, that));
var scan = /* @__PURE__ */ dual(3, (self, b, f) => {
  const out = [b];
  let i = 0;
  for (const a of self) {
    out[i + 1] = f(out[i], a);
    i++;
  }
  return out;
});
var scanRight = /* @__PURE__ */ dual(3, (self, b, f) => {
  const input2 = fromIterable(self);
  const out = new Array(input2.length + 1);
  out[input2.length] = b;
  for (let i = input2.length - 1; i >= 0; i--) {
    out[i] = f(out[i + 1], input2[i]);
  }
  return out;
});
var isEmptyArray = (self) => self.length === 0;
var isEmptyReadonlyArray = isEmptyArray;
var isNonEmptyArray2 = isNonEmptyArray;
var isNonEmptyReadonlyArray = isNonEmptyArray;
var length = (self) => self.length;
var isOutOfBound = (i, as) => i < 0 || i >= as.length;
var clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length));
var get = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBound(i, self) ? none2() : some2(self[i]);
});
var unsafeGet = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index);
  if (isOutOfBound(i, self)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self[i];
});
var unprepend = (self) => [headNonEmpty(self), tailNonEmpty(self)];
var unappend = (self) => [initNonEmpty(self), lastNonEmpty(self)];
var head = /* @__PURE__ */ get(0);
var headNonEmpty = /* @__PURE__ */ unsafeGet(0);
var last = (self) => isNonEmptyReadonlyArray(self) ? some2(lastNonEmpty(self)) : none2();
var lastNonEmpty = (self) => self[self.length - 1];
var tail = (self) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? some2(tailNonEmpty(input2)) : none2();
};
var tailNonEmpty = (self) => self.slice(1);
var init = (self) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? some2(initNonEmpty(input2)) : none2();
};
var initNonEmpty = (self) => self.slice(0, -1);
var take = /* @__PURE__ */ dual(2, (self, n) => {
  const input2 = fromIterable(self);
  return input2.slice(0, clamp(n, input2));
});
var takeRight = /* @__PURE__ */ dual(2, (self, n) => {
  const input2 = fromIterable(self);
  const i = clamp(n, input2);
  return i === 0 ? [] : input2.slice(-i);
});
var takeWhile = /* @__PURE__ */ dual(2, (self, predicate) => {
  const out = [];
  for (const a of self) {
    if (!predicate(a)) {
      break;
    }
    out.push(a);
  }
  return out;
});
var spanIndex = (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (!predicate(a)) {
      break;
    }
    i++;
  }
  return i;
};
var span = /* @__PURE__ */ dual(2, (self, predicate) => splitAt(self, spanIndex(self, predicate)));
var drop = /* @__PURE__ */ dual(2, (self, n) => {
  const input2 = fromIterable(self);
  return input2.slice(clamp(n, input2), input2.length);
});
var dropRight = /* @__PURE__ */ dual(2, (self, n) => {
  const input2 = fromIterable(self);
  return input2.slice(0, input2.length - clamp(n, input2));
});
var dropWhile = /* @__PURE__ */ dual(2, (self, predicate) => fromIterable(self).slice(spanIndex(self, predicate)));
var findFirstIndex = /* @__PURE__ */ dual(2, (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (predicate(a)) {
      return some2(i);
    }
    i++;
  }
  return none2();
});
var findLastIndex = /* @__PURE__ */ dual(2, (self, predicate) => {
  const input2 = fromIterable(self);
  for (let i = input2.length - 1; i >= 0; i--) {
    if (predicate(input2[i])) {
      return some2(i);
    }
  }
  return none2();
});
var findFirst = /* @__PURE__ */ dual(2, (self, predicate) => {
  const input2 = fromIterable(self);
  for (let i = 0; i < input2.length; i++) {
    if (predicate(input2[i])) {
      return some2(input2[i]);
    }
  }
  return none2();
});
var findLast = /* @__PURE__ */ dual(2, (self, predicate) => {
  const input2 = fromIterable(self);
  for (let i = input2.length - 1; i >= 0; i--) {
    if (predicate(input2[i])) {
      return some2(input2[i]);
    }
  }
  return none2();
});
var insertAt = /* @__PURE__ */ dual(3, (self, i, b) => {
  const out = Array.from(self);
  if (i < 0 || i > out.length) {
    return none2();
  }
  out.splice(i, 0, b);
  return some2(out);
});
var replace = /* @__PURE__ */ dual(3, (self, i, b) => modify(self, i, () => b));
var replaceOption = /* @__PURE__ */ dual(3, (self, i, b) => modifyOption(self, i, () => b));
var modify = /* @__PURE__ */ dual(3, (self, i, f) => getOrElse(modifyOption(self, i, f), () => Array.from(self)));
var modifyOption = /* @__PURE__ */ dual(3, (self, i, f) => {
  const out = Array.from(self);
  if (isOutOfBound(i, out)) {
    return none2();
  }
  const next = f(out[i]);
  out[i] = next;
  return some2(out);
});
var remove = /* @__PURE__ */ dual(2, (self, i) => {
  const out = Array.from(self);
  if (isOutOfBound(i, out)) {
    return out;
  }
  out.splice(i, 1);
  return out;
});
var reverse = (self) => Array.from(self).reverse();
var reverseNonEmpty = (self) => [lastNonEmpty(self), ...self.slice(0, -1).reverse()];
var sort = /* @__PURE__ */ dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
var sortWith = /* @__PURE__ */ dual(3, (self, f, order) => sort(self, mapInput(order, f)));
var sortNonEmpty = /* @__PURE__ */ dual(2, (self, O) => sort(O)(self));
var sortBy = (...orders) => (self) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? sortByNonEmpty(...orders)(input2) : [];
};
var sortByNonEmpty = (...orders) => sortNonEmpty(combineAll(orders));
var zip = /* @__PURE__ */ dual(2, (self, that) => zipWith2(self, that, (a, b) => [a, b]));
var zipWith2 = /* @__PURE__ */ dual(3, (self, that, f) => {
  const as = fromIterable(self);
  const bs = fromIterable(that);
  return isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs) ? zipNonEmptyWith(bs, f)(as) : [];
});
var zipNonEmpty = /* @__PURE__ */ dual(2, (self, that) => zipNonEmptyWith(self, that, (a, b) => [a, b]));
var zipNonEmptyWith = /* @__PURE__ */ dual(3, (self, that, f) => {
  const cs = [f(headNonEmpty(self), headNonEmpty(that))];
  const len = Math.min(self.length, that.length);
  for (let i = 1; i < len; i++) {
    cs[i] = f(self[i], that[i]);
  }
  return cs;
});
var unzip = (self) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? unzipNonEmpty(input2) : [[], []];
};
var unzipNonEmpty = (self) => {
  const fa = [self[0][0]];
  const fb = [self[0][1]];
  for (let i = 1; i < self.length; i++) {
    fa[i] = self[i][0];
    fb[i] = self[i][1];
  }
  return [fa, fb];
};
var intersperse = /* @__PURE__ */ dual(2, (self, middle) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? intersperseNonEmpty(input2, middle) : [];
});
var intersperseNonEmpty = /* @__PURE__ */ dual(2, (self, middle) => {
  const out = [headNonEmpty(self)];
  const tail2 = tailNonEmpty(self);
  for (let i = 0; i < tail2.length; i++) {
    if (i < tail2.length) {
      out.push(middle);
    }
    out.push(tail2[i]);
  }
  return out;
});
var modifyNonEmptyHead = /* @__PURE__ */ dual(2, (self, f) => [f(headNonEmpty(self)), ...tailNonEmpty(self)]);
var setNonEmptyHead = /* @__PURE__ */ dual(2, (self, b) => modifyNonEmptyHead(self, () => b));
var modifyNonEmptyLast = /* @__PURE__ */ dual(2, (self, f) => append(initNonEmpty(self), f(lastNonEmpty(self))));
var setNonEmptyLast = /* @__PURE__ */ dual(2, (self, b) => modifyNonEmptyLast(self, () => b));
var rotate = /* @__PURE__ */ dual(2, (self, n) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? rotateNonEmpty(input2, n) : [];
});
var rotateNonEmpty = /* @__PURE__ */ dual(2, (self, n) => {
  const len = self.length;
  const m = Math.round(n) % len;
  if (isOutOfBound(Math.abs(m), self) || m === 0) {
    return copy(self);
  }
  if (m < 0) {
    const [f, s] = splitNonEmptyAt(self, -m);
    return appendAllNonEmpty(s, f);
  } else {
    return rotateNonEmpty(self, m - len);
  }
});
var containsWith = (isEquivalent) => dual(2, (self, a) => {
  for (const i of self) {
    if (isEquivalent(a, i)) {
      return true;
    }
  }
  return false;
});
var _equivalence = /* @__PURE__ */ equivalence();
var contains = /* @__PURE__ */ containsWith(_equivalence);
var dedupeNonEmptyWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const out = [headNonEmpty(self)];
  const rest = tailNonEmpty(self);
  for (const a of rest) {
    if (out.every((o) => !isEquivalent(a, o))) {
      out.push(a);
    }
  }
  return out;
});
var dedupeNonEmpty = /* @__PURE__ */ dedupeNonEmptyWith(/* @__PURE__ */ equivalence());
var chop = /* @__PURE__ */ dual(2, (self, f) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? chopNonEmpty(input2, f) : [];
});
var chopNonEmpty = /* @__PURE__ */ dual(2, (self, f) => {
  const [b, rest] = f(self);
  const out = [b];
  let next = rest;
  while (isNonEmptyArray(next)) {
    const [b2, rest2] = f(next);
    out.push(b2);
    next = rest2;
  }
  return out;
});
var splitAt = /* @__PURE__ */ dual(2, (self, n) => {
  const input2 = Array.from(self);
  return n >= 1 && isNonEmptyReadonlyArray(input2) ? splitNonEmptyAt(input2, n) : isEmptyReadonlyArray(input2) ? [input2, []] : [[], input2];
});
var copy = (self) => self.slice();
var splitNonEmptyAt = /* @__PURE__ */ dual(2, (self, n) => {
  const m = Math.max(1, n);
  return m >= self.length ? [copy(self), []] : [prepend(self.slice(1, m), headNonEmpty(self)), self.slice(m)];
});
var chunksOf = /* @__PURE__ */ dual(2, (self, n) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? chunksOfNonEmpty(input2, n) : [];
});
var chunksOfNonEmpty = /* @__PURE__ */ dual(2, (self, n) => chopNonEmpty(self, splitNonEmptyAt(n)));
var groupWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => chopNonEmpty(self, (as) => {
  const h = headNonEmpty(as);
  const out = [h];
  let i = 1;
  for (; i < as.length; i++) {
    const a = as[i];
    if (isEquivalent(a, h)) {
      out.push(a);
    } else {
      break;
    }
  }
  return [out, as.slice(i)];
}));
var group = /* @__PURE__ */ groupWith(/* @__PURE__ */ equivalence());
var groupBy = /* @__PURE__ */ dual(2, (self, f) => {
  const out = {};
  for (const a of self) {
    const k = f(a);
    if (Object.prototype.hasOwnProperty.call(out, k)) {
      out[k].push(a);
    } else {
      out[k] = [a];
    }
  }
  return out;
});
var unionWith = (isEquivalent) => dual(2, (self, that) => {
  const a = fromIterable(self);
  const b = fromIterable(that);
  return isNonEmptyReadonlyArray(a) && isNonEmptyReadonlyArray(b) ? unionNonEmptyWith(isEquivalent)(a, b) : isNonEmptyReadonlyArray(a) ? a : b;
});
var union = /* @__PURE__ */ unionWith(_equivalence);
var unionNonEmptyWith = (isEquivalent) => {
  const dedupe2 = dedupeNonEmptyWith(isEquivalent);
  return dual(2, (self, that) => dedupe2(appendAllNonEmpty(self, that)));
};
var unionNonEmpty = /* @__PURE__ */ unionNonEmptyWith(_equivalence);
var intersectionWith = (isEquivalent) => {
  const has = containsWith(isEquivalent);
  return dual(2, (self, that) => fromIterable(self).filter((a) => has(that, a)));
};
var intersection = /* @__PURE__ */ intersectionWith(_equivalence);
var differenceWith = (isEquivalent) => {
  const has = containsWith(isEquivalent);
  return dual(2, (self, that) => fromIterable(self).filter((a) => !has(that, a)));
};
var difference = /* @__PURE__ */ differenceWith(_equivalence);
var empty2 = () => [];
var of = (a) => [a];
var map2 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));
var flatMap2 = /* @__PURE__ */ dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    out.push(...f(self[i], i));
  }
  return out;
});
var flatMapNonEmpty = flatMap2;
var flatten = /* @__PURE__ */ flatMap2(identity);
var flattenNonEmpty = /* @__PURE__ */ flatMapNonEmpty(identity);
var filterMap = /* @__PURE__ */ dual(2, (self, f) => {
  const as = fromIterable(self);
  const out = [];
  for (let i = 0; i < as.length; i++) {
    const o = f(as[i], i);
    if (isSome2(o)) {
      out.push(o.value);
    }
  }
  return out;
});
var filterMapWhile = /* @__PURE__ */ dual(2, (self, f) => {
  const out = [];
  for (const a of self) {
    const b = f(a);
    if (isSome2(b)) {
      out.push(b.value);
    } else {
      break;
    }
  }
  return out;
});
var partitionMap = /* @__PURE__ */ dual(2, (self, f) => {
  const left3 = [];
  const right3 = [];
  const as = fromIterable(self);
  for (let i = 0; i < as.length; i++) {
    const e = f(as[i], i);
    if (isLeft2(e)) {
      left3.push(e.left);
    } else {
      right3.push(e.right);
    }
  }
  return [left3, right3];
});
var compact = /* @__PURE__ */ filterMap(identity);
var filter = /* @__PURE__ */ dual(2, (self, predicate) => {
  const as = fromIterable(self);
  const out = [];
  for (let i = 0; i < as.length; i++) {
    if (predicate(as[i], i)) {
      out.push(as[i]);
    }
  }
  return out;
});
var partition = /* @__PURE__ */ dual(2, (self, predicate) => {
  const left3 = [];
  const right3 = [];
  const as = fromIterable(self);
  for (let i = 0; i < as.length; i++) {
    if (predicate(as[i], i)) {
      right3.push(as[i]);
    } else {
      left3.push(as[i]);
    }
  }
  return [left3, right3];
});
var separate = /* @__PURE__ */ partitionMap(identity);
var reduce = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable(self).reduce((b2, a, i) => f(b2, a, i), b));
var reduceRight = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable(self).reduceRight((b2, a, i) => f(b2, a, i), b));
var liftPredicate = (predicate) => (b) => predicate(b) ? [b] : [];
var liftOption = (f) => (...a) => fromOption3(f(...a));
var fromNullable2 = (a) => a == null ? empty2() : [a];
var liftNullable = (f) => (...a) => fromNullable2(f(...a));
var flatMapNullable = /* @__PURE__ */ dual(2, (self, f) => isNonEmptyReadonlyArray(self) ? fromNullable2(f(headNonEmpty(self))) : empty2());
var liftEither = (f) => (...a) => {
  const e = f(...a);
  return isLeft2(e) ? [] : [e.right];
};
var every = /* @__PURE__ */ dual(2, (self, refinement) => self.every(refinement));
var some3 = /* @__PURE__ */ dual(2, (self, predicate) => self.some(predicate));
var extend = /* @__PURE__ */ dual(2, (self, f) => self.map((_, i, as) => f(as.slice(i))));
var min2 = /* @__PURE__ */ dual(2, (self, O) => self.reduce(min(O)));
var max2 = /* @__PURE__ */ dual(2, (self, O) => self.reduce(max(O)));
var unfold = (b, f) => {
  const out = [];
  let next = b;
  let o;
  while (isSome2(o = f(next))) {
    const [a, b2] = o.value;
    out.push(a);
    next = b2;
  }
  return out;
};
var getOrder = array3;
var getEquivalence2 = array2;
var forEach = /* @__PURE__ */ dual(2, (self, f) => fromIterable(self).forEach((a, i) => f(a, i)));
var dedupeWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const input2 = fromIterable(self);
  return isNonEmptyReadonlyArray(input2) ? dedupeNonEmptyWith(isEquivalent)(input2) : [];
});
var dedupe = /* @__PURE__ */ dedupeWith(/* @__PURE__ */ equivalence());
var dedupeAdjacentWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const out = [];
  let lastA = none2();
  for (const a of self) {
    if (isNone2(lastA) || !isEquivalent(a, lastA.value)) {
      out.push(a);
      lastA = some2(a);
    }
  }
  return out;
});
var dedupeAdjacent = /* @__PURE__ */ dedupeAdjacentWith(/* @__PURE__ */ equivalence());
var join = /* @__PURE__ */ dual(2, (self, sep) => fromIterable(self).join(sep));
var mapAccum = /* @__PURE__ */ dual(3, (self, s, f) => {
  let s1 = s;
  const out = [];
  for (const a of self) {
    const r = f(s1, a);
    s1 = r[0];
    out.push(r[1]);
  }
  return [s1, out];
});
var cartesianWith = /* @__PURE__ */ dual(3, (self, that, f) => flatMap2(self, (a) => map2(that, (b) => f(a, b))));
var cartesian = /* @__PURE__ */ dual(2, (self, that) => cartesianWith(self, that, (a, b) => [a, b]));

// lib/index.js
var divide = (a, b) => b === 0 ? Either_exports.left("cannot divide by zero") : Either_exports.right(a / b);
var input = [2, 3, 5];
var program = ReadonlyArray_exports.head(input).pipe(Either_exports.fromOption(() => "empty array"), Either_exports.flatMap((b) => divide(10, b)), Either_exports.match({
  onLeft: (e) => `Error: ${e}`,
  onRight: (a) => `Result: ${a}`
}));
console.log(program);
