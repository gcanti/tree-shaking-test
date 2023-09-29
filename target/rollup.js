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
      return body;
    case 1:
      return function (a) {
        if (arguments.length >= 1) {
          return body(a);
        }
        return function () {
          return body(a);
        };
      };
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
const constNull = constant(null);
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
const make$3 = (isEquivalent) => (self, that) =>
  self === that || isEquivalent(self, that);
const array$2 = (item) =>
  make$3((self, that) => {
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
const make$2 = (compare) => (self, that) =>
  self === that ? 0 : compare(self, that);
const number$1 = make$2((self, that) => (self < that ? -1 : 1));
const combineMany = dual(2, (self, collection) =>
  make$2((a1, a2) => {
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
  })
);
const empty$5 = () => make$2(() => 0);
const combineAll = (collection) => combineMany(empty$5(), collection);
const mapInput = dual(2, (self, f) => make$2((b1, b2) => self(f(b1), f(b2))));
const array$1 = (O) =>
  make$2((self, that) => {
    const aLen = self.length;
    const bLen = that.length;
    const len = Math.min(aLen, bLen);
    for (let i = 0; i < len; i++) {
      const o = O(self[i], that[i]);
      if (o !== 0) {
        return o;
      }
    }
    return number$1(aLen, bLen);
  });
const min$1 = (O) =>
  dual(2, (self, that) => (self === that || O(self, that) < 1 ? self : that));
const max$1 = (O) =>
  dual(2, (self, that) => (self === that || O(self, that) > -1 ? self : that));
const isFunction = isFunction$1;
const isObject = (input) =>
  (typeof input === "object" && input != null) || isFunction(input);
const isNullable = (input) => input === null || input === undefined;
const globalStoreId = Symbol.for("effect/GlobalValue/globalStoreId");
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
const adapter$1 = () =>
  function () {
    let x = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      x = arguments[i](x);
    }
    return new GenKindImpl(x);
  };
const defaultIncHi = 335903614;
const defaultIncLo = 4150755663;
const MUL_HI = 1481765933 >>> 0;
const MUL_LO = 1284865837 >>> 0;
const BIT_53 = 9007199254740992;
const BIT_27 = 134217728;
class PCGRandom {
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
    case "number": {
      return number(self);
    }
    case "bigint": {
      return string(self.toString(10));
    }
    case "boolean": {
      return string(String(self));
    }
    case "symbol": {
      return string(String(self));
    }
    case "string": {
      return string(self);
    }
    case "undefined": {
      return string("undefined");
    }
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
    default: {
      throw new Error("Bug in Equal.hash");
    }
  }
};
const random = (self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, number(pcgr.integer(Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
const combine = (b) => (self) => (self * 53) ^ b;
const optimize = (n) => (n & 3221225471) | ((n >>> 1) & 1073741824);
const isHash = (u) => typeof u === "object" && u !== null && symbol$1 in u;
const number = (n) => {
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
    h ^= pipe(string(keys[i]), combine(hash(o[keys[i]])));
  }
  return optimize(h);
};
const structure = (o) => structureKeys(o, Object.keys(o));
const array = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(hash(arr[i])));
  }
  return optimize(h);
};
const symbol = Symbol.for("effect/Equal");
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
const isEqual = (u) => typeof u === "object" && u !== null && symbol in u;
const equivalence = () => (self, that) => equals(self, that);
const NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
const toJSON = (x) => {
  if (
    typeof x === "object" &&
    x !== null &&
    "toJSON" in x &&
    typeof x["toJSON"] === "function" &&
    x["toJSON"].length === 0
  ) {
    return x.toJSON();
  } else if (Array.isArray(x)) {
    return x.map(toJSON);
  }
  return x;
};
const toString = (x) => JSON.stringify(x, null, 2);
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
      if (!(key in that && equals(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  },
};
const Structural$1 = (function () {
  function Structural(args) {
    if (args) {
      Object.assign(this, args);
    }
  }
  Structural.prototype = StructProto;
  return Structural;
})();
const Structural = Structural$1;
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
const OP_COMMIT = "Commit";
const OP_FAILURE = "Failure";
const OP_WITH_RUNTIME = "WithRuntime";
const EffectTypeId$1 = Symbol.for("effect/Effect");
const StreamTypeId = Symbol.for("effect/Stream");
const SinkTypeId = Symbol.for("effect/Sink");
const ChannelTypeId = Symbol.for("effect/Channel");
const effectVariance$1 = { _R: (_) => _, _E: (_) => _, _A: (_) => _ };
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
const EffectProto = {
  [EffectTypeId$1]: effectVariance$1,
  [StreamTypeId]: effectVariance$1,
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
const EffectProtoCommit = { ...EffectProto, _op: OP_COMMIT };
const EffectProtoCommitStructural = {
  ...EffectProtoCommit,
  ...Structural.prototype,
};
const StructuralBase$1 = (function () {
  function Base() {}
  Base.prototype = EffectProtoCommitStructural;
  return Base;
})();
const TypeId$1$1 = Symbol.for("effect/Option");
const CommonProto$1 = {
  ...EffectProto,
  [TypeId$1$1]: { _A: (_) => _ },
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
    return isOption(that) && isSome$1(that) && equals(that.value, this.value);
  },
  [symbol$1]() {
    return combine(hash(this._tag))(hash(this.value));
  },
  toJSON() {
    return { _id: "Option", _tag: this._tag, value: toJSON(this.value) };
  },
});
const NoneProto = Object.assign(Object.create(CommonProto$1), {
  _tag: "None",
  _op: "None",
  [symbol](that) {
    return isOption(that) && isNone$1(that);
  },
  [symbol$1]() {
    return combine(hash(this._tag));
  },
  toJSON() {
    return { _id: "Option", _tag: this._tag };
  },
});
const isOption = (input) =>
  typeof input === "object" && input != null && TypeId$1$1 in input;
