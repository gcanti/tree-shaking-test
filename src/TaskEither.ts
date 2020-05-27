import * as TE from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/pipeable";

pipe(
  TE.right(1),
  TE.map(n => n + 1),
  TE.chain(n => TE.right(n + 1))
);

/*

rollup:

- fp-ts@2.6.1: 18K
- fp-ts@1087-PURE-only: 18K
- fp-ts@1087: 11K

webpack:

- fp-ts@2.6.1: 24K
- fp-ts@1087-PURE-only: 19K
- fp-ts@1087: 9K

*/
