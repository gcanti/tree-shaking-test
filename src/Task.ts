import * as _ from "fp-ts/es6/Task";
import { pipe } from "fp-ts/es6/pipeable";

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

webpack:

- fp-ts@2.6.1: 14K
- fp-ts@2.6.6: 4K
- fp-ts@2.7.0: 4K

*/
