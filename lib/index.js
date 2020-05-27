import * as A from "fp-ts/es6/Array";
import * as NEA from "fp-ts/es6/NonEmptyArray";
import { identity } from "fp-ts/es6/function";
import { pipe } from "fp-ts/es6/pipeable";
export var a = A.makeBy(10, identity);
A.isNonEmpty(a) &&
    pipe(a, NEA.map(function (n) { return n + 1; }), NEA.chain(function (n) { return NEA.of(n + 1); }), console.log);
