'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @since 2.0.0
 */
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}

function pipe(a, ab, bc, cd, de, ef, fg, gh, hi, ij) {
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
        case 10:
            return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
    }
    return;
}
var isFunctor = function (I) { return typeof I.map === 'function'; };
var isContravariant = function (I) { return typeof I.contramap === 'function'; };
var isFunctorWithIndex = function (I) { return typeof I.mapWithIndex === 'function'; };
var isApply = function (I) { return typeof I.ap === 'function'; };
var isChain = function (I) { return typeof I.chain === 'function'; };
var isBifunctor = function (I) { return typeof I.bimap === 'function'; };
var isExtend = function (I) { return typeof I.extend === 'function'; };
var isFoldable = function (I) { return typeof I.reduce === 'function'; };
var isFoldableWithIndex = function (I) { return typeof I.reduceWithIndex === 'function'; };
var isAlt = function (I) { return typeof I.alt === 'function'; };
var isCompactable = function (I) { return typeof I.compact === 'function'; };
var isFilterable = function (I) { return typeof I.filter === 'function'; };
var isFilterableWithIndex = function (I) {
    return typeof I.filterWithIndex === 'function';
};
var isProfunctor = function (I) { return typeof I.promap === 'function'; };
var isSemigroupoid = function (I) { return typeof I.compose === 'function'; };
var isMonadThrow = function (I) { return typeof I.throwError === 'function'; };
function pipeable(I) {
    var r = {};
    if (isFunctor(I)) {
        var map = function (f) { return function (fa) { return I.map(fa, f); }; };
        r.map = map;
    }
    if (isContravariant(I)) {
        var contramap = function (f) { return function (fa) { return I.contramap(fa, f); }; };
        r.contramap = contramap;
    }
    if (isFunctorWithIndex(I)) {
        var mapWithIndex = function (f) { return function (fa) { return I.mapWithIndex(fa, f); }; };
        r.mapWithIndex = mapWithIndex;
    }
    if (isApply(I)) {
        var ap = function (fa) { return function (fab) { return I.ap(fab, fa); }; };
        var apFirst = function (fb) { return function (fa) {
            return I.ap(I.map(fa, function (a) { return function () { return a; }; }), fb);
        }; };
        r.ap = ap;
        r.apFirst = apFirst;
        r.apSecond = function (fb) { return function (fa) {
            return I.ap(I.map(fa, function () { return function (b) { return b; }; }), fb);
        }; };
    }
    if (isChain(I)) {
        var chain = function (f) { return function (ma) { return I.chain(ma, f); }; };
        var chainFirst = function (f) { return function (ma) { return I.chain(ma, function (a) { return I.map(f(a), function () { return a; }); }); }; };
        var flatten = function (mma) { return I.chain(mma, identity); };
        r.chain = chain;
        r.chainFirst = chainFirst;
        r.flatten = flatten;
    }
    if (isBifunctor(I)) {
        var bimap = function (f, g) { return function (fa) { return I.bimap(fa, f, g); }; };
        var mapLeft = function (f) { return function (fa) { return I.mapLeft(fa, f); }; };
        r.bimap = bimap;
        r.mapLeft = mapLeft;
    }
    if (isExtend(I)) {
        var extend = function (f) { return function (wa) { return I.extend(wa, f); }; };
        var duplicate = function (wa) { return I.extend(wa, identity); };
        r.extend = extend;
        r.duplicate = duplicate;
    }
    if (isFoldable(I)) {
        var reduce = function (b, f) { return function (fa) { return I.reduce(fa, b, f); }; };
        var foldMap = function (M) {
            var foldMapM = I.foldMap(M);
            return function (f) { return function (fa) { return foldMapM(fa, f); }; };
        };
        var reduceRight = function (b, f) { return function (fa) { return I.reduceRight(fa, b, f); }; };
        r.reduce = reduce;
        r.foldMap = foldMap;
        r.reduceRight = reduceRight;
    }
    if (isFoldableWithIndex(I)) {
        var reduceWithIndex = function (b, f) { return function (fa) {
            return I.reduceWithIndex(fa, b, f);
        }; };
        var foldMapWithIndex = function (M) {
            var foldMapM = I.foldMapWithIndex(M);
            return function (f) { return function (fa) { return foldMapM(fa, f); }; };
        };
        var reduceRightWithIndex = function (b, f) { return function (fa) {
            return I.reduceRightWithIndex(fa, b, f);
        }; };
        r.reduceWithIndex = reduceWithIndex;
        r.foldMapWithIndex = foldMapWithIndex;
        r.reduceRightWithIndex = reduceRightWithIndex;
    }
    if (isAlt(I)) {
        var alt = function (that) { return function (fa) { return I.alt(fa, that); }; };
        r.alt = alt;
    }
    if (isCompactable(I)) {
        r.compact = I.compact;
        r.separate = I.separate;
    }
    if (isFilterable(I)) {
        var filter = function (predicate) { return function (fa) {
            return I.filter(fa, predicate);
        }; };
        var filterMap = function (f) { return function (fa) { return I.filterMap(fa, f); }; };
        var partition = function (predicate) { return function (fa) {
            return I.partition(fa, predicate);
        }; };
        var partitionMap = function (f) { return function (fa) { return I.partitionMap(fa, f); }; };
        r.filter = filter;
        r.filterMap = filterMap;
        r.partition = partition;
        r.partitionMap = partitionMap;
    }
    if (isFilterableWithIndex(I)) {
        var filterWithIndex = function (predicateWithIndex) { return function (fa) { return I.filterWithIndex(fa, predicateWithIndex); }; };
        var filterMapWithIndex = function (f) { return function (fa) {
            return I.filterMapWithIndex(fa, f);
        }; };
        var partitionWithIndex = function (predicateWithIndex) { return function (fa) { return I.partitionWithIndex(fa, predicateWithIndex); }; };
        var partitionMapWithIndex = function (f) { return function (fa) {
            return I.partitionMapWithIndex(fa, f);
        }; };
        r.filterWithIndex = filterWithIndex;
        r.filterMapWithIndex = filterMapWithIndex;
        r.partitionWithIndex = partitionWithIndex;
        r.partitionMapWithIndex = partitionMapWithIndex;
    }
    if (isProfunctor(I)) {
        var promap = function (f, g) { return function (fa) { return I.promap(fa, f, g); }; };
        r.promap = promap;
    }
    if (isSemigroupoid(I)) {
        var compose = function (that) { return function (fa) { return I.compose(fa, that); }; };
        r.compose = compose;
    }
    if (isMonadThrow(I)) {
        var fromOption = function (onNone) { return function (ma) {
            return ma._tag === 'None' ? I.throwError(onNone()) : I.of(ma.value);
        }; };
        var fromEither = function (ma) {
            return ma._tag === 'Left' ? I.throwError(ma.left) : I.of(ma.right);
        };
        var fromPredicate = function (predicate, onFalse) { return function (a) { return (predicate(a) ? I.of(a) : I.throwError(onFalse(a))); }; };
        var filterOrElse = function (predicate, onFalse) { return function (ma) { return I.chain(ma, function (a) { return (predicate(a) ? I.of(a) : I.throwError(onFalse(a))); }); }; };
        r.fromOption = fromOption;
        r.fromEither = fromEither;
        r.fromPredicate = fromPredicate;
        r.filterOrElse = filterOrElse;
    }
    return r;
}

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise
 *
 * @example
 * import { some, none, isSome } from 'fp-ts/lib/Option'
 *
 * assert.strictEqual(isSome(some(1)), true)
 * assert.strictEqual(isSome(none), false)
 *
 * @since 2.0.0
 */
