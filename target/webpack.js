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
    function identity(a) {
      return a;
    }
    __webpack_require__.r(__webpack_exports__),
      __webpack_require__.d(__webpack_exports__, "a", function() {
        return lib_a;
      });
    function makeBy(n, f) {
      for (var r = [], i = 0; i < n; i++) r.push(f(i));
      return r;
    }
    function isNonEmpty(as) {
      return as.length > 0;
    }
    var of = function(a) {
        return [a];
      },
      ReadonlyArray_map_ = function(fa, f) {
        return fa.map(function(a) {
          return f(a);
        });
      },
      ReadonlyArray_chain_ = function(fa, f) {
        for (
          var outLen = 0, l = fa.length, temp = new Array(l), i = 0;
          i < l;
          i++
        ) {
          (outLen += (arr = f(fa[i])).length), (temp[i] = arr);
        }
        var out = Array(outLen),
          start = 0;
        for (i = 0; i < l; i++) {
          for (var arr, l_1 = (arr = temp[i]).length, j = 0; j < l_1; j++)
            out[j + start] = arr[j];
          start += l_1;
        }
        return out;
      },
      ReadonlyArray_chain = function(f) {
        return function(ma) {
          return ReadonlyArray_chain_(ma, f);
        };
      },
      ReadonlyArray_map = function(f) {
        return function(fa) {
          return ReadonlyArray_map_(fa, f);
        };
      },
      Array_makeBy = makeBy,
      Array_isNonEmpty = isNonEmpty;
    var NonEmptyArray_of = of;
    var NonEmptyArray_chain = ReadonlyArray_chain,
      NonEmptyArray_map = ReadonlyArray_map;
    var lib_a = Array_makeBy(10, identity);
    Array_isNonEmpty(lib_a) &&
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
        lib_a,
        NonEmptyArray_map(function(n) {
          return n + 1;
        }),
        NonEmptyArray_chain(function(n) {
          return NonEmptyArray_of(n + 1);
        }),
        console.log
      );
  }
]);
