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
/**
 * @since 2.5.0
 */
var chain = function (f) { return function (ma) {
    var outLen = 0;
    var l = ma.length;
    var temp = new Array(l);
    for (var i = 0; i < l; i++) {
        var e = ma[i];
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
}; };
/**
 * @since 2.5.0
 */
var map = function (f) { return function (fa) {
    return fa.map(function (a) { return f(a); });
}; };

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

var a = makeBy(10, identity);
isNonEmpty(a) &&
    pipe(a, map$1(function (n) { return n + 1; }), chain$1(function (n) { return of$1(n + 1); }), console.log);

exports.a = a;
