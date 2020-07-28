import * as _ from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
pipe(_.right(1), _.map(function (n) { return n + 1; }), _.chain(function (n) { return _.right(n + 1); }), _.swap);
