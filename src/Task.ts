import * as _ from "fp-ts/es6/Task";
import { pipe } from "fp-ts/es6/function";

pipe(
  _.of(1),
  _.map(n => n + 1),
  _.chain(n => _.of(n + 1))
);

/*

rollup:

- fp-ts@2.6.5: 3K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.5: 6K
- fp-ts@3.0.0: ?K

*/