function isSome(fa) {
    return fa._tag === 'Some';
}

var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * @since 2.5.0
 */
var URI = 'ReadonlyArray';
var concat = function (x, y) {
    var lenx = x.length;
    if (lenx === 0) {
        return y;
    }
    var leny = y.length;
    if (leny === 0) {
        return x;
    }
    var r = Array(lenx + leny);
    for (var i = 0; i < lenx; i++) {
        r[i] = x[i];
    }
    for (var i = 0; i < leny; i++) {
        r[i + lenx] = y[i];
    }
    return r;
};
/**
 * An empty array
 *
 * @since 2.5.0
 */
var empty = [];
/**
 * Return a list of length `n` with element `i` initialized with `f(i)`
 *
 * @example
 * import { makeBy } from 'fp-ts/lib/ReadonlyArray'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @since 2.5.0
 */
function makeBy(n, f) {
    // tslint:disable-next-line: readonly-array
    var r = [];
    for (var i = 0; i < n; i++) {
        r.push(f(i));
    }
    return r;
}
/**
 * Removes one level of nesting
 *
 * @example
 * import { flatten } from 'fp-ts/lib/ReadonlyArray'
 *
 * assert.deepStrictEqual(flatten([[1], [2], [3]]), [1, 2, 3])
 *
 * @since 2.5.0
 */
