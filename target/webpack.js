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
    __webpack_require__.r(__webpack_exports__);
    var URI = "Either";
    function isLeft(ma) {
      switch (ma._tag) {
        case "Left":
          return !0;
        case "Right":
          return !1;
      }
    }
    function isRight(ma) {
      return !isLeft(ma);
    }
    function left(e) {
      return { _tag: "Left", left: e };
    }
    function right(a) {
      return { _tag: "Right", right: a };
    }
    var chain = function(f) {
        return function(ma) {
          return chain_(ma, f);
        };
      },
      sequence = function(F) {
        return function(ma) {
          return isLeft(ma) ? F.of(left(ma.left)) : F.map(ma.right, right);
        };
      },
      map_ = function(ma, f) {
        return isLeft(ma) ? ma : right(f(ma.right));
      },
      of = right,
      chain_ = function(ma, f) {
        return isLeft(ma) ? ma : f(ma.right);
      },
      reduce_ = function(fa, b, f) {
        return isLeft(fa) ? b : f(b, fa.right);
      },
      foldMap_ = function(M) {
        return function(fa, f) {
          return isLeft(fa) ? M.empty : f(fa.right);
        };
      },
      reduceRight_ = function(fa, b, f) {
        return isLeft(fa) ? b : f(fa.right, b);
      },
      traverse_ = function(F) {
        return function(ma, f) {
          return isLeft(ma) ? F.of(left(ma.left)) : F.map(f(ma.right), right);
        };
      },
      bimap_ = function(fea, f, g) {
        return isLeft(fea) ? left(f(fea.left)) : right(g(fea.right));
      },
      mapLeft_ = function(fea, f) {
        return isLeft(fea) ? left(f(fea.left)) : fea;
      },
      extend_ = function(wa, f) {
        return isLeft(wa) ? wa : right(f(wa));
      },
      chainRec_ = function(a, f) {
        return (function(a, f) {
          for (var v = f(a); "Left" === v._tag; ) v = f(v.left);
          return v.right;
        })(f(a), function(e) {
          return isLeft(e)
            ? right(left(e.left))
            : isLeft(e.right)
            ? left(f(e.right.left))
            : right(right(e.right.right));
        });
      },
      throwError_ = left;
    var Either = {
      map: function(f) {
        return function(fa) {
          return map_(fa, f);
        };
      },
      chain: chain,
      right: right,
      chainFirst: function(f) {
        return function(ma) {
          return chain_(ma, function(a) {
            return map_(f(a), function() {
              return a;
            });
          });
        };
      },
      duplicate: function(wa) {
        return extend_(wa, identity);
      },
      traverse: function(F) {
        var traverseF = traverse_(F);
        return function(f) {
          return function(fa) {
            return traverseF(fa, f);
          };
        };
      },
      sequence: sequence,
      getValidation: function(S) {
        return {
          URI: URI,
          _E: void 0,
          map: map_,
          of: of,
          chain: chain_,
          bimap: bimap_,
          mapLeft: mapLeft_,
          reduce: reduce_,
          foldMap: foldMap_,
          reduceRight: reduceRight_,
          extend: extend_,
          traverse: traverse_,
          sequence: sequence,
          chainRec: chainRec_,
          throwError: throwError_,
          ap: function(mab, ma) {
            return isLeft(mab)
              ? isLeft(ma)
                ? left(S.concat(mab.left, ma.left))
                : mab
              : isLeft(ma)
              ? ma
              : right(mab.right(ma.right));
          },
          alt: function(fx, f) {
            if (isRight(fx)) return fx;
            var fy = f();
            return isLeft(fy) ? left(S.concat(fx.left, fy.left)) : fy;
          }
        };
      }
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
