import { array } from "fp-ts/es6/Array";
import { Option } from "fp-ts/es6/Option";
import { record } from "fp-ts/es6/Record";
import { fromTraversable, Lens, Optional } from "monocle-ts/es6/index";
import { indexArray } from "monocle-ts/es6/Index/Array";

interface NestedValue {
  baz: string;
}
interface Nested extends Array<NestedValue> {}
interface Value {
  nested: Option<Nested>;
}
interface Foo extends Record<string, Value> {}
interface Item {
  readonly foo: Foo;
}
interface Items extends Array<Item> {}
interface Data {
  readonly items: Items;
}

export const classicSecondBaz = Lens.fromProp<Data>()("items")
  .composeTraversal(fromTraversable(array)())
  .composeLens(Lens.fromProp<Item>()("foo"))
  .composeTraversal(fromTraversable(record)())
  .composeOptional(Optional.fromOptionProp<Value>()("nested"))
  .composeOptional(indexArray<NestedValue>().index(2))
  .composeLens(Lens.fromProp<NestedValue>()("baz"));

/*

rollup:

- fp-ts@2.6.5: 81K
- fp-ts@3.0.0: ?K

webpack:

- fp-ts@2.6.5: 74K
- fp-ts@3.0.0: ?K

*/
