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
    function pipe(a, ab, bc, cd, de, ef, fg, gh, hi, ij) {
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
      }
    }
    var isLeft = function(ma) {
        return "Left" === ma._tag;
      },
      Either_left = function(e) {
        return { _tag: "Left", left: e };
      },
      Either_right = function(a) {
        return { _tag: "Right", right: a };
      };
    function fold(onLeft, onRight) {
      return function(ma) {
        return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
      };
    }
    function swap(ma) {
      return isLeft(ma) ? Either_right(ma.left) : Either_left(ma.right);
    }
    var map_ = function(ma, f) {
      return isLeft(ma) ? ma : Either_right(f(ma.right));
    };
    var Task_map_ = function(ma, f) {
        return function() {
          return ma().then(f);
        };
      },
      Task_chain_ = function(ma, f) {
        return function() {
          return ma().then(function(a) {
            return f(a)();
          });
        };
      },
      Task_map = function(f) {
        return function(fa) {
          return Task_map_(fa, f);
        };
      },
      Task_of = function(a) {
        return function() {
          return Promise.resolve(a);
        };
      },
      Task_chain = function(f) {
        return function(ma) {
          return Task_chain_(ma, f);
        };
      };
    var TaskEither_left = flow(Either_left, Task_of),
      TaskEither_right = flow(Either_right, Task_of);
    var TaskEither_swap = Task_map(swap);
    var TaskEither_map = function(f) {
        return Task_map(
          (function(f) {
            return function(fa) {
              return map_(fa, f);
            };
          })(f)
        );
      },
      TaskEither_chainW = function(f) {
        return function(ma) {
          return pipe(ma, Task_chain(fold(TaskEither_left, f)));
        };
      },
      TaskEither_chain = TaskEither_chainW;
    pipe(
      TaskEither_right(1),
      TaskEither_map(function(n) {
        return n + 1;
      }),
      TaskEither_chain(function(n) {
        return TaskEither_right(n + 1);
      }),
      TaskEither_swap
    );
  }
]);
