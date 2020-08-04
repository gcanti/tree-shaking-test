import * as E from "fp-ts/Either";

const Either = {
  map: E.map,
  chain: E.chain,
  right: E.right,
  chainFirst: E.chainFirst,
  duplicate: E.duplicate,
  traverse: E.traverse,
  sequence: E.sequence,
  getValidation: E.getValidation
};

import Either = E.Either;

export { Either };

export * from "fp-ts/function";

/*
import { pipe, Either } from "./prelude";

pipe(
  Either.right(1),
  Either.map(n => n + 1),
  Either.chain(n => Either.right(n + 1))
);

rollup: 7K
webpack: 7K

*/
