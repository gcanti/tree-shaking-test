import * as _ from "fp-ts/Either";
import { pipe } from "fp-ts/function";

pipe(
  _.right(1),
  _.map((n) => n + 1),
  _.chain((n) => _.right(n + 1))
);

/*

rollup:

- fp-ts@2.12.3: 1K
- fp-ts@3.0.0: 1K

webpack:

- fp-ts@2.12.3: 1K
- fp-ts@3.0.0: 1K

*/
