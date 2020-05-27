import * as TE from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/pipeable";

pipe(
  TE.right(1),
  TE.map(n => n + 1),
  TE.chain(n => TE.right(n + 1))
);
