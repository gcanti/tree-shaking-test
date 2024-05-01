"use strict";
const isFunction$1 = (input) => typeof input === "function";
const dual = function (arity, body) {
  if (typeof arity === "function") {
    return function () {
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
      return function (a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function (self) {
          return body(self, a);
        };
      };
    case 3:
      return function (a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function (self) {
          return body(self, a, b);
        };
      };
    case 4:
      return function (a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function (self) {
          return body(self, a, b, c);
        };
      };
    case 5:
      return function (a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function (self) {
          return body(self, a, b, c, d);
        };
      };
    default:
      return function () {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args = arguments;
        return function (self) {
          return body(self, ...args);
        };
      };
  }
};
const identity = (a) => a;
const constant = (value) => () => value;
const constTrue = constant(true);
const constFalse = constant(false);
const constUndefined = constant(undefined);
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
const make$p = (isEquivalent) => (self, that) =>
  self === that || isEquivalent(self, that);
const mapInput$1 = dual(2, (self, f) => make$p((x, y) => self(f(x), f(y))));
const array$1 = (item) =>
  make$p((self, that) => {
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
let moduleVersion = "3.1.0";
const getCurrentVersion = () => moduleVersion;
const globalStoreId = Symbol.for(
  `effect/GlobalValue/globalStoreId/${getCurrentVersion()}`
);
if (!(globalStoreId in globalThis)) {
  globalThis[globalStoreId] = new Map();
}
const globalStore = globalThis[globalStoreId];
const globalValue = (id, compute) => {
  if (!globalStore.has(id)) {
    globalStore.set(id, compute());
  }
  return globalStore.get(id);
};
const isString = (input) => typeof input === "string";
const isNumber = (input) => typeof input === "number";
const isBoolean = (input) => typeof input === "boolean";
const isBigInt = (input) => typeof input === "bigint";
const isSymbol = (input) => typeof input === "symbol";
const isFunction = isFunction$1;
const isUndefined = (input) => input === undefined;
const isNever = (_) => false;
const isRecordOrArray = (input) => typeof input === "object" && input !== null;
const isObject = (input) => isRecordOrArray(input) || isFunction(input);
const hasProperty = dual(
  2,
  (self, property) => isObject(self) && property in self
);
const isTagged = dual(
  2,
  (self, tag) => hasProperty(self, "_tag") && self["_tag"] === tag
);
const isNullable = (input) => input === null || input === undefined;
const isNotNullable = (input) => input !== null && input !== undefined;
const isDate = (input) => input instanceof Date;
const isIterable = (input) => hasProperty(input, Symbol.iterator);
const isRecord = (input) => isRecordOrArray(input) && !Array.isArray(input);
const isPromiseLike = (input) =>
  hasProperty(input, "then") && isFunction(input.then);
const getBugErrorMessage = (message) =>
  `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`;
let SingleShotGen$1 = class SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  next(a) {
    return this.called
      ? { value: a, done: true }
      : ((this.called = true), { value: this.self, done: false });
  }
  return(a) {
    return { value: a, done: true };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new SingleShotGen(this.self);
  }
};
const defaultIncHi = 335903614;
const defaultIncLo = 4150755663;
const MUL_HI = 1481765933 >>> 0;
const MUL_LO = 1284865837 >>> 0;
const BIT_53 = 9007199254740992;
const BIT_27 = 134217728;
class PCGRandom {
  _state;
  constructor(seedHi, seedLo, incHi, incLo) {
    if (isNullable(seedLo) && isNullable(seedHi)) {
      seedLo = (Math.random() * 4294967295) >>> 0;
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
    add64(
      this._state,
      this._state[0],
      this._state[1],
      seedHi >>> 0,
      seedLo >>> 0
    );
    this._next();
    return this;
  }
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  setState(state) {
    this._state[0] = state[0];
    this._state[1] = state[1];
    this._state[2] = state[2];
    this._state[3] = state[3] | 1;
  }
  integer(max) {
    if (!max) {
      return this._next();
    }
    max = max >>> 0;
    if ((max & (max - 1)) === 0) {
      return this._next() & (max - 1);
    }
    let num = 0;
    const skew = (-max >>> 0) % max >>> 0;
    for (num = this._next(); num < skew; num = this._next()) {}
    return num % max;
  }
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(
      this._state,
      this._state[0],
      this._state[1],
      this._state[2],
      this._state[3]
    );
    let xsHi = oldHi >>> 18;
    let xsLo = ((oldLo >>> 18) | (oldHi << 14)) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = ((xsLo >>> 27) | (xsHi << 5)) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = ((-rot >>> 0) & 31) >>> 0;
    return ((xorshifted >>> rot) | (xorshifted << rot2)) >>> 0;
  }
}
function mul64(out, aHi, aLo, bHi, bLo) {
  let c1 = ((aLo >>> 16) * (bLo & 65535)) >>> 0;
  let c0 = ((aLo & 65535) * (bLo >>> 16)) >>> 0;
  let lo = ((aLo & 65535) * (bLo & 65535)) >>> 0;
  let hi = ((aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16))) >>> 0;
  c0 = (c0 << 16) >>> 0;
  lo = (lo + c0) >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = (hi + 1) >>> 0;
  }
  c1 = (c1 << 16) >>> 0;
  lo = (lo + c1) >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = (hi + 1) >>> 0;
  }
  hi = (hi + Math.imul(aLo, bHi)) >>> 0;
  hi = (hi + Math.imul(aHi, bLo)) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
