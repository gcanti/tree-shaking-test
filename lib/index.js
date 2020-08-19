import * as D from "io-ts/Decoder";
var Person = D.type({
    name: D.string,
    age: D.number
});
console.log(Person.decode({}));
