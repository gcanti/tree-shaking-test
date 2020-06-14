import { either, pipeable } from "fp-ts";

pipeable.pipe(
  either.right(1),
  either.map(n => n + 1),
  either.chain(n => either.right(n + 1))
);

/*

rollup: ?K
webpack: ?K

*/
