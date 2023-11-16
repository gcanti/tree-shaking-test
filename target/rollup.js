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
const make$m = (isEquivalent) => (self, that) =>
  self === that || isEquivalent(self, that);
const mapInput$1 = dual(2, (self, f) => make$m((x, y) => self(f(x), f(y))));
const array$1 = (item) =>
  make$m((self, that) => {
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
const moduleVersion = "2.0.0-next.55";
const globalStoreId = Symbol.for(
  `effect/GlobalValue/globalStoreId/${moduleVersion}`
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
const isIterable = (input) => hasProperty(input, Symbol.iterator);
const isRecord = (input) => isRecordOrArray(input) && !Array.isArray(input);
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
const randomHashCache = globalValue(
  Symbol.for("effect/Hash/randomHashCache"),
  () => new WeakMap()
);
const pcgr = globalValue(Symbol.for("effect/Hash/pcgr"), () => new PCGRandom());
const symbol$1 = Symbol.for("effect/Hash");
const hash = (self) => {
  switch (typeof self) {
    case "number":
      return number$2(self);
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
    randomHashCache.set(self, number$2(pcgr.integer(Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
const combine$3 = (b) => (self) => (self * 53) ^ b;
const optimize = (n) => (n & 3221225471) | ((n >>> 1) & 1073741824);
const isHash = (u) => hasProperty(u, symbol$1);
const number$2 = (n) => {
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
    h ^= pipe(string(keys[i]), combine$3(hash(o[keys[i]])));
  }
  return optimize(h);
};
const structure = (o) => structureKeys(o, Object.keys(o));
const array = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine$3(hash(arr[i])));
  }
  return optimize(h);
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
const equivalence = () => (self, that) => equals$1(self, that);
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
const toString = (x) => JSON.stringify(x, null, 2);
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
const StructProto = {
  [symbol$1]() {
    return structure(this);
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
const Structural = (function () {
  function Structural(args) {
    if (args) {
      Object.assign(this, args);
    }
  }
  Structural.prototype = StructProto;
  return Structural;
})();
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
  _V: moduleVersion,
};
const sinkVariance = {
  _R: (_) => _,
  _E: (_) => _,
  _In: (_) => _,
  _L: (_) => _,
  _Z: (_) => _,
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
    return random(this);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
};
const CommitPrototype = { ...EffectPrototype, _op: OP_COMMIT };
({ ...CommitPrototype, ...Structural.prototype });
const TypeId$9 = Symbol.for("effect/Option");
const CommonProto$1 = {
  ...EffectPrototype,
  [TypeId$9]: { _A: (_) => _ },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return toString(this.toJSON());
  },
};
const SomeProto = Object.assign(Object.create(CommonProto$1), {
  _tag: "Some",
  _op: "Some",
  [symbol](that) {
    return (
      isOption$1(that) && isSome$1(that) && equals$1(that.value, this.value)
    );
  },
  [symbol$1]() {
    return combine$3(hash(this._tag))(hash(this.value));
  },
  toJSON() {
    return { _id: "Option", _tag: this._tag, value: toJSON(this.value) };
  },
});
const NoneProto = Object.assign(Object.create(CommonProto$1), {
  _tag: "None",
  _op: "None",
  [symbol](that) {
    return isOption$1(that) && isNone$1(that);
  },
  [symbol$1]() {
    return combine$3(hash(this._tag));
  },
  toJSON() {
    return { _id: "Option", _tag: this._tag };
  },
});
const isOption$1 = (input) => hasProperty(input, TypeId$9);
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
  [TypeId$8]: { _A: (_) => _ },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return toString(this.toJSON());
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
    return combine$3(hash(this._tag))(hash(this.right));
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
    return combine$3(hash(this._tag))(hash(this.left));
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
const make$l = (compare) => (self, that) =>
  self === that ? 0 : compare(self, that);
const number$1 = make$l((self, that) => (self < that ? -1 : 1));
const reverse$3 = (O) => make$l((self, that) => O(that, self));
const mapInput = dual(2, (self, f) => make$l((b1, b2) => self(f(b1), f(b2))));
const all = (collection) =>
  make$l((x, y) => {
    const len = Math.min(x.length, y.length);
    let collectionLength = 0;
    for (const O of collection) {
      if (collectionLength >= len) {
        break;
      }
      const o = O(x[collectionLength], y[collectionLength]);
      if (o !== 0) {
        return o;
      }
      collectionLength++;
    }
    return 0;
  });
const tuple = (...elements) => all(elements);
const greaterThan$1 = (O) => dual(2, (self, that) => O(self, that) === 1);
const max = (O) =>
  dual(2, (self, that) => (self === that || O(self, that) > -1 ? self : that));
const none$4 = () => none$5;
const some = some$1;
const isOption = isOption$1;
const isNone = isNone$1;
const isSome = isSome$1;
const match$3 = dual(2, (self, { onNone: onNone, onSome: onSome }) =>
  isNone(self) ? onNone() : onSome(self.value)
);
const getOrElse = dual(2, (self, onNone) =>
  isNone(self) ? onNone() : self.value
);
const orElse = dual(2, (self, that) => (isNone(self) ? that() : self));
const fromNullable = (nullableValue) =>
  nullableValue == null ? none$4() : some(nullableValue);
const getOrUndefined = getOrElse(constUndefined);
const map$7 = dual(2, (self, f) =>
  isNone(self) ? none$4() : some(f(self.value))
);
const flatMap$4 = dual(2, (self, f) =>
  isNone(self) ? none$4() : f(self.value)
);
const flatten$2 = flatMap$4(identity);
const getEquivalence$3 = (isEquivalent) =>
  make$m(
    (x, y) =>
      x === y ||
      (isNone(x)
        ? isNone(y)
        : isNone(y)
        ? false
        : isEquivalent(x.value, y.value))
  );
const containsWith = (isEquivalent) =>
  dual(2, (self, a) => (isNone(self) ? false : isEquivalent(self.value, a)));
const _equivalence$2 = equivalence();
const contains = containsWith(_equivalence$2);
const right = right$1;
const left = left$1;
const isLeft = isLeft$1;
const isRight = isRight$1;
const match$2 = dual(2, (self, { onLeft: onLeft, onRight: onRight }) =>
  isLeft(self) ? onLeft(self.left) : onRight(self.right)
);
const merge$3 = match$2({ onLeft: identity, onRight: identity });
const isNonEmptyArray$1 = (self) => self.length > 0;
const makeBy = (n, f) => {
  const max = Math.max(1, Math.floor(n));
  const out = [f(0)];
  for (let i = 1; i < max; i++) {
    out.push(f(i));
  }
  return out;
};
const fromIterable$5 = (collection) =>
  Array.isArray(collection) ? collection : Array.from(collection);
const prepend$2 = dual(2, (self, head) => [head, ...self]);
const append$1 = dual(2, (self, last) => [...self, last]);
const isEmptyArray = (self) => self.length === 0;
const isEmptyReadonlyArray = isEmptyArray;
const isNonEmptyArray = isNonEmptyArray$1;
const isNonEmptyReadonlyArray = isNonEmptyArray$1;
const isOutOfBound = (i, as) => i < 0 || i >= as.length;
const get$8 = dual(2, (self, index) => {
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
const head$1 = get$8(0);
const headNonEmpty$1 = unsafeGet$3(0);
const last = (self) =>
  isNonEmptyReadonlyArray(self) ? some(lastNonEmpty(self)) : none$4();
const lastNonEmpty = (self) => self[self.length - 1];
const tailNonEmpty$1 = (self) => self.slice(1);
const reverse$2 = (self) => Array.from(self).reverse();
const sort$1 = dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
const zip$1 = dual(2, (self, that) => zipWith(self, that, (a, b) => [a, b]));
const zipWith = dual(3, (self, that, f) => {
  const as = fromIterable$5(self);
  const bs = fromIterable$5(that);
  return isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)
    ? zipNonEmptyWith(bs, f)(as)
    : [];
});
const zipNonEmptyWith = dual(3, (self, that, f) => {
  const cs = [f(headNonEmpty$1(self), headNonEmpty$1(that))];
  const len = Math.min(self.length, that.length);
  for (let i = 1; i < len; i++) {
    cs[i] = f(self[i], that[i]);
  }
  return cs;
});
const dedupeNonEmptyWith = dual(2, (self, isEquivalent) => {
  const out = [headNonEmpty$1(self)];
  const rest = tailNonEmpty$1(self);
  for (const a of rest) {
    if (out.every((o) => !isEquivalent(a, o))) {
      out.push(a);
    }
  }
  return out;
});
const empty$f = () => [];
const of$2 = (a) => [a];
const map$6 = dual(2, (self, f) => self.map(f));
const flatMap$3 = dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    out.push(...f(self[i], i));
  }
  return out;
});
const flatten$1 = flatMap$3(identity);
const reduce$6 = dual(3, (self, b, f) =>
  fromIterable$5(self).reduce((b, a, i) => f(b, a, i), b)
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
  const input = fromIterable$5(self);
  return isNonEmptyReadonlyArray(input)
    ? dedupeNonEmptyWith(isEquivalent)(input)
    : [];
});
const dedupe$1 = dedupeWith(equivalence());
const join = dual(2, (self, sep) => fromIterable$5(self).join(sep));
const TypeId$7 = Symbol.for("effect/Chunk");
function copy(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
const emptyArray = [];
const getEquivalence$1 = (isEquivalent) =>
  make$m(
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
    return toString(this.toJSON());
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
    return array(toReadonlyArray(this));
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
      chunk.left = _empty$5;
      chunk.right = _empty$5;
      break;
    }
    case "ISingleton": {
      chunk.length = 1;
      chunk.depth = 0;
      chunk.left = _empty$5;
      chunk.right = _empty$5;
      break;
    }
    case "ISlice": {
      chunk.length = backing.length;
      chunk.depth = backing.chunk.depth + 1;
      chunk.left = _empty$5;
      chunk.right = _empty$5;
      break;
    }
  }
  return chunk;
};
const isChunk = (u) => hasProperty(u, TypeId$7);
const _empty$5 = makeChunk({ _tag: "IEmpty" });
const empty$e = () => _empty$5;
const of$1 = (a) => makeChunk({ _tag: "ISingleton", a: a });
const fromIterable$4 = (self) =>
  isChunk(self)
    ? self
    : makeChunk({ _tag: "IArray", array: fromIterable$5(self) });
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
      self.left = _empty$5;
      self.right = _empty$5;
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
const get$7 = dual(2, (self, index) =>
  index < 0 || index >= self.length ? none$4() : some(unsafeGet$2(self, index))
);
const unsafeFromArray = (self) => makeChunk({ _tag: "IArray", array: self });
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
const append = dual(2, (self, a) => appendAllNonEmpty(self, of$1(a)));
const prepend$1 = dual(2, (self, elem) => appendAllNonEmpty(of$1(elem), self));
const take = dual(2, (self, n) => {
  if (n <= 0) {
    return _empty$5;
  } else if (n >= self.length) {
    return self;
  } else {
    switch (self.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self.backing.chunk,
          length: n,
          offset: self.backing.offset,
        });
      }
      case "IConcat": {
        if (n > self.left.length) {
          return makeChunk({
            _tag: "IConcat",
            left: self.left,
            right: take(self.right, n - self.left.length),
          });
        }
        return take(self.left, n);
      }
      default: {
        return makeChunk({ _tag: "ISlice", chunk: self, offset: 0, length: n });
      }
    }
  }
});
const drop = dual(2, (self, n) => {
  if (n <= 0) {
    return self;
  } else if (n >= self.length) {
    return _empty$5;
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
const appendAllNonEmpty = dual(2, (self, that) => appendAll$1(self, that));
const isEmpty$3 = (self) => self.length === 0;
const isNonEmpty = (self) => self.length > 0;
const head = get$7(0);
const unsafeHead = (self) => unsafeGet$2(self, 0);
const headNonEmpty = unsafeHead;
const unsafeLast = (self) => unsafeGet$2(self, self.length - 1);
const map$5 = dual(2, (self, f) =>
  self.backing._tag === "ISingleton"
    ? of$1(f(self.backing.a, 0))
    : unsafeFromArray(
        pipe(
          toReadonlyArray(self),
          map$6((a, i) => f(a, i))
        )
      )
);
const sort = dual(2, (self, O) =>
  unsafeFromArray(sort$1(toReadonlyArray(self), O))
);
const splitAt = dual(2, (self, n) => [take(self, n), drop(self, n)]);
const splitWhere = dual(2, (self, predicate) => {
  let i = 0;
  for (const a of toReadonlyArray(self)) {
    if (predicate(a)) {
      break;
    } else {
      i++;
    }
  }
  return splitAt(self, i);
});
const tailNonEmpty = (self) => drop(self, 1);
const dedupe = (self) => unsafeFromArray(dedupe$1(toReadonlyArray(self)));
const TagTypeId = Symbol.for("effect/Context/Tag");
const STMSymbolKey = "effect/STM";
const STMTypeId = Symbol.for(STMSymbolKey);
const TagProto = {
  ...EffectPrototype,
  _tag: "Tag",
  _op: "Tag",
  [STMTypeId]: effectVariance,
  [TagTypeId]: { _S: (_) => _, _I: (_) => _ },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return { _id: "Tag", identifier: this.identifier, stack: this.stack };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self) {
    return self;
  },
  context(self) {
    return make$k(this, self);
  },
};
const tagRegistry = globalValue(
  "effect/Context/Tag/tagRegistry",
  () => new Map()
);
const makeTag = (identifier) => {
  if (identifier && tagRegistry.has(identifier)) {
    return tagRegistry.get(identifier);
  }
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
  if (identifier) {
    tag.identifier = identifier;
    tagRegistry.set(identifier, tag);
  }
  return tag;
};
const TypeId$6 = Symbol.for("effect/Context");
const ContextProto = {
  [TypeId$6]: { _S: (_) => _ },
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
    return number$2(this.unsafeMap.size);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return toString(this.toJSON());
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
    `Service not found${tag.identifier ? `: ${String(tag.identifier)}` : ""}`
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
const _empty$4 = makeContext(new Map());
const empty$d = () => _empty$4;
const make$k = (tag, service) => makeContext(new Map([[tag, service]]));
const add$3 = dual(3, (self, tag, service) => {
  const map = new Map(self.unsafeMap);
  map.set(tag, service);
  return makeContext(map);
});
const unsafeGet$1 = dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    throw serviceNotFoundError(tag);
  }
  return self.unsafeMap.get(tag);
});
const get$6 = unsafeGet$1;
const getOption$1 = dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    return none$5;
  }
  return some$1(self.unsafeMap.get(tag));
});
const merge$2 = dual(2, (self, that) => {
  const map = new Map(self.unsafeMap);
  for (const [tag, s] of that.unsafeMap) {
    map.set(tag, s);
  }
  return makeContext(map);
});
const Tag = makeTag;
const empty$c = empty$d;
const make$j = make$k;
const add$2 = add$3;
const get$5 = get$6;
const unsafeGet = unsafeGet$1;
const getOption = getOption$1;
const merge$1 = merge$2;
const TypeId$5 = Symbol.for("effect/Duration");
const bigint1e3 = BigInt(1e3);
const bigint1e9 = BigInt(1e9);
const DURATION_REGEX =
  /^(-?\d+(?:\.\d+)?)\s+(nanos|micros|millis|seconds|minutes|hours|days|weeks)$/;
