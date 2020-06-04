import * as T from "fp-ts/es6/Task";
import { pipe } from "fp-ts/es6/function";

pipe(
  T.of(1),
  T.map(n => n + 1),
  T.chain(n => T.of(n + 1))
);

/*

rollup:

- fp-ts@2.6.1: 9K
- fp-ts@2.6.2: 2K
- fp-ts@3.0.0: 1K

webpack:

- fp-ts@2.6.1: 14K
- fp-ts@2.6.2: 4K
- fp-ts@3.0.0: 4K

*/
