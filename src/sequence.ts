import * as RA from "fp-ts/es6/ReadonlyArray";
import * as TE from "fp-ts/es6/TaskEither";
import { pipe } from "fp-ts/es6/function";

pipe(
  RA.replicate(10, TE.right(1)),
  RA.sequence(TE.applicativeTaskEither),
  TE.map(RA.head)
);

/*

rollup:

- fp-ts@2.6.2: 21K
- fp-ts@3.0.0: 7K

webpack:

- fp-ts@2.6.2: 10K
- fp-ts@3.0.0: 8K

*/
