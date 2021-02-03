"use strict";
const isLeft = (ma) => "Left" === ma._tag,
  right = (a) => ({ _tag: "Right", right: a }),
  swap = (ma) =>
    isLeft(ma) ? right(ma.left) : { _tag: "Left", left: ma.right },
  Functor = { map: (f) => (fa) => (isLeft(fa) ? fa : right(f(fa.right))) };
function right$1(F) {
  return (function (ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
      case 1:
        return ab;
      case 2:
        return function () {
          return bc(ab.apply(this, arguments));
        };
      case 3:
        return function () {
          return cd(bc(ab.apply(this, arguments)));
        };
      case 4:
        return function () {
          return de(cd(bc(ab.apply(this, arguments))));
        };
      case 5:
        return function () {
          return ef(de(cd(bc(ab.apply(this, arguments)))));
        };
      case 6:
        return function () {
          return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
        };
      case 7:
        return function () {
          return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
        };
      case 8:
        return function () {
          return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
        };
      case 9:
        return function () {
          return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
        };
    }
  })(right, F.of);
}
function map$2(F) {
  return (function (F, G) {
    return (f) => F.map(G.map(f));
  })(F, Functor);
}
function chain(M) {
  return (f) => M.chain((e) => (isLeft(e) ? M.of(e) : f(e.right)));
}
function swap$1(F) {
  return F.map(swap);
}
const map$3 = (f) => (fa) => () => fa().then(f),
  of = (a) => () => Promise.resolve(a),
  Functor$1 = { map: map$3 },
  Monad = {
    map: map$3,
    of: of,
    chain: (f) => (ma) => () => ma().then((a) => f(a)()),
  },
  right$2 = right$1({ map: map$3, of: of }),
  swap$2 = swap$1(Functor$1),
  map$4 = map$2(Functor$1),
  chain$2 = chain(Monad);
right$2([]),
  (function (
    a,
    ab,
    bc,
    cd,
    de,
    ef,
    fg,
    gh,
    hi,
    ij,
    jk,
    kl,
    lm,
    mn,
    no,
    op,
    pq,
    qr,
    rs,
    st
  ) {
    switch (arguments.length) {
      case 1:
        return a;
      case 2:
        return ab(a);
      case 3:
        return bc(ab(a));
      case 4:
        return cd(bc(ab(a)));
      case 5:
        return de(cd(bc(ab(a))));
      case 6:
        return ef(de(cd(bc(ab(a)))));
      case 7:
        return fg(ef(de(cd(bc(ab(a))))));
      case 8:
        return gh(fg(ef(de(cd(bc(ab(a)))))));
      case 9:
        return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
      case 10:
        return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
      case 11:
        return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))));
      case 12:
        return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))));
      case 13:
        return lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))));
      case 14:
        return mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))));
      case 15:
        return no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))));
      case 16:
        return op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))));
      case 17:
        return pq(
          op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))
        );
      case 18:
        return qr(
          pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))
        );
      case 19:
        return rs(
          qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))))
        );
      case 20:
        st(
          rs(
            qr(
              pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))
            )
          )
        );
    }
  })(
    right$2(1),
    map$4(function (n) {
      return n + 1;
    }),
    chain$2(function (n) {
      return right$2(n + 1);
    }),
    swap$2
  );
