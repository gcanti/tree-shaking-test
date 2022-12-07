import * as E from "fp-ts/Either";
import * as string from "fp-ts/string";
import type {
  Apply,
  Apply1,
  Apply2,
  Apply3,
  Apply4,
  Apply3C,
  Apply2C,
} from "fp-ts/Apply";
import {
  URIS,
  URIS2,
  URIS3,
  URIS4,
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
} from "fp-ts/HKT";

/**
 * Returns a pipeable `ap`
 *
 * @category pipeable helper
 * @since 2.13.0
 */
export function ap<F extends URIS4>(
  F: Apply4<F>
): <S, R, E, A>(
  fa: Kind4<F, S, R, E, A>
) => <B>(fab: Kind4<F, S, R, E, (a: A) => B>) => Kind4<F, S, R, E, B>;
export function ap<F extends URIS3>(
  F: Apply3<F>
): <R, E, A>(
  fa: Kind3<F, R, E, A>
) => <B>(fab: Kind3<F, R, E, (a: A) => B>) => Kind3<F, R, E, B>;
export function ap<F extends URIS3, E>(
  F: Apply3C<F, E>
): <R, A>(
  fa: Kind3<F, R, E, A>
) => <B>(fab: Kind3<F, R, E, (a: A) => B>) => Kind3<F, R, E, B>;
export function ap<F extends URIS2>(
  F: Apply2<F>
): <E, A>(
  fa: Kind2<F, E, A>
) => <B>(fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>;
export function ap<F extends URIS2, E>(
  F: Apply2C<F, E>
): <A>(
  fa: Kind2<F, E, A>
) => <B>(fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>;
export function ap<F extends URIS>(
  F: Apply1<F>
): <A>(fa: Kind<F, A>) => <B>(fab: Kind<F, (a: A) => B>) => Kind<F, B>;
export function ap<F>(
  F: Apply<F>
): <A>(fa: HKT<F, A>) => <B>(fab: HKT<F, (a: A) => B>) => HKT<F, B>;
export function ap<F>(
  F: Apply<F>
): <A>(fa: HKT<F, A>) => <B>(fab: HKT<F, (a: A) => B>) => HKT<F, B> {
  return (fa) => (fab) => F.ap(fab, fa);
}

const Applicative = E.getApplicativeValidation(string.Semigroup);

export const ap_ = ap(Applicative);

/*

rollup:

- fp-ts@2.12.3: 2K

webpack:

- fp-ts@2.12.3: 2K

*/
