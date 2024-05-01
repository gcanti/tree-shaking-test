import * as Either from 'effect/Either';
import * as Arr from 'effect/Array';
const divide = (a, b) => (b === 0 ? Either.left('cannot divide by zero') : Either.right(a / b));
const input = [2, 3, 5];
const program = Arr.head(input).pipe(Either.fromOption(() => 'empty array'), Either.flatMap((b) => divide(10, b)), Either.match({
    onLeft: (e) => `Error: ${e}`,
    onRight: (a) => `Result: ${a}`
}));
console.log(program);
