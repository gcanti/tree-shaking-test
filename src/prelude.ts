import * as either from "fp-ts/es6/Either";
import { pipe, flow } from "fp-ts/es6/function";

export type Either<E, A> = either.Either<E, A>;
export const Either = either;
export { pipe, flow };