const isNone$1 = (fa) => fa._tag === "None";
const isSome$1 = (fa) => fa._tag === "Some";
const none$1 = Object.create(NoneProto);
const some$2 = (value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};
const TypeId$3 = Symbol.for("effect/Either");
const CommonProto = {
  ...EffectProto,
  [TypeId$3]: { _A: (_) => _ },
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
      isEither$1(that) && isRight$1(that) && equals(that.right, this.right)
    );
  },
  [symbol$1]() {
    return combine(hash(this._tag))(hash(this.right));
  },
  toJSON() {
    return { _id: "Either", _tag: this._tag, right: toJSON(this.right) };
  },
});
const LeftProto = Object.assign(Object.create(CommonProto), {
  _tag: "Left",
  _op: "Left",
  [symbol](that) {
    return isEither$1(that) && isLeft$1(that) && equals(that.left, this.left);
  },
  [symbol$1]() {
    return combine(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return { _id: "Either", _tag: this._tag, left: toJSON(this.left) };
  },
});
const isEither$1 = (input) =>
  typeof input === "object" && input != null && TypeId$3 in input;
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
const getLeft$1 = (self) => (isRight$1(self) ? none$1 : some$2(self.left));
const getRight$1 = (self) => (isLeft$1(self) ? none$1 : some$2(self.right));
const fromOption$2 = dual(2, (self, onNone) =>
  isNone$1(self) ? left$1(onNone()) : right$1(self.value)
);
const TypeId$2 = TypeId$3;
const right = right$1;
const left = left$1;
const fromNullable$1 = dual(2, (self, onNullable) =>
  self == null ? left(onNullable(self)) : right(self)
);
const fromOption$1 = fromOption$2;
const try_ = (evaluate) => {
  if (isFunction(evaluate)) {
    try {
      return right(evaluate());
    } catch (e) {
      return left(e);
    }
  } else {
    try {
      return right(evaluate.try());
    } catch (e) {
      return left(evaluate.catch(e));
    }
  }
};
const isEither = isEither$1;
const isLeft = isLeft$1;
const isRight = isRight$1;
const getRight = getRight$1;
const getLeft = getLeft$1;
const getEquivalence$2 = (EE, EA) =>
  make$3(
    (x, y) =>
      x === y ||
      (isLeft(x)
        ? isLeft(y) && EE(x.left, y.left)
        : isRight(y) && EA(x.right, y.right))
  );
const mapBoth = dual(2, (self, { onLeft: onLeft, onRight: onRight }) =>
  isLeft(self) ? left(onLeft(self.left)) : right(onRight(self.right))
);
const mapLeft = dual(2, (self, f) =>
  isLeft(self) ? left(f(self.left)) : right(self.right)
);
const map$1 = dual(2, (self, f) =>
  isRight(self) ? right(f(self.right)) : left(self.left)
);
const match$1 = dual(2, (self, { onLeft: onLeft, onRight: onRight }) =>
  isLeft(self) ? onLeft(self.left) : onRight(self.right)
);
const merge = match$1({ onLeft: identity, onRight: identity });
const getOrElse$1 = dual(2, (self, onLeft) =>
  isLeft(self) ? onLeft(self.left) : self.right
);
const getOrNull = getOrElse$1(constNull);
const getOrUndefined$1 = getOrElse$1(constUndefined);
const getOrThrowWith = dual(2, (self, onLeft) => {
  if (isRight(self)) {
    return self.right;
  }
  throw onLeft(self.left);
});
const getOrThrow = getOrThrowWith(
  () => new Error("getOrThrow called on a Left")
);
const orElse = dual(2, (self, that) =>
  isLeft(self) ? that(self.left) : right(self.right)
);
const flatMap$1 = dual(2, (self, f) =>
  isLeft(self) ? left(self.left) : f(self.right)
);
const all = (input) => {
  if (Symbol.iterator in input) {
    const out = [];
    for (const e of input) {
      if (isLeft(e)) {
        return e;
      }
      out.push(e.right);
    }
    return right(out);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const e = input[key];
    if (isLeft(e)) {
      return e;
    }
    out[key] = e.right;
  }
  return right(out);
};
const reverse$2 = (self) =>
  isLeft(self) ? right(self.left) : left(self.right);
const adapter = adapter$1();
const gen = (f) => {
  const iterator = f(adapter);
  let state = iterator.next();
  if (state.done) {
    return right(void 0);
  } else {
    let current = state.value.value;
    if (isLeft(current)) {
      return current;
    }
    while (!state.done) {
      state = iterator.next(current.right);
      if (!state.done) {
        current = state.value.value;
        if (isLeft(current)) {
          return current;
        }
      }
    }
    return right(state.value);
  }
};
var Either = Object.freeze({
  __proto__: null,
  TypeId: TypeId$2,
  right: right,
  left: left,
  fromNullable: fromNullable$1,
  fromOption: fromOption$1,
  try: try_,
  isEither: isEither,
  isLeft: isLeft,
  isRight: isRight,
  getRight: getRight,
  getLeft: getLeft,
  getEquivalence: getEquivalence$2,
  mapBoth: mapBoth,
  mapLeft: mapLeft,
  map: map$1,
  match: match$1,
  merge: merge,
  getOrElse: getOrElse$1,
  getOrNull: getOrNull,
  getOrUndefined: getOrUndefined$1,
  getOrThrowWith: getOrThrowWith,
  getOrThrow: getOrThrow,
  orElse: orElse,
  flatMap: flatMap$1,
  all: all,
  reverse: reverse$2,
  gen: gen,
});
const none = () => none$1;
const some$1 = some$2;
const isNone = isNone$1;
const isSome = isSome$1;
const getOrElse = dual(2, (self, onNone) =>
  isNone(self) ? onNone() : self.value
);
const getOrUndefined = getOrElse(constUndefined);
const toArray = (self) => (isNone(self) ? [] : [self.value]);
const isNonEmptyArray$1 = (self) => self.length > 0;
const collect = dual(2, (self, f) => {
  const out = [];
  for (const key of Object.keys(self)) {
    out.push(f(key, self[key]));
  }
  return out;
});
const toEntries = collect((key, value) => [key, value]);
const make = (...elements) => elements;
const makeBy = (n, f) => {
  const max = Math.max(1, Math.floor(n));
  const out = [f(0)];
  for (let i = 1; i < max; i++) {
    out.push(f(i));
  }
  return out;
};
const range = (start, end) =>
  start <= end ? makeBy(end - start + 1, (i) => start + i) : [start];
const replicate = dual(2, (a, n) => makeBy(n, () => a));
const fromIterable = (collection) =>
  Array.isArray(collection) ? collection : Array.from(collection);
const fromRecord = toEntries;
const fromOption = toArray;
const match = dual(2, (self, { onEmpty: onEmpty, onNonEmpty: onNonEmpty }) =>
  isNonEmptyReadonlyArray(self) ? onNonEmpty(self) : onEmpty()
);
const matchLeft = dual(
  2,
  (self, { onEmpty: onEmpty, onNonEmpty: onNonEmpty }) =>
    isNonEmptyReadonlyArray(self)
      ? onNonEmpty(headNonEmpty$1(self), tailNonEmpty(self))
      : onEmpty()
);
const matchRight = dual(
  2,
  (self, { onEmpty: onEmpty, onNonEmpty: onNonEmpty }) =>
    isNonEmptyReadonlyArray(self)
      ? onNonEmpty(initNonEmpty(self), lastNonEmpty(self))
      : onEmpty()
);
const prepend$1 = dual(2, (self, head) => [head, ...self]);
const prependAll = dual(2, (self, that) =>
  fromIterable(that).concat(fromIterable(self))
);
const prependAllNonEmpty = dual(2, (self, that) => prependAll(self, that));
const append = dual(2, (self, last) => [...self, last]);
const appendAll$1 = dual(2, (self, that) =>
  fromIterable(self).concat(fromIterable(that))
);
const appendAllNonEmpty$1 = dual(2, (self, that) => appendAll$1(self, that));
const scan = dual(3, (self, b, f) => {
  const out = [b];
  let i = 0;
  for (const a of self) {
    out[i + 1] = f(out[i], a);
    i++;
  }
  return out;
});
const scanRight = dual(3, (self, b, f) => {
  const input = fromIterable(self);
  const out = new Array(input.length + 1);
  out[input.length] = b;
  for (let i = input.length - 1; i >= 0; i--) {
    out[i] = f(out[i + 1], input[i]);
  }
  return out;
});
const isEmptyArray = (self) => self.length === 0;
const isEmptyReadonlyArray = isEmptyArray;
const isNonEmptyArray = isNonEmptyArray$1;
const isNonEmptyReadonlyArray = isNonEmptyArray$1;
const length = (self) => self.length;
const isOutOfBound = (i, as) => i < 0 || i >= as.length;
const clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length));
const get = dual(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBound(i, self) ? none() : some$1(self[i]);
});
const unsafeGet$1 = dual(2, (self, index) => {
  const i = Math.floor(index);
  if (isOutOfBound(i, self)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self[i];
});
const unprepend = (self) => [headNonEmpty$1(self), tailNonEmpty(self)];
const unappend = (self) => [initNonEmpty(self), lastNonEmpty(self)];
const head = get(0);
const headNonEmpty$1 = unsafeGet$1(0);
const last = (self) =>
  isNonEmptyReadonlyArray(self) ? some$1(lastNonEmpty(self)) : none();
const lastNonEmpty = (self) => self[self.length - 1];
const tail = (self) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? some$1(tailNonEmpty(input)) : none();
};
const tailNonEmpty = (self) => self.slice(1);
const init = (self) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? some$1(initNonEmpty(input)) : none();
};
const initNonEmpty = (self) => self.slice(0, -1);
const take = dual(2, (self, n) => {
  const input = fromIterable(self);
  return input.slice(0, clamp(n, input));
});
const takeRight = dual(2, (self, n) => {
  const input = fromIterable(self);
  const i = clamp(n, input);
  return i === 0 ? [] : input.slice(-i);
});
const takeWhile = dual(2, (self, predicate) => {
  const out = [];
  for (const a of self) {
    if (!predicate(a)) {
      break;
    }
    out.push(a);
  }
  return out;
});
const spanIndex = (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (!predicate(a)) {
      break;
    }
    i++;
  }
  return i;
};
const span = dual(2, (self, predicate) =>
  splitAt(self, spanIndex(self, predicate))
);
const drop = dual(2, (self, n) => {
  const input = fromIterable(self);
  return input.slice(clamp(n, input), input.length);
});
const dropRight = dual(2, (self, n) => {
  const input = fromIterable(self);
  return input.slice(0, input.length - clamp(n, input));
});
const dropWhile = dual(2, (self, predicate) =>
  fromIterable(self).slice(spanIndex(self, predicate))
);
const findFirstIndex = dual(2, (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (predicate(a)) {
      return some$1(i);
    }
    i++;
  }
  return none();
});
const findLastIndex = dual(2, (self, predicate) => {
  const input = fromIterable(self);
  for (let i = input.length - 1; i >= 0; i--) {
    if (predicate(input[i])) {
      return some$1(i);
    }
  }
  return none();
});
const findFirst = dual(2, (self, predicate) => {
  const input = fromIterable(self);
  for (let i = 0; i < input.length; i++) {
    if (predicate(input[i])) {
      return some$1(input[i]);
    }
  }
  return none();
});
const findLast = dual(2, (self, predicate) => {
  const input = fromIterable(self);
  for (let i = input.length - 1; i >= 0; i--) {
    if (predicate(input[i])) {
      return some$1(input[i]);
    }
  }
  return none();
});
const insertAt = dual(3, (self, i, b) => {
  const out = Array.from(self);
  if (i < 0 || i > out.length) {
    return none();
  }
  out.splice(i, 0, b);
  return some$1(out);
});
const replace = dual(3, (self, i, b) => modify(self, i, () => b));
const replaceOption = dual(3, (self, i, b) => modifyOption(self, i, () => b));
const modify = dual(3, (self, i, f) =>
  getOrElse(modifyOption(self, i, f), () => Array.from(self))
);
const modifyOption = dual(3, (self, i, f) => {
  const out = Array.from(self);
  if (isOutOfBound(i, out)) {
    return none();
  }
  const next = f(out[i]);
  out[i] = next;
  return some$1(out);
});
const remove = dual(2, (self, i) => {
  const out = Array.from(self);
  if (isOutOfBound(i, out)) {
    return out;
  }
  out.splice(i, 1);
  return out;
});
const reverse$1 = (self) => Array.from(self).reverse();
const reverseNonEmpty = (self) => [
  lastNonEmpty(self),
  ...self.slice(0, -1).reverse(),
];
const sort = dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
const sortWith = dual(3, (self, f, order) => sort(self, mapInput(order, f)));
const sortNonEmpty = dual(2, (self, O) => sort(O)(self));
const sortBy =
  (...orders) =>
  (self) => {
    const input = fromIterable(self);
    return isNonEmptyReadonlyArray(input)
      ? sortByNonEmpty(...orders)(input)
      : [];
  };
