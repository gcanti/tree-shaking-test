"use strict";
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
const isNullable = (input) => input === null || input === undefined;
const globalStoreId = Symbol.for("@effect/data/GlobalValue/globalStoreId");
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
  Symbol.for("@effect/data/Hash/randomHashCache"),
  () => new WeakMap()
);
const pcgr = globalValue(
  Symbol.for("@effect/data/Hash/pcgr"),
  () => new PCGRandom()
);
const symbol$1 = Symbol.for("@effect/data/Hash");
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
const symbol = Symbol.for("@effect/data/Equal");
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
const EffectTypeId = Symbol.for("@effect/io/Effect");
const effectVariance = { _R: (_) => _, _E: (_) => _, _A: (_) => _ };
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
const TypeId$1 = Symbol.for("@effect/data/Option");
const CommonProto$1 = {
  [EffectTypeId]: effectVariance,
  [TypeId$1]: { _A: (_) => _ },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return toString(this.toJSON());
  },
};
const SomeProto = Object.assign(Object.create(CommonProto$1), {
  _tag: "Some",
  [symbol](that) {
    return isOption(that) && isSome(that) && equals(that.value, this.value);
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
  [symbol](that) {
    return isOption(that) && isNone(that);
  },
  [symbol$1]() {
    return combine(hash(this._tag));
  },
  toJSON() {
    return { _id: "Option", _tag: this._tag };
  },
});
const isOption = (input) =>
  typeof input === "object" && input != null && TypeId$1 in input;
const isNone = (fa) => fa._tag === "None";
const isSome = (fa) => fa._tag === "Some";
const none$1 = Object.create(NoneProto);
const some$1 = (value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};
const TypeId = Symbol.for("@effect/data/Either");
const CommonProto = {
  [EffectTypeId]: effectVariance,
  [TypeId]: { _A: (_) => _ },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return toString(this.toJSON());
  },
};
const RightProto = Object.assign(Object.create(CommonProto), {
  _tag: "Right",
  [symbol](that) {
    return isEither(that) && isRight(that) && equals(that.right, this.right);
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
  [symbol](that) {
    return isEither(that) && isLeft$1(that) && equals(that.left, this.left);
  },
  [symbol$1]() {
    return combine(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return { _id: "Either", _tag: this._tag, left: toJSON(this.left) };
  },
});
const isEither = (input) =>
  typeof input === "object" && input != null && TypeId in input;
const isLeft$1 = (ma) => ma._tag === "Left";
const isRight = (ma) => ma._tag === "Right";
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
const fromOption$1 = dual(2, (self, onNone) =>
  isNone(self) ? left$1(onNone()) : right$1(self.value)
);
const right = right$1;
const left = left$1;
const fromOption = fromOption$1;
const isLeft = isLeft$1;
const match = dual(2, (self, { onLeft: onLeft, onRight: onRight }) =>
  isLeft(self) ? onLeft(self.left) : onRight(self.right)
);
const flatMap = dual(2, (self, f) =>
  isLeft(self) ? left(self.left) : f(self.right)
);
const none = () => none$1;
const some = some$1;
const isOutOfBound = (i, as) => i < 0 || i >= as.length;
const get = dual(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBound(i, self) ? none() : some(self[i]);
});
const head = get(0);
const divide = (a, b) =>
  b === 0 ? left("cannot divide by zero") : right(a / b);
const input = [2, 3, 5];
const program = head(input).pipe(
  fromOption(() => "empty array"),
  flatMap((b) => divide(10, b)),
  match({ onLeft: (e) => `Error: ${e}`, onRight: (a) => `Result: ${a}` })
);
console.log(program);
