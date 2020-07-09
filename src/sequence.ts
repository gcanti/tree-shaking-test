import * as RA from "fp-ts/es6/ReadonlyArray";
import * as TE from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/function";

pipe(
  RA.replicate(10, TE.right(1)),
  RA.sequence(TE.applicativeTaskEitherPar),
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
