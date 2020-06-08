import * as _ from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/function";
pipe(_.right(1), _.map(function (n) { return n + 1; }), _.chain(function (n) { return _.right(n + 1); }));
