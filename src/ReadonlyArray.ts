import * as RA from "fp-ts/ReadonlyArray";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import { identity } from "fp-ts/function";
import { pipe } from "fp-ts/function";

export const a = RA.makeBy(10, identity);

RA.isNonEmpty(a) &&
  pipe(
    a,
    RNEA.map(n => n + 1),
    RNEA.chain(n => RNEA.of(n + 1)),
    console.log
  );

/*

rollup:

- fp-ts@2.6.6: 2K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.6: 5K
- fp-ts@3.0.0: ?K

*/
