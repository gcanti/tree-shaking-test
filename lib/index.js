import * as D from "io-ts/es6/Decoder";
var Person = D.type({
    name: D.string,
    age: D.number
});
console.log(Person.decode({}));
