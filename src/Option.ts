import * as O from "fp-ts/es6/Option";
import { pipe } from "fp-ts/es6/function";

pipe(
  O.of(1),
  O.map(n => n + 1),
  O.chain(n => O.of(n + 1))
);

/*

rollup:

- fp-ts@2.6.2: ?K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.2: ?K
- fp-ts@3.0.0: ?K

*/
