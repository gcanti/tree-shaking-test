'use strict';

/**
 * @since 2.0.0
 */
function tailRec(a, f) {
    var v = f(a);
    while (v._tag === 'Left') {
        v = f(v.left);
    }
    return v.right;
}

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

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * @category model
 * @since 2.0.0
 */
var URI = 'Either';
// -------------------------------------------------------------------------------------
// guards
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise
 *
 * @category guards
 * @since 2.0.0
 */
function isLeft(ma) {
    switch (ma._tag) {
        case 'Left':
            return true;
        case 'Right':
            return false;
    }
}
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise
 *
 * @category guards
 * @since 2.0.0
 */
function isRight(ma) {
    return isLeft(ma) ? false : true;
}
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure
 *
 * @category constructors
 * @since 2.0.0
 */
function left(e) {
    return { _tag: 'Left', left: e };
}
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure
 *
 * @category constructors
 * @since 2.0.0
 */
function right(a) {
    return { _tag: 'Right', right: a };
}
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return map_(fa, f); }; };
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
var chainW = function (f) { return function (ma) { return chain_(ma, f); }; };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = chainW;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category Monad
 * @since 2.0.0
 */
var chainFirst = function (f) { return function (ma) {
    return chain_(ma, function (a) { return map_(f(a), function () { return a; }); });
}; };
/**
 * @category Extend
 * @since 2.0.0
 */
var duplicate = function (wa) { return extend_(wa, identity); };
/**
 * @category Traversable
 * @since 2.6.3
 */
var traverse = function (F) {
    var traverseF = traverse_(F);
    return function (f) { return function (fa) { return traverseF(fa, f); }; };
};
/**
 * @category Traversable
 * @since 2.6.3
 */
var sequence = function (F) { return function (ma) {
    return isLeft(ma) ? F.of(left(ma.left)) : F.map(ma.right, right);
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
var map_ = function (ma, f) {
    return isLeft(ma) ? ma : right(f(ma.right));
};
var of = right;
var chain_ = function (ma, f) {
    return isLeft(ma) ? ma : f(ma.right);
};
var reduce_ = function (fa, b, f) {
    return isLeft(fa) ? b : f(b, fa.right);
};
var foldMap_ = function (M) { return function (fa, f) {
    return isLeft(fa) ? M.empty : f(fa.right);
}; };
var reduceRight_ = function (fa, b, f) {
    return isLeft(fa) ? b : f(fa.right, b);
};
var traverse_ = function (F) { return function (ma, f) {
    return isLeft(ma) ? F.of(left(ma.left)) : F.map(f(ma.right), right);
}; };
var bimap_ = function (fea, f, g) {
    return isLeft(fea) ? left(f(fea.left)) : right(g(fea.right));
};
var mapLeft_ = function (fea, f) {
    return isLeft(fea) ? left(f(fea.left)) : fea;
};
var extend_ = function (wa, f) {
    return isLeft(wa) ? wa : right(f(wa));
};
var chainRec_ = function (a, f) {
    return tailRec(f(a), function (e) {
        return isLeft(e) ? right(left(e.left)) : isLeft(e.right) ? left(f(e.right.left)) : right(right(e.right.right));
    });
};
var throwError_ = left;
/**
 * @category instances
 * @since 2.0.0
 */
function getValidation(S) {
    return {
        URI: URI,
        _E: undefined,
        map: map_,
        of: of,
        chain: chain_,
        bimap: bimap_,
        mapLeft: mapLeft_,
        reduce: reduce_,
        foldMap: foldMap_,
        reduceRight: reduceRight_,
        extend: extend_,
        traverse: traverse_,
        sequence: sequence,
        chainRec: chainRec_,
        throwError: throwError_,
        ap: function (mab, ma) {
            return isLeft(mab)
                ? isLeft(ma)
                    ? left(S.concat(mab.left, ma.left))
                    : mab
                : isLeft(ma)
                    ? ma
                    : right(mab.right(ma.right));
        },
        alt: function (fx, f) {
            if (isRight(fx)) {
                return fx;
            }
            var fy = f();
            return isLeft(fy) ? left(S.concat(fx.left, fy.left)) : fy;
        }
    };
}

var Either = {
    map: map,
    chain: chain,
    right: right,
    chainFirst: chainFirst,
    duplicate: duplicate,
    traverse: traverse,
    sequence: sequence,
    getValidation: getValidation
};

pipe(Either.right(1), Either.map(function (n) { return n + 1; }), Either.chain(function (n) { return Either.right(n + 1); }));
