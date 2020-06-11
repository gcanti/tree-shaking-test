!(function(modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports;
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: !1,
      exports: {}
    });
    return (
      modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ),
      (module.l = !0),
      module.exports
    );
  }
  (__webpack_require__.m = modules),
    (__webpack_require__.c = installedModules),
    (__webpack_require__.d = function(exports, name, getter) {
      __webpack_require__.o(exports, name) ||
        Object.defineProperty(exports, name, { enumerable: !0, get: getter });
    }),
    (__webpack_require__.r = function(exports) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(exports, "__esModule", { value: !0 });
    }),
    (__webpack_require__.t = function(value, mode) {
      if ((1 & mode && (value = __webpack_require__(value)), 8 & mode))
        return value;
      if (4 & mode && "object" == typeof value && value && value.__esModule)
        return value;
      var ns = Object.create(null);
      if (
        (__webpack_require__.r(ns),
        Object.defineProperty(ns, "default", { enumerable: !0, value: value }),
        2 & mode && "string" != typeof value)
      )
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function(key) {
              return value[key];
            }.bind(null, key)
          );
      return ns;
    }),
    (__webpack_require__.n = function(module) {
      var getter =
        module && module.__esModule
          ? function() {
              return module.default;
            }
          : function() {
              return module;
            };
      return __webpack_require__.d(getter, "a", getter), getter;
    }),
    (__webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }),
    (__webpack_require__.p = ""),
    __webpack_require__((__webpack_require__.s = 0));
})([
  function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
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
    var chain = function(f) {
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
    var Either = {
      map: function(f) {
        return function(fa) {
          return map_(fa, f);
        };
      },
      chain: chain,
      right: right
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
      Either.right(1),
      Either.map(function(n) {
        return n + 1;
      }),
      Either.chain(function(n) {
        return Either.right(n + 1);
      })
    );
  }
]);
