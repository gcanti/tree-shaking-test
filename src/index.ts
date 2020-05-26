import * as T from "fp-ts/es6/Task";
import { pipe } from "fp-ts/es6/pipeable";

pipe(
  T.of(1),
  T.map(n => n + 1),
  T.chain(n => T.of(n + 1))
);
