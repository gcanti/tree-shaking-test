import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

pipe(
  RA.replicate(10, TE.right(1)),
  RA.sequence(TE.ApplicativePar),
  TE.map(RA.head)
);

/*

rollup:

- fp-ts@2.6.6: 6K
- fp-ts@2.7.0: 4K

webpack:

- fp-ts@2.6.6: 10K
- fp-ts@2.7.0: 8K

*/
