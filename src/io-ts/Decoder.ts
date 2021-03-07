import * as D from "io-ts/Decoder";

const Person = D.struct({
  name: D.string,
  age: D.number
});

console.log(Person.decode({}));

/*

rollup:

- io-ts@2.2.15: 6K

webpack:

- io-ts@2.2.15: 15K

*/
