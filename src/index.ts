import * as _ from "fp-ts/Task";
import { pipe } from "fp-ts/function";

pipe(
  _.of(1),
  _.map(n => n + 1),
  _.chain(n => _.of(n + 1))
);

/*

rollup:

- fp-ts@2.6.1: 10K
- fp-ts@2.6.6: 1K
- fp-ts@2.7.0: 1K
- fp-ts@2.8.0: 1K

webpack:

- fp-ts@2.6.1: 14K
- fp-ts@2.6.6: 4K
- fp-ts@2.7.0: 4K
- fp-ts@2.8.0: 4K

*/