const decode = (input) => {
  if (isDuration(input)) {
    return input;
  } else if (isNumber(input)) {
    return millis(input);
  } else if (isBigInt(input)) {
    return nanos(input);
  } else {
    DURATION_REGEX.lastIndex = 0;
    const match = DURATION_REGEX.exec(input);
    if (match) {
      const [_, valueStr, unit] = match;
      const value = Number(valueStr);
      switch (unit) {
        case "nanos":
          return nanos(BigInt(valueStr));
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
};
const zeroValue = { _tag: "Millis", millis: 0 };
const infinityValue = { _tag: "Infinity" };
const DurationProto = {
  [TypeId$5]: TypeId$5,
  [symbol$1]() {
    return structure(this.value);
  },
  [symbol](that) {
    return isDuration(that) && equals(this, that);
  },
  toString() {
    return toString(this.toJSON());
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
const make$i = (input) => {
  const duration = Object.create(DurationProto);
  if (isNumber(input)) {
    if (isNaN(input) || input < 0) {
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
  } else if (input < BigInt(0)) {
    duration.value = zeroValue;
  } else {
    duration.value = { _tag: "Nanos", nanos: input };
  }
  return duration;
};
const isDuration = (u) => hasProperty(u, TypeId$5);
const zero = make$i(0);
const nanos = (nanos) => make$i(nanos);
const micros = (micros) => make$i(micros * bigint1e3);
const millis = (millis) => make$i(millis);
const seconds = (seconds) => make$i(seconds * 1e3);
const minutes = (minutes) => make$i(minutes * 6e4);
const hours = (hours) => make$i(hours * 36e5);
const days = (days) => make$i(days * 864e5);
const weeks = (weeks) => make$i(weeks * 6048e5);
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
class Stack {
  value;
  previous;
  constructor(value, previous) {
    this.value = value;
    this.previous = previous;
  }
}
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
      stack = new Stack(res, stack);
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
      hash$1 ^= pipe(hash(item[0]), combine$3(hash(item[1])));
    }
    return hash$1;
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
    return toString(this.toJSON());
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
const _empty$3 = makeImpl$1(false, 0, new EmptyNode(), 0);
const empty$b = () => _empty$3;
const make$h = (...entries) => fromIterable$3(entries);
const fromIterable$3 = (entries) => {
  const map = beginMutation$1(empty$b());
  for (const entry of entries) {
    set$4(map, entry[0], entry[1]);
  }
  return endMutation$1(map);
};
const isHashMap = (u) => hasProperty(u, HashMapTypeId);
const isEmpty$2 = (self) => self && isEmptyNode(self._root);
const get$4 = dual(2, (self, key) => getHash(self, key, hash(key)));
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
const set$4 = dual(3, (self, key, value) =>
  modifyAt(self, key, () => some(value))
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
const modifyAt = dual(3, (self, key, f) => modifyHash(self, key, hash(key), f));
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
const remove$2 = dual(2, (self, key) => modifyAt(self, key, none$4));
const map$4 = dual(2, (self, f) =>
  reduce$5(self, empty$b(), (map, value, key) => set$4(map, key, f(value, key)))
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
    return combine$3(hash(this._keyMap))(hash(HashSetSymbolKey));
  },
  [symbol](that) {
    if (isHashSet$1(that)) {
      return (
        size$3(this._keyMap) === size$3(that._keyMap) &&
        equals$1(this._keyMap, that._keyMap)
      );
    }
    return false;
  },
  toString() {
    return toString(this.toJSON());
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
const isHashSet$1 = (u) => hasProperty(u, HashSetTypeId);
const _empty$2 = makeImpl(empty$b());
const empty$a = () => _empty$2;
const fromIterable$2 = (elements) => {
  const set = beginMutation(empty$a());
  for (const value of elements) {
    add$1(set, value);
  }
  return endMutation(set);
};
const make$g = (...elements) => {
  const set = beginMutation(empty$a());
  for (const value of elements) {
    add$1(set, value);
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
const add$1 = dual(2, (self, value) =>
  self._keyMap._editable
    ? (set$4(value, true)(self._keyMap), self)
    : makeImpl(set$4(value, true)(self._keyMap))
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
const union$2 = dual(2, (self, that) =>
  mutate(empty$a(), (set) => {
    forEach$2(self, (value) => add$1(set, value));
    for (const value of that) {
      add$1(set, value);
    }
  })
);
const forEach$2 = dual(2, (self, f) => forEach$3(self._keyMap, (_, k) => f(k)));
const reduce$4 = dual(3, (self, zero, f) =>
  reduce$5(self._keyMap, zero, (z, _, a) => f(z, a))
);
const isHashSet = isHashSet$1;
const empty$9 = empty$a;
const fromIterable$1 = fromIterable$2;
const make$f = make$g;
const has$1 = has$2;
const size$1 = size$2;
const add = add$1;
const remove = remove$1;
const difference = difference$1;
const union$1 = union$2;
const reduce$3 = reduce$4;
const TypeId$4 = Symbol.for("effect/MutableRef");
const MutableRefProto = {
  [TypeId$4]: TypeId$4,
  toString() {
    return toString(this.toJSON());
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
const make$e = (value) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value;
  return ref;
};
const get$3 = (self) => self.current;
const incrementAndGet = (self) => updateAndGet(self, (n) => n + 1);
const set$3 = dual(2, (self, value) => {
  self.current = value;
  return self;
});
const setAndGet = dual(2, (self, value) => {
  self.current = value;
  return self.current;
});
const update$1 = dual(2, (self, f) => set$3(self, f(get$3(self))));
const updateAndGet = dual(2, (self, f) => setAndGet(self, f(get$3(self))));
const FiberIdSymbolKey = "effect/FiberId";
const FiberIdTypeId = Symbol.for(FiberIdSymbolKey);
const OP_NONE = "None";
const OP_RUNTIME = "Runtime";
const OP_COMPOSITE = "Composite";
let None$2 = class None {
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_NONE;
  [symbol$1]() {
    return pipe(hash(FiberIdSymbolKey), combine$3(hash(this._tag)));
  }
  [symbol](that) {
    return isFiberId(that) && that._tag === OP_NONE;
  }
  toString() {
    return toString(this.toJSON());
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
    return pipe(
      hash(FiberIdSymbolKey),
      combine$3(hash(this._tag)),
      combine$3(hash(this.id)),
      combine$3(hash(this.startTimeMillis))
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
    return toString(this.toJSON());
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
const ids$1 = (self) => {
  switch (self._tag) {
    case OP_NONE: {
      return empty$9();
    }
    case OP_RUNTIME: {
      return make$f(self.id);
    }
    case OP_COMPOSITE: {
      return pipe(ids$1(self.left), union$1(ids$1(self.right)));
    }
  }
};
const _fiberCounter = globalValue(
  Symbol.for("effect/Fiber/Id/_fiberCounter"),
  () => make$e(0)
);
const threadName$1 = (self) => {
  const identifiers = Array.from(ids$1(self))
    .map((n) => `#${n}`)
    .join(",");
  return identifiers;
};
const unsafeMake$3 = () => {
  const id = get$3(_fiberCounter);
  pipe(_fiberCounter, set$3(id + 1));
  return new Runtime(id, new Date().getTime());
};
const none$2 = none$3;
const threadName = threadName$1;
const unsafeMake$2 = unsafeMake$3;
const empty$8 = empty$b;
const make$d = make$h;
const fromIterable = fromIterable$3;
const isEmpty$1 = isEmpty$2;
const get$2 = get$4;
const set$2 = set$4;
const keys = keys$1;
const size = size$3;
const map$3 = map$4;
const reduce$2 = reduce$5;
const TypeId$3 = Symbol.for("effect/List");
const toArray = (self) => Array.from(self);
const getEquivalence = (isEquivalent) =>
  mapInput$1(getEquivalence$2(isEquivalent), toArray);
const _equivalence = getEquivalence(equals$1);
const ConsProto = {
  [TypeId$3]: TypeId$3,
  _tag: "Cons",
  toString() {
    return toString(this.toJSON());
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
    return array(toArray(this));
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
const NilProto = {
  [TypeId$3]: TypeId$3,
  _tag: "Nil",
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return { _id: "List", _tag: "Nil" };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol$1]() {
    return array(toArray(this));
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
const isList = (u) => hasProperty(u, TypeId$3);
const isNil = (self) => self._tag === "Nil";
const isCons = (self) => self._tag === "Cons";
const nil = () => _Nil;
const cons = (head, tail) => makeCons(head, tail);
const empty$7 = nil;
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
const reduce$1 = dual(3, (self, zero, f) => {
  let acc = zero;
  let these = self;
  while (!isNil(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
const reverse = (self) => {
  let result = empty$7();
  let these = self;
  while (!isNil(these)) {
    result = prepend(result, these.head);
    these = these.tail;
  }
  return result;
};
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
const PatchProto$1 = {
  ...Structural.prototype,
  [ContextPatchTypeId]: { _Value: variance$5, _Patch: variance$5 },
};
const EmptyProto$1 = Object.assign(Object.create(PatchProto$1), {
  _tag: "Empty",
});
const _empty$1 = Object.create(EmptyProto$1);
const empty$6 = () => _empty$1;
const AndThenProto$1 = Object.assign(Object.create(PatchProto$1), {
  _tag: "AndThen",
});
const makeAndThen$1 = (first, second) => {
  const o = Object.create(AndThenProto$1);
  o.first = first;
  o.second = second;
  return o;
};
const AddServiceProto = Object.assign(Object.create(PatchProto$1), {
  _tag: "AddService",
});
const makeAddService = (tag, service) => {
  const o = Object.create(AddServiceProto);
  o.tag = tag;
  o.service = service;
  return o;
};
const RemoveServiceProto = Object.assign(Object.create(PatchProto$1), {
  _tag: "RemoveService",
});
const makeRemoveService = (tag) => {
  const o = Object.create(RemoveServiceProto);
  o.tag = tag;
  return o;
};
const UpdateServiceProto = Object.assign(Object.create(PatchProto$1), {
  _tag: "UpdateService",
});
const makeUpdateService = (tag, update) => {
  const o = Object.create(UpdateServiceProto);
  o.tag = tag;
  o.update = update;
  return o;
};
const diff$3 = (oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch = empty$6();
  for (const [tag, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag)) {
      const old = missingServices.get(tag);
      missingServices.delete(tag);
      if (!equals$1(old, newService)) {
        patch = combine$2(makeUpdateService(tag, () => newService))(patch);
      }
    } else {
      missingServices.delete(tag);
      patch = combine$2(makeAddService(tag, newService))(patch);
    }
  }
  for (const [tag] of missingServices.entries()) {
    patch = combine$2(makeRemoveService(tag))(patch);
  }
  return patch;
};
const combine$2 = dual(2, (self, that) => makeAndThen$1(self, that));
const patch$4 = dual(2, (self, context) => {
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
        updatedContext.set(head.tag, head.service);
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend$1(prepend$1(tail, head.second), head.first);
        break;
      }
      case "RemoveService": {
        updatedContext.delete(head.tag);
        patches = tail;
        break;
      }
      case "UpdateService": {
        updatedContext.set(head.tag, head.update(updatedContext.get(head.tag)));
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
const PatchProto = {
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance$3,
    _Key: variance$3,
    _Patch: variance$3,
  },
};
const EmptyProto = Object.assign(Object.create(PatchProto), { _tag: "Empty" });
const _empty = Object.create(EmptyProto);
const empty$5 = () => _empty;
const AndThenProto = Object.assign(Object.create(PatchProto), {
  _tag: "AndThen",
});
const makeAndThen = (first, second) => {
  const o = Object.create(AndThenProto);
  o.first = first;
  o.second = second;
  return o;
};
const AddProto = Object.assign(Object.create(PatchProto), { _tag: "Add" });
const makeAdd = (value) => {
  const o = Object.create(AddProto);
  o.value = value;
  return o;
};
const RemoveProto = Object.assign(Object.create(PatchProto), {
  _tag: "Remove",
});
const makeRemove = (value) => {
  const o = Object.create(RemoveProto);
  o.value = value;
  return o;
};
const diff$2 = (oldValue, newValue) => {
  const [removed, patch] = reduce$3(
    [oldValue, empty$5()],
    ([set, patch], value) => {
      if (has$1(value)(set)) {
        return [remove(value)(set), patch];
      }
      return [set, combine$1(makeAdd(value))(patch)];
    }
  )(newValue);
  return reduce$3(patch, (patch, value) => combine$1(makeRemove(value))(patch))(
    removed
  );
};
const combine$1 = dual(2, (self, that) => makeAndThen(self, that));
const patch$3 = dual(2, (self, oldValue) => {
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
        set = add(head.value)(set);
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
const DifferTypeId = Symbol.for("effect/Differ");
const DifferProto = { [DifferTypeId]: { _P: identity, _V: identity } };
const make$c = (params) => {
  const differ = Object.create(DifferProto);
  differ.empty = params.empty;
  differ.diff = params.diff;
  differ.combine = params.combine;
  differ.patch = params.patch;
  return differ;
};
const environment = () =>
  make$c({
    empty: empty$6(),
    combine: (first, second) => combine$2(second)(first),
    diff: (oldValue, newValue) => diff$3(oldValue, newValue),
    patch: (patch, oldValue) => patch$4(oldValue)(patch),
  });
const hashSet = () =>
  make$c({
    empty: empty$5(),
    combine: (first, second) => combine$1(second)(first),
    diff: (oldValue, newValue) => diff$2(oldValue, newValue),
    patch: (patch, oldValue) => patch$3(oldValue)(patch),
  });
const update = () => updateWith((_, a) => a);
const updateWith = (f) =>
  make$c({
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
const make$b = (active, enabled) =>
  (active & BIT_MASK) + ((enabled & active & BIT_MASK) << BIT_SHIFT);
const empty$4 = make$b(0, 0);
const enable$2 = (flag) => make$b(flag, flag);
const disable$1 = (flag) => make$b(flag, 0);
const exclude$1 = dual(2, (self, flag) =>
  make$b(active(self) & ~flag, enabled(self))
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
const make$a = (...flags) => flags.reduce((a, b) => a | b, 0);
const none$1 = make$a(None$1);
const runtimeMetrics = (self) => isEnabled(self, RuntimeMetrics);
const windDown = (self) => isEnabled(self, WindDown);
const diff$1 = dual(2, (self, that) => make$b(self ^ that, that));
const patch$2 = dual(
  2,
  (self, patch) =>
    (self & (invert(active(patch)) | enabled(patch))) |
    (active(patch) & enabled(patch))
);
const differ$1 = make$c({
  empty: empty$4,
  diff: (oldValue, newValue) => diff$1(oldValue, newValue),
  combine: (first, second) => andThen(second)(first),
  patch: (_patch, oldValue) => patch$2(oldValue, _patch),
});
const enable = enable$2;
const disable = disable$1;
const exclude = exclude$1;
const par = (self, that) => ({ _tag: "Par", left: self, right: that });
const seq = (self, that) => ({ _tag: "Seq", left: self, right: that });
const flatten = (self) => {
  let current = of(self);
  let updated = empty$7();
  while (1) {
    const [parallel, sequential] = reduce$1(
      current,
      [parallelCollectionEmpty(), empty$7()],
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
  let stack = empty$7();
  let sequential = empty$7();
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
        parallel = parallelCollectionCombine(
          parallel,
          parallelCollectionMake(current.dataSource, current.blockedRequest)
        );
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
const parallelCollectionEmpty = () => new ParallelImpl(empty$8());
const parallelCollectionMake = (dataSource, blockedRequest) =>
  new ParallelImpl(make$d([dataSource, Array.of(blockedRequest)]));
const parallelCollectionCombine = (self, that) =>
  new ParallelImpl(
    reduce$2(self.map, that.map, (map, value, key) =>
      set$2(
        map,
        key,
        match$3(get$2(map, key), {
          onNone: () => value,
          onSome: (a) => [...a, ...value],
        })
      )
    )
  );
const parallelCollectionIsEmpty = (self) => isEmpty$1(self.map);
const parallelCollectionKeys = (self) => Array.from(keys(self.map));
const parallelCollectionToSequentialCollection = (self) =>
  sequentialCollectionMake(map$3(self.map, (x) => Array.of(x)));
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
    reduce$2(that.map, self.map, (map, value, key) =>
      set$2(
        map,
        key,
        match$3(get$2(map, key), {
          onNone: () => [],
          onSome: (a) => [...a, ...value],
        })
      )
    )
  );
const sequentialCollectionKeys = (self) => Array.from(keys(self.map));
const sequentialCollectionToChunk = (self) => Array.from(self.map);
const OP_DIE = "Die";
const OP_EMPTY$1 = "Empty";
const OP_FAIL$1 = "Fail";
const OP_INTERRUPT = "Interrupt";
const OP_PARALLEL$1 = "Parallel";
const OP_SEQUENTIAL$1 = "Sequential";
const CauseSymbolKey = "effect/Cause";
const CauseTypeId = Symbol.for(CauseSymbolKey);
const variance$1 = { _E: (_) => _ };
const proto$1 = {
  [CauseTypeId]: variance$1,
  [symbol$1]() {
    return pipe(hash(CauseSymbolKey), combine$3(hash(flattenCause(this))));
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
const empty$3 = (() => {
  const o = Object.create(proto$1);
  o._tag = OP_EMPTY$1;
  return o;
})();
const fail$2 = (error) => {
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
const isEmpty = (self) => {
  if (self._tag === OP_EMPTY$1) {
    return true;
  }
  return reduce(self, true, (acc, cause) => {
    switch (cause._tag) {
      case OP_EMPTY$1: {
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
const isInterruptedOnly = (self) =>
  reduceWithContext(undefined, IsInterruptedOnlyCauseReducer)(self);
const failures$1 = (self) =>
  reverse$1(
    reduce(self, empty$e(), (list, cause) =>
      cause._tag === OP_FAIL$1
        ? some(pipe(list, prepend$1(cause.error)))
        : none$4()
    )
  );
const defects = (self) =>
  reverse$1(
    reduce(self, empty$e(), (list, cause) =>
      cause._tag === OP_DIE
        ? some(pipe(list, prepend$1(cause.defect)))
        : none$4()
    )
  );
const interruptors = (self) =>
  reduce(self, empty$9(), (set, cause) =>
    cause._tag === OP_INTERRUPT ? some(pipe(set, add(cause.fiberId))) : none$4()
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
const stripFailures = (self) =>
  match$1(self, {
    onEmpty: empty$3,
    onFail: () => empty$3,
    onDie: (defect) => die(defect),
    onInterrupt: (fiberId) => interrupt(fiberId),
    onSequential: sequential$2,
    onParallel: parallel$2,
  });
const electFailures = (self) =>
  match$1(self, {
    onEmpty: empty$3,
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
      reduce([empty$9(), empty$e()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return some([
          pipe(parallel, union$1(par)),
          pipe(sequential, appendAll$1(seq)),
        ]);
      })
    );
    const [rightParallel, rightSequential] = pipe(
      headNonEmpty(rightStack),
      reduce([empty$9(), empty$e()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return some([
          pipe(parallel, union$1(par)),
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
const flattenCause = (cause) => flattenCauseLoop(of$1(cause), empty$e());
const flattenCauseLoop = (causes, flattened) => {
  while (1) {
    const [parallel, sequential] = pipe(
      causes,
      reduce$6([empty$9(), empty$e()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return [
          pipe(parallel, union$1(par)),
          pipe(sequential, appendAll$1(seq)),
        ];
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
  throw new Error(
    "BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/effect/issues"
  );
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
  let _parallel = empty$9();
  let _sequential = empty$e();
  while (cause !== undefined) {
    switch (cause._tag) {
      case OP_EMPTY$1: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL$1: {
        _parallel = add(_parallel, cause.error);
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_DIE: {
        _parallel = add(_parallel, cause.defect);
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        _parallel = add(_parallel, cause.fiberId);
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL$1: {
        switch (cause.left._tag) {
          case OP_EMPTY$1: {
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
  throw new Error(
    "BUG: Cause.evaluateCauseLoop - please report an issue at https://github.com/Effect-TS/effect/issues"
  );
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
const reduce = dual(3, (self, zero, pf) => {
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
      case OP_EMPTY$1: {
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
const makeException = (proto, tag) => {
  const _tag = { value: tag, enumerable: true };
  const protoWithToString = {
    ...proto,
    toString() {
      return `${this._tag}: ${this.message}`;
    },
  };
  return (message) => {
    const properties = { _tag: _tag };
    if (isString(message)) {
      properties["message"] = { value: message, enumerable: true };
    }
    return Object.create(protoWithToString, properties);
  };
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
const filterStack = (stack) => {
  const lines = stack.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].includes("EffectPrimitive") ||
      lines[i].includes("Generator.next") ||
      lines[i].includes("FiberRuntime")
    ) {
      return out.join("\n");
    } else {
      out.push(lines[i]);
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
  if (
    hasProperty(u, "toString") &&
    isFunction(u["toString"]) &&
    u["toString"] !== Object.prototype.toString
  ) {
    return u["toString"]();
  }
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
const OP_STATE_PENDING = "Pending";
const OP_STATE_DONE = "Done";
const DeferredSymbolKey = "effect/Deferred";
const DeferredTypeId = Symbol.for(DeferredSymbolKey);
const deferredVariance = { _E: (_) => _, _A: (_) => _ };
const pending = (joiners) => ({ _tag: OP_STATE_PENDING, joiners: joiners });
const done$2 = (effect) => ({ _tag: OP_STATE_DONE, effect: effect });
const TracerTypeId = Symbol.for("effect/Tracer");
const make$9 = (options) => ({ [TracerTypeId]: TracerTypeId, ...options });
const tracerTag = Tag(Symbol.for("effect/Tracer"));
const spanTag = Tag(Symbol.for("effect/ParentSpan"));
const ids = globalValue("effect/Tracer/SpanId.ids", () => make$e(0));
class NativeSpan {
  name;
  parent;
  context;
  links;
  startTime;
  _tag = "Span";
  spanId;
  traceId = "native";
  sampled = true;
  status;
  attributes;
  events = [];
  constructor(name, parent, context, links, startTime) {
    this.name = name;
    this.parent = parent;
    this.context = context;
    this.links = links;
    this.startTime = startTime;
    this.status = { _tag: "Started", startTime: startTime };
    this.attributes = new Map();
    this.spanId = `span${incrementAndGet(ids)}`;
  }
  end = (endTime, exit) => {
    this.status = {
      _tag: "Ended",
      endTime: endTime,
      exit: exit,
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
const nativeTracer = make$9({
  span: (name, parent, context, links, startTime) =>
    new NativeSpan(name, parent, context, links, startTime),
  context: (f) => f(),
});
const EffectErrorSymbolKey = "effect/EffectError";
const EffectErrorTypeId = Symbol.for(EffectErrorSymbolKey);
const isEffectError = (u) => hasProperty(u, EffectErrorTypeId);
const blocked = (blockedRequests, _continue) => {
  const effect = new EffectPrimitive("Blocked");
  effect.i0 = blockedRequests;
  effect.i1 = _continue;
  return effect;
};
const runRequestBlock = (blockedRequests) => {
  const effect = new EffectPrimitive("RunBlocked");
  effect.i0 = blockedRequests;
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
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
  trace = undefined;
  [EffectTypeId$1] = effectVariance;
  constructor(_op) {
    this._op = _op;
  }
  [symbol](that) {
    return this === that;
  }
  [symbol$1]() {
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
    return toString(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
class EffectPrimitiveFailure {
  _op;
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
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
    return toString(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
class EffectPrimitiveSuccess {
  _op;
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
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
    return toString(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
const isEffect = (u) => hasProperty(u, EffectTypeId$1);
const withFiberRuntime = (withRuntime) => {
  const effect = new EffectPrimitive(OP_WITH_RUNTIME);
  effect.i0 = withRuntime;
  return effect;
};
const acquireUseRelease = dual(3, (acquire, use, release) =>
  uninterruptibleMask((restore) =>
    flatMap$2(acquire, (a) =>
      flatMap$2(exit(suspend$1(() => restore(step(use(a))))), (exit) => {
        if (exit._tag === "Success" && exit.value._op === "Blocked") {
          const value = exit.value;
          return blocked(
            value.i0,
            acquireUseRelease(succeed(a), () => value.i1, release)
          );
        }
        const flat = exitFlatten(exit);
        return suspend$1(() => release(a, flat)).pipe(
          matchCauseEffect({
            onFailure: (cause) => {
              switch (flat._tag) {
                case OP_FAILURE: {
                  return failCause(parallel$2(flat.i0, cause));
                }
                case OP_SUCCESS: {
                  return failCause(cause);
                }
              }
            },
            onSuccess: () => flat,
          })
        );
      })
    )
  )
);
const as = dual(2, (self, value) => flatMap$2(self, () => succeed(value)));
const asUnit = (self) => as(self, void 0);
const async = (register, blockingOn = none$2) =>
  suspend$1(() => {
    let cancelerRef = undefined;
    let controllerRef = undefined;
    const effect = new EffectPrimitive(OP_ASYNC);
    if (register.length !== 1) {
      const controller = new AbortController();
      controllerRef = controller;
      effect.i0 = (resume) => {
        cancelerRef = register(resume, controller.signal);
      };
    } else {
      effect.i0 = (resume) => {
        cancelerRef = register(resume);
      };
    }
    effect.i1 = blockingOn;
    return onInterrupt(effect, () => {
      if (controllerRef) {
        controllerRef.abort();
      }
      return cancelerRef ?? unit$1;
    });
  });
const asyncEither = (register, blockingOn = none$2) =>
  async((resume) => {
    const result = register(resume);
    if (isRight(result)) {
      resume(result.right);
    } else {
      return result.left;
    }
  }, blockingOn);
const catchAllCause = dual(2, (self, f) => {
  const effect = new EffectPrimitive(OP_ON_FAILURE);
  effect.i0 = self;
  effect.i1 = f;
  return effect;
});
const catchAll = dual(2, (self, f) =>
  matchEffect(self, { onFailure: f, onSuccess: succeed })
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
  failCauseSync(() => die(RuntimeException(message)));
const either$1 = (self) =>
  matchEffect(self, {
    onFailure: (e) => succeed(left(e)),
    onSuccess: (a) => succeed(right(a)),
  });
const exit = (self) =>
  matchCause(self, { onFailure: exitFailCause, onSuccess: exitSucceed });
const fail$1 = (error) =>
  isObject(error) && !(spanSymbol in error)
    ? withFiberRuntime((fiber) =>
        failCause(fail$2(capture(error, currentSpanFromFiber(fiber))))
      )
    : failCause(fail$2(error));
const failSync = (evaluate) => flatMap$2(sync(evaluate), fail$1);
const failCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
const failCauseSync = (evaluate) => flatMap$2(sync(evaluate), failCause);
const fiberId = withFiberRuntime((state) => succeed(state.id()));
const fiberIdWith = (f) => withFiberRuntime((state) => f(state.id()));
const flatMap$2 = dual(2, (self, f) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS);
  effect.i0 = self;
  effect.i1 = f;
  return effect;
});
const step = (self) => {
  const effect = new EffectPrimitive("OnStep");
  effect.i0 = self;
  effect.i1 = exitSucceed;
  return effect;
};
const flatMapStep = (self, f) => {
  const effect = new EffectPrimitive("OnStep");
  effect.i0 = self;
  effect.i1 = f;
  return effect;
};
const matchCause = dual(
  2,
  (self, { onFailure: onFailure, onSuccess: onSuccess }) =>
    matchCauseEffect(self, {
      onFailure: (cause) => succeed(onFailure(cause)),
      onSuccess: (a) => succeed(onSuccess(a)),
    })
);
const matchCauseEffect = dual(
  2,
  (self, { onFailure: onFailure, onSuccess: onSuccess }) => {
    const effect = new EffectPrimitive(OP_ON_SUCCESS_AND_FAILURE);
    effect.i0 = self;
    effect.i1 = onFailure;
    effect.i2 = onSuccess;
    return effect;
  }
);
const matchEffect = dual(
  2,
  (self, { onFailure: onFailure, onSuccess: onSuccess }) =>
    matchCauseEffect(self, {
      onFailure: (cause) => {
        const failures = failures$1(cause);
        const defects$1 = defects(cause);
        if (defects$1.length > 0) {
          return failCause(electFailures(cause));
        }
        if (failures.length > 0) {
          return onFailure(unsafeHead(failures));
        }
        return failCause(cause);
      },
      onSuccess: onSuccess,
    })
);
const forEachSequential = dual(2, (self, f) =>
  suspend$1(() => {
    const arr = fromIterable$5(self);
    const ret = new Array(arr.length);
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
    const arr = fromIterable$5(self);
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
  effect.i0 = enable(Interruption);
  const _continue = (orBlock) => {
    if (orBlock._tag === "Blocked") {
      return blocked(orBlock.i0, interruptible(orBlock.i1));
    } else {
      return orBlock;
    }
  };
  effect.i1 = () => flatMapStep(self, _continue);
  return effect;
};
const map$2 = dual(2, (self, f) => flatMap$2(self, (a) => sync(() => f(a))));
const mapBoth = dual(
  2,
  (self, { onFailure: onFailure, onSuccess: onSuccess }) =>
    matchEffect(self, {
      onFailure: (e) => failSync(() => onFailure(e)),
      onSuccess: (a) => sync(() => onSuccess(a)),
    })
);
const mapError = dual(2, (self, f) =>
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
    onSuccess: succeed,
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
        isInterruptedOnly(cause)
          ? asUnit(cleanup(interruptors(cause)))
          : unit$1,
      onSuccess: () => unit$1,
    })
  )
);
const succeed = (value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
const suspend$1 = (effect) => flatMap$2(sync(effect), identity);
const sync = (evaluate) => {
  const effect = new EffectPrimitive(OP_SYNC);
  effect.i0 = evaluate;
  return effect;
};
const tap = dual(2, (self, f) => flatMap$2(self, (a) => as(f(a), a)));
const transplant = (f) =>
  withFiberRuntime((state) => {
    const scopeOverride = state.getFiberRef(currentForkScopeOverride);
    const scope = pipe(
      scopeOverride,
      getOrElse(() => state.scope())
    );
    return f(fiberRefLocally(currentForkScopeOverride, some(scope)));
  });
const uninterruptible = (self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = disable(Interruption);
  effect.i1 = () => flatMapStep(self, _continue);
  const _continue = (orBlock) => {
    if (orBlock._tag === "Blocked") {
      return blocked(orBlock.i0, uninterruptible(orBlock.i1));
    } else {
      return orBlock;
    }
  };
  return effect;
};
const uninterruptibleMask = (f) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = disable(Interruption);
  const _continue = (step) => {
    if (step._op === "Blocked") {
      return blocked(step.i0, uninterruptible(step.i1));
    }
    return step;
  };
  effect.i1 = (oldFlags) =>
    interruption(oldFlags) ? step(f(interruptible)) : step(f(uninterruptible));
  return flatMap$2(effect, _continue);
};
const unit$1 = succeed(void 0);
const updateRuntimeFlags = (patch) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = patch;
  effect.i1 = void 0;
  return effect;
};
const whileLoop = (options) => {
  const effect = new EffectPrimitive(OP_WHILE);
  effect.i0 = options.while;
  effect.i1 = options.body;
  effect.i2 = options.step;
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
    return succeed(b);
  })
);
const fiberRefLocally = dual(3, (use, self, value) =>
  flatMap$2(
    acquireUseRelease(
      zipLeft(fiberRefGet(self), fiberRefSet(self, value)),
      () => step(use),
      (oldValue) => fiberRefSet(self, oldValue)
    ),
    (res) => {
      if (res._op === "Blocked") {
        return blocked(res.i0, fiberRefLocally(res.i1, self, value));
      }
      return res;
    }
  )
);
const fiberRefUnsafeMake = (initial, options) =>
  fiberRefUnsafeMakePatch(initial, {
    differ: update(),
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
  () => fiberRefUnsafeMake(empty$8())
);
const currentLogLevel = globalValue(
  Symbol.for("effect/FiberRef/currentLogLevel"),
  () => fiberRefUnsafeMake(logLevelInfo)
);
const currentLogSpan = globalValue(
  Symbol.for("effect/FiberRef/currentLogSpan"),
  () => fiberRefUnsafeMake(empty$7())
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
  () => fiberRefUnsafeMakeHashSet(empty$9())
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
    fiberRefUnsafeMake(empty$3, {
      fork: () => empty$3,
      join: (parent, _) => parent,
    })
);
const ScopeTypeId = Symbol.for("effect/Scope");
const scopeFork = (self, strategy) => self.fork(strategy);
const exitIsFailure = (self) => self._tag === "Failure";
const exitCollectAll = (exits, options) =>
  exitCollectAllInternal(exits, options?.parallel ? parallel$2 : sequential$2);
const exitFailCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
const exitFlatMap = dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return exitFailCause(self.i0);
    }
    case OP_SUCCESS: {
      return f(self.i0);
    }
  }
});
const exitFlatten = (self) => pipe(self, exitFlatMap(identity));
const exitInterrupt = (fiberId) => exitFailCause(interrupt(fiberId));
const exitMap = dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return exitFailCause(self.i0);
    }
    case OP_SUCCESS: {
      return exitSucceed(f(self.i0));
    }
  }
});
const exitMatch = dual(
  2,
  (self, { onFailure: onFailure, onSuccess: onSuccess }) => {
    switch (self._tag) {
      case OP_FAILURE: {
        return onFailure(self.i0);
      }
      case OP_SUCCESS: {
        return onSuccess(self.i0);
      }
    }
  }
);
const exitSucceed = (value) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
const exitUnit = exitSucceed(void 0);
const exitZipWith = dual(
  3,
  (self, that, { onFailure: onFailure, onSuccess: onSuccess }) => {
    switch (self._tag) {
      case OP_FAILURE: {
        switch (that._tag) {
          case OP_SUCCESS: {
            return exitFailCause(self.i0);
          }
          case OP_FAILURE: {
            return exitFailCause(onFailure(self.i0, that.i0));
          }
        }
      }
      case OP_SUCCESS: {
        switch (that._tag) {
          case OP_SUCCESS: {
            return exitSucceed(onSuccess(self.i0, that.i0));
          }
          case OP_FAILURE: {
            return exitFailCause(that.i0);
          }
        }
      }
    }
  }
);
const exitCollectAllInternal = (exits, combineCauses) => {
  const list = fromIterable$4(exits);
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
    exitMap((chunk) => Array.from(chunk)),
    some
  );
};
const deferredUnsafeMake = (fiberId) => ({
  [DeferredTypeId]: deferredVariance,
  state: make$e(pending([])),
  blockingOn: fiberId,
  pipe() {
    return pipeArguments(this, arguments);
  },
});
const deferredAwait = (self) =>
  asyncEither((k) => {
    const state = get$3(self.state);
    switch (state._tag) {
      case OP_STATE_DONE: {
        return right(state.effect);
      }
      case OP_STATE_PENDING: {
        pipe(self.state, set$3(pending([k, ...state.joiners])));
        return left(deferredInterruptJoiner(self, k));
      }
    }
  }, self.blockingOn);
const deferredCompleteWith = dual(2, (self, effect) =>
  sync(() => {
    const state = get$3(self.state);
    switch (state._tag) {
      case OP_STATE_DONE: {
        return false;
      }
      case OP_STATE_PENDING: {
        pipe(self.state, set$3(done$2(effect)));
        for (let i = 0; i < state.joiners.length; i++) {
          state.joiners[i](effect);
        }
        return true;
      }
    }
  })
);
const deferredFail = dual(2, (self, error) =>
  deferredCompleteWith(self, fail$1(error))
);
const deferredSucceed = dual(2, (self, value) =>
  deferredCompleteWith(self, succeed(value))
);
const deferredUnsafeDone = (self, effect) => {
  const state = get$3(self.state);
  if (state._tag === OP_STATE_PENDING) {
    pipe(self.state, set$3(done$2(effect)));
    for (let i = state.joiners.length - 1; i >= 0; i--) {
      state.joiners[i](effect);
    }
  }
};
const deferredInterruptJoiner = (self, joiner) =>
  sync(() => {
    const state = get$3(self.state);
    if (state._tag === OP_STATE_PENDING) {
      pipe(
        self.state,
        set$3(pending(state.joiners.filter((j) => j !== joiner)))
      );
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
  const span = fiber.getFiberRef(currentContext).unsafeMap.get(spanTag);
  return span !== undefined && span._tag === "Span" ? some(span) : none$4();
};
const isBun = typeof process === "undefined" ? false : !!process?.isBun;
const clear = isBun ? (id) => clearInterval(id) : (id) => clearTimeout(id);
const set$1 = isBun
  ? (fn, ms) => {
      const id = setInterval(() => {
        fn();
        clearInterval(id);
      }, ms);
      return id;
    }
  : (fn, ms) => setTimeout(fn, ms);
const ClockSymbolKey = "effect/Clock";
const ClockTypeId = Symbol.for(ClockSymbolKey);
const clockTag = Tag(ClockTypeId);
const MAX_TIMER_MILLIS = 2 ** 31 - 1;
const globalClockScheduler = {
  unsafeSchedule(task, duration) {
    const millis = toMillis(duration);
    if (millis > MAX_TIMER_MILLIS) {
      return constFalse;
    }
    let completed = false;
    const handle = set$1(() => {
      completed = true;
      task();
    }, millis);
    return () => {
      clear(handle);
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
    return succeed(globalClockScheduler);
  }
  sleep(duration) {
    return asyncEither((cb) => {
      const canceler = globalClockScheduler.unsafeSchedule(
        () => cb(unit$1),
        duration
      );
      return left(asUnit(sync(canceler)));
    });
  }
}
const make$8 = () => new ClockImpl();
const Order$1 = number$1;
const OP_AND = "And";
const OP_OR = "Or";
const OP_INVALID_DATA = "InvalidData";
const OP_MISSING_DATA = "MissingData";
const OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
const OP_UNSUPPORTED = "Unsupported";
const ConfigErrorSymbolKey = "effect/ConfigError";
const ConfigErrorTypeId = Symbol.for(ConfigErrorSymbolKey);
const proto = { [ConfigErrorTypeId]: ConfigErrorTypeId };
const And = (self, that) => {
  const error = Object.create(proto);
  error._tag = OP_AND;
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
  error._tag = OP_OR;
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
  error._tag = OP_INVALID_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, join(options.pathDelim));
      return `(Invalid data at ${path}: "${this.message}")`;
    },
  });
  return error;
};
const MissingData = (path, message, options = { pathDelim: "." }) => {
  const error = Object.create(proto);
  error._tag = OP_MISSING_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, join(options.pathDelim));
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
  error._tag = OP_SOURCE_UNAVAILABLE;
  error.path = path;
  error.message = message;
  error.cause = cause;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, join(options.pathDelim));
      return `(Source unavailable at ${path}: "${this.message}")`;
    },
  });
  return error;
};
const Unsupported = (path, message, options = { pathDelim: "." }) => {
  const error = Object.create(proto);
  error._tag = OP_UNSUPPORTED;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, join(options.pathDelim));
      return `(Unsupported operation at ${path}: "${this.message}")`;
    },
  });
  return error;
};
const prefixed = dual(2, (self, prefix) => {
  switch (self._tag) {
    case OP_AND: {
      return And(prefixed(prefix)(self.left), prefixed(prefix)(self.right));
    }
    case OP_OR: {
      return Or(prefixed(prefix)(self.left), prefixed(prefix)(self.right));
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
const missingError = (name) => (self) =>
  MissingData([], `Expected ${self.description} with name ${name}`);
const empty$2 = { _tag: "Empty" };
const patch$1 = dual(2, (path, patch) => {
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
        output = map$6(output, patch.f);
        input = input.tail;
        break;
      }
      case "Nested": {
        output = prepend$2(output, patch.name);
        input = input.tail;
        break;
      }
      case "Unnested": {
        const containsName = pipe(head$1(output), contains(patch.name));
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
const concat = (l, r) => [...l, ...r];
const ConfigProviderSymbolKey = "effect/ConfigProvider";
const ConfigProviderTypeId = Symbol.for(ConfigProviderSymbolKey);
const configProviderTag = Tag(ConfigProviderTypeId);
const FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
const FlatConfigProviderTypeId = Symbol.for(FlatConfigProviderSymbolKey);
const make$7 = (options) => ({
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
  make$7({
    load: (config) =>
      flatMap$2(fromFlatLoop(flat, empty$f(), config, false), (chunk) =>
        match$3(head$1(chunk), {
          onNone: () =>
            fail$1(
              MissingData(
                empty$f(),
                `Expected a single value having structure: ${config}`
              )
            ),
          onSome: succeed,
        })
      ),
    flattened: flat,
  });
const fromEnv = (config = {}) => {
  const { pathDelim: pathDelim, seqDelim: seqDelim } = Object.assign(
    {},
    { pathDelim: "_", seqDelim: "," },
    config
  );
  const makePathString = (path) => pipe(path, join(pathDelim));
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
      mapError(() =>
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
      const keyPaths = Array.from(keys).map((value) =>
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
      return fromIterable$1(filteredKeyPaths);
    });
  return fromFlat(
    makeFlat({
      load: load,
      enumerateChildren: enumerateChildren,
      patch: empty$2,
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
const fromFlatLoop = (flat, prefix, config, split) => {
  const op = config;
  switch (op._tag) {
    case OP_CONSTANT: {
      return succeed(of$2(op.value));
    }
    case OP_DESCRIBED: {
      return suspend$1(() => fromFlatLoop(flat, prefix, op.config, split));
    }
    case OP_FAIL: {
      return fail$1(MissingData(prefix, op.message));
    }
    case OP_FALLBACK: {
      return pipe(
        suspend$1(() => fromFlatLoop(flat, prefix, op.first, split)),
        catchAll((error1) => {
          if (op.condition(error1)) {
            return pipe(
              fromFlatLoop(flat, prefix, op.second, split),
              catchAll((error2) => fail$1(Or(error1, error2)))
            );
          }
          return fail$1(error1);
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
              pipe(op.mapOrFail(a), mapError(prefixed(prefix)))
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
        patch$1(prefix, flat.patch),
        flatMap$2((prefix) =>
          pipe(
            flat.load(prefix, op, split),
            flatMap$2((values) => {
              if (values.length === 0) {
                const name = pipe(
                  last(prefix),
                  getOrElse(() => "<n/a>")
                );
                return fail$1(missingError(name));
              }
              return succeed(values);
            })
          )
        )
      );
    }
    case OP_SEQUENCE: {
      return pipe(
        patch$1(prefix, flat.patch),
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
                  const flattened = flatten$1(chunkChunk);
                  if (flattened.length === 0) {
                    return of$2(empty$f());
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
          patch$1(prefix, flat.patch),
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
                  map$2((values) => {
                    if (values.length === 0) {
                      return of$2(empty$8());
                    }
                    const matrix = values.map((x) => Array.from(x));
                    return pipe(
                      transpose(matrix),
                      map$6((values) =>
                        fromIterable(zip$1(fromIterable$5(keys), values))
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
                  return fail$1(And(left.left, right$1.left));
                }
                if (isLeft(left) && isRight(right$1)) {
                  return fail$1(left.left);
                }
                if (isRight(left) && isLeft(right$1)) {
                  return fail$1(right$1.left);
                }
                if (isRight(left) && isRight(right$1)) {
                  const path = pipe(prefix, join("."));
                  const fail = fromFlatLoopFail(prefix, path);
                  const [lefts, rights] = extend(
                    fail,
                    fail,
                    pipe(left.right, map$6(right)),
                    pipe(right$1.right, map$6(right))
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
  const split = text.split(new RegExp(`\\s*${escapeRegex(delim)}\\s*`));
  return split;
};
const parsePrimitive = (text, path, primitive, delimiter, split) => {
  if (!split) {
    return pipe(primitive.parse(text), map$2(of$2), mapError(prefixed(path)));
  }
  return pipe(
    splitPathString(text, delimiter),
    forEachSequential((char) => primitive.parse(char.trim())),
    mapError(prefixed(path))
  );
};
const transpose = (array) =>
  Object.keys(array[0]).map((column) => array.map((row) => row[column]));
const escapeRegex = (string) =>
  string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
const indicesFrom = (quotedIndices) =>
  pipe(
    forEachSequential(quotedIndices, parseQuotedIndex),
    mapBoth({ onFailure: () => empty$f(), onSuccess: sort$1(Order$1) }),
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
const consoleTag = Tag(TypeId$2);
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
const randomTag = Tag(RandomTypeId);
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
          as(fromIterable$4(buffer))
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
const make$6 = (seed) => new RandomImpl(seed);
const liveServices = pipe(
  empty$c(),
  add$2(clockTag, make$8()),
  add$2(consoleTag, defaultConsole),
  add$2(randomTag, make$6((Math.random() * 4294967296) >>> 0)),
  add$2(configProviderTag, fromEnv()),
  add$2(tracerTag, nativeTracer)
);
const currentServices = globalValue(
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
  for (const [fiberRef, childStack] of that.locals) {
    const childValue = headNonEmpty$1(childStack)[1];
    if (!equals$1(headNonEmpty$1(childStack)[0], fiberId)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (equals$1(childValue, fiberRef.initial)) {
          continue;
        }
        parentFiberRefs.set(fiberRef, [
          [fiberId, fiberRef.join(fiberRef.initial, childValue)],
        ]);
        continue;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(
        fiberRef,
        parentStack,
        childStack
      );
      if (wasModified) {
        const patch = fiberRef.diff(ancestor, childValue);
        const oldValue = headNonEmpty$1(parentStack)[1];
        const newValue = fiberRef.join(
          oldValue,
          fiberRef.patch(patch)(oldValue)
        );
        if (!equals$1(oldValue, newValue)) {
          let newStack;
          const parentFiberId = headNonEmpty$1(parentStack)[0];
          if (equals$1(parentFiberId, fiberId)) {
            newStack = prepend$2([parentFiberId, newValue])(
              tailNonEmpty$1(parentStack)
            );
          } else {
            newStack = prepend$2([fiberId, newValue])(parentStack);
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  }
  return new FiberRefsImpl(new Map(parentFiberRefs));
});
const forkAs = dual(2, (self, childId) => {
  const map = new Map();
  for (const [fiberRef, stack] of self.locals.entries()) {
    const oldValue = headNonEmpty$1(stack)[1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (equals$1(oldValue, newValue)) {
      map.set(fiberRef, stack);
    } else {
      map.set(fiberRef, prepend$2([childId, newValue])(stack));
    }
  }
  return new FiberRefsImpl(map);
});
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
const updatedAs = dual(
  2,
  (self, { fiberId: fiberId, fiberRef: fiberRef, value: value }) => {
    const oldStack = self.locals.has(fiberRef)
      ? self.locals.get(fiberRef)
      : empty$f();
    let newStack;
    if (isEmptyReadonlyArray(oldStack)) {
      newStack = of$2([fiberId, value]);
    } else {
      const [currentId, currentValue] = headNonEmpty$1(oldStack);
      if (equals$1(currentId, fiberId)) {
        if (equals$1(currentValue, value)) {
          return self;
        } else {
          newStack = prepend$2([fiberId, value])(tailNonEmpty$1(oldStack));
        }
      } else {
        newStack = prepend$2([fiberId, value])(oldStack);
      }
    }
    const locals = new Map(self.locals);
    return new FiberRefsImpl(locals.set(fiberRef, newStack));
  }
);
const getOrDefault = getOrDefault$1;
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
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  [symbol$1]() {
    return pipe(
      hash(MetricLabelSymbolKey),
      combine$3(hash(this.key)),
      combine$3(hash(this.value))
    );
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
const make$5 = (key, value) => new MetricLabelImpl(key, value);
const isMetricLabel = (u) => hasProperty(u, MetricLabelTypeId);
const TypeId$1 = Symbol.for("effect/MutableHashMap");
const MutableHashMapProto = {
  [TypeId$1]: TypeId$1,
  [Symbol.iterator]() {
    return this.backingMap.current[Symbol.iterator]();
  },
  toString() {
    return toString(this.toJSON());
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
const fromHashMap = (backingMap) => {
  const map = Object.create(MutableHashMapProto);
  map.backingMap = make$e(backingMap);
  return map;
};
const empty$1 = () => fromHashMap(empty$8());
const get = dual(2, (self, key) => get$2(self.backingMap.current, key));
const has = dual(2, (self, key) => isSome(get(self, key)));
const set = dual(3, (self, key, value) => {
  update$1(self.backingMap, set$2(key, value));
  return self;
});
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
      set$1(() => this.starveInternal(0), 0);
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
const currentScheduler = globalValue(
  Symbol.for("effect/FiberRef/currentScheduler"),
  () => fiberRefUnsafeMake(defaultScheduler)
);
const OP_SEQUENTIAL = "Sequential";
const OP_PARALLEL = "Parallel";
const OP_PARALLEL_N = "ParallelN";
const sequential$1 = { _tag: OP_SEQUENTIAL };
const parallel$1 = { _tag: OP_PARALLEL };
const parallelN$1 = (parallelism) => ({
  _tag: OP_PARALLEL_N,
  parallelism: parallelism,
});
const FiberStatusSymbolKey = "effect/FiberStatus";
const FiberStatusTypeId = Symbol.for(FiberStatusSymbolKey);
const OP_DONE = "Done";
const OP_RUNNING = "Running";
const OP_SUSPENDED = "Suspended";
class Done {
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_DONE;
  [symbol$1]() {
    return pipe(hash(FiberStatusSymbolKey), combine$3(hash(this._tag)));
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
      combine$3(hash(this._tag)),
      combine$3(hash(this.runtimeFlags))
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
      combine$3(hash(this._tag)),
      combine$3(hash(this.runtimeFlags)),
      combine$3(hash(this.blockingOn))
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
const currentFiberURI = "effect/FiberCurrent";
const EffectTypeId = EffectTypeId$2;
const sequential = sequential$1;
const parallel = parallel$1;
const parallelN = parallelN$1;
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
    const stringMessage = serializeUnknown(message);
    if (stringMessage.length > 0) {
      output = output + " message=";
      output = appendQuoted(stringMessage, output);
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
        output = appendQuoted(serializeUnknown(value), output);
      }
    }
    return output;
  }
);
const serializeUnknown = (u) => {
  try {
    return typeof u === "object" ? JSON.stringify(u) : String(u);
  } catch (_) {
    return String(u);
  }
};
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
  }
  [symbol$1]() {
    return pipe(hash(MetricBoundariesSymbolKey), combine$3(hash(this.values)));
  }
  [symbol](u) {
    return isMetricBoundaries(u) && equals$1(this.values, u.values);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const isMetricBoundaries = (u) => hasProperty(u, MetricBoundariesTypeId);
const fromChunk = (chunk) => {
  const values = pipe(
    chunk,
    appendAll$1(of$1(Number.POSITIVE_INFINITY)),
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
    fromChunk
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
  }
  [symbol$1]() {
    return hash(CounterKeyTypeSymbolKey);
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
  }
  [symbol$1]() {
    return pipe(
      hash(HistogramKeyTypeSymbolKey),
      combine$3(hash(this.boundaries))
    );
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
class MetricKeyImpl {
  name;
  keyType;
  description;
  tags;
  [MetricKeyTypeId] = metricKeyVariance;
  constructor(name, keyType, description, tags = empty$9()) {
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
  }
  [symbol$1]() {
    return pipe(
      hash(this.name),
      combine$3(hash(this.keyType)),
      combine$3(hash(this.description)),
      combine$3(hash(this.tags))
    );
  }
  [symbol](u) {
    return (
      isMetricKey(u) &&
      this.name === u.name &&
      equals$1(this.keyType, u.keyType) &&
      equals$1(this.description, u.description) &&
      equals$1(this.tags, u.tags)
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
const taggedWithLabelSet = dual(2, (self, extraTags) =>
  size$1(extraTags) === 0
    ? self
    : new MetricKeyImpl(
        self.name,
        self.keyType,
        self.description,
        pipe(self.tags, union$1(extraTags))
      )
);
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
    return pipe(hash(CounterStateSymbolKey), combine$3(hash(this.count)));
  }
  [symbol](that) {
    return isCounterState(that) && this.count === that.count;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
class FrequencyState {
  occurrences;
  [MetricStateTypeId] = metricStateVariance;
  [FrequencyStateTypeId] = FrequencyStateTypeId;
  constructor(occurrences) {
    this.occurrences = occurrences;
  }
  [symbol$1]() {
    return pipe(
      hash(FrequencyStateSymbolKey),
      combine$3(hash(this.occurrences))
    );
  }
  [symbol](that) {
    return (
      isFrequencyState(that) && equals$1(this.occurrences, that.occurrences)
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
    return pipe(hash(GaugeStateSymbolKey), combine$3(hash(this.value)));
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
      combine$3(hash(this.buckets)),
      combine$3(hash(this.count)),
      combine$3(hash(this.min)),
      combine$3(hash(this.max)),
      combine$3(hash(this.sum))
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
      combine$3(hash(this.error)),
      combine$3(hash(this.quantiles)),
      combine$3(hash(this.count)),
      combine$3(hash(this.min)),
      combine$3(hash(this.max)),
      combine$3(hash(this.sum))
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
const make$4 = (options) => ({
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
  return make$4({
    get: () => counter$2(sum),
    update: (value) => {
      if (canUpdate(value)) {
        sum = sum + value;
      }
    },
  });
};
const frequency = (_key) => {
  const values = new Map();
  const update = (word) => {
    const slotCount = values.get(word) ?? 0;
    values.set(word, slotCount + 1);
  };
  const snapshot = () => fromIterable(values.entries());
  return make$4({ get: () => frequency$1(snapshot()), update: update });
};
const gauge = (_key, startAt) => {
  let value = startAt;
  return make$4({
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
    const builder = Array(size);
    let cumulated = 0;
    for (let i = 0; i < size; i++) {
      const boundary = boundaries[i];
      const value = values[i];
      cumulated = cumulated + value;
      builder[i] = [boundary, cumulated];
    }
    return unsafeFromArray(builder);
  };
  return make$4({
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
  const values = Array(maxSize);
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
    return calculateQuantiles(
      error,
      sortedQuantiles,
      pipe(unsafeFromArray(builder), sort(Order$1))
    );
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
  return make$4({
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
  if (isEmpty$3(sortedQuantiles)) {
    return empty$e();
  }
  const head = unsafeHead(sortedQuantiles);
  const tail = pipe(sortedQuantiles, drop(1));
  const resolved = pipe(
    tail,
    reduce$6(
      of$1(
        resolveQuantile(error, sampleCount, none$4(), 0, head, sortedSamples)
      ),
      (accumulator, quantile) => {
        const h = unsafeHead(accumulator);
        return pipe(
          accumulator,
          append(
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
  return pipe(
    resolved,
    map$5((rq) => [rq.quantile, rq.value])
  );
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
    if (isEmpty$3(rest_1)) {
      return {
        quantile: quantile_1,
        value: none$4(),
        consumed: consumed_1,
        rest: empty$e(),
      };
    }
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: some(unsafeLast(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: empty$e(),
      };
    }
    const sameHead = pipe(
      rest_1,
      splitWhere((n) => n > unsafeHead(rest_1))
    );
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
    return fromIterable$1(result);
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
      const frequency$1 = frequency();
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
const make$3 = () => new MetricRegistryImpl();
const MetricSymbolKey = "effect/Metric";
const MetricTypeId = Symbol.for(MetricSymbolKey);
const metricVariance = { _Type: (_) => _, _In: (_) => _, _Out: (_) => _ };
const globalMetricRegistry = globalValue(
  Symbol.for("effect/Metric/globalMetricRegistry"),
  () => make$3()
);
const make$2 = function (keyType, unsafeUpdate, unsafeValue) {
  const metric = Object.assign(
    (effect) => tap(effect, (a) => sync(() => unsafeUpdate(a, empty$9()))),
    {
      [MetricTypeId]: metricVariance,
      keyType: keyType,
      unsafeUpdate: unsafeUpdate,
      unsafeValue: unsafeValue,
      pipe() {
        return pipeArguments(this, arguments);
      },
    }
  );
  return metric;
};
const counter = (name, options) => fromMetricKey(counter$3(name, options));
const fromMetricKey = (key) => {
  const hook = (extraTags) => {
    const fullKey = pipe(key, taggedWithLabelSet(extraTags));
    return globalMetricRegistry.get(fullKey);
  };
  return make$2(
    key.keyType,
    (input, extraTags) => hook(extraTags).update(input),
    (extraTags) => hook(extraTags).get()
  );
};
const histogram = (name, boundaries, description) =>
  fromMetricKey(histogram$3(name, boundaries, description));
const tagged = dual(3, (self, key, value) =>
  taggedWithLabels(self, make$f(make$5(key, value)))
);
const taggedWithLabels = dual(2, (self, extraTagsIterable) => {
  const extraTags = isHashSet(extraTagsIterable)
    ? extraTagsIterable
    : fromIterable$1(extraTagsIterable);
  return make$2(
    self.keyType,
    (input, extraTags1) =>
      self.unsafeUpdate(input, pipe(extraTags, union$1(extraTags1))),
    (extraTags1) => self.unsafeValue(pipe(extraTags, union$1(extraTags1)))
  );
});
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
const none = globalValue("effect/Supervisor/none", () => fromEffect(unit$1));
const make$1 = make$c;
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
    return empty$9();
  } else {
    if (isZip(self)) {
      return pipe(toSet(self.left), union$1(toSet(self.right)));
    } else {
      return make$f(self);
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
const differ = make$1({
  empty: empty,
  patch: patch,
  combine: combine,
  diff: diff,
});
const fiberStarted = counter("effect_fiber_started");
const fiberActive = counter("effect_fiber_active");
const fiberSuccesses = counter("effect_fiber_successes");
const fiberFailures = counter("effect_fiber_failures");
const fiberLifetimes = tagged(
  histogram(
    "effect_fiber_lifetimes",
    exponential({ start: 1, factor: 1.3, count: 100 })
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
    `BUG: FiberRuntime - ${JSON.stringify(
      _
    )} - please report an issue at https://github.com/Effect-TS/effect/issues`
  );
};
const contOpSuccess = {
  [OP_ON_SUCCESS]: (_, cont, value) => cont.i1(value),
  ["OnStep"]: (_, cont, value) => cont.i1(exitSucceed(value)),
  [OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) => cont.i2(value),
  [OP_REVERT_FLAGS]: (self, cont, value) => {
    self.patchRuntimeFlags(self._runtimeFlags, cont.patch);
    if (interruptible$1(self._runtimeFlags) && self.isInterrupted()) {
      return exitFailCause(self.getInterruptedCause());
    } else {
      return exitSucceed(value);
    }
  },
  [OP_WHILE]: (self, cont, value) => {
    cont.i2(value);
    if (cont.i0()) {
      self.pushStack(cont);
      return cont.i1();
    } else {
      return unit$1;
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
  forEachSequentialDiscard(flatten(self), (requestsByRequestResolver) =>
    forEachParUnboundedDiscard(
      sequentialCollectionToChunk(requestsByRequestResolver),
      ([dataSource, sequential]) => {
        const map = new Map();
        for (const block of sequential) {
          for (const entry of block) {
            map.set(entry.request, entry);
          }
        }
        return fiberRefLocally(
          invokeWithInterrupt(dataSource.runAll(sequential), sequential.flat()),
          currentRequestMap,
          map
        );
      },
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
  _steps = [false];
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
    this._tracer = get$5(this.getFiberRef(currentServices), tracerTag);
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
      const cb = (exit) => resume(succeed(exit));
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
        diff$1(parentRuntimeFlags, updatedRuntimeFlags),
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
    this._fiberRefs = updatedAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef: fiberRef,
      value: value,
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this._tracer = get$5(this.getFiberRef(currentServices), tracerTag);
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
    return !isEmpty(this.getFiberRef(currentInterruptedCause));
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
          return asUnit(next.value.await);
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
        this.log(
          "Fiber terminated with a non handled error",
          exit.cause,
          level
        );
      }
    }
  }
  setExitValue(exit) {
    this._exitValue = exit;
    if (runtimeMetrics(this._runtimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = new Date().getTime();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
    }
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
      const clockService = get$5(this.getFiberRef(currentServices), clockTag);
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
        try {
          const eff = effect;
          const exit = this.runLoop(eff);
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
        } catch (e) {
          if (isEffect(e)) {
            if (e._op === OP_YIELD) {
              if (cooperativeYielding(this._runtimeFlags)) {
                this.tell(yieldNow());
                this.tell(resume(exitUnit));
                effect = null;
              } else {
                effect = exitUnit;
              }
            } else if (e._op === OP_ASYNC) {
              effect = null;
            }
          } else {
            throw e;
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
    const newRuntimeFlags = patch$2(oldRuntimeFlags, patch);
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
      this._steps.push(true);
    }
    if (cont._op === "RevertFlags") {
      this._steps.push(false);
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep" || item._op === "RevertFlags") {
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
    return map$2(fiberRefGet(currentContext), (context) => {
      try {
        return unsafeGet(context, op);
      } catch (e) {
        console.log(e);
        throw e;
      }
    });
  }
  ["Left"](op) {
    return fail$1(op.left);
  }
  ["None"](_) {
    return fail$1(NoSuchElementException());
  }
  ["Right"](op) {
    return exitSucceed(op.right);
  }
  ["Some"](op) {
    return exitSucceed(op.value);
  }
  [OP_SYNC](op) {
    const value = op.i0();
    const cont = this.getNextSuccessCont();
    if (cont !== undefined) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, value);
    } else {
      throw exitSucceed(value);
    }
  }
  [OP_SUCCESS](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== undefined) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, oldCur.i0);
    } else {
      throw oldCur;
    }
  }
  [OP_FAILURE](op) {
    const cause = op.i0;
    const cont = this.getNextFailCont();
    if (cont !== undefined) {
      switch (cont._op) {
        case OP_ON_FAILURE:
        case OP_ON_SUCCESS_AND_FAILURE: {
          if (!(interruptible$1(this._runtimeFlags) && this.isInterrupted())) {
            return cont.i1(cause);
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case "OnStep": {
          if (!(interruptible$1(this._runtimeFlags) && this.isInterrupted())) {
            return cont.i1(exitFailCause(cause));
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
      throw exitFailCause(cause);
    }
  }
  [OP_WITH_RUNTIME](op) {
    return op.i0(this, running(this._runtimeFlags));
  }
  ["Blocked"](op) {
    if (this._steps[this._steps.length - 1]) {
      const nextOp = this.popStack();
      if (nextOp) {
        switch (nextOp._op) {
          case "OnStep": {
            return nextOp.i1(op);
          }
          case "OnSuccess": {
            return blocked(op.i0, flatMap$2(op.i1, nextOp.i1));
          }
          case "OnSuccessAndFailure": {
            return blocked(
              op.i0,
              matchCauseEffect(op.i1, {
                onFailure: nextOp.i1,
                onSuccess: nextOp.i2,
              })
            );
          }
          case "OnFailure": {
            return blocked(op.i0, catchAllCause(op.i1, nextOp.i1));
          }
          case "While": {
            return blocked(
              op.i0,
              flatMap$2(op.i1, (a) => {
                nextOp.i2(a);
                if (nextOp.i0()) {
                  return whileLoop({
                    while: nextOp.i0,
                    body: nextOp.i1,
                    step: nextOp.i2,
                  });
                }
                return unit$1;
              })
            );
          }
          case "RevertFlags": {
            this.pushStack(nextOp);
            break;
          }
        }
      }
    }
    return uninterruptibleMask((restore) =>
      flatMap$2(fork(runRequestBlock(op.i0)), () => restore(op.i1))
    );
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.i0);
  }
  [OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.i0;
    const oldRuntimeFlags = this._runtimeFlags;
    const newRuntimeFlags = patch$2(oldRuntimeFlags, updateFlags);
    if (interruptible$1(newRuntimeFlags) && this.isInterrupted()) {
      return exitFailCause(this.getInterruptedCause());
    } else {
      this.patchRuntimeFlags(this._runtimeFlags, updateFlags);
      if (op.i1) {
        const revertFlags = diff$1(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new RevertFlags(revertFlags, op));
        return op.i1(oldRuntimeFlags);
      } else {
        return exitUnit;
      }
    }
  }
  [OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OP_ASYNC](op) {
    this._asyncBlockingOn = op.i1;
    this.initiateAsync(this._runtimeFlags, op.i0);
    throw op;
  }
  [OP_YIELD](op) {
    this.isYielding = false;
    throw op;
  }
  [OP_WHILE](op) {
    const check = op.i0;
    const body = op.i1;
    if (check()) {
      this.pushStack(op);
      return body();
    } else {
      return exitUnit;
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
          console.log(cur);
          absurd(cur);
        }
        cur = this._tracer.context(() => {
          if (moduleVersion !== cur[EffectTypeId]._V) {
            return dieMessage(
              `Cannot execute an Effect versioned ${cur[EffectTypeId]._V} with a Runtime of version ${moduleVersion}`
            );
          }
          return this[cur._op](cur);
        }, this);
      } catch (e) {
        if (isEffect(e)) {
          if (e._op === OP_YIELD || e._op === OP_ASYNC) {
            throw e;
          }
          if (e._op === OP_SUCCESS || e._op === OP_FAILURE) {
            return e;
          }
        } else {
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
  }
  run = () => {
    this.drainQueueOnCurrentThread();
  };
}
const currentMinimumLogLevel = globalValue(
  "effect/FiberRef/currentMinimumLogLevel",
  () => fiberRefUnsafeMake(fromLiteral("Info"))
);
const getConsole = (refs) => {
  const defaultServicesValue = getOrDefault(refs, currentServices);
  const cnsl = get$5(defaultServicesValue, consoleTag);
  return cnsl.unsafe;
};
const defaultLogger = globalValue(
  Symbol.for("effect/Logger/defaultLogger"),
  () =>
    makeLogger((options) => {
      const formatted = stringLogger.log(options);
      getConsole(options.context).log(formatted);
    })
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
      const clockService = map$7(get$1(context, currentServices), (_) =>
        get$5(_, clockTag)
      );
      if (
        span._tag === "None" ||
        span.value._tag === "ExternalSpan" ||
        clockService._tag === "None"
      ) {
        return;
      }
      const attributes = Object.fromEntries(
        map$3(annotations, (value) => serializeUnknown(value))
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
  () => fiberRefUnsafeMakeHashSet(make$f(defaultLogger, tracerLogger))
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
                ? forEachBatchedDiscard(self, (a, i) => restore(f(a, i)))
                : forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))
            ),
          () =>
            finalizersMask(parallel)((restore) =>
              forEachParUnboundedDiscard(
                self,
                (a, i) => restore(f(a, i)),
                isRequestBatchingEnabled
              )
            ),
          (n) =>
            finalizersMask(parallelN(n))((restore) =>
              forEachParNDiscard(
                self,
                n,
                (a, i) => restore(f(a, i)),
                isRequestBatchingEnabled
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
    const as = fromIterable$5(self);
    const array = new Array(as.length);
    const fn = (a, i) => flatMap$2(f(a, i), (b) => sync(() => (array[i] = b)));
    return zipRight(
      forEachParUnboundedDiscard(as, fn, batching),
      succeed(array)
    );
  });
const forEachBatchedDiscard = (self, f) =>
  suspend$1(() => {
    const as = fromIterable$5(self);
    const size = as.length;
    if (size === 0) {
      return unit$1;
    } else if (size === 1) {
      return asUnit(f(as[0], 0));
    }
    const effects = as.map(f);
    const blocked$1 = new Array();
    const loop = (i) =>
      i === effects.length
        ? suspend$1(() => {
            if (blocked$1.length > 0) {
              const requests = blocked$1.map((b) => b.i0).reduce(par);
              return blocked(
                requests,
                forEachBatchedDiscard(
                  blocked$1.map((b) => b.i1),
                  identity
                )
              );
            }
            return unit$1;
          })
        : flatMapStep(effects[i], (s) => {
            if (s._op === "Blocked") {
              blocked$1.push(s);
              return loop(i + 1);
            } else if (s._op === "Failure") {
              return suspend$1(() => {
                if (blocked$1.length > 0) {
                  const requests = blocked$1.map((b) => b.i0).reduce(par);
                  return blocked(
                    requests,
                    flatMap$2(
                      forEachBatchedDiscard(
                        blocked$1.map((b) => b.i1),
                        identity
                      ),
                      () => s
                    )
                  );
                }
                return unit$1;
              });
            } else {
              return loop(i + 1);
            }
          });
    return loop(0);
  });
const forEachParUnboundedDiscard = (self, f, batching) =>
  suspend$1(() => {
    const as = fromIterable$5(self);
    const size = as.length;
    if (size === 0) {
      return unit$1;
    } else if (size === 1) {
      return asUnit(f(as[0], 0));
    }
    return uninterruptibleMask((restore) => {
      const deferred = deferredUnsafeMake(none$2);
      let ref = 0;
      const residual = [];
      const joinOrder = [];
      const process = transplant((graft) =>
        forEachSequential(as, (a, i) =>
          pipe(
            graft(
              pipe(
                suspend$1(() => restore((batching ? step : exit)(f(a, i)))),
                flatMap$2((exit) => {
                  switch (exit._op) {
                    case "Failure": {
                      if (residual.length > 0) {
                        const requests = residual
                          .map((blocked) => blocked.i0)
                          .reduce(par);
                        const _continue = forEachParUnboundedDiscard(
                          residual,
                          (blocked) => blocked.i1,
                          batching
                        );
                        return blocked(
                          requests,
                          matchCauseEffect(_continue, {
                            onFailure: (cause) =>
                              zipRight(
                                deferredFail(deferred, void 0),
                                failCause(parallel$2(cause, exit.cause))
                              ),
                            onSuccess: () =>
                              zipRight(
                                deferredFail(deferred, void 0),
                                failCause(exit.cause)
                              ),
                          })
                        );
                      }
                      return zipRight(
                        deferredFail(deferred, void 0),
                        failCause(exit.cause)
                      );
                    }
                    default: {
                      if (exit._op === "Blocked") {
                        residual.push(exit);
                      }
                      if (ref + 1 === size) {
                        if (residual.length > 0) {
                          const requests = residual
                            .map((blocked) => blocked.i0)
                            .reduce(par);
                          const _continue = forEachParUnboundedDiscard(
                            residual,
                            (blocked) => blocked.i1,
                            batching
                          );
                          return deferredSucceed(
                            deferred,
                            blocked(requests, _continue)
                          );
                        } else {
                          deferredUnsafeDone(deferred, exitSucceed(exitUnit));
                        }
                      } else {
                        ref = ref + 1;
                      }
                      return unit$1;
                    }
                  }
                })
              )
            ),
            forkDaemon,
            map$2((fiber) => {
              fiber.addObserver(() => {
                joinOrder.push(fiber);
              });
              return fiber;
            })
          )
        )
      );
      return flatMap$2(process, (fibers) =>
        matchCauseEffect(restore(deferredAwait(deferred)), {
          onFailure: (cause) =>
            flatMap$2(
              forEachParUnbounded(fibers, interruptFiber, batching),
              (exits) => {
                const exit = exitCollectAll(exits, { parallel: true });
                if (exit._tag === "Some" && exitIsFailure(exit.value)) {
                  return failCause(
                    parallel$2(stripFailures(cause), exit.value.i0)
                  );
                } else {
                  return failCause(stripFailures(cause));
                }
              }
            ),
          onSuccess: (rest) =>
            flatMap$2(rest, () =>
              forEachSequentialDiscard(joinOrder, (f) => f.inheritAll)
            ),
        })
      );
    });
  });
const forEachParN = (self, n, f, batching) =>
  suspend$1(() => {
    const as = fromIterable$5(self);
    const array = new Array(as.length);
    const fn = (a, i) => map$2(f(a, i), (b) => (array[i] = b));
    return zipRight(forEachParNDiscard(as, n, fn, batching), succeed(array));
  });
const forEachParNDiscard = (self, n, f, batching) =>
  suspend$1(() => {
    let i = 0;
    const iterator = self[Symbol.iterator]();
    const residual = [];
    const worker = flatMap$2(
      sync(() => iterator.next()),
      (next) =>
        next.done
          ? unit$1
          : flatMap$2(
              (batching ? step : exit)(asUnit(f(next.value, i++))),
              (res) => {
                switch (res._op) {
                  case "Blocked": {
                    residual.push(res);
                    return worker;
                  }
                  case "Failure": {
                    return res;
                  }
                  case "Success":
                    return worker;
                }
              }
            )
    );
    const effects = [];
    for (let i = 0; i < n; i++) {
      effects.push(worker);
    }
    return flatMap$2(
      exit(forEachParUnboundedDiscard(effects, identity, batching)),
      (exit) => {
        if (residual.length === 0) {
          return exit;
        }
        const requests = residual.map((blocked) => blocked.i0).reduce(par);
        const _continue = forEachParNDiscard(
          residual,
          n,
          (blocked) => blocked.i1,
          batching
        );
        if (exit._tag === "Failure") {
          return blocked(
            requests,
            matchCauseEffect(_continue, {
              onFailure: (cause) =>
                exitFailCause(parallel$2(exit.cause, cause)),
              onSuccess: () => exit,
            })
          );
        }
        return blocked(requests, _continue);
      }
    );
  });
const fork = (self) =>
  withFiberRuntime((state, status) =>
    succeed(unsafeFork(self, state, status.runtimeFlags))
  );
const forkDaemon = (self) => forkWithScopeOverride(self, globalScope);
const unsafeFork = (
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
const unsafeMakeChildFiber = (
  effect,
  parentFiber,
  parentRuntimeFlags,
  overrideScope = null
) => {
  const childId = unsafeMake$2();
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
    succeed(
      unsafeFork(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)
    )
  );
const parallelFinalizers = (self) =>
  contextWithEffect((context) =>
    match$3(getOption(context, scopeTag), {
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
    match$3(getOption(context, scopeTag), {
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
    match$3(getOption(context, scopeTag), {
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
    match$3(getOption(context, scopeTag), {
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
const scopeTag = Tag(ScopeTypeId);
const scopeExtend = dual(2, (effect, scope) =>
  mapInputContext(effect, merge$1(make$j(scopeTag, scope)))
);
const fiberRefUnsafeMakeSupervisor = (initial) =>
  fiberRefUnsafeMakePatch(initial, { differ: differ, fork: empty });
const currentRuntimeFlags = fiberRefUnsafeMakeRuntimeFlags(none$1);
const currentSupervisor = fiberRefUnsafeMakeSupervisor(none);
const invokeWithInterrupt = (dataSource, all) =>
  fiberIdWith((id) =>
    flatMap$2(
      flatMap$2(forkDaemon(interruptible(dataSource)), (processing) =>
        async((cb) => {
          const counts = all.map((_) => _.listeners.count);
          const checkDone = () => {
            if (counts.every((count) => count === 0)) {
              cleanup.forEach((f) => f());
              cb(interruptFiber(processing));
            }
          };
          processing.addObserver((exit) => {
            cleanup.forEach((f) => f());
            cb(exit);
          });
          const cleanup = all.map((r, i) => {
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
          const residual = all.flatMap((entry) => {
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
const forEach = forEach$1;
const suspend = suspend$1;
const unit = unit$1;
const map$1 = map$2;
const either = either$1;
const flatMap$1 = flatMap$2;
const ArbitraryHookId = Symbol.for("@effect/schema/ArbitraryHookId");
const PrettyHookId = Symbol.for("@effect/schema/PrettyHookId");
const EquivalenceHookId = Symbol.for("@effect/schema/EquivalenceHookId");
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
const IdentifierAnnotationId = Symbol.for(
  "@effect/schema/annotation/Identifier"
);
const TitleAnnotationId = Symbol.for("@effect/schema/annotation/Title");
const DescriptionAnnotationId = Symbol.for(
  "@effect/schema/annotation/Description"
);
const createDeclaration = (typeParameters, type, decode, annotations = {}) => ({
  _tag: "Declaration",
  typeParameters: typeParameters,
  type: type,
  decode: decode,
  annotations: annotations,
});
const createLiteral = (literal, annotations = {}) => ({
  _tag: "Literal",
  literal: literal,
  annotations: annotations,
});
const isLiteral = (ast) => ast._tag === "Literal";
const isUniqueSymbol = (ast) => ast._tag === "UniqueSymbol";
const voidKeyword = {
  _tag: "VoidKeyword",
  annotations: { [TitleAnnotationId]: "void" },
};
const neverKeyword = {
  _tag: "NeverKeyword",
  annotations: { [TitleAnnotationId]: "never" },
};
const unknownKeyword = {
  _tag: "UnknownKeyword",
  annotations: { [TitleAnnotationId]: "unknown" },
};
const isUnknownKeyword = (ast) => ast._tag === "UnknownKeyword";
const anyKeyword = {
  _tag: "AnyKeyword",
  annotations: { [TitleAnnotationId]: "any" },
};
const isAnyKeyword = (ast) => ast._tag === "AnyKeyword";
const stringKeyword = {
  _tag: "StringKeyword",
  annotations: {
    [TitleAnnotationId]: "string",
    [DescriptionAnnotationId]: "a string",
  },
};
const isStringKeyword = (ast) => ast._tag === "StringKeyword";
const numberKeyword = {
  _tag: "NumberKeyword",
  annotations: {
    [TitleAnnotationId]: "number",
    [DescriptionAnnotationId]: "a number",
  },
};
const isNumberKeyword = (ast) => ast._tag === "NumberKeyword";
const isBooleanKeyword = (ast) => ast._tag === "BooleanKeyword";
const isBigIntKeyword = (ast) => ast._tag === "BigIntKeyword";
const symbolKeyword = {
  _tag: "SymbolKeyword",
  annotations: {
    [TitleAnnotationId]: "symbol",
    [DescriptionAnnotationId]: "a symbol",
  },
};
const isSymbolKeyword = (ast) => ast._tag === "SymbolKeyword";
const objectKeyword = {
  _tag: "ObjectKeyword",
  annotations: {
    [TitleAnnotationId]: "object",
    [DescriptionAnnotationId]: "an object",
  },
};
const createElement = (type, isOptional) => ({
  type: type,
  isOptional: isOptional,
});
const createTuple = (elements, rest, isReadonly, annotations = {}) => ({
  _tag: "Tuple",
  elements: elements,
  rest: rest,
  isReadonly: isReadonly,
  annotations: annotations,
});
const createPropertySignature = (
  name,
  type,
  isOptional,
  isReadonly,
  annotations = {}
) => ({
  name: name,
  type: type,
  isOptional: isOptional,
  isReadonly: isReadonly,
  annotations: annotations,
});
const isParameter = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return true;
    case "Refinement":
      return isParameter(ast.from);
    default:
      return false;
  }
};
const createIndexSignature = (parameter, type, isReadonly) => {
  if (isParameter(parameter)) {
    return { parameter: parameter, type: type, isReadonly: isReadonly };
  }
  throw new Error(
    "An index signature parameter type must be 'string', 'symbol', a template literal type or a refinement of the previous types"
  );
};
const createTypeLiteral = (
  propertySignatures,
  indexSignatures,
  annotations = {}
) => {
  const keys = {};
  for (let i = 0; i < propertySignatures.length; i++) {
    const name = propertySignatures[i].name;
    if (Object.prototype.hasOwnProperty.call(keys, name)) {
      throw new Error(`Duplicate property signature ${String(name)}`);
    }
    keys[name] = null;
  }
  const parameters = { string: false, symbol: false };
  for (let i = 0; i < indexSignatures.length; i++) {
    const parameter = getParameterBase(indexSignatures[i].parameter);
    if (isStringKeyword(parameter)) {
      if (parameters.string) {
        throw new Error("Duplicate index signature for type `string`");
      }
      parameters.string = true;
    } else if (isSymbolKeyword(parameter)) {
      if (parameters.symbol) {
        throw new Error("Duplicate index signature for type `symbol`");
      }
      parameters.symbol = true;
    }
  }
  return {
    _tag: "TypeLiteral",
    propertySignatures: sortPropertySignatures(propertySignatures),
    indexSignatures: indexSignatures,
    annotations: annotations,
  };
};
const isMembers = (as) => as.length > 1;
const createUnion = (candidates, annotations = {}) => {
  const types = unify(candidates);
  if (isMembers(types)) {
    return {
      _tag: "Union",
      types: sortUnionMembers(types),
      annotations: annotations,
    };
  }
  if (isNonEmptyReadonlyArray(types)) {
    return types[0];
  }
  return neverKeyword;
};
const createLazy = (f, annotations = {}) => ({
  _tag: "Lazy",
  f: memoizeThunk(f),
  annotations: annotations,
});
const createRefinement = (from, filter, annotations = {}) => {
  if (isTransform(from)) {
    return createTransform(
      from.from,
      createRefinement(from.to, filter, annotations),
      from.transformation,
      from.annotations
    );
  }
  return {
    _tag: "Refinement",
    from: from,
    filter: filter,
    annotations: annotations,
  };
};
const isRefinement = (ast) => ast._tag === "Refinement";
const createTransform = (from, to, transformation, annotations = {}) => ({
  _tag: "Transform",
  from: from,
  to: to,
  transformation: transformation,
  annotations: annotations,
});
const isTransform = (ast) => ast._tag === "Transform";
const createFinalPropertySignatureTransformation = (decode, encode) => ({
  _tag: "FinalPropertySignatureTransformation",
  decode: decode,
  encode: encode,
});
const createPropertySignatureTransform = (
  from,
  to,
  propertySignatureTransformation
) => ({
  from: from,
  to: to,
  propertySignatureTransformation: propertySignatureTransformation,
});
const createTypeLiteralTransformation = (propertySignatureTransformations) => {
  const keys = {};
  for (const pst of propertySignatureTransformations) {
    const key = pst.from;
    if (keys[key]) {
      throw new Error(
        `Duplicate property signature transformation ${String(key)}`
      );
    }
    keys[key] = true;
  }
  return {
    _tag: "TypeLiteralTransformation",
    propertySignatureTransformations: propertySignatureTransformations,
  };
};
const getToPropertySignatures = (ps) =>
  ps.map((p) =>
    createPropertySignature(
      p.name,
      to(p.type),
      p.isOptional,
      p.isReadonly,
      p.annotations
    )
  );
const getToIndexSignatures = (ps) =>
  ps.map((is) =>
    createIndexSignature(is.parameter, to(is.type), is.isReadonly)
  );
const to = (ast) => {
  switch (ast._tag) {
    case "Declaration":
      return createDeclaration(
        ast.typeParameters.map(to),
        to(ast.type),
        ast.decode,
        ast.annotations
      );
    case "Tuple":
      return createTuple(
        ast.elements.map((e) => createElement(to(e.type), e.isOptional)),
        map$7(ast.rest, map$6(to)),
        ast.isReadonly,
        ast.annotations
      );
    case "TypeLiteral":
      return createTypeLiteral(
        getToPropertySignatures(ast.propertySignatures),
        getToIndexSignatures(ast.indexSignatures),
        ast.annotations
      );
    case "Union":
      return createUnion(ast.types.map(to), ast.annotations);
    case "Lazy":
      return createLazy(() => to(ast.f()), ast.annotations);
    case "Refinement":
      return createRefinement(to(ast.from), ast.filter, ast.annotations);
    case "Transform":
      return to(ast.to);
  }
  return ast;
};
const from = (ast) => {
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
        map$7(ast.rest, map$6(from)),
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
};
const getCardinality = (ast) => {
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
};
const sortPropertySignatures = sort$1(
  pipe(
    Order$1,
    mapInput((ps) => getCardinality(ps.type))
  )
);
const WeightOrder = tuple(Order$1, Order$1, Order$1);
const maxWeight = max(WeightOrder);
const emptyWeight = [0, 0, 0];
const maxWeightAll = (weights) => weights.reduce(maxWeight, emptyWeight);
const getWeight = (ast) => {
  switch (ast._tag) {
    case "Tuple": {
      const y = ast.elements.length;
      const z = isSome(ast.rest) ? ast.rest.value.length : 0;
      return [2, y, z];
    }
    case "TypeLiteral": {
      const y = ast.propertySignatures.length;
      const z = ast.indexSignatures.length;
      return y + z === 0 ? [-4, 0, 0] : [4, y, z];
    }
    case "Declaration": {
      const [_, y, z] = getWeight(ast.type);
      return [6, y, z];
    }
    case "Lazy":
      return [8, 0, 0];
    case "Union":
      return maxWeightAll(ast.types.map(getWeight));
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
};
const sortUnionMembers = sort$1(reverse$3(mapInput(WeightOrder, getWeight)));
const unify = (candidates) => {
  let out = pipe(
    candidates,
    flatMap$3((ast) => {
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
  if (out.some(isAnyKeyword)) {
    return [anyKeyword];
  }
  if (out.some(isUnknownKeyword)) {
    return [unknownKeyword];
  }
  let i;
  if ((i = out.findIndex(isStringKeyword)) !== -1) {
    out = out.filter(
      (m, j) =>
        j === i ||
        (!isStringKeyword(m) &&
          !(isLiteral(m) && typeof m.literal === "string"))
    );
  }
  if ((i = out.findIndex(isNumberKeyword)) !== -1) {
    out = out.filter(
      (m, j) =>
        j === i ||
        (!isNumberKeyword(m) &&
          !(isLiteral(m) && typeof m.literal === "number"))
    );
  }
  if ((i = out.findIndex(isBooleanKeyword)) !== -1) {
    out = out.filter(
      (m, j) =>
        j === i ||
        (!isBooleanKeyword(m) &&
          !(isLiteral(m) && typeof m.literal === "boolean"))
    );
  }
  if ((i = out.findIndex(isBigIntKeyword)) !== -1) {
    out = out.filter(
      (m, j) =>
        j === i ||
        (!isBigIntKeyword(m) &&
          !(isLiteral(m) && typeof m.literal === "bigint"))
    );
  }
  if ((i = out.findIndex(isSymbolKeyword)) !== -1) {
    out = out.filter(
      (m, j) => j === i || (!isSymbolKeyword(m) && !isUniqueSymbol(m))
    );
  }
  return out;
};
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
const parseError = (errors) => ({ _tag: "ParseError", errors: errors });
const type = (expected, actual, message) => ({
  _tag: "Type",
  expected: expected,
  actual: actual,
  message: fromNullable(message),
});
const forbidden = { _tag: "Forbidden" };
const index = (index, errors) => ({
  _tag: "Index",
  index: index,
  errors: errors,
});
const key = (key, errors) => ({ _tag: "Key", key: key, errors: errors });
const missing = { _tag: "Missing" };
const unexpected = (actual) => ({ _tag: "Unexpected", actual: actual });
const unionMember = (errors) => ({ _tag: "UnionMember", errors: errors });
const success = right;
const fail = left;
const failure = (e) => fail(parseError([e]));
const failures = (es) => left(parseError(es));
const eitherOrUndefined = (self) => {
  const s = self;
  if (s["_tag"] === "Left" || s["_tag"] === "Right") {
    return s;
  }
};
const flatMap = (self, f) => {
  const s = self;
  if (s["_tag"] === "Left") {
    return s;
  }
  if (s["_tag"] === "Right") {
    return f(s.right);
  }
  return flatMap$1(self, f);
};
const map = (self, f) => {
  const s = self;
  if (s["_tag"] === "Left") {
    return s;
  }
  if (s["_tag"] === "Right") {
    return right(f(s.right));
  }
  return map$1(self, f);
};
const getEither = (ast, isDecoding) => goMemo(ast, isDecoding);
const getEffect = (ast, isDecoding) => {
  const parser = goMemo(ast, isDecoding);
  return (input, options) =>
    parser(input, { ...options, isEffectAllowed: true });
};
const parse = (schema) => getEffect(schema.ast, true);
const validateEither = (schema) => getEither(to(schema.ast), true);
const is = (schema) => {
  const getEither = validateEither(schema);
  return (a) => isRight(getEither(a));
};
const encode = (schema) => getEffect(schema.ast, false);
const defaultParseOption = {};
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
const go = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Refinement": {
      if (isDecoding) {
        const from = goMemo(ast.from, true);
        return (i, options) =>
          handleForbidden(
            flatMap(from(i, options), (a) =>
              match$3(ast.filter(a, options ?? defaultParseOption, ast), {
                onNone: () => success(a),
                onSome: fail,
              })
            ),
            options
          );
      } else {
        const from = goMemo(to(ast), true);
        const to$1 = goMemo(dropRightRefinement(ast.from), false);
        return (i, options) =>
          handleForbidden(
            flatMap(from(i, options), (a) => to$1(a, options)),
            options
          );
      }
    }
    case "Transform": {
      const transform = getFinalTransformation(ast.transformation, isDecoding);
      const from = isDecoding ? goMemo(ast.from, true) : goMemo(ast.to, false);
      const to = isDecoding ? goMemo(ast.to, true) : goMemo(ast.from, false);
      return (i1, options) =>
        handleForbidden(
          flatMap(from(i1, options), (a) =>
            flatMap(transform(a, options ?? defaultParseOption, ast), (i2) =>
              to(i2, options)
            )
          ),
          options
        );
    }
    case "Declaration": {
      const parse = ast.decode(isDecoding, ...ast.typeParameters);
      return (i, options) =>
        handleForbidden(parse(i, options ?? defaultParseOption, ast), options);
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
      const elements = ast.elements.map((e) => goMemo(e.type, isDecoding));
      const rest = map$7(
        ast.rest,
        map$6((ast) => goMemo(ast, isDecoding))
      );
      let requiredLen = ast.elements.filter((e) => !e.isOptional).length;
      if (isSome(ast.rest)) {
        requiredLen += ast.rest.value.length - 1;
      }
      return (input, options) => {
        if (!Array.isArray(input)) {
          return failure(type(unknownArray, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const len = input.length;
        for (let i = len; i <= requiredLen - 1; i++) {
          const e = index(i, [missing]);
          if (allErrors) {
            es.push([stepKey++, e]);
            continue;
          } else {
            return failure(e);
          }
        }
        if (isNone(ast.rest)) {
          for (let i = ast.elements.length; i <= len - 1; i++) {
            const e = index(i, [unexpected(input[i])]);
            if (allErrors) {
              es.push([stepKey++, e]);
              continue;
            } else {
              return failures(mutableAppend(sortByIndex(es), e));
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
                const e = index(i, eu.left.errors);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return failures(mutableAppend(sortByIndex(es), e));
                }
              }
              output.push([stepKey++, eu.right]);
            } else {
              const nk = stepKey++;
              const index$1 = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({ es: es, output: output }) =>
                flatMap$1(either(te), (t) => {
                  if (isLeft(t)) {
                    const e = index(index$1, t.left.errors);
                    if (allErrors) {
                      es.push([nk, e]);
                      return unit;
                    } else {
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                  }
                  output.push([nk, t.right]);
                  return unit;
                })
              );
            }
          }
        }
        if (isSome(rest)) {
          const [head, ...tail] = rest.value;
          for (; i < len - tail.length; i++) {
            const te = head(input[i], options);
            const eu = eitherOrUndefined(te);
            if (eu) {
              if (isLeft(eu)) {
                const e = index(i, eu.left.errors);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return failures(mutableAppend(sortByIndex(es), e));
                }
              } else {
                output.push([stepKey++, eu.right]);
              }
            } else {
              const nk = stepKey++;
              const index$1 = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({ es: es, output: output }) =>
                flatMap$1(either(te), (t) => {
                  if (isLeft(t)) {
                    const e = index(index$1, t.left.errors);
                    if (allErrors) {
                      es.push([nk, e]);
                      return unit;
                    } else {
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                  } else {
                    output.push([nk, t.right]);
                    return unit;
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
                  const e = index(i, eu.left.errors);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                }
                output.push([stepKey++, eu.right]);
              } else {
                const nk = stepKey++;
                const index$1 = i;
                if (!queue) {
                  queue = [];
                }
                queue.push(({ es: es, output: output }) =>
                  flatMap$1(either(te), (t) => {
                    if (isLeft(t)) {
                      const e = index(index$1, t.left.errors);
                      if (allErrors) {
                        es.push([nk, e]);
                        return unit;
                      } else {
                        return failures(mutableAppend(sortByIndex(es), e));
                      }
                    }
                    output.push([nk, t.right]);
                    return unit;
                  })
                );
              }
            }
          }
        }
        const computeResult = ({ es: es, output: output }) =>
          isNonEmptyArray(es)
            ? failures(sortByIndex(es))
            : success(sortByIndex(output));
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend(() => {
            const state = { es: Array.from(es), output: Array.from(output) };
            return flatMap$1(
              forEach(cqueue, (f) => f(state), {
                concurrency: "unbounded",
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
        propertySignatures.push(goMemo(ps.type, isDecoding));
        expectedKeys[ps.name] = null;
      }
      const indexSignatures = [];
      const expectedKeyTypes = {};
      for (const is of ast.indexSignatures) {
        indexSignatures.push([
          goMemo(is.parameter, isDecoding),
          goMemo(is.type, isDecoding),
        ]);
        const base = getParameterBase(is.parameter);
        if (isSymbolKeyword(base)) {
          expectedKeyTypes.symbol = true;
        } else {
          expectedKeyTypes.string = true;
        }
      }
      return (input, options) => {
        if (!isRecord(input)) {
          return failure(type(unknownRecord, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const onExcessPropertyError = options?.onExcessProperty === "error";
        if (onExcessPropertyError) {
          for (const key$1 of ownKeys(input)) {
            if (!Object.prototype.hasOwnProperty.call(expectedKeys, key$1)) {
              if (!(typeof key$1 in expectedKeyTypes)) {
                const e = key(key$1, [unexpected(input[key$1])]);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return failures(mutableAppend(sortByIndex(es), e));
                }
              }
            }
          }
        }
        const output = {};
        let queue = undefined;
        for (let i = 0; i < propertySignatures.length; i++) {
          const ps = ast.propertySignatures[i];
          const parser = propertySignatures[i];
          const name = ps.name;
          if (Object.prototype.hasOwnProperty.call(input, name)) {
            const te = parser(input[name], options);
            const eu = eitherOrUndefined(te);
            if (eu) {
              if (isLeft(eu)) {
                const e = key(name, eu.left.errors);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return failures(mutableAppend(sortByIndex(es), e));
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
                    const e = key(index, t.left.errors);
                    if (allErrors) {
                      es.push([nk, e]);
                      return unit;
                    } else {
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                  }
                  output[index] = t.right;
                  return unit;
                })
              );
            }
          } else {
            if (!ps.isOptional) {
              const e = key(name, [missing]);
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return failure(e);
              }
            }
          }
        }
        for (let i = 0; i < indexSignatures.length; i++) {
          const parameter = indexSignatures[i][0];
          const type = indexSignatures[i][1];
          const keys = getKeysForIndexSignature(
            input,
            ast.indexSignatures[i].parameter
          );
          for (const key$1 of keys) {
            if (!Object.prototype.hasOwnProperty.call(expectedKeys, key$1)) {
              const keu = eitherOrUndefined(parameter(key$1, options));
              if (keu) {
                if (isLeft(keu)) {
                  const e = key(key$1, keu.left.errors);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                }
              }
              const vpr = type(input[key$1], options);
              const veu = eitherOrUndefined(vpr);
              if (veu) {
                if (isLeft(veu)) {
                  const e = key(key$1, veu.left.errors);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                } else {
                  if (
                    !Object.prototype.hasOwnProperty.call(expectedKeys, key$1)
                  ) {
                    output[key$1] = veu.right;
                  }
                }
              } else {
                const nk = stepKey++;
                const index = key$1;
                if (!queue) {
                  queue = [];
                }
                queue.push(({ es: es, output: output }) =>
                  flatMap$1(either(vpr), (tv) => {
                    if (isLeft(tv)) {
                      const e = key(index, tv.left.errors);
                      if (allErrors) {
                        es.push([nk, e]);
                        return unit;
                      } else {
                        return failures(mutableAppend(sortByIndex(es), e));
                      }
                    } else {
                      if (
                        !Object.prototype.hasOwnProperty.call(
                          expectedKeys,
                          key$1
                        )
                      ) {
                        output[key$1] = tv.right;
                      }
                      return unit;
                    }
                  })
                );
              }
            }
          }
        }
        const computeResult = ({ es: es, output: output }) =>
          isNonEmptyArray(es) ? failures(sortByIndex(es)) : success(output);
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend(() => {
            const state = {
              es: Array.from(es),
              output: Object.assign({}, output),
            };
            return flatMap$1(
              forEach(cqueue, (f) => f(state), {
                concurrency: "unbounded",
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
                  es.push([
                    stepKey++,
                    key(name, [type(searchTree.keys[name].ast, input[name])]),
                  ]);
                }
              } else {
                es.push([stepKey++, key(name, [missing])]);
              }
            }
          } else {
            es.push([stepKey++, type(unknownRecord, input)]);
          }
        }
        if (searchTree.otherwise.length > 0) {
          candidates = candidates.concat(searchTree.otherwise);
        }
        let queue = undefined;
        for (let i = 0; i < candidates.length; i++) {
          const pr = map.get(candidates[i])(input, options);
          const eu =
            !queue || queue.length === 0 ? eitherOrUndefined(pr) : undefined;
          if (eu) {
            if (isRight(eu)) {
              return success(eu.right);
            } else {
              es.push([stepKey++, unionMember(eu.left.errors)]);
            }
          } else {
            const nk = stepKey++;
            if (!queue) {
              queue = [];
            }
            queue.push((state) =>
              suspend(() => {
                if ("finalResult" in state) {
                  return unit;
                } else {
                  return flatMap$1(either(pr), (t) => {
                    if (isRight(t)) {
                      state.finalResult = success(t.right);
                    } else {
                      state.es.push([nk, unionMember(t.left.errors)]);
                    }
                    return unit;
                  });
                }
              })
            );
          }
        }
        const computeResult = (es) =>
          isNonEmptyArray(es)
            ? failures(sortByIndex(es))
            : failure(type(neverKeyword, input));
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend(() => {
            const state = { es: Array.from(es) };
            return flatMap$1(
              forEach(cqueue, (f) => f(state), {
                concurrency: 1,
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
    case "Lazy": {
      const get = memoizeThunk(() => goMemo(ast.f(), isDecoding));
      return (a, options) => get()(a, options);
    }
  }
};
const fromRefinement = (ast, refinement) => (u) =>
  refinement(u) ? success(u) : failure(type(ast, u));
const getLiterals = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Declaration":
      return getLiterals(ast.type, isDecoding);
    case "TypeLiteral": {
      const out = [];
      for (let i = 0; i < ast.propertySignatures.length; i++) {
        const propertySignature = ast.propertySignatures[i];
        const type = isDecoding
          ? from(propertySignature.type)
          : to(propertySignature.type);
        if (isLiteral(type) && !propertySignature.isOptional) {
          out.push([propertySignature.name, type]);
        }
      }
      return out;
    }
    case "Refinement":
      return getLiterals(ast.from, isDecoding);
    case "Transform":
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
        keys[key] = keys[key] || { buckets: {}, ast: neverKeyword };
        const buckets = keys[key].buckets;
        if (Object.prototype.hasOwnProperty.call(buckets, hash)) {
          if (j < tags.length - 1) {
            continue;
          }
          buckets[hash].push(member);
          keys[key].ast = createUnion([keys[key].ast, literal]);
        } else {
          buckets[hash] = [member];
          keys[key].ast = createUnion([keys[key].ast, literal]);
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
const handleForbidden = (conditional, options) => {
  const eu = eitherOrUndefined(conditional);
  return eu
    ? eu
    : options?.isEffectAllowed === true
    ? conditional
    : failure(forbidden);
};
const unknownArray = createTuple([], some([unknownKeyword]), true, {
  [DescriptionAnnotationId]: "a generic array",
});
const unknownRecord = createTypeLiteral(
  [],
  [
    createIndexSignature(stringKeyword, unknownKeyword, true),
    createIndexSignature(symbolKeyword, unknownKeyword, true),
  ],
  { [DescriptionAnnotationId]: "a generic object" }
);
const mutableAppend = (self, a) => {
  self.push(a);
  return self;
};
const getTemplateLiteralRegex = (ast) => {
  let pattern = `^${ast.head}`;
  for (const span of ast.spans) {
    if (isStringKeyword(span.type)) {
      pattern += ".*";
    } else if (isNumberKeyword(span.type)) {
      pattern += "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
    }
    pattern += span.literal;
  }
  pattern += "$";
  return new RegExp(pattern);
};
function sortByIndex(es) {
  return es.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0)).map(([_, a]) => a);
}
const getFinalPropertySignatureTransformation = (
  transformation,
  isDecoding
) => {
  switch (transformation._tag) {
    case "FinalPropertySignatureTransformation":
      return isDecoding ? transformation.decode : transformation.encode;
  }
};
const getFinalTransformation = (transformation, isDecoding) => {
  switch (transformation._tag) {
    case "FinalTransformation":
      return isDecoding ? transformation.decode : transformation.encode;
    case "ComposeTransformation":
      return success;
    case "TypeLiteralTransformation":
      return (input) => {
        let out = right(input);
        for (const pst of transformation.propertySignatureTransformations) {
          const [from, to] = isDecoding
            ? [pst.from, pst.to]
            : [pst.to, pst.from];
          const transform = getFinalPropertySignatureTransformation(
            pst.propertySignatureTransformation,
            isDecoding
          );
          const f = (input) => {
            const o = transform(
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
const TypeId = Symbol.for("@effect/schema/Schema");
const variance = { From: (_) => _, To: (_) => _ };
class SchemaImpl {
  ast;
  [TypeId] = variance;
  constructor(ast) {
    this.ast = ast;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
const make = (ast) => new SchemaImpl(ast);
const makeLiteral = (value) => make(createLiteral(value));
const literal = (...literals) =>
  union(...literals.map((literal) => makeLiteral(literal)));
const declare = (typeParameters, type, decode, annotations) =>
  make(
    createDeclaration(
      typeParameters.map((tp) => tp.ast),
      type.ast,
      (isDecoding, ...typeParameters) =>
        decode(isDecoding, ...typeParameters.map(make)),
      annotations
    )
  );
const _void = make(voidKeyword);
const number = make(numberKeyword);
const object = make(objectKeyword);
const union = (...members) => make(createUnion(members.map((m) => m.ast)));
const struct = (fields) => {
  const ownKeys$1 = ownKeys(fields);
  const pss = [];
  const froms = [];
  const tos = [];
  const propertySignatureTransformations = [];
  for (let i = 0; i < ownKeys$1.length; i++) {
    const key = ownKeys$1[i];
    const field = fields[key];
    if ("config" in field) {
      const config = field.config;
      const from = config.ast;
      const to$1 = to(from);
      const annotations = config.annotations;
      switch (config._tag) {
        case "PropertySignature":
          pss.push(
            createPropertySignature(key, from, false, true, annotations)
          );
          froms.push(createPropertySignature(key, from, false, true));
          tos.push(
            createPropertySignature(key, to$1, false, true, annotations)
          );
          break;
        case "Optional":
          pss.push(createPropertySignature(key, from, true, true, annotations));
          froms.push(createPropertySignature(key, from, true, true));
          tos.push(createPropertySignature(key, to$1, true, true, annotations));
          break;
        case "Default":
          froms.push(createPropertySignature(key, from, true, true));
          tos.push(
            createPropertySignature(key, to$1, false, true, annotations)
          );
          propertySignatureTransformations.push(
            createPropertySignatureTransform(
              key,
              key,
              createFinalPropertySignatureTransformation(
                orElse(() => some(config.value())),
                identity
              )
            )
          );
          break;
        case "Option":
          froms.push(createPropertySignature(key, from, true, true));
          tos.push(
            createPropertySignature(
              key,
              optionFromSelf(make(to$1)).ast,
              false,
              true,
              annotations
            )
          );
          propertySignatureTransformations.push(
            createPropertySignatureTransform(
              key,
              key,
              createFinalPropertySignatureTransformation(some, flatten$2)
            )
          );
          break;
      }
    } else {
      pss.push(createPropertySignature(key, field.ast, false, true));
      froms.push(createPropertySignature(key, field.ast, false, true));
      tos.push(createPropertySignature(key, to(field.ast), false, true));
    }
  }
  if (isNonEmptyReadonlyArray(propertySignatureTransformations)) {
    return make(
      createTransform(
        createTypeLiteral(froms, []),
        createTypeLiteral(tos, []),
        createTypeLiteralTransformation(propertySignatureTransformations)
      )
    );
  }
  return make(createTypeLiteral(pss, []));
};
const optionArbitrary = (value) => (fc) =>
  fc.oneof(fc.constant(none$4()), value(fc).map(some));
const optionPretty = (value) =>
  match$3({ onNone: () => "none()", onSome: (a) => `some(${value(a)})` });
const optionInline = (value) =>
  union(
    struct({ _tag: literal("None") }),
    struct({ _tag: literal("Some"), value: value })
  );
const optionFromSelf = (value) =>
  declare(
    [value],
    optionInline(value),
    (isDecoding, value) => {
      const parse$1 = isDecoding ? parse(value) : encode(value);
      return (u, options, ast) =>
        !isOption(u)
          ? failure(type(ast, u))
          : isNone(u)
          ? success(none$4())
          : map(parse$1(u.value, options), some);
    },
    {
      [IdentifierAnnotationId]: "Option",
      [PrettyHookId]: optionPretty,
      [ArbitraryHookId]: optionArbitrary,
      [EquivalenceHookId]: getEquivalence$3,
    }
  );
const schema = struct({ void: _void, number: number, object: object });
const valid = is(schema);
console.log(
  valid({
    undefined: undefined,
    void: undefined,
    bigint: BigInt(1),
    boolean: true,
    number: 1,
    object: {},
  })
);
