import * as RA from "fp-ts/es6/ReadonlyArray";
import * as E from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/function";

pipe(RA.replicate(10, E.right(1)), RA.sequence(E.either), E.map(RA.head));

/*

rollup:

- fp-ts@2.6.5: 4K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.5: 7K
- fp-ts@3.0.0: ?K

*/
