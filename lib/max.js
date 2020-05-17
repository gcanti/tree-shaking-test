import * as O from "fp-ts/es6/Ord";
import * as A from "fp-ts/es6/Array";
export var between = function (n) { return O.between(O.ordNumber)(0, 10)(n); };
export var range = function () { return A.range(0, 10); };
