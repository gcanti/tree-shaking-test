import * as fs from "fp-ts-node/fs";
import { pipe } from "fp-ts/es6/function";
import * as TE from "fp-ts/es6/TaskEither";

export const program = pipe(
  fs.readFile("a", "utf8"),
  TE.chain(data => fs.writeFile("b", data, { encoding: "utf8" }))
);
