import * as Schema from "@effect/schema/Schema";
const schema = Schema.struct({
    void: Schema.void,
    number: Schema.number,
    object: Schema.object
});
const valid = Schema.is(schema);
console.log(valid({
    undefined: undefined,
    void: undefined,
    bigint: BigInt(1),
    boolean: true,
    number: 1,
    object: {}
}));
