import * as E from "fp-ts/es6/Either";
declare const Either: {
    map: <A, B>(f: (a: A) => B) => <E>(fa: E.Either<E, A>) => E.Either<E, B>;
    chain: <E_1, A_1, B_1>(f: (a: A_1) => E.Either<E_1, B_1>) => (ma: E.Either<E_1, A_1>) => E.Either<E_1, B_1>;
    right: typeof E.right;
    chainFirst: <E_2, A_2, B_2>(f: (a: A_2) => E.Either<E_2, B_2>) => (ma: E.Either<E_2, A_2>) => E.Either<E_2, A_2>;
    duplicate: <E_3, A_3>(ma: E.Either<E_3, A_3>) => E.Either<E_3, E.Either<E_3, A_3>>;
    traverse: import("fp-ts/es6/Traversable").PipeableTraverse2<"Either">;
    sequence: import("fp-ts/es6/Traversable").Sequence2<"Either">;
    getValidation: typeof E.getValidation;
};
import Either = E.Either;
export { Either };
export * from "fp-ts/es6/function";
