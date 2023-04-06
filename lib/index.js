import * as S from "@effect/schema/Schema";
var Person = S.struct({
    name: S.string,
    age: S.number,
});
S.parseEither(Person)({});
