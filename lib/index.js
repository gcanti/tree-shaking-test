import { Either, pipe } from "./Prelude";
export var x = pipe(Either.right(1), Either.map(function (n) { return n + 1; }), Either.chain(function (n) { return Either.right(n + 1); }));
/*

rollup:

- fp-ts@2.6.5: 1K
- fp-ts@3.0.0: 2K

webpack:

- fp-ts@2.6.5: 4K
- fp-ts@3.0.0: 5K

*/
