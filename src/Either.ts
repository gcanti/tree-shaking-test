import * as E from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/function";

pipe(
  E.right(1),
  E.map(n => n + 1),
  E.chain(n => E.right(n + 1))
);

/*

rollup:

- fp-ts@2.6.2: 3K
- fp-ts@3.0.0: 2K

webpack:

- fp-ts@2.6.2: 4K
- fp-ts@3.0.0: 4K

*/
