import { Option } from "fp-ts/es6/Option";
import * as T from "monocle-ts/es6/Traversal";
interface NestedValue {
    readonly baz: string;
}
interface Value {
    readonly nested: Option<Array<NestedValue>>;
}
interface Item {
    readonly foo: Record<string, Value>;
}
interface Data {
    readonly items: Array<Item>;
}
export declare const x: T.Traversal<Data, string>;
export {};
