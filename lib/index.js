import * as TE from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/pipeable";
pipe(TE.right(1), TE.map(function (n) { return n + 1; }), TE.chain(function (n) { return TE.right(n + 1); }));
