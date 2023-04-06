"use strict";
const dual = (arity, body) => {
    const isDataFirst =
      "number" == typeof arity ? (args) => args.length >= arity : arity;
    return function () {
      return isDataFirst(arguments)
        ? body.apply(this, arguments)
        : (self) => body(self, ...arguments);
    };
  },
  identity = (a) => a;
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
const make$3 = (
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
  ) => ({ combine: combine, combineMany: combineMany }),
  string$2 = make$3((self, that) => self + that),
  numberSum$1 = make$3((self, that) => self + that),
  numberMultiply$1 = make$3(
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
  bigintSum$1 = make$3((self, that) => self + that),
  bigintMultiply$1 = make$3(
    (self, that) => self * that,
    (self, collection) => {
      if (0n === self) return 0n;
      let out = self;
      for (const n of collection) {
        if (0n === n) return 0n;
        out *= n;
      }
      return out;
    }
  ),
  fromSemigroup = (S, empty) => ({
    combine: S.combine,
    combineMany: S.combineMany,
    empty: empty,
    combineAll: (collection) => S.combineMany(empty, collection),
  }),
  numberSum = fromSemigroup(numberSum$1, 0),
  numberMultiply = fromSemigroup(numberMultiply$1, 1),
  bigintSum = fromSemigroup(bigintSum$1, 0n),
  bigintMultiply = fromSemigroup(bigintMultiply$1, 1n),
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
  make$2 = (compare) => ({
    compare: (self, that) => (self === that ? 0 : compare(self, that)),
  }),
  number$2 = make$2((self, that) => (self < that ? -1 : 1)),
  reverse$2 = (O) => make$2((self, that) => O.compare(that, self)),
  contramap = dual(2, (self, f) =>
    make$2((b1, b2) => self.compare(f(b1), f(b2)))
  );
bigintSum$1.combine, bigintMultiply$1.combine;
const MonoidMultiply$1 = bigintMultiply;
bigintSum.combineAll, MonoidMultiply$1.combineAll;
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
        hi = ((aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16))) >>> 0;
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
      ((xorshifted >>> rot) | (xorshifted << (((-rot >>> 0) & 31) >>> 0))) >>> 0
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
  symbol$1 = Symbol.for("@effect/data/Hash"),
  hash = (self) => {
    switch (typeof self) {
      case "number":
        return number$1(self);
      case "bigint":
        return string$1(self.toString(10));
      case "boolean":
      case "symbol":
        return string$1(String(self));
      case "string":
        return string$1(self);
      case "undefined":
        return string$1("undefined");
      case "function":
      case "object":
        return null === self
          ? string$1("null")
          : isHash(self)
          ? self[symbol$1]()
          : random(self);
      default:
        throw new Error("Bug in Equal.hashGeneric");
    }
  },
  random = (self) => (
    randomHashCache.has(self) ||
      randomHashCache.set(
        self,
        number$1(pcgr.integer(Number.MAX_SAFE_INTEGER))
      ),
    randomHashCache.get(self)
  ),
  combine$1 = (b) => (self) => (53 * self) ^ b,
  optimize = (n) => (3221225471 & n) | ((n >>> 1) & 1073741824),
  isHash = (u) => "object" == typeof u && null !== u && symbol$1 in u,
  number$1 = (n) => {
    if (n != n || n === 1 / 0) return 0;
    let h = 0 | n;
    for (h !== n && (h ^= 4294967295 * n); n > 4294967295; )
      h ^= n /= 4294967295;
    return optimize(n);
  },
  string$1 = (str) => {
    let h = 5381,
      i = str.length;
    for (; i; ) h = (33 * h) ^ str.charCodeAt(--i);
    return optimize(h);
  },
  symbol = Symbol.for("@effect/data/Equal");
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
    self[symbol](that)
  );
}
const isEqual = (u) => "object" == typeof u && null !== u && symbol in u;
var _a$3;
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
                    name: name,
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
  untracedMethod = (body) =>
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
  EffectTypeId$3 = Symbol.for("@effect/io/Effect");
class TracedPrimitive {
  [((_a$3 = EffectTypeId$3), symbol)](that) {
    return this === that;
  }
  [symbol$1]() {
    return random(this);
  }
  constructor(i0, trace) {
    (this.i0 = i0),
      (this.trace = trace),
      (this._tag = "Traced"),
      (this.i1 = void 0),
      (this.i2 = void 0),
      (this[_a$3] = effectVariance$3);
  }
  traced(trace) {
    return trace ? new TracedPrimitive(this, trace) : this;
  }
}
const effectVariance$3 = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
  makeTraced = (self, source) => new TracedPrimitive(self, source);
var _a$2, _b$2;
const effectVariance$2 = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
  EffectTypeId$2 = Symbol.for("@effect/io/Effect");
