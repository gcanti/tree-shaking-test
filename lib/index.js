import * as _ from "fp-ts/Task";
import { pipe } from "fp-ts/function";
pipe(_.of(1), _.map(function (n) { return n + 1; }), _.chain(function (n) { return _.of(n + 1); }));
