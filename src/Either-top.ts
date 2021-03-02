import { either, function as F } from "fp-ts";

F.pipe(
  either.right(1),
  either.map(n => n + 1),
  either.chain(n => either.right(n + 1))
);

/*

rollup:

- fp-ts@2.9.5: 2K

webpack:

- fp-ts@2.9.5: 2K

*/
