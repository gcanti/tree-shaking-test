import * as S from "@effect/schema/Schema";

const Person = S.struct({
  name: S.string,
  age: S.number,
});

S.parseEither(Person)({})
