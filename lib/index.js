import * as A from "fp-ts/es6/Array";
import { pipe } from "fp-ts/es6/function";
import * as R from "fp-ts/es6/Record";
import * as L from "monocle-ts/es6/Lens";
import * as T from "monocle-ts/es6/Traversal";
export var x = pipe(L.id(), L.prop("items"), L.traverse(A.Traversable), T.prop("foo"), T.traverse(R.Traversable), T.prop("nested"), T.some, T.index(2), T.prop("baz"));
