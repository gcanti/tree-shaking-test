import * as _ from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/function";

pipe(
  _.right(1),
  _.map(n => n + 1),
  _.chain(n => _.right(n + 1)),
  _.swap
);

/*

rollup:

- fp-ts@2.6.1: 14K
- fp-ts@2.6.6: 3K
- fp-ts@2.7.0: 3K

webpack:

- fp-ts@2.6.1: 24K
- fp-ts@2.6.6: 6K
- fp-ts@2.7.0: 6K

*/
