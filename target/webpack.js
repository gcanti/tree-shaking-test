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
    __webpack_require__.r(__webpack_exports__),
      __webpack_require__.d(__webpack_exports__, "x", function() {
        return x;
      });
    var Either_namespaceObject = {};
    function identity(a) {
      return a;
    }
    __webpack_require__.r(Either_namespaceObject),
      __webpack_require__.d(Either_namespaceObject, "URI", function() {
        return URI;
      }),
      __webpack_require__.d(Either_namespaceObject, "left", function() {
        return left;
      }),
      __webpack_require__.d(Either_namespaceObject, "right", function() {
        return right;
      }),
      __webpack_require__.d(Either_namespaceObject, "fromNullable", function() {
        return fromNullable;
      }),
      __webpack_require__.d(Either_namespaceObject, "fromOption", function() {
        return fromOption;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "fromPredicate",
        function() {
          return fromPredicate;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "tryCatch", function() {
        return tryCatch;
      }),
      __webpack_require__.d(Either_namespaceObject, "parseJSON", function() {
        return parseJSON;
      }),
      __webpack_require__.d(Either_namespaceObject, "isLeft", function() {
        return isLeft;
      }),
      __webpack_require__.d(Either_namespaceObject, "isRight", function() {
        return isRight;
      }),
      __webpack_require__.d(Either_namespaceObject, "fold", function() {
        return fold;
      }),
      __webpack_require__.d(Either_namespaceObject, "getOrElse", function() {
        return getOrElse;
      }),
      __webpack_require__.d(Either_namespaceObject, "getOrElseW", function() {
        return getOrElseW;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "stringifyJSON",
        function() {
          return stringifyJSON;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "getShow", function() {
        return getShow;
      }),
      __webpack_require__.d(Either_namespaceObject, "getEq", function() {
        return getEq;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "getValidationApplicative",
        function() {
          return getValidationApplicative;
        }
      ),
      __webpack_require__.d(
        Either_namespaceObject,
        "getValidationAlt",
        function() {
          return getValidationAlt;
        }
      ),
      __webpack_require__.d(
        Either_namespaceObject,
        "getValidationSemigroup",
        function() {
          return getValidationSemigroup;
        }
      ),
      __webpack_require__.d(
        Either_namespaceObject,
        "getValidationMonoid",
        function() {
          return getValidationMonoid;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "getSemigroup", function() {
        return getSemigroup;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "getApplySemigroup",
        function() {
          return getApplySemigroup;
        }
      ),
      __webpack_require__.d(
        Either_namespaceObject,
        "getApplyMonoid",
        function() {
          return getApplyMonoid;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "map", function() {
        return map;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "functorEither",
        function() {
          return functorEither;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "ap", function() {
        return ap;
      }),
      __webpack_require__.d(Either_namespaceObject, "applyEither", function() {
        return applyEither;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "applicativeEither",
        function() {
          return applicativeEither;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "chain", function() {
        return chain;
      }),
      __webpack_require__.d(Either_namespaceObject, "monadEither", function() {
        return monadEither;
      }),
      __webpack_require__.d(Either_namespaceObject, "reduce", function() {
        return reduce;
      }),
      __webpack_require__.d(Either_namespaceObject, "foldMap", function() {
        return foldMap;
      }),
      __webpack_require__.d(Either_namespaceObject, "reduceRight", function() {
        return reduceRight;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "foldableEither",
        function() {
          return foldableEither;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "bimap", function() {
        return bimap;
      }),
      __webpack_require__.d(Either_namespaceObject, "mapLeft", function() {
        return mapLeft;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "bifunctorEither",
        function() {
          return bifunctorEither;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "traverse", function() {
        return traverse;
      }),
      __webpack_require__.d(Either_namespaceObject, "sequence", function() {
        return sequence;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "traversableEither",
        function() {
          return traversableEither;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "alt", function() {
        return alt;
      }),
      __webpack_require__.d(Either_namespaceObject, "altEither", function() {
        return altEither;
      }),
      __webpack_require__.d(Either_namespaceObject, "extend", function() {
        return extend;
      }),
      __webpack_require__.d(Either_namespaceObject, "extendEither", function() {
        return extendEither;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "monadThrowEither",
        function() {
          return monadThrowEither;
        }
      ),
      __webpack_require__.d(
        Either_namespaceObject,
        "getCompactable",
        function() {
          return getCompactable;
        }
      ),
      __webpack_require__.d(
        Either_namespaceObject,
        "getFilterable",
        function() {
          return getFilterable;
        }
      ),
      __webpack_require__.d(
        Either_namespaceObject,
        "getWitherable",
        function() {
          return getWitherable;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "swap", function() {
        return swap;
      }),
      __webpack_require__.d(Either_namespaceObject, "orElse", function() {
        return orElse;
      }),
      __webpack_require__.d(Either_namespaceObject, "apFirst", function() {
        return apFirst;
      }),
      __webpack_require__.d(Either_namespaceObject, "apSecond", function() {
        return apSecond;
      }),
      __webpack_require__.d(Either_namespaceObject, "chainFirst", function() {
        return chainFirst;
      }),
      __webpack_require__.d(Either_namespaceObject, "chainW", function() {
        return chainW;
      }),
      __webpack_require__.d(Either_namespaceObject, "duplicate", function() {
        return duplicate;
      }),
      __webpack_require__.d(Either_namespaceObject, "flatten", function() {
        return flatten;
      }),
      __webpack_require__.d(Either_namespaceObject, "filterOrElse", function() {
        return filterOrElse;
      }),
      __webpack_require__.d(Either_namespaceObject, "toError", function() {
        return toError;
      }),
      __webpack_require__.d(Either_namespaceObject, "elem", function() {
        return elem;
      }),
      __webpack_require__.d(Either_namespaceObject, "exists", function() {
        return exists;
      });
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
    var URI = "Either";
    function left(e) {
      return { _tag: "Left", left: e };
    }
    function right(a) {
      return { _tag: "Right", right: a };
    }
    function fromNullable(e) {
      return function(a) {
        return null == a ? left(e()) : right(a);
      };
    }
    var fromOption = function(onNone) {
        return function(ma) {
          return "None" === ma._tag ? left(onNone()) : right(ma.value);
        };
      },
      fromPredicate = function(predicate, onFalse) {
        return function(a) {
          return predicate(a) ? right(a) : left(onFalse(a));
        };
      };
    function tryCatch(f, onError) {
      try {
        return right(f());
      } catch (e) {
        return left(onError(e));
      }
    }
    function parseJSON(s, onError) {
      return tryCatch(function() {
        return JSON.parse(s);
      }, onError);
    }
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
    function fold(onLeft, onRight) {
      return function(ma) {
        return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
      };
    }
    function getOrElse(onLeft) {
      return function(ma) {
        return isLeft(ma) ? onLeft(ma.left) : ma.right;
      };
    }
    var getOrElseW = getOrElse;
    function stringifyJSON(u, onError) {
      return tryCatch(function() {
        return JSON.stringify(u);
      }, onError);
    }
    function getShow(SE, SA) {
      return {
        show: function(ma) {
          return isLeft(ma)
            ? "left(" + SE.show(ma.left) + ")"
            : "right(" + SA.show(ma.right) + ")";
        }
      };
    }
    function getEq(EL, EA) {
      return {
        equals: function(x, y) {
          return (
            x === y ||
            (isLeft(x)
              ? isLeft(y) && EL.equals(x.left, y.left)
              : isRight(y) && EA.equals(x.right, y.right))
          );
        }
      };
    }
    function getValidationApplicative(S) {
      return {
        URI: URI,
        _E: void 0,
        map: map,
        ap: function(ma) {
          return function(mab) {
            return isLeft(mab)
              ? isLeft(ma)
                ? left(S.concat(mab.left, ma.left))
                : mab
              : isLeft(ma)
              ? ma
              : right(mab.right(ma.right));
          };
        },
        of: of
      };
    }
    function getValidationAlt(S) {
      return {
        URI: URI,
        _E: void 0,
        map: map,
        alt: function(that) {
          return function(fa) {
            if (isRight(fa)) return fa;
            var fy = that();
            return isLeft(fy) ? left(S.concat(fa.left, fy.left)) : fy;
          };
        }
      };
    }
    function getValidationSemigroup(SE, SA) {
      return {
        concat: function(fx, fy) {
          return isLeft(fx)
            ? isLeft(fy)
              ? left(SE.concat(fx.left, fy.left))
              : fx
            : isLeft(fy)
            ? fy
            : right(SA.concat(fx.right, fy.right));
        }
      };
    }
    function getValidationMonoid(SE, SA) {
      return {
        concat: getValidationSemigroup(SE, SA).concat,
        empty: right(SA.empty)
      };
    }
    function getSemigroup(S) {
      return {
        concat: function(x, y) {
          return isLeft(y)
            ? x
            : isLeft(x)
            ? y
            : right(S.concat(x.right, y.right));
        }
      };
    }
    function getApplySemigroup(S) {
      return {
        concat: function(x, y) {
          return isLeft(x)
            ? x
            : isLeft(y)
            ? y
            : right(S.concat(x.right, y.right));
        }
      };
    }
    function getApplyMonoid(M) {
      return { concat: getApplySemigroup(M).concat, empty: right(M.empty) };
    }
    var map = function(f) {
        return function(fa) {
          return isLeft(fa) ? fa : right(f(fa.right));
        };
      },
      functorEither = { URI: URI, map: map },
      ap = function(fa) {
        return function(fab) {
          return isLeft(fab)
            ? fab
            : isLeft(fa)
            ? fa
            : right(fab.right(fa.right));
        };
      },
      applyEither = { URI: URI, map: map, ap: ap },
      of = right,
      applicativeEither = { URI: URI, map: map, ap: ap, of: of },
      chain = function(f) {
        return function(ma) {
          return isLeft(ma) ? ma : f(ma.right);
        };
      },
      monadEither = { URI: URI, map: map, of: of, chain: chain },
      reduce = function(b, f) {
        return function(fa) {
          return isLeft(fa) ? b : f(b, fa.right);
        };
      },
      foldMap = function(M) {
        return function(f) {
          return function(fa) {
            return isLeft(fa) ? M.empty : f(fa.right);
          };
        };
      },
      reduceRight = function(b, f) {
        return function(fa) {
          return isLeft(fa) ? b : f(fa.right, b);
        };
      },
      foldableEither = {
        URI: URI,
        reduce: reduce,
        foldMap: foldMap,
        reduceRight: reduceRight
      },
      bimap = function(f, g) {
        return function(fea) {
          return isLeft(fea) ? left(f(fea.left)) : right(g(fea.right));
        };
      },
      mapLeft = function(f) {
        return function(fea) {
          return isLeft(fea) ? left(f(fea.left)) : fea;
        };
      },
      bifunctorEither = { URI: URI, bimap: bimap, mapLeft: mapLeft },
      traverse = function(F) {
        return function(f) {
          return function(ma) {
            return isLeft(ma)
              ? F.of(left(ma.left))
              : pipe(f(ma.right), F.map(right));
          };
        };
      },
      sequence = function(F) {
        return function(ma) {
          return isLeft(ma)
            ? F.of(left(ma.left))
            : pipe(ma.right, F.map(right));
        };
      },
      traversableEither = {
        URI: URI,
        map: map,
        reduce: reduce,
        foldMap: foldMap,
        reduceRight: reduceRight,
        traverse: traverse,
        sequence: sequence
      },
      alt = function(that) {
        return function(fa) {
          return isLeft(fa) ? that() : fa;
        };
      },
      altEither = { URI: URI, map: map, alt: alt },
      extend = function(f) {
        return function(wa) {
          return isLeft(wa) ? wa : right(f(wa));
        };
      },
      extendEither = { URI: URI, map: map, extend: extend },
      monadThrowEither = {
        URI: URI,
        map: map,
        of: of,
        chain: chain,
        throwError: left
      };
    function getCompactable(M) {
      var empty = left(M.empty);
      return {
        URI: URI,
        _E: void 0,
        compact: function(ma) {
          return isLeft(ma)
            ? ma
            : "None" === ma.right._tag
            ? left(M.empty)
            : right(ma.right.value);
        },
        separate: function(ma) {
          return isLeft(ma)
            ? { left: ma, right: ma }
            : isLeft(ma.right)
            ? { left: right(ma.right.left), right: empty }
            : { left: empty, right: right(ma.right.right) };
        }
      };
    }
    function getFilterable(M) {
      var empty = left(M.empty),
        compactableEither = getCompactable(M);
      return {
        URI: URI,
        _E: void 0,
        map: map,
        compact: compactableEither.compact,
        separate: compactableEither.separate,
        filter: function(predicate) {
          return function(ma) {
            return isLeft(ma) || predicate(ma.right) ? ma : left(M.empty);
          };
        },
        filterMap: function(f) {
          return function(ma) {
            if (isLeft(ma)) return ma;
            var ob = f(ma.right);
            return "None" === ob._tag ? left(M.empty) : right(ob.value);
          };
        },
        partition: function(p) {
          return function(ma) {
            return isLeft(ma)
              ? { left: ma, right: ma }
              : p(ma.right)
              ? { left: empty, right: right(ma.right) }
              : { left: right(ma.right), right: empty };
          };
        },
        partitionMap: function(f) {
          return function(ma) {
            if (isLeft(ma)) return { left: ma, right: ma };
            var e = f(ma.right);
            return isLeft(e)
              ? { left: right(e.left), right: empty }
              : { left: empty, right: right(e.right) };
          };
        }
      };
    }
    function getWitherable(M) {
      var filterableEither = getFilterable(M);
      return {
        URI: URI,
        _E: void 0,
        map: map,
        compact: filterableEither.compact,
        separate: filterableEither.separate,
        filter: filterableEither.filter,
        filterMap: filterableEither.filterMap,
        partition: filterableEither.partition,
        partitionMap: filterableEither.partitionMap,
        traverse: traverse,
        sequence: sequence,
        reduce: reduce,
        foldMap: foldMap,
        reduceRight: reduceRight,
        wither: function(F) {
          var traverseF = traverse(F);
          return function(f) {
            return function(ma) {
              return pipe(ma, traverseF(f), F.map(filterableEither.compact));
            };
          };
        },
        wilt: function(F) {
          var traverseF = traverse(F);
          return function(f) {
            return function(ma) {
              return pipe(ma, traverseF(f), F.map(filterableEither.separate));
            };
          };
        }
      };
    }
    function swap(ma) {
      return isLeft(ma) ? right(ma.left) : left(ma.right);
    }
    function orElse(onLeft) {
      return function(ma) {
        return isLeft(ma) ? onLeft(ma.left) : ma;
      };
    }
    var apFirst = function(fb) {
        return function(fa) {
          return pipe(
            fa,
            map(function(a) {
              return function() {
                return a;
              };
            }),
            ap(fb)
          );
        };
      },
      apSecond = function(fb) {
        return function(fa) {
          return pipe(
            fa,
            map(function() {
              return function(b) {
                return b;
              };
            }),
            ap(fb)
          );
        };
      },
      chainFirst = function(f) {
        return chain(function(a) {
          return pipe(
            f(a),
            map(function() {
              return a;
            })
          );
        });
      },
      chainW = chain,
      duplicate = extend(identity),
      flatten = chain(identity),
      filterOrElse = function(predicate, onFalse) {
        return function(ma) {
          return pipe(
            ma,
            chain(function(a) {
              return predicate(a) ? right(a) : left(onFalse(a));
            })
          );
        };
      };
    function toError(e) {
      return e instanceof Error ? e : new Error(String(e));
    }
    function elem(E) {
      return function(a, ma) {
        return !isLeft(ma) && E.equals(a, ma.right);
      };
    }
    function exists(predicate) {
      return function(ma) {
        return !isLeft(ma) && predicate(ma.right);
      };
    }
    var Either = Either_namespaceObject,
      x = pipe(
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
