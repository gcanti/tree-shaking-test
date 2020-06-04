import * as TE from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/function";

pipe(
  TE.right(1),
  TE.map(n => n + 1),
  TE.chain(n => TE.right(n + 1)),
  TE.swap
);

/*

rollup:

- fp-ts@2.6.1: 18K
- fp-ts@2.6.2: 11K
- fp-ts@3.0.0: 6K

webpack:

- fp-ts@2.6.1: 24K
- fp-ts@2.6.2: 9K
- fp-ts@3.0.0: 6K

*/
