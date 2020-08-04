import * as _ from "fp-ts/TaskThese";
import { pipe } from "fp-ts/function";
import { semigroupString } from "fp-ts/Semigroup";

const M = _.getMonad(semigroupString);

pipe(
  _.right(1),
  _.map(n => n + 1),
  x => M.chain(x, n => _.right(n + 1)),
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