const sortByNonEmpty = (...orders) => sortNonEmpty(combineAll(orders));
const zip = dual(2, (self, that) => zipWith(self, that, (a, b) => [a, b]));
const zipWith = dual(3, (self, that, f) => {
  const as = fromIterable(self);
  const bs = fromIterable(that);
  return isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)
    ? zipNonEmptyWith(bs, f)(as)
    : [];
});
const zipNonEmpty = dual(2, (self, that) =>
  zipNonEmptyWith(self, that, (a, b) => [a, b])
);
const zipNonEmptyWith = dual(3, (self, that, f) => {
  const cs = [f(headNonEmpty$1(self), headNonEmpty$1(that))];
  const len = Math.min(self.length, that.length);
  for (let i = 1; i < len; i++) {
    cs[i] = f(self[i], that[i]);
  }
  return cs;
});
const unzip = (self) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? unzipNonEmpty(input) : [[], []];
};
const unzipNonEmpty = (self) => {
  const fa = [self[0][0]];
  const fb = [self[0][1]];
  for (let i = 1; i < self.length; i++) {
    fa[i] = self[i][0];
    fb[i] = self[i][1];
  }
  return [fa, fb];
};
const intersperse = dual(2, (self, middle) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input)
    ? intersperseNonEmpty(input, middle)
    : [];
});
const intersperseNonEmpty = dual(2, (self, middle) => {
  const out = [headNonEmpty$1(self)];
  const tail = tailNonEmpty(self);
  for (let i = 0; i < tail.length; i++) {
    if (i < tail.length) {
      out.push(middle);
    }
    out.push(tail[i]);
  }
  return out;
});
const modifyNonEmptyHead = dual(2, (self, f) => [
  f(headNonEmpty$1(self)),
  ...tailNonEmpty(self),
]);
const setNonEmptyHead = dual(2, (self, b) => modifyNonEmptyHead(self, () => b));
const modifyNonEmptyLast = dual(2, (self, f) =>
  append(initNonEmpty(self), f(lastNonEmpty(self)))
);
const setNonEmptyLast = dual(2, (self, b) => modifyNonEmptyLast(self, () => b));
const rotate = dual(2, (self, n) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? rotateNonEmpty(input, n) : [];
});
const rotateNonEmpty = dual(2, (self, n) => {
  const len = self.length;
  const m = Math.round(n) % len;
  if (isOutOfBound(Math.abs(m), self) || m === 0) {
    return copy$1(self);
  }
  if (m < 0) {
    const [f, s] = splitNonEmptyAt(self, -m);
    return appendAllNonEmpty$1(s, f);
  } else {
    return rotateNonEmpty(self, m - len);
  }
});
const containsWith = (isEquivalent) =>
  dual(2, (self, a) => {
    for (const i of self) {
      if (isEquivalent(a, i)) {
        return true;
      }
    }
    return false;
  });
