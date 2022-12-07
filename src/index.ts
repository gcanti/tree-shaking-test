import { isRight } from "fp-ts/Either";
import * as t from "io-ts";

const User = t.type({
  userId: t.number,
  name: t.string,
});

const result = User.decode({ userId: 1, name: "name" });
if (isRight(result)) {
  console.log(result.right);
}

/*

rollup:

- io-ts@2.2.15: 18K

webpack:

- io-ts@2.2.15: 19K

*/
