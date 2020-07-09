import { Option } from "fp-ts/es6/Option";
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
export declare const x: T.Traversal<Data, string>;
export {};
