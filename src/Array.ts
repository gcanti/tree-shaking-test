import * as A from "fp-ts/es6/Array";
import * as NEA from "fp-ts/es6/NonEmptyArray";
import { identity } from "fp-ts/es6/function";
import { pipe } from "fp-ts/es6/pipeable";

export const a = A.makeBy(10, identity);

A.isNonEmpty(a) &&
  pipe(
    a,
    NEA.map(n => n + 1),
    NEA.chain(n => NEA.of(n + 1)),
    console.log
  );

/*

rollup:

- fp-ts@2.6.1: 25K
- fp-ts@1087-PURE-only: 20K
- fp-ts@1087: 5K

webpack:

- fp-ts@2.6.1: 30K
- fp-ts@1087-PURE-only: 21K
- fp-ts@1087: 5K

*/