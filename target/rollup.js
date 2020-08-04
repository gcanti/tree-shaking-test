"use strict";
var f,
  of = function(a) {
    return function() {
      return Promise.resolve(a);
    };
  };
!(function(a, ab, bc, cd, de, ef, fg, gh, hi, ij) {
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
  of(1),
  ((f = function(n) {
    return n + 1;
  }),
  function(fa) {
    return (function(ma, f) {
      return function() {
        return ma().then(f);
      };
    })(fa, f);
  }),
  (function(f) {
    return function(ma) {
      return (function(ma, f) {
        return function() {
          return ma().then(function(a) {
            return f(a)();
          });
        };
      })(ma, f);
    };
  })(function(n) {
    return of(n + 1);
  })
);
