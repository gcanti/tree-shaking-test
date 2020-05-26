'use strict';

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
 * @since 2.0.0
 */
function of(a) {
    return function () { return Promise.resolve(a); };
}
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
var map_ = function (ma, f) { return function () { return ma().then(f); }; };
var chain_ = function (ma, f) { return function () { return ma().then(function (a) { return f(a)(); }); }; };
/**
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) { return chain_(ma, f); }; };
/**
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return map_(fa, f); }; };

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

pipe(of(1), map(function (n) { return n + 1; }), chain(function (n) { return of(n + 1); }));
