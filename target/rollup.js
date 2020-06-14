"use strict";
function isLeft(ma) {
  switch (ma._tag) {
    case "Left":
      return !0;
    case "Right":
      return !1;
  }
}
function right(a) {
  return { _tag: "Right", right: a };
}
var f,
  chain = function(f) {
    return function(ma) {
      return chain_(ma, f);
    };
  },
  map_ = function(ma, f) {
    return isLeft(ma) ? ma : right(f(ma.right));
  },
  chain_ = function(ma, f) {
    return isLeft(ma) ? ma : f(ma.right);
  };
(function(a, ab, bc, cd, de, ef, fg, gh, hi, ij) {
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
      ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))));
  }
})(
  right(1),
  ((f = function(n) {
    return n + 1;
  }),
  function(fa) {
    return map_(fa, f);
  }),
  chain(function(n) {
    return right(n + 1);
  })
);
