import * as RA from "fp-ts/es6/ReadonlyArray";
import * as RNEA from "fp-ts/es6/ReadonlyNonEmptyArray";
import { identity } from "fp-ts/es6/function";
import { pipe } from "fp-ts/es6/function";

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

- fp-ts@2.6.1: 25K
- fp-ts@2.6.2: 5K
- fp-ts@3.0.0: 3K

webpack:

- fp-ts@2.6.1: 30K
- fp-ts@2.6.2: 5K
- fp-ts@3.0.0: 5K

*/