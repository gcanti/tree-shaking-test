'use strict';

/**
 * The `Ord` type class represents types which support comparisons with a _total order_.
 *
 * Instances should satisfy the laws of total orderings:
 *
 * 1. Reflexivity: `S.compare(a, a) <= 0`
 * 2. Antisymmetry: if `S.compare(a, b) <= 0` and `S.compare(b, a) <= 0` then `a <-> b`
 * 3. Transitivity: if `S.compare(a, b) <= 0` and `S.compare(b, c) <= 0` then `S.compare(a, c) <= 0`
 *
 * @since 2.0.0
 */
/**
 * @since 2.0.0
 */
var URI = 'Ord';
// default compare for primitive types
var compare = function (x, y) {
    return x < y ? -1 : x > y ? 1 : 0;
};
function strictEqual(a, b) {
    return a === b;
}
/**
 * @since 2.0.0
 */
var ordNumber = {
    equals: strictEqual,
    compare: compare
};
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
function max(O) {
    return function (x, y) { return (O.compare(x, y) === -1 ? y : x); };
}
/**
 * @since 2.0.0
 */
function fromCompare(compare) {
    var optimizedCompare = function (x, y) { return (x === y ? 0 : compare(x, y)); };
    return {
        equals: function (x, y) { return optimizedCompare(x, y) === 0; },
        compare: optimizedCompare
    };
}
/**
 * @since 2.0.0
 */
var ord = {
    URI: URI,
    contramap: function (fa, f) { return fromCompare(function (x, y) { return fa.compare(f(x), f(y)); }); }
};
/**
 * @since 2.0.0
 */
var ordDate = ord.contramap(ordNumber, function (date) { return date.valueOf(); });

console.log(max);
