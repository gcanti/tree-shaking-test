import * as T from "fp-ts/es6/Task";
import { pipe } from "fp-ts/es6/pipeable";
pipe(T.of(1), T.map(function (n) { return n + 1; }), T.chain(function (n) { return T.of(n + 1); }));
/*

rollup:

- fp-ts@2.6.1: 9K
- fp-ts@1087: 18K

webpack

- fp-ts@2.6.1: 14K
- fp-ts@1087: 19K

*/
