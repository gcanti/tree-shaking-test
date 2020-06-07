import * as either from "fp-ts/es6/Either";
import { pipe, flow } from "fp-ts/es6/function";
export declare type Either<E, A> = either.Either<E, A>;
export declare const Either: typeof either;
export { pipe, flow };
