import * as _ from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/function";

pipe(
  _.right(1),
  _.map(n => n + 1),
  _.chain(n => _.right(n + 1))
);

/*

rollup:

- fp-ts@2.6.2: 3K
- fp-ts@2.6.3: 2K
- fp-ts@3.0.0: 2K

webpack:

- fp-ts@2.6.2: 4K
- fp-ts@2.6.3: 4K
- fp-ts@3.0.0: 4K

*/
