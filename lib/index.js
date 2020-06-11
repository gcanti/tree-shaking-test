import { pipe, Either } from "./prelude";
pipe(Either.right(1), Either.map(function (n) { return n + 1; }), Either.chain(function (n) { return Either.right(n + 1); }));