function flatten(mma) {
    var rLen = 0;
    var len = mma.length;
    for (var i = 0; i < len; i++) {
        rLen += mma[i].length;
    }
    var r = Array(rLen);
    var start = 0;
    for (var i = 0; i < len; i++) {
        var arr = mma[i];
        var l = arr.length;
        for (var j = 0; j < l; j++) {
            r[j + start] = arr[j];
        }
        start += l;
    }
    return r;
}
/**
 * Test whether an array is non empty narrowing down the type to `NonEmptyReadonlyArray<A>`
 *
 * @since 2.5.0
 */
function isNonEmpty(as) {
    return as.length > 0;
}
/**
 * Append an element to the end of an array, creating a new non empty array
 *
 * @example
 * import { snoc } from 'fp-ts/lib/ReadonlyArray'
 *
 * assert.deepStrictEqual(snoc([1, 2, 3], 4), [1, 2, 3, 4])
 *
 * @since 2.5.0
 */
function snoc(init, end) {
    var len = init.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = init[i];
    }
    r[len] = end;
    return r;
}
/**
 * @since 2.5.0
 */
var of = function (a) { return [a]; };
/**
 * @since 2.5.0
 */
var readonlyArray = {
    URI: URI,
    map: function (fa, f) { return fa.map(function (a) { return f(a); }); },
    mapWithIndex: function (fa, f) { return fa.map(function (a, i) { return f(i, a); }); },
    compact: function (as) { return readonlyArray.filterMap(as, identity); },
    separate: function (fa) {
        // tslint:disable-next-line: readonly-array
        var left = [];
        // tslint:disable-next-line: readonly-array
        var right = [];
        for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
            var e = fa_1[_i];
            if (e._tag === 'Left') {
                left.push(e.left);
            }
            else {
                right.push(e.right);
            }
        }
        return {
            left: left,
            right: right
        };
    },
    filter: function (as, predicate) {
        return as.filter(predicate);
    },
    filterMap: function (as, f) { return readonlyArray.filterMapWithIndex(as, function (_, a) { return f(a); }); },
    partition: function (fa, predicate) {
        return readonlyArray.partitionWithIndex(fa, function (_, a) { return predicate(a); });
    },
    partitionMap: function (fa, f) { return readonlyArray.partitionMapWithIndex(fa, function (_, a) { return f(a); }); },
    of: of,
    ap: function (fab, fa) { return flatten(readonlyArray.map(fab, function (f) { return readonlyArray.map(fa, f); })); },
    chain: function (fa, f) {
        var resLen = 0;
        var l = fa.length;
        var temp = new Array(l);
        for (var i = 0; i < l; i++) {
            var e = fa[i];
            var arr = f(e);
            resLen += arr.length;
            temp[i] = arr;
        }
        var r = Array(resLen);
        var start = 0;
        for (var i = 0; i < l; i++) {
            var arr = temp[i];
            var l_1 = arr.length;
            for (var j = 0; j < l_1; j++) {
                r[j + start] = arr[j];
            }
            start += l_1;
        }
        return r;
    },
    reduce: function (fa, b, f) { return readonlyArray.reduceWithIndex(fa, b, function (_, b, a) { return f(b, a); }); },
    foldMap: function (M) {
        var foldMapWithIndexM = readonlyArray.foldMapWithIndex(M);
        return function (fa, f) { return foldMapWithIndexM(fa, function (_, a) { return f(a); }); };
    },
    reduceRight: function (fa, b, f) { return readonlyArray.reduceRightWithIndex(fa, b, function (_, a, b) { return f(a, b); }); },
    unfold: function (b, f) {
        // tslint:disable-next-line: readonly-array
        var ret = [];
        var bb = b;
        while (true) {
            var mt = f(bb);
            if (isSome(mt)) {
                var _a = mt.value, a = _a[0], b_1 = _a[1];
                ret.push(a);
                bb = b_1;
            }
            else {
                break;
            }
        }
        return ret;
    },
    traverse: function (F) {
        var traverseWithIndexF = readonlyArray.traverseWithIndex(F);
        return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
    },
    sequence: function (F) { return function (ta) {
        return readonlyArray.reduce(ta, F.of(readonlyArray.zero()), function (fas, fa) {
            return F.ap(F.map(fas, function (as) { return function (a) { return snoc(as, a); }; }), fa);
        });
    }; },
    zero: function () { return empty; },
    alt: function (fx, f) { return concat(fx, f()); },
    extend: function (fa, f) { return fa.map(function (_, i, as) { return f(as.slice(i)); }); },
    wither: function (F) {
        var traverseF = readonlyArray.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), readonlyArray.compact); };
    },
    wilt: function (F) {
        var traverseF = readonlyArray.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), readonlyArray.separate); };
    },
    reduceWithIndex: function (fa, b, f) {
        var l = fa.length;
        var r = b;
        for (var i = 0; i < l; i++) {
            r = f(i, r, fa[i]);
        }
        return r;
    },
    foldMapWithIndex: function (M) { return function (fa, f) { return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty); }; },
    reduceRightWithIndex: function (fa, b, f) { return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b); },
    traverseWithIndex: function (F) { return function (ta, f) {
        return readonlyArray.reduceWithIndex(ta, F.of(readonlyArray.zero()), function (i, fbs, a) {
            return F.ap(F.map(fbs, function (bs) { return function (b) { return snoc(bs, b); }; }), f(i, a));
        });
    }; },
    partitionMapWithIndex: function (fa, f) {
        // tslint:disable-next-line: readonly-array
        var left = [];
        // tslint:disable-next-line: readonly-array
        var right = [];
        for (var i = 0; i < fa.length; i++) {
            var e = f(i, fa[i]);
            if (e._tag === 'Left') {
                left.push(e.left);
            }
            else {
                right.push(e.right);
            }
        }
        return {
            left: left,
            right: right
        };
    },
    partitionWithIndex: function (fa, predicateWithIndex) {
        // tslint:disable-next-line: readonly-array
        var left = [];
        // tslint:disable-next-line: readonly-array
        var right = [];
        for (var i = 0; i < fa.length; i++) {
            var a = fa[i];
            if (predicateWithIndex(i, a)) {
                right.push(a);
            }
            else {
                left.push(a);
            }
        }
        return {
            left: left,
            right: right
        };
    },
    filterMapWithIndex: function (fa, f) {
        // tslint:disable-next-line: readonly-array
        var result = [];
        for (var i = 0; i < fa.length; i++) {
            var optionB = f(i, fa[i]);
            if (isSome(optionB)) {
                result.push(optionB.value);
            }
        }
        return result;
    },
    filterWithIndex: function (fa, predicateWithIndex) {
        return fa.filter(function (a, i) { return predicateWithIndex(i, a); });
    }
};

