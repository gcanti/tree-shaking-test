import * as S from "fp-ts/es6/State";
import { pipe } from "fp-ts/es6/function";

pipe(
  S.of(1),
  S.map(n => n + 1),
  S.chain(n => S.of(n + 1))
);

/*

rollup:

- fp-ts@2.6.2: 3K
- fp-ts@3.0.0: 1K

webpack:

- fp-ts@2.6.2: 6K
- fp-ts@3.0.0: 4K

*/
