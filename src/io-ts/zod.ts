import * as t from "zod";

const User = t.object({
  userId: t.number(),
  name: t.string(),
});

const result = User.safeParse({ userId: 1, name: "name" });
if (result.success) {
  console.log(result.data);
}

/*

rollup:

- io-ts@2.2.15: 73K

webpack:

- io-ts@2.2.15: 77K

*/
