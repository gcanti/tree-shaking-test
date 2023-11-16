import { Either, ReadonlyArray } from 'effect'

const divide = (a: number, b: number) => (b === 0 ? Either.left('cannot divide by zero') : Either.right(a / b))

const input = [2, 3, 5]

const program = ReadonlyArray.head(input).pipe(
  Either.fromOption(() => 'empty array'),
  Either.flatMap((b) => divide(10, b)),
  Either.match({
    onLeft: (e) => `Error: ${e}`,
    onRight: (a) => `Result: ${a}`
  })
)

console.log(program)
