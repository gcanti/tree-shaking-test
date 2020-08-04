import * as _ from "fp-ts/State";
import { pipe } from "fp-ts/function";

pipe(
  _.of(1),
  _.map(n => n + 1),
  _.chain(n => _.of(n + 1))
);

/*

rollup:

- fp-ts@2.6.5: ?K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.5: ?K
- fp-ts@3.0.0: ?K

*/
