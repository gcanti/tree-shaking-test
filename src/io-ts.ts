import * as D from "io-ts/es6/Decoder";

const Person = D.type({
  name: D.string,
  age: D.number
});

console.log(Person.decode({}));

/*

rollup:

- io-ts@2.2.6: 18K (using `Type`)
- io-ts@2.2.7: 5K (using `Decoder`)

webpack:

- io-ts@2.2.6: 23K (using `Type`)
- io-ts@2.2.7: 33K (using `Decoder`)

*/