function add64(out, aHi, aLo, bHi, bLo) {
  let hi = (aHi + bHi) >>> 0;
  const lo = (aLo + bLo) >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = (hi + 1) | 0;
  }
  out[0] = hi;
  out[1] = lo;
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
);
const pcgr = globalValue(Symbol.for("effect/Hash/pcgr"), () => new PCGRandom());
const symbol$1 = Symbol.for("effect/Hash");
const hash = (self) => {
  switch (typeof self) {
    case "number":
      return number$1(self);
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
        return self[symbol$1]();
      } else {
        return random(self);
      }
    }
    default:
      throw new Error(
        `BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`
      );
  }
};
const random = (self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, number$1(pcgr.integer(Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
const combine$5 = (b) => (self) => (self * 53) ^ b;
const optimize = (n) => (n & 3221225471) | ((n >>> 1) & 1073741824);
const isHash = (u) => hasProperty(u, symbol$1);
const number$1 = (n) => {
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
const string = (str) => {
  let h = 5381,
    i = str.length;
  while (i) {
    h = (h * 33) ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
const structureKeys = (o, keys) => {
  let h = 12289;
  for (let i = 0; i < keys.length; i++) {
    h ^= pipe(string(keys[i]), combine$5(hash(o[keys[i]])));
  }
  return optimize(h);
};
const structure = (o) => structureKeys(o, Object.keys(o));
const array = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine$5(hash(arr[i])));
  }
  return optimize(h);
};
const cached = function () {
  if (arguments.length === 1) {
    const self = arguments[0];
    return function (hash) {
      Object.defineProperty(self, symbol$1, {
        value() {
          return hash;
        },
        enumerable: false,
      });
      return hash;
    };
  }
  const self = arguments[0];
  const hash = arguments[1];
  Object.defineProperty(self, symbol$1, {
    value() {
      return hash;
    },
    enumerable: false,
  });
  return hash;
};
const symbol = Symbol.for("effect/Equal");
function equals$1() {
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
  if (
    (selfType === "object" || selfType === "function") &&
    self !== null &&
    that !== null
  ) {
    if (isEqual(self) && isEqual(that)) {
      return hash(self) === hash(that) && self[symbol](that);
    }
  }
  return false;
}
const isEqual = (u) => hasProperty(u, symbol);
const equivalence = () => equals$1;
const NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
const toJSON = (x) => {
  if (
    hasProperty(x, "toJSON") &&
    isFunction(x["toJSON"]) &&
    x["toJSON"].length === 0
  ) {
    return x.toJSON();
  } else if (Array.isArray(x)) {
    return x.map(toJSON);
  }
  return x;
};
const format$1 = (x) => JSON.stringify(x, null, 2);
const toStringUnknown = (u, whitespace = 2) => {
  try {
    return typeof u === "object" ? stringifyCircular(u, whitespace) : String(u);
  } catch (_) {
    return String(u);
  }
};
const stringifyCircular = (obj, whitespace) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (_key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined
          : cache.push(value) && value
        : value,
    whitespace
  );
  cache = undefined;
  return retVal;
};
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
      for (let i = 0, len = args.length; i < len; i++) {
        ret = args[i](ret);
      }
      return ret;
    }
  }
};
const OP_ASYNC = "Async";
const OP_COMMIT = "Commit";
const OP_FAILURE = "Failure";
const OP_ON_FAILURE = "OnFailure";
const OP_ON_SUCCESS = "OnSuccess";
const OP_ON_SUCCESS_AND_FAILURE = "OnSuccessAndFailure";
const OP_SUCCESS = "Success";
const OP_SYNC = "Sync";
const OP_TAG = "Tag";
const OP_UPDATE_RUNTIME_FLAGS = "UpdateRuntimeFlags";
const OP_WHILE = "While";
const OP_WITH_RUNTIME = "WithRuntime";
const OP_YIELD = "Yield";
const OP_REVERT_FLAGS = "RevertFlags";
const EffectTypeId$2 = Symbol.for("effect/Effect");
const StreamTypeId = Symbol.for("effect/Stream");
const SinkTypeId = Symbol.for("effect/Sink");
const ChannelTypeId = Symbol.for("effect/Channel");
const effectVariance = {
  _R: (_) => _,
  _E: (_) => _,
  _A: (_) => _,
  _V: getCurrentVersion(),
};
const sinkVariance = {
  _A: (_) => _,
  _In: (_) => _,
  _L: (_) => _,
  _E: (_) => _,
  _R: (_) => _,
};
const channelVariance = {
  _Env: (_) => _,
  _InErr: (_) => _,
  _InElem: (_) => _,
  _InDone: (_) => _,
  _OutErr: (_) => _,
  _OutElem: (_) => _,
  _OutDone: (_) => _,
};
const EffectPrototype = {
  [EffectTypeId$2]: effectVariance,
  [StreamTypeId]: effectVariance,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol](that) {
    return this === that;
  },
  [symbol$1]() {
    return cached(this, random(this));
  },
  [Symbol.iterator]() {
    return new SingleShotGen$1(new YieldWrap(this));
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const StructuralPrototype = {
  [symbol$1]() {
    return cached(this, structure(this));
  },
  [symbol](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key of selfKeys) {
      if (!(key in that && equals$1(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  },
};
const CommitPrototype = { ...EffectPrototype, _op: OP_COMMIT };
const StructuralCommitPrototype = {
  ...CommitPrototype,
  ...StructuralPrototype,
};
const TypeId$9 = Symbol.for("effect/Option");
const CommonProto$1 = {
  ...EffectPrototype,
  [TypeId$9]: { _A: (_) => _ },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format$1(this.toJSON());
  },
};
const SomeProto = Object.assign(Object.create(CommonProto$1), {
  _tag: "Some",
  _op: "Some",
  [symbol](that) {
    return isOption(that) && isSome$1(that) && equals$1(that.value, this.value);
  },
  [symbol$1]() {
    return cached(this, combine$5(hash(this._tag))(hash(this.value)));
  },
  toJSON() {
    return { _id: "Option", _tag: this._tag, value: toJSON(this.value) };
  },
});
const NoneHash = hash("None");
const NoneProto = Object.assign(Object.create(CommonProto$1), {
  _tag: "None",
  _op: "None",
  [symbol](that) {
    return isOption(that) && isNone$1(that);
  },
  [symbol$1]() {
    return NoneHash;
  },
  toJSON() {
    return { _id: "Option", _tag: this._tag };
  },
});
const isOption = (input) => hasProperty(input, TypeId$9);
const isNone$1 = (fa) => fa._tag === "None";
const isSome$1 = (fa) => fa._tag === "Some";
const none$5 = Object.create(NoneProto);
const some$1 = (value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};
const TypeId$8 = Symbol.for("effect/Either");
const CommonProto = {
  ...EffectPrototype,
  [TypeId$8]: { _R: (_) => _ },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format$1(this.toJSON());
  },
};
const RightProto = Object.assign(Object.create(CommonProto), {
  _tag: "Right",
  _op: "Right",
  [symbol](that) {
    return (
      isEither(that) && isRight$1(that) && equals$1(that.right, this.right)
    );
  },
  [symbol$1]() {
    return combine$5(hash(this._tag))(hash(this.right));
  },
  toJSON() {
    return { _id: "Either", _tag: this._tag, right: toJSON(this.right) };
  },
});
const LeftProto = Object.assign(Object.create(CommonProto), {
  _tag: "Left",
  _op: "Left",
  [symbol](that) {
    return isEither(that) && isLeft$1(that) && equals$1(that.left, this.left);
  },
  [symbol$1]() {
    return combine$5(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return { _id: "Either", _tag: this._tag, left: toJSON(this.left) };
  },
});
const isEither = (input) => hasProperty(input, TypeId$8);
const isLeft$1 = (ma) => ma._tag === "Left";
const isRight$1 = (ma) => ma._tag === "Right";
const left$1 = (left) => {
  const a = Object.create(LeftProto);
  a.left = left;
  return a;
};
const right$1 = (right) => {
  const a = Object.create(RightProto);
  a.right = right;
  return a;
};
const right = right$1;
const left = left$1;
const isLeft = isLeft$1;
const isRight = isRight$1;
const mapLeft = dual(2, (self, f) =>
  isLeft(self) ? left(f(self.left)) : right(self.right)
);
const match$3 = dual(2, (self, { onLeft: onLeft, onRight: onRight }) =>
  isLeft(self) ? onLeft(self.left) : onRight(self.right)
);
const merge$3 = match$3({ onLeft: identity, onRight: identity });
const isNonEmptyArray$1 = (self) => self.length > 0;
const make$o = (compare) => (self, that) =>
  self === that ? 0 : compare(self, that);
const number = make$o((self, that) => (self < that ? -1 : 1));
const mapInput = dual(2, (self, f) => make$o((b1, b2) => self(f(b1), f(b2))));
const greaterThan$1 = (O) => dual(2, (self, that) => O(self, that) === 1);
const none$4 = () => none$5;
const some = some$1;
const isNone = isNone$1;
const isSome = isSome$1;
const match$2 = dual(2, (self, { onNone: onNone, onSome: onSome }) =>
  isNone(self) ? onNone() : onSome(self.value)
);
const getOrElse = dual(2, (self, onNone) =>
  isNone(self) ? onNone() : self.value
);
const orElse$2 = dual(2, (self, that) => (isNone(self) ? that() : self));
const orElseSome = dual(2, (self, onNone) =>
  isNone(self) ? some(onNone()) : self
);
const fromNullable = (nullableValue) =>
  nullableValue == null ? none$4() : some(nullableValue);
const getOrUndefined = getOrElse(constUndefined);
const liftThrowable =
  (f) =>
  (...a) => {
    try {
      return some(f(...a));
    } catch (e) {
      return none$4();
    }
  };
const getOrThrowWith = dual(2, (self, onNone) => {
  if (isSome(self)) {
    return self.value;
  }
  throw onNone();
});
const getOrThrow = getOrThrowWith(
  () => new Error("getOrThrow called on a None")
);
const map$6 = dual(2, (self, f) =>
  isNone(self) ? none$4() : some(f(self.value))
);
const flatMap$4 = dual(2, (self, f) =>
  isNone(self) ? none$4() : f(self.value)
);
const filterMap = dual(2, (self, f) =>
  isNone(self) ? none$4() : f(self.value)
);
const containsWith = (isEquivalent) =>
  dual(2, (self, a) => (isNone(self) ? false : isEquivalent(self.value, a)));
const _equivalence$3 = equivalence();
const contains = containsWith(_equivalence$3);
const make$n = (...elements) => elements;
const allocate = (n) => new Array(n);
const makeBy = (n, f) => {
  const max = Math.max(1, Math.floor(n));
  const out = new Array(max);
  for (let i = 0; i < max; i++) {
    out[i] = f(i);
  }
  return out;
};
const fromIterable$6 = (collection) =>
  Array.isArray(collection) ? collection : Array.from(collection);
const matchLeft = dual(
  2,
  (self, { onEmpty: onEmpty, onNonEmpty: onNonEmpty }) =>
    isNonEmptyReadonlyArray(self)
      ? onNonEmpty(headNonEmpty$1(self), tailNonEmpty$1(self))
      : onEmpty()
);
const prepend$2 = dual(2, (self, head) => [head, ...self]);
const append$1 = dual(2, (self, last) => [...self, last]);
const appendAll$2 = dual(2, (self, that) =>
  fromIterable$6(self).concat(fromIterable$6(that))
);
const isArray = Array.isArray;
const isEmptyArray = (self) => self.length === 0;
const isEmptyReadonlyArray = isEmptyArray;
const isNonEmptyArray = isNonEmptyArray$1;
const isNonEmptyReadonlyArray = isNonEmptyArray$1;
const isOutOfBound = (i, as) => i < 0 || i >= as.length;
const clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length));
const get$7 = dual(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBound(i, self) ? none$4() : some(self[i]);
});
const unsafeGet$3 = dual(2, (self, index) => {
  const i = Math.floor(index);
  if (isOutOfBound(i, self)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self[i];
});
const head = get$7(0);
const headNonEmpty$1 = unsafeGet$3(0);
const last = (self) =>
  isNonEmptyReadonlyArray(self) ? some(lastNonEmpty(self)) : none$4();
const lastNonEmpty = (self) => self[self.length - 1];
const tailNonEmpty$1 = (self) => self.slice(1);
const spanIndex = (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (!predicate(a, i)) {
      break;
    }
    i++;
  }
  return i;
};
const span = dual(2, (self, predicate) =>
  splitAt(self, spanIndex(self, predicate))
);
const drop$1 = dual(2, (self, n) => {
  const input = fromIterable$6(self);
  return input.slice(clamp(n, input), input.length);
});
const reverse$2 = (self) => Array.from(self).reverse();
const sort = dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
const zip$1 = dual(2, (self, that) => zipWith(self, that, make$n));
const zipWith = dual(3, (self, that, f) => {
  const as = fromIterable$6(self);
  const bs = fromIterable$6(that);
  if (isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)) {
    const out = [f(headNonEmpty$1(as), headNonEmpty$1(bs))];
    const len = Math.min(as.length, bs.length);
    for (let i = 1; i < len; i++) {
      out[i] = f(as[i], bs[i]);
    }
    return out;
  }
  return [];
});
const _equivalence$2 = equivalence();
const splitAt = dual(2, (self, n) => {
  const input = Array.from(self);
  const _n = Math.floor(n);
  if (isNonEmptyReadonlyArray(input)) {
    if (_n >= 1) {
      return splitNonEmptyAt(input, _n);
    }
    return [[], input];
  }
  return [input, []];
});
const splitNonEmptyAt = dual(2, (self, n) => {
  const _n = Math.max(1, Math.floor(n));
  return _n >= self.length
    ? [copy$1(self), []]
    : [prepend$2(self.slice(1, _n), headNonEmpty$1(self)), self.slice(_n)];
});
const copy$1 = (self) => self.slice();
const unionWith = dual(3, (self, that, isEquivalent) => {
  const a = fromIterable$6(self);
  const b = fromIterable$6(that);
  if (isNonEmptyReadonlyArray(a)) {
    if (isNonEmptyReadonlyArray(b)) {
      const dedupe = dedupeWith(isEquivalent);
      return dedupe(appendAll$2(a, b));
    }
    return a;
  }
  return b;
});
const union$2 = dual(2, (self, that) => unionWith(self, that, _equivalence$2));
const empty$j = () => [];
const of$2 = (a) => [a];
const map$5 = dual(2, (self, f) => self.map(f));
const flatMap$3 = dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    const inner = f(self[i], i);
    for (let j = 0; j < inner.length; j++) {
      out.push(inner[j]);
    }
  }
  return out;
});
const flatten$3 = flatMap$3(identity);
const reduce$6 = dual(3, (self, b, f) =>
  fromIterable$6(self).reduce((b, a, i) => f(b, a, i), b)
);
const unfold = (b, f) => {
  const out = [];
  let next = b;
  let o;
  while (isSome((o = f(next)))) {
    const [a, b] = o.value;
    out.push(a);
    next = b;
  }
  return out;
};
const getEquivalence$2 = array$1;
const dedupeWith = dual(2, (self, isEquivalent) => {
  const input = fromIterable$6(self);
  if (isNonEmptyReadonlyArray(input)) {
    const out = [headNonEmpty$1(input)];
    const rest = tailNonEmpty$1(input);
    for (const r of rest) {
      if (out.every((a) => !isEquivalent(r, a))) {
        out.push(r);
      }
    }
    return out;
  }
  return [];
});
const dedupe = (self) => dedupeWith(self, equivalence());
const join$1 = dual(2, (self, sep) => fromIterable$6(self).join(sep));
const TypeId$7 = Symbol.for("effect/Chunk");
function copy(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
const emptyArray = [];
const getEquivalence$1 = (isEquivalent) =>
  make$p(
    (self, that) =>
      self.length === that.length &&
      toReadonlyArray(self).every((value, i) =>
        isEquivalent(value, unsafeGet$2(that, i))
      )
  );
const _equivalence$1 = getEquivalence$1(equals$1);
const ChunkProto = {
  [TypeId$7]: { _A: (_) => _ },
  toString() {
    return format$1(this.toJSON());
  },
  toJSON() {
    return { _id: "Chunk", values: toReadonlyArray(this).map(toJSON) };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol](that) {
    return isChunk(that) && _equivalence$1(this, that);
  },
  [symbol$1]() {
    return cached(this, array(toReadonlyArray(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const makeChunk = (backing) => {
  const chunk = Object.create(ChunkProto);
  chunk.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk.length = 0;
      chunk.depth = 0;
      chunk.left = chunk;
      chunk.right = chunk;
      break;
    }
    case "IConcat": {
      chunk.length = backing.left.length + backing.right.length;
      chunk.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk.left = backing.left;
      chunk.right = backing.right;
      break;
    }
    case "IArray": {
      chunk.length = backing.array.length;
      chunk.depth = 0;
      chunk.left = _empty$6;
      chunk.right = _empty$6;
      break;
    }
    case "ISingleton": {
      chunk.length = 1;
      chunk.depth = 0;
      chunk.left = _empty$6;
      chunk.right = _empty$6;
      break;
    }
    case "ISlice": {
      chunk.length = backing.length;
      chunk.depth = backing.chunk.depth + 1;
      chunk.left = _empty$6;
      chunk.right = _empty$6;
      break;
    }
  }
  return chunk;
};
const isChunk = (u) => hasProperty(u, TypeId$7);
const _empty$6 = makeChunk({ _tag: "IEmpty" });
const empty$i = () => _empty$6;
const make$m = (...as) =>
  as.length === 1 ? of$1(as[0]) : unsafeFromNonEmptyArray(as);
const of$1 = (a) => makeChunk({ _tag: "ISingleton", a: a });
const fromIterable$5 = (self) =>
  isChunk(self)
    ? self
    : makeChunk({ _tag: "IArray", array: fromIterable$6(self) });
const copyToArray = (self, array, initial) => {
  switch (self.backing._tag) {
    case "IArray": {
      copy(self.backing.array, 0, array, initial, self.length);
      break;
    }
    case "IConcat": {
      copyToArray(self.left, array, initial);
      copyToArray(self.right, array, initial + self.left.length);
      break;
    }
    case "ISingleton": {
      array[initial] = self.backing.a;
      break;
    }
    case "ISlice": {
      let i = 0;
      let j = initial;
      while (i < self.length) {
        array[j] = unsafeGet$2(self, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
};
const toReadonlyArray = (self) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      return emptyArray;
    }
    case "IArray": {
      return self.backing.array;
    }
    default: {
      const arr = new Array(self.length);
      copyToArray(self, arr, 0);
      self.backing = { _tag: "IArray", array: arr };
      self.left = _empty$6;
      self.right = _empty$6;
      self.depth = 0;
      return arr;
    }
  }
};
const reverse$1 = (self) => {
  switch (self.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self;
    case "IArray": {
      return makeChunk({
        _tag: "IArray",
        array: reverse$2(self.backing.array),
      });
    }
    case "IConcat": {
      return makeChunk({
        _tag: "IConcat",
        left: reverse$1(self.backing.right),
        right: reverse$1(self.backing.left),
      });
    }
    case "ISlice":
      return unsafeFromArray(reverse$2(toReadonlyArray(self)));
  }
};
const unsafeFromArray = (self) => makeChunk({ _tag: "IArray", array: self });
const unsafeFromNonEmptyArray = (self) => unsafeFromArray(self);
const unsafeGet$2 = dual(2, (self, index) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      throw new Error(`Index out of bounds`);
    }
    case "ISingleton": {
      if (index !== 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.a;
    }
    case "IArray": {
      if (index >= self.length || index < 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.array[index];
    }
    case "IConcat": {
      return index < self.left.length
        ? unsafeGet$2(self.left, index)
        : unsafeGet$2(self.right, index - self.left.length);
    }
    case "ISlice": {
      return unsafeGet$2(self.backing.chunk, index + self.backing.offset);
    }
  }
});
const append = dual(2, (self, a) => appendAll$1(self, of$1(a)));
const prepend$1 = dual(2, (self, elem) => appendAll$1(of$1(elem), self));
const drop = dual(2, (self, n) => {
  if (n <= 0) {
    return self;
  } else if (n >= self.length) {
    return _empty$6;
  } else {
    switch (self.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self.backing.chunk,
          offset: self.backing.offset + n,
          length: self.backing.length - n,
        });
      }
      case "IConcat": {
        if (n > self.left.length) {
          return drop(self.right, n - self.left.length);
        }
        return makeChunk({
          _tag: "IConcat",
          left: drop(self.left, n),
          right: self.right,
        });
      }
      default: {
        return makeChunk({
          _tag: "ISlice",
          chunk: self,
          offset: n,
          length: self.length - n,
        });
      }
    }
  }
});
const appendAll$1 = dual(2, (self, that) => {
  if (self.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self;
  }
  const diff = that.depth - self.depth;
  if (Math.abs(diff) <= 1) {
    return makeChunk({ _tag: "IConcat", left: self, right: that });
  } else if (diff < -1) {
    if (self.left.depth >= self.right.depth) {
      const nr = appendAll$1(self.right, that);
      return makeChunk({ _tag: "IConcat", left: self.left, right: nr });
    } else {
      const nrr = appendAll$1(self.right.right, that);
      if (nrr.depth === self.depth - 3) {
        const nr = makeChunk({
          _tag: "IConcat",
          left: self.right.left,
          right: nrr,
        });
        return makeChunk({ _tag: "IConcat", left: self.left, right: nr });
      } else {
        const nl = makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: self.right.left,
        });
        return makeChunk({ _tag: "IConcat", left: nl, right: nrr });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = appendAll$1(self, that.left);
      return makeChunk({ _tag: "IConcat", left: nl, right: that.right });
    } else {
      const nll = appendAll$1(self, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk({
          _tag: "IConcat",
          left: nll,
          right: that.left.right,
        });
        return makeChunk({ _tag: "IConcat", left: nl, right: that.right });
      } else {
        const nr = makeChunk({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right,
        });
        return makeChunk({ _tag: "IConcat", left: nll, right: nr });
      }
    }
  }
});
const isEmpty$3 = (self) => self.length === 0;
const isNonEmpty = (self) => self.length > 0;
const unsafeHead = (self) => unsafeGet$2(self, 0);
const headNonEmpty = unsafeHead;
const tailNonEmpty = (self) => drop(self, 1);
const SIZE = 5;
const BUCKET_SIZE = Math.pow(2, SIZE);
const MASK = BUCKET_SIZE - 1;
const MAX_INDEX_NODE = BUCKET_SIZE / 2;
const MIN_ARRAY_NODE = BUCKET_SIZE / 4;
function popcount(x) {
  x -= (x >> 1) & 1431655765;
  x = (x & 858993459) + ((x >> 2) & 858993459);
  x = (x + (x >> 4)) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function hashFragment(shift, h) {
  return (h >>> shift) & MASK;
}
function toBitmap(x) {
  return 1 << x;
}
function fromBitmap(bitmap, bit) {
  return popcount(bitmap & (bit - 1));
}
const make$l = (value, previous) => ({ value: value, previous: previous });
function arrayUpdate(mutate, at, v, arr) {
  let out = arr;
  if (!mutate) {
    const len = arr.length;
    out = new Array(len);
    for (let i = 0; i < len; ++i) out[i] = arr[i];
  }
  out[at] = v;
  return out;
}
function arraySpliceOut(mutate, at, arr) {
  const newLen = arr.length - 1;
  let i = 0;
  let g = 0;
  let out = arr;
  if (mutate) {
    i = g = at;
  } else {
    out = new Array(newLen);
    while (i < at) out[g++] = arr[i++];
  }
  ++i;
  while (i <= newLen) out[g++] = arr[i++];
  if (mutate) {
    out.length = newLen;
  }
  return out;
}
function arraySpliceIn(mutate, at, v, arr) {
  const len = arr.length;
  if (mutate) {
    let i = len;
    while (i >= at) arr[i--] = arr[i];
    arr[at] = v;
    return arr;
  }
  let i = 0,
    g = 0;
  const out = new Array(len + 1);
  while (i < at) out[g++] = arr[i++];
  out[at] = v;
  while (i < len) out[++g] = arr[i++];
  return out;
}
class EmptyNode {
  _tag = "EmptyNode";
  modify(edit, _shift, f, hash, key, size) {
    const v = f(none$4());
    if (isNone(v)) return new EmptyNode();
    ++size.value;
    return new LeafNode(edit, hash, key, v);
  }
}
function isEmptyNode(a) {
  return isTagged(a, "EmptyNode");
}
function isLeafNode(node) {
  return (
    isEmptyNode(node) ||
    node._tag === "LeafNode" ||
    node._tag === "CollisionNode"
  );
}
function canEditNode(node, edit) {
  return isEmptyNode(node) ? false : edit === node.edit;
}
class LeafNode {
  edit;
  hash;
  key;
  value;
  _tag = "LeafNode";
  constructor(edit, hash, key, value) {
    this.edit = edit;
    this.hash = hash;
    this.key = key;
    this.value = value;
  }
  modify(edit, shift, f, hash, key, size) {
    if (equals$1(key, this.key)) {
      const v = f(this.value);
      if (v === this.value) return this;
      else if (isNone(v)) {
        --size.value;
        return new EmptyNode();
      }
      if (canEditNode(this, edit)) {
        this.value = v;
        return this;
      }
      return new LeafNode(edit, hash, key, v);
    }
    const v = f(none$4());
    if (isNone(v)) return this;
    ++size.value;
    return mergeLeaves(
      edit,
      shift,
      this.hash,
      this,
      hash,
      new LeafNode(edit, hash, key, v)
    );
  }
}
class CollisionNode {
  edit;
  hash;
  children;
  _tag = "CollisionNode";
  constructor(edit, hash, children) {
    this.edit = edit;
    this.hash = hash;
    this.children = children;
  }
  modify(edit, shift, f, hash, key, size) {
    if (hash === this.hash) {
      const canEdit = canEditNode(this, edit);
      const list = this.updateCollisionList(
        canEdit,
        edit,
        this.hash,
        this.children,
        f,
        key,
        size
      );
      if (list === this.children) return this;
      return list.length > 1
        ? new CollisionNode(edit, this.hash, list)
        : list[0];
    }
    const v = f(none$4());
    if (isNone(v)) return this;
    ++size.value;
    return mergeLeaves(
      edit,
      shift,
      this.hash,
      this,
      hash,
      new LeafNode(edit, hash, key, v)
    );
  }
  updateCollisionList(mutate, edit, hash, list, f, key, size) {
    const len = list.length;
    for (let i = 0; i < len; ++i) {
      const child = list[i];
      if ("key" in child && equals$1(key, child.key)) {
        const value = child.value;
        const newValue = f(value);
        if (newValue === value) return list;
        if (isNone(newValue)) {
          --size.value;
          return arraySpliceOut(mutate, i, list);
        }
        return arrayUpdate(
          mutate,
          i,
          new LeafNode(edit, hash, key, newValue),
          list
        );
      }
    }
    const newValue = f(none$4());
    if (isNone(newValue)) return list;
    ++size.value;
    return arrayUpdate(
      mutate,
      len,
      new LeafNode(edit, hash, key, newValue),
      list
    );
  }
}
class IndexedNode {
  edit;
  mask;
  children;
  _tag = "IndexedNode";
  constructor(edit, mask, children) {
    this.edit = edit;
    this.mask = mask;
    this.children = children;
  }
  modify(edit, shift, f, hash, key, size) {
    const mask = this.mask;
    const children = this.children;
    const frag = hashFragment(shift, hash);
    const bit = toBitmap(frag);
    const indx = fromBitmap(mask, bit);
    const exists = mask & bit;
    const canEdit = canEditNode(this, edit);
    if (!exists) {
      const _newChild = new EmptyNode().modify(
        edit,
        shift + SIZE,
        f,
        hash,
        key,
        size
      );
      if (!_newChild) return this;
      return children.length >= MAX_INDEX_NODE
        ? expand(edit, frag, _newChild, mask, children)
        : new IndexedNode(
            edit,
            mask | bit,
            arraySpliceIn(canEdit, indx, _newChild, children)
          );
    }
    const current = children[indx];
    const child = current.modify(edit, shift + SIZE, f, hash, key, size);
    if (current === child) return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode(child)) {
      bitmap &= ~bit;
      if (!bitmap) return new EmptyNode();
      if (children.length <= 2 && isLeafNode(children[indx ^ 1])) {
        return children[indx ^ 1];
      }
      newChildren = arraySpliceOut(canEdit, indx, children);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new IndexedNode(edit, bitmap, newChildren);
  }
}
class ArrayNode {
  edit;
  size;
  children;
  _tag = "ArrayNode";
  constructor(edit, size, children) {
    this.edit = edit;
    this.size = size;
    this.children = children;
  }
  modify(edit, shift, f, hash, key, size) {
    let count = this.size;
    const children = this.children;
    const frag = hashFragment(shift, hash);
    const child = children[frag];
    const newChild = (child || new EmptyNode()).modify(
      edit,
      shift + SIZE,
      f,
      hash,
      key,
      size
    );
    if (child === newChild) return this;
    const canEdit = canEditNode(this, edit);
    let newChildren;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      ++count;
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      --count;
      if (count <= MIN_ARRAY_NODE) {
        return pack(edit, count, frag, children);
      }
      newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return new ArrayNode(edit, count, newChildren);
  }
}
function pack(edit, count, removed, elements) {
  const children = new Array(count - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode(elem)) {
        children[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode(edit, bitmap, children);
}
function expand(edit, frag, child, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count = 0;
  for (let i = 0; bit; ++i) {
    if (bit & 1) arr[i] = subNodes[count++];
    bit >>>= 1;
  }
  arr[frag] = child;
  return new ArrayNode(edit, count + 1, arr);
}
function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
  if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1]);
  const subH1 = hashFragment(shift, h1);
  const subH2 = hashFragment(shift, h2);
  if (subH1 === subH2) {
    return (child) =>
      new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child]);
  } else {
    const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), children);
  }
}
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
  let stack = undefined;
  let currentShift = shift;
  while (true) {
    const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
    if (typeof res === "function") {
      stack = make$l(res, stack);
      currentShift = currentShift + SIZE;
    } else {
      let final = res;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
}
const HashMapSymbolKey = "effect/HashMap";
const HashMapTypeId = Symbol.for(HashMapSymbolKey);
const HashMapProto = {
  [HashMapTypeId]: HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator(this, (k, v) => [k, v]);
  },
  [symbol$1]() {
    let hash$1 = hash(HashMapSymbolKey);
    for (const item of this) {
      hash$1 ^= pipe(hash(item[0]), combine$5(hash(item[1])));
    }
    return cached(this, hash$1);
  },
  [symbol](that) {
    if (isHashMap(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = pipe(that, getHash(item[0], hash(item[0])));
        if (isNone(elem)) {
          return false;
        } else {
          if (!equals$1(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return format$1(this.toJSON());
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
};
const makeImpl$1 = (editable, edit, root, size) => {
  const map = Object.create(HashMapProto);
  map._editable = editable;
  map._edit = edit;
  map._root = root;
  map._size = size;
  return map;
};
class HashMapIterator {
  map;
  f;
  v;
  constructor(map, f) {
    this.map = map;
    this.f = f;
    this.v = visitLazy(this.map._root, this.f, undefined);
  }
  next() {
    if (isNone(this.v)) {
      return { done: true, value: undefined };
    }
    const v0 = this.v.value;
    this.v = applyCont(v0.cont);
    return { done: false, value: v0.value };
  }
  [Symbol.iterator]() {
    return new HashMapIterator(this.map, this.f);
  }
}
const applyCont = (cont) =>
  cont
    ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4])
    : none$4();
const visitLazy = (node, f, cont = undefined) => {
  switch (node._tag) {
    case "LeafNode": {
      if (isSome(node.value)) {
        return some({ value: f(node.key, node.value.value), cont: cont });
      }
      return applyCont(cont);
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children = node.children;
      return visitLazyChildren(children.length, children, 0, f, cont);
    }
    default: {
      return applyCont(cont);
    }
  }
};
const visitLazyChildren = (len, children, i, f, cont) => {
  while (i < len) {
    const child = children[i++];
    if (child && !isEmptyNode(child)) {
      return visitLazy(child, f, [len, children, i, f, cont]);
    }
  }
  return applyCont(cont);
};
const _empty$5 = makeImpl$1(false, 0, new EmptyNode(), 0);
const empty$h = () => _empty$5;
const fromIterable$4 = (entries) => {
  const map = beginMutation$1(empty$h());
  for (const entry of entries) {
    set$3(map, entry[0], entry[1]);
  }
  return endMutation$1(map);
};
const isHashMap = (u) => hasProperty(u, HashMapTypeId);
const isEmpty$2 = (self) => self && isEmptyNode(self._root);
const get$6 = dual(2, (self, key) => getHash(self, key, hash(key)));
const getHash = dual(3, (self, key, hash) => {
  let node = self._root;
  let shift = 0;
  while (true) {
    switch (node._tag) {
      case "LeafNode": {
        return equals$1(key, node.key) ? node.value : none$4();
      }
      case "CollisionNode": {
        if (hash === node.hash) {
          const children = node.children;
          for (let i = 0, len = children.length; i < len; ++i) {
            const child = children[i];
            if ("key" in child && equals$1(key, child.key)) {
              return child.value;
            }
          }
        }
        return none$4();
      }
      case "IndexedNode": {
        const frag = hashFragment(shift, hash);
        const bit = toBitmap(frag);
        if (node.mask & bit) {
          node = node.children[fromBitmap(node.mask, bit)];
          shift += SIZE;
          break;
        }
        return none$4();
      }
      case "ArrayNode": {
        node = node.children[hashFragment(shift, hash)];
        if (node) {
          shift += SIZE;
          break;
        }
        return none$4();
      }
      default:
        return none$4();
    }
  }
});
const has$3 = dual(2, (self, key) => isSome(getHash(self, key, hash(key))));
const set$3 = dual(3, (self, key, value) =>
  modifyAt$1(self, key, () => some(value))
);
const setTree = dual(3, (self, newRoot, newSize) => {
  if (self._editable) {
    self._root = newRoot;
    self._size = newSize;
    return self;
  }
  return newRoot === self._root
    ? self
    : makeImpl$1(self._editable, self._edit, newRoot, newSize);
});
const keys$1 = (self) => new HashMapIterator(self, (key) => key);
const size$3 = (self) => self._size;
const beginMutation$1 = (self) =>
  makeImpl$1(true, self._edit + 1, self._root, self._size);
const endMutation$1 = (self) => {
  self._editable = false;
  return self;
};
const modifyAt$1 = dual(3, (self, key, f) =>
  modifyHash(self, key, hash(key), f)
);
const modifyHash = dual(4, (self, key, hash, f) => {
  const size = { value: self._size };
  const newRoot = self._root.modify(
    self._editable ? self._edit : NaN,
    0,
    f,
    hash,
    key,
    size
  );
  return pipe(self, setTree(newRoot, size.value));
});
const remove$2 = dual(2, (self, key) => modifyAt$1(self, key, none$4));
const map$4 = dual(2, (self, f) =>
  reduce$5(self, empty$h(), (map, value, key) => set$3(map, key, f(value, key)))
);
const forEach$3 = dual(2, (self, f) =>
  reduce$5(self, void 0, (_, value, key) => f(value, key))
);
const reduce$5 = dual(3, (self, zero, f) => {
  const root = self._root;
  if (root._tag === "LeafNode") {
    return isSome(root.value) ? f(zero, root.value.value, root.key) : zero;
  }
  if (root._tag === "EmptyNode") {
    return zero;
  }
  const toVisit = [root.children];
  let children;
  while ((children = toVisit.pop())) {
    for (let i = 0, len = children.length; i < len; ) {
      const child = children[i++];
      if (child && !isEmptyNode(child)) {
        if (child._tag === "LeafNode") {
          if (isSome(child.value)) {
            zero = f(zero, child.value.value, child.key);
          }
        } else {
          toVisit.push(child.children);
        }
      }
    }
  }
  return zero;
});
const HashSetSymbolKey = "effect/HashSet";
const HashSetTypeId = Symbol.for(HashSetSymbolKey);
const HashSetProto = {
  [HashSetTypeId]: HashSetTypeId,
  [Symbol.iterator]() {
    return keys$1(this._keyMap);
  },
  [symbol$1]() {
    return cached(this, combine$5(hash(this._keyMap))(hash(HashSetSymbolKey)));
  },
  [symbol](that) {
    if (isHashSet(that)) {
      return (
        size$3(this._keyMap) === size$3(that._keyMap) &&
        equals$1(this._keyMap, that._keyMap)
      );
    }
    return false;
  },
  toString() {
    return format$1(this.toJSON());
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
};
const makeImpl = (keyMap) => {
  const set = Object.create(HashSetProto);
  set._keyMap = keyMap;
  return set;
};
const isHashSet = (u) => hasProperty(u, HashSetTypeId);
const _empty$4 = makeImpl(empty$h());
const empty$g = () => _empty$4;
const fromIterable$3 = (elements) => {
  const set = beginMutation(empty$g());
  for (const value of elements) {
    add$3(set, value);
  }
  return endMutation(set);
};
const make$k = (...elements) => {
  const set = beginMutation(empty$g());
  for (const value of elements) {
    add$3(set, value);
  }
  return endMutation(set);
};
const has$2 = dual(2, (self, value) => has$3(self._keyMap, value));
const size$2 = (self) => size$3(self._keyMap);
const beginMutation = (self) => makeImpl(beginMutation$1(self._keyMap));
const endMutation = (self) => {
  self._keyMap._editable = false;
  return self;
};
const mutate = dual(2, (self, f) => {
  const transient = beginMutation(self);
  f(transient);
  return endMutation(transient);
});
const add$3 = dual(2, (self, value) =>
  self._keyMap._editable
    ? (set$3(value, true)(self._keyMap), self)
    : makeImpl(set$3(value, true)(self._keyMap))
);
const remove$1 = dual(2, (self, value) =>
  self._keyMap._editable
    ? (remove$2(value)(self._keyMap), self)
    : makeImpl(remove$2(value)(self._keyMap))
);
const difference$1 = dual(2, (self, that) =>
  mutate(self, (set) => {
    for (const value of that) {
      remove$1(set, value);
    }
  })
);
const union$1 = dual(2, (self, that) =>
  mutate(empty$g(), (set) => {
    forEach$2(self, (value) => add$3(set, value));
    for (const value of that) {
      add$3(set, value);
    }
  })
);
const forEach$2 = dual(2, (self, f) => forEach$3(self._keyMap, (_, k) => f(k)));
const reduce$4 = dual(3, (self, zero, f) =>
  reduce$5(self._keyMap, zero, (z, _, a) => f(z, a))
);
const empty$f = empty$g;
const fromIterable$2 = fromIterable$3;
const make$j = make$k;
const has$1 = has$2;
const size$1 = size$2;
const add$2 = add$3;
const remove = remove$1;
const difference = difference$1;
const union = union$1;
const reduce$3 = reduce$4;
const OP_DIE = "Die";
const OP_EMPTY$2 = "Empty";
const OP_FAIL$1 = "Fail";
const OP_INTERRUPT = "Interrupt";
const OP_PARALLEL$1 = "Parallel";
const OP_SEQUENTIAL$1 = "Sequential";
const CauseSymbolKey = "effect/Cause";
const CauseTypeId = Symbol.for(CauseSymbolKey);
const variance$7 = { _E: (_) => _ };
const proto$1 = {
  [CauseTypeId]: variance$7,
  [symbol$1]() {
    return pipe(
      hash(CauseSymbolKey),
      combine$5(hash(flattenCause(this))),
      cached(this)
    );
  },
  [symbol](that) {
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
        return { _id: "Cause", _tag: this._tag, defect: toJSON(this.defect) };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON(),
        };
      case "Fail":
        return { _id: "Cause", _tag: this._tag, failure: toJSON(this.error) };
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
};
const empty$e = (() => {
  const o = Object.create(proto$1);
  o._tag = OP_EMPTY$2;
  return o;
})();
const fail$1 = (error) => {
  const o = Object.create(proto$1);
  o._tag = OP_FAIL$1;
  o.error = error;
  return o;
};
const die = (defect) => {
  const o = Object.create(proto$1);
  o._tag = OP_DIE;
  o.defect = defect;
  return o;
};
const interrupt = (fiberId) => {
  const o = Object.create(proto$1);
  o._tag = OP_INTERRUPT;
  o.fiberId = fiberId;
  return o;
};
const parallel$2 = (left, right) => {
  const o = Object.create(proto$1);
  o._tag = OP_PARALLEL$1;
  o.left = left;
  o.right = right;
  return o;
};
const sequential$2 = (left, right) => {
  const o = Object.create(proto$1);
  o._tag = OP_SEQUENTIAL$1;
  o.left = left;
  o.right = right;
  return o;
};
const isCause = (u) => hasProperty(u, CauseTypeId);
const isEmpty$1 = (self) => {
  if (self._tag === OP_EMPTY$2) {
    return true;
  }
  return reduce$2(self, true, (acc, cause) => {
    switch (cause._tag) {
      case OP_EMPTY$2: {
        return some(acc);
      }
      case OP_DIE:
      case OP_FAIL$1:
      case OP_INTERRUPT: {
        return some(false);
      }
      default: {
        return none$4();
      }
    }
  });
};
const isInterrupted = (self) => isSome(interruptOption(self));
const isInterruptedOnly = (self) =>
  reduceWithContext(undefined, IsInterruptedOnlyCauseReducer)(self);
const failures = (self) =>
  reverse$1(
    reduce$2(self, empty$i(), (list, cause) =>
      cause._tag === OP_FAIL$1
        ? some(pipe(list, prepend$1(cause.error)))
        : none$4()
    )
  );
const defects = (self) =>
  reverse$1(
    reduce$2(self, empty$i(), (list, cause) =>
      cause._tag === OP_DIE
        ? some(pipe(list, prepend$1(cause.defect)))
        : none$4()
    )
  );
const interruptors = (self) =>
  reduce$2(self, empty$f(), (set, cause) =>
    cause._tag === OP_INTERRUPT
      ? some(pipe(set, add$2(cause.fiberId)))
      : none$4()
  );
const failureOption = (self) =>
  find(self, (cause) =>
    cause._tag === OP_FAIL$1 ? some(cause.error) : none$4()
  );
const failureOrCause = (self) => {
  const option = failureOption(self);
  switch (option._tag) {
    case "None": {
      return right(self);
    }
    case "Some": {
      return left(option.value);
    }
  }
};
const interruptOption = (self) =>
  find(self, (cause) =>
    cause._tag === OP_INTERRUPT ? some(cause.fiberId) : none$4()
  );
const keepDefectsAndElectFailures = (self) =>
  match$1(self, {
    onEmpty: none$4(),
    onFail: (failure) => some(die(failure)),
    onDie: (defect) => some(die(defect)),
    onInterrupt: () => none$4(),
    onSequential: (left, right) => {
      if (isSome(left) && isSome(right)) {
        return some(sequential$2(left.value, right.value));
      }
      if (isSome(left) && isNone(right)) {
        return some(left.value);
      }
      if (isNone(left) && isSome(right)) {
        return some(right.value);
      }
      return none$4();
    },
    onParallel: (left, right) => {
      if (isSome(left) && isSome(right)) {
        return some(parallel$2(left.value, right.value));
      }
      if (isSome(left) && isNone(right)) {
        return some(left.value);
      }
      if (isNone(left) && isSome(right)) {
        return some(right.value);
      }
      return none$4();
    },
  });
const stripFailures = (self) =>
  match$1(self, {
    onEmpty: empty$e,
    onFail: () => empty$e,
    onDie: (defect) => die(defect),
    onInterrupt: (fiberId) => interrupt(fiberId),
    onSequential: sequential$2,
    onParallel: parallel$2,
  });
const electFailures = (self) =>
  match$1(self, {
    onEmpty: empty$e,
    onFail: (failure) => die(failure),
    onDie: (defect) => die(defect),
    onInterrupt: (fiberId) => interrupt(fiberId),
    onSequential: (left, right) => sequential$2(left, right),
    onParallel: (left, right) => parallel$2(left, right),
  });
const causeEquals = (left, right) => {
  let leftStack = of$1(left);
  let rightStack = of$1(right);
  while (isNonEmpty(leftStack) && isNonEmpty(rightStack)) {
    const [leftParallel, leftSequential] = pipe(
      headNonEmpty(leftStack),
      reduce$2([empty$f(), empty$i()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return some([
          pipe(parallel, union(par)),
          pipe(sequential, appendAll$1(seq)),
        ]);
      })
    );
    const [rightParallel, rightSequential] = pipe(
      headNonEmpty(rightStack),
      reduce$2([empty$f(), empty$i()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return some([
          pipe(parallel, union(par)),
          pipe(sequential, appendAll$1(seq)),
        ]);
      })
    );
    if (!equals$1(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
const flattenCause = (cause) => flattenCauseLoop(of$1(cause), empty$i());
const flattenCauseLoop = (causes, flattened) => {
  while (1) {
    const [parallel, sequential] = pipe(
      causes,
      reduce$6([empty$f(), empty$i()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return [pipe(parallel, union(par)), pipe(sequential, appendAll$1(seq))];
      })
    );
    const updated =
      size$1(parallel) > 0 ? pipe(flattened, prepend$1(parallel)) : flattened;
    if (isEmpty$3(sequential)) {
      return reverse$1(updated);
    }
    causes = sequential;
    flattened = updated;
  }
  throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"));
};
const find = dual(2, (self, pf) => {
  const stack = [self];
  while (stack.length > 0) {
    const item = stack.pop();
    const option = pf(item);
    switch (option._tag) {
      case "None": {
        switch (item._tag) {
          case OP_SEQUENTIAL$1:
          case OP_PARALLEL$1: {
            stack.push(item.right);
            stack.push(item.left);
            break;
          }
        }
        break;
      }
      case "Some": {
        return option;
      }
    }
  }
  return none$4();
});
const evaluateCause = (self) => {
  let cause = self;
  const stack = [];
  let _parallel = empty$f();
  let _sequential = empty$i();
  while (cause !== undefined) {
    switch (cause._tag) {
      case OP_EMPTY$2: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL$1: {
        _parallel = add$2(_parallel, make$m(cause._tag, cause.error));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_DIE: {
        _parallel = add$2(_parallel, make$m(cause._tag, cause.defect));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        _parallel = add$2(_parallel, make$m(cause._tag, cause.fiberId));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL$1: {
        switch (cause.left._tag) {
          case OP_EMPTY$2: {
            cause = cause.right;
            break;
          }
          case OP_SEQUENTIAL$1: {
            cause = sequential$2(
              cause.left.left,
              sequential$2(cause.left.right, cause.right)
            );
            break;
          }
          case OP_PARALLEL$1: {
            cause = parallel$2(
              sequential$2(cause.left.left, cause.right),
              sequential$2(cause.left.right, cause.right)
            );
            break;
          }
          default: {
            _sequential = prepend$1(_sequential, cause.right);
            cause = cause.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL$1: {
        stack.push(cause.right);
        cause = cause.left;
        break;
      }
    }
  }
  throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"));
};
const IsInterruptedOnlyCauseReducer = {
  emptyCase: constTrue,
  failCase: constFalse,
  dieCase: constFalse,
  interruptCase: constTrue,
  sequentialCase: (_, left, right) => left && right,
  parallelCase: (_, left, right) => left && right,
};
const OP_SEQUENTIAL_CASE = "SequentialCase";
const OP_PARALLEL_CASE = "ParallelCase";
const match$1 = dual(
  2,
  (
    self,
    {
      onDie: onDie,
      onEmpty: onEmpty,
      onFail: onFail,
      onInterrupt: onInterrupt,
      onParallel: onParallel,
      onSequential: onSequential,
    }
  ) =>
    reduceWithContext(self, void 0, {
      emptyCase: () => onEmpty,
      failCase: (_, error) => onFail(error),
      dieCase: (_, defect) => onDie(defect),
      interruptCase: (_, fiberId) => onInterrupt(fiberId),
      sequentialCase: (_, left, right) => onSequential(left, right),
      parallelCase: (_, left, right) => onParallel(left, right),
    })
);
const reduce$2 = dual(3, (self, zero, pf) => {
  let accumulator = zero;
  let cause = self;
  const causes = [];
  while (cause !== undefined) {
    const option = pf(accumulator, cause);
    accumulator = isSome(option) ? option.value : accumulator;
    switch (cause._tag) {
      case OP_SEQUENTIAL$1: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      case OP_PARALLEL$1: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      default: {
        cause = undefined;
        break;
      }
    }
    if (cause === undefined && causes.length > 0) {
      cause = causes.pop();
    }
  }
  return accumulator;
});
const reduceWithContext = dual(3, (self, context, reducer) => {
  const input = [self];
  const output = [];
  while (input.length > 0) {
    const cause = input.pop();
    switch (cause._tag) {
      case OP_EMPTY$2: {
        output.push(right(reducer.emptyCase(context)));
        break;
      }
      case OP_FAIL$1: {
        output.push(right(reducer.failCase(context, cause.error)));
        break;
      }
      case OP_DIE: {
        output.push(right(reducer.dieCase(context, cause.defect)));
        break;
      }
      case OP_INTERRUPT: {
        output.push(right(reducer.interruptCase(context, cause.fiberId)));
        break;
      }
      case OP_SEQUENTIAL$1: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left({ _tag: OP_SEQUENTIAL_CASE }));
        break;
      }
      case OP_PARALLEL$1: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left({ _tag: OP_PARALLEL_CASE }));
        break;
      }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either = output.pop();
    switch (either._tag) {
      case "Left": {
        switch (either.left._tag) {
          case OP_SEQUENTIAL_CASE: {
            const left = accumulator.pop();
            const right = accumulator.pop();
            const value = reducer.sequentialCase(context, left, right);
            accumulator.push(value);
            break;
          }
          case OP_PARALLEL_CASE: {
            const left = accumulator.pop();
            const right = accumulator.pop();
            const value = reducer.parallelCase(context, left, right);
            accumulator.push(value);
            break;
          }
        }
        break;
      }
      case "Right": {
        accumulator.push(either.right);
        break;
      }
    }
  }
  if (accumulator.length === 0) {
    throw new Error(
      "BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues"
    );
  }
  return accumulator.pop();
});
const filterStack = (stack) => {
  const lines = stack.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1"));
    if (lines[i].includes("effect_instruction_i")) {
      return out.join("\n");
    }
  }
  return out.join("\n");
};
const pretty = (cause) => {
  if (isInterruptedOnly(cause)) {
    return "All fibers interrupted without errors.";
  }
  const final = prettyErrors(cause)
    .map((e) => {
      let message = e.message;
      if (e.stack) {
        message += `\r\n${filterStack(e.stack)}`;
      }
      if (e.span) {
        let current = e.span;
        let i = 0;
        while (current && current._tag === "Span" && i < 10) {
          message += `\r\n    at ${current.name}`;
          current = getOrUndefined(current.parent);
          i++;
        }
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
    this.message = message;
    this.stack = stack;
    this.span = span;
  }
  toJSON() {
    const out = { message: this.message };
    if (this.stack) {
      out.stack = this.stack;
    }
    if (this.span) {
      out.span = this.span;
    }
    return out;
  }
}
const prettyErrorMessage = (u) => {
  if (typeof u === "string") {
    return `Error: ${u}`;
  }
  try {
    if (
      hasProperty(u, "toString") &&
      isFunction(u["toString"]) &&
      u["toString"] !== Object.prototype.toString &&
      u["toString"] !== globalThis.Array.prototype.toString
    ) {
      return u["toString"]();
    }
  } catch {}
  return `Error: ${JSON.stringify(u)}`;
};
const spanSymbol$1 = Symbol.for("effect/SpanAnnotation");
const defaultRenderError = (error) => {
  const span = hasProperty(error, spanSymbol$1) && error[spanSymbol$1];
  if (error instanceof Error) {
    return new PrettyError(
      prettyErrorMessage(error),
      error.stack
        ?.split("\n")
        .filter((_) => _.match(/at (.*)/))
        .join("\n"),
      span
    );
  }
  return new PrettyError(prettyErrorMessage(error), void 0, span);
};
const prettyErrors = (cause) =>
  reduceWithContext(cause, void 0, {
    emptyCase: () => [],
    dieCase: (_, unknownError) => [defaultRenderError(unknownError)],
    failCase: (_, error) => [defaultRenderError(error)],
    interruptCase: () => [],
    parallelCase: (_, l, r) => [...l, ...r],
    sequentialCase: (_, l, r) => [...l, ...r],
  });
const TagTypeId = Symbol.for("effect/Context/Tag");
const STMSymbolKey = "effect/STM";
const STMTypeId = Symbol.for(STMSymbolKey);
const TagProto = {
  ...EffectPrototype,
  _tag: "Tag",
  _op: "Tag",
  [STMTypeId]: effectVariance,
  [TagTypeId]: { _Service: (_) => _, _Identifier: (_) => _ },
  toString() {
    return format$1(this.toJSON());
  },
  toJSON() {
    return { _id: "Tag", key: this.key, stack: this.stack };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self) {
    return self;
  },
  context(self) {
    return make$i(this, self);
  },
};
const makeGenericTag = (key) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  const tag = Object.create(TagProto);
  Object.defineProperty(tag, "stack", {
    get() {
      return creationError.stack;
    },
  });
  tag.key = key;
  return tag;
};
const TypeId$6 = Symbol.for("effect/Context");
const ContextProto = {
  [TypeId$6]: { _Services: (_) => _ },
  [symbol](that) {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (
            !that.unsafeMap.has(k) ||
            !equals$1(this.unsafeMap.get(k), that.unsafeMap.get(k))
          ) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  [symbol$1]() {
    return cached(this, number$1(this.unsafeMap.size));
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return format$1(this.toJSON());
  },
  toJSON() {
    return { _id: "Context", services: Array.from(this.unsafeMap).map(toJSON) };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
};
const makeContext = (unsafeMap) => {
  const context = Object.create(ContextProto);
  context.unsafeMap = unsafeMap;
  return context;
};
const serviceNotFoundError = (tag) => {
  const error = new Error(
    `Service not found${tag.key ? `: ${String(tag.key)}` : ""}`
  );
  if (tag.stack) {
    const lines = tag.stack.split("\n");
    if (lines.length > 2) {
      const afterAt = lines[2].match(/at (.*)/);
      if (afterAt) {
        error.message = error.message + ` (defined at ${afterAt[1]})`;
      }
    }
  }
  if (error.stack) {
    const lines = error.stack.split("\n");
    lines.splice(1, 3);
    error.stack = lines.join("\n");
  }
  return error;
};
const isContext = (u) => hasProperty(u, TypeId$6);
const _empty$3 = makeContext(new Map());
const empty$d = () => _empty$3;
const make$i = (tag, service) => makeContext(new Map([[tag.key, service]]));
const add$1 = dual(3, (self, tag, service) => {
  const map = new Map(self.unsafeMap);
  map.set(tag.key, service);
  return makeContext(map);
});
const unsafeGet$1 = dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag.key)) {
    throw serviceNotFoundError(tag);
  }
  return self.unsafeMap.get(tag.key);
});
const get$5 = unsafeGet$1;
const getOption$1 = dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag.key)) {
    return none$5;
  }
  return some$1(self.unsafeMap.get(tag.key));
});
const merge$2 = dual(2, (self, that) => {
  const map = new Map(self.unsafeMap);
  for (const [tag, s] of that.unsafeMap) {
    map.set(tag, s);
  }
  return makeContext(map);
});
const GenericTag = makeGenericTag;
const empty$c = empty$d;
const make$h = make$i;
const add = add$1;
const get$4 = get$5;
const unsafeGet = unsafeGet$1;
const getOption = getOption$1;
const merge$1 = merge$2;
const TypeId$5 = Symbol.for("effect/MutableRef");
const MutableRefProto = {
  [TypeId$5]: TypeId$5,
  toString() {
    return format$1(this.toJSON());
  },
  toJSON() {
    return { _id: "MutableRef", current: toJSON(this.current) };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const make$g = (value) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value;
  return ref;
};
const get$3 = (self) => self.current;
const set$2 = dual(2, (self, value) => {
  self.current = value;
  return self;
});
const FiberIdSymbolKey = "effect/FiberId";
const FiberIdTypeId = Symbol.for(FiberIdSymbolKey);
const OP_NONE = "None";
const OP_RUNTIME = "Runtime";
const OP_COMPOSITE = "Composite";
const emptyHash = string(`${FiberIdSymbolKey}-${OP_NONE}`);
let None$2 = class None {
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_NONE;
  id = -1;
  startTimeMillis = -1;
  [symbol$1]() {
    return emptyHash;
  }
  [symbol](that) {
    return isFiberId(that) && that._tag === OP_NONE;
  }
  toString() {
    return format$1(this.toJSON());
  }
  toJSON() {
    return { _id: "FiberId", _tag: this._tag };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
class Runtime {
  id;
  startTimeMillis;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_RUNTIME;
  constructor(id, startTimeMillis) {
    this.id = id;
    this.startTimeMillis = startTimeMillis;
  }
  [symbol$1]() {
    return cached(
      this,
      string(
        `${FiberIdSymbolKey}-${this._tag}-${this.id}-${this.startTimeMillis}`
      )
    );
  }
  [symbol](that) {
    return (
      isFiberId(that) &&
      that._tag === OP_RUNTIME &&
      this.id === that.id &&
      this.startTimeMillis === that.startTimeMillis
    );
  }
  toString() {
    return format$1(this.toJSON());
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
const none$3 = new None$2();
const isFiberId = (self) => hasProperty(self, FiberIdTypeId);
const ids = (self) => {
  switch (self._tag) {
    case OP_NONE: {
      return empty$f();
    }
    case OP_RUNTIME: {
      return make$j(self.id);
    }
    case OP_COMPOSITE: {
      return pipe(ids(self.left), union(ids(self.right)));
    }
  }
};
const _fiberCounter = globalValue(
  Symbol.for("effect/Fiber/Id/_fiberCounter"),
  () => make$g(0)
);
const threadName$1 = (self) => {
  const identifiers = Array.from(ids(self))
    .map((n) => `#${n}`)
    .join(",");
  return identifiers;
};
const unsafeMake$4 = () => {
  const id = get$3(_fiberCounter);
  pipe(_fiberCounter, set$2(id + 1));
  return new Runtime(id, Date.now());
};
const none$2 = none$3;
const threadName = threadName$1;
const unsafeMake$3 = unsafeMake$4;
const empty$b = empty$h;
const fromIterable$1 = fromIterable$4;
const isEmpty = isEmpty$2;
const get$2 = get$6;
const set$1 = set$3;
const keys = keys$1;
const size = size$3;
const modifyAt = modifyAt$1;
const map$3 = map$4;
const reduce$1 = reduce$5;
const TypeId$4 = Symbol.for("effect/List");
const toArray = (self) => fromIterable$6(self);
const getEquivalence = (isEquivalent) =>
  mapInput$1(getEquivalence$2(isEquivalent), toArray);
const _equivalence = getEquivalence(equals$1);
const ConsProto = {
  [TypeId$4]: TypeId$4,
  _tag: "Cons",
  toString() {
    return format$1(this.toJSON());
  },
  toJSON() {
    return { _id: "List", _tag: "Cons", values: toArray(this).map(toJSON) };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol](that) {
    return isList(that) && this._tag === that._tag && _equivalence(this, that);
  },
  [symbol$1]() {
    return cached(this, array(toArray(this)));
  },
  [Symbol.iterator]() {
    let done = false;
    let self = this;
    return {
      next() {
        if (done) {
          return this.return();
        }
        if (self._tag === "Nil") {
          done = true;
          return this.return();
        }
        const value = self.head;
        self = self.tail;
        return { done: done, value: value };
      },
      return(value) {
        if (!done) {
          done = true;
        }
        return { done: true, value: value };
      },
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const makeCons = (head, tail) => {
  const cons = Object.create(ConsProto);
  cons.head = head;
  cons.tail = tail;
  return cons;
};
const NilHash = string("Nil");
const NilProto = {
  [TypeId$4]: TypeId$4,
  _tag: "Nil",
  toString() {
    return format$1(this.toJSON());
  },
  toJSON() {
    return { _id: "List", _tag: "Nil" };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol$1]() {
    return NilHash;
  },
  [symbol](that) {
    return isList(that) && this._tag === that._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return { done: true, value: undefined };
      },
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const _Nil = Object.create(NilProto);
const isList = (u) => hasProperty(u, TypeId$4);
const isNil = (self) => self._tag === "Nil";
const isCons = (self) => self._tag === "Cons";
const nil = () => _Nil;
const cons = (head, tail) => makeCons(head, tail);
const empty$a = nil;
const of = (value) => makeCons(value, _Nil);
const appendAll = dual(2, (self, that) => prependAll(that, self));
const prepend = dual(2, (self, element) => cons(element, self));
const prependAll = dual(2, (self, prefix) => {
  if (isNil(self)) {
    return prefix;
  } else if (isNil(prefix)) {
    return self;
  } else {
    const result = makeCons(prefix.head, self);
    let curr = result;
    let that = prefix.tail;
    while (!isNil(that)) {
      const temp = makeCons(that.head, self);
      curr.tail = temp;
      curr = temp;
      that = that.tail;
    }
    return result;
  }
});
const reduce = dual(3, (self, zero, f) => {
  let acc = zero;
  let these = self;
  while (!isNil(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
const reverse = (self) => {
  let result = empty$a();
  let these = self;
  while (!isNil(these)) {
    result = prepend(result, these.head);
    these = these.tail;
  }
  return result;
};
const Structural = (function () {
  function Structural(args) {
    if (args) {
      Object.assign(this, args);
    }
  }
  Structural.prototype = StructuralPrototype;
  return Structural;
})();
const ChunkPatchTypeId = Symbol.for("effect/DifferChunkPatch");
function variance$6(a) {
  return a;
}
({
  ...Structural.prototype,
  [ChunkPatchTypeId]: { _Value: variance$6, _Patch: variance$6 },
});
const ContextPatchTypeId = Symbol.for("effect/DifferContextPatch");
function variance$5(a) {
  return a;
}
const PatchProto$2 = {
  ...Structural.prototype,
  [ContextPatchTypeId]: { _Value: variance$5, _Patch: variance$5 },
};
const EmptyProto$2 = Object.assign(Object.create(PatchProto$2), {
  _tag: "Empty",
});
const _empty$2 = Object.create(EmptyProto$2);
const empty$9 = () => _empty$2;
const AndThenProto$2 = Object.assign(Object.create(PatchProto$2), {
  _tag: "AndThen",
});
const makeAndThen$2 = (first, second) => {
  const o = Object.create(AndThenProto$2);
  o.first = first;
  o.second = second;
  return o;
};
const AddServiceProto = Object.assign(Object.create(PatchProto$2), {
  _tag: "AddService",
});
const makeAddService = (key, service) => {
  const o = Object.create(AddServiceProto);
  o.key = key;
  o.service = service;
  return o;
};
const RemoveServiceProto = Object.assign(Object.create(PatchProto$2), {
  _tag: "RemoveService",
});
const makeRemoveService = (key) => {
  const o = Object.create(RemoveServiceProto);
  o.key = key;
  return o;
};
const UpdateServiceProto = Object.assign(Object.create(PatchProto$2), {
  _tag: "UpdateService",
});
const makeUpdateService = (key, update) => {
  const o = Object.create(UpdateServiceProto);
  o.key = key;
  o.update = update;
  return o;
};
const diff$6 = (oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch = empty$9();
  for (const [tag, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag)) {
      const old = missingServices.get(tag);
      missingServices.delete(tag);
      if (!equals$1(old, newService)) {
        patch = combine$4(makeUpdateService(tag, () => newService))(patch);
      }
    } else {
      missingServices.delete(tag);
      patch = combine$4(makeAddService(tag, newService))(patch);
    }
  }
  for (const [tag] of missingServices.entries()) {
    patch = combine$4(makeRemoveService(tag))(patch);
  }
  return patch;
};
const combine$4 = dual(2, (self, that) => makeAndThen$2(self, that));
const patch$7 = dual(2, (self, context) => {
  if (self._tag === "Empty") {
    return context;
  }
  let wasServiceUpdated = false;
  let patches = of$1(self);
  const updatedContext = new Map(context.unsafeMap);
  while (isNonEmpty(patches)) {
    const head = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AddService": {
        updatedContext.set(head.key, head.service);
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend$1(prepend$1(tail, head.second), head.first);
        break;
      }
      case "RemoveService": {
        updatedContext.delete(head.key);
        patches = tail;
        break;
      }
      case "UpdateService": {
        updatedContext.set(head.key, head.update(updatedContext.get(head.key)));
        wasServiceUpdated = true;
        patches = tail;
        break;
      }
    }
  }
  if (!wasServiceUpdated) {
    return makeContext(updatedContext);
  }
  const map = new Map();
  for (const [tag] of context.unsafeMap) {
    if (updatedContext.has(tag)) {
      map.set(tag, updatedContext.get(tag));
      updatedContext.delete(tag);
    }
  }
  for (const [tag, s] of updatedContext) {
    map.set(tag, s);
  }
  return makeContext(map);
});
const HashMapPatchTypeId = Symbol.for("effect/DifferHashMapPatch");
function variance$4(a) {
  return a;
}
({
  ...Structural.prototype,
  [HashMapPatchTypeId]: {
    _Value: variance$4,
    _Key: variance$4,
    _Patch: variance$4,
  },
});
const HashSetPatchTypeId = Symbol.for("effect/DifferHashSetPatch");
function variance$3(a) {
  return a;
}
const PatchProto$1 = {
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance$3,
    _Key: variance$3,
    _Patch: variance$3,
  },
};
const EmptyProto$1 = Object.assign(Object.create(PatchProto$1), {
  _tag: "Empty",
});
const _empty$1 = Object.create(EmptyProto$1);
const empty$8 = () => _empty$1;
const AndThenProto$1 = Object.assign(Object.create(PatchProto$1), {
  _tag: "AndThen",
});
const makeAndThen$1 = (first, second) => {
  const o = Object.create(AndThenProto$1);
  o.first = first;
  o.second = second;
  return o;
};
const AddProto = Object.assign(Object.create(PatchProto$1), { _tag: "Add" });
const makeAdd = (value) => {
  const o = Object.create(AddProto);
  o.value = value;
  return o;
};
const RemoveProto = Object.assign(Object.create(PatchProto$1), {
  _tag: "Remove",
});
const makeRemove = (value) => {
  const o = Object.create(RemoveProto);
  o.value = value;
  return o;
};
const diff$5 = (oldValue, newValue) => {
  const [removed, patch] = reduce$3(
    [oldValue, empty$8()],
    ([set, patch], value) => {
      if (has$1(value)(set)) {
        return [remove(value)(set), patch];
      }
      return [set, combine$3(makeAdd(value))(patch)];
    }
  )(newValue);
  return reduce$3(patch, (patch, value) => combine$3(makeRemove(value))(patch))(
    removed
  );
};
const combine$3 = dual(2, (self, that) => makeAndThen$1(self, that));
const patch$6 = dual(2, (self, oldValue) => {
  if (self._tag === "Empty") {
    return oldValue;
  }
  let set = oldValue;
  let patches = of$1(self);
  while (isNonEmpty(patches)) {
    const head = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend$1(head.first)(prepend$1(head.second)(tail));
        break;
      }
      case "Add": {
        set = add$2(head.value)(set);
        patches = tail;
        break;
      }
      case "Remove": {
        set = remove(head.value)(set);
        patches = tail;
      }
    }
  }
  return set;
});
const OrPatchTypeId = Symbol.for("effect/DifferOrPatch");
function variance$2(a) {
  return a;
}
({
  ...Structural.prototype,
  [OrPatchTypeId]: { _Value: variance$2, _Key: variance$2, _Patch: variance$2 },
});
const ReadonlyArrayPatchTypeId = Symbol.for("effect/DifferReadonlyArrayPatch");
function variance$1(a) {
  return a;
}
const PatchProto = {
  ...Structural.prototype,
  [ReadonlyArrayPatchTypeId]: { _Value: variance$1, _Patch: variance$1 },
};
const EmptyProto = Object.assign(Object.create(PatchProto), { _tag: "Empty" });
const _empty = Object.create(EmptyProto);
const empty$7 = () => _empty;
const AndThenProto = Object.assign(Object.create(PatchProto), {
  _tag: "AndThen",
});
const makeAndThen = (first, second) => {
  const o = Object.create(AndThenProto);
  o.first = first;
  o.second = second;
  return o;
};
const AppendProto = Object.assign(Object.create(PatchProto), {
  _tag: "Append",
});
const makeAppend = (values) => {
  const o = Object.create(AppendProto);
  o.values = values;
  return o;
};
const SliceProto = Object.assign(Object.create(PatchProto), { _tag: "Slice" });
const makeSlice = (from, until) => {
  const o = Object.create(SliceProto);
  o.from = from;
  o.until = until;
  return o;
};
const UpdateProto = Object.assign(Object.create(PatchProto), {
  _tag: "Update",
});
const makeUpdate = (index, patch) => {
  const o = Object.create(UpdateProto);
  o.index = index;
  o.patch = patch;
  return o;
};
const diff$4 = (options) => {
  let i = 0;
  let patch = empty$7();
  while (i < options.oldValue.length && i < options.newValue.length) {
    const oldElement = options.oldValue[i];
    const newElement = options.newValue[i];
    const valuePatch = options.differ.diff(oldElement, newElement);
    if (!equals$1(valuePatch, options.differ.empty)) {
      patch = combine$2(patch, makeUpdate(i, valuePatch));
    }
    i = i + 1;
  }
  if (i < options.oldValue.length) {
    patch = combine$2(patch, makeSlice(0, i));
  }
  if (i < options.newValue.length) {
    patch = combine$2(patch, makeAppend(drop$1(i)(options.newValue)));
  }
  return patch;
};
const combine$2 = dual(2, (self, that) => makeAndThen(self, that));
const patch$5 = dual(3, (self, oldValue, differ) => {
  if (self._tag === "Empty") {
    return oldValue;
  }
  let readonlyArray = oldValue.slice();
  let patches = of$2(self);
  while (isNonEmptyArray(patches)) {
    const head = headNonEmpty$1(patches);
    const tail = tailNonEmpty$1(patches);
    switch (head._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        tail.unshift(head.first, head.second);
        patches = tail;
        break;
      }
      case "Append": {
        for (const value of head.values) {
          readonlyArray.push(value);
        }
        patches = tail;
        break;
      }
      case "Slice": {
        readonlyArray = readonlyArray.slice(head.from, head.until);
        patches = tail;
        break;
      }
      case "Update": {
        readonlyArray[head.index] = differ.patch(
          head.patch,
          readonlyArray[head.index]
        );
        patches = tail;
        break;
      }
    }
  }
  return readonlyArray;
});
const DifferTypeId = Symbol.for("effect/Differ");
const DifferProto = { [DifferTypeId]: { _P: identity, _V: identity } };
const make$f = (params) => {
  const differ = Object.create(DifferProto);
  differ.empty = params.empty;
  differ.diff = params.diff;
  differ.combine = params.combine;
  differ.patch = params.patch;
  return differ;
};
const environment = () =>
  make$f({
    empty: empty$9(),
    combine: (first, second) => combine$4(second)(first),
    diff: (oldValue, newValue) => diff$6(oldValue, newValue),
    patch: (patch, oldValue) => patch$7(oldValue)(patch),
  });
const hashSet = () =>
  make$f({
    empty: empty$8(),
    combine: (first, second) => combine$3(second)(first),
    diff: (oldValue, newValue) => diff$5(oldValue, newValue),
    patch: (patch, oldValue) => patch$6(oldValue)(patch),
  });
const readonlyArray = (differ) =>
  make$f({
    empty: empty$7(),
    combine: (first, second) => combine$2(first, second),
    diff: (oldValue, newValue) =>
      diff$4({ oldValue: oldValue, newValue: newValue, differ: differ }),
    patch: (patch, oldValue) => patch$5(patch, oldValue, differ),
  });
const update$1 = () => updateWith((_, a) => a);
const updateWith = (f) =>
  make$f({
    empty: identity,
    combine: (first, second) => {
      if (first === identity) {
        return second;
      }
      if (second === identity) {
        return first;
      }
      return (a) => second(first(a));
    },
    diff: (oldValue, newValue) => {
      if (equals$1(oldValue, newValue)) {
        return identity;
      }
      return constant(newValue);
    },
    patch: (patch, oldValue) => f(oldValue, patch(oldValue)),
  });
const BIT_MASK = 255;
const BIT_SHIFT = 8;
const active = (patch) => patch & BIT_MASK;
const enabled = (patch) => (patch >> BIT_SHIFT) & BIT_MASK;
const make$e = (active, enabled) =>
  (active & BIT_MASK) + ((enabled & active & BIT_MASK) << BIT_SHIFT);
const empty$6 = make$e(0, 0);
const enable$2 = (flag) => make$e(flag, flag);
const disable$1 = (flag) => make$e(flag, 0);
const exclude$1 = dual(2, (self, flag) =>
  make$e(active(self) & ~flag, enabled(self))
);
const andThen = dual(2, (self, that) => self | that);
const invert = (n) => (~n >>> 0) & BIT_MASK;
const None$1 = 0;
const Interruption = 1 << 0;
const OpSupervision = 1 << 1;
const RuntimeMetrics = 1 << 2;
const WindDown = 1 << 4;
const CooperativeYielding = 1 << 5;
const cooperativeYielding = (self) => isEnabled(self, CooperativeYielding);
const enable$1 = dual(2, (self, flag) => self | flag);
const interruptible$1 = (self) => interruption(self) && !windDown(self);
const interruption = (self) => isEnabled(self, Interruption);
const isEnabled = dual(2, (self, flag) => (self & flag) !== 0);
const make$d = (...flags) => flags.reduce((a, b) => a | b, 0);
const none$1 = make$d(None$1);
const runtimeMetrics = (self) => isEnabled(self, RuntimeMetrics);
const windDown = (self) => isEnabled(self, WindDown);
const diff$3 = dual(2, (self, that) => make$e(self ^ that, that));
const patch$4 = dual(
  2,
  (self, patch) =>
    (self & (invert(active(patch)) | enabled(patch))) |
    (active(patch) & enabled(patch))
);
const differ$1 = make$f({
  empty: empty$6,
  diff: (oldValue, newValue) => diff$3(oldValue, newValue),
  combine: (first, second) => andThen(second)(first),
  patch: (_patch, oldValue) => patch$4(oldValue, _patch),
});
const enable = enable$2;
const disable = disable$1;
const exclude = exclude$1;
const par = (self, that) => ({ _tag: "Par", left: self, right: that });
const seq = (self, that) => ({ _tag: "Seq", left: self, right: that });
const flatten$2 = (self) => {
  let current = of(self);
  let updated = empty$a();
  while (1) {
    const [parallel, sequential] = reduce(
      current,
      [parallelCollectionEmpty(), empty$a()],
      ([parallel, sequential], blockedRequest) => {
        const [par, seq] = step$1(blockedRequest);
        return [
          parallelCollectionCombine(parallel, par),
          appendAll(sequential, seq),
        ];
      }
    );
    updated = merge(updated, parallel);
    if (isNil(sequential)) {
      return reverse(updated);
    }
    current = sequential;
  }
  throw new Error(
    "BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues"
  );
};
const step$1 = (requests) => {
  let current = requests;
  let parallel = parallelCollectionEmpty();
  let stack = empty$a();
  let sequential = empty$a();
  while (1) {
    switch (current._tag) {
      case "Empty": {
        if (isNil(stack)) {
          return [parallel, sequential];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
      case "Par": {
        stack = cons(current.right, stack);
        current = current.left;
        break;
      }
      case "Seq": {
        const left = current.left;
        const right = current.right;
        switch (left._tag) {
          case "Empty": {
            current = right;
            break;
          }
          case "Par": {
            const l = left.left;
            const r = left.right;
            current = par(seq(l, right), seq(r, right));
            break;
          }
          case "Seq": {
            const l = left.left;
            const r = left.right;
            current = seq(l, seq(r, right));
            break;
          }
          case "Single": {
            current = left;
            sequential = cons(right, sequential);
            break;
          }
        }
        break;
      }
      case "Single": {
        parallel = parallelCollectionAdd(parallel, current);
        if (isNil(stack)) {
          return [parallel, sequential];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
    }
  }
  throw new Error(
    "BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues"
  );
};
const merge = (sequential, parallel) => {
  if (isNil(sequential)) {
    return of(parallelCollectionToSequentialCollection(parallel));
  }
  if (parallelCollectionIsEmpty(parallel)) {
    return sequential;
  }
  const seqHeadKeys = sequentialCollectionKeys(sequential.head);
  const parKeys = parallelCollectionKeys(parallel);
  if (
    seqHeadKeys.length === 1 &&
    parKeys.length === 1 &&
    equals$1(seqHeadKeys[0], parKeys[0])
  ) {
    return cons(
      sequentialCollectionCombine(
        sequential.head,
        parallelCollectionToSequentialCollection(parallel)
      ),
      sequential.tail
    );
  }
  return cons(parallelCollectionToSequentialCollection(parallel), sequential);
};
const RequestBlockParallelTypeId = Symbol.for(
  "effect/RequestBlock/RequestBlockParallel"
);
const parallelVariance = { _R: (_) => _ };
class ParallelImpl {
  map;
  [RequestBlockParallelTypeId] = parallelVariance;
  constructor(map) {
    this.map = map;
  }
}
const parallelCollectionEmpty = () => new ParallelImpl(empty$b());
const parallelCollectionAdd = (self, blockedRequest) =>
  new ParallelImpl(
    modifyAt(self.map, blockedRequest.dataSource, (_) =>
      orElseSome(map$6(_, append(blockedRequest.blockedRequest)), () =>
        of$1(blockedRequest.blockedRequest)
      )
    )
  );
const parallelCollectionCombine = (self, that) =>
  new ParallelImpl(
    reduce$1(self.map, that.map, (map, value, key) =>
      set$1(
        map,
        key,
        match$2(get$2(map, key), {
          onNone: () => value,
          onSome: (other) => appendAll$1(value, other),
        })
      )
    )
  );
const parallelCollectionIsEmpty = (self) => isEmpty(self.map);
const parallelCollectionKeys = (self) => Array.from(keys(self.map));
const parallelCollectionToSequentialCollection = (self) =>
  sequentialCollectionMake(map$3(self.map, (x) => of$1(x)));
const SequentialCollectionTypeId = Symbol.for(
  "effect/RequestBlock/RequestBlockSequential"
);
const sequentialVariance = { _R: (_) => _ };
class SequentialImpl {
  map;
  [SequentialCollectionTypeId] = sequentialVariance;
  constructor(map) {
    this.map = map;
  }
}
const sequentialCollectionMake = (map) => new SequentialImpl(map);
const sequentialCollectionCombine = (self, that) =>
  new SequentialImpl(
    reduce$1(that.map, self.map, (map, value, key) =>
      set$1(
        map,
        key,
        match$2(get$2(map, key), {
          onNone: () => empty$i(),
          onSome: (a) => appendAll$1(a, value),
        })
      )
    )
  );
const sequentialCollectionKeys = (self) => Array.from(keys(self.map));
const sequentialCollectionToChunk = (self) => Array.from(self.map);
const OP_STATE_PENDING = "Pending";
const OP_STATE_DONE = "Done";
const DeferredSymbolKey = "effect/Deferred";
const DeferredTypeId = Symbol.for(DeferredSymbolKey);
const deferredVariance = { _E: (_) => _, _A: (_) => _ };
const pending = (joiners) => ({ _tag: OP_STATE_PENDING, joiners: joiners });
const done$2 = (effect) => ({ _tag: OP_STATE_DONE, effect: effect });
class SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  next(a) {
    return this.called
      ? { value: a, done: true }
      : ((this.called = true), { value: this.self, done: false });
  }
  return(a) {
    return { value: a, done: true };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new SingleShotGen(this.self);
  }
}
const TracerTypeId = Symbol.for("effect/Tracer");
const make$c = (options) => ({ [TracerTypeId]: TracerTypeId, ...options });
const tracerTag = GenericTag("effect/Tracer");
const spanTag = GenericTag("effect/ParentSpan");
const randomHexString = (function () {
  const characters = "abcdef0123456789";
  const charactersLength = characters.length;
  return function (length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
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
  sampled = true;
  status;
  attributes;
  events = [];
  constructor(name, parent, context, links, startTime, kind) {
    this.name = name;
    this.parent = parent;
    this.context = context;
    this.links = links;
    this.startTime = startTime;
    this.kind = kind;
    this.status = { _tag: "Started", startTime: startTime };
    this.attributes = new Map();
    this.traceId =
      parent._tag === "Some" ? parent.value.traceId : randomHexString(32);
    this.spanId = randomHexString(16);
  }
  end(endTime, exit) {
    this.status = {
      _tag: "Ended",
      endTime: endTime,
      exit: exit,
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
const nativeTracer = make$c({
  span: (name, parent, context, links, startTime, kind) =>
    new NativeSpan(name, parent, context, links, startTime, kind),
  context: (f) => f(),
});
const EffectErrorSymbolKey = "effect/EffectError";
const EffectErrorTypeId = Symbol.for(EffectErrorSymbolKey);
const isEffectError = (u) => hasProperty(u, EffectErrorTypeId);
const blocked = (blockedRequests, _continue) => {
  const effect = new EffectPrimitive("Blocked");
  effect.effect_instruction_i0 = blockedRequests;
  effect.effect_instruction_i1 = _continue;
  return effect;
};
const runRequestBlock = (blockedRequests) => {
  const effect = new EffectPrimitive("RunBlocked");
  effect.effect_instruction_i0 = blockedRequests;
  return effect;
};
const EffectTypeId$1 = Symbol.for("effect/Effect");
class RevertFlags {
  patch;
  op;
  _op = OP_REVERT_FLAGS;
  constructor(patch, op) {
    this.patch = patch;
    this.op = op;
  }
}
class EffectPrimitive {
  _op;
  effect_instruction_i0 = undefined;
  effect_instruction_i1 = undefined;
  effect_instruction_i2 = undefined;
  trace = undefined;
  [EffectTypeId$1] = effectVariance;
  constructor(_op) {
    this._op = _op;
  }
  [symbol](that) {
    return this === that;
  }
  [symbol$1]() {
    return cached(this, random(this));
  }
  pipe() {
    return pipeArguments(this, arguments);
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
    return format$1(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  }
}
class EffectPrimitiveFailure {
  _op;
  effect_instruction_i0 = undefined;
  effect_instruction_i1 = undefined;
  effect_instruction_i2 = undefined;
  trace = undefined;
  [EffectTypeId$1] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol](that) {
    return this === that;
  }
  [symbol$1]() {
    return cached(this, random(this));
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return { _id: "Exit", _tag: this._op, cause: this.cause.toJSON() };
  }
  toString() {
    return format$1(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  }
}
class EffectPrimitiveSuccess {
  _op;
  effect_instruction_i0 = undefined;
  effect_instruction_i1 = undefined;
  effect_instruction_i2 = undefined;
  trace = undefined;
  [EffectTypeId$1] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol](that) {
    return this === that;
  }
  [symbol$1]() {
    return cached(this, random(this));
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return { _id: "Exit", _tag: this._op, value: toJSON(this.value) };
  }
  toString() {
    return format$1(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  }
}
const isEffect = (u) => hasProperty(u, EffectTypeId$1);
const withFiberRuntime = (withRuntime) => {
  const effect = new EffectPrimitive(OP_WITH_RUNTIME);
  effect.effect_instruction_i0 = withRuntime;
  return effect;
};
const acquireUseRelease = dual(3, (acquire, use, release) =>
  uninterruptibleMask((restore) =>
    flatMap$2(acquire, (a) =>
      flatMap$2(exit(suspend$1(() => restore(use(a)))), (exit) =>
        suspend$1(() => release(a, exit)).pipe(
          matchCauseEffect({
            onFailure: (cause) => {
              switch (exit._tag) {
                case OP_FAILURE:
                  return failCause(
                    parallel$2(exit.effect_instruction_i0, cause)
                  );
                case OP_SUCCESS:
                  return failCause(cause);
              }
            },
            onSuccess: () => exit,
          })
        )
      )
    )
  )
);
const as = dual(2, (self, value) => flatMap$2(self, () => succeed$1(value)));
const asVoid = (self) => as(self, void 0);
const custom = function () {
  const wrapper = new EffectPrimitive(OP_COMMIT);
  switch (arguments.length) {
    case 2: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.commit = arguments[1];
      break;
    }
    case 3: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.commit = arguments[2];
      break;
    }
    case 4: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.effect_instruction_i2 = arguments[2];
      wrapper.commit = arguments[3];
      break;
    }
    default: {
      throw new Error(getBugErrorMessage("you're not supposed to end up here"));
    }
  }
  return wrapper;
};
const async = (register, blockingOn = none$2) =>
  custom(register, function () {
    let backingResume = undefined;
    let pendingEffect = undefined;
    function proxyResume(effect) {
      if (backingResume) {
        backingResume(effect);
      } else if (pendingEffect === undefined) {
        pendingEffect = effect;
      }
    }
    const effect = new EffectPrimitive(OP_ASYNC);
    effect.effect_instruction_i0 = (resume) => {
      backingResume = resume;
      if (pendingEffect) {
        resume(pendingEffect);
      }
    };
    effect.effect_instruction_i1 = blockingOn;
    let cancelerRef = undefined;
    let controllerRef = undefined;
    if (this.effect_instruction_i0.length !== 1) {
      controllerRef = new AbortController();
      cancelerRef = this.effect_instruction_i0(
        proxyResume,
        controllerRef.signal
      );
    } else {
      cancelerRef = this.effect_instruction_i0(proxyResume);
    }
    return cancelerRef || controllerRef
      ? onInterrupt(effect, (_) => {
          if (controllerRef) {
            controllerRef.abort();
          }
          return cancelerRef ?? void_;
        })
      : effect;
  });
const catchAll$1 = dual(2, (self, f) =>
  matchEffect$1(self, { onFailure: f, onSuccess: succeed$1 })
);
const spanSymbol = Symbol.for("effect/SpanAnnotation");
const originalSymbol = Symbol.for("effect/OriginalAnnotation");
const capture = (obj, span) => {
  if (isSome(span)) {
    return new Proxy(obj, {
      has(target, p) {
        return p === spanSymbol || p === originalSymbol || p in target;
      },
      get(target, p) {
        if (p === spanSymbol) {
          return span.value;
        }
        if (p === originalSymbol) {
          return obj;
        }
        return target[p];
      },
    });
  }
  return obj;
};
const dieMessage = (message) =>
  failCauseSync(() => die(new RuntimeException(message)));
const either$1 = (self) =>
  matchEffect$1(self, {
    onFailure: (e) => succeed$1(left(e)),
    onSuccess: (a) => succeed$1(right(a)),
  });
const exit = (self) =>
  matchCause(self, { onFailure: exitFailCause, onSuccess: exitSucceed });
const fail = (error) =>
  isObject(error) && !(spanSymbol in error)
    ? withFiberRuntime((fiber) =>
        failCause(fail$1(capture(error, currentSpanFromFiber(fiber))))
      )
    : failCause(fail$1(error));
const failSync = (evaluate) => flatMap$2(sync(evaluate), fail);
const failCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
};
const failCauseSync = (evaluate) => flatMap$2(sync(evaluate), failCause);
const fiberId = withFiberRuntime((state) => succeed$1(state.id()));
const fiberIdWith = (f) => withFiberRuntime((state) => f(state.id()));
const flatMap$2 = dual(2, (self, f) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS);
  effect.effect_instruction_i0 = self;
  effect.effect_instruction_i1 = f;
  return effect;
});
const step = (self) => {
  const effect = new EffectPrimitive("OnStep");
  effect.effect_instruction_i0 = self;
  return effect;
};
const flatten$1 = (self) => flatMap$2(self, identity);
const matchCause = dual(2, (self, options) =>
  matchCauseEffect(self, {
    onFailure: (cause) => succeed$1(options.onFailure(cause)),
    onSuccess: (a) => succeed$1(options.onSuccess(a)),
  })
);
const matchCauseEffect = dual(2, (self, options) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS_AND_FAILURE);
  effect.effect_instruction_i0 = self;
  effect.effect_instruction_i1 = options.onFailure;
  effect.effect_instruction_i2 = options.onSuccess;
  return effect;
});
const matchEffect$1 = dual(2, (self, options) =>
  matchCauseEffect(self, {
    onFailure: (cause) => {
      const defects$1 = defects(cause);
      if (defects$1.length > 0) {
        return failCause(electFailures(cause));
      }
      const failures$1 = failures(cause);
      if (failures$1.length > 0) {
        return options.onFailure(unsafeHead(failures$1));
      }
      return failCause(cause);
    },
    onSuccess: options.onSuccess,
  })
);
const forEachSequential = dual(2, (self, f) =>
  suspend$1(() => {
    const arr = fromIterable$6(self);
    const ret = allocate(arr.length);
    let i = 0;
    return as(
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
);
const forEachSequentialDiscard = dual(2, (self, f) =>
  suspend$1(() => {
    const arr = fromIterable$6(self);
    let i = 0;
    return whileLoop({
      while: () => i < arr.length,
      body: () => f(arr[i], i),
      step: () => {
        i++;
      },
    });
  })
);
const interruptible = (self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = enable(Interruption);
  effect.effect_instruction_i1 = () => self;
  return effect;
};
const map$2 = dual(2, (self, f) => flatMap$2(self, (a) => sync(() => f(a))));
const mapBoth = dual(2, (self, options) =>
  matchEffect$1(self, {
    onFailure: (e) => failSync(() => options.onFailure(e)),
    onSuccess: (a) => sync(() => options.onSuccess(a)),
  })
);
const mapError$2 = dual(2, (self, f) =>
  matchCauseEffect(self, {
    onFailure: (cause) => {
      const either = failureOrCause(cause);
      switch (either._tag) {
        case "Left": {
          return failSync(() => f(either.left));
        }
        case "Right": {
          return failCause(either.right);
        }
      }
    },
    onSuccess: succeed$1,
  })
);
const onExit = dual(2, (self, cleanup) =>
  uninterruptibleMask((restore) =>
    matchCauseEffect(restore(self), {
      onFailure: (cause1) => {
        const result = exitFailCause(cause1);
        return matchCauseEffect(cleanup(result), {
          onFailure: (cause2) => exitFailCause(sequential$2(cause1, cause2)),
          onSuccess: () => result,
        });
      },
      onSuccess: (success) => {
        const result = exitSucceed(success);
        return zipRight(cleanup(result), result);
      },
    })
  )
);
const onInterrupt = dual(2, (self, cleanup) =>
  onExit(
    self,
    exitMatch({
      onFailure: (cause) =>
        isInterruptedOnly(cause) ? asVoid(cleanup(interruptors(cause))) : void_,
      onSuccess: () => void_,
    })
  )
);
const orElse$1 = dual(2, (self, that) => attemptOrElse(self, that, succeed$1));
const succeed$1 = (value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.effect_instruction_i0 = value;
  return effect;
};
const suspend$1 = (effect) => flatMap$2(sync(effect), identity);
const sync = (evaluate) => {
  const effect = new EffectPrimitive(OP_SYNC);
  effect.effect_instruction_i0 = evaluate;
  return effect;
};
const tap = dual(2, (self, f) =>
  flatMap$2(self, (a) => {
    const b = typeof f === "function" ? f(a) : f;
    if (isEffect(b)) {
      return as(b, a);
    } else if (isPromiseLike(b)) {
      return async((resume) => {
        b.then(
          (_) => resume(succeed$1(a)),
          (e) => resume(fail(new UnknownException(e)))
        );
      });
    }
    return succeed$1(a);
  })
);
const transplant = (f) =>
  withFiberRuntime((state) => {
    const scopeOverride = state.getFiberRef(currentForkScopeOverride);
    const scope = pipe(
      scopeOverride,
      getOrElse(() => state.scope())
    );
    return f(fiberRefLocally(currentForkScopeOverride, some(scope)));
  });
const attemptOrElse = dual(3, (self, that, onSuccess) =>
  matchCauseEffect(self, {
    onFailure: (cause) => {
      const defects$1 = defects(cause);
      if (defects$1.length > 0) {
        return failCause(getOrThrow(keepDefectsAndElectFailures(cause)));
      }
      return that();
    },
    onSuccess: onSuccess,
  })
);
const uninterruptible = (self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable(Interruption);
  effect.effect_instruction_i1 = () => self;
  return effect;
};
const uninterruptibleMask = (f) =>
  custom(f, function () {
    const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
    effect.effect_instruction_i0 = disable(Interruption);
    effect.effect_instruction_i1 = (oldFlags) =>
      interruption(oldFlags)
        ? this.effect_instruction_i0(interruptible)
        : this.effect_instruction_i0(uninterruptible);
    return effect;
  });
const void_ = succeed$1(void 0);
const updateRuntimeFlags = (patch) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = patch;
  effect.effect_instruction_i1 = void 0;
  return effect;
};
const whileLoop = (options) => {
  const effect = new EffectPrimitive(OP_WHILE);
  effect.effect_instruction_i0 = options.while;
  effect.effect_instruction_i1 = options.body;
  effect.effect_instruction_i2 = options.step;
  return effect;
};
const yieldNow$1 = (options) => {
  const effect = new EffectPrimitive(OP_YIELD);
  return typeof options?.priority !== "undefined"
    ? withSchedulingPriority(effect, options.priority)
    : effect;
};
const zip = dual(2, (self, that) =>
  flatMap$2(self, (a) => map$2(that, (b) => [a, b]))
);
const zipLeft = dual(2, (self, that) => flatMap$2(self, (a) => as(that, a)));
const zipRight = dual(2, (self, that) => flatMap$2(self, () => that));
const interruptFiber = (self) =>
  flatMap$2(fiberId, (fiberId) => pipe(self, interruptAsFiber(fiberId)));
const interruptAsFiber = dual(2, (self, fiberId) =>
  flatMap$2(self.interruptAsFork(fiberId), () => self.await)
);
const logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const FiberRefSymbolKey = "effect/FiberRef";
const FiberRefTypeId = Symbol.for(FiberRefSymbolKey);
const fiberRefVariance = { _A: (_) => _ };
const fiberRefGet = (self) => fiberRefModify(self, (a) => [a, a]);
const fiberRefGetWith = dual(2, (self, f) => flatMap$2(fiberRefGet(self), f));
const fiberRefSet = dual(2, (self, value) =>
  fiberRefModify(self, () => [void 0, value])
);
const fiberRefModify = dual(2, (self, f) =>
  withFiberRuntime((state) => {
    const [b, a] = f(state.getFiberRef(self));
    state.setFiberRef(self, a);
    return succeed$1(b);
  })
);
const fiberRefLocally = dual(3, (use, self, value) =>
  acquireUseRelease(
    zipLeft(fiberRefGet(self), fiberRefSet(self, value)),
    () => use,
    (oldValue) => fiberRefSet(self, oldValue)
  )
);
const fiberRefUnsafeMake = (initial, options) =>
  fiberRefUnsafeMakePatch(initial, {
    differ: update$1(),
    fork: options?.fork ?? identity,
    join: options?.join,
  });
const fiberRefUnsafeMakeHashSet = (initial) => {
  const differ = hashSet();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ,
    fork: differ.empty,
  });
};
const fiberRefUnsafeMakeReadonlyArray = (initial) => {
  const differ = readonlyArray(update$1());
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ,
    fork: differ.empty,
  });
};
const fiberRefUnsafeMakeContext = (initial) => {
  const differ = environment();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ,
    fork: differ.empty,
  });
};
const fiberRefUnsafeMakePatch = (initial, options) => ({
  [FiberRefTypeId]: fiberRefVariance,
  initial: initial,
  diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
  combine: (first, second) => options.differ.combine(first, second),
  patch: (patch) => (oldValue) => options.differ.patch(patch, oldValue),
  fork: options.fork,
  join: options.join ?? ((_, n) => n),
  pipe() {
    return pipeArguments(this, arguments);
  },
});
const fiberRefUnsafeMakeRuntimeFlags = (initial) =>
  fiberRefUnsafeMakePatch(initial, { differ: differ$1, fork: differ$1.empty });
const currentContext = globalValue(
  Symbol.for("effect/FiberRef/currentContext"),
  () => fiberRefUnsafeMakeContext(empty$c())
);
const currentSchedulingPriority = globalValue(
  Symbol.for("effect/FiberRef/currentSchedulingPriority"),
  () => fiberRefUnsafeMake(0)
);
const currentMaxOpsBeforeYield = globalValue(
  Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"),
  () => fiberRefUnsafeMake(2048)
);
const currentLogAnnotations = globalValue(
  Symbol.for("effect/FiberRef/currentLogAnnotation"),
  () => fiberRefUnsafeMake(empty$b())
);
const currentLogLevel = globalValue(
  Symbol.for("effect/FiberRef/currentLogLevel"),
  () => fiberRefUnsafeMake(logLevelInfo)
);
const currentLogSpan = globalValue(
  Symbol.for("effect/FiberRef/currentLogSpan"),
  () => fiberRefUnsafeMake(empty$a())
);
const withSchedulingPriority = dual(2, (self, scheduler) =>
  fiberRefLocally(self, currentSchedulingPriority, scheduler)
);
const currentConcurrency = globalValue(
  Symbol.for("effect/FiberRef/currentConcurrency"),
  () => fiberRefUnsafeMake("unbounded")
);
const currentRequestBatching = globalValue(
  Symbol.for("effect/FiberRef/currentRequestBatching"),
  () => fiberRefUnsafeMake(true)
);
const currentUnhandledErrorLogLevel = globalValue(
  Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"),
  () => fiberRefUnsafeMake(some(logLevelDebug))
);
const currentMetricLabels = globalValue(
  Symbol.for("effect/FiberRef/currentMetricLabels"),
  () => fiberRefUnsafeMakeReadonlyArray(empty$j())
);
const currentForkScopeOverride = globalValue(
  Symbol.for("effect/FiberRef/currentForkScopeOverride"),
  () =>
    fiberRefUnsafeMake(none$4(), {
      fork: () => none$4(),
      join: (parent, _) => parent,
    })
);
const currentInterruptedCause = globalValue(
  Symbol.for("effect/FiberRef/currentInterruptedCause"),
  () =>
    fiberRefUnsafeMake(empty$e, {
      fork: () => empty$e,
      join: (parent, _) => parent,
    })
);
const scopeAddFinalizer = (self, finalizer) =>
  self.addFinalizer(() => asVoid(finalizer));
const scopeClose = (self, exit) => self.close(exit);
const scopeFork = (self, strategy) => self.fork(strategy);
const YieldableError = (function () {
  class YieldableError extends globalThis.Error {
    commit() {
      return fail(this);
    }
    toString() {
      return this.message ? `${this.name}: ${this.message}` : this.name;
    }
    toJSON() {
      return { ...this };
    }
    [NodeInspectSymbol]() {
      const stack = this.stack;
      if (stack) {
        return `${this.toString()}\n${stack.split("\n").slice(1).join("\n")}`;
      }
      return this.toString();
    }
  }
  Object.assign(YieldableError.prototype, StructuralCommitPrototype);
  return YieldableError;
})();
const makeException = (proto, tag) => {
  class Base extends YieldableError {
    _tag = tag;
  }
  Object.assign(Base.prototype, proto);
  Base.prototype.name = tag;
  return Base;
};
const RuntimeExceptionTypeId = Symbol.for(
  "effect/Cause/errors/RuntimeException"
);
const RuntimeException = makeException(
  { [RuntimeExceptionTypeId]: RuntimeExceptionTypeId },
  "RuntimeException"
);
const InterruptedExceptionTypeId = Symbol.for(
  "effect/Cause/errors/InterruptedException"
);
const isInterruptedException = (u) =>
  hasProperty(u, InterruptedExceptionTypeId);
const NoSuchElementExceptionTypeId = Symbol.for(
  "effect/Cause/errors/NoSuchElement"
);
const NoSuchElementException = makeException(
  { [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId },
  "NoSuchElementException"
);
const UnknownExceptionTypeId = Symbol.for(
  "effect/Cause/errors/UnknownException"
);
const UnknownException = (function () {
  class UnknownException extends YieldableError {
    error;
    _tag = "UnknownException";
    constructor(error, message) {
      super(
        message ??
          (hasProperty(error, "message") && isString(error.message)
            ? error.message
            : void 0)
      );
      this.error = error;
    }
  }
  Object.assign(UnknownException.prototype, {
    [UnknownExceptionTypeId]: UnknownExceptionTypeId,
    name: "UnknownException",
  });
  return UnknownException;
})();
const exitIsExit = (u) =>
  isEffect(u) && "_tag" in u && (u._tag === "Success" || u._tag === "Failure");
const exitCollectAll = (exits, options) =>
  exitCollectAllInternal(exits, options?.parallel ? parallel$2 : sequential$2);
const exitFail = (error) => exitFailCause(fail$1(error));
const exitFailCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
};
const exitInterrupt = (fiberId) => exitFailCause(interrupt(fiberId));
const exitMap = dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE:
      return exitFailCause(self.effect_instruction_i0);
    case OP_SUCCESS:
      return exitSucceed(f(self.effect_instruction_i0));
  }
});
const exitMatch = dual(
  2,
  (self, { onFailure: onFailure, onSuccess: onSuccess }) => {
    switch (self._tag) {
      case OP_FAILURE:
        return onFailure(self.effect_instruction_i0);
      case OP_SUCCESS:
        return onSuccess(self.effect_instruction_i0);
    }
  }
);
const exitSucceed = (value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.effect_instruction_i0 = value;
  return effect;
};
const exitVoid = exitSucceed(void 0);
const exitZipWith = dual(
  3,
  (self, that, { onFailure: onFailure, onSuccess: onSuccess }) => {
    switch (self._tag) {
      case OP_FAILURE: {
        switch (that._tag) {
          case OP_SUCCESS:
            return exitFailCause(self.effect_instruction_i0);
          case OP_FAILURE: {
            return exitFailCause(
              onFailure(self.effect_instruction_i0, that.effect_instruction_i0)
            );
          }
        }
      }
      case OP_SUCCESS: {
        switch (that._tag) {
          case OP_SUCCESS:
            return exitSucceed(
              onSuccess(self.effect_instruction_i0, that.effect_instruction_i0)
            );
          case OP_FAILURE:
            return exitFailCause(that.effect_instruction_i0);
        }
      }
    }
  }
);
const exitCollectAllInternal = (exits, combineCauses) => {
  const list = fromIterable$5(exits);
  if (!isNonEmpty(list)) {
    return none$4();
  }
  return pipe(
    tailNonEmpty(list),
    reduce$6(pipe(headNonEmpty(list), exitMap(of$1)), (accumulator, current) =>
      pipe(
        accumulator,
        exitZipWith(current, {
          onSuccess: (list, value) => pipe(list, prepend$1(value)),
          onFailure: combineCauses,
        })
      )
    ),
    exitMap(reverse$1),
    exitMap((chunk) => toReadonlyArray(chunk)),
    some
  );
};
const deferredUnsafeMake = (fiberId) => ({
  [DeferredTypeId]: deferredVariance,
  state: make$g(pending([])),
  blockingOn: fiberId,
  pipe() {
    return pipeArguments(this, arguments);
  },
});
const deferredAwait = (self) =>
  async((resume) => {
    const state = get$3(self.state);
    switch (state._tag) {
      case OP_STATE_DONE: {
        return resume(state.effect);
      }
      case OP_STATE_PENDING: {
        state.joiners.push(resume);
        return deferredInterruptJoiner(self, resume);
      }
    }
  }, self.blockingOn);
const deferredUnsafeDone = (self, effect) => {
  const state = get$3(self.state);
  if (state._tag === OP_STATE_PENDING) {
    set$2(self.state, done$2(effect));
    for (let i = 0, len = state.joiners.length; i < len; i++) {
      state.joiners[i](effect);
    }
  }
};
const deferredInterruptJoiner = (self, joiner) =>
  sync(() => {
    const state = get$3(self.state);
    if (state._tag === OP_STATE_PENDING) {
      const index = state.joiners.indexOf(joiner);
      if (index >= 0) {
        state.joiners.splice(index, 1);
      }
    }
  });
const constContext = fiberRefGet(currentContext);
const context = () => constContext;
const contextWithEffect = (f) => flatMap$2(context(), f);
const provideContext = dual(2, (self, context) =>
  fiberRefLocally(currentContext, context)(self)
);
const mapInputContext = dual(2, (self, f) =>
  contextWithEffect((context) => provideContext(self, f(context)))
);
const currentSpanFromFiber = (fiber) => {
  const span = fiber.getFiberRef(currentContext).unsafeMap.get(spanTag.key);
  return span !== undefined && span._tag === "Span" ? some(span) : none$4();
};
const Error$2 = (function () {
  return class Base extends YieldableError {
    constructor(args) {
      super();
      if (args) {
        Object.assign(this, args);
      }
    }
  };
})();
const TaggedError = (tag) => {
  class Base extends Error$2 {
    _tag = tag;
  }
  Base.prototype.name = tag;
  return Base;
};
const TypeId$3 = Symbol.for("effect/Duration");
const bigint0$1 = BigInt(0);
const bigint24 = BigInt(24);
const bigint60 = BigInt(60);
const bigint1e3 = BigInt(1e3);
const bigint1e6 = BigInt(1e6);
const bigint1e9 = BigInt(1e9);
const DURATION_REGEX =
  /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
const decode = (input) => {
  if (isDuration(input)) {
    return input;
  } else if (isNumber(input)) {
    return millis(input);
  } else if (isBigInt(input)) {
    return nanos(input);
  } else if (Array.isArray(input)) {
    if (input.length === 2 && isNumber(input[0]) && isNumber(input[1])) {
      return nanos(BigInt(input[0]) * bigint1e9 + BigInt(input[1]));
    }
  } else if (isString(input)) {
    DURATION_REGEX.lastIndex = 0;
    const match = DURATION_REGEX.exec(input);
    if (match) {
      const [_, valueStr, unit] = match;
      const value = Number(valueStr);
      switch (unit) {
        case "nano":
        case "nanos":
          return nanos(BigInt(valueStr));
        case "micro":
        case "micros":
          return micros(BigInt(valueStr));
        case "milli":
        case "millis":
          return millis(value);
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
};
const zeroValue = { _tag: "Millis", millis: 0 };
const infinityValue = { _tag: "Infinity" };
const DurationProto = {
  [TypeId$3]: TypeId$3,
  [symbol$1]() {
    return cached(this, structure(this.value));
  },
  [symbol](that) {
    return isDuration(that) && equals(this, that);
  },
  toString() {
    return `Duration(${format(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return { _id: "Duration", _tag: "Millis", millis: this.value.millis };
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
    return pipeArguments(this, arguments);
  },
};
const make$b = (input) => {
  const duration = Object.create(DurationProto);
  if (isNumber(input)) {
    if (isNaN(input) || input <= 0) {
      duration.value = zeroValue;
    } else if (!Number.isFinite(input)) {
      duration.value = infinityValue;
    } else if (!Number.isInteger(input)) {
      duration.value = {
        _tag: "Nanos",
        nanos: BigInt(Math.round(input * 1e6)),
      };
    } else {
      duration.value = { _tag: "Millis", millis: input };
    }
  } else if (input <= bigint0$1) {
    duration.value = zeroValue;
  } else {
    duration.value = { _tag: "Nanos", nanos: input };
  }
  return duration;
};
const isDuration = (u) => hasProperty(u, TypeId$3);
const zero = make$b(0);
const nanos = (nanos) => make$b(nanos);
const micros = (micros) => make$b(micros * bigint1e3);
const millis = (millis) => make$b(millis);
const seconds = (seconds) => make$b(seconds * 1e3);
const minutes = (minutes) => make$b(minutes * 6e4);
const hours = (hours) => make$b(hours * 36e5);
const days = (days) => make$b(days * 864e5);
const weeks = (weeks) => make$b(weeks * 6048e5);
const toMillis = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return Infinity;
    case "Nanos":
      return Number(_self.value.nanos) / 1e6;
    case "Millis":
      return _self.value.millis;
  }
};
const unsafeToNanos = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1e6));
  }
};
const toHrTime = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
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
};
const matchWith = dual(3, (self, that, options) => {
  const _self = decode(self);
  const _that = decode(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis(toMillis(_self), toMillis(_that));
  } else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
    const selfNanos =
      _self.value._tag === "Nanos"
        ? _self.value.nanos
        : BigInt(Math.round(_self.value.millis * 1e6));
    const thatNanos =
      _that.value._tag === "Nanos"
        ? _that.value.nanos
        : BigInt(Math.round(_that.value.millis * 1e6));
    return options.onNanos(selfNanos, thatNanos);
  }
  return options.onMillis(_self.value.millis, _that.value.millis);
});
const Equivalence = (self, that) =>
  matchWith(self, that, {
    onMillis: (self, that) => self === that,
    onNanos: (self, that) => self === that,
  });
const greaterThanOrEqualTo = dual(2, (self, that) =>
  matchWith(self, that, {
    onMillis: (self, that) => self >= that,
    onNanos: (self, that) => self >= that,
  })
);
const equals = dual(2, (self, that) => Equivalence(decode(self), decode(that)));
const format = (self) => {
  const duration = decode(self);
  const parts = [];
  if (duration.value._tag === "Infinity") {
    return "Infinity";
  }
  const nanos = unsafeToNanos(duration);
  if (nanos % bigint1e6) {
    parts.push(`${nanos % bigint1e6}ns`);
  }
  const ms = nanos / bigint1e6;
  if (ms % bigint1e3 !== bigint0$1) {
    parts.push(`${ms % bigint1e3}ms`);
  }
  const sec = ms / bigint1e3;
  if (sec % bigint60 !== bigint0$1) {
    parts.push(`${sec % bigint60}s`);
  }
  const min = sec / bigint60;
  if (min % bigint60 !== bigint0$1) {
    parts.push(`${min % bigint60}m`);
  }
  const hr = min / bigint60;
  if (hr % bigint24 !== bigint0$1) {
    parts.push(`${hr % bigint24}h`);
  }
  const days = hr / bigint24;
  if (days !== bigint0$1) {
    parts.push(`${days}d`);
  }
  return parts.reverse().join(" ");
};
const ClockSymbolKey = "effect/Clock";
const ClockTypeId = Symbol.for(ClockSymbolKey);
const clockTag = GenericTag("effect/Clock");
const MAX_TIMER_MILLIS = 2 ** 31 - 1;
const globalClockScheduler = {
  unsafeSchedule(task, duration) {
    const millis = toMillis(duration);
    if (millis > MAX_TIMER_MILLIS) {
      return constFalse;
    }
    let completed = false;
    const handle = setTimeout(() => {
      completed = true;
      task();
    }, millis);
    return () => {
      clearTimeout(handle);
      return !completed;
    };
  },
};
const performanceNowNanos = (function () {
  const bigint1e6 = BigInt(1e6);
  if (typeof performance === "undefined") {
    return () => BigInt(Date.now()) * bigint1e6;
  }
  const origin =
    "timeOrigin" in performance && typeof performance.timeOrigin === "number"
      ? BigInt(Math.round(performance.timeOrigin * 1e6))
      : BigInt(Date.now()) * bigint1e6 -
        BigInt(Math.round(performance.now() * 1e6));
  return () => origin + BigInt(Math.round(performance.now() * 1e6));
})();
const processOrPerformanceNow = (function () {
  const processHrtime =
    typeof process === "object" &&
    "hrtime" in process &&
    typeof process.hrtime.bigint === "function"
      ? process.hrtime
      : undefined;
  if (!processHrtime) {
    return performanceNowNanos;
  }
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
    return succeed$1(globalClockScheduler);
  }
  sleep(duration) {
    return async((resume) => {
      const canceler = globalClockScheduler.unsafeSchedule(
        () => resume(void_),
        duration
      );
      return asVoid(sync(canceler));
    });
  }
}
const make$a = () => new ClockImpl();
const Order$1 = number;
const escape = (string) => string.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");
const OP_AND = "And";
const OP_OR = "Or";
const OP_INVALID_DATA = "InvalidData";
const OP_MISSING_DATA = "MissingData";
const OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
const OP_UNSUPPORTED = "Unsupported";
const ConfigErrorSymbolKey = "effect/ConfigError";
const ConfigErrorTypeId = Symbol.for(ConfigErrorSymbolKey);
const proto = { _tag: "ConfigError", [ConfigErrorTypeId]: ConfigErrorTypeId };
const And = (self, that) => {
  const error = Object.create(proto);
  error._op = OP_AND;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} and ${this.right}`;
    },
  });
  return error;
};
const Or = (self, that) => {
  const error = Object.create(proto);
  error._op = OP_OR;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} or ${this.right}`;
    },
  });
  return error;
};
const InvalidData = (path, message, options = { pathDelim: "." }) => {
  const error = Object.create(proto);
  error._op = OP_INVALID_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, join$1(options.pathDelim));
      return `(Invalid data at ${path}: "${this.message}")`;
    },
  });
  return error;
};
const MissingData = (path, message, options = { pathDelim: "." }) => {
  const error = Object.create(proto);
  error._op = OP_MISSING_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, join$1(options.pathDelim));
      return `(Missing data at ${path}: "${this.message}")`;
    },
  });
  return error;
};
const SourceUnavailable = (
  path,
  message,
  cause,
  options = { pathDelim: "." }
) => {
  const error = Object.create(proto);
  error._op = OP_SOURCE_UNAVAILABLE;
  error.path = path;
  error.message = message;
  error.cause = cause;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, join$1(options.pathDelim));
      return `(Source unavailable at ${path}: "${this.message}")`;
    },
  });
  return error;
};
const Unsupported = (path, message, options = { pathDelim: "." }) => {
  const error = Object.create(proto);
  error._op = OP_UNSUPPORTED;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, join$1(options.pathDelim));
      return `(Unsupported operation at ${path}: "${this.message}")`;
    },
  });
  return error;
};
const prefixed = dual(2, (self, prefix) => {
  switch (self._op) {
    case OP_AND: {
      return And(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_OR: {
      return Or(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_INVALID_DATA: {
      return InvalidData([...prefix, ...self.path], self.message);
    }
    case OP_MISSING_DATA: {
      return MissingData([...prefix, ...self.path], self.message);
    }
    case OP_SOURCE_UNAVAILABLE: {
      return SourceUnavailable(
        [...prefix, ...self.path],
        self.message,
        self.cause
      );
    }
    case OP_UNSUPPORTED: {
      return Unsupported([...prefix, ...self.path], self.message);
    }
  }
});
const empty$5 = { _tag: "Empty" };
const patch$3 = dual(2, (path, patch) => {
  let input = of(patch);
  let output = path;
  while (isCons(input)) {
    const patch = input.head;
    switch (patch._tag) {
      case "Empty": {
        input = input.tail;
        break;
      }
      case "AndThen": {
        input = cons(patch.first, cons(patch.second, input.tail));
        break;
      }
      case "MapName": {
        output = map$5(output, patch.f);
        input = input.tail;
        break;
      }
      case "Nested": {
        output = prepend$2(output, patch.name);
        input = input.tail;
        break;
      }
      case "Unnested": {
        const containsName = pipe(head(output), contains(patch.name));
        if (containsName) {
          output = tailNonEmpty$1(output);
          input = input.tail;
        } else {
          return left(
            MissingData(
              output,
              `Expected ${patch.name} to be in path in ConfigProvider#unnested`
            )
          );
        }
        break;
      }
    }
  }
  return right(output);
});
const OP_CONSTANT = "Constant";
const OP_FAIL = "Fail";
const OP_FALLBACK = "Fallback";
const OP_DESCRIBED = "Described";
const OP_LAZY = "Lazy";
const OP_MAP_OR_FAIL = "MapOrFail";
const OP_NESTED = "Nested";
const OP_PRIMITIVE = "Primitive";
const OP_SEQUENCE = "Sequence";
const OP_HASHMAP = "HashMap";
const OP_ZIP_WITH = "ZipWith";
const concat = (l, r) => [...l, ...r];
const ConfigProviderSymbolKey = "effect/ConfigProvider";
const ConfigProviderTypeId = Symbol.for(ConfigProviderSymbolKey);
const configProviderTag = GenericTag("effect/ConfigProvider");
const FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
const FlatConfigProviderTypeId = Symbol.for(FlatConfigProviderSymbolKey);
const make$9 = (options) => ({
  [ConfigProviderTypeId]: ConfigProviderTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options,
});
const makeFlat = (options) => ({
  [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
  patch: options.patch,
  load: (path, config, split = true) => options.load(path, config, split),
  enumerateChildren: options.enumerateChildren,
});
const fromFlat = (flat) =>
  make$9({
    load: (config) =>
      flatMap$2(fromFlatLoop(flat, empty$j(), config, false), (chunk) =>
        match$2(head(chunk), {
          onNone: () =>
            fail(
              MissingData(
                empty$j(),
                `Expected a single value having structure: ${config}`
              )
            ),
          onSome: succeed$1,
        })
      ),
    flattened: flat,
  });
const fromEnv = (config) => {
  const { pathDelim: pathDelim, seqDelim: seqDelim } = Object.assign(
    {},
    { pathDelim: "_", seqDelim: "," },
    config
  );
  const makePathString = (path) => pipe(path, join$1(pathDelim));
  const unmakePathString = (pathString) => pathString.split(pathDelim);
  const getEnv = () =>
    typeof process !== "undefined" &&
    "env" in process &&
    typeof process.env === "object"
      ? process.env
      : {};
  const load = (path, primitive, split = true) => {
    const pathString = makePathString(path);
    const current = getEnv();
    const valueOpt =
      pathString in current ? some(current[pathString]) : none$4();
    return pipe(
      valueOpt,
      mapError$2(() =>
        MissingData(
          path,
          `Expected ${pathString} to exist in the process context`
        )
      ),
      flatMap$2((value) =>
        parsePrimitive(value, path, primitive, seqDelim, split)
      )
    );
  };
  const enumerateChildren = (path) =>
    sync(() => {
      const current = getEnv();
      const keys = Object.keys(current);
      const keyPaths = keys.map((value) =>
        unmakePathString(value.toUpperCase())
      );
      const filteredKeyPaths = keyPaths
        .filter((keyPath) => {
          for (let i = 0; i < path.length; i++) {
            const pathComponent = pipe(path, unsafeGet$3(i));
            const currentElement = keyPath[i];
            if (
              currentElement === undefined ||
              pathComponent !== currentElement
            ) {
              return false;
            }
          }
          return true;
        })
        .flatMap((keyPath) => keyPath.slice(path.length, path.length + 1));
      return fromIterable$2(filteredKeyPaths);
    });
  return fromFlat(
    makeFlat({
      load: load,
      enumerateChildren: enumerateChildren,
      patch: empty$5,
    })
  );
};
const extend = (leftDef, rightDef, left, right) => {
  const leftPad = unfold(left.length, (index) =>
    index >= right.length ? none$4() : some([leftDef(index), index + 1])
  );
  const rightPad = unfold(right.length, (index) =>
    index >= left.length ? none$4() : some([rightDef(index), index + 1])
  );
  const leftExtension = concat(left, leftPad);
  const rightExtension = concat(right, rightPad);
  return [leftExtension, rightExtension];
};
const appendConfigPath = (path, config) => {
  let op = config;
  if (op._tag === "Nested") {
    const out = path.slice();
    while (op._tag === "Nested") {
      out.push(op.name);
      op = op.config;
    }
    return out;
  }
  return path;
};
const fromFlatLoop = (flat, prefix, config, split) => {
  const op = config;
  switch (op._tag) {
    case OP_CONSTANT: {
      return succeed$1(of$2(op.value));
    }
    case OP_DESCRIBED: {
      return suspend$1(() => fromFlatLoop(flat, prefix, op.config, split));
    }
    case OP_FAIL: {
      return fail(MissingData(prefix, op.message));
    }
    case OP_FALLBACK: {
      return pipe(
        suspend$1(() => fromFlatLoop(flat, prefix, op.first, split)),
        catchAll$1((error1) => {
          if (op.condition(error1)) {
            return pipe(
              fromFlatLoop(flat, prefix, op.second, split),
              catchAll$1((error2) => fail(Or(error1, error2)))
            );
          }
          return fail(error1);
        })
      );
    }
    case OP_LAZY: {
      return suspend$1(() => fromFlatLoop(flat, prefix, op.config(), split));
    }
    case OP_MAP_OR_FAIL: {
      return suspend$1(() =>
        pipe(
          fromFlatLoop(flat, prefix, op.original, split),
          flatMap$2(
            forEachSequential((a) =>
              pipe(
                op.mapOrFail(a),
                mapError$2(prefixed(appendConfigPath(prefix, op.original)))
              )
            )
          )
        )
      );
    }
    case OP_NESTED: {
      return suspend$1(() =>
        fromFlatLoop(flat, concat(prefix, of$2(op.name)), op.config, split)
      );
    }
    case OP_PRIMITIVE: {
      return pipe(
        patch$3(prefix, flat.patch),
        flatMap$2((prefix) =>
          pipe(
            flat.load(prefix, op, split),
            flatMap$2((values) => {
              if (values.length === 0) {
                const name = pipe(
                  last(prefix),
                  getOrElse(() => "<n/a>")
                );
                return fail(
                  MissingData(
                    [],
                    `Expected ${op.description} with name ${name}`
                  )
                );
              }
              return succeed$1(values);
            })
          )
        )
      );
    }
    case OP_SEQUENCE: {
      return pipe(
        patch$3(prefix, flat.patch),
        flatMap$2((patchedPrefix) =>
          pipe(
            flat.enumerateChildren(patchedPrefix),
            flatMap$2(indicesFrom),
            flatMap$2((indices) => {
              if (indices.length === 0) {
                return suspend$1(() =>
                  map$2(
                    fromFlatLoop(flat, patchedPrefix, op.config, true),
                    of$2
                  )
                );
              }
              return pipe(
                forEachSequential(indices, (index) =>
                  fromFlatLoop(
                    flat,
                    append$1(prefix, `[${index}]`),
                    op.config,
                    true
                  )
                ),
                map$2((chunkChunk) => {
                  const flattened = flatten$3(chunkChunk);
                  if (flattened.length === 0) {
                    return of$2(empty$j());
                  }
                  return of$2(flattened);
                })
              );
            })
          )
        )
      );
    }
    case OP_HASHMAP: {
      return suspend$1(() =>
        pipe(
          patch$3(prefix, flat.patch),
          flatMap$2((prefix) =>
            pipe(
              flat.enumerateChildren(prefix),
              flatMap$2((keys) =>
                pipe(
                  keys,
                  forEachSequential((key) =>
                    fromFlatLoop(
                      flat,
                      concat(prefix, of$2(key)),
                      op.valueConfig,
                      split
                    )
                  ),
                  map$2((matrix) => {
                    if (matrix.length === 0) {
                      return of$2(empty$b());
                    }
                    return pipe(
                      transpose(matrix),
                      map$5((values) =>
                        fromIterable$1(zip$1(fromIterable$6(keys), values))
                      )
                    );
                  })
                )
              )
            )
          )
        )
      );
    }
    case OP_ZIP_WITH: {
      return suspend$1(() =>
        pipe(
          fromFlatLoop(flat, prefix, op.left, split),
          either$1,
          flatMap$2((left) =>
            pipe(
              fromFlatLoop(flat, prefix, op.right, split),
              either$1,
              flatMap$2((right$1) => {
                if (isLeft(left) && isLeft(right$1)) {
                  return fail(And(left.left, right$1.left));
                }
                if (isLeft(left) && isRight(right$1)) {
                  return fail(left.left);
                }
                if (isRight(left) && isLeft(right$1)) {
                  return fail(right$1.left);
                }
                if (isRight(left) && isRight(right$1)) {
                  const path = pipe(prefix, join$1("."));
                  const fail = fromFlatLoopFail(prefix, path);
                  const [lefts, rights] = extend(
                    fail,
                    fail,
                    pipe(left.right, map$5(right)),
                    pipe(right$1.right, map$5(right))
                  );
                  return pipe(
                    lefts,
                    zip$1(rights),
                    forEachSequential(([left, right]) =>
                      pipe(
                        zip(left, right),
                        map$2(([left, right]) => op.zip(left, right))
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
  }
};
const fromFlatLoopFail = (prefix, path) => (index) =>
  left(
    MissingData(
      prefix,
      `The element at index ${index} in a sequence at path "${path}" was missing`
    )
  );
const splitPathString = (text, delim) => {
  const split = text.split(new RegExp(`\\s*${escape(delim)}\\s*`));
  return split;
};
const parsePrimitive = (text, path, primitive, delimiter, split) => {
  if (!split) {
    return pipe(
      primitive.parse(text),
      mapBoth({ onFailure: prefixed(path), onSuccess: of$2 })
    );
  }
  return pipe(
    splitPathString(text, delimiter),
    forEachSequential((char) => primitive.parse(char.trim())),
    mapError$2(prefixed(path))
  );
};
const transpose = (array) =>
  Object.keys(array[0]).map((column) => array.map((row) => row[column]));
const indicesFrom = (quotedIndices) =>
  pipe(
    forEachSequential(quotedIndices, parseQuotedIndex),
    mapBoth({ onFailure: () => empty$j(), onSuccess: sort(Order$1) }),
    either$1,
    map$2(merge$3)
  );
const QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
const parseQuotedIndex = (str) => {
  const match = str.match(QUOTED_INDEX_REGEX);
  if (match !== null) {
    const matchedIndex = match[2];
    return pipe(
      matchedIndex !== undefined && matchedIndex.length > 0
        ? some(matchedIndex)
        : none$4(),
      flatMap$4(parseInteger)
    );
  }
  return none$4();
};
const parseInteger = (str) => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? none$4() : some(parsedIndex);
};
const TypeId$2 = Symbol.for("effect/Console");
const consoleTag = GenericTag("effect/Console");
const defaultConsole = {
  [TypeId$2]: TypeId$2,
  assert(condition, ...args) {
    return sync(() => {
      console.assert(condition, ...args);
    });
  },
  clear: sync(() => {
    console.clear();
  }),
  count(label) {
    return sync(() => {
      console.count(label);
    });
  },
  countReset(label) {
    return sync(() => {
      console.countReset(label);
    });
  },
  debug(...args) {
    return sync(() => {
      console.debug(...args);
    });
  },
  dir(item, options) {
    return sync(() => {
      console.dir(item, options);
    });
  },
  dirxml(...args) {
    return sync(() => {
      console.dirxml(...args);
    });
  },
  error(...args) {
    return sync(() => {
      console.error(...args);
    });
  },
  group(options) {
    return options?.collapsed
      ? sync(() => console.groupCollapsed(options?.label))
      : sync(() => console.group(options?.label));
  },
  groupEnd: sync(() => {
    console.groupEnd();
  }),
  info(...args) {
    return sync(() => {
      console.info(...args);
    });
  },
  log(...args) {
    return sync(() => {
      console.log(...args);
    });
  },
  table(tabularData, properties) {
    return sync(() => {
      console.table(tabularData, properties);
    });
  },
  time(label) {
    return sync(() => console.time(label));
  },
  timeEnd(label) {
    return sync(() => console.timeEnd(label));
  },
  timeLog(label, ...args) {
    return sync(() => {
      console.timeLog(label, ...args);
    });
  },
  trace(...args) {
    return sync(() => {
      console.trace(...args);
    });
  },
  warn(...args) {
    return sync(() => {
      console.warn(...args);
    });
  },
  unsafe: console,
};
const RandomSymbolKey = "effect/Random";
const RandomTypeId = Symbol.for(RandomSymbolKey);
const randomTag = GenericTag("effect/Random");
class RandomImpl {
  seed;
  [RandomTypeId] = RandomTypeId;
  PRNG;
  constructor(seed) {
    this.seed = seed;
    this.PRNG = new PCGRandom(seed);
  }
  get next() {
    return sync(() => this.PRNG.number());
  }
  get nextBoolean() {
    return map$2(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(min, max) {
    return map$2(this.next, (n) => (max - min) * n + min);
  }
  nextIntBetween(min, max) {
    return sync(() => this.PRNG.integer(max - min) + min);
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
}
const shuffleWith = (elements, nextIntBounded) =>
  suspend$1(() =>
    pipe(
      sync(() => Array.from(elements)),
      flatMap$2((buffer) => {
        const numbers = [];
        for (let i = buffer.length; i >= 2; i = i - 1) {
          numbers.push(i);
        }
        return pipe(
          numbers,
          forEachSequentialDiscard((n) =>
            pipe(
              nextIntBounded(n),
              map$2((k) => swap(buffer, n - 1, k))
            )
          ),
          as(fromIterable$5(buffer))
        );
      })
    )
  );
const swap = (buffer, index1, index2) => {
  const tmp = buffer[index1];
  buffer[index1] = buffer[index2];
  buffer[index2] = tmp;
  return buffer;
};
const make$8 = (seed) => new RandomImpl(seed);
const liveServices = pipe(
  empty$c(),
  add(clockTag, make$a()),
  add(consoleTag, defaultConsole),
  add(randomTag, make$8((Math.random() * 4294967296) >>> 0)),
  add(configProviderTag, fromEnv()),
  add(tracerTag, nativeTracer)
);
const currentServices = globalValue(
  Symbol.for("effect/DefaultServices/currentServices"),
  () => fiberRefUnsafeMakeContext(liveServices)
);
const EffectTypeId = EffectTypeId$2;
const OP_SEQUENTIAL = "Sequential";
const OP_PARALLEL = "Parallel";
const OP_PARALLEL_N = "ParallelN";
const sequential$1 = { _tag: OP_SEQUENTIAL };
const parallel$1 = { _tag: OP_PARALLEL };
const parallelN$1 = (parallelism) => ({
  _tag: OP_PARALLEL_N,
  parallelism: parallelism,
});
const sequential = sequential$1;
const parallel = parallel$1;
const parallelN = parallelN$1;
function unsafeMake$2(fiberRefLocals) {
  return new FiberRefsImpl(fiberRefLocals);
}
function empty$4() {
  return unsafeMake$2(new Map());
}
const FiberRefsSym = Symbol.for("effect/FiberRefs");
class FiberRefsImpl {
  locals;
  [FiberRefsSym] = FiberRefsSym;
  constructor(locals) {
    this.locals = locals;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const findAncestor = (
  _ref,
  _parentStack,
  _childStack,
  _childModified = false
) => {
  const ref = _ref;
  let parentStack = _parentStack;
  let childStack = _childStack;
  let childModified = _childModified;
  let ret = undefined;
  while (ret === undefined) {
    if (
      isNonEmptyReadonlyArray(parentStack) &&
      isNonEmptyReadonlyArray(childStack)
    ) {
      const parentFiberId = headNonEmpty$1(parentStack)[0];
      const parentAncestors = tailNonEmpty$1(parentStack);
      const childFiberId = headNonEmpty$1(childStack)[0];
      const childRefValue = headNonEmpty$1(childStack)[1];
      const childAncestors = tailNonEmpty$1(childStack);
      if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
        childStack = childAncestors;
        childModified = true;
      } else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) {
        parentStack = parentAncestors;
      } else {
        if (parentFiberId.id < childFiberId.id) {
          childStack = childAncestors;
          childModified = true;
        } else if (parentFiberId.id > childFiberId.id) {
          parentStack = parentAncestors;
        } else {
          ret = [childRefValue, childModified];
        }
      }
    } else {
      ret = [ref.initial, true];
    }
  }
  return ret;
};
const joinAs = dual(3, (self, fiberId, that) => {
  const parentFiberRefs = new Map(self.locals);
  that.locals.forEach((childStack, fiberRef) => {
    const childValue = childStack[0][1];
    if (!childStack[0][0][symbol](fiberId)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (equals$1(childValue, fiberRef.initial)) {
          return;
        }
        parentFiberRefs.set(fiberRef, [
          [fiberId, fiberRef.join(fiberRef.initial, childValue)],
        ]);
        return;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(
        fiberRef,
        parentStack,
        childStack
      );
      if (wasModified) {
        const patch = fiberRef.diff(ancestor, childValue);
        const oldValue = parentStack[0][1];
        const newValue = fiberRef.join(
          oldValue,
          fiberRef.patch(patch)(oldValue)
        );
        if (!equals$1(oldValue, newValue)) {
          let newStack;
          const parentFiberId = parentStack[0][0];
          if (parentFiberId[symbol](fiberId)) {
            newStack = [[parentFiberId, newValue], ...parentStack.slice(1)];
          } else {
            newStack = [[fiberId, newValue], ...parentStack];
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  });
  return new FiberRefsImpl(parentFiberRefs);
});
const forkAs = dual(2, (self, childId) => {
  const map = new Map();
  unsafeForkAs(self, map, childId);
  return new FiberRefsImpl(map);
});
const unsafeForkAs = (self, map, fiberId) => {
  self.locals.forEach((stack, fiberRef) => {
    const oldValue = stack[0][1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (equals$1(oldValue, newValue)) {
      map.set(fiberRef, stack);
    } else {
      map.set(fiberRef, [[fiberId, newValue], ...stack]);
    }
  });
};
const delete_ = dual(2, (self, fiberRef) => {
  const locals = new Map(self.locals);
  locals.delete(fiberRef);
  return new FiberRefsImpl(locals);
});
const get$1 = dual(2, (self, fiberRef) => {
  if (!self.locals.has(fiberRef)) {
    return none$4();
  }
  return some(headNonEmpty$1(self.locals.get(fiberRef))[1]);
});
const getOrDefault$1 = dual(2, (self, fiberRef) =>
  pipe(
    get$1(self, fiberRef),
    getOrElse(() => fiberRef.initial)
  )
);
const updateAs = dual(
  2,
  (self, { fiberId: fiberId, fiberRef: fiberRef, value: value }) => {
    if (self.locals.size === 0) {
      return new FiberRefsImpl(new Map([[fiberRef, [[fiberId, value]]]]));
    }
    const locals = new Map(self.locals);
    unsafeUpdateAs(locals, fiberId, fiberRef, value);
    return new FiberRefsImpl(locals);
  }
);
const unsafeUpdateAs = (locals, fiberId, fiberRef, value) => {
  const oldStack = locals.get(fiberRef) ?? [];
  let newStack;
  if (isNonEmptyReadonlyArray(oldStack)) {
    const [currentId, currentValue] = headNonEmpty$1(oldStack);
    if (currentId[symbol](fiberId)) {
      if (equals$1(currentValue, value)) {
        return;
      } else {
        newStack = [[fiberId, value], ...oldStack.slice(1)];
      }
    } else {
      newStack = [[fiberId, value], ...oldStack];
    }
  } else {
    newStack = [[fiberId, value]];
  }
  locals.set(fiberRef, newStack);
};
const updateManyAs$1 = dual(2, (self, { entries: entries, forkAs: forkAs }) => {
  if (self.locals.size === 0) {
    return new FiberRefsImpl(new Map(entries));
  }
  const locals = new Map(self.locals);
  if (forkAs !== undefined) {
    unsafeForkAs(self, locals, forkAs);
  }
  entries.forEach(([fiberRef, values]) => {
    if (values.length === 1) {
      unsafeUpdateAs(locals, values[0][0], fiberRef, values[0][1]);
    } else {
      values.forEach(([fiberId, value]) => {
        unsafeUpdateAs(locals, fiberId, fiberRef, value);
      });
    }
  });
  return new FiberRefsImpl(locals);
});
const getOrDefault = getOrDefault$1;
const updateManyAs = updateManyAs$1;
const empty$3 = empty$4;
const OP_EMPTY$1 = "Empty";
const OP_ADD = "Add";
const OP_REMOVE = "Remove";
const OP_UPDATE = "Update";
const OP_AND_THEN$1 = "AndThen";
const empty$2 = { _tag: OP_EMPTY$1 };
const diff$2 = (oldValue, newValue) => {
  const missingLocals = new Map(oldValue.locals);
  let patch = empty$2;
  for (const [fiberRef, pairs] of newValue.locals.entries()) {
    const newValue = headNonEmpty$1(pairs)[1];
    const old = missingLocals.get(fiberRef);
    if (old !== undefined) {
      const oldValue = headNonEmpty$1(old)[1];
      if (!equals$1(oldValue, newValue)) {
        patch = combine$1({
          _tag: OP_UPDATE,
          fiberRef: fiberRef,
          patch: fiberRef.diff(oldValue, newValue),
        })(patch);
      }
    } else {
      patch = combine$1({ _tag: OP_ADD, fiberRef: fiberRef, value: newValue })(
        patch
      );
    }
    missingLocals.delete(fiberRef);
  }
  for (const [fiberRef] of missingLocals.entries()) {
    patch = combine$1({ _tag: OP_REMOVE, fiberRef: fiberRef })(patch);
  }
  return patch;
};
const combine$1 = dual(2, (self, that) => ({
  _tag: OP_AND_THEN$1,
  first: self,
  second: that,
}));
const patch$2 = dual(3, (self, fiberId, oldValue) => {
  let fiberRefs = oldValue;
  let patches = of$2(self);
  while (isNonEmptyReadonlyArray(patches)) {
    const head = headNonEmpty$1(patches);
    const tail = tailNonEmpty$1(patches);
    switch (head._tag) {
      case OP_EMPTY$1: {
        patches = tail;
        break;
      }
      case OP_ADD: {
        fiberRefs = updateAs(fiberRefs, {
          fiberId: fiberId,
          fiberRef: head.fiberRef,
          value: head.value,
        });
        patches = tail;
        break;
      }
      case OP_REMOVE: {
        fiberRefs = delete_(fiberRefs, head.fiberRef);
        patches = tail;
        break;
      }
      case OP_UPDATE: {
        const value = getOrDefault$1(fiberRefs, head.fiberRef);
        fiberRefs = updateAs(fiberRefs, {
          fiberId: fiberId,
          fiberRef: head.fiberRef,
          value: head.fiberRef.patch(head.patch)(value),
        });
        patches = tail;
        break;
      }
      case OP_AND_THEN$1: {
        patches = prepend$2(head.first)(prepend$2(head.second)(tail));
        break;
      }
    }
  }
  return fiberRefs;
});
const diff$1 = diff$2;
const patch$1 = patch$2;
const FiberStatusSymbolKey = "effect/FiberStatus";
const FiberStatusTypeId = Symbol.for(FiberStatusSymbolKey);
const OP_DONE = "Done";
const OP_RUNNING = "Running";
const OP_SUSPENDED = "Suspended";
const DoneHash = string(`${FiberStatusSymbolKey}-${OP_DONE}`);
class Done {
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_DONE;
  [symbol$1]() {
    return DoneHash;
  }
  [symbol](that) {
    return isFiberStatus(that) && that._tag === OP_DONE;
  }
}
class Running {
  runtimeFlags;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_RUNNING;
  constructor(runtimeFlags) {
    this.runtimeFlags = runtimeFlags;
  }
  [symbol$1]() {
    return pipe(
      hash(FiberStatusSymbolKey),
      combine$5(hash(this._tag)),
      combine$5(hash(this.runtimeFlags)),
      cached(this)
    );
  }
  [symbol](that) {
    return (
      isFiberStatus(that) &&
      that._tag === OP_RUNNING &&
      this.runtimeFlags === that.runtimeFlags
    );
  }
}
class Suspended {
  runtimeFlags;
  blockingOn;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_SUSPENDED;
  constructor(runtimeFlags, blockingOn) {
    this.runtimeFlags = runtimeFlags;
    this.blockingOn = blockingOn;
  }
  [symbol$1]() {
    return pipe(
      hash(FiberStatusSymbolKey),
      combine$5(hash(this._tag)),
      combine$5(hash(this.runtimeFlags)),
      combine$5(hash(this.blockingOn)),
      cached(this)
    );
  }
  [symbol](that) {
    return (
      isFiberStatus(that) &&
      that._tag === OP_SUSPENDED &&
      this.runtimeFlags === that.runtimeFlags &&
      equals$1(this.blockingOn, that.blockingOn)
    );
  }
}
const done$1 = new Done();
const running$1 = (runtimeFlags) => new Running(runtimeFlags);
const suspended$1 = (runtimeFlags, blockingOn) =>
  new Suspended(runtimeFlags, blockingOn);
const isFiberStatus = (u) => hasProperty(u, FiberStatusTypeId);
const isDone$1 = (self) => self._tag === OP_DONE;
const done = done$1;
const running = running$1;
const suspended = suspended$1;
const isDone = isDone$1;
const All = logLevelAll;
const Fatal = logLevelFatal;
const Error$1 = logLevelError;
const Warning = logLevelWarning;
const Info = logLevelInfo;
const Debug = logLevelDebug;
const Trace = logLevelTrace;
const None = logLevelNone;
const Order = pipe(
  Order$1,
  mapInput((level) => level.ordinal)
);
const greaterThan = greaterThan$1(Order);
const fromLiteral = (literal) => {
  switch (literal) {
    case "All":
      return All;
    case "Debug":
      return Debug;
    case "Error":
      return Error$1;
    case "Fatal":
      return Fatal;
    case "Info":
      return Info;
    case "Trace":
      return Trace;
    case "None":
      return None;
    case "Warning":
      return Warning;
  }
};
class PriorityBuckets {
  buckets = [];
  scheduleTask(task, priority) {
    let bucket = undefined;
    let index;
    for (index = 0; index < this.buckets.length; index++) {
      if (this.buckets[index][0] <= priority) {
        bucket = this.buckets[index];
      } else {
        break;
      }
    }
    if (bucket) {
      bucket[1].push(task);
    } else {
      const newBuckets = [];
      for (let i = 0; i < index; i++) {
        newBuckets.push(this.buckets[i]);
      }
      newBuckets.push([priority, [task]]);
      for (let i = index; i < this.buckets.length; i++) {
        newBuckets.push(this.buckets[i]);
      }
      this.buckets = newBuckets;
    }
  }
}
class MixedScheduler {
  maxNextTickBeforeTimer;
  running = false;
  tasks = new PriorityBuckets();
  constructor(maxNextTickBeforeTimer) {
    this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
  }
  starveInternal(depth) {
    const tasks = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (this.tasks.buckets.length === 0) {
      this.running = false;
    } else {
      this.starve(depth);
    }
  }
  starve(depth = 0) {
    if (depth >= this.maxNextTickBeforeTimer) {
      setTimeout(() => this.starveInternal(0), 0);
    } else {
      Promise.resolve(void 0).then(() => this.starveInternal(depth + 1));
    }
  }
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield)
      ? fiber.getFiberRef(currentSchedulingPriority)
      : false;
  }
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (!this.running) {
      this.running = true;
      this.starve();
    }
  }
}
const defaultScheduler = globalValue(
  Symbol.for("effect/Scheduler/defaultScheduler"),
  () => new MixedScheduler(2048)
);
class SyncScheduler {
  tasks = new PriorityBuckets();
  deferred = false;
  scheduleTask(task, priority) {
    if (this.deferred) {
      defaultScheduler.scheduleTask(task, priority);
    } else {
      this.tasks.scheduleTask(task, priority);
    }
  }
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield)
      ? fiber.getFiberRef(currentSchedulingPriority)
      : false;
  }
  flush() {
    while (this.tasks.buckets.length > 0) {
      const tasks = this.tasks.buckets;
      this.tasks.buckets = [];
      for (const [_, toRun] of tasks) {
        for (let i = 0; i < toRun.length; i++) {
          toRun[i]();
        }
      }
    }
    this.deferred = true;
  }
}
const currentScheduler = globalValue(
  Symbol.for("effect/FiberRef/currentScheduler"),
  () => fiberRefUnsafeMake(defaultScheduler)
);
const currentRequestMap = globalValue(
  Symbol.for("effect/FiberRef/currentRequestMap"),
  () => fiberRefUnsafeMake(new Map())
);
const match = (concurrency, sequential, unbounded, bounded) => {
  switch (concurrency) {
    case undefined:
      return sequential();
    case "unbounded":
      return unbounded();
    case "inherit":
      return fiberRefGetWith(currentConcurrency, (concurrency) =>
        concurrency === "unbounded"
          ? unbounded()
          : concurrency > 1
          ? bounded(concurrency)
          : sequential()
      );
    default:
      return concurrency > 1 ? bounded(concurrency) : sequential();
  }
};
const render$1 = (now) => (self) => {
  const label = self.label.replace(/[\s="]/g, "_");
  return `${label}=${now - self.startTime}ms`;
};
const render = render$1;
const MetricLabelSymbolKey = "effect/MetricLabel";
const MetricLabelTypeId = Symbol.for(MetricLabelSymbolKey);
class MetricLabelImpl {
  key;
  value;
  [MetricLabelTypeId] = MetricLabelTypeId;
  _hash;
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this._hash = string(MetricLabelSymbolKey + this.key + this.value);
  }
  [symbol$1]() {
    return this._hash;
  }
  [symbol](that) {
    return (
      isMetricLabel(that) && this.key === that.key && this.value === that.value
    );
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const make$7 = (key, value) => new MetricLabelImpl(key, value);
const isMetricLabel = (u) => hasProperty(u, MetricLabelTypeId);
const OP_INTERRUPT_SIGNAL = "InterruptSignal";
const OP_STATEFUL = "Stateful";
const OP_RESUME = "Resume";
const OP_YIELD_NOW = "YieldNow";
const interruptSignal = (cause) => ({
  _tag: OP_INTERRUPT_SIGNAL,
  cause: cause,
});
const stateful = (onFiber) => ({ _tag: OP_STATEFUL, onFiber: onFiber });
const resume = (effect) => ({ _tag: OP_RESUME, effect: effect });
const yieldNow = () => ({ _tag: OP_YIELD_NOW });
const FiberScopeSymbolKey = "effect/FiberScope";
const FiberScopeTypeId = Symbol.for(FiberScopeSymbolKey);
class Global {
  [FiberScopeTypeId] = FiberScopeTypeId;
  fiberId = none$2;
  roots = new Set();
  add(_runtimeFlags, child) {
    this.roots.add(child);
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
    this.fiberId = fiberId;
    this.parent = parent;
  }
  add(_runtimeFlags, child) {
    this.parent.tell(
      stateful((parentFiber) => {
        parentFiber.addChild(child);
        child.addObserver(() => {
          parentFiber.removeChild(child);
        });
      })
    );
  }
}
const unsafeMake$1 = (fiber) => new Local(fiber.id(), fiber);
const globalScope = globalValue(
  Symbol.for("effect/FiberScope/Global"),
  () => new Global()
);
const FiberSymbolKey = "effect/Fiber";
const FiberTypeId = Symbol.for(FiberSymbolKey);
const fiberVariance = { _E: (_) => _, _A: (_) => _ };
const RuntimeFiberSymbolKey = "effect/Fiber";
const RuntimeFiberTypeId = Symbol.for(RuntimeFiberSymbolKey);
const join = (self) => zipLeft(flatten$1(self.await), self.inheritAll);
const currentFiberURI = "effect/FiberCurrent";
const LoggerSymbolKey = "effect/Logger";
const LoggerTypeId = Symbol.for(LoggerSymbolKey);
const loggerVariance = { _Message: (_) => _, _Output: (_) => _ };
const makeLogger = (log) => ({
  [LoggerTypeId]: loggerVariance,
  log: log,
  pipe() {
    return pipeArguments(this, arguments);
  },
});
const stringLogger = makeLogger(
  ({
    annotations: annotations,
    cause: cause,
    date: date,
    fiberId: fiberId,
    logLevel: logLevel,
    message: message,
    spans: spans,
  }) => {
    const nowMillis = date.getTime();
    const outputArray = [
      `timestamp=${date.toISOString()}`,
      `level=${logLevel.label}`,
      `fiber=${threadName$1(fiberId)}`,
    ];
    let output = outputArray.join(" ");
    if (Array.isArray(message)) {
      for (let i = 0; i < message.length; i++) {
        const stringMessage = toStringUnknown(message[i]);
        if (stringMessage.length > 0) {
          output = output + " message=";
          output = appendQuoted(stringMessage, output);
        }
      }
    } else {
      const stringMessage = toStringUnknown(message);
      if (stringMessage.length > 0) {
        output = output + " message=";
        output = appendQuoted(stringMessage, output);
      }
    }
    if (cause != null && cause._tag !== "Empty") {
      output = output + " cause=";
      output = appendQuoted(pretty(cause), output);
    }
    if (isCons(spans)) {
      output = output + " ";
      let first = true;
      for (const span of spans) {
        if (first) {
          first = false;
        } else {
          output = output + " ";
        }
        output = output + pipe(span, render(nowMillis));
      }
    }
    if (pipe(annotations, size) > 0) {
      output = output + " ";
      let first = true;
      for (const [key, value] of annotations) {
        if (first) {
          first = false;
        } else {
          output = output + " ";
        }
        output = output + filterKeyName(key);
        output = output + "=";
        output = appendQuoted(toStringUnknown(value), output);
      }
    }
    return output;
  }
);
const escapeDoubleQuotes = (str) =>
  `"${str.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
const textOnly = /^[^\s"=]+$/;
const appendQuoted = (label, output) =>
  output + (label.match(textOnly) ? label : escapeDoubleQuotes(label));
const filterKeyName = (key) => key.replace(/[\s="]/g, "_");
const MetricBoundariesSymbolKey = "effect/MetricBoundaries";
const MetricBoundariesTypeId = Symbol.for(MetricBoundariesSymbolKey);
class MetricBoundariesImpl {
  values;
  [MetricBoundariesTypeId] = MetricBoundariesTypeId;
  constructor(values) {
    this.values = values;
    this._hash = pipe(
      string(MetricBoundariesSymbolKey),
      combine$5(array(this.values))
    );
  }
  _hash;
  [symbol$1]() {
    return this._hash;
  }
  [symbol](u) {
    return isMetricBoundaries(u) && equals$1(this.values, u.values);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const isMetricBoundaries = (u) => hasProperty(u, MetricBoundariesTypeId);
const fromIterable = (iterable) => {
  const values = pipe(
    iterable,
    appendAll$2(of$1(Number.POSITIVE_INFINITY)),
    dedupe
  );
  return new MetricBoundariesImpl(values);
};
const exponential = (options) =>
  pipe(
    makeBy(
      options.count - 1,
      (i) => options.start * Math.pow(options.factor, i)
    ),
    unsafeFromArray,
    fromIterable
  );
const MetricKeyTypeSymbolKey = "effect/MetricKeyType";
const MetricKeyTypeTypeId = Symbol.for(MetricKeyTypeSymbolKey);
const CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
const CounterKeyTypeTypeId = Symbol.for(CounterKeyTypeSymbolKey);
const FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
const FrequencyKeyTypeTypeId = Symbol.for(FrequencyKeyTypeSymbolKey);
const GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
const GaugeKeyTypeTypeId = Symbol.for(GaugeKeyTypeSymbolKey);
const HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
const HistogramKeyTypeTypeId = Symbol.for(HistogramKeyTypeSymbolKey);
const SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
const SummaryKeyTypeTypeId = Symbol.for(SummaryKeyTypeSymbolKey);
const metricKeyTypeVariance = { _In: (_) => _, _Out: (_) => _ };
class CounterKeyType {
  incremental;
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
  constructor(incremental, bigint) {
    this.incremental = incremental;
    this.bigint = bigint;
    this._hash = string(CounterKeyTypeSymbolKey);
  }
  _hash;
  [symbol$1]() {
    return this._hash;
  }
  [symbol](that) {
    return isCounterKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
class HistogramKeyType {
  boundaries;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
  constructor(boundaries) {
    this.boundaries = boundaries;
    this._hash = pipe(
      string(HistogramKeyTypeSymbolKey),
      combine$5(hash(this.boundaries))
    );
  }
  _hash;
  [symbol$1]() {
    return this._hash;
  }
  [symbol](that) {
    return isHistogramKey(that) && equals$1(this.boundaries, that.boundaries);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const counter$4 = (options) =>
  new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false);
const histogram$4 = (boundaries) => new HistogramKeyType(boundaries);
const isCounterKey = (u) => hasProperty(u, CounterKeyTypeTypeId);
const isFrequencyKey = (u) => hasProperty(u, FrequencyKeyTypeTypeId);
const isGaugeKey = (u) => hasProperty(u, GaugeKeyTypeTypeId);
const isHistogramKey = (u) => hasProperty(u, HistogramKeyTypeTypeId);
const isSummaryKey = (u) => hasProperty(u, SummaryKeyTypeTypeId);
const MetricKeySymbolKey = "effect/MetricKey";
const MetricKeyTypeId = Symbol.for(MetricKeySymbolKey);
const metricKeyVariance = { _Type: (_) => _ };
const arrayEquivilence = getEquivalence$2(equals$1);
class MetricKeyImpl {
  name;
  keyType;
  description;
  tags;
  [MetricKeyTypeId] = metricKeyVariance;
  constructor(name, keyType, description, tags = []) {
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
    this._hash = pipe(
      string(this.name + this.description),
      combine$5(hash(this.keyType)),
      combine$5(array(this.tags))
    );
  }
  _hash;
  [symbol$1]() {
    return this._hash;
  }
  [symbol](u) {
    return (
      isMetricKey(u) &&
      this.name === u.name &&
      equals$1(this.keyType, u.keyType) &&
      equals$1(this.description, u.description) &&
      arrayEquivilence(this.tags, u.tags)
    );
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const isMetricKey = (u) => hasProperty(u, MetricKeyTypeId);
const counter$3 = (name, options) =>
  new MetricKeyImpl(
    name,
    counter$4(options),
    fromNullable(options?.description)
  );
const histogram$3 = (name, boundaries, description) =>
  new MetricKeyImpl(name, histogram$4(boundaries), fromNullable(description));
const taggedWithLabels$1 = dual(2, (self, extraTags) =>
  extraTags.length === 0
    ? self
    : new MetricKeyImpl(
        self.name,
        self.keyType,
        self.description,
        union$2(self.tags, extraTags)
      )
);
const TypeId$1 = Symbol.for("effect/MutableHashMap");
const MutableHashMapProto = {
  [TypeId$1]: TypeId$1,
  [Symbol.iterator]() {
    return new MutableHashMapIterator(this);
  },
  toString() {
    return format$1(this.toJSON());
  },
  toJSON() {
    return { _id: "MutableHashMap", values: Array.from(this).map(toJSON) };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
};
class MutableHashMapIterator {
  self;
  referentialIterator;
  bucketIterator;
  constructor(self) {
    this.self = self;
    this.referentialIterator = self.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== undefined) {
      return this.bucketIterator.next();
    }
    const result = this.referentialIterator.next();
    if (result.done) {
      this.bucketIterator = new BucketIterator(this.self.buckets.values());
      return this.next();
    }
    return result;
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
    if (this.currentBucket === undefined) {
      const result = this.backing.next();
      if (result.done) {
        return result;
      }
      this.currentBucket = result.value[Symbol.iterator]();
    }
    const result = this.currentBucket.next();
    if (result.done) {
      this.currentBucket = undefined;
      return this.next();
    }
    return result;
  }
}
const empty$1 = () => {
  const self = Object.create(MutableHashMapProto);
  self.referential = new Map();
  self.buckets = new Map();
  self.bucketsSize = 0;
  return self;
};
const get = dual(2, (self, key) => {
  if (isEqual(key) === false) {
    return self.referential.has(key)
      ? some(self.referential.get(key))
      : none$4();
  }
  const hash = key[symbol$1]();
  const bucket = self.buckets.get(hash);
  if (bucket === undefined) {
    return none$4();
  }
  return getFromBucket(self, bucket, key);
});
const getFromBucket = (self, bucket, key, remove = false) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol](bucket[i][0])) {
      const value = bucket[i][1];
      if (remove) {
        bucket.splice(i, 1);
        self.bucketsSize--;
      }
      return some(value);
    }
  }
  return none$4();
};
const has = dual(2, (self, key) => isSome(get(self, key)));
const set = dual(3, (self, key, value) => {
  if (isEqual(key) === false) {
    self.referential.set(key, value);
    return self;
  }
  const hash = key[symbol$1]();
  const bucket = self.buckets.get(hash);
  if (bucket === undefined) {
    self.buckets.set(hash, [[key, value]]);
    self.bucketsSize++;
    return self;
  }
  removeFromBucket(self, bucket, key);
  bucket.push([key, value]);
  self.bucketsSize++;
  return self;
});
const removeFromBucket = (self, bucket, key) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol](bucket[i][0])) {
      bucket.splice(i, 1);
      self.bucketsSize--;
      return;
    }
  }
};
const MetricStateSymbolKey = "effect/MetricState";
const MetricStateTypeId = Symbol.for(MetricStateSymbolKey);
const CounterStateSymbolKey = "effect/MetricState/Counter";
const CounterStateTypeId = Symbol.for(CounterStateSymbolKey);
const FrequencyStateSymbolKey = "effect/MetricState/Frequency";
const FrequencyStateTypeId = Symbol.for(FrequencyStateSymbolKey);
const GaugeStateSymbolKey = "effect/MetricState/Gauge";
const GaugeStateTypeId = Symbol.for(GaugeStateSymbolKey);
const HistogramStateSymbolKey = "effect/MetricState/Histogram";
const HistogramStateTypeId = Symbol.for(HistogramStateSymbolKey);
const SummaryStateSymbolKey = "effect/MetricState/Summary";
const SummaryStateTypeId = Symbol.for(SummaryStateSymbolKey);
const metricStateVariance = { _A: (_) => _ };
class CounterState {
  count;
  [MetricStateTypeId] = metricStateVariance;
  [CounterStateTypeId] = CounterStateTypeId;
  constructor(count) {
    this.count = count;
  }
  [symbol$1]() {
    return pipe(
      hash(CounterStateSymbolKey),
      combine$5(hash(this.count)),
      cached(this)
    );
  }
  [symbol](that) {
    return isCounterState(that) && this.count === that.count;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const arrayEquals = getEquivalence$2(equals$1);
class FrequencyState {
  occurrences;
  [MetricStateTypeId] = metricStateVariance;
  [FrequencyStateTypeId] = FrequencyStateTypeId;
  constructor(occurrences) {
    this.occurrences = occurrences;
  }
  _hash;
  [symbol$1]() {
    return pipe(
      string(FrequencyStateSymbolKey),
      combine$5(array(fromIterable$6(this.occurrences.entries()))),
      cached(this)
    );
  }
  [symbol](that) {
    return (
      isFrequencyState(that) &&
      arrayEquals(
        fromIterable$6(this.occurrences.entries()),
        fromIterable$6(that.occurrences.entries())
      )
    );
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
class GaugeState {
  value;
  [MetricStateTypeId] = metricStateVariance;
  [GaugeStateTypeId] = GaugeStateTypeId;
  constructor(value) {
    this.value = value;
  }
  [symbol$1]() {
    return pipe(
      hash(GaugeStateSymbolKey),
      combine$5(hash(this.value)),
      cached(this)
    );
  }
  [symbol](u) {
    return isGaugeState(u) && this.value === u.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
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
    this.buckets = buckets;
    this.count = count;
    this.min = min;
    this.max = max;
    this.sum = sum;
  }
  [symbol$1]() {
    return pipe(
      hash(HistogramStateSymbolKey),
      combine$5(hash(this.buckets)),
      combine$5(hash(this.count)),
      combine$5(hash(this.min)),
      combine$5(hash(this.max)),
      combine$5(hash(this.sum)),
      cached(this)
    );
  }
  [symbol](that) {
    return (
      isHistogramState(that) &&
      equals$1(this.buckets, that.buckets) &&
      this.count === that.count &&
      this.min === that.min &&
      this.max === that.max &&
      this.sum === that.sum
    );
  }
  pipe() {
    return pipeArguments(this, arguments);
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
    this.error = error;
    this.quantiles = quantiles;
    this.count = count;
    this.min = min;
    this.max = max;
    this.sum = sum;
  }
  [symbol$1]() {
    return pipe(
      hash(SummaryStateSymbolKey),
      combine$5(hash(this.error)),
      combine$5(hash(this.quantiles)),
      combine$5(hash(this.count)),
      combine$5(hash(this.min)),
      combine$5(hash(this.max)),
      combine$5(hash(this.sum)),
      cached(this)
    );
  }
  [symbol](that) {
    return (
      isSummaryState(that) &&
      this.error === that.error &&
      equals$1(this.quantiles, that.quantiles) &&
      this.count === that.count &&
      this.min === that.min &&
      this.max === that.max &&
      this.sum === that.sum
    );
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const counter$2 = (count) => new CounterState(count);
const frequency$1 = (occurrences) => new FrequencyState(occurrences);
const gauge$1 = (count) => new GaugeState(count);
const histogram$2 = (options) =>
  new HistogramState(
    options.buckets,
    options.count,
    options.min,
    options.max,
    options.sum
  );
const summary$1 = (options) =>
  new SummaryState(
    options.error,
    options.quantiles,
    options.count,
    options.min,
    options.max,
    options.sum
  );
const isCounterState = (u) => hasProperty(u, CounterStateTypeId);
const isFrequencyState = (u) => hasProperty(u, FrequencyStateTypeId);
const isGaugeState = (u) => hasProperty(u, GaugeStateTypeId);
const isHistogramState = (u) => hasProperty(u, HistogramStateTypeId);
const isSummaryState = (u) => hasProperty(u, SummaryStateTypeId);
const MetricHookSymbolKey = "effect/MetricHook";
const MetricHookTypeId = Symbol.for(MetricHookSymbolKey);
const metricHookVariance = { _In: (_) => _, _Out: (_) => _ };
const make$6 = (options) => ({
  [MetricHookTypeId]: metricHookVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options,
});
const bigint0 = BigInt(0);
const counter$1 = (key) => {
  let sum = key.keyType.bigint ? bigint0 : 0;
  const canUpdate = key.keyType.incremental
    ? key.keyType.bigint
      ? (value) => value >= bigint0
      : (value) => value >= 0
    : (_value) => true;
  return make$6({
    get: () => counter$2(sum),
    update: (value) => {
      if (canUpdate(value)) {
        sum = sum + value;
      }
    },
  });
};
const frequency = (key) => {
  const values = new Map();
  for (const word of key.keyType.preregisteredWords) {
    values.set(word, 0);
  }
  const update = (word) => {
    const slotCount = values.get(word) ?? 0;
    values.set(word, slotCount + 1);
  };
  return make$6({ get: () => frequency$1(values), update: update });
};
const gauge = (_key, startAt) => {
  let value = startAt;
  return make$6({
    get: () => gauge$1(value),
    update: (v) => {
      value = v;
    },
  });
};
const histogram$1 = (key) => {
  const bounds = key.keyType.boundaries.values;
  const size = bounds.length;
  const values = new Uint32Array(size + 1);
  const boundaries = new Float32Array(size);
  let count = 0;
  let sum = 0;
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  pipe(
    bounds,
    sort(Order$1),
    map$5((n, i) => {
      boundaries[i] = n;
    })
  );
  const update = (value) => {
    let from = 0;
    let to = size;
    while (from !== to) {
      const mid = Math.floor(from + (to - from) / 2);
      const boundary = boundaries[mid];
      if (value <= boundary) {
        to = mid;
      } else {
        from = mid;
      }
      if (to === from + 1) {
        if (value <= boundaries[from]) {
          to = from;
        } else {
          from = to;
        }
      }
    }
    values[from] = values[from] + 1;
    count = count + 1;
    sum = sum + value;
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  };
  const getBuckets = () => {
    const builder = allocate(size);
    let cumulated = 0;
    for (let i = 0; i < size; i++) {
      const boundary = boundaries[i];
      const value = values[i];
      cumulated = cumulated + value;
      builder[i] = [boundary, cumulated];
    }
    return builder;
  };
  return make$6({
    get: () =>
      histogram$2({
        buckets: getBuckets(),
        count: count,
        min: min,
        max: max,
        sum: sum,
      }),
    update: update,
  });
};
const summary = (key) => {
  const {
    error: error,
    maxAge: maxAge,
    maxSize: maxSize,
    quantiles: quantiles,
  } = key.keyType;
  const sortedQuantiles = pipe(quantiles, sort(Order$1));
  const values = allocate(maxSize);
  let head = 0;
  let count = 0;
  let sum = 0;
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  const snapshot = (now) => {
    const builder = [];
    let i = 0;
    while (i !== maxSize - 1) {
      const item = values[i];
      if (item != null) {
        const [t, v] = item;
        const age = millis(now - t);
        if (greaterThanOrEqualTo(age, zero) && age <= maxAge) {
          builder.push(v);
        }
      }
      i = i + 1;
    }
    return calculateQuantiles(error, sortedQuantiles, sort(builder, Order$1));
  };
  const observe = (value, timestamp) => {
    if (maxSize > 0) {
      head = head + 1;
      const target = head % maxSize;
      values[target] = [timestamp, value];
    }
    count = count + 1;
    sum = sum + value;
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  };
  return make$6({
    get: () =>
      summary$1({
        error: error,
        quantiles: snapshot(Date.now()),
        count: count,
        min: min,
        max: max,
        sum: sum,
      }),
    update: ([value, timestamp]) => observe(value, timestamp),
  });
};
const calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
  const sampleCount = sortedSamples.length;
  if (!isNonEmptyReadonlyArray(sortedQuantiles)) {
    return empty$j();
  }
  const head = sortedQuantiles[0];
  const tail = sortedQuantiles.slice(1);
  const resolvedHead = resolveQuantile(
    error,
    sampleCount,
    none$4(),
    0,
    head,
    sortedSamples
  );
  const resolved = of$2(resolvedHead);
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
  });
  return map$5(resolved, (rq) => [rq.quantile, rq.value]);
};
const resolveQuantile = (
  error,
  sampleCount,
  current,
  consumed,
  quantile,
  rest
) => {
  let error_1 = error;
  let sampleCount_1 = sampleCount;
  let current_1 = current;
  let consumed_1 = consumed;
  let quantile_1 = quantile;
  let rest_1 = rest;
  let error_2 = error;
  let sampleCount_2 = sampleCount;
  let current_2 = current;
  let consumed_2 = consumed;
  let quantile_2 = quantile;
  let rest_2 = rest;
  while (1) {
    if (!isNonEmptyReadonlyArray(rest_1)) {
      return {
        quantile: quantile_1,
        value: none$4(),
        consumed: consumed_1,
        rest: [],
      };
    }
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: some(lastNonEmpty(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: [],
      };
    }
    const sameHead = span(rest_1, (n) => n <= rest_1[0]);
    const desired = quantile_1 * sampleCount_1;
    const allowedError = (error_1 / 2) * desired;
    const candConsumed = consumed_1 + sameHead[0].length;
    const candError = Math.abs(candConsumed - desired);
    if (candConsumed < desired - allowedError) {
      error_2 = error_1;
      sampleCount_2 = sampleCount_1;
      current_2 = head(rest_1);
      consumed_2 = candConsumed;
      quantile_2 = quantile_1;
      rest_2 = sameHead[1];
      error_1 = error_2;
      sampleCount_1 = sampleCount_2;
      current_1 = current_2;
      consumed_1 = consumed_2;
      quantile_1 = quantile_2;
      rest_1 = rest_2;
      continue;
    }
    if (candConsumed > desired + allowedError) {
      return {
        quantile: quantile_1,
        value: current_1,
        consumed: consumed_1,
        rest: rest_1,
      };
    }
    switch (current_1._tag) {
      case "None": {
        error_2 = error_1;
        sampleCount_2 = sampleCount_1;
        current_2 = head(rest_1);
        consumed_2 = candConsumed;
        quantile_2 = quantile_1;
        rest_2 = sameHead[1];
        error_1 = error_2;
        sampleCount_1 = sampleCount_2;
        current_1 = current_2;
        consumed_1 = consumed_2;
        quantile_1 = quantile_2;
        rest_1 = rest_2;
        continue;
      }
      case "Some": {
        const prevError = Math.abs(desired - current_1.value);
        if (candError < prevError) {
          error_2 = error_1;
          sampleCount_2 = sampleCount_1;
          current_2 = head(rest_1);
          consumed_2 = candConsumed;
          quantile_2 = quantile_1;
          rest_2 = sameHead[1];
          error_1 = error_2;
          sampleCount_1 = sampleCount_2;
          current_1 = current_2;
          consumed_1 = consumed_2;
          quantile_1 = quantile_2;
          rest_1 = rest_2;
          continue;
        }
        return {
          quantile: quantile_1,
          value: some(current_1.value),
          consumed: consumed_1,
          rest: rest_1,
        };
      }
    }
  }
  throw new Error(
    "BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues"
  );
};
const MetricPairSymbolKey = "effect/MetricPair";
const MetricPairTypeId = Symbol.for(MetricPairSymbolKey);
const metricPairVariance = { _Type: (_) => _ };
const unsafeMake = (metricKey, metricState) => ({
  [MetricPairTypeId]: metricPairVariance,
  metricKey: metricKey,
  metricState: metricState,
  pipe() {
    return pipeArguments(this, arguments);
  },
});
const MetricRegistrySymbolKey = "effect/MetricRegistry";
const MetricRegistryTypeId = Symbol.for(MetricRegistrySymbolKey);
class MetricRegistryImpl {
  [MetricRegistryTypeId] = MetricRegistryTypeId;
  map = empty$1();
  snapshot() {
    const result = [];
    for (const [key, hook] of this.map) {
      result.push(unsafeMake(key, hook.get()));
    }
    return result;
  }
  get(key) {
    const hook = pipe(this.map, get(key), getOrUndefined);
    if (hook == null) {
      if (isCounterKey(key.keyType)) {
        return this.getCounter(key);
      }
      if (isGaugeKey(key.keyType)) {
        return this.getGauge(key);
      }
      if (isFrequencyKey(key.keyType)) {
        return this.getFrequency(key);
      }
      if (isHistogramKey(key.keyType)) {
        return this.getHistogram(key);
      }
      if (isSummaryKey(key.keyType)) {
        return this.getSummary(key);
      }
      throw new Error(
        "BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues"
      );
    } else {
      return hook;
    }
  }
  getCounter(key) {
    let value = pipe(this.map, get(key), getOrUndefined);
    if (value == null) {
      const counter = counter$1(key);
      if (!pipe(this.map, has(key))) {
        pipe(this.map, set(key, counter));
      }
      value = counter;
    }
    return value;
  }
  getFrequency(key) {
    let value = pipe(this.map, get(key), getOrUndefined);
    if (value == null) {
      const frequency$1 = frequency(key);
      if (!pipe(this.map, has(key))) {
        pipe(this.map, set(key, frequency$1));
      }
      value = frequency$1;
    }
    return value;
  }
  getGauge(key) {
    let value = pipe(this.map, get(key), getOrUndefined);
    if (value == null) {
      const gauge$1 = gauge(key, key.keyType.bigint ? BigInt(0) : 0);
      if (!pipe(this.map, has(key))) {
        pipe(this.map, set(key, gauge$1));
      }
      value = gauge$1;
    }
    return value;
  }
  getHistogram(key) {
    let value = pipe(this.map, get(key), getOrUndefined);
    if (value == null) {
      const histogram = histogram$1(key);
      if (!pipe(this.map, has(key))) {
        pipe(this.map, set(key, histogram));
      }
      value = histogram;
    }
    return value;
  }
  getSummary(key) {
    let value = pipe(this.map, get(key), getOrUndefined);
    if (value == null) {
      const summary$1 = summary(key);
      if (!pipe(this.map, has(key))) {
        pipe(this.map, set(key, summary$1));
      }
      value = summary$1;
    }
    return value;
  }
}
const make$5 = () => new MetricRegistryImpl();
const MetricSymbolKey = "effect/Metric";
const MetricTypeId = Symbol.for(MetricSymbolKey);
const metricVariance = { _Type: (_) => _, _In: (_) => _, _Out: (_) => _ };
const globalMetricRegistry = globalValue(
  Symbol.for("effect/Metric/globalMetricRegistry"),
  () => make$5()
);
const make$4 = function (keyType, unsafeUpdate, unsafeValue) {
  const metric = Object.assign(
    (effect) => tap(effect, (a) => update(metric, a)),
    {
      [MetricTypeId]: metricVariance,
      keyType: keyType,
      unsafeUpdate: unsafeUpdate,
      unsafeValue: unsafeValue,
      register() {
        this.unsafeValue([]);
        return this;
      },
      pipe() {
        return pipeArguments(this, arguments);
      },
    }
  );
  return metric;
};
const counter = (name, options) => fromMetricKey(counter$3(name, options));
const fromMetricKey = (key) => {
  let untaggedHook;
  const hookCache = new WeakMap();
  const hook = (extraTags) => {
    if (extraTags.length === 0) {
      if (untaggedHook !== undefined) {
        return untaggedHook;
      }
      untaggedHook = globalMetricRegistry.get(key);
      return untaggedHook;
    }
    let hook = hookCache.get(extraTags);
    if (hook !== undefined) {
      return hook;
    }
    hook = globalMetricRegistry.get(taggedWithLabels$1(key, extraTags));
    hookCache.set(extraTags, hook);
    return hook;
  };
  return make$4(
    key.keyType,
    (input, extraTags) => hook(extraTags).update(input),
    (extraTags) => hook(extraTags).get()
  );
};
const histogram = (name, boundaries, description) =>
  fromMetricKey(histogram$3(name, boundaries, description));
const tagged = dual(3, (self, key, value) =>
  taggedWithLabels(self, [make$7(key, value)])
);
const taggedWithLabels = dual(2, (self, extraTags) =>
  make$4(
    self.keyType,
    (input, extraTags1) =>
      self.unsafeUpdate(input, union$2(extraTags, extraTags1)),
    (extraTags1) => self.unsafeValue(union$2(extraTags, extraTags1))
  )
);
const update = dual(2, (self, input) =>
  fiberRefGetWith(currentMetricLabels, (tags) =>
    sync(() => self.unsafeUpdate(input, tags))
  )
);
const RequestSymbolKey = "effect/Request";
const RequestTypeId = Symbol.for(RequestSymbolKey);
const requestVariance = { _E: (_) => _, _A: (_) => _ };
({ ...StructuralPrototype, [RequestTypeId]: requestVariance });
const complete = dual(2, (self, result) =>
  fiberRefGetWith(currentRequestMap, (map) =>
    sync(() => {
      if (map.has(self)) {
        const entry = map.get(self);
        if (!entry.state.completed) {
          entry.state.completed = true;
          deferredUnsafeDone(entry.result, result);
        }
      }
    })
  )
);
const SupervisorSymbolKey = "effect/Supervisor";
const SupervisorTypeId = Symbol.for(SupervisorSymbolKey);
const supervisorVariance = { _T: (_) => _ };
class ProxySupervisor {
  underlying;
  value0;
  [SupervisorTypeId] = supervisorVariance;
  constructor(underlying, value0) {
    this.underlying = underlying;
    this.value0 = value0;
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
    return new ProxySupervisor(this, pipe(this.value, map$2(f)));
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
    this.left = left;
    this.right = right;
  }
  get value() {
    return zip(this.left.value, this.right.value);
  }
  onStart(context, effect, parent, fiber) {
    this.left.onStart(context, effect, parent, fiber);
    this.right.onStart(context, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.left.onEnd(value, fiber);
    this.right.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.left.onEffect(fiber, effect);
    this.right.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.left.onSuspend(fiber);
    this.right.onSuspend(fiber);
  }
  onResume(fiber) {
    this.left.onResume(fiber);
    this.right.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map$2(f)));
  }
  zip(right) {
    return new Zip(this, right);
  }
}
const isZip = (self) =>
  hasProperty(self, SupervisorTypeId) && isTagged(self, "Zip");
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
    return new ProxySupervisor(this, pipe(this.value, map$2(f)));
  }
  zip(right) {
    return new Zip(this, right);
  }
  onRun(execution, _fiber) {
    return execution();
  }
}
const fromEffect = (effect) => new Const(effect);
const none = globalValue("effect/Supervisor/none", () => fromEffect(void_));
const make$3 = make$f;
const OP_EMPTY = "Empty";
const OP_ADD_SUPERVISOR = "AddSupervisor";
const OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
const OP_AND_THEN = "AndThen";
const empty = { _tag: OP_EMPTY };
const combine = (self, that) => ({
  _tag: OP_AND_THEN,
  first: self,
  second: that,
});
const patch = (self, supervisor) => patchLoop(supervisor, of$1(self));
const patchLoop = (_supervisor, _patches) => {
  let supervisor = _supervisor;
  let patches = _patches;
  while (isNonEmpty(patches)) {
    const head = headNonEmpty(patches);
    switch (head._tag) {
      case OP_EMPTY: {
        patches = tailNonEmpty(patches);
        break;
      }
      case OP_ADD_SUPERVISOR: {
        supervisor = supervisor.zip(head.supervisor);
        patches = tailNonEmpty(patches);
        break;
      }
      case OP_REMOVE_SUPERVISOR: {
        supervisor = removeSupervisor(supervisor, head.supervisor);
        patches = tailNonEmpty(patches);
        break;
      }
      case OP_AND_THEN: {
        patches = prepend$1(head.first)(
          prepend$1(head.second)(tailNonEmpty(patches))
        );
        break;
      }
    }
  }
  return supervisor;
};
const removeSupervisor = (self, that) => {
  if (equals$1(self, that)) {
    return none;
  } else {
    if (isZip(self)) {
      return removeSupervisor(self.left, that).zip(
        removeSupervisor(self.right, that)
      );
    } else {
      return self;
    }
  }
};
const toSet = (self) => {
  if (equals$1(self, none)) {
    return empty$f();
  } else {
    if (isZip(self)) {
      return pipe(toSet(self.left), union(toSet(self.right)));
    } else {
      return make$j(self);
    }
  }
};
const diff = (oldValue, newValue) => {
  if (equals$1(oldValue, newValue)) {
    return empty;
  }
  const oldSupervisors = toSet(oldValue);
  const newSupervisors = toSet(newValue);
  const added = pipe(
    newSupervisors,
    difference(oldSupervisors),
    reduce$3(empty, (patch, supervisor) =>
      combine(patch, { _tag: OP_ADD_SUPERVISOR, supervisor: supervisor })
    )
  );
  const removed = pipe(
    oldSupervisors,
    difference(newSupervisors),
    reduce$3(empty, (patch, supervisor) =>
      combine(patch, { _tag: OP_REMOVE_SUPERVISOR, supervisor: supervisor })
    )
  );
  return combine(added, removed);
};
const differ = make$3({
  empty: empty,
  patch: patch,
  combine: combine,
  diff: diff,
});
const fiberStarted = counter("effect_fiber_started", { incremental: true });
const fiberActive = counter("effect_fiber_active");
const fiberSuccesses = counter("effect_fiber_successes", { incremental: true });
const fiberFailures = counter("effect_fiber_failures", { incremental: true });
const fiberLifetimes = tagged(
  histogram(
    "effect_fiber_lifetimes",
    exponential({ start: 0.5, factor: 2, count: 35 })
  ),
  "time_unit",
  "milliseconds"
);
const EvaluationSignalContinue = "Continue";
const EvaluationSignalDone = "Done";
const EvaluationSignalYieldNow = "Yield";
const runtimeFiberVariance = { _E: (_) => _, _A: (_) => _ };
const absurd = (_) => {
  throw new Error(
    `BUG: FiberRuntime - ${toStringUnknown(
      _
    )} - please report an issue at https://github.com/Effect-TS/effect/issues`
  );
};
const YieldedOp = Symbol.for("effect/internal/fiberRuntime/YieldedOp");
const yieldedOpChannel = globalValue(
  "effect/internal/fiberRuntime/yieldedOpChannel",
  () => ({ currentOp: null })
);
const contOpSuccess = {
  [OP_ON_SUCCESS]: (_, cont, value) => cont.effect_instruction_i1(value),
  ["OnStep"]: (_, _cont, value) => exitSucceed(exitSucceed(value)),
  [OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) =>
    cont.effect_instruction_i2(value),
  [OP_REVERT_FLAGS]: (self, cont, value) => {
    self.patchRuntimeFlags(self._runtimeFlags, cont.patch);
    if (interruptible$1(self._runtimeFlags) && self.isInterrupted()) {
      return exitFailCause(self.getInterruptedCause());
    } else {
      return exitSucceed(value);
    }
  },
  [OP_WHILE]: (self, cont, value) => {
    cont.effect_instruction_i2(value);
    if (cont.effect_instruction_i0()) {
      self.pushStack(cont);
      return cont.effect_instruction_i1();
    } else {
      return void_;
    }
  },
};
const drainQueueWhileRunningTable = {
  [OP_INTERRUPT_SIGNAL]: (self, runtimeFlags, cur, message) => {
    self.processNewInterruptSignal(message.cause);
    return interruptible$1(runtimeFlags) ? exitFailCause(message.cause) : cur;
  },
  [OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
    throw new Error(
      "It is illegal to have multiple concurrent run loops in a single fiber"
    );
  },
  [OP_STATEFUL]: (self, runtimeFlags, cur, message) => {
    message.onFiber(self, running(runtimeFlags));
    return cur;
  },
  [OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) =>
    flatMap$2(yieldNow$1(), () => cur),
};
const runBlockedRequests = (self) =>
  forEachSequentialDiscard(flatten$2(self), (requestsByRequestResolver) =>
    forEachConcurrentDiscard(
      sequentialCollectionToChunk(requestsByRequestResolver),
      ([dataSource, sequential]) => {
        const map = new Map();
        const arr = [];
        for (const block of sequential) {
          arr.push(toReadonlyArray(block));
          for (const entry of block) {
            map.set(entry.request, entry);
          }
        }
        const flat = arr.flat();
        return fiberRefLocally(
          invokeWithInterrupt(dataSource.runAll(arr), flat, () =>
            flat.forEach((entry) => {
              entry.listeners.interrupted = true;
            })
          ),
          currentRequestMap,
          map
        );
      },
      false,
      false
    )
  );
class FiberRuntime {
  [FiberTypeId] = fiberVariance;
  [RuntimeFiberTypeId] = runtimeFiberVariance;
  pipe() {
    return pipeArguments(this, arguments);
  }
  _fiberRefs;
  _fiberId;
  _runtimeFlags;
  _queue = new Array();
  _children = null;
  _observers = new Array();
  _running = false;
  _stack = [];
  _asyncInterruptor = null;
  _asyncBlockingOn = null;
  _exitValue = null;
  _steps = [];
  _supervisor;
  _scheduler;
  _tracer;
  currentOpCount = 0;
  isYielding = false;
  constructor(fiberId, fiberRefs0, runtimeFlags0) {
    this._runtimeFlags = runtimeFlags0;
    this._fiberId = fiberId;
    this._fiberRefs = fiberRefs0;
    this._supervisor = this.getFiberRef(currentSupervisor);
    this._scheduler = this.getFiberRef(currentScheduler);
    if (runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(currentMetricLabels);
      fiberStarted.unsafeUpdate(1, tags);
      fiberActive.unsafeUpdate(1, tags);
    }
    this._tracer = get$4(this.getFiberRef(currentServices), tracerTag);
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
    return this.ask((state, status) => {
      if (isDone(status)) {
        return state._runtimeFlags;
      }
      return status.runtimeFlags;
    });
  }
  scope() {
    return unsafeMake$1(this);
  }
  get children() {
    return this.ask((fiber) => Array.from(fiber.getChildren()));
  }
  getChildren() {
    if (this._children === null) {
      this._children = new Set();
    }
    return this._children;
  }
  getInterruptedCause() {
    return this.getFiberRef(currentInterruptedCause);
  }
  fiberRefs() {
    return this.ask((fiber) => fiber.getFiberRefs());
  }
  ask(f) {
    return suspend$1(() => {
      const deferred = deferredUnsafeMake(this._fiberId);
      this.tell(
        stateful((fiber, status) => {
          deferredUnsafeDone(
            deferred,
            sync(() => f(fiber, status))
          );
        })
      );
      return deferredAwait(deferred);
    });
  }
  tell(message) {
    this._queue.push(message);
    if (!this._running) {
      this._running = true;
      this.drainQueueLaterOnExecutor();
    }
  }
  get await() {
    return async((resume) => {
      const cb = (exit) => resume(succeed$1(exit));
      this.tell(
        stateful((fiber, _) => {
          if (fiber._exitValue !== null) {
            cb(this._exitValue);
          } else {
            fiber.addObserver(cb);
          }
        })
      );
      return sync(() =>
        this.tell(
          stateful((fiber, _) => {
            fiber.removeObserver(cb);
          })
        )
      );
    }, this.id());
  }
  get inheritAll() {
    return withFiberRuntime((parentFiber, parentStatus) => {
      const parentFiberId = parentFiber.id();
      const parentFiberRefs = parentFiber.getFiberRefs();
      const parentRuntimeFlags = parentStatus.runtimeFlags;
      const childFiberRefs = this.getFiberRefs();
      const updatedFiberRefs = joinAs(
        parentFiberRefs,
        parentFiberId,
        childFiberRefs
      );
      parentFiber.setFiberRefs(updatedFiberRefs);
      const updatedRuntimeFlags = parentFiber.getFiberRef(currentRuntimeFlags);
      const patch = pipe(
        diff$3(parentRuntimeFlags, updatedRuntimeFlags),
        exclude(Interruption),
        exclude(WindDown)
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
    if (this._exitValue !== null) {
      observer(this._exitValue);
    } else {
      this._observers.push(observer);
    }
  }
  removeObserver(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }
  getFiberRefs() {
    this.setFiberRef(currentRuntimeFlags, this._runtimeFlags);
    return this._fiberRefs;
  }
  unsafeDeleteFiberRef(fiberRef) {
    this._fiberRefs = delete_(this._fiberRefs, fiberRef);
  }
  getFiberRef(fiberRef) {
    if (this._fiberRefs.locals.has(fiberRef)) {
      return this._fiberRefs.locals.get(fiberRef)[0][1];
    }
    return fiberRef.initial;
  }
  setFiberRef(fiberRef, value) {
    this._fiberRefs = updateAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef: fiberRef,
      value: value,
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this._tracer = get$4(this.getFiberRef(currentServices), tracerTag);
    this._supervisor = this.getFiberRef(currentSupervisor);
    this._scheduler = this.getFiberRef(currentScheduler);
  }
  setFiberRefs(fiberRefs) {
    this._fiberRefs = fiberRefs;
    this.refreshRefCache();
  }
  addChild(child) {
    this.getChildren().add(child);
  }
  removeChild(child) {
    this.getChildren().delete(child);
  }
  drainQueueOnCurrentThread() {
    let recurse = true;
    while (recurse) {
      let evaluationSignal = EvaluationSignalContinue;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        while (evaluationSignal === EvaluationSignalContinue) {
          evaluationSignal =
            this._queue.length === 0
              ? EvaluationSignalDone
              : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
        }
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
      }
      if (this._queue.length > 0 && !this._running) {
        this._running = true;
        if (evaluationSignal === EvaluationSignalYieldNow) {
          this.drainQueueLaterOnExecutor();
          recurse = false;
        } else {
          recurse = true;
        }
      } else {
        recurse = false;
      }
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
    while (this._queue.length > 0) {
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
    return !isEmpty$1(this.getFiberRef(currentInterruptedCause));
  }
  addInterruptedCause(cause) {
    const oldSC = this.getFiberRef(currentInterruptedCause);
    this.setFiberRef(currentInterruptedCause, sequential$2(oldSC, cause));
  }
  processNewInterruptSignal(cause) {
    this.addInterruptedCause(cause);
    this.sendInterruptSignalToAllChildren();
  }
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0) {
      return false;
    }
    let told = false;
    for (const child of this._children) {
      child.tell(interruptSignal(interrupt(this.id())));
      told = true;
    }
    return told;
  }
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const it = this._children.values();
      this._children = null;
      let isDone = false;
      const body = () => {
        const next = it.next();
        if (!next.done) {
          return asVoid(next.value.await);
        } else {
          return sync(() => {
            isDone = true;
          });
        }
      };
      return whileLoop({ while: () => !isDone, body: body, step: () => {} });
    }
    return null;
  }
  reportExitValue(exit) {
    if (runtimeMetrics(this._runtimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = Date.now();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
      fiberActive.unsafeUpdate(-1, tags);
      switch (exit._tag) {
        case OP_SUCCESS: {
          fiberSuccesses.unsafeUpdate(1, tags);
          break;
        }
        case OP_FAILURE: {
          fiberFailures.unsafeUpdate(1, tags);
          break;
        }
      }
    }
    if (exit._tag === "Failure") {
      const level = this.getFiberRef(currentUnhandledErrorLogLevel);
      if (!isInterruptedOnly(exit.cause) && level._tag === "Some") {
        this.log("Fiber terminated with an unhandled error", exit.cause, level);
      }
    }
  }
  setExitValue(exit) {
    this._exitValue = exit;
    this.reportExitValue(exit);
    for (let i = this._observers.length - 1; i >= 0; i--) {
      this._observers[i](exit);
    }
  }
  getLoggers() {
    return this.getFiberRef(currentLoggers);
  }
  log(message, cause, overrideLogLevel) {
    const logLevel = isSome(overrideLogLevel)
      ? overrideLogLevel.value
      : this.getFiberRef(currentLogLevel);
    const minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
    if (greaterThan(minimumLogLevel, logLevel)) {
      return;
    }
    const spans = this.getFiberRef(currentLogSpan);
    const annotations = this.getFiberRef(currentLogAnnotations);
    const loggers = this.getLoggers();
    const contextMap = this.getFiberRefs();
    if (size$1(loggers) > 0) {
      const clockService = get$4(this.getFiberRef(currentServices), clockTag);
      const date = new Date(clockService.unsafeCurrentTimeMillis());
      for (const logger of loggers) {
        logger.log({
          fiberId: this.id(),
          logLevel: logLevel,
          message: message,
          cause: cause,
          context: contextMap,
          spans: spans,
          annotations: annotations,
          date: date,
        });
      }
    }
  }
  evaluateMessageWhileSuspended(message) {
    switch (message._tag) {
      case OP_YIELD_NOW: {
        return EvaluationSignalYieldNow;
      }
      case OP_INTERRUPT_SIGNAL: {
        this.processNewInterruptSignal(message.cause);
        if (this._asyncInterruptor !== null) {
          this._asyncInterruptor(exitFailCause(message.cause));
          this._asyncInterruptor = null;
        }
        return EvaluationSignalContinue;
      }
      case OP_RESUME: {
        this._asyncInterruptor = null;
        this._asyncBlockingOn = null;
        this.evaluateEffect(message.effect);
        return EvaluationSignalContinue;
      }
      case OP_STATEFUL: {
        message.onFiber(
          this,
          this._exitValue !== null
            ? done
            : suspended(this._runtimeFlags, this._asyncBlockingOn)
        );
        return EvaluationSignalContinue;
      }
      default: {
        return absurd(message);
      }
    }
  }
  evaluateEffect(effect0) {
    this._supervisor.onResume(this);
    try {
      let effect =
        interruptible$1(this._runtimeFlags) && this.isInterrupted()
          ? exitFailCause(this.getInterruptedCause())
          : effect0;
      while (effect !== null) {
        const eff = effect;
        const exit = this.runLoop(eff);
        if (exit === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          yieldedOpChannel.currentOp = null;
          if (op._op === OP_YIELD) {
            if (cooperativeYielding(this._runtimeFlags)) {
              this.tell(yieldNow());
              this.tell(resume(exitVoid));
              effect = null;
            } else {
              effect = exitVoid;
            }
          } else if (op._op === OP_ASYNC) {
            effect = null;
          }
        } else {
          this._runtimeFlags = pipe(this._runtimeFlags, enable$1(WindDown));
          const interruption = this.interruptAllChildren();
          if (interruption !== null) {
            effect = flatMap$2(interruption, () => exit);
          } else {
            if (this._queue.length === 0) {
              this.setExitValue(exit);
            } else {
              this.tell(resume(exit));
            }
            effect = null;
          }
        }
      }
    } finally {
      this._supervisor.onSuspend(this);
    }
  }
  start(effect) {
    if (!this._running) {
      this._running = true;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        this.evaluateEffect(effect);
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
        if (this._queue.length > 0) {
          this.drainQueueLaterOnExecutor();
        }
      }
    } else {
      this.tell(resume(effect));
    }
  }
  startFork(effect) {
    this.tell(resume(effect));
  }
  patchRuntimeFlags(oldRuntimeFlags, patch) {
    const newRuntimeFlags = patch$4(oldRuntimeFlags, patch);
    globalThis[currentFiberURI] = this;
    this._runtimeFlags = newRuntimeFlags;
    return newRuntimeFlags;
  }
  initiateAsync(runtimeFlags, asyncRegister) {
    let alreadyCalled = false;
    const callback = (effect) => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        this.tell(resume(effect));
      }
    };
    if (interruptible$1(runtimeFlags)) {
      this._asyncInterruptor = callback;
    }
    try {
      asyncRegister(callback);
    } catch (e) {
      callback(failCause(die(e)));
    }
  }
  pushStack(cont) {
    this._stack.push(cont);
    if (cont._op === "OnStep") {
      this._steps.push({
        refs: this.getFiberRefs(),
        flags: this._runtimeFlags,
      });
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep") {
        this._steps.pop();
      }
      return item;
    }
    return;
  }
  getNextSuccessCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_FAILURE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  getNextFailCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_SUCCESS && frame._op !== OP_WHILE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  [OP_TAG](op) {
    return map$2(fiberRefGet(currentContext), (context) =>
      unsafeGet(context, op)
    );
  }
  ["Left"](op) {
    return fail(op.left);
  }
  ["None"](_) {
    return fail(new NoSuchElementException());
  }
  ["Right"](op) {
    return exitSucceed(op.right);
  }
  ["Some"](op) {
    return exitSucceed(op.value);
  }
  [OP_SYNC](op) {
    const value = op.effect_instruction_i0();
    const cont = this.getNextSuccessCont();
    if (cont !== undefined) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, value);
    } else {
      yieldedOpChannel.currentOp = exitSucceed(value);
      return YieldedOp;
    }
  }
  [OP_SUCCESS](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== undefined) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, oldCur.effect_instruction_i0);
    } else {
      yieldedOpChannel.currentOp = oldCur;
      return YieldedOp;
    }
  }
  [OP_FAILURE](op) {
    const cause = op.effect_instruction_i0;
    const cont = this.getNextFailCont();
    if (cont !== undefined) {
      switch (cont._op) {
        case OP_ON_FAILURE:
        case OP_ON_SUCCESS_AND_FAILURE: {
          if (!(interruptible$1(this._runtimeFlags) && this.isInterrupted())) {
            return cont.effect_instruction_i1(cause);
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case "OnStep": {
          if (!(interruptible$1(this._runtimeFlags) && this.isInterrupted())) {
            return exitSucceed(exitFailCause(cause));
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case OP_REVERT_FLAGS: {
          this.patchRuntimeFlags(this._runtimeFlags, cont.patch);
          if (interruptible$1(this._runtimeFlags) && this.isInterrupted()) {
            return exitFailCause(
              sequential$2(cause, this.getInterruptedCause())
            );
          } else {
            return exitFailCause(cause);
          }
        }
        default: {
          absurd(cont);
        }
      }
    } else {
      yieldedOpChannel.currentOp = exitFailCause(cause);
      return YieldedOp;
    }
  }
  [OP_WITH_RUNTIME](op) {
    return op.effect_instruction_i0(this, running(this._runtimeFlags));
  }
  ["Blocked"](op) {
    const refs = this.getFiberRefs();
    const flags = this._runtimeFlags;
    if (this._steps.length > 0) {
      const frames = [];
      const snap = this._steps[this._steps.length - 1];
      let frame = this.popStack();
      while (frame && frame._op !== "OnStep") {
        frames.push(frame);
        frame = this.popStack();
      }
      this.setFiberRefs(snap.refs);
      this._runtimeFlags = snap.flags;
      const patchRefs = diff$1(snap.refs, refs);
      const patchFlags = diff$3(snap.flags, flags);
      return exitSucceed(
        blocked(
          op.effect_instruction_i0,
          withFiberRuntime((newFiber) => {
            while (frames.length > 0) {
              newFiber.pushStack(frames.pop());
            }
            newFiber.setFiberRefs(
              patch$1(newFiber.id(), newFiber.getFiberRefs())(patchRefs)
            );
            newFiber._runtimeFlags = patch$4(patchFlags)(
              newFiber._runtimeFlags
            );
            return op.effect_instruction_i1;
          })
        )
      );
    }
    return uninterruptibleMask((restore) =>
      flatMap$2(forkDaemon(runRequestBlock(op.effect_instruction_i0)), () =>
        restore(op.effect_instruction_i1)
      )
    );
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.effect_instruction_i0);
  }
  [OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.effect_instruction_i0;
    const oldRuntimeFlags = this._runtimeFlags;
    const newRuntimeFlags = patch$4(oldRuntimeFlags, updateFlags);
    if (interruptible$1(newRuntimeFlags) && this.isInterrupted()) {
      return exitFailCause(this.getInterruptedCause());
    } else {
      this.patchRuntimeFlags(this._runtimeFlags, updateFlags);
      if (op.effect_instruction_i1) {
        const revertFlags = diff$3(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new RevertFlags(revertFlags, op));
        return op.effect_instruction_i1(oldRuntimeFlags);
      } else {
        return exitVoid;
      }
    }
  }
  [OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ASYNC](op) {
    this._asyncBlockingOn = op.effect_instruction_i1;
    this.initiateAsync(this._runtimeFlags, op.effect_instruction_i0);
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_YIELD](op) {
    this.isYielding = false;
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_WHILE](op) {
    const check = op.effect_instruction_i0;
    const body = op.effect_instruction_i1;
    if (check()) {
      this.pushStack(op);
      return body();
    } else {
      return exitVoid;
    }
  }
  [OP_COMMIT](op) {
    return op.commit();
  }
  runLoop(effect0) {
    let cur = effect0;
    this.currentOpCount = 0;
    while (true) {
      if ((this._runtimeFlags & OpSupervision) !== 0) {
        this._supervisor.onEffect(this, cur);
      }
      if (this._queue.length > 0) {
        cur = this.drainQueueWhileRunning(this._runtimeFlags, cur);
      }
      if (!this.isYielding) {
        this.currentOpCount += 1;
        const shouldYield = this._scheduler.shouldYield(this);
        if (shouldYield !== false) {
          this.isYielding = true;
          this.currentOpCount = 0;
          const oldCur = cur;
          cur = flatMap$2(yieldNow$1({ priority: shouldYield }), () => oldCur);
        }
      }
      try {
        if (!("_op" in cur) || !(cur._op in this)) {
          absurd(cur);
        }
        cur = this._tracer.context(() => {
          if (getCurrentVersion() !== cur[EffectTypeId]._V) {
            return dieMessage(
              `Cannot execute an Effect versioned ${
                cur[EffectTypeId]._V
              } with a Runtime of version ${getCurrentVersion()}`
            );
          }
          return this[cur._op](cur);
        }, this);
        if (cur === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          if (op._op === OP_YIELD || op._op === OP_ASYNC) {
            return YieldedOp;
          }
          yieldedOpChannel.currentOp = null;
          return op._op === OP_SUCCESS || op._op === OP_FAILURE
            ? op
            : exitFailCause(die(op));
        }
      } catch (e) {
        if (isEffectError(e)) {
          cur = exitFailCause(e.cause);
        } else if (isInterruptedException(e)) {
          cur = exitFailCause(sequential$2(die(e), interrupt(none$2)));
        } else {
          cur = exitFailCause(die(e));
        }
      }
    }
  }
  run = () => {
    this.drainQueueOnCurrentThread();
  };
}
const currentMinimumLogLevel = globalValue(
  "effect/FiberRef/currentMinimumLogLevel",
  () => fiberRefUnsafeMake(fromLiteral("Info"))
);
const loggerWithConsoleLog = (self) =>
  makeLogger((opts) => {
    const services = getOrDefault(opts.context, currentServices);
    get$4(services, consoleTag).unsafe.log(self.log(opts));
  });
const defaultLogger = globalValue(
  Symbol.for("effect/Logger/defaultLogger"),
  () => loggerWithConsoleLog(stringLogger)
);
const tracerLogger = globalValue(Symbol.for("effect/Logger/tracerLogger"), () =>
  makeLogger(
    ({
      annotations: annotations,
      cause: cause,
      context: context,
      fiberId: fiberId,
      logLevel: logLevel,
      message: message,
    }) => {
      const span = flatMap$4(
        get$1(context, currentContext),
        getOption(spanTag)
      );
      const clockService = map$6(get$1(context, currentServices), (_) =>
        get$4(_, clockTag)
      );
      if (
        span._tag === "None" ||
        span.value._tag === "ExternalSpan" ||
        clockService._tag === "None"
      ) {
        return;
      }
      const attributes = Object.fromEntries(
        map$3(annotations, toStringUnknown)
      );
      attributes["effect.fiberId"] = threadName(fiberId);
      attributes["effect.logLevel"] = logLevel.label;
      if (cause !== null && cause._tag !== "Empty") {
        attributes["effect.cause"] = pretty(cause);
      }
      span.value.event(
        String(message),
        clockService.value.unsafeCurrentTimeNanos(),
        attributes
      );
    }
  )
);
const currentLoggers = globalValue(
  Symbol.for("effect/FiberRef/currentLoggers"),
  () => fiberRefUnsafeMakeHashSet(make$j(defaultLogger, tracerLogger))
);
const forEach$1 = dual(
  (args) => isIterable(args[0]),
  (self, f, options) =>
    withFiberRuntime((r) => {
      const isRequestBatchingEnabled =
        options?.batching === true ||
        (options?.batching === "inherit" &&
          r.getFiberRef(currentRequestBatching));
      if (options?.discard) {
        return match(
          options.concurrency,
          () =>
            finalizersMask(sequential)((restore) =>
              isRequestBatchingEnabled
                ? forEachConcurrentDiscard(
                    self,
                    (a, i) => restore(f(a, i)),
                    true,
                    false,
                    1
                  )
                : forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))
            ),
          () =>
            finalizersMask(parallel)((restore) =>
              forEachConcurrentDiscard(
                self,
                (a, i) => restore(f(a, i)),
                isRequestBatchingEnabled,
                false
              )
            ),
          (n) =>
            finalizersMask(parallelN(n))((restore) =>
              forEachConcurrentDiscard(
                self,
                (a, i) => restore(f(a, i)),
                isRequestBatchingEnabled,
                false,
                n
              )
            )
        );
      }
      return match(
        options?.concurrency,
        () =>
          finalizersMask(sequential)((restore) =>
            isRequestBatchingEnabled
              ? forEachParN(self, 1, (a, i) => restore(f(a, i)), true)
              : forEachSequential(self, (a, i) => restore(f(a, i)))
          ),
        () =>
          finalizersMask(parallel)((restore) =>
            forEachParUnbounded(
              self,
              (a, i) => restore(f(a, i)),
              isRequestBatchingEnabled
            )
          ),
        (n) =>
          finalizersMask(parallelN(n))((restore) =>
            forEachParN(
              self,
              n,
              (a, i) => restore(f(a, i)),
              isRequestBatchingEnabled
            )
          )
      );
    })
);
const forEachParUnbounded = (self, f, batching) =>
  suspend$1(() => {
    const as = fromIterable$6(self);
    const array = new Array(as.length);
    const fn = (a, i) => flatMap$2(f(a, i), (b) => sync(() => (array[i] = b)));
    return zipRight(
      forEachConcurrentDiscard(as, fn, batching, false),
      succeed$1(array)
    );
  });
const forEachConcurrentDiscard = (self, f, batching, processAll, n) =>
  uninterruptibleMask((restore) =>
    transplant((graft) =>
      withFiberRuntime((parent) => {
        let todos = Array.from(self).reverse();
        let target = todos.length;
        if (target === 0) {
          return void_;
        }
        let counter = 0;
        let interrupted = false;
        const fibersCount = n ? Math.min(todos.length, n) : todos.length;
        const fibers = new Set();
        const results = new Array();
        const interruptAll = () =>
          fibers.forEach((fiber) => {
            fiber._scheduler.scheduleTask(() => {
              fiber.unsafeInterruptAsFork(parent.id());
            }, 0);
          });
        const startOrder = new Array();
        const joinOrder = new Array();
        const residual = new Array();
        const collectExits = () => {
          const exits = results
            .filter(({ exit: exit }) => exit._tag === "Failure")
            .sort((a, b) =>
              a.index < b.index ? -1 : a.index === b.index ? 0 : 1
            )
            .map(({ exit: exit }) => exit);
          if (exits.length === 0) {
            exits.push(exitVoid);
          }
          return exits;
        };
        const runFiber = (eff, interruptImmediately = false) => {
          const runnable = uninterruptible(graft(eff));
          const fiber = unsafeForkUnstarted(
            runnable,
            parent,
            parent._runtimeFlags,
            globalScope
          );
          parent._scheduler.scheduleTask(() => {
            if (interruptImmediately) {
              fiber.unsafeInterruptAsFork(parent.id());
            }
            fiber.resume(runnable);
          }, 0);
          return fiber;
        };
        const onInterruptSignal = () => {
          if (!processAll) {
            target -= todos.length;
            todos = [];
          }
          interrupted = true;
          interruptAll();
        };
        const stepOrExit = batching ? step : exit;
        const processingFiber = runFiber(
          async((resume) => {
            const pushResult = (res, index) => {
              if (res._op === "Blocked") {
                residual.push(res);
              } else {
                results.push({ index: index, exit: res });
                if (res._op === "Failure" && !interrupted) {
                  onInterruptSignal();
                }
              }
            };
            const next = () => {
              if (todos.length > 0) {
                const a = todos.pop();
                let index = counter++;
                const returnNextElement = () => {
                  const a = todos.pop();
                  index = counter++;
                  return flatMap$2(yieldNow$1(), () =>
                    flatMap$2(stepOrExit(restore(f(a, index))), onRes)
                  );
                };
                const onRes = (res) => {
                  if (todos.length > 0) {
                    pushResult(res, index);
                    if (todos.length > 0) {
                      return returnNextElement();
                    }
                  }
                  return succeed$1(res);
                };
                const todo = flatMap$2(stepOrExit(restore(f(a, index))), onRes);
                const fiber = runFiber(todo);
                startOrder.push(fiber);
                fibers.add(fiber);
                if (interrupted) {
                  fiber._scheduler.scheduleTask(() => {
                    fiber.unsafeInterruptAsFork(parent.id());
                  }, 0);
                }
                fiber.addObserver((wrapped) => {
                  let exit;
                  if (wrapped._op === "Failure") {
                    exit = wrapped;
                  } else {
                    exit = wrapped.effect_instruction_i0;
                  }
                  joinOrder.push(fiber);
                  fibers.delete(fiber);
                  pushResult(exit, index);
                  if (results.length === target) {
                    resume(
                      succeed$1(
                        getOrElse(
                          exitCollectAll(collectExits(), { parallel: true }),
                          () => exitVoid
                        )
                      )
                    );
                  } else if (residual.length + results.length === target) {
                    const requests = residual
                      .map((blocked) => blocked.effect_instruction_i0)
                      .reduce(par);
                    resume(
                      succeed$1(
                        blocked(
                          requests,
                          forEachConcurrentDiscard(
                            [
                              getOrElse(
                                exitCollectAll(collectExits(), {
                                  parallel: true,
                                }),
                                () => exitVoid
                              ),
                              ...residual.map(
                                (blocked) => blocked.effect_instruction_i1
                              ),
                            ],
                            (i) => i,
                            batching,
                            true,
                            n
                          )
                        )
                      )
                    );
                  } else {
                    next();
                  }
                });
              }
            };
            for (let i = 0; i < fibersCount; i++) {
              next();
            }
          })
        );
        return asVoid(
          onExit(
            flatten$1(restore(join(processingFiber))),
            exitMatch({
              onFailure: () => {
                onInterruptSignal();
                const target = residual.length + 1;
                const concurrency = Math.min(
                  typeof n === "number" ? n : residual.length,
                  residual.length
                );
                const toPop = Array.from(residual);
                return async((cb) => {
                  const exits = [];
                  let count = 0;
                  let index = 0;
                  const check = (index, hitNext) => (exit) => {
                    exits[index] = exit;
                    count++;
                    if (count === target) {
                      cb(getOrThrow(exitCollectAll(exits, { parallel: true })));
                    }
                    if (toPop.length > 0 && hitNext) {
                      next();
                    }
                  };
                  const next = () => {
                    runFiber(toPop.pop(), true).addObserver(check(index, true));
                    index++;
                  };
                  processingFiber.addObserver(check(index, false));
                  index++;
                  for (let i = 0; i < concurrency; i++) {
                    next();
                  }
                });
              },
              onSuccess: () =>
                forEachSequential(joinOrder, (f) => f.inheritAll),
            })
          )
        );
      })
    )
  );
const forEachParN = (self, n, f, batching) =>
  suspend$1(() => {
    const as = fromIterable$6(self);
    const array = new Array(as.length);
    const fn = (a, i) => map$2(f(a, i), (b) => (array[i] = b));
    return zipRight(
      forEachConcurrentDiscard(as, fn, batching, false, n),
      succeed$1(array)
    );
  });
const forkDaemon = (self) => forkWithScopeOverride(self, globalScope);
const unsafeFork$1 = (
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
  childFiber.resume(effect);
  return childFiber;
};
const unsafeForkUnstarted = (
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
  return childFiber;
};
const unsafeMakeChildFiber = (
  effect,
  parentFiber,
  parentRuntimeFlags,
  overrideScope = null
) => {
  const childId = unsafeMake$3();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(
    childId,
    childFiberRefs,
    parentRuntimeFlags
  );
  const childContext = getOrDefault$1(childFiberRefs, currentContext);
  const supervisor = childFiber._supervisor;
  supervisor.onStart(childContext, effect, some(parentFiber), childFiber);
  childFiber.addObserver((exit) => supervisor.onEnd(exit, childFiber));
  const parentScope =
    overrideScope !== null
      ? overrideScope
      : pipe(
          parentFiber.getFiberRef(currentForkScopeOverride),
          getOrElse(() => parentFiber.scope())
        );
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
};
const forkWithScopeOverride = (self, scopeOverride) =>
  withFiberRuntime((parentFiber, parentStatus) =>
    succeed$1(
      unsafeFork$1(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)
    )
  );
const parallelFinalizers = (self) =>
  contextWithEffect((context) =>
    match$2(getOption(context, scopeTag), {
      onNone: () => self,
      onSome: (scope) => {
        switch (scope.strategy._tag) {
          case "Parallel":
            return self;
          case "Sequential":
          case "ParallelN":
            return flatMap$2(scopeFork(scope, parallel), (inner) =>
              scopeExtend(self, inner)
            );
        }
      },
    })
  );
const parallelNFinalizers = (parallelism) => (self) =>
  contextWithEffect((context) =>
    match$2(getOption(context, scopeTag), {
      onNone: () => self,
      onSome: (scope) => {
        if (
          scope.strategy._tag === "ParallelN" &&
          scope.strategy.parallelism === parallelism
        ) {
          return self;
        }
        return flatMap$2(scopeFork(scope, parallelN(parallelism)), (inner) =>
          scopeExtend(self, inner)
        );
      },
    })
  );
const finalizersMask = (strategy) => (self) =>
  contextWithEffect((context) =>
    match$2(getOption(context, scopeTag), {
      onNone: () => self(identity),
      onSome: (scope) => {
        const patch =
          strategy._tag === "Parallel"
            ? parallelFinalizers
            : strategy._tag === "Sequential"
            ? sequentialFinalizers
            : parallelNFinalizers(strategy.parallelism);
        switch (scope.strategy._tag) {
          case "Parallel":
            return patch(self(parallelFinalizers));
          case "Sequential":
            return patch(self(sequentialFinalizers));
          case "ParallelN":
            return patch(self(parallelNFinalizers(scope.strategy.parallelism)));
        }
      },
    })
  );
const sequentialFinalizers = (self) =>
  contextWithEffect((context) =>
    match$2(getOption(context, scopeTag), {
      onNone: () => self,
      onSome: (scope) => {
        switch (scope.strategy._tag) {
          case "Sequential":
            return self;
          case "Parallel":
          case "ParallelN":
            return flatMap$2(scopeFork(scope, sequential), (inner) =>
              scopeExtend(self, inner)
            );
        }
      },
    })
  );
const scopeTag = GenericTag("effect/Scope");
const scopeExtend = dual(2, (effect, scope) =>
  mapInputContext(effect, merge$1(make$h(scopeTag, scope)))
);
const fiberRefUnsafeMakeSupervisor = (initial) =>
  fiberRefUnsafeMakePatch(initial, { differ: differ, fork: empty });
const currentRuntimeFlags = fiberRefUnsafeMakeRuntimeFlags(none$1);
const currentSupervisor = fiberRefUnsafeMakeSupervisor(none);
const invokeWithInterrupt = (self, entries, onInterrupt) =>
  fiberIdWith((id) =>
    flatMap$2(
      flatMap$2(forkDaemon(interruptible(self)), (processing) =>
        async((cb) => {
          const counts = entries.map((_) => _.listeners.count);
          const checkDone = () => {
            if (counts.every((count) => count === 0)) {
              if (
                entries.every((_) => {
                  if (_.result.state.current._tag === "Pending") {
                    return true;
                  } else if (
                    _.result.state.current._tag === "Done" &&
                    exitIsExit(_.result.state.current.effect) &&
                    _.result.state.current.effect._tag === "Failure" &&
                    isInterrupted(_.result.state.current.effect.cause)
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                })
              ) {
                cleanup.forEach((f) => f());
                onInterrupt?.();
                cb(interruptFiber(processing));
              }
            }
          };
          processing.addObserver((exit) => {
            cleanup.forEach((f) => f());
            cb(exit);
          });
          const cleanup = entries.map((r, i) => {
            const observer = (count) => {
              counts[i] = count;
              checkDone();
            };
            r.listeners.addObserver(observer);
            return () => r.listeners.removeObserver(observer);
          });
          checkDone();
          return sync(() => {
            cleanup.forEach((f) => f());
          });
        })
      ),
      () =>
        suspend$1(() => {
          const residual = entries.flatMap((entry) => {
            if (!entry.state.completed) {
              return [entry];
            }
            return [];
          });
          return forEachSequentialDiscard(residual, (entry) =>
            complete(entry.request, exitInterrupt(id))
          );
        })
    )
  );
const close = scopeClose;
const fork = scopeFork;
const unsafeFork = (runtime) => (self, options) => {
  const fiberId = unsafeMake$3();
  const fiberRefUpdates = [[currentContext, [[fiberId, runtime.context]]]];
  if (options?.scheduler) {
    fiberRefUpdates.push([currentScheduler, [[fiberId, options.scheduler]]]);
  }
  let fiberRefs = updateManyAs(runtime.fiberRefs, {
    entries: fiberRefUpdates,
    forkAs: fiberId,
  });
  if (options?.updateRefs) {
    fiberRefs = options.updateRefs(fiberRefs, fiberId);
  }
  const fiberRuntime = new FiberRuntime(
    fiberId,
    fiberRefs,
    runtime.runtimeFlags
  );
  let effect = self;
  if (options?.scope) {
    effect = flatMap$2(fork(options.scope, sequential$1), (closeableScope) =>
      zipRight(
        scopeAddFinalizer(
          closeableScope,
          fiberIdWith((id) =>
            equals$1(id, fiberRuntime.id())
              ? void_
              : interruptAsFiber(fiberRuntime, id)
          )
        ),
        onExit(self, (exit) => close(closeableScope, exit))
      )
    );
  }
  const supervisor = fiberRuntime._supervisor;
  if (supervisor !== none) {
    supervisor.onStart(runtime.context, effect, none$4(), fiberRuntime);
    fiberRuntime.addObserver((exit) => supervisor.onEnd(exit, fiberRuntime));
  }
  globalScope.add(runtime.runtimeFlags, fiberRuntime);
  if (options?.immediate === false) {
    fiberRuntime.resume(effect);
  } else {
    fiberRuntime.start(effect);
  }
  return fiberRuntime;
};
const unsafeRunSync = (runtime) => (effect) => {
  const result = unsafeRunSyncExit(runtime)(effect);
  if (result._tag === "Failure") {
    throw fiberFailure(result.effect_instruction_i0);
  } else {
    return result.effect_instruction_i0;
  }
};
class AsyncFiberExceptionImpl extends Error {
  fiber;
  _tag = "AsyncFiberException";
  constructor(fiber) {
    super(
      `Fiber #${
        fiber.id().id
      } cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`
    );
    this.fiber = fiber;
    this.name = this._tag;
    this.stack = this.message;
  }
}
const asyncFiberException = (fiber) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new AsyncFiberExceptionImpl(fiber);
  Error.stackTraceLimit = limit;
  return error;
};
const FiberFailureId = Symbol.for("effect/Runtime/FiberFailure");
const FiberFailureCauseId = Symbol.for("effect/Runtime/FiberFailure/Cause");
class FiberFailureImpl extends Error {
  [FiberFailureId];
  [FiberFailureCauseId];
  constructor(cause) {
    super();
    this[FiberFailureId] = FiberFailureId;
    this[FiberFailureCauseId] = cause;
    const prettyErrors$1 = prettyErrors(cause);
    if (prettyErrors$1.length > 0) {
      const head = prettyErrors$1[0];
      this.name = head.message.split(":")[0];
      this.message = head.message.substring(this.name.length + 2);
      this.stack = pretty(cause);
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
  Error.stackTraceLimit = limit;
  return error;
};
const fastPath = (effect) => {
  const op = effect;
  switch (op._op) {
    case "Failure":
    case "Success": {
      return op;
    }
    case "Left": {
      return exitFail(op.left);
    }
    case "Right": {
      return exitSucceed(op.right);
    }
    case "Some": {
      return exitSucceed(op.value);
    }
    case "None": {
      return exitFail(NoSuchElementException());
    }
  }
};
const unsafeRunSyncExit = (runtime) => (effect) => {
  const op = fastPath(effect);
  if (op) {
    return op;
  }
  const scheduler = new SyncScheduler();
  const fiberRuntime = unsafeFork(runtime)(effect, { scheduler: scheduler });
  scheduler.flush();
  const result = fiberRuntime.unsafePoll();
  if (result) {
    return result;
  }
  throw asyncFiberException(fiberRuntime);
};
class RuntimeImpl {
  context;
  runtimeFlags;
  fiberRefs;
  constructor(context, runtimeFlags, fiberRefs) {
    this.context = context;
    this.runtimeFlags = runtimeFlags;
    this.fiberRefs = fiberRefs;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const make$2 = (options) =>
  new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs);
const defaultRuntimeFlags = make$d(
  Interruption,
  CooperativeYielding,
  RuntimeMetrics
);
const defaultRuntime = make$2({
  context: empty$c(),
  runtimeFlags: defaultRuntimeFlags,
  fiberRefs: empty$3(),
});
const unsafeRunSyncEffect = unsafeRunSync(defaultRuntime);
const forEach = forEach$1;
const succeed = succeed$1;
const suspend = suspend$1;
const _void = void_;
const catchAll = catchAll$1;
const map$1 = map$2;
const mapError$1 = mapError$2;
const either = either$1;
const flatMap$1 = flatMap$2;
const matchEffect = matchEffect$1;
const orElse = orElse$1;
const runSync = unsafeRunSyncEffect;
const getKeysForIndexSignature = (input, parameter) => {
  switch (parameter._tag) {
    case "StringKeyword":
    case "TemplateLiteral":
      return Object.keys(input);
    case "SymbolKeyword":
      return Object.getOwnPropertySymbols(input);
    case "Refinement":
      return getKeysForIndexSignature(input, parameter.from);
  }
};
const ownKeys = (o) => Object.keys(o).concat(Object.getOwnPropertySymbols(o));
const memoizeThunk = (f) => {
  let done = false;
  let a;
  return () => {
    if (done) {
      return a;
    }
    a = f();
    done = true;
    return a;
  };
};
const formatUnknown = (u) => {
  if (isString(u)) {
    return JSON.stringify(u);
  } else if (
    isNumber(u) ||
    u == null ||
    isBoolean(u) ||
    isSymbol(u) ||
    isDate(u)
  ) {
    return String(u);
  } else if (isBigInt(u)) {
    return String(u) + "n";
  } else if (
    !Array.isArray(u) &&
    hasProperty(u, "toString") &&
    isFunction(u["toString"]) &&
    u["toString"] !== Object.prototype.toString
  ) {
    return u["toString"]();
  }
  try {
    JSON.stringify(u);
    if (Array.isArray(u)) {
      return `[${u.map(formatUnknown).join(",")}]`;
    } else {
      return `{${ownKeys(u)
        .map(
          (k) =>
            `${isString(k) ? JSON.stringify(k) : String(k)}:${formatUnknown(
              u[k]
            )}`
        )
        .join(",")}}`;
    }
  } catch (e) {
    return String(u);
  }
};
const getDuplicatePropertySignatureErrorMessage = (name) =>
  `Duplicate property signature ${formatUnknown(name)}`;
const getDuplicateIndexSignatureErrorMessage = (name) =>
  `Duplicate index signature for type \`${name}\``;
const getIndexSignatureParameterErrorMessage =
  "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types";
const getRequiredElementFollowinAnOptionalElementErrorMessage =
  "A required element cannot follow an optional element. ts(1257)";
const TypeAnnotationId = Symbol.for("@effect/schema/annotation/Type");
const MessageAnnotationId = Symbol.for("@effect/schema/annotation/Message");
const IdentifierAnnotationId = Symbol.for(
  "@effect/schema/annotation/Identifier"
);
const TitleAnnotationId = Symbol.for("@effect/schema/annotation/Title");
const DescriptionAnnotationId = Symbol.for(
  "@effect/schema/annotation/Description"
);
const ExamplesAnnotationId = Symbol.for("@effect/schema/annotation/Examples");
const DefaultAnnotationId = Symbol.for("@effect/schema/annotation/Default");
const JSONSchemaAnnotationId = Symbol.for(
  "@effect/schema/annotation/JSONSchema"
);
const DocumentationAnnotationId = Symbol.for(
  "@effect/schema/annotation/Documentation"
);
const ConcurrencyAnnotationId = Symbol.for(
  "@effect/schema/annotation/Concurrency"
);
const BatchingAnnotationId = Symbol.for("@effect/schema/annotation/Batching");
const SurrogateAnnotationId = Symbol.for("@effect/schema/annotation/Surrogate");
const ParseIssueTitleAnnotationId = Symbol.for(
  "@effect/schema/annotation/ParseIssueTitle"
);
const getAnnotation = dual(2, (annotated, key) =>
  Object.prototype.hasOwnProperty.call(annotated.annotations, key)
    ? some(annotated.annotations[key])
    : none$4()
);
const getMessageAnnotation = getAnnotation(MessageAnnotationId);
const getTitleAnnotation = getAnnotation(TitleAnnotationId);
const getIdentifierAnnotation = getAnnotation(IdentifierAnnotationId);
const getDescriptionAnnotation = getAnnotation(DescriptionAnnotationId);
const getConcurrencyAnnotation = getAnnotation(ConcurrencyAnnotationId);
const getBatchingAnnotation = getAnnotation(BatchingAnnotationId);
const getParseIssueTitleAnnotation$1 = getAnnotation(
  ParseIssueTitleAnnotationId
);
const getSurrogateAnnotation = getAnnotation(SurrogateAnnotationId);
const JSONIdentifierAnnotationId = Symbol.for(
  "@effect/schema/annotation/JSONIdentifier"
);
const getJSONIdentifierAnnotation = getAnnotation(JSONIdentifierAnnotationId);
let Declaration$1 = class Declaration {
  typeParameters;
  decodeUnknown;
  encodeUnknown;
  annotations;
  _tag = "Declaration";
  constructor(typeParameters, decodeUnknown, encodeUnknown, annotations = {}) {
    this.typeParameters = typeParameters;
    this.decodeUnknown = decodeUnknown;
    this.encodeUnknown = encodeUnknown;
    this.annotations = annotations;
  }
  toString(verbose = false) {
    return getOrElse(getExpected(this, verbose), () => "<declaration schema>");
  }
  toJSON() {
    return {
      _tag: this._tag,
      typeParameters: this.typeParameters.map((ast) => ast.toJSON()),
      annotations: toJSONAnnotations(this.annotations),
    };
  }
};
const createASTGuard = (tag) => (ast) => ast._tag === tag;
class Literal {
  literal;
  annotations;
  _tag = "Literal";
  constructor(literal, annotations = {}) {
    this.literal = literal;
    this.annotations = annotations;
  }
  toString(verbose = false) {
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
    this.symbol = symbol;
    this.annotations = annotations;
  }
  toString(verbose = false) {
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
  toString(verbose = false) {
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
  toString(verbose = false) {
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
  toString(verbose = false) {
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
  toString(verbose = false) {
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
});
const isStringKeyword = createASTGuard("StringKeyword");
const isNumberKeyword = createASTGuard("NumberKeyword");
const isSymbolKeyword = createASTGuard("SymbolKeyword");
class Element {
  type;
  isOptional;
  constructor(type, isOptional) {
    this.type = type;
    this.isOptional = isOptional;
  }
  toJSON() {
    return { type: this.type.toJSON(), isOptional: this.isOptional };
  }
  toString() {
    return String(this.type) + (this.isOptional ? "?" : "");
  }
}
let TupleType$1 = class TupleType {
  elements;
  rest;
  isReadonly;
  annotations;
  _tag = "TupleType";
  constructor(elements, rest, isReadonly, annotations = {}) {
    this.elements = elements;
    this.rest = rest;
    this.isReadonly = isReadonly;
    this.annotations = annotations;
    let hasOptionalElement = false;
    let hasIllegalRequiredElement = false;
    for (const e of elements) {
      if (e.isOptional) {
        hasOptionalElement = true;
      } else if (hasOptionalElement) {
        hasIllegalRequiredElement = true;
        break;
      }
    }
    if (hasIllegalRequiredElement || (hasOptionalElement && rest.length > 1)) {
      throw new Error(getRequiredElementFollowinAnOptionalElementErrorMessage);
    }
  }
  toString(verbose = false) {
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
};
const formatTuple = (ast) => {
  const formattedElements = ast.elements.map(String).join(", ");
  return matchLeft(ast.rest, {
    onEmpty: () => `readonly [${formattedElements}]`,
    onNonEmpty: (head, tail) => {
      const formattedHead = String(head);
      const wrappedHead = formattedHead.includes(" | ")
        ? `(${formattedHead})`
        : formattedHead;
      if (tail.length > 0) {
        const formattedTail = tail.map(String).join(", ");
        if (ast.elements.length > 0) {
          return `readonly [${formattedElements}, ...${wrappedHead}[], ${formattedTail}]`;
        } else {
          return `readonly [...${wrappedHead}[], ${formattedTail}]`;
        }
      } else {
        if (ast.elements.length > 0) {
          return `readonly [${formattedElements}, ...${wrappedHead}[]]`;
        } else {
          return `ReadonlyArray<${formattedHead}>`;
        }
      }
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
    this.name = name;
    this.type = type;
    this.isOptional = isOptional;
    this.isReadonly = isReadonly;
    this.annotations = annotations;
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
      return true;
    case "Refinement":
      return isParameter(ast.from);
  }
  return false;
};
class IndexSignature {
  type;
  isReadonly;
  parameter;
  constructor(parameter, type, isReadonly) {
    this.type = type;
    this.isReadonly = isReadonly;
    if (isParameter(parameter)) {
      this.parameter = parameter;
    } else {
      throw new Error(getIndexSignatureParameterErrorMessage);
    }
  }
  toJSON() {
    return {
      parameter: this.parameter.toJSON(),
      type: this.type.toJSON(),
      isReadonly: this.isReadonly,
    };
  }
}
let TypeLiteral$1 = class TypeLiteral {
  annotations;
  _tag = "TypeLiteral";
  propertySignatures;
  indexSignatures;
  constructor(propertySignatures, indexSignatures, annotations = {}) {
    this.annotations = annotations;
    const keys = {};
    for (let i = 0; i < propertySignatures.length; i++) {
      const name = propertySignatures[i].name;
      if (Object.prototype.hasOwnProperty.call(keys, name)) {
        throw new Error(getDuplicatePropertySignatureErrorMessage(name));
      }
      keys[name] = null;
    }
    const parameters = { string: false, symbol: false };
    for (let i = 0; i < indexSignatures.length; i++) {
      const parameter = getParameterBase(indexSignatures[i].parameter);
      if (isStringKeyword(parameter)) {
        if (parameters.string) {
          throw new Error(getDuplicateIndexSignatureErrorMessage("string"));
        }
        parameters.string = true;
      } else if (isSymbolKeyword(parameter)) {
        if (parameters.symbol) {
          throw new Error(getDuplicateIndexSignatureErrorMessage("symbol"));
        }
        parameters.symbol = true;
      }
    }
    this.propertySignatures = sortPropertySignatures(propertySignatures);
    this.indexSignatures = sortIndexSignatures(indexSignatures);
  }
  toString(verbose = false) {
    return getOrElse(getExpected(this, verbose), () => formatTypeLiteral(this));
  }
  toJSON() {
    return {
      _tag: this._tag,
      propertySignatures: this.propertySignatures.map((ps) => ps.toJSON()),
      indexSignatures: this.indexSignatures.map((ps) => ps.toJSON()),
      annotations: toJSONAnnotations(this.annotations),
    };
  }
};
const formatTypeLiteral = (ast) => {
  const formattedPropertySignatures = ast.propertySignatures
    .map((ps) => String(ps.name) + (ps.isOptional ? "?" : "") + ": " + ps.type)
    .join("; ");
  if (ast.indexSignatures.length > 0) {
    const formattedIndexSignatures = ast.indexSignatures
      .map((is) => `[x: ${getParameterBase(is.parameter)}]: ${is.type}`)
      .join("; ");
    if (ast.propertySignatures.length > 0) {
      return `{ ${formattedPropertySignatures}; ${formattedIndexSignatures} }`;
    } else {
      return `{ ${formattedIndexSignatures} }`;
    }
  } else {
    if (ast.propertySignatures.length > 0) {
      return `{ ${formattedPropertySignatures} }`;
    } else {
      return "{}";
    }
  }
};
const removeNevers = (candidates) =>
  candidates.filter((ast) => !(ast === neverKeyword));
const sortCandidates = sort(
  mapInput(Order$1, (ast) => {
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
);
const literalMap = {
  string: "StringKeyword",
  number: "NumberKeyword",
  boolean: "BooleanKeyword",
  bigint: "BigIntKeyword",
};
const flatten = (candidates) =>
  flatMap$3(candidates, (ast) => (isUnion(ast) ? flatten(ast.types) : [ast]));
const unify = (candidates) => {
  const cs = sortCandidates(candidates);
  const out = [];
  const uniques = {};
  const literals = [];
  for (const ast of cs) {
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
      case "SymbolKeyword": {
        if (!uniques[ast._tag]) {
          uniques[ast._tag] = ast;
          out.push(ast);
        }
        break;
      }
      case "Literal": {
        const type = typeof ast.literal;
        switch (type) {
          case "string":
          case "number":
          case "bigint":
          case "boolean": {
            const _tag = literalMap[type];
            if (!uniques[_tag] && !literals.includes(ast.literal)) {
              literals.push(ast.literal);
              out.push(ast);
            }
            break;
          }
          case "object": {
            if (!literals.includes(ast.literal)) {
              literals.push(ast.literal);
              out.push(ast);
            }
            break;
          }
        }
        break;
      }
      case "UniqueSymbol": {
        if (!uniques["SymbolKeyword"] && !literals.includes(ast.symbol)) {
          literals.push(ast.symbol);
          out.push(ast);
        }
        break;
      }
      case "TupleType": {
        if (!uniques["ObjectKeyword"]) {
          out.push(ast);
        }
        break;
      }
      case "TypeLiteral": {
        if (
          ast.propertySignatures.length === 0 &&
          ast.indexSignatures.length === 0
        ) {
          if (!uniques["{}"]) {
            uniques["{}"] = ast;
            out.push(ast);
          }
        } else if (!uniques["ObjectKeyword"]) {
          out.push(ast);
        }
        break;
      }
      default:
        out.push(ast);
    }
  }
  return out;
};
let Union$1 = class Union {
  types;
  annotations;
  static make = (candidates, annotations) => {
    const types = [];
    const memo = new Set();
    for (let i = 0; i < candidates.length; i++) {
      const ast = candidates[i];
      if (ast === neverKeyword || memo.has(ast)) {
        continue;
      }
      memo.add(ast);
      types.push(ast);
    }
    return Union.union(types, annotations);
  };
  static members = (candidates, annotations) =>
    Union.union(removeNevers(candidates), annotations);
  static unify = (candidates, annotations) =>
    Union.union(unify(flatten(candidates)), annotations);
  static union = (types, annotations) =>
    isMembers(types)
      ? new Union(types, annotations)
      : types.length === 1
      ? types[0]
      : neverKeyword;
  _tag = "Union";
  constructor(types, annotations = {}) {
    this.types = types;
    this.annotations = annotations;
  }
  toString(verbose = false) {
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
};
const isMembers = (as) => as.length > 1;
const isUnion = createASTGuard("Union");
const toJSONMemoMap = globalValue(
  Symbol.for("@effect/schema/AST/toJSONMemoMap"),
  () => new WeakMap()
);
class Suspend {
  f;
  annotations;
  _tag = "Suspend";
  constructor(f, annotations = {}) {
    this.f = f;
    this.annotations = annotations;
    this.f = memoizeThunk(f);
  }
  toString(verbose = false) {
    return getExpected(this, verbose).pipe(
      orElse$2(() =>
        flatMap$4(liftThrowable(this.f)(), (ast) => getExpected(ast, verbose))
      ),
      getOrElse(() => "<suspended schema>")
    );
  }
  toJSON() {
    const ast = this.f();
    let out = toJSONMemoMap.get(ast);
    if (out) {
      return out;
    }
    toJSONMemoMap.set(ast, { _tag: this._tag });
    out = {
      _tag: this._tag,
      ast: ast.toJSON(),
      annotations: toJSONAnnotations(this.annotations),
    };
    toJSONMemoMap.set(ast, out);
    return out;
  }
}
let Refinement$1 = class Refinement {
  from;
  filter;
  annotations;
  _tag = "Refinement";
  constructor(from, filter, annotations = {}) {
    this.from = from;
    this.filter = filter;
    this.annotations = annotations;
  }
  toString(verbose = false) {
    return getOrElse(getExpected(this, verbose), () => "<refinement schema>");
  }
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      annotations: toJSONAnnotations(this.annotations),
    };
  }
};
const isRefinement = createASTGuard("Refinement");
const defaultParseOption = {};
const annotations = (ast, annotations) => {
  const d = Object.getOwnPropertyDescriptors(ast);
  d.annotations.value = { ...ast.annotations, ...annotations };
  return Object.create(Object.getPrototypeOf(ast), d);
};
const STRING_KEYWORD_PATTERN = ".*";
const NUMBER_KEYWORD_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
const getTemplateLiteralRegExp = (ast) => {
  let pattern = `^${escape(ast.head)}`;
  for (const span of ast.spans) {
    if (isStringKeyword(span.type)) {
      pattern += STRING_KEYWORD_PATTERN;
    } else if (isNumberKeyword(span.type)) {
      pattern += NUMBER_KEYWORD_PATTERN;
    }
    pattern += escape(span.literal);
  }
  pattern += "$";
  return new RegExp(pattern);
};
const typeAST = (ast) => {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = changeMap(ast.typeParameters, typeAST);
      return typeParameters === ast.typeParameters
        ? ast
        : new Declaration$1(
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
      });
      const rest = changeMap(ast.rest, typeAST);
      return elements === ast.elements && rest === ast.rest
        ? ast
        : new TupleType$1(elements, rest, ast.isReadonly, ast.annotations);
    }
    case "TypeLiteral": {
      const propertySignatures = changeMap(ast.propertySignatures, (p) => {
        const type = typeAST(p.type);
        return type === p.type
          ? p
          : new PropertySignature(p.name, type, p.isOptional, p.isReadonly);
      });
      const indexSignatures = changeMap(ast.indexSignatures, (is) => {
        const type = typeAST(is.type);
        return type === is.type
          ? is
          : new IndexSignature(is.parameter, type, is.isReadonly);
      });
      return propertySignatures === ast.propertySignatures &&
        indexSignatures === ast.indexSignatures
        ? ast
        : new TypeLiteral$1(
            propertySignatures,
            indexSignatures,
            ast.annotations
          );
    }
    case "Union": {
      const types = changeMap(ast.types, typeAST);
      return types === ast.types ? ast : Union$1.make(types, ast.annotations);
    }
    case "Suspend":
      return new Suspend(() => typeAST(ast.f()), ast.annotations);
    case "Refinement": {
      const from = typeAST(ast.from);
      return from === ast.from
        ? ast
        : new Refinement$1(from, ast.filter, ast.annotations);
    }
    case "Transformation":
      return typeAST(ast.to);
  }
  return ast;
};
const getJSONIdentifier = (annotated) =>
  orElse$2(getJSONIdentifierAnnotation(annotated), () =>
    getIdentifierAnnotation(annotated)
  );
const createJSONIdentifierAnnotation = (annotated) =>
  match$2(getJSONIdentifier(annotated), {
    onNone: () => undefined,
    onSome: (identifier) => ({ [JSONIdentifierAnnotationId]: identifier }),
  });
function changeMap(as, f) {
  let changed = false;
  const out = allocate(as.length);
  for (let i = 0; i < as.length; i++) {
    const a = as[i];
    const fa = f(a);
    if (fa !== a) {
      changed = true;
    }
    out[i] = fa;
  }
  return changed ? out : as;
}
const encodedAST = (ast) => {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = changeMap(ast.typeParameters, encodedAST);
      return typeParameters === ast.typeParameters
        ? ast
        : new Declaration$1(
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
      });
      const rest = changeMap(ast.rest, encodedAST);
      return elements === ast.elements && rest === ast.rest
        ? ast
        : new TupleType$1(
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
          : new PropertySignature(ps.name, type, ps.isOptional, ps.isReadonly);
      });
      const indexSignatures = changeMap(ast.indexSignatures, (is) => {
        const type = encodedAST(is.type);
        return type === is.type
          ? is
          : new IndexSignature(is.parameter, type, is.isReadonly);
      });
      return propertySignatures === ast.propertySignatures &&
        indexSignatures === ast.indexSignatures
        ? ast
        : new TypeLiteral$1(
            propertySignatures,
            indexSignatures,
            createJSONIdentifierAnnotation(ast)
          );
    }
    case "Union": {
      const types = changeMap(ast.types, encodedAST);
      return types === ast.types
        ? ast
        : Union$1.make(types, createJSONIdentifierAnnotation(ast));
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
};
const toJSONAnnotations = (annotations) => {
  const out = {};
  for (const k of Object.getOwnPropertySymbols(annotations)) {
    out[String(k)] = annotations[k];
  }
  return out;
};
const getCardinality = (ast) => {
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
};
const sortPropertySignatures = sort(
  mapInput(Order$1, (ps) => getCardinality(ps.type))
);
const sortIndexSignatures = sort(
  mapInput(Order$1, (is) => {
    switch (getParameterBase(is.parameter)._tag) {
      case "StringKeyword":
        return 2;
      case "SymbolKeyword":
        return 3;
      case "TemplateLiteral":
        return 1;
    }
  })
);
const getParameterBase = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return ast;
    case "Refinement":
      return getParameterBase(ast.from);
  }
};
const formatKeyword = (ast, verbose = false) =>
  getOrElse(getExpected(ast, verbose), () => ast._tag);
const getExpected = (ast, verbose) => {
  if (verbose) {
    const description = getDescriptionAnnotation(ast).pipe(
      orElse$2(() => getTitleAnnotation(ast))
    );
    return match$2(getIdentifierAnnotation(ast), {
      onNone: () => description,
      onSome: (identifier) =>
        match$2(description, {
          onNone: () => some(identifier),
          onSome: (description) => some(`${identifier} (${description})`),
        }),
    });
  } else {
    return getIdentifierAnnotation(ast).pipe(
      orElse$2(() => getTitleAnnotation(ast)),
      orElse$2(() => getDescriptionAnnotation(ast))
    );
  }
};
const ArbitraryHookId = Symbol.for("@effect/schema/ArbitraryHookId");
const make$1 = (value, forest = []) => ({ value: value, forest: forest });
const formatIssue = (issue) => map$1(go$1(issue), (tree) => drawTree(tree));
const formatIssueSync = (issue) => runSync(formatIssue(issue));
const drawTree = (tree) => tree.value + draw("\n", tree.forest);
const draw = (indentation, forest) => {
  let r = "";
  const len = forest.length;
  let tree;
  for (let i = 0; i < len; i++) {
    tree = forest[i];
    const isLast = i === len - 1;
    r += indentation + (isLast ? "└" : "├") + "─ " + tree.value;
    r += draw(indentation + (len > 1 && !isLast ? "│  " : "   "), tree.forest);
  }
  return r;
};
const formatTransformationKind = (kind) => {
  switch (kind) {
    case "Encoded":
      return "Encoded side transformation failure";
    case "Transformation":
      return "Transformation process failure";
    case "Type":
      return "Type side transformation failure";
  }
};
const formatRefinementKind = (kind) => {
  switch (kind) {
    case "From":
      return "From side refinement failure";
    case "Predicate":
      return "Predicate refinement failure";
  }
};
const getPrevMessage = (issue) => {
  switch (issue._tag) {
    case "Refinement": {
      if (issue.kind === "From") {
        return getMessage(issue.error);
      }
      break;
    }
    case "Transformation":
      return getMessage(issue.error);
  }
  return none$4();
};
const getCurrentMessage = (issue) =>
  getMessageAnnotation(issue.ast).pipe(
    flatMap$1((annotation) => {
      const out = annotation(issue);
      return isString(out) ? succeed(out) : out;
    })
  );
const getMessage = (issue) =>
  catchAll(getPrevMessage(issue), () => getCurrentMessage(issue));
const getParseIssueTitleAnnotation = (issue) =>
  filterMap(getParseIssueTitleAnnotation$1(issue.ast), (annotation) =>
    fromNullable(annotation(issue))
  );
const formatTypeMessage = (e) =>
  getMessage(e).pipe(
    orElse(() => getParseIssueTitleAnnotation(e)),
    orElse(() => e.message),
    catchAll(() =>
      succeed(
        `Expected ${e.ast.toString(true)}, actual ${formatUnknown(e.actual)}`
      )
    )
  );
const getParseIssueTitle = (issue) =>
  getOrElse(getParseIssueTitleAnnotation(issue), () => String(issue.ast));
const formatForbiddenMessage = (e) =>
  getOrElse(e.message, () => "is forbidden");
const getTree = (issue, onFailure) =>
  matchEffect(getMessage(issue), {
    onFailure: onFailure,
    onSuccess: (message) => succeed(make$1(message)),
  });
const go$1 = (e) => {
  switch (e._tag) {
    case "Type":
      return map$1(formatTypeMessage(e), make$1);
    case "Forbidden":
      return succeed(
        make$1(getParseIssueTitle(e), [make$1(formatForbiddenMessage(e))])
      );
    case "Unexpected":
      return succeed(make$1(`is unexpected, expected ${e.ast.toString(true)}`));
    case "Missing":
      return succeed(make$1("is missing"));
    case "Union":
      return getTree(e, () =>
        map$1(
          forEach(e.errors, (e) => {
            switch (e._tag) {
              case "Member":
                return map$1(go$1(e.error), (tree) =>
                  make$1(`Union member`, [tree])
                );
              default:
                return go$1(e);
            }
          }),
          (forest) => make$1(getParseIssueTitle(e), forest)
        )
      );
    case "TupleType":
      return getTree(e, () =>
        map$1(
          forEach(e.errors, (index) =>
            map$1(go$1(index.error), (tree) =>
              make$1(`[${index.index}]`, [tree])
            )
          ),
          (forest) => make$1(getParseIssueTitle(e), forest)
        )
      );
    case "TypeLiteral":
      return getTree(e, () =>
        map$1(
          forEach(e.errors, (key) =>
            map$1(go$1(key.error), (tree) =>
              make$1(`[${formatUnknown(key.key)}]`, [tree])
            )
          ),
          (forest) => make$1(getParseIssueTitle(e), forest)
        )
      );
    case "Transformation":
      return getTree(e, () =>
        map$1(go$1(e.error), (tree) =>
          make$1(getParseIssueTitle(e), [
            make$1(formatTransformationKind(e.kind), [tree]),
          ])
        )
      );
    case "Refinement":
      return getTree(e, () =>
        map$1(go$1(e.error), (tree) =>
          make$1(getParseIssueTitle(e), [
            make$1(formatRefinementKind(e.kind), [tree]),
          ])
        )
      );
    case "Declaration":
      return getTree(e, () => {
        const error = e.error;
        const shouldSkipDefaultMessage =
          error._tag === "Type" && error.ast === e.ast;
        return shouldSkipDefaultMessage
          ? go$1(error)
          : map$1(go$1(error), (tree) => make$1(getParseIssueTitle(e), [tree]));
      });
  }
};
class Declaration {
  ast;
  actual;
  error;
  _tag = "Declaration";
  constructor(ast, actual, error) {
    this.ast = ast;
    this.actual = actual;
    this.error = error;
  }
}
class Refinement {
  ast;
  actual;
  kind;
  error;
  _tag = "Refinement";
  constructor(ast, actual, kind, error) {
    this.ast = ast;
    this.actual = actual;
    this.kind = kind;
    this.error = error;
  }
}
class TupleType {
  ast;
  actual;
  errors;
  output;
  _tag = "TupleType";
  constructor(ast, actual, errors, output = []) {
    this.ast = ast;
    this.actual = actual;
    this.errors = errors;
    this.output = output;
  }
}
class Index {
  index;
  error;
  _tag = "Index";
  constructor(index, error) {
    this.index = index;
    this.error = error;
  }
}
class TypeLiteral {
  ast;
  actual;
  errors;
  output;
  _tag = "TypeLiteral";
  constructor(ast, actual, errors, output = {}) {
    this.ast = ast;
    this.actual = actual;
    this.errors = errors;
    this.output = output;
  }
}
class Key {
  key;
  error;
  _tag = "Key";
  constructor(key, error) {
    this.key = key;
    this.error = error;
  }
}
class Unexpected {
  ast;
  _tag = "Unexpected";
  constructor(ast) {
    this.ast = ast;
  }
}
class Transformation {
  ast;
  actual;
  kind;
  error;
  _tag = "Transformation";
  constructor(ast, actual, kind, error) {
    this.ast = ast;
    this.actual = actual;
    this.kind = kind;
    this.error = error;
  }
}
class Type {
  ast;
  actual;
  _tag = "Type";
  message;
  constructor(ast, actual, message) {
    this.ast = ast;
    this.actual = actual;
    this.message = fromNullable(message);
  }
}
class Forbidden {
  ast;
  actual;
  _tag = "Forbidden";
  message;
  constructor(ast, actual, message) {
    this.ast = ast;
    this.actual = actual;
    this.message = fromNullable(message);
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
    this.ast = ast;
    this.error = error;
  }
}
class Union {
  ast;
  actual;
  errors;
  _tag = "Union";
  constructor(ast, actual, errors) {
    this.ast = ast;
    this.actual = actual;
    this.errors = errors;
  }
}
class ParseError extends TaggedError("ParseError") {
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
const parseError = (issue) => new ParseError({ error: issue });
const flatMap = dual(2, (self, f) => {
  const s = self;
  if (s["_tag"] === "Left") {
    return s;
  }
  if (s["_tag"] === "Right") {
    return f(s.right);
  }
  return flatMap$1(self, f);
});
const map = dual(2, (self, f) => {
  const s = self;
  if (s["_tag"] === "Left") {
    return s;
  }
  if (s["_tag"] === "Right") {
    return right(f(s.right));
  }
  return map$1(self, f);
});
const mapError = dual(2, (self, f) => {
  const s = self;
  if (s["_tag"] === "Left") {
    return left(f(s.left));
  }
  if (s["_tag"] === "Right") {
    return s;
  }
  return mapError$1(self, f);
});
const eitherOrUndefined = (self) => {
  const s = self;
  if (s["_tag"] === "Left" || s["_tag"] === "Right") {
    return s;
  }
};
const mergeParseOptions = (a, b) => {
  if (a === undefined) {
    return b;
  }
  if (b === undefined) {
    return a;
  }
  const out = {};
  out.errors = b.errors ?? a.errors;
  out.onExcessProperty = b.onExcessProperty ?? a.onExcessProperty;
  return out;
};
const getEither = (ast, isDecoding, options) => {
  const parser = goMemo(ast, isDecoding);
  return (u, overrideOptions) =>
    parser(u, mergeParseOptions(options, overrideOptions));
};
const decodeUnknownEither$1 = (schema, options) =>
  getEither(schema.ast, true, options);
const decodeMemoMap = globalValue(
  Symbol.for("@effect/schema/Parser/decodeMemoMap"),
  () => new WeakMap()
);
const encodeMemoMap = globalValue(
  Symbol.for("@effect/schema/Parser/encodeMemoMap"),
  () => new WeakMap()
);
const goMemo = (ast, isDecoding) => {
  const memoMap = isDecoding ? decodeMemoMap : encodeMemoMap;
  const memo = memoMap.get(ast);
  if (memo) {
    return memo;
  }
  const parser = go(ast, isDecoding);
  memoMap.set(ast, parser);
  return parser;
};
const getConcurrency = (ast) => getOrUndefined(getConcurrencyAnnotation(ast));
const getBatching = (ast) => getOrUndefined(getBatchingAnnotation(ast));
const go = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Refinement": {
      if (isDecoding) {
        const from = goMemo(ast.from, true);
        return (i, options) =>
          handleForbidden(
            flatMap(
              mapError(
                from(i, options),
                (e) => new Refinement(ast, i, "From", e)
              ),
              (a) =>
                match$2(ast.filter(a, options ?? defaultParseOption, ast), {
                  onNone: () => right(a),
                  onSome: (e) => left(new Refinement(ast, i, "Predicate", e)),
                })
            ),
            ast,
            i,
            options
          );
      } else {
        const from = goMemo(typeAST(ast), true);
        const to = goMemo(dropRightRefinement(ast.from), false);
        return (i, options) =>
          handleForbidden(
            flatMap(from(i, options), (a) => to(a, options)),
            ast,
            i,
            options
          );
      }
    }
    case "Transformation": {
      const transform = getFinalTransformation(ast.transformation, isDecoding);
      const from = isDecoding ? goMemo(ast.from, true) : goMemo(ast.to, false);
      const to = isDecoding ? goMemo(ast.to, true) : goMemo(ast.from, false);
      return (i1, options) =>
        handleForbidden(
          flatMap(
            mapError(
              from(i1, options),
              (e) =>
                new Transformation(ast, i1, isDecoding ? "Encoded" : "Type", e)
            ),
            (a) =>
              flatMap(
                mapError(
                  transform(a, options ?? defaultParseOption, ast),
                  (e) => new Transformation(ast, i1, "Transformation", e)
                ),
                (i2) =>
                  mapError(
                    to(i2, options),
                    (e) =>
                      new Transformation(
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
          mapError(
            parse(i, options ?? defaultParseOption, ast),
            (e) => new Declaration(ast, i, e)
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
      return fromRefinement(ast, isUndefined);
    case "VoidKeyword":
      return fromRefinement(ast, isUndefined);
    case "NeverKeyword":
      return fromRefinement(ast, isNever);
    case "UnknownKeyword":
    case "AnyKeyword":
      return right;
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
      const regex = getTemplateLiteralRegExp(ast);
      return fromRefinement(ast, (u) => isString(u) && regex.test(u));
    }
    case "TupleType": {
      const elements = ast.elements.map((e) => goMemo(e.type, isDecoding));
      const rest = ast.rest.map((ast) => goMemo(ast, isDecoding));
      let requiredLen = ast.elements.filter((e) => !e.isOptional).length;
      if (ast.rest.length > 0) {
        requiredLen += ast.rest.length - 1;
      }
      const expectedAST = Union$1.make(
        ast.elements.map((_, i) => new Literal(i))
      );
      const concurrency = getConcurrency(ast);
      const batching = getBatching(ast);
      return (input, options) => {
        if (!isArray(input)) {
          return left(new Type(ast, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const len = input.length;
        for (let i = len; i <= requiredLen - 1; i++) {
          const e = new Index(i, missing);
          if (allErrors) {
            es.push([stepKey++, e]);
            continue;
          } else {
            return left(new TupleType(ast, input, [e]));
          }
        }
        if (ast.rest.length === 0) {
          for (let i = ast.elements.length; i <= len - 1; i++) {
            const e = new Index(i, new Unexpected(expectedAST));
            if (allErrors) {
              es.push([stepKey++, e]);
              continue;
            } else {
              return left(new TupleType(ast, input, [e]));
            }
          }
        }
        const output = [];
        let i = 0;
        let queue = undefined;
        for (; i < elements.length; i++) {
          if (len < i + 1) {
            if (ast.elements[i].isOptional) {
              continue;
            }
          } else {
            const parser = elements[i];
            const te = parser(input[i], options);
            const eu = eitherOrUndefined(te);
            if (eu) {
              if (isLeft(eu)) {
                const e = new Index(i, eu.left);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left(
                    new TupleType(ast, input, [e], sortByIndex(output))
                  );
                }
              }
              output.push([stepKey++, eu.right]);
            } else {
              const nk = stepKey++;
              const index = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({ es: es, output: output }) =>
                flatMap$1(either(te), (t) => {
                  if (isLeft(t)) {
                    const e = new Index(index, t.left);
                    if (allErrors) {
                      es.push([nk, e]);
                      return _void;
                    } else {
                      return left(
                        new TupleType(ast, input, [e], sortByIndex(output))
                      );
                    }
                  }
                  output.push([nk, t.right]);
                  return _void;
                })
              );
            }
          }
        }
        if (isNonEmptyReadonlyArray(rest)) {
          const [head, ...tail] = rest;
          for (; i < len - tail.length; i++) {
            const te = head(input[i], options);
            const eu = eitherOrUndefined(te);
            if (eu) {
              if (isLeft(eu)) {
                const e = new Index(i, eu.left);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left(
                    new TupleType(ast, input, [e], sortByIndex(output))
                  );
                }
              } else {
                output.push([stepKey++, eu.right]);
              }
            } else {
              const nk = stepKey++;
              const index = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({ es: es, output: output }) =>
                flatMap$1(either(te), (t) => {
                  if (isLeft(t)) {
                    const e = new Index(index, t.left);
                    if (allErrors) {
                      es.push([nk, e]);
                      return _void;
                    } else {
                      return left(
                        new TupleType(ast, input, [e], sortByIndex(output))
                      );
                    }
                  } else {
                    output.push([nk, t.right]);
                    return _void;
                  }
                })
              );
            }
          }
          for (let j = 0; j < tail.length; j++) {
            i += j;
            if (len < i + 1) {
              continue;
            } else {
              const te = tail[j](input[i], options);
              const eu = eitherOrUndefined(te);
              if (eu) {
                if (isLeft(eu)) {
                  const e = new Index(i, eu.left);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return left(
                      new TupleType(ast, input, [e], sortByIndex(output))
                    );
                  }
                }
                output.push([stepKey++, eu.right]);
              } else {
                const nk = stepKey++;
                const index = i;
                if (!queue) {
                  queue = [];
                }
                queue.push(({ es: es, output: output }) =>
                  flatMap$1(either(te), (t) => {
                    if (isLeft(t)) {
                      const e = new Index(index, t.left);
                      if (allErrors) {
                        es.push([nk, e]);
                        return _void;
                      } else {
                        return left(
                          new TupleType(ast, input, [e], sortByIndex(output))
                        );
                      }
                    }
                    output.push([nk, t.right]);
                    return _void;
                  })
                );
              }
            }
          }
        }
        const computeResult = ({ es: es, output: output }) =>
          isNonEmptyArray(es)
            ? left(
                new TupleType(ast, input, sortByIndex(es), sortByIndex(output))
              )
            : right(sortByIndex(output));
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend(() => {
            const state = { es: copy$1(es), output: copy$1(output) };
            return flatMap$1(
              forEach(cqueue, (f) => f(state), {
                concurrency: concurrency,
                batching: batching,
                discard: true,
              }),
              () => computeResult(state)
            );
          });
        }
        return computeResult({ output: output, es: es });
      };
    }
    case "TypeLiteral": {
      if (
        ast.propertySignatures.length === 0 &&
        ast.indexSignatures.length === 0
      ) {
        return fromRefinement(ast, isNotNullable);
      }
      const propertySignatures = [];
      const expectedKeys = {};
      for (const ps of ast.propertySignatures) {
        propertySignatures.push([goMemo(ps.type, isDecoding), ps]);
        expectedKeys[ps.name] = null;
      }
      const indexSignatures = ast.indexSignatures.map((is) => [
        goMemo(is.parameter, isDecoding),
        goMemo(is.type, isDecoding),
        is.parameter,
      ]);
      const expectedAST = Union$1.make(
        ast.indexSignatures
          .map((is) => is.parameter)
          .concat(
            ownKeys(expectedKeys).map((key) =>
              isSymbol(key) ? new UniqueSymbol(key) : new Literal(key)
            )
          )
      );
      const expected = goMemo(expectedAST, isDecoding);
      const concurrency = getConcurrency(ast);
      const batching = getBatching(ast);
      return (input, options) => {
        if (!isRecord(input)) {
          return left(new Type(ast, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const onExcessPropertyError = options?.onExcessProperty === "error";
        const onExcessPropertyPreserve =
          options?.onExcessProperty === "preserve";
        const output = {};
        if (onExcessPropertyError || onExcessPropertyPreserve) {
          for (const key of ownKeys(input)) {
            const eu = eitherOrUndefined(expected(key, options));
            if (isLeft(eu)) {
              if (onExcessPropertyError) {
                const e = new Key(key, new Unexpected(expectedAST));
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left(new TypeLiteral(ast, input, [e], output));
                }
              } else {
                output[key] = input[key];
              }
            }
          }
        }
        let queue = undefined;
        const isExact = options?.isExact === true;
        for (let i = 0; i < propertySignatures.length; i++) {
          const ps = propertySignatures[i][1];
          const name = ps.name;
          const hasKey = Object.prototype.hasOwnProperty.call(input, name);
          if (!hasKey) {
            if (ps.isOptional) {
              continue;
            } else if (isExact) {
              const e = new Key(name, missing);
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return left(new TypeLiteral(ast, input, [e], output));
              }
            }
          }
          const parser = propertySignatures[i][0];
          const te = parser(input[name], options);
          const eu = eitherOrUndefined(te);
          if (eu) {
            if (isLeft(eu)) {
              const e = new Key(name, hasKey ? eu.left : missing);
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return left(new TypeLiteral(ast, input, [e], output));
              }
            }
            output[name] = eu.right;
          } else {
            const nk = stepKey++;
            const index = name;
            if (!queue) {
              queue = [];
            }
            queue.push(({ es: es, output: output }) =>
              flatMap$1(either(te), (t) => {
                if (isLeft(t)) {
                  const e = new Key(index, hasKey ? t.left : missing);
                  if (allErrors) {
                    es.push([nk, e]);
                    return _void;
                  } else {
                    return left(new TypeLiteral(ast, input, [e], output));
                  }
                }
                output[index] = t.right;
                return _void;
              })
            );
          }
        }
        for (let i = 0; i < indexSignatures.length; i++) {
          const indexSignature = indexSignatures[i];
          const parameter = indexSignature[0];
          const type = indexSignature[1];
          const keys = getKeysForIndexSignature(input, indexSignature[2]);
          for (const key of keys) {
            const keu = eitherOrUndefined(parameter(key, options));
            if (keu && isRight(keu)) {
              const vpr = type(input[key], options);
              const veu = eitherOrUndefined(vpr);
              if (veu) {
                if (isLeft(veu)) {
                  const e = new Key(key, veu.left);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return left(new TypeLiteral(ast, input, [e], output));
                  }
                } else {
                  if (
                    !Object.prototype.hasOwnProperty.call(expectedKeys, key)
                  ) {
                    output[key] = veu.right;
                  }
                }
              } else {
                const nk = stepKey++;
                const index = key;
                if (!queue) {
                  queue = [];
                }
                queue.push(({ es: es, output: output }) =>
                  flatMap$1(either(vpr), (tv) => {
                    if (isLeft(tv)) {
                      const e = new Key(index, tv.left);
                      if (allErrors) {
                        es.push([nk, e]);
                        return _void;
                      } else {
                        return left(new TypeLiteral(ast, input, [e], output));
                      }
                    } else {
                      if (
                        !Object.prototype.hasOwnProperty.call(expectedKeys, key)
                      ) {
                        output[key] = tv.right;
                      }
                      return _void;
                    }
                  })
                );
              }
            }
          }
        }
        const computeResult = ({ es: es, output: output }) =>
          isNonEmptyArray(es)
            ? left(new TypeLiteral(ast, input, sortByIndex(es), output))
            : right(output);
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend(() => {
            const state = { es: copy$1(es), output: Object.assign({}, output) };
            return flatMap$1(
              forEach(cqueue, (f) => f(state), {
                concurrency: concurrency,
                batching: batching,
                discard: true,
              }),
              () => computeResult(state)
            );
          });
        }
        return computeResult({ es: es, output: output });
      };
    }
    case "Union": {
      const searchTree = getSearchTree(ast.types, isDecoding);
      const ownKeys$1 = ownKeys(searchTree.keys);
      const len = ownKeys$1.length;
      const map = new Map();
      for (let i = 0; i < ast.types.length; i++) {
        map.set(ast.types[i], goMemo(ast.types[i], isDecoding));
      }
      const concurrency = getConcurrency(ast) ?? 1;
      const batching = getBatching(ast);
      return (input, options) => {
        const es = [];
        let stepKey = 0;
        let candidates = [];
        if (len > 0) {
          if (isRecord(input)) {
            for (let i = 0; i < len; i++) {
              const name = ownKeys$1[i];
              const buckets = searchTree.keys[name].buckets;
              if (Object.prototype.hasOwnProperty.call(input, name)) {
                const literal = String(input[name]);
                if (Object.prototype.hasOwnProperty.call(buckets, literal)) {
                  candidates = candidates.concat(buckets[literal]);
                } else {
                  const literals = Union$1.make(searchTree.keys[name].literals);
                  es.push([
                    stepKey++,
                    new TypeLiteral(
                      new TypeLiteral$1(
                        [new PropertySignature(name, literals, false, true)],
                        []
                      ),
                      input,
                      [new Key(name, new Type(literals, input[name]))]
                    ),
                  ]);
                }
              } else {
                const literals = Union$1.make(searchTree.keys[name].literals);
                es.push([
                  stepKey++,
                  new TypeLiteral(
                    new TypeLiteral$1(
                      [new PropertySignature(name, literals, false, true)],
                      []
                    ),
                    input,
                    [new Key(name, missing)]
                  ),
                ]);
              }
            }
          } else {
            es.push([stepKey++, new Type(ast, input)]);
          }
        }
        if (searchTree.otherwise.length > 0) {
          candidates = candidates.concat(searchTree.otherwise);
        }
        let queue = undefined;
        for (let i = 0; i < candidates.length; i++) {
          const candidate = candidates[i];
          const pr = map.get(candidate)(input, options);
          const eu =
            !queue || queue.length === 0 ? eitherOrUndefined(pr) : undefined;
          if (eu) {
            if (isRight(eu)) {
              return right(eu.right);
            } else {
              es.push([stepKey++, new Member(candidate, eu.left)]);
            }
          } else {
            const nk = stepKey++;
            if (!queue) {
              queue = [];
            }
            queue.push((state) =>
              suspend(() => {
                if ("finalResult" in state) {
                  return _void;
                } else {
                  return flatMap$1(either(pr), (t) => {
                    if (isRight(t)) {
                      state.finalResult = right(t.right);
                    } else {
                      state.es.push([nk, new Member(candidate, t.left)]);
                    }
                    return _void;
                  });
                }
              })
            );
          }
        }
        const computeResult = (es) =>
          isNonEmptyArray(es)
            ? es.length === 1 && es[0][1]._tag === "Type"
              ? left(es[0][1])
              : left(new Union(ast, input, sortByIndex(es)))
            : left(new Type(neverKeyword, input));
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend(() => {
            const state = { es: copy$1(es) };
            return flatMap$1(
              forEach(cqueue, (f) => f(state), {
                concurrency: concurrency,
                batching: batching,
                discard: true,
              }),
              () => {
                if ("finalResult" in state) {
                  return state.finalResult;
                }
                return computeResult(state.es);
              }
            );
          });
        }
        return computeResult(es);
      };
    }
    case "Suspend": {
      const get = memoizeThunk(() =>
        goMemo(annotations(ast.f(), ast.annotations), isDecoding)
      );
      return (a, options) => get()(a, options);
    }
  }
};
const fromRefinement = (ast, refinement) => (u) =>
  refinement(u) ? right(u) : left(new Type(ast, u));
const getLiterals = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Declaration": {
      const annotation = getSurrogateAnnotation(ast);
      if (isSome(annotation)) {
        return getLiterals(annotation.value, isDecoding);
      }
      break;
    }
    case "TypeLiteral": {
      const out = [];
      for (let i = 0; i < ast.propertySignatures.length; i++) {
        const propertySignature = ast.propertySignatures[i];
        const type = isDecoding
          ? encodedAST(propertySignature.type)
          : typeAST(propertySignature.type);
        if (isLiteral(type) && !propertySignature.isOptional) {
          out.push([propertySignature.name, type]);
        }
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
};
const getSearchTree = (members, isDecoding) => {
  const keys = {};
  const otherwise = [];
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const tags = getLiterals(member, isDecoding);
    if (tags.length > 0) {
      for (let j = 0; j < tags.length; j++) {
        const [key, literal] = tags[j];
        const hash = String(literal.literal);
        keys[key] = keys[key] || { buckets: {}, literals: [] };
        const buckets = keys[key].buckets;
        if (Object.prototype.hasOwnProperty.call(buckets, hash)) {
          if (j < tags.length - 1) {
            continue;
          }
          buckets[hash].push(member);
          keys[key].literals.push(literal);
        } else {
          buckets[hash] = [member];
          keys[key].literals.push(literal);
          break;
        }
      }
    } else {
      otherwise.push(member);
    }
  }
  return { keys: keys, otherwise: otherwise };
};
const dropRightRefinement = (ast) =>
  isRefinement(ast) ? dropRightRefinement(ast.from) : ast;
const handleForbidden = (effect, ast, actual, options) => {
  const eu = eitherOrUndefined(effect);
  if (eu) {
    return eu;
  }
  if (options?.isEffectAllowed === true) {
    return effect;
  }
  try {
    return runSync(either(effect));
  } catch (e) {
    return left(
      new Forbidden(
        ast,
        actual,
        "cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work"
      )
    );
  }
};
function sortByIndex(es) {
  return es.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0)).map(([_, a]) => a);
}
const getFinalTransformation = (transformation, isDecoding) => {
  switch (transformation._tag) {
    case "FinalTransformation":
      return isDecoding ? transformation.decode : transformation.encode;
    case "ComposeTransformation":
      return right;
    case "TypeLiteralTransformation":
      return (input) => {
        let out = right(input);
        for (const pst of transformation.propertySignatureTransformations) {
          const [from, to] = isDecoding
            ? [pst.from, pst.to]
            : [pst.to, pst.from];
          const transformation = isDecoding ? pst.decode : pst.encode;
          const f = (input) => {
            const o = transformation(
              Object.prototype.hasOwnProperty.call(input, from)
                ? some(input[from])
                : none$4()
            );
            delete input[from];
            if (isSome(o)) {
              input[to] = o.value;
            }
            return input;
          };
          out = map(out, f);
        }
        return out;
      };
  }
};
const EquivalenceHookId = Symbol.for("@effect/schema/EquivalenceHookId");
const PrettyHookId = Symbol.for("@effect/schema/PrettyHookId");
const TypeId = Symbol.for("@effect/schema/Schema");
const variance = { _A: (_) => _, _I: (_) => _, _R: (_) => _ };
const toASTAnnotations = (annotations) => {
  if (!annotations) {
    return {};
  }
  const out = {};
  const custom = Object.getOwnPropertySymbols(annotations);
  for (const sym of custom) {
    out[sym] = annotations[sym];
  }
  if (annotations.typeId !== undefined) {
    const typeId = annotations.typeId;
    if (typeof typeId === "object") {
      out[TypeAnnotationId] = typeId.id;
      out[typeId.id] = typeId.annotation;
    } else {
      out[TypeAnnotationId] = typeId;
    }
  }
  const move = (from, to) => {
    if (annotations[from] !== undefined) {
      out[to] = annotations[from];
    }
  };
  move("message", MessageAnnotationId);
  move("identifier", IdentifierAnnotationId);
  move("title", TitleAnnotationId);
  move("description", DescriptionAnnotationId);
  move("examples", ExamplesAnnotationId);
  move("default", DefaultAnnotationId);
  move("documentation", DocumentationAnnotationId);
  move("jsonSchema", JSONSchemaAnnotationId);
  move("arbitrary", ArbitraryHookId);
  move("pretty", PrettyHookId);
  move("equivalence", EquivalenceHookId);
  move("concurrency", ConcurrencyAnnotationId);
  move("batching", BatchingAnnotationId);
  move("parseIssueTitle", ParseIssueTitleAnnotationId);
  return out;
};
class SchemaImpl {
  ast;
  [TypeId] = variance;
  constructor(ast) {
    this.ast = ast;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  annotations(annotations$1) {
    return new SchemaImpl(
      annotations(this.ast, toASTAnnotations(annotations$1))
    );
  }
  toString() {
    return String(this.ast);
  }
}
const decodeUnknownEither = (schema, options) => {
  const decodeUnknownEither = decodeUnknownEither$1(schema, options);
  return (u, overrideOptions) =>
    mapLeft(decodeUnknownEither(u, overrideOptions), parseError);
};
const make = (ast) => new SchemaImpl(ast);
const $String = make(stringKeyword);
decodeUnknownEither($String)("");
