import * as A from "fp-ts/es6/ReadonlyArray";
import { pipe } from "fp-ts/function";
import { Option } from "fp-ts/Option";
import * as R from "fp-ts/ReadonlyRecord";
import * as L from "monocle-ts/es6/Lens";
import * as T from "monocle-ts/es6/Traversal";

interface NestedValue {
  readonly baz: string;
}

interface Value {
  readonly nested: Option<ReadonlyArray<NestedValue>>;
}

interface Item {
  readonly foo: Readonly<Record<string, Value>>;
}

interface Data {
  readonly items: ReadonlyArray<Item>;
}

export const x: T.Traversal<Data, string> = pipe(
  L.id<Data>(),
  L.prop("items"),
  L.traverse(A.Traversable),
  T.prop("foo"),
  T.traverse(R.Traversable),
  T.prop("nested"),
  T.some,
  T.index(2),
  T.prop("baz")
);

/*

rollup:

- fp-ts@2.6.5: 29K
- fp-ts@2.7.0: 12K

webpack:

- fp-ts@2.6.5: 44K
- fp-ts@2.7.0: 30K

*/