const _equivalence$1 = equivalence();
const contains = containsWith(_equivalence$1);
const dedupeNonEmptyWith = dual(2, (self, isEquivalent) => {
  const out = [headNonEmpty$1(self)];
  const rest = tailNonEmpty(self);
  for (const a of rest) {
    if (out.every((o) => !isEquivalent(a, o))) {
      out.push(a);
    }
  }
  return out;
});
const dedupeNonEmpty = dedupeNonEmptyWith(equivalence());
const chop = dual(2, (self, f) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? chopNonEmpty(input, f) : [];
});
const chopNonEmpty = dual(2, (self, f) => {
  const [b, rest] = f(self);
  const out = [b];
  let next = rest;
  while (isNonEmptyArray$1(next)) {
    const [b, rest] = f(next);
    out.push(b);
    next = rest;
  }
  return out;
});
const splitAt = dual(2, (self, n) => {
  const input = Array.from(self);
  return n >= 1 && isNonEmptyReadonlyArray(input)
    ? splitNonEmptyAt(input, n)
    : isEmptyReadonlyArray(input)
    ? [input, []]
    : [[], input];
});
const copy$1 = (self) => self.slice();
const splitNonEmptyAt = dual(2, (self, n) => {
  const m = Math.max(1, n);
  return m >= self.length
    ? [copy$1(self), []]
    : [prepend$1(self.slice(1, m), headNonEmpty$1(self)), self.slice(m)];
});
const chunksOf = dual(2, (self, n) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? chunksOfNonEmpty(input, n) : [];
});
const chunksOfNonEmpty = dual(2, (self, n) =>
  chopNonEmpty(self, splitNonEmptyAt(n))
);
const groupWith = dual(2, (self, isEquivalent) =>
  chopNonEmpty(self, (as) => {
    const h = headNonEmpty$1(as);
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
  })
);
const group = groupWith(equivalence());
const groupBy = dual(2, (self, f) => {
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
const unionWith = (isEquivalent) =>
  dual(2, (self, that) => {
    const a = fromIterable(self);
    const b = fromIterable(that);
    return isNonEmptyReadonlyArray(a) && isNonEmptyReadonlyArray(b)
      ? unionNonEmptyWith(isEquivalent)(a, b)
      : isNonEmptyReadonlyArray(a)
      ? a
      : b;
  });
const union$2 = unionWith(_equivalence$1);
const unionNonEmptyWith = (isEquivalent) => {
  const dedupe = dedupeNonEmptyWith(isEquivalent);
  return dual(2, (self, that) => dedupe(appendAllNonEmpty$1(self, that)));
};
const unionNonEmpty = unionNonEmptyWith(_equivalence$1);
const intersectionWith = (isEquivalent) => {
  const has = containsWith(isEquivalent);
  return dual(2, (self, that) =>
    fromIterable(self).filter((a) => has(that, a))
  );
};
const intersection = intersectionWith(_equivalence$1);
const differenceWith = (isEquivalent) => {
  const has = containsWith(isEquivalent);
  return dual(2, (self, that) =>
    fromIterable(self).filter((a) => !has(that, a))
  );
};
const difference = differenceWith(_equivalence$1);
const empty$4 = () => [];
const of$1 = (a) => [a];
const map = dual(2, (self, f) => self.map(f));
const mapNonEmpty = map;
const flatMap = dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    out.push(...f(self[i], i));
  }
  return out;
});
const flatMapNonEmpty = flatMap;
const flatten = flatMap(identity);
const flattenNonEmpty = flatMapNonEmpty(identity);
const filterMap = dual(2, (self, f) => {
  const as = fromIterable(self);
  const out = [];
  for (let i = 0; i < as.length; i++) {
    const o = f(as[i], i);
    if (isSome(o)) {
      out.push(o.value);
    }
  }
  return out;
});
const filterMapWhile = dual(2, (self, f) => {
  const out = [];
  for (const a of self) {
    const b = f(a);
    if (isSome(b)) {
      out.push(b.value);
    } else {
      break;
    }
  }
  return out;
});
const partitionMap = dual(2, (self, f) => {
  const left = [];
  const right = [];
  const as = fromIterable(self);
  for (let i = 0; i < as.length; i++) {
    const e = f(as[i], i);
    if (isLeft(e)) {
      left.push(e.left);
    } else {
      right.push(e.right);
    }
  }
  return [left, right];
});
const compact = filterMap(identity);
const filter = dual(2, (self, predicate) => {
  const as = fromIterable(self);
  const out = [];
  for (let i = 0; i < as.length; i++) {
    if (predicate(as[i], i)) {
      out.push(as[i]);
    }
  }
  return out;
});
const partition = dual(2, (self, predicate) => {
  const left = [];
  const right = [];
  const as = fromIterable(self);
  for (let i = 0; i < as.length; i++) {
    if (predicate(as[i], i)) {
      right.push(as[i]);
    } else {
      left.push(as[i]);
    }
  }
  return [left, right];
});
const separate = partitionMap(identity);
const reduce = dual(3, (self, b, f) =>
  fromIterable(self).reduce((b, a, i) => f(b, a, i), b)
);
const reduceRight = dual(3, (self, b, f) =>
  fromIterable(self).reduceRight((b, a, i) => f(b, a, i), b)
);
const liftPredicate = (predicate) => (b) => predicate(b) ? [b] : [];
const liftOption =
  (f) =>
  (...a) =>
    fromOption(f(...a));
