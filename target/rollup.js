"use strict";
var f,
  isLeft = function (ma) {
    return "Left" === ma._tag;
  },
  right = function (a) {
    return { _tag: "Right", right: a };
  },
  chain = function (f) {
    return function (ma) {
      return isLeft(ma) ? ma : f(ma.right);
    };
  };
!(function (
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
      return pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))));
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
          qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))))
        )
      );
  }
})(
  right(1),
  ((f = function (n) {
    return n + 1;
  }),
  function (fa) {
    return isLeft(fa) ? fa : right(f(fa.right));
  }),
  chain(function (n) {
    return right(n + 1);
  })
);
