import { either, pipeable } from "fp-ts";
pipeable.pipe(either.right(1), either.map(function (n) { return n + 1; }), either.chain(function (n) { return either.right(n + 1); }));