const fromNullable = (a) => (a == null ? empty$4() : [a]);
const liftNullable =
  (f) =>
  (...a) =>
    fromNullable(f(...a));
const flatMapNullable = dual(2, (self, f) =>
  isNonEmptyReadonlyArray(self)
    ? fromNullable(f(headNonEmpty$1(self)))
    : empty$4()
);
const liftEither =
  (f) =>
  (...a) => {
    const e = f(...a);
    return isLeft(e) ? [] : [e.right];
  };
const every = dual(2, (self, refinement) => self.every(refinement));
const some = dual(2, (self, predicate) => self.some(predicate));
const extend = dual(2, (self, f) => self.map((_, i, as) => f(as.slice(i))));
const min = dual(2, (self, O) => self.reduce(min$1(O)));
const max = dual(2, (self, O) => self.reduce(max$1(O)));
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
const getOrder = array$1;
const getEquivalence$1 = array$2;
const forEach$2 = dual(2, (self, f) =>
  fromIterable(self).forEach((a, i) => f(a, i))
);
const dedupeWith = dual(2, (self, isEquivalent) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input)
    ? dedupeNonEmptyWith(isEquivalent)(input)
    : [];
});
const dedupe = dedupeWith(equivalence());
const dedupeAdjacentWith = dual(2, (self, isEquivalent) => {
  const out = [];
  let lastA = none();
  for (const a of self) {
    if (isNone(lastA) || !isEquivalent(a, lastA.value)) {
      out.push(a);
      lastA = some$1(a);
    }
  }
  return out;
});
const dedupeAdjacent = dedupeAdjacentWith(equivalence());
const join = dual(2, (self, sep) => fromIterable(self).join(sep));
const mapAccum = dual(3, (self, s, f) => {
  let s1 = s;
  const out = [];
  for (const a of self) {
    const r = f(s1, a);
    s1 = r[0];
    out.push(r[1]);
  }
  return [s1, out];
});
const cartesianWith = dual(3, (self, that, f) =>
  flatMap(self, (a) => map(that, (b) => f(a, b)))
);
const cartesian = dual(2, (self, that) =>
  cartesianWith(self, that, (a, b) => [a, b])
);
var ReadonlyArray = Object.freeze({
  __proto__: null,
  make: make,
  makeBy: makeBy,
  range: range,
  replicate: replicate,
  fromIterable: fromIterable,
  fromRecord: fromRecord,
  fromOption: fromOption,
  match: match,
  matchLeft: matchLeft,
  matchRight: matchRight,
  prepend: prepend$1,
  prependAll: prependAll,
  prependAllNonEmpty: prependAllNonEmpty,
  append: append,
  appendAll: appendAll$1,
  appendAllNonEmpty: appendAllNonEmpty$1,
  scan: scan,
  scanRight: scanRight,
  isEmptyArray: isEmptyArray,
  isEmptyReadonlyArray: isEmptyReadonlyArray,
  isNonEmptyArray: isNonEmptyArray,
  isNonEmptyReadonlyArray: isNonEmptyReadonlyArray,
  length: length,
  get: get,
  unsafeGet: unsafeGet$1,
  unprepend: unprepend,
  unappend: unappend,
  head: head,
  headNonEmpty: headNonEmpty$1,
  last: last,
  lastNonEmpty: lastNonEmpty,
  tail: tail,
  tailNonEmpty: tailNonEmpty,
  init: init,
  initNonEmpty: initNonEmpty,
  take: take,
  takeRight: takeRight,
  takeWhile: takeWhile,
  span: span,
  drop: drop,
  dropRight: dropRight,
  dropWhile: dropWhile,
  findFirstIndex: findFirstIndex,
  findLastIndex: findLastIndex,
  findFirst: findFirst,
  findLast: findLast,
  insertAt: insertAt,
  replace: replace,
  replaceOption: replaceOption,
  modify: modify,
  modifyOption: modifyOption,
  remove: remove,
  reverse: reverse$1,
  reverseNonEmpty: reverseNonEmpty,
  sort: sort,
  sortWith: sortWith,
  sortNonEmpty: sortNonEmpty,
  sortBy: sortBy,
  sortByNonEmpty: sortByNonEmpty,
  zip: zip,
  zipWith: zipWith,
  zipNonEmpty: zipNonEmpty,
  zipNonEmptyWith: zipNonEmptyWith,
  unzip: unzip,
  unzipNonEmpty: unzipNonEmpty,
  intersperse: intersperse,
  intersperseNonEmpty: intersperseNonEmpty,
  modifyNonEmptyHead: modifyNonEmptyHead,
  setNonEmptyHead: setNonEmptyHead,
  modifyNonEmptyLast: modifyNonEmptyLast,
  setNonEmptyLast: setNonEmptyLast,
  rotate: rotate,
  rotateNonEmpty: rotateNonEmpty,
  containsWith: containsWith,
  contains: contains,
  dedupeNonEmptyWith: dedupeNonEmptyWith,
  dedupeNonEmpty: dedupeNonEmpty,
  chop: chop,
  chopNonEmpty: chopNonEmpty,
  splitAt: splitAt,
  copy: copy$1,
  splitNonEmptyAt: splitNonEmptyAt,
  chunksOf: chunksOf,
  chunksOfNonEmpty: chunksOfNonEmpty,
  groupWith: groupWith,
  group: group,
  groupBy: groupBy,
  unionWith: unionWith,
  union: union$2,
  unionNonEmptyWith: unionNonEmptyWith,
  unionNonEmpty: unionNonEmpty,
  intersectionWith: intersectionWith,
  intersection: intersection,
  differenceWith: differenceWith,
  difference: difference,
  empty: empty$4,
  of: of$1,
  map: map,
  mapNonEmpty: mapNonEmpty,
  flatMap: flatMap,
  flatMapNonEmpty: flatMapNonEmpty,
  flatten: flatten,
  flattenNonEmpty: flattenNonEmpty,
  filterMap: filterMap,
  filterMapWhile: filterMapWhile,
  partitionMap: partitionMap,
  compact: compact,
  filter: filter,
  partition: partition,
  separate: separate,
  reduce: reduce,
  reduceRight: reduceRight,
  liftPredicate: liftPredicate,
  liftOption: liftOption,
  fromNullable: fromNullable,
  liftNullable: liftNullable,
  flatMapNullable: flatMapNullable,
  liftEither: liftEither,
  every: every,
  some: some,
  extend: extend,
  min: min,
  max: max,
  unfold: unfold,
  getOrder: getOrder,
  getEquivalence: getEquivalence$1,
  forEach: forEach$2,
  dedupeWith: dedupeWith,
  dedupe: dedupe,
  dedupeAdjacentWith: dedupeAdjacentWith,
  dedupeAdjacent: dedupeAdjacent,
  join: join,
  mapAccum: mapAccum,
  cartesianWith: cartesianWith,
  cartesian: cartesian,
});
const TypeId$1 = Symbol.for("effect/Chunk");
function copy(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
const emptyArray = [];
const getEquivalence = (isEquivalent) =>
  make$3((self, that) =>
    toReadonlyArray$1(self).every((value, i) =>
      isEquivalent(value, unsafeGet(that, i))
    )
  );
const _equivalence = getEquivalence(equals);
const ChunkProto = {
  [TypeId$1]: { _A: (_) => _ },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return { _id: "Chunk", values: toReadonlyArray$1(this).map(toJSON) };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol](that) {
    return isChunk(that) && _equivalence(this, that);
  },
  [symbol$1]() {
    return array(toReadonlyArray$1(this));
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
        return toReadonlyArray$1(this)[Symbol.iterator]();
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
      chunk.left = _empty$2;
      chunk.right = _empty$2;
      break;
    }
    case "ISingleton": {
      chunk.length = 1;
      chunk.depth = 0;
      chunk.left = _empty$2;
      chunk.right = _empty$2;
      break;
    }
    case "ISlice": {
      chunk.length = backing.length;
      chunk.depth = backing.chunk.depth + 1;
      chunk.left = _empty$2;
      chunk.right = _empty$2;
      break;
    }
  }
  return chunk;
};
const isChunk = (u) => isObject(u) && TypeId$1 in u;
const _empty$2 = makeChunk({ _tag: "IEmpty" });
const empty$3 = () => _empty$2;
const of = (a) => makeChunk({ _tag: "ISingleton", a: a });
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
        array[j] = unsafeGet(self, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
};
const toReadonlyArray$1 = (self) => {
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
      self.left = _empty$2;
      self.right = _empty$2;
      self.depth = 0;
      return arr;
    }
  }
};
const reverse = (self) => {
  switch (self.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self;
    case "IArray": {
      return makeChunk({
        _tag: "IArray",
        array: reverse$1(self.backing.array),
      });
    }
    case "IConcat": {
      return makeChunk({
        _tag: "IConcat",
        left: reverse(self.backing.right),
        right: reverse(self.backing.left),
      });
    }
    case "ISlice":
      return unsafeFromArray(reverse$1(toReadonlyArray$1(self)));
  }
};
const unsafeFromArray = (self) => makeChunk({ _tag: "IArray", array: self });
const unsafeGet = dual(2, (self, index) => {
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
        ? unsafeGet(self.left, index)
        : unsafeGet(self.right, index - self.left.length);
    }
    case "ISlice": {
      return unsafeGet(self.backing.chunk, index + self.backing.offset);
    }
  }
});
const prepend = dual(2, (self, elem) => appendAllNonEmpty(of(elem), self));
const appendAll = dual(2, (self, that) => {
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
      const nr = appendAll(self.right, that);
      return makeChunk({ _tag: "IConcat", left: self.left, right: nr });
    } else {
      const nrr = appendAll(self.right.right, that);
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
      const nl = appendAll(self, that.left);
      return makeChunk({ _tag: "IConcat", left: nl, right: that.right });
    } else {
      const nll = appendAll(self, that.left.left);
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
const appendAllNonEmpty = dual(2, (self, that) => appendAll(self, that));
const isEmpty = (self) => self.length === 0;
const isNonEmpty = (self) => self.length > 0;
const unsafeHead = (self) => unsafeGet(self, 0);
const headNonEmpty = unsafeHead;
class Stack {
  constructor(value, previous) {
    this.value = value;
    this.previous = previous;
  }
}
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
    const v = f(none());
    if (isNone(v)) return new EmptyNode();
    ++size.value;
    return new LeafNode(edit, hash, key, v);
  }
}
function isEmptyNode(a) {
  return a instanceof EmptyNode;
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
  _tag = "LeafNode";
  constructor(edit, hash, key, value) {
    this.edit = edit;
    this.hash = hash;
    this.key = key;
    this.value = value;
  }
  modify(edit, shift, f, hash, key, size) {
    if (equals(key, this.key)) {
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
    const v = f(none());
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
    const v = f(none());
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
      if ("key" in child && equals(key, child.key)) {
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
    const newValue = f(none());
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
const HashMapTypeId = Symbol.for("effect/HashMap");
const HashMapProto = {
  [HashMapTypeId]: HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator(this, (k, v) => [k, v]);
  },
  [symbol$1]() {
    let hash$1 = hash("HashMap");
    for (const item of this) {
      hash$1 ^= combine(hash(item[0]))(hash(item[1]));
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
          if (!equals(item[1], elem.value)) {
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
    : none();
const visitLazy = (node, f, cont = undefined) => {
  switch (node._tag) {
    case "LeafNode": {
      if (isSome(node.value)) {
        return some$1({ value: f(node.key, node.value.value), cont: cont });
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
const _empty$1 = makeImpl$1(false, 0, new EmptyNode(), 0);
const empty$1$1 = () => _empty$1;
const isHashMap = (u) => isObject(u) && HashMapTypeId in u;
const getHash = dual(3, (self, key, hash) => {
  let node = self._root;
  let shift = 0;
  while (true) {
    switch (node._tag) {
      case "LeafNode": {
        return equals(key, node.key) ? node.value : none();
      }
      case "CollisionNode": {
        if (hash === node.hash) {
          const children = node.children;
          for (let i = 0, len = children.length; i < len; ++i) {
            const child = children[i];
            if ("key" in child && equals(key, child.key)) {
              return child.value;
            }
          }
        }
        return none();
      }
      case "IndexedNode": {
        const frag = hashFragment(shift, hash);
        const bit = toBitmap(frag);
        if (node.mask & bit) {
          node = node.children[fromBitmap(node.mask, bit)];
          shift += SIZE;
          break;
        }
        return none();
      }
      case "ArrayNode": {
        node = node.children[hashFragment(shift, hash)];
        if (node) {
          shift += SIZE;
          break;
        }
        return none();
      }
      default:
        return none();
    }
  }
});
const set = dual(3, (self, key, value) =>
  modifyAt(self, key, () => some$1(value))
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
const keys = (self) => new HashMapIterator(self, (key) => key);
const size$1 = (self) => self._size;
const beginMutation$1 = (self) =>
  makeImpl$1(true, self._edit + 1, self._root, self._size);
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
const forEach$1 = dual(2, (self, f) =>
  reduce$1$1(self, void 0, (_, value, key) => f(value, key))
);
const reduce$1$1 = dual(3, (self, zero, f) => {
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
const HashSetTypeId = Symbol.for("effect/HashSet");
const HashSetProto = {
  [HashSetTypeId]: HashSetTypeId,
  [Symbol.iterator]() {
    return keys(this._keyMap);
  },
  [symbol$1]() {
    return combine(hash(this._keyMap))(hash("HashSet"));
  },
  [symbol](that) {
    if (isHashSet(that)) {
      return (
        size$1(this._keyMap) === size$1(that._keyMap) &&
        equals(this._keyMap, that._keyMap)
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
const isHashSet = (u) => isObject(u) && HashSetTypeId in u;
const _empty = makeImpl(empty$1$1());
const empty$2 = () => _empty;
const size$2 = (self) => size$1(self._keyMap);
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
    ? (set(value, true)(self._keyMap), self)
    : makeImpl(set(value, true)(self._keyMap))
);
const union$1 = dual(2, (self, that) =>
  mutate(empty$2(), (set) => {
    forEach(self, (value) => add$1(set, value));
    for (const value of that) {
      add$1(set, value);
    }
  })
);
const forEach = dual(2, (self, f) => forEach$1(self._keyMap, (_, k) => f(k)));
const empty$1 = empty$2;
const size = size$2;
const add = add$1;
const union = union$1;
const ChunkPatchTypeId = Symbol.for("effect/DifferChunkPatch");
function variance$4(a) {
  return a;
}
({
  ...Structural.prototype,
  [ChunkPatchTypeId]: { _Value: variance$4, _Patch: variance$4 },
});
const ContextPatchTypeId = Symbol.for("effect/DifferContextPatch");
function variance$3(a) {
  return a;
}
({
  ...Structural.prototype,
  [ContextPatchTypeId]: { _Value: variance$3, _Patch: variance$3 },
});
const HashMapPatchTypeId = Symbol.for("effect/DifferHashMapPatch");
function variance$2(a) {
  return a;
}
({
  ...Structural.prototype,
  [HashMapPatchTypeId]: {
    _Value: variance$2,
    _Key: variance$2,
    _Patch: variance$2,
  },
});
const HashSetPatchTypeId = Symbol.for("effect/DifferHashSetPatch");
function variance$1(a) {
  return a;
}
({
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance$1,
    _Key: variance$1,
    _Patch: variance$1,
  },
});
const OrPatchTypeId = Symbol.for("effect/DifferOrPatch");
function variance$5(a) {
  return a;
}
({
  ...Structural.prototype,
  [OrPatchTypeId]: { _Value: variance$5, _Key: variance$5, _Patch: variance$5 },
});
const DifferTypeId = Symbol.for("effect/Differ");
const DifferProto = { [DifferTypeId]: { _P: identity, _V: identity } };
const make$1 = (params) => {
  const differ = Object.create(DifferProto);
  differ.empty = params.empty;
  differ.diff = params.diff;
  differ.combine = params.combine;
  differ.patch = params.patch;
  return differ;
};
const update$1 = () => updateWith$1((_, a) => a);
const updateWith$1 = (f) =>
  make$1({
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
      if (equals(oldValue, newValue)) {
        return identity;
      }
      return constant(newValue);
    },
    patch: (patch, oldValue) => f(oldValue, patch(oldValue)),
  });
const update = update$1;
const TypeId = Symbol.for("effect/List");
const toReadonlyArray = (self) => Array.from(self);
const NilProto = {
  [TypeId]: TypeId,
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
    return array(toReadonlyArray(this));
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
const isList = (u) => isObject(u) && TypeId in u;
const isCons = (self) => self._tag === "Cons";
const nil = () => _Nil;
const empty = nil;
const OP_DIE = "Die";
const OP_EMPTY = "Empty";
const OP_FAIL = "Fail";
const OP_INTERRUPT = "Interrupt";
const OP_PARALLEL = "Parallel";
const OP_SEQUENTIAL = "Sequential";
const CauseSymbolKey = "effect/Cause";
const CauseTypeId = Symbol.for(CauseSymbolKey);
const variance = { _E: (_) => _ };
const proto = {
  [CauseTypeId]: variance,
  [symbol$1]() {
    return pipe(hash(CauseSymbolKey), combine(hash(flattenCause(this))));
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
};
const fail$1 = (error) => {
  const o = Object.create(proto);
  o._tag = OP_FAIL;
  o.error = error;
  return o;
};
const parallel = (left, right) => {
  const o = Object.create(proto);
  o._tag = OP_PARALLEL;
  o.left = left;
  o.right = right;
  return o;
};
const sequential = (left, right) => {
  const o = Object.create(proto);
  o._tag = OP_SEQUENTIAL;
  o.left = left;
  o.right = right;
  return o;
};
const isCause = (u) => typeof u === "object" && u != null && CauseTypeId in u;
const isInterruptedOnly = (self) =>
  reduceWithContext(undefined, IsInterruptedOnlyCauseReducer)(self);
const causeEquals = (left, right) => {
  let leftStack = of(left);
  let rightStack = of(right);
  while (isNonEmpty(leftStack) && isNonEmpty(rightStack)) {
    const [leftParallel, leftSequential] = pipe(
      headNonEmpty(leftStack),
      reduce$1([empty$1(), empty$3()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return some$1([
          pipe(parallel, union(par)),
          pipe(sequential, appendAll(seq)),
        ]);
      })
    );
    const [rightParallel, rightSequential] = pipe(
      headNonEmpty(rightStack),
      reduce$1([empty$1(), empty$3()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return some$1([
          pipe(parallel, union(par)),
          pipe(sequential, appendAll(seq)),
        ]);
      })
    );
    if (!equals(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
const flattenCause = (cause) => flattenCauseLoop(of(cause), empty$3());
const flattenCauseLoop = (causes, flattened) => {
  while (1) {
    const [parallel, sequential] = pipe(
      causes,
      reduce([empty$1(), empty$3()], ([parallel, sequential], cause) => {
        const [par, seq] = evaluateCause(cause);
        return [pipe(parallel, union(par)), pipe(sequential, appendAll(seq))];
      })
    );
    const updated =
      size(parallel) > 0 ? pipe(flattened, prepend(parallel)) : flattened;
    if (isEmpty(sequential)) {
      return reverse(updated);
    }
    causes = sequential;
    flattened = updated;
  }
  throw new Error(
    "BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues"
  );
};
const evaluateCause = (self) => {
  let cause = self;
  const stack = [];
  let _parallel = empty$1();
  let _sequential = empty$3();
  while (cause !== undefined) {
    switch (cause._tag) {
      case OP_EMPTY: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL: {
        if (stack.length === 0) {
          return [pipe(_parallel, add(cause.error)), _sequential];
        }
        _parallel = pipe(_parallel, add(cause.error));
        cause = stack.pop();
        break;
      }
      case OP_DIE: {
        if (stack.length === 0) {
          return [pipe(_parallel, add(cause.defect)), _sequential];
        }
        _parallel = pipe(_parallel, add(cause.defect));
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        if (stack.length === 0) {
          return [pipe(_parallel, add(cause.fiberId)), _sequential];
        }
        _parallel = pipe(_parallel, add(cause.fiberId));
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL: {
        switch (cause.left._tag) {
          case OP_EMPTY: {
            cause = cause.right;
            break;
          }
          case OP_SEQUENTIAL: {
            cause = sequential(
              cause.left.left,
              sequential(cause.left.right, cause.right)
            );
            break;
          }
          case OP_PARALLEL: {
            cause = parallel(
              sequential(cause.left.left, cause.right),
              sequential(cause.left.right, cause.right)
            );
            break;
          }
          default: {
            _sequential = pipe(_sequential, prepend(cause.right));
            cause = cause.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL: {
        stack.push(cause.right);
        cause = cause.left;
        break;
      }
    }
  }
  throw new Error(
    "BUG: Cause.evaluateCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues"
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
const reduce$1 = dual(3, (self, zero, pf) => {
  let accumulator = zero;
  let cause = self;
  const causes = [];
  while (cause !== undefined) {
    const option = pf(accumulator, cause);
    accumulator = isSome(option) ? option.value : accumulator;
    switch (cause._tag) {
      case OP_SEQUENTIAL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      case OP_PARALLEL: {
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
      case OP_EMPTY: {
        output.push(right(reducer.emptyCase(context)));
        break;
      }
      case OP_FAIL: {
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
      case OP_SEQUENTIAL: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left({ _tag: OP_SEQUENTIAL_CASE }));
        break;
      }
      case OP_PARALLEL: {
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
      "BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/io/issues"
    );
  }
  return accumulator.pop();
});
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
    typeof u === "object" &&
    u != null &&
    "toString" in u &&
    typeof u["toString"] === "function" &&
    u["toString"] !== Object.prototype.toString
  ) {
    return u["toString"]();
  }
  if (typeof u === "object" && u !== null) {
    if ("message" in u && typeof u["message"] === "string") {
      const raw = JSON.parse(JSON.stringify(u));
      const keys = new Set(Object.keys(raw));
      keys.delete("name");
      keys.delete("message");
      keys.delete("_tag");
      if (keys.size === 0) {
        const name =
          "name" in u && typeof u.name === "string" ? u.name : "Error";
        const tag =
          "_tag" in u && typeof u["_tag"] === "string" ? `(${u._tag})` : ``;
        return `${name}${tag}: ${u.message}`;
      }
    }
  }
  return `Error: ${JSON.stringify(u)}`;
};
const spanSymbol$1 = Symbol.for("effect/SpanAnnotation");
const defaultRenderError = (error) => {
  const span =
    typeof error === "object" &&
    error !== null &&
    spanSymbol$1 in error &&
    error[spanSymbol$1];
  if (typeof error === "object" && error !== null && error instanceof Error) {
    return new PrettyError(
      prettyErrorMessage(error),
      error.stack
        ?.split("\n")
        .filter((_) => !_.startsWith("Error"))
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
const EffectTypeId = Symbol.for("effect/Effect");
class EffectPrimitive {
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
  trace = undefined;
  [EffectTypeId] = effectVariance;
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
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
  trace = undefined;
  [EffectTypeId] = effectVariance;
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
const effectVariance = { _R: (_) => _, _E: (_) => _, _A: (_) => _ };
const withFiberRuntime = (withRuntime) => {
  const effect = new EffectPrimitive(OP_WITH_RUNTIME);
  effect.i0 = withRuntime;
  return effect;
};
const spanSymbol = Symbol.for("effect/SpanAnnotation");
const originalSymbol = Symbol.for("effect/OriginalAnnotation");
const capture = (obj, span) => {
  if (isCons(span)) {
    const head = span.head;
    if (head._tag === "Span") {
      return new Proxy(obj, {
        has(target, p) {
          return p === spanSymbol || p === originalSymbol || p in target;
        },
        get(target, p) {
          if (p === spanSymbol) {
            return head;
          }
          if (p === originalSymbol) {
            return obj;
          }
          return target[p];
        },
      });
    }
  }
  return obj;
};
const fail$2 = (error) =>
  typeof error === "object" && error !== null && !(spanSymbol in error)
    ? withFiberRuntime((fiber) =>
        failCause(fail$1(capture(error, fiber.getFiberRef(currentTracerSpan))))
      )
    : failCause(fail$1(error));
const failCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
const FiberRefSymbolKey = "effect/FiberRef";
const FiberRefTypeId = Symbol.for(FiberRefSymbolKey);
const fiberRefVariance = { _A: (_) => _ };
const fiberRefUnsafeMake = (initial, options) =>
  fiberRefUnsafeMakePatch(initial, {
    differ: update(),
    fork: options?.fork ?? identity,
    join: options?.join,
  });
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
const currentTracerSpan = globalValue(
  Symbol.for("effect/FiberRef/currentTracerSpan"),
  () => fiberRefUnsafeMake(empty())
);
typeof process === "undefined" ? false : !!process?.isBun;
const fail = fail$2;
const StructuralBase = StructuralBase$1;
({
  ...StructuralBase.prototype,
  commit() {
    return fail(this);
  },
});
const divide = (a, b) =>
  b === 0 ? Either.left("cannot divide by zero") : Either.right(a / b);
const input = [2, 3, 5];
const program = ReadonlyArray.head(input).pipe(
  Either.fromOption(() => "empty array"),
  Either.flatMap((b) => divide(10, b)),
  Either.match({ onLeft: (e) => `Error: ${e}`, onRight: (a) => `Result: ${a}` })
);
console.log(program);
