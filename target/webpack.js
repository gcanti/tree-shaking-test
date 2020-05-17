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
    function isSome(fa) {
      return "Some" === fa._tag;
    }
    var concat = function(x, y) {
      var lenx = x.length;
      if (0 === lenx) return y;
      var leny = y.length;
      if (0 === leny) return x;
      for (var r = Array(lenx + leny), i = 0; i < lenx; i++) r[i] = x[i];
      for (i = 0; i < leny; i++) r[i + lenx] = y[i];
      return r;
    };
    var empty = [];
    function makeBy(n, f) {
      for (var r = [], i = 0; i < n; i++) r.push(f(i));
      return r;
    }
    function ReadonlyArray_flatten(mma) {
      for (var rLen = 0, len = mma.length, i = 0; i < len; i++)
        rLen += mma[i].length;
      var r = Array(rLen),
        start = 0;
      for (i = 0; i < len; i++) {
        for (var arr = mma[i], l = arr.length, j = 0; j < l; j++)
          r[j + start] = arr[j];
        start += l;
      }
      return r;
    }
    function isNonEmpty(as) {
      return as.length > 0;
    }
    function snoc(init, end) {
      for (var len = init.length, r = Array(len + 1), i = 0; i < len; i++)
        r[i] = init[i];
      return (r[len] = end), r;
    }
    var ReadonlyArray_of = function(a) {
        return [a];
      },
      readonlyArray = {
        URI: "ReadonlyArray",
        map: function(fa, f) {
          return fa.map(function(a) {
            return f(a);
          });
        },
        mapWithIndex: function(fa, f) {
          return fa.map(function(a, i) {
            return f(i, a);
          });
        },
        compact: function(as) {
          return readonlyArray.filterMap(as, identity);
        },
        separate: function(fa) {
          for (
            var left = [], right = [], _i = 0, fa_1 = fa;
            _i < fa_1.length;
            _i++
          ) {
            var e = fa_1[_i];
            "Left" === e._tag ? left.push(e.left) : right.push(e.right);
          }
          return { left: left, right: right };
        },
        filter: function(as, predicate) {
          return as.filter(predicate);
        },
        filterMap: function(as, f) {
          return readonlyArray.filterMapWithIndex(as, function(_, a) {
            return f(a);
          });
        },
        partition: function(fa, predicate) {
          return readonlyArray.partitionWithIndex(fa, function(_, a) {
            return predicate(a);
          });
        },
        partitionMap: function(fa, f) {
          return readonlyArray.partitionMapWithIndex(fa, function(_, a) {
            return f(a);
          });
        },
        of: ReadonlyArray_of,
        ap: function(fab, fa) {
          return ReadonlyArray_flatten(
            readonlyArray.map(fab, function(f) {
              return readonlyArray.map(fa, f);
            })
          );
        },
        chain: function(fa, f) {
          for (
            var resLen = 0, l = fa.length, temp = new Array(l), i = 0;
            i < l;
            i++
          ) {
            (resLen += (arr = f(fa[i])).length), (temp[i] = arr);
          }
          var r = Array(resLen),
            start = 0;
          for (i = 0; i < l; i++) {
            for (var arr, l_1 = (arr = temp[i]).length, j = 0; j < l_1; j++)
              r[j + start] = arr[j];
            start += l_1;
          }
          return r;
        },
        reduce: function(fa, b, f) {
          return readonlyArray.reduceWithIndex(fa, b, function(_, b, a) {
            return f(b, a);
          });
        },
        foldMap: function(M) {
          var foldMapWithIndexM = readonlyArray.foldMapWithIndex(M);
          return function(fa, f) {
            return foldMapWithIndexM(fa, function(_, a) {
              return f(a);
            });
          };
        },
        reduceRight: function(fa, b, f) {
          return readonlyArray.reduceRightWithIndex(fa, b, function(_, a, b) {
            return f(a, b);
          });
        },
        unfold: function(b, f) {
          for (var ret = [], bb = b; ; ) {
            var mt = f(bb);
            if (!isSome(mt)) break;
            var _a = mt.value,
              a = _a[0],
              b_1 = _a[1];
            ret.push(a), (bb = b_1);
          }
          return ret;
        },
        traverse: function(F) {
          var traverseWithIndexF = readonlyArray.traverseWithIndex(F);
          return function(ta, f) {
            return traverseWithIndexF(ta, function(_, a) {
              return f(a);
            });
          };
        },
        sequence: function(F) {
          return function(ta) {
            return readonlyArray.reduce(
              ta,
              F.of(readonlyArray.zero()),
              function(fas, fa) {
                return F.ap(
                  F.map(fas, function(as) {
                    return function(a) {
                      return snoc(as, a);
                    };
                  }),
                  fa
                );
              }
            );
          };
        },
        zero: function() {
          return empty;
        },
        alt: function(fx, f) {
          return concat(fx, f());
        },
        extend: function(fa, f) {
          return fa.map(function(_, i, as) {
            return f(as.slice(i));
          });
        },
        wither: function(F) {
          var traverseF = readonlyArray.traverse(F);
          return function(wa, f) {
            return F.map(traverseF(wa, f), readonlyArray.compact);
          };
        },
        wilt: function(F) {
          var traverseF = readonlyArray.traverse(F);
          return function(wa, f) {
            return F.map(traverseF(wa, f), readonlyArray.separate);
          };
        },
        reduceWithIndex: function(fa, b, f) {
          for (var l = fa.length, r = b, i = 0; i < l; i++) r = f(i, r, fa[i]);
          return r;
        },
        foldMapWithIndex: function(M) {
          return function(fa, f) {
            return fa.reduce(function(b, a, i) {
              return M.concat(b, f(i, a));
            }, M.empty);
          };
        },
        reduceRightWithIndex: function(fa, b, f) {
          return fa.reduceRight(function(b, a, i) {
            return f(i, a, b);
          }, b);
        },
        traverseWithIndex: function(F) {
          return function(ta, f) {
            return readonlyArray.reduceWithIndex(
              ta,
              F.of(readonlyArray.zero()),
              function(i, fbs, a) {
                return F.ap(
                  F.map(fbs, function(bs) {
                    return function(b) {
                      return snoc(bs, b);
                    };
                  }),
                  f(i, a)
                );
              }
            );
          };
        },
        partitionMapWithIndex: function(fa, f) {
          for (var left = [], right = [], i = 0; i < fa.length; i++) {
            var e = f(i, fa[i]);
            "Left" === e._tag ? left.push(e.left) : right.push(e.right);
          }
          return { left: left, right: right };
        },
        partitionWithIndex: function(fa, predicateWithIndex) {
          for (var left = [], right = [], i = 0; i < fa.length; i++) {
            var a = fa[i];
            predicateWithIndex(i, a) ? right.push(a) : left.push(a);
          }
          return { left: left, right: right };
        },
        filterMapWithIndex: function(fa, f) {
          for (var result = [], i = 0; i < fa.length; i++) {
            var optionB = f(i, fa[i]);
            isSome(optionB) && result.push(optionB.value);
          }
          return result;
        },
        filterWithIndex: function(fa, predicateWithIndex) {
          return fa.filter(function(a, i) {
            return predicateWithIndex(i, a);
          });
        }
      },
      Array_makeBy = makeBy,
      Array_isNonEmpty = isNonEmpty;
    function ReadonlyNonEmptyArray_head(nea) {
      return nea[0];
    }
    var ReadonlyNonEmptyArray_of = ReadonlyArray_of;
    var readonlyNonEmptyArray = (function() {
      var _a = readonlyArray,
        alt = _a.alt,
        map = _a.map,
        mapWithIndex = _a.mapWithIndex,
        of = _a.of,
        ap = _a.ap,
        chain = _a.chain,
        extend = _a.extend,
        reduce = _a.reduce,
        foldMap = _a.foldMap,
        reduceRight = _a.reduceRight,
        traverse = _a.traverse,
        sequence = _a.sequence,
        reduceRightWithIndex = _a.reduceRightWithIndex,
        foldMapWithIndex = _a.foldMapWithIndex;
      return {
        URI: "ReadonlyNonEmptyArray",
        extract: ReadonlyNonEmptyArray_head,
        alt: alt,
        map: map,
        mapWithIndex: mapWithIndex,
        of: of,
        ap: ap,
        chain: chain,
        extend: extend,
        reduce: reduce,
        foldMap: foldMap,
        reduceRight: reduceRight,
        traverse: traverse,
        sequence: sequence,
        reduceWithIndex: _a.reduceWithIndex,
        foldMapWithIndex: foldMapWithIndex,
        reduceRightWithIndex: reduceRightWithIndex,
        traverseWithIndex: _a.traverseWithIndex
      };
    })();
    var NonEmptyArray_of = ReadonlyNonEmptyArray_of;
    var NonEmptyArray_pipeables = pipeable(
        (function() {
          return Object.assign({}, readonlyNonEmptyArray, {
            URI: "NonEmptyArray"
          });
        })()
      ),
      NonEmptyArray_chain = (function() {
        return NonEmptyArray_pipeables.chain;
      })(),
      NonEmptyArray_map = (function() {
        return NonEmptyArray_pipeables.map;
      })(),
      lib_a = Array_makeBy(10, identity);
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
