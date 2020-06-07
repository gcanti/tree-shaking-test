import { pipe, Either } from "./prelude";

export const x: Either<string, number> = pipe(
  Either.right(1),
  Either.map(n => n + 1),
  Either.chain(n => Either.right(n + 1))
);

/*

rollup:

- fp-ts@2.6.2: ?K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.2: ?K
- fp-ts@3.0.0: ?K

*/
