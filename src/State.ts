import * as _ from "fp-ts/es6/State";
import { pipe } from "fp-ts/es6/function";

pipe(
  _.of(1),
  _.map(n => n + 1),
  _.chain(n => _.of(n + 1))
);

/*

rollup:

- fp-ts@2.6.2: 3K
- fp-ts@2.6.3: 3K
- fp-ts@3.0.0: 1K

webpack:

- fp-ts@2.6.2: 6K
- fp-ts@2.6.3: 6K
- fp-ts@3.0.0: 4K

*/
