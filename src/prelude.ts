import * as E from "fp-ts/es6/Either";

const Either = {
  map: E.map,
  chain: E.chain,
  right: E.right
};

import Either = E.Either;

export { Either };

export * from "fp-ts/es6/function";

/*
import { pipe, Either } from "./prelude";

pipe(
  Either.right(1),
  Either.map(n => n + 1),
  Either.chain(n => Either.right(n + 1))
);

rollup: 3K
webpack: 4K

*/
