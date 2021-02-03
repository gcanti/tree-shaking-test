import * as _ from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

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
- fp-ts@2.8.0: 3K
- fp-ts@2.9.3: 4K
- fp-ts@3.0.0-alpha.11: 4K

webpack:

- fp-ts@2.6.1: 24K
- fp-ts@2.6.6: 6K
- fp-ts@2.7.0: 6K
- fp-ts@2.8.0: 6K
- fp-ts@2.9.3: 7K
- fp-ts@3.0.0-alpha.11: 5K

*/
