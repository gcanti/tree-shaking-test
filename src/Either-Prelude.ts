import { Either, pipe } from "./Prelude";

export const x: Either<string, number> = pipe(
  Either.right(1),
  Either.map(n => n + 1),
  Either.chain(n => Either.right(n + 1))
);

/*

rollup:

- fp-ts@2.9.5: 2K

webpack:

- fp-ts@2.9.5: 2K

*/
