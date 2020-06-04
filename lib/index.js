import * as RA from "fp-ts/es6/ReadonlyArray";
import * as RNEA from "fp-ts/es6/ReadonlyNonEmptyArray";
import { identity } from "fp-ts/es6/function";
import { pipe } from "fp-ts/es6/function";
export var a = RA.makeBy(10, identity);
RA.isNonEmpty(a) &&
    pipe(a, RNEA.map(function (n) { return n + 1; }), RNEA.chain(function (n) { return RNEA.of(n + 1); }), console.log);
