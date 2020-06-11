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
    __webpack_require__((__webpack_require__.s = 96));
})({
  96: function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var Either_namespaceObject = {};
    __webpack_require__.r(Either_namespaceObject),
      __webpack_require__.d(Either_namespaceObject, "URI", function() {
        return URI;
      }),
      __webpack_require__.d(Either_namespaceObject, "isLeft", function() {
        return isLeft;
      }),
      __webpack_require__.d(Either_namespaceObject, "isRight", function() {
        return isRight;
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
      __webpack_require__.d(Either_namespaceObject, "tryCatch", function() {
        return tryCatch;
      }),
      __webpack_require__.d(Either_namespaceObject, "parseJSON", function() {
        return parseJSON;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "stringifyJSON",
        function() {
          return stringifyJSON;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "fromOption", function() {
        return Either_fromOption;
      }),
      __webpack_require__.d(
        Either_namespaceObject,
        "fromPredicate",
        function() {
          return Either_fromPredicate;
        }
      ),
      __webpack_require__.d(Either_namespaceObject, "fold", function() {
        return fold;
      }),
      __webpack_require__.d(Either_namespaceObject, "getOrElseW", function() {
        return getOrElseW;
      }),
      __webpack_require__.d(Either_namespaceObject, "getOrElse", function() {
        return getOrElse;
      }),
      __webpack_require__.d(Either_namespaceObject, "swap", function() {
        return swap;
      }),
      __webpack_require__.d(Either_namespaceObject, "orElse", function() {
        return orElse;
      }),
      __webpack_require__.d(Either_namespaceObject, "filterOrElse", function() {
        return Either_filterOrElse;
      }),
      __webpack_require__.d(Either_namespaceObject, "map", function() {
        return Either_map;
      }),
      __webpack_require__.d(Either_namespaceObject, "bimap", function() {
        return Either_bimap;
      }),
      __webpack_require__.d(Either_namespaceObject, "mapLeft", function() {
        return Either_mapLeft;
      }),
      __webpack_require__.d(Either_namespaceObject, "ap", function() {
        return Either_ap;
      }),
      __webpack_require__.d(Either_namespaceObject, "apFirst", function() {
        return Either_apFirst;
      }),
      __webpack_require__.d(Either_namespaceObject, "apSecond", function() {
        return apSecond;
      }),
      __webpack_require__.d(Either_namespaceObject, "chainW", function() {
        return chainW;
      }),
      __webpack_require__.d(Either_namespaceObject, "chain", function() {
        return Either_chain;
      }),
      __webpack_require__.d(Either_namespaceObject, "chainFirst", function() {
        return Either_chainFirst;
      }),
      __webpack_require__.d(Either_namespaceObject, "flatten", function() {
        return Either_flatten;
      }),
      __webpack_require__.d(Either_namespaceObject, "alt", function() {
        return Either_alt;
      }),
      __webpack_require__.d(Either_namespaceObject, "duplicate", function() {
        return Either_duplicate;
      }),
      __webpack_require__.d(Either_namespaceObject, "extend", function() {
        return Either_extend;
      }),
      __webpack_require__.d(Either_namespaceObject, "reduce", function() {
        return Either_reduce;
      }),
      __webpack_require__.d(Either_namespaceObject, "foldMap", function() {
        return Either_foldMap;
      }),
      __webpack_require__.d(Either_namespaceObject, "reduceRight", function() {
        return Either_reduceRight;
      }),
      __webpack_require__.d(Either_namespaceObject, "traverse", function() {
        return traverse;
      }),
      __webpack_require__.d(Either_namespaceObject, "sequence", function() {
        return sequence;
      }),
      __webpack_require__.d(Either_namespaceObject, "applyEither", function() {
        return applyEither;
      }),
      __webpack_require__.d(Either_namespaceObject, "getShow", function() {
        return getShow;
      }),
      __webpack_require__.d(Either_namespaceObject, "getEq", function() {
        return getEq;
      }),
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
      __webpack_require__.d(
        Either_namespaceObject,
        "getWitherable",
        function() {
          return getWitherable;
        }
      ),
      __webpack_require__.d(
        Either_namespaceObject,
        "getValidation",
        function() {
          return getValidation;
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
      __webpack_require__.d(Either_namespaceObject, "either", function() {
        return either;
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
    var pipeable_namespaceObject = {};
    function identity(a) {
      return a;
    }
    __webpack_require__.r(pipeable_namespaceObject),
      __webpack_require__.d(pipeable_namespaceObject, "pipe", function() {
        return pipeable_pipe;
      }),
      __webpack_require__.d(pipeable_namespaceObject, "pipeable", function() {
        return pipeable;
      });
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
    function fromNullable(e) {
      return function(a) {
        return null == a ? left(e) : right(a);
      };
    }
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
    function stringifyJSON(u, onError) {
      return tryCatch(function() {
        return JSON.stringify(u);
      }, onError);
    }
    var Either_fromOption = function(onNone) {
        return function(ma) {
          return "None" === ma._tag ? left(onNone()) : right(ma.value);
        };
      },
      Either_fromPredicate = function(predicate, onFalse) {
        return function(a) {
          return predicate(a) ? right(a) : left(onFalse(a));
        };
      };
    function fold(onLeft, onRight) {
      return function(ma) {
        return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
      };
    }
    var getOrElseW = function(onLeft) {
        return function(ma) {
          return isLeft(ma) ? onLeft(ma.left) : ma.right;
        };
      },
      getOrElse = getOrElseW;
    function swap(ma) {
      return isLeft(ma) ? right(ma.left) : left(ma.right);
    }
    function orElse(onLeft) {
      return function(ma) {
        return isLeft(ma) ? onLeft(ma.left) : ma;
      };
    }
    var Either_filterOrElse = function(predicate, onFalse) {
        return function(ma) {
          return chain_(ma, function(a) {
            return predicate(a) ? right(a) : left(onFalse(a));
          });
        };
      },
      Either_map = function(f) {
        return function(fa) {
          return map_(fa, f);
        };
      },
      Either_bimap = function(f, g) {
        return function(fa) {
          return bimap_(fa, f, g);
        };
      },
      Either_mapLeft = function(f) {
        return function(fa) {
          return mapLeft_(fa, f);
        };
      },
      Either_ap = function(fa) {
        return function(fab) {
          return ap_(fab, fa);
        };
      },
      Either_apFirst = function(fb) {
        return function(fa) {
          return ap_(
            map_(fa, function(a) {
              return function() {
                return a;
              };
            }),
            fb
          );
        };
      },
      apSecond = function(fb) {
        return function(fa) {
          return ap_(
            map_(fa, function() {
              return function(b) {
                return b;
              };
            }),
            fb
          );
        };
      },
      chainW = function(f) {
        return function(ma) {
          return chain_(ma, f);
        };
      },
      Either_chain = chainW,
      Either_chainFirst = function(f) {
        return function(ma) {
          return chain_(ma, function(a) {
            return map_(f(a), function() {
              return a;
            });
          });
        };
      },
      Either_flatten = function(mma) {
        return chain_(mma, identity);
      },
      Either_alt = function(that) {
        return function(fa) {
          return alt_(fa, that);
        };
      },
      Either_duplicate = function(wa) {
        return extend_(wa, identity);
      },
      Either_extend = function(f) {
        return function(ma) {
          return extend_(ma, f);
        };
      },
      Either_reduce = function(b, f) {
        return function(fa) {
          return reduce_(fa, b, f);
        };
      },
      Either_foldMap = function(M) {
        var foldMapM = foldMap_(M);
        return function(f) {
          return function(fa) {
            return foldMapM(fa, f);
          };
        };
      },
      Either_reduceRight = function(b, f) {
        return function(fa) {
          return reduceRight_(fa, b, f);
        };
      },
      traverse = function(F) {
        var traverseF = traverse_(F);
        return function(f) {
          return function(fa) {
            return traverseF(fa, f);
          };
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
      ap_ = function(mab, ma) {
        return isLeft(mab) ? mab : isLeft(ma) ? ma : right(mab.right(ma.right));
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
      alt_ = function(fx, fy) {
        return isLeft(fx) ? fy() : fx;
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
      throwError_ = left,
      applyEither = { URI: URI, map: map_, ap: ap_ };
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
    function getWitherable(M) {
      var empty = left(M.empty),
        compact = function(ma) {
          return isLeft(ma)
            ? ma
            : "None" === ma.right._tag
            ? left(M.empty)
            : right(ma.right.value);
        },
        separate = function(ma) {
          return isLeft(ma)
            ? { left: ma, right: ma }
            : isLeft(ma.right)
            ? { left: right(ma.right.left), right: empty }
            : { left: empty, right: right(ma.right.right) };
        };
      return {
        URI: URI,
        _E: void 0,
        map: map_,
        compact: compact,
        separate: separate,
        filter: function(ma, predicate) {
          return isLeft(ma) || predicate(ma.right) ? ma : left(M.empty);
        },
        filterMap: function(ma, f) {
          if (isLeft(ma)) return ma;
          var ob = f(ma.right);
          return "None" === ob._tag ? left(M.empty) : right(ob.value);
        },
        partition: function(ma, p) {
          return isLeft(ma)
            ? { left: ma, right: ma }
            : p(ma.right)
            ? { left: empty, right: right(ma.right) }
            : { left: right(ma.right), right: empty };
        },
        partitionMap: function(ma, f) {
          if (isLeft(ma)) return { left: ma, right: ma };
          var e = f(ma.right);
          return isLeft(e)
            ? { left: right(e.left), right: empty }
            : { left: empty, right: right(e.right) };
        },
        traverse: traverse_,
        sequence: sequence,
        reduce: reduce_,
        foldMap: foldMap_,
        reduceRight: reduceRight_,
        wither: function(F) {
          var traverseF = traverse_(F);
          return function(ma, f) {
            return F.map(traverseF(ma, f), compact);
          };
        },
        wilt: function(F) {
          var traverseF = traverse_(F);
          return function(ma, f) {
            return F.map(traverseF(ma, f), separate);
          };
        }
      };
    }
    function getValidation(S) {
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
    var either = {
      URI: URI,
      map: map_,
      of: of,
      ap: ap_,
      chain: chain_,
      reduce: reduce_,
      foldMap: foldMap_,
      reduceRight: reduceRight_,
      traverse: traverse_,
      sequence: sequence,
      bimap: bimap_,
      mapLeft: mapLeft_,
      alt: alt_,
      extend: extend_,
      chainRec: chainRec_,
      throwError: throwError_
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
    var pipeable_pipe = function(a, ab, bc, cd, de, ef, fg, gh, hi, ij) {
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
    };
    function pipeable(I) {
      var r = {};
      if (
        (function(I) {
          return "function" == typeof I.map;
        })(I)
      ) {
        r.map = function(f) {
          return function(fa) {
            return I.map(fa, f);
          };
        };
      }
      if (
        (function(I) {
          return "function" == typeof I.contramap;
        })(I)
      ) {
        r.contramap = function(f) {
          return function(fa) {
            return I.contramap(fa, f);
          };
        };
      }
      if (
        (function(I) {
          return "function" == typeof I.mapWithIndex;
        })(I)
      ) {
        r.mapWithIndex = function(f) {
          return function(fa) {
            return I.mapWithIndex(fa, f);
          };
        };
      }
      if (
        (function(I) {
          return "function" == typeof I.ap;
        })(I)
      ) {
        (r.ap = function(fa) {
          return function(fab) {
            return I.ap(fab, fa);
          };
        }),
          (r.apFirst = function(fb) {
            return function(fa) {
              return I.ap(
                I.map(fa, function(a) {
                  return function() {
                    return a;
                  };
                }),
                fb
              );
            };
          }),
          (r.apSecond = function(fb) {
            return function(fa) {
              return I.ap(
                I.map(fa, function() {
                  return function(b) {
                    return b;
                  };
                }),
                fb
              );
            };
          });
      }
      if (
        (function(I) {
          return "function" == typeof I.chain;
        })(I)
      ) {
        (r.chain = function(f) {
          return function(ma) {
            return I.chain(ma, f);
          };
        }),
          (r.chainFirst = function(f) {
            return function(ma) {
              return I.chain(ma, function(a) {
                return I.map(f(a), function() {
                  return a;
                });
              });
            };
          }),
          (r.flatten = function(mma) {
            return I.chain(mma, identity);
          });
      }
      if (
        (function(I) {
          return "function" == typeof I.bimap;
        })(I)
      ) {
        (r.bimap = function(f, g) {
          return function(fa) {
            return I.bimap(fa, f, g);
          };
        }),
          (r.mapLeft = function(f) {
            return function(fa) {
              return I.mapLeft(fa, f);
            };
          });
      }
      if (
        (function(I) {
          return "function" == typeof I.extend;
        })(I)
      ) {
        (r.extend = function(f) {
          return function(wa) {
            return I.extend(wa, f);
          };
        }),
          (r.duplicate = function(wa) {
            return I.extend(wa, identity);
          });
      }
      if (
        (function(I) {
          return "function" == typeof I.reduce;
        })(I)
      ) {
        (r.reduce = function(b, f) {
          return function(fa) {
            return I.reduce(fa, b, f);
          };
        }),
          (r.foldMap = function(M) {
            var foldMapM = I.foldMap(M);
            return function(f) {
              return function(fa) {
                return foldMapM(fa, f);
              };
            };
          }),
          (r.reduceRight = function(b, f) {
            return function(fa) {
              return I.reduceRight(fa, b, f);
            };
          });
      }
      if (
        (function(I) {
          return "function" == typeof I.reduceWithIndex;
        })(I)
      ) {
        (r.reduceWithIndex = function(b, f) {
          return function(fa) {
            return I.reduceWithIndex(fa, b, f);
          };
        }),
          (r.foldMapWithIndex = function(M) {
            var foldMapM = I.foldMapWithIndex(M);
            return function(f) {
              return function(fa) {
                return foldMapM(fa, f);
              };
            };
          }),
          (r.reduceRightWithIndex = function(b, f) {
            return function(fa) {
              return I.reduceRightWithIndex(fa, b, f);
            };
          });
      }
      if (
        (function(I) {
          return "function" == typeof I.alt;
        })(I)
      ) {
        r.alt = function(that) {
          return function(fa) {
            return I.alt(fa, that);
          };
        };
      }
      if (
        ((function(I) {
          return "function" == typeof I.compact;
        })(I) && ((r.compact = I.compact), (r.separate = I.separate)),
        (function(I) {
          return "function" == typeof I.filter;
        })(I))
      ) {
        (r.filter = function(predicate) {
          return function(fa) {
            return I.filter(fa, predicate);
          };
        }),
          (r.filterMap = function(f) {
            return function(fa) {
              return I.filterMap(fa, f);
            };
          }),
          (r.partition = function(predicate) {
            return function(fa) {
              return I.partition(fa, predicate);
            };
          }),
          (r.partitionMap = function(f) {
            return function(fa) {
              return I.partitionMap(fa, f);
            };
          });
      }
      if (
        (function(I) {
          return "function" == typeof I.filterWithIndex;
        })(I)
      ) {
        (r.filterWithIndex = function(predicateWithIndex) {
          return function(fa) {
            return I.filterWithIndex(fa, predicateWithIndex);
          };
        }),
          (r.filterMapWithIndex = function(f) {
            return function(fa) {
              return I.filterMapWithIndex(fa, f);
            };
          }),
          (r.partitionWithIndex = function(predicateWithIndex) {
            return function(fa) {
              return I.partitionWithIndex(fa, predicateWithIndex);
            };
          }),
          (r.partitionMapWithIndex = function(f) {
            return function(fa) {
              return I.partitionMapWithIndex(fa, f);
            };
          });
      }
      if (
        (function(I) {
          return "function" == typeof I.promap;
        })(I)
      ) {
        r.promap = function(f, g) {
          return function(fa) {
            return I.promap(fa, f, g);
          };
        };
      }
      if (
        (function(I) {
          return "function" == typeof I.compose;
        })(I)
      ) {
        r.compose = function(that) {
          return function(fa) {
            return I.compose(fa, that);
          };
        };
      }
      if (
        (function(I) {
          return "function" == typeof I.throwError;
        })(I)
      ) {
        (r.fromOption = function(onNone) {
          return function(ma) {
            return "None" === ma._tag ? I.throwError(onNone()) : I.of(ma.value);
          };
        }),
          (r.fromEither = function(ma) {
            return "Left" === ma._tag ? I.throwError(ma.left) : I.of(ma.right);
          }),
          (r.fromPredicate = function(predicate, onFalse) {
            return function(a) {
              return predicate(a) ? I.of(a) : I.throwError(onFalse(a));
            };
          }),
          (r.filterOrElse = function(predicate, onFalse) {
            return function(ma) {
              return I.chain(ma, function(a) {
                return predicate(a) ? I.of(a) : I.throwError(onFalse(a));
              });
            };
          });
      }
      return r;
    }
    pipeable_namespaceObject.pipe(
      Either_namespaceObject.right(1),
      Either_namespaceObject.map(function(n) {
        return n + 1;
      }),
      Either_namespaceObject.chain(function(n) {
        return Either_namespaceObject.right(n + 1);
      })
    );
  }
});
