import { Either, ReadonlyArray } from 'effect'
import { Schema } from "@effect/schema"

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

const schema = Schema.struct({
  void: Schema.void,
  number: Schema.number,
  object: Schema.object
})

const valid = Schema.is(schema);

console.log(valid({
  undefined: undefined,
  void: undefined,
  bigint: BigInt(1),
  boolean: true,
  number: 1,
  object: {}
}))
