import * as _ from "fp-ts/es6/TaskThese";
import { pipe } from "fp-ts/es6/function";
import { semigroupString } from "fp-ts/es6/Semigroup";

const M = _.getMonad(semigroupString);

pipe(
  _.right(1),
  _.map(n => n + 1),
  x => M.chain(x, n => _.right(n + 1)),
  _.swap
);

/*

rollup:

- fp-ts@2.6.2: 8K
- fp-ts@2.6.3: 8K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.2: 9K
- fp-ts@2.6.3: 9K
- fp-ts@3.0.0: ?K

*/
