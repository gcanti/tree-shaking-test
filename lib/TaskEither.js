import * as TE from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/pipeable";
pipe(TE.right(1), TE.map(function (n) { return n + 1; }), TE.chain(function (n) { return TE.right(n + 1); }));
/*

rollup:

- fp-ts@2.6.1: 18K
- fp-ts@1087: 18K

webpack

- fp-ts@2.6.1: 24K
- fp-ts@1087: 19K

*/
