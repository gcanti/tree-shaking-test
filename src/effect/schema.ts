import * as S from "@effect/schema/Schema";
import * as E from "@effect/data/Either";
import { pipe } from "@effect/data/Function";

const Person = S.struct({
  name: S.string,
  age: S.number,
});

pipe(
  S.parseEither(Person)({}),
  E.match(
    () => {
      throw new Error("Decoding error");
    },
    (a) => String(a)
  )
);
