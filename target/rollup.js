"use strict";
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
  switch (arguments.length) {
    case 1:
      return ab;
    case 2:
      return function() {
        return bc(ab.apply(this, arguments));
      };
    case 3:
      return function() {
        return cd(bc(ab.apply(this, arguments)));
      };
    case 4:
      return function() {
        return de(cd(bc(ab.apply(this, arguments))));
      };
    case 5:
      return function() {
        return ef(de(cd(bc(ab.apply(this, arguments)))));
      };
    case 6:
      return function() {
        return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
      };
    case 7:
      return function() {
        return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
      };
    case 8:
      return function() {
        return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
      };
    case 9:
      return function() {
        return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
      };
  }
}
function pipe(
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
      return st(
        rs(
          qr(pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))))
        )
      );
  }
}
var isLeft = function(ma) {
    return "Left" === ma._tag;
  },
  left = function(e) {
    return { _tag: "Left", left: e };
  },
  right = function(a) {
    return { _tag: "Right", right: a };
  };
function swap(ma) {
  return isLeft(ma) ? right(ma.left) : left(ma.right);
}
var map$1 = function(f) {
    return function(fa) {
      return function() {
        return fa().then(f);
      };
    };
  },
  of = function(a) {
    return function() {
      return Promise.resolve(a);
    };
  },
  left$1 = flow(left, of),
  right$1 = flow(right, of),
  swap$1 = map$1(swap),
  chain$1 = function(f) {
    return function(ma) {
      return pipe(
        ma,
        (function(f) {
          return function(ma) {
            return function() {
              return ma().then(function(a) {
                return f(a)();
              });
            };
          };
        })(
          ((onLeft = left$1),
          (onRight = f),
          function(ma) {
            return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
          })
        )
      );
      var onLeft, onRight;
    };
  };
pipe(
  right$1(1),
  map$1(
    (function(f) {
      return function(fa) {
        return isLeft(fa) ? fa : right(f(fa.right));
      };
    })(function(n) {
      return n + 1;
    })
  ),
  chain$1(function(n) {
    return right$1(n + 1);
  }),
  swap$1
);
