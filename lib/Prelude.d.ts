export * as Option from "fp-ts/Option";
export * as Either from "fp-ts/Either";
export { pipe } from "fp-ts/function";
declare module "./Prelude" {
    type Option<A> = Option.Option<A>;
    type Either<E, A> = Either.Either<E, A>;
}
