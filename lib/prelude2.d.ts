import * as E from "fp-ts/es6/Either";
export declare const Either: {
    map: <A, B>(f: (a: A) => B) => <E>(fa: E.Either<E, A>) => E.Either<E, B>;
    chain: <E_1, A_1, B_1>(f: (a: A_1) => E.Either<E_1, B_1>) => (ma: E.Either<E_1, A_1>) => E.Either<E_1, B_1>;
    right: typeof E.right;
};
export declare type Either<E, A> = E.Either<E, A>;
export * from "fp-ts/es6/function";
