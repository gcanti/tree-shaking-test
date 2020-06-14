import * as _ from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/pipeable";

pipe(
  _.right(1),
  _.map(n => n + 1),
  _.chain(n => _.right(n + 1)),
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
