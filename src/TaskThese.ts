import * as _ from "fp-ts/TaskThese";
import { pipe } from "fp-ts/function";
import { Semigroup } from "fp-ts/string";

const M = _.getMonad(Semigroup);

pipe(
  _.right(1),
  _.map(n => n + 1),
  M.chain(n => _.right(n + 1)),
  _.swap
);

/*

rollup:

- fp-ts@2.6.5: ?K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.5: ?K
- fp-ts@3.0.0: ?K

*/
