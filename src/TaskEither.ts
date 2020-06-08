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

- fp-ts@2.6.1: 18K
- fp-ts@2.6.2: 11K
- fp-ts@2.6.3: 7K
- fp-ts@3.0.0: 6K

webpack:

- fp-ts@2.6.1: 24K
- fp-ts@2.6.2: 9K
- fp-ts@2.6.3: 6K
- fp-ts@3.0.0: 6K

*/
