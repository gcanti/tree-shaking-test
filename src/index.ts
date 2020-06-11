import { pipe, Either } from "./prelude";

pipe(
  Either.right(1),
  Either.map(n => n + 1),
  Either.chain(n => Either.right(n + 1))
);
