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

var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
 * Test whether an array is non empty narrowing down the type to `NonEmptyReadonlyArray<A>`
 *
 * @since 2.5.0
 */
function isNonEmpty(as) {
    return as.length > 0;
}
/**
 * @since 2.5.0
 */
var of = function (a) { return [a]; };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
var map_ = function (fa, f) { return fa.map(function (a) { return f(a); }); };
var chain_ = function (fa, f) {
    var outLen = 0;
    var l = fa.length;
    var temp = new Array(l);
    for (var i = 0; i < l; i++) {
        var e = fa[i];
        var arr = f(e);
        outLen += arr.length;
        temp[i] = arr;
    }
    var out = Array(outLen);
    var start = 0;
    for (var i = 0; i < l; i++) {
        var arr = temp[i];
        var l_1 = arr.length;
        for (var j = 0; j < l_1; j++) {
            out[j + start] = arr[j];
        }
        start += l_1;
    }
    return out;
};
/**
 * @since 2.5.0
 */
var chain = function (f) { return function (ma) {
    return chain_(ma, f);
}; };
/**
 * @since 2.5.0
 */
var map = function (f) { return function (fa) { return map_(fa, f); }; };

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
var of$1 = of;
/**
 * @since 2.5.0
 */
var chain$1 = chain;
/**
 * @since 2.5.0
 */
var map$1 = map;

var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
/**
 * @since 2.0.0
 */
var of$2 = of$1;
/**
 * @since 2.0.0
 */
var chain$2 = chain$1;
/**
 * @since 2.0.0
 */
var map$2 = map$1;

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

var a = makeBy$1(10, identity);
isNonEmpty$1(a) &&
    pipe(a, map$2(function (n) { return n + 1; }), chain$2(function (n) { return of$2(n + 1); }), console.log);

exports.a = a;
