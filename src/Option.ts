import * as _ from "fp-ts/es6/Option";
import { pipe } from "fp-ts/es6/function";

pipe(
  _.some(1),
  _.map(n => n + 1),
  _.chain(n => _.some(n + 1))
);

/*

rollup:

- fp-ts@2.6.2: ?K
- fp-ts@2.6.3: 2K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.2: ?K
- fp-ts@2.6.3: 4K
- fp-ts@3.0.0: ?K

*/