class Some {
  [((_a$2 = EffectTypeId$2), symbol)](that) {
    return isOption(that) && isSome$1(that) && equals(that.i0, this.i0);
  }
  [symbol$1]() {
    return hash(this.i0);
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
      (this[_a$2] = effectVariance$2);
  }
  traced(trace) {
    return trace ? makeTraced(this, trace) : this;
  }
}
class None$1 {
  constructor() {
    (this._tag = "None"),
      (this.i0 = void 0),
      (this.i1 = void 0),
      (this.i2 = void 0),
      (this.trace = void 0),
      (this[_b$2] = effectVariance$2);
  }
  [((_b$2 = EffectTypeId$2), symbol)](that) {
    return isOption(that) && isNone$1(that);
  }
  [symbol$1]() {
    return hash(this._tag);
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
  isNone$1 = (fa) => "None" === fa._tag,
  isSome$1 = (fa) => "Some" === fa._tag,
  none$1 = new None$1();
var _a$1, _b$1;
const effectVariance$1 = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
  EffectTypeId$1 = Symbol.for("@effect/io/Effect");
class Right {
  [((_a$1 = EffectTypeId$1), symbol)](that) {
    return isEither(that) && isRight$1(that) && equals(that.i0, this.i0);
  }
  [symbol$1]() {
    return hash(this.i0);
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
      (this[_a$1] = effectVariance$1);
  }
  toJSON() {
    return { _tag: this._tag, right: this.i0 };
  }
  traced(trace) {
    return trace ? makeTraced(this, trace) : this;
  }
}
class Left {
  [((_b$1 = EffectTypeId$1), symbol)](that) {
    return isEither(that) && isLeft$1(that) && equals(that.i0, this.i0);
  }
  [symbol$1]() {
    return hash(this.i0);
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
      (this[_b$1] = effectVariance$1);
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
  isLeft$1 = (ma) => "Left" === ma._tag,
  isRight$1 = (ma) => "Right" === ma._tag;
number$2.compare, numberSum$1.combine, numberMultiply$1.combine;
const Order$1 = number$2,
  MonoidMultiply = numberMultiply;
numberSum.combineAll, MonoidMultiply.combineAll;
const right = (a) => new Right(a),
  left = (e) => new Left(e),
  isLeft = isLeft$1,
  isRight = isRight$1,
  none = () => none$1,
  some = (a) => new Some(a),
  isNone = isNone$1,
  isSome = isSome$1,
  map$3 = dual(2, (self, f) => (isNone(self) ? none() : some(f(self.value))));
string$2.combine;
const fromIterable$1 = (collection) =>
    Array.isArray(collection) ? collection : Array.from(collection),
  isEmptyReadonlyArray = (self) => 0 === self.length,
  isNonEmptyArray = (self) => self.length > 0,
  unsafeGet$1 = dual(2, (self, index) => {
    const i = Math.floor(index);
    if (((i, as) => i < 0 || i >= as.length)(i, self))
      throw new Error(`Index ${i} out of bounds`);
    return self[i];
  }),
  headNonEmpty$1 = unsafeGet$1(0),
  sort = dual(2, (self, O) => {
    const out = Array.from(self);
    return out.sort(O.compare), out;
  }),
  mapNonEmpty = dual(2, (self, f) => self.map(f)),
  flatMap$3 = dual(2, (self, f) => {
    if (isEmptyReadonlyArray(self)) return [];
    const out = [];
    for (let i = 0; i < self.length; i++) out.push(...f(self[i], i));
    return out;
  }),
  reduce$2 = dual(3, (self, b, f) =>
    fromIterable$1(self).reduce((b, a, i) => f(b, a, i), b)
  ),
  TypeId$1 = Symbol.for("@effect/data/Chunk"),
  emptyArray = [];
class ChunkImpl {
  constructor(backing) {
    switch (((this.backing = backing), (this._id = TypeId$1), backing._tag)) {
      case "IEmpty":
        (this.length = 0),
          (this.depth = 0),
          (this.left = this),
          (this.right = this);
        break;
      case "IConcat":
        (this.length = backing.left.length + backing.right.length),
          (this.depth = 1 + Math.max(backing.left.depth, backing.right.depth)),
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
  [symbol](that) {
    return (
      !(!isChunk(that) || this.length !== that.length) &&
      toReadonlyArray(this).every((value, i) =>
        equals(value, unsafeGet(that, i))
      )
    );
  }
  [symbol$1]() {
    return ((arr) => {
      let h = 6151;
      for (let i = 0; i < arr.length; i++) h = combine$1(hash(arr[i]))(h);
      return optimize(h);
    })(toReadonlyArray(this));
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
    "object" == typeof u && null != u && "_id" in u && u._id === TypeId$1,
  _empty = new ChunkImpl({ _tag: "IEmpty" }),
  empty$4 = () => _empty,
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
  unsafeGet = dual(2, (self, index) => {
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
          ? unsafeGet(self.left, index)
          : unsafeGet(self.right, index - self.left.length);
    }
  }),
  prepend = dual(2, (self, a) => concat(of(a), self)),
  concat = dual(2, (self, that) => {
    if ("IEmpty" === self.backing._tag) return that;
    if ("IEmpty" === that.backing._tag) return self;
    const diff = that.depth - self.depth;
    if (Math.abs(diff) <= 1)
      return new ChunkImpl({ _tag: "IConcat", left: self, right: that });
    if (diff < -1) {
      if (self.left.depth >= self.right.depth) {
        const nr = concat(that)(self.right);
        return new ChunkImpl({ _tag: "IConcat", left: self.left, right: nr });
      }
      {
        const nrr = concat(that)(self.right.right);
        if (nrr.depth === self.depth - 3) {
          const nr = new ChunkImpl({
            _tag: "IConcat",
            left: self.right.left,
            right: nrr,
          });
          return new ChunkImpl({ _tag: "IConcat", left: self.left, right: nr });
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
      const nl = concat(that.left)(self);
      return new ChunkImpl({ _tag: "IConcat", left: nl, right: that.right });
    }
    {
      const nll = concat(that.left.left)(self);
      if (nll.depth === that.depth - 3) {
        const nl = new ChunkImpl({
          _tag: "IConcat",
          left: nll,
          right: that.left.right,
        });
        return new ChunkImpl({ _tag: "IConcat", left: nl, right: that.right });
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
  isNonEmpty = (self) => self.length > 0,
  reduce$1 = dual(3, (self, b, f) => reduce$2(b, f)(toReadonlyArray(self))),
  of = (a) => new ChunkImpl({ _tag: "ISingleton", a: a }),
  reverse = (self) =>
    unsafeFromArray(
      ((self) => Array.from(self).reverse())(toReadonlyArray(self))
    ),
  unsafeHead = (self) => unsafeGet(0)(self),
  headNonEmpty = unsafeHead,
  TitleAnnotationId = "@effect/schema/TitleAnnotationId",
  hasTransformation = (ast) =>
    isRefinement(ast) ||
    isTransform(ast) ||
    isLazy(ast) ||
    ("hasTransformation" in ast && ast.hasTransformation),
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
    elements: elements,
    rest: rest,
    isReadonly: isReadonly,
    annotations: annotations,
    hasTransformation:
      elements.some((e) => hasTransformation(e.type)) ||
      (isSome(rest) && rest.value.some(hasTransformation)),
  }),
  createIndexSignature = (parameter, type, isReadonly) => {
    if ("NeverKeyword" === _getParameterKeyof(parameter)._tag)
      throw new Error(
        "An index signature parameter type must be 'string', 'symbol', a template literal type or a refinement of the previous types"
      );
    return { parameter: parameter, type: type, isReadonly: isReadonly };
  },
  createTypeLiteral = (
    propertySignatures,
    indexSignatures,
    annotations = {}
  ) => ({
    _tag: "TypeLiteral",
    propertySignatures: sortByCardinalityAsc(propertySignatures),
    indexSignatures: sortByCardinalityAsc(indexSignatures),
    annotations: annotations,
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
          annotations: annotations,
          hasTransformation: types.some(hasTransformation),
        };
    }
  },
  isLazy = (ast) => "Lazy" === ast._tag,
  isRefinement = (ast) => "Refinement" === ast._tag,
  isTransform = (ast) => "Transform" === ast._tag,
  getFrom = (ast) => {
    if (hasTransformation(ast))
      switch (ast._tag) {
        case "Declaration":
          return ((typeParameters, type, decode, annotations = {}) => ({
            _tag: "Declaration",
            typeParameters: typeParameters,
            type: type,
            decode: decode,
            annotations: annotations,
            hasTransformation:
              hasTransformation(type) || typeParameters.some(hasTransformation),
          }))(
            ast.typeParameters.map(getFrom),
            getFrom(ast.type),
            ast.decode,
            ast.annotations
          );
        case "Tuple":
          return createTuple(
            ast.elements.map((e) => ({ ...e, type: getFrom(e.type) })),
            map$3(ast.rest, mapNonEmpty(getFrom)),
            ast.isReadonly
          );
        case "TypeLiteral":
          return createTypeLiteral(
            ast.propertySignatures.map((p) => ({
              ...p,
              type: getFrom(p.type),
            })),
            ast.indexSignatures.map((is) => ({ ...is, type: getFrom(is.type) }))
          );
        case "Union":
          return createUnion(ast.types.map(getFrom));
        case "Lazy":
          return ((f, annotations = {}) => ({
            _tag: "Lazy",
            f: f,
            annotations: annotations,
          }))(() => getFrom(ast.f()));
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
    pipe(
      Order$1,
      contramap(({ type: type }) => _getCardinality(type))
    )
  ),
  _getWeight = (ast) => {
    switch (ast._tag) {
      case "Declaration":
        return _getWeight(ast.type);
      case "Tuple":
        return (
          ast.elements.length + (isSome(ast.rest) ? ast.rest.value.length : 0)
        );
      case "TypeLiteral": {
        const out = ast.propertySignatures.length + ast.indexSignatures.length;
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
  sortByWeightDesc = sort(reverse$2(contramap(Order$1, _getWeight))),
  unify = (candidates) => {
    let i,
      out = pipe(
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
  ownKeys = (o) => Object.keys(o).concat(Object.getOwnPropertySymbols(o)),
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
    const v = f(none());
    return isNone(v)
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
        : isNone(v)
        ? (--size.value, new EmptyNode())
        : canEditNode(this, edit)
        ? ((this.value = v), this)
        : new LeafNode(edit, hash, key, v);
    }
    const v = f(none());
    return isNone(v)
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
    const v = f(none());
    return isNone(v)
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
          : isNone(newValue)
          ? (--size.value, arraySpliceOut(mutate, i, list))
          : arrayUpdate(
              mutate,
              i,
              new LeafNode(edit, hash, key, newValue),
              list
            );
      }
    }
    const newValue = f(none());
    return isNone(newValue)
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
  [symbol$1]() {
    let hash$1 = hash("HashMap");
    for (const item of this) hash$1 ^= combine$1(hash(item[0]))(hash(item[1]));
    return hash$1;
  }
  [symbol](that) {
    if (isHashMap(that)) {
      if (that._size !== this._size) return !1;
      for (const item of this) {
        const elem = getHash(item[0], hash(item[0]))(that);
        if (isNone(elem)) return !1;
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
    if (isNone(this.v)) return { done: !0, value: void 0 };
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
      : none(),
  visitLazy = (node, f, cont) => {
    switch (node._tag) {
      case "LeafNode":
        return isSome(node.value)
          ? some({ value: f(node.key, node.value.value), cont: cont })
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
  isHashMap = (u) =>
    "object" == typeof u && null != u && "_id" in u && u._id === HashMapTypeId,
  getHash = dual(3, (self, key, hash) => {
    let node = self._root,
      shift = 0;
    for (;;)
      switch (node._tag) {
        case "LeafNode":
          return equals(key, node.key) ? node.value : none();
        case "CollisionNode":
          if (hash === node.hash) {
            const children = node.children;
            for (let i = 0, len = children.length; i < len; ++i) {
              const child = children[i];
              if ("key" in child && equals(key, child.key)) return child.value;
            }
          }
          return none();
        case "IndexedNode": {
          const bit = toBitmap(hashFragment(shift, hash));
          if (node.mask & bit) {
            (node = node.children[fromBitmap(node.mask, bit)]), (shift += 5);
            break;
          }
          return none();
        }
        case "ArrayNode":
          if (((node = node.children[hashFragment(shift, hash)]), node)) {
            shift += 5;
            break;
          }
          return none();
        default:
          return none();
      }
  }),
  set = dual(3, (self, key, value) => modifyAt(self, key, () => some(value))),
  setTree = dual(3, (self, newRoot, newSize) =>
    self._editable
      ? ((self._root = newRoot), (self._size = newSize), self)
      : newRoot === self._root
      ? self
      : new HashMapImpl(self._editable, self._edit, newRoot, newSize)
  ),
  size$2 = (self) => self._size,
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
    return setTree(newRoot, size.value)(self);
  }),
  forEachWithIndex = dual(2, (self, f) =>
    reduceWithIndex(self, void 0, (_, value, key) => f(value, key))
  ),
  reduceWithIndex = dual(3, (self, zero, f) => {
    const root = self._root;
    if ("LeafNode" === root._tag)
      return isSome(root.value) ? f(zero, root.value.value, root.key) : zero;
    if ("EmptyNode" === root._tag) return zero;
    const toVisit = [root.children];
    let children;
    for (; (children = toVisit.pop()); )
      for (let i = 0, len = children.length; i < len; ) {
        const child = children[i++];
        child &&
          !isEmptyNode(child) &&
          ("LeafNode" === child._tag
            ? isSome(child.value) &&
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
    return (self = this._keyMap), new HashMapIterator(self, (key) => key);
    var self;
  }
  [symbol$1]() {
    return combine$1(hash(this._keyMap))(hash("HashSet"));
  }
  [symbol](that) {
    return (
      !!isHashSet(that) &&
      size$2(this._keyMap) === size$2(that._keyMap) &&
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
    "object" == typeof u && null != u && "_id" in u && u._id === HashSetTypeId,
  empty$2 = () => new HashSetImpl(new HashMapImpl(!1, 0, new EmptyNode(), 0)),
  beginMutation = (self) =>
    new HashSetImpl(
      ((self) => new HashMapImpl(!0, self._edit + 1, self._root, self._size))(
        self._keyMap
      )
    ),
  mutate = dual(2, (self, f) => {
    const transient = beginMutation(self);
    return (
      f(transient), ((self) => ((self._keyMap._editable = !1), self))(transient)
    );
  }),
  add$1 = dual(2, (self, value) =>
    self._keyMap._editable
      ? (set(value, !0)(self._keyMap), self)
      : new HashSetImpl(set(value, !0)(self._keyMap))
  ),
  union$1 = dual(2, (self, that) =>
    mutate(empty$2(), (set) => {
      forEach$1(self, (value) => add$1(set, value));
      for (const value of that) add$1(set, value);
    })
  ),
  forEach$1 = dual(2, (self, f) =>
    forEachWithIndex(self._keyMap, (_, k) => f(k))
  ),
  empty$1 = empty$2,
  size = (self) => size$2(self._keyMap),
  add = add$1,
  union = union$1;
const CauseTypeId = Symbol.for("@effect/io/Cause"),
  proto = {
    [CauseTypeId]: { _E: (_) => _ },
    [symbol$1]() {
      return combine$1(hash(flattenCause(this)))(hash("@effect/io/Cause"));
    },
    [symbol](that) {
      return isCause(that) && causeEquals(this, that);
    },
  },
  empty = (() => {
    const o = Object.create(proto);
    return (o._tag = "Empty"), o;
  })(),
  die = (defect) => {
    const o = Object.create(proto);
    return (o._tag = "Die"), (o.defect = defect), o;
  },
  annotated = (cause, annotation) => {
    const o = Object.create(proto);
    return (
      (o._tag = "Annotated"), (o.cause = cause), (o.annotation = annotation), o
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
  defects = (self) =>
    reverse(
      reduce(self, empty$4(), (list, cause) =>
        "Die" === cause._tag ? some(prepend(cause.defect)(list)) : none()
      )
    ),
  electFailures = (self) =>
    match(
      self,
      empty,
      (failure) => die(failure),
      (defect) => die(defect),
      (fiberId) =>
        ((fiberId) => {
          const o = Object.create(proto);
          return (o._tag = "Interrupt"), (o.fiberId = fiberId), o;
        })(fiberId),
      (cause, annotation) =>
        ((self) => "Empty" === self._tag)(cause)
          ? cause
          : annotated(cause, annotation),
      (left, right) => sequential(left, right),
      (left, right) => parallel(left, right)
    ),
  causeEquals = (left, right) => {
    let leftStack = of(left),
      rightStack = of(right);
    for (; isNonEmpty(leftStack) && isNonEmpty(rightStack); ) {
      const [leftParallel, leftSequential] = reduce(
          [empty$1(), empty$4()],
          ([parallel, sequential], cause) => {
            const [par, seq] = evaluateCause(cause);
            return some([union(par)(parallel), concat(seq)(sequential)]);
          }
        )(headNonEmpty(leftStack)),
        [rightParallel, rightSequential] = reduce(
          [empty$1(), empty$4()],
          ([parallel, sequential], cause) => {
            const [par, seq] = evaluateCause(cause);
            return some([union(par)(parallel), concat(seq)(sequential)]);
          }
        )(headNonEmpty(rightStack));
      if (!equals(leftParallel, rightParallel)) return !1;
      (leftStack = leftSequential), (rightStack = rightSequential);
    }
    return !0;
  },
  flattenCause = (cause) => flattenCauseLoop(of(cause), empty$4()),
  flattenCauseLoop = (causes, flattened) => {
    for (;;) {
      const [parallel, sequential] = reduce$1(
          [empty$1(), empty$4()],
          ([parallel, sequential], cause) => {
            const [par, seq] = evaluateCause(cause);
            return [union(par)(parallel), concat(seq)(sequential)];
          }
        )(causes),
        updated = size(parallel) > 0 ? prepend(parallel)(flattened) : flattened;
      if (0 === sequential.length) return reverse(updated);
      (causes = sequential), (flattened = updated);
    }
    throw new Error(
      "BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues"
    );
  },
  evaluateCause = (self) => {
    let cause = self;
    const stack = [];
    let _parallel = empty$1(),
      _sequential = empty$4();
    for (; void 0 !== cause; )
      switch (cause._tag) {
        case "Empty":
          if (0 === stack.length) return [_parallel, _sequential];
          cause = stack.pop();
          break;
        case "Fail":
          if (0 === stack.length)
            return [add(cause.error)(_parallel), _sequential];
          (_parallel = add(cause.error)(_parallel)), (cause = stack.pop());
          break;
        case "Die":
          if (0 === stack.length)
            return [add(cause.defect)(_parallel), _sequential];
          (_parallel = add(cause.defect)(_parallel)), (cause = stack.pop());
          break;
        case "Interrupt":
          if (0 === stack.length)
            return [add(cause.fiberId)(_parallel), _sequential];
          (_parallel = add(cause.fiberId)(_parallel)), (cause = stack.pop());
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
              (_sequential = prepend(cause.right)(_sequential)),
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
  match = dual(
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
  reduce = dual(3, (self, zero, pf) => {
    let accumulator = zero,
      cause = self;
    const causes = [];
    for (; void 0 !== cause; ) {
      const option = pf(accumulator, cause);
      switch (
        ((accumulator = isSome(option) ? option.value : accumulator),
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
  reduceWithContext = dual(3, (self, context, reducer) => {
    const input = [self],
      output = [];
    for (; input.length > 0; ) {
      const cause = input.pop();
      switch (cause._tag) {
        case "Empty":
          output.push(right(reducer.emptyCase(context)));
          break;
        case "Fail":
          output.push(right(reducer.failCase(context, cause.error)));
          break;
        case "Die":
          output.push(right(reducer.dieCase(context, cause.defect)));
          break;
        case "Interrupt":
          output.push(right(reducer.interruptCase(context, cause.fiberId)));
          break;
        case "Annotated":
          input.push(cause.cause),
            output.push(
              left({ _tag: "AnnotatedCase", annotation: cause.annotation })
            );
          break;
        case "Sequential":
          input.push(cause.right),
            input.push(cause.left),
            output.push(left({ _tag: "SequentialCase" }));
          break;
        case "Parallel":
          input.push(cause.right),
            input.push(cause.left),
            output.push(left({ _tag: "ParallelCase" }));
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
  });
var _a, _b, _c;
const EffectTypeId = Symbol.for("@effect/io/Effect");
class EffectPrimitive {
  constructor(_tag) {
    (this._tag = _tag),
      (this.i0 = void 0),
      (this.i1 = void 0),
      (this.i2 = void 0),
      (this.trace = void 0),
      (this[_a] = effectVariance);
  }
  [((_a = EffectTypeId), symbol)](that) {
    return this === that;
  }
  [symbol$1]() {
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
      (this[_b] = effectVariance);
  }
  [((_b = EffectTypeId), symbol)](that) {
    return this === that;
  }
  [symbol$1]() {
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
      (this[_c] = effectVariance);
  }
  [((_c = EffectTypeId), symbol)](that) {
    return this === that;
  }
  [symbol$1]() {
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
const effectVariance = { _R: (_) => _, _E: (_) => _, _A: (_) => _ },
  either$1 = methodWithTrace(
    (trace) => (self) =>
      matchEffect(
        (e) => succeed$1(left(e)),
        (a) => succeed$1(right(a))
      )(self).traced(trace)
  ),
  failCause = methodWithTrace((trace) => (cause) => {
    const effect = new EffectPrimitiveFailure("Failure");
    return (effect.i0 = cause), trace ? effect.traced(trace) : effect;
  }),
  flatMap$2 = dualWithTrace(2, (trace, restore) => (self, f) => {
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
          const failures = ((self) =>
            reverse(
              reduce(self, empty$4(), (list, cause) =>
                "Fail" === cause._tag
                  ? some(prepend(cause.error)(list))
                  : none()
              )
            ))(cause);
          return defects(cause).length > 0
            ? failCause(electFailures(cause))
            : failures.length > 0
            ? restore(onFailure)(unsafeHead(failures))
            : failCause(cause);
        },
        onSuccess
      ).traced(trace)
  ),
  forEachDiscard$1 = dualWithTrace(
    2,
    (trace, restore) => (self, f) =>
      suspend$1(() => {
        const arr = Array.from(self);
        let i = 0;
        return whileLoop(
          () => i < arr.length,
          () => restore(f)(arr[i++]),
          () => {}
        );
      }).traced(trace)
  ),
  succeed$1 = methodWithTrace((trace) => (value) => {
    const effect = new EffectPrimitiveSuccess("Success");
    return (effect.i0 = value), trace ? effect.traced(trace) : effect;
  }),
  suspend$1 = methodWithTrace(
    (trace, restore) => (effect) =>
      flatMap$2(identity)(sync(restore(effect))).traced(trace)
  ),
  sync = methodWithTrace((trace, restore) => (evaluate) => {
    const effect = new EffectPrimitive("Sync");
    return (
      (effect.i0 = restore(evaluate)), trace ? effect.traced(trace) : effect
    );
  }),
  unit$1 = methodWithTrace((trace) => (_) => succeed$1(void 0).traced(trace)),
  whileLoop = methodWithTrace((trace, restore) => (check, body, process) => {
    const effect = new EffectPrimitive("While");
    return (
      (effect.i0 = restore(check)),
      (effect.i1 = restore(body)),
      (effect.i2 = restore(process)),
      trace ? effect.traced(trace) : effect
    );
  }),
  TypeId =
    (Number.MIN_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Symbol.for("@effect/data/Duration"));
class DurationImpl {
  constructor(millis) {
    (this.millis = millis), (this._id = TypeId);
  }
  [symbol$1]() {
    return hash(this.millis);
  }
  [symbol](that) {
    return isDuration(that) && this.millis === that.millis;
  }
}
const isDuration = (u) =>
    "object" == typeof u && null != u && "_id" in u && u._id === TypeId,
  zero = new DurationImpl(0);
fromSemigroup(
  make$3(dual(2, (self, that) => new DurationImpl(self.millis + that.millis))),
  zero
).combineAll;
runtimeDebug.minumumLogLevel;
const either = either$1,
  flatMap$1 = flatMap$2,
  forEachDiscard = forEachDiscard$1,
  suspend = suspend$1,
  unit = unit$1,
  parseError = (errors) => ({ _tag: "ParseError", errors: errors }),
  type = (expected, actual, message) => {
    return {
      _tag: "Type",
      expected: expected,
      actual: actual,
      message:
        ((nullableValue = message),
        null == nullableValue ? none() : some(nullableValue)),
    };
    var nullableValue;
  },
  forbidden = { _tag: "Forbidden" },
  index = (index, errors) => ({ _tag: "Index", index: index, errors: errors }),
  key = (key, errors) => ({ _tag: "Key", key: key, errors: errors }),
  missing = { _tag: "Missing" },
  unexpected = (actual) => ({ _tag: "Unexpected", actual: actual }),
  unionMember = (errors) => ({ _tag: "UnionMember", errors: errors }),
  success = right,
  failure = (e) => left(parseError([e])),
  failures = (es) => left(parseError(es)),
  eitherOrUndefined = (self) => {
    const s = self;
    if ("Left" === s._tag || "Right" === s._tag) return s;
  },
  flatMap = (self, f) => {
    const s = self;
    return "Left" === s._tag
      ? s
      : "Right" === s._tag
      ? f(s.right)
      : ((body) => {
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
        })((trace, restore) =>
          flatMap$1(self, (a) => restore(f)(a)).traced(trace)
        );
  },
  go = untracedMethod(() => (ast, isBoundary = !0) => {
    if (!1 === isBoundary && !hasTransformation(ast)) return success;
    switch (ast._tag) {
      case "Refinement":
      case "Transform": {
        const to = go(ast.to, !1);
        if (isBoundary) {
          const from = go(ast.from);
          return (i1, options) => {
            const conditional = flatMap(
                from(i1, options),
                to === success
                  ? (a) => ast.decode(a, options)
                  : (a) =>
                      flatMap(ast.decode(a, options), (i2) => to(i2, options))
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
              flatMap(ast.decode(a, options), (i2) => to(i2, options));
      }
      case "Declaration":
        return (i, options) => {
          const conditional = ast.decode(...ast.typeParameters)(i, options),
            either = eitherOrUndefined(conditional);
          return (
            either ||
            (!0 === options?.isEffectAllowed ? conditional : failure(forbidden))
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
          rest = pipe(ast.rest, map$3(mapNonEmpty((ast) => go(ast))));
        let requiredLen = ast.elements.filter((e) => !e.isOptional).length;
        return (
          isSome(ast.rest) && (requiredLen += ast.rest.value.length - 1),
          (input, options) => {
            if (!Array.isArray(input))
              return failure(type(unknownArray, input));
            const allErrors = "all" === options?.errors,
              es = [];
            let stepKey = 0;
            const len = input.length;
            for (let i = len; i <= requiredLen - 1; i++) {
              const e = index(i, [missing]);
              if (!allErrors) return failure(e);
              es.push([stepKey++, e]);
            }
            if (isNone(ast.rest))
              for (let i = ast.elements.length; i <= len - 1; i++) {
                const e = index(i, [unexpected(input[i])]);
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
                  if (isLeft(t)) {
                    const e = index(i, t.left.errors);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                  output.push([stepKey++, t.right]);
                } else {
                  const nk = stepKey++,
                    index$1 = i;
                  queue || (queue = []),
                    queue.push(
                      untracedMethod(
                        () =>
                          ({ es: es, output: output }) =>
                            flatMap$1(either(te), (t) => {
                              if (isLeft(t)) {
                                const e = index(index$1, t.left.errors);
                                return allErrors
                                  ? (es.push([nk, e]), unit())
                                  : failures(mutableAppend(sortByIndex(es), e));
                              }
                              return output.push([nk, t.right]), unit();
                            })
                      )
                    );
                }
              }
            if (isSome(rest)) {
              const head = headNonEmpty$1(rest.value),
                tail = rest.value.slice(1);
              for (; i < len - tail.length; i++) {
                const te = head(input[i], options),
                  t = eitherOrUndefined(te);
                if (t) {
                  if (isLeft(t)) {
                    const e = index(i, t.left.errors);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                  output.push([stepKey++, t.right]);
                } else {
                  const nk = stepKey++,
                    index$1 = i;
                  queue || (queue = []),
                    queue.push(
                      untracedMethod(
                        () =>
                          ({ es: es, output: output }) =>
                            flatMap$1(either(te), (t) => {
                              if (isLeft(t)) {
                                const e = index(index$1, t.left.errors);
                                return allErrors
                                  ? (es.push([nk, e]), unit())
                                  : failures(mutableAppend(sortByIndex(es), e));
                              }
                              return output.push([nk, t.right]), unit();
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
                    if (isLeft(t)) {
                      const e = index(i, t.left.errors);
                      if (allErrors) {
                        es.push([stepKey++, e]);
                        continue;
                      }
                      return failures(mutableAppend(sortByIndex(es), e));
                    }
                    output.push([stepKey++, t.right]);
                  } else {
                    const nk = stepKey++,
                      index$1 = i;
                    queue || (queue = []),
                      queue.push(
                        untracedMethod(
                          () =>
                            ({ es: es, output: output }) =>
                              flatMap$1(either(te), (t) => {
                                if (isLeft(t)) {
                                  const e = index(index$1, t.left.errors);
                                  return allErrors
                                    ? (es.push([nk, e]), unit())
                                    : failures(
                                        mutableAppend(sortByIndex(es), e)
                                      );
                                }
                                return output.push([nk, t.right]), unit();
                              })
                        )
                      );
                  }
                }
            }
            const computeResult = ({ es: es, output: output }) =>
              isNonEmptyArray(es)
                ? failures(sortByIndex(es))
                : success(sortByIndex(output));
            if (queue && queue.length > 0) {
              const cqueue = queue;
              return untraced(() =>
                suspend(() => {
                  const state = {
                    es: Array.from(es),
                    output: Array.from(output),
                  };
                  return flatMap$1(
                    forEachDiscard(cqueue, (f) => f(state)),
                    () => computeResult(state)
                  );
                })
              );
            }
            return computeResult({ output: output, es: es });
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
              const e = key(name, [missing]);
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
            for (const key$1 of ownKeys(input))
              if (!Object.prototype.hasOwnProperty.call(expectedKeys, key$1)) {
                const e = key(key$1, [unexpected(input[key$1])]);
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
                if (isLeft(t)) {
                  const e = key(name, t.left.errors);
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
                    untracedMethod(
                      () =>
                        ({ es: es, output: output }) =>
                          flatMap$1(either(te), (t) => {
                            if (isLeft(t)) {
                              const e = key(index, t.left.errors);
                              return allErrors
                                ? (es.push([nk, e]), unit())
                                : failures(mutableAppend(sortByIndex(es), e));
                            }
                            return (output[index] = t.right), unit();
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
              for (const key$1 of keys) {
                if (Object.prototype.hasOwnProperty.call(expectedKeys, key$1))
                  continue;
                const te = parameter(key$1, options),
                  t = eitherOrUndefined(te);
                if (t && isLeft(t)) {
                  const e = key(key$1, t.left.errors);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  }
                  return failures(mutableAppend(sortByIndex(es), e));
                }
                const tve = type(input[key$1], options),
                  tv = eitherOrUndefined(tve);
                if (tv) {
                  if (isLeft(tv)) {
                    const e = key(key$1, tv.left.errors);
                    if (allErrors) {
                      es.push([stepKey++, e]);
                      continue;
                    }
                    return failures(mutableAppend(sortByIndex(es), e));
                  }
                  output[key$1] = tv.right;
                } else {
                  const nk = stepKey++,
                    index = key$1;
                  queue || (queue = []),
                    queue.push(
                      untracedMethod(
                        () =>
                          ({ es: es, output: output }) =>
                            flatMap$1(either(tve), (tv) => {
                              if (isLeft(tv)) {
                                const e = key(index, tv.left.errors);
                                return allErrors
                                  ? (es.push([nk, e]), unit())
                                  : failures(mutableAppend(sortByIndex(es), e));
                              }
                              return (output[key$1] = tv.right), unit();
                            })
                      )
                    );
                }
              }
            }
          const computeResult = ({ es: es, output: output }) =>
            isNonEmptyArray(es) ? failures(sortByIndex(es)) : success(output);
          if (queue && queue.length > 0) {
            const cqueue = queue;
            return untraced(() =>
              suspend(() => {
                const state = {
                  es: Array.from(es),
                  output: Object.assign({}, output),
                };
                return flatMap$1(
                  forEachDiscard(cqueue, (f) => f(state)),
                  () => computeResult(state)
                );
              })
            );
          }
          return computeResult({ es: es, output: output });
        };
      }
      case "Union": {
        const searchTree = _getSearchTree(ast.types),
          ownKeys$1 = ownKeys(searchTree.keys),
          len = ownKeys$1.length,
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
                const name = ownKeys$1[i],
                  buckets = searchTree.keys[name].buckets;
                if (Object.prototype.hasOwnProperty.call(input, name)) {
                  const literal = String(input[name]);
                  Object.prototype.hasOwnProperty.call(buckets, literal)
                    ? (candidates = candidates.concat(buckets[literal]))
                    : es.push([
                        stepKey++,
                        key(name, [
                          type(searchTree.keys[name].ast, input[name]),
                        ]),
                      ]);
                } else es.push([stepKey++, key(name, [missing])]);
              }
            else es.push([stepKey++, type(unknownRecord, input)]);
          searchTree.otherwise.length > 0 &&
            (candidates = candidates.concat(searchTree.otherwise));
          for (let i = 0; i < candidates.length; i++) {
            const te = map.get(candidates[i])(input, options),
              t = queue && 0 !== queue.length ? void 0 : eitherOrUndefined(te);
            if (t) {
              if (isRight(t)) return success(t.right);
              es.push([stepKey++, unionMember(t.left.errors)]);
            } else {
              const nk = stepKey++;
              queue || (queue = []),
                queue.push(
                  untracedMethod(
                    () => (state) =>
                      suspend(() =>
                        "finalResult" in state
                          ? unit()
                          : flatMap$1(
                              either(te),
                              (t) => (
                                isRight(t)
                                  ? (state.finalResult = success(t.right))
                                  : state.es.push([
                                      nk,
                                      unionMember(t.left.errors),
                                    ]),
                                unit()
                              )
                            )
                      )
                  )
                );
            }
          }
          const computeResult = (es) =>
            isNonEmptyArray(es)
              ? failures(sortByIndex(es))
              : failure(type(neverKeyword, input));
          if (queue && queue.length > 0) {
            const cqueue = queue;
            return untraced(() =>
              suspend(() => {
                const state = { es: Array.from(es) };
                return flatMap$1(
                  forEachDiscard(cqueue, (f) => f(state)),
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
    return { keys: keys, otherwise: otherwise };
  },
  unknownArray = createTuple([], some([unknownKeyword]), !0, {
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
  return es.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0)).map(([_, a]) => a);
}
const make = (ast) => ({ ast: ast }),
  OptionalSchemaId = Symbol.for("@effect/schema/Schema/OptionalSchema");
var fields,
  Person = make(
    createTypeLiteral(
      ownKeys(
        (fields = { name: make(stringKeyword), age: make(numberKeyword) })
      ).map((key) => {
        return ((name, type, isOptional, isReadonly, annotations = {}) => ({
          name: name,
          type: type,
          isOptional: isOptional,
          isReadonly: isReadonly,
          annotations: annotations,
        }))(
          key,
          fields[key].ast,
          "_id" in (schema = fields[key]) && schema._id === OptionalSchemaId,
          !0
        );
        var schema;
      }),
      []
    )
  );
((ast) => {
  const parser = go(ast);
  return (input, options) => parser(input, options);
})(Person.ast)({});