/**
 * Return a list of length `n` with element `i` initialized with `f(i)`
 *
 * @example
 * import { makeBy } from 'fp-ts/lib/Array'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @since 2.0.0
 */
var makeBy$1 = makeBy;
/**
 * Test whether an array is non empty narrowing down the type to `NonEmptyArray<A>`
 *
 * @since 2.0.0
 */
var isNonEmpty$1 = isNonEmpty;

/**
 * @since 2.5.0
 */
var URI$1 = 'ReadonlyNonEmptyArray';
/**
 * @since 2.5.0
 */
function head(nea) {
    return nea[0];
}
/**
 * @since 2.5.0
 */
var of$1 = of;
/**
 * @since 2.5.0
 */
var readonlyNonEmptyArray = 
/*@__PURE__*/
(function () {
    var _a = readonlyArray, alt = _a.alt, map = _a.map, mapWithIndex = _a.mapWithIndex, of = _a.of, ap = _a.ap, chain = _a.chain, extend = _a.extend, reduce = _a.reduce, foldMap = _a.foldMap, reduceRight = _a.reduceRight, traverse = _a.traverse, sequence = _a.sequence, reduceRightWithIndex = _a.reduceRightWithIndex, foldMapWithIndex = _a.foldMapWithIndex, reduceWithIndex = _a.reduceWithIndex, traverseWithIndex = _a.traverseWithIndex;
    return {
        URI: URI$1,
        extract: head,
        alt: alt,
        map: map,
        mapWithIndex: mapWithIndex,
        of: of,
        ap: ap,
        chain: chain,
        extend: extend,
        reduce: reduce,
        foldMap: foldMap,
        reduceRight: reduceRight,
        traverse: traverse,
        sequence: sequence,
        reduceWithIndex: reduceWithIndex,
        foldMapWithIndex: foldMapWithIndex,
        reduceRightWithIndex: reduceRightWithIndex,
        traverseWithIndex: traverseWithIndex
    };
})();

/**
 * @since 2.0.0
 */
var URI$2 = 'NonEmptyArray';
/**
 * @since 2.0.0
 */
var of$2 = of$1;
/**
 * @since 2.0.0
 */
var nonEmptyArray = 
/*@__PURE__*/
(function () { return Object.assign({}, readonlyNonEmptyArray, { URI: URI$2 }); })();
var pipeables = /*@__PURE__*/ pipeable(nonEmptyArray);
var chain = /*@__PURE__*/ (function () { return pipeables.chain; })();
var map = /*@__PURE__*/ (function () { return pipeables.map; })();

var a = makeBy$1(10, identity);
isNonEmpty$1(a) &&
    pipe(a, map(function (n) { return n + 1; }), chain(function (n) { return of$2(n + 1); }), console.log);

exports.a = a;
