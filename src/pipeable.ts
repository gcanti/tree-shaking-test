import * as P from "fp-ts/pipeable";
import * as E from "fp-ts/Either";
import * as string from "fp-ts/string";

const Applicative = E.getApplicativeValidation(string.Semigroup);

export const { ap } = P.pipeable(Applicative);

/*

rollup:

- fp-ts@2.12.3: 9K

webpack:

- fp-ts@2.12.3: 9K

*/
