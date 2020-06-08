import * as _ from "fp-ts/es6/Task";
import { pipe } from "fp-ts/es6/function";

pipe(
  _.of(1),
  _.map(n => n + 1),
  _.chain(n => _.of(n + 1))
);

/*

rollup:

- fp-ts@2.6.1: 9K
- fp-ts@2.6.2: 2K
- fp-ts@2.6.3: 2K
- fp-ts@3.0.0: 1K

webpack:

- fp-ts@2.6.1: 14K
- fp-ts@2.6.2: 4K
- fp-ts@2.6.3: 4K
- fp-ts@3.0.0: 4K

*/
