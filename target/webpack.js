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
        return lib_x;
      });
    var internal_namespaceObject = {};
    function identity(a) {
      return a;
    }
    __webpack_require__.r(internal_namespaceObject),
      __webpack_require__.d(internal_namespaceObject, "isoAsLens", function() {
        return isoAsLens;
      }),
      __webpack_require__.d(
        internal_namespaceObject,
        "isoAsOptional",
        function() {
          return isoAsOptional;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "lensAsOptional",
        function() {
          return lensAsOptional;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "lensAsTraversal",
        function() {
          return lensAsTraversal;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "lensComposeLens",
        function() {
          return lensComposeLens;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "lensComposePrism",
        function() {
          return lensComposePrism;
        }
      ),
      __webpack_require__.d(internal_namespaceObject, "lensId", function() {
        return lensId;
      }),
      __webpack_require__.d(internal_namespaceObject, "lensProp", function() {
        return lensProp;
      }),
      __webpack_require__.d(internal_namespaceObject, "lensProps", function() {
        return lensProps;
      }),
      __webpack_require__.d(
        internal_namespaceObject,
        "lensComponent",
        function() {
          return lensComponent;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "prismAsOptional",
        function() {
          return prismAsOptional;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "prismAsTraversal",
        function() {
          return prismAsTraversal;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "prismModifyOption",
        function() {
          return prismModifyOption;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "prismModify",
        function() {
          return prismModify;
        }
      ),
      __webpack_require__.d(internal_namespaceObject, "prismSet", function() {
        return prismSet;
      }),
      __webpack_require__.d(
        internal_namespaceObject,
        "prismComposeLens",
        function() {
          return prismComposeLens;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "prismFromNullable",
        function() {
          return prismFromNullable;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "prismFromPredicate",
        function() {
          return prismFromPredicate;
        }
      ),
      __webpack_require__.d(internal_namespaceObject, "prismSome", function() {
        return prismSome;
      }),
      __webpack_require__.d(internal_namespaceObject, "prismRight", function() {
        return prismRight;
      }),
      __webpack_require__.d(internal_namespaceObject, "prismLeft", function() {
        return prismLeft;
      }),
      __webpack_require__.d(
        internal_namespaceObject,
        "optionalAsTraversal",
        function() {
          return optionalAsTraversal;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "optionalModifyOption",
        function() {
          return optionalModifyOption;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "optionalModify",
        function() {
          return optionalModify;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "optionalComposeOptional",
        function() {
          return optionalComposeOptional;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "traversalComposeTraversal",
        function() {
          return traversalComposeTraversal;
        }
      ),
      __webpack_require__.d(
        internal_namespaceObject,
        "fromTraversable",
        function() {
          return fromTraversable;
        }
      ),
      __webpack_require__.d(internal_namespaceObject, "indexArray", function() {
        return indexArray;
      }),
      __webpack_require__.d(
        internal_namespaceObject,
        "indexRecord",
        function() {
          return indexRecord;
        }
      ),
      __webpack_require__.d(internal_namespaceObject, "atRecord", function() {
        return atRecord;
      });
    function constant(a) {
      return function() {
        return a;
      };
    }
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
    var isNone = function(fa) {
        return "None" === fa._tag;
      },
      none = { _tag: "None" },
      some = function(a) {
        return { _tag: "Some", value: a };
      };
    function fromNullable(a) {
      return null == a ? none : some(a);
    }
    function Option_fromPredicate(predicate) {
      return function(a) {
        return predicate(a) ? some(a) : none;
      };
    }
    var Option_fromEither = function(ma) {
      return "Left" === ma._tag ? none : some(ma.right);
    };
    function fold(onNone, onSome) {
      return function(ma) {
        return isNone(ma) ? onNone() : onSome(ma.value);
      };
    }
    var getOrElse = function(onNone) {
      return function(ma) {
        return isNone(ma) ? onNone() : ma.value;
      };
    };
    var map_ = function(fa, f) {
        return isNone(fa) ? none : some(f(fa.value));
      },
      chain_ = function(ma, f) {
        return isNone(ma) ? none : f(ma.value);
      },
      Option_map = function(f) {
        return function(fa) {
          return map_(fa, f);
        };
      };
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
    function isOutOfBound(i, as) {
      return i < 0 || i >= as.length;
    }
    function lookup(i, as) {
      return void 0 === as
        ? function(as) {
            return lookup(i, as);
          }
        : isOutOfBound(i, as)
        ? none
        : some(as[i]);
    }
    function snoc(init, end) {
      for (var len = init.length, r = Array(len + 1), i = 0; i < len; i++)
        r[i] = init[i];
      return (r[len] = end), r;
    }
    var ReadonlyArray_of = function(a) {
        return [a];
      },
      ReadonlyArray_zero = function() {
        return empty;
      },
      ReadonlyArray_map_ = function(fa, f) {
        return fa.map(function(a) {
          return f(a);
        });
      },
      ReadonlyArray_ap_ = function(fab, fa) {
        return ReadonlyArray_flatten(
          ReadonlyArray_map_(fab, function(f) {
            return ReadonlyArray_map_(fa, f);
          })
        );
      },
      chainWithIndex_ = function(fa, f) {
        for (
          var outLen = 0, l = fa.length, temp = new Array(l), i = 0;
          i < l;
          i++
        ) {
          (outLen += (arr = f(i, fa[i])).length), (temp[i] = arr);
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
      ReadonlyArray_chain_ = function(fa, f) {
        return chainWithIndex_(fa, function(_index, a) {
          return f(a);
        });
      },
      ReadonlyArray_reduce_ = function(fa, b, f) {
        return reduceWithIndex_(fa, b, function(_, b, a) {
          return f(b, a);
        });
      },
      ReadonlyArray_foldMap_ = function(M) {
        var foldMapWithIndexM = foldMapWithIndex_(M);
        return function(fa, f) {
          return foldMapWithIndexM(fa, function(_, a) {
            return f(a);
          });
        };
      },
      ReadonlyArray_reduceRight_ = function(fa, b, f) {
        return reduceRightWithIndex_(fa, b, function(_, a, b) {
          return f(a, b);
        });
      },
      reduceWithIndex_ = function(fa, b, f) {
        for (var l = fa.length, r = b, i = 0; i < l; i++) r = f(i, r, fa[i]);
        return r;
      },
      foldMapWithIndex_ = function(M) {
        return function(fa, f) {
          return fa.reduce(function(b, a, i) {
            return M.concat(b, f(i, a));
          }, M.empty);
        };
      },
      reduceRightWithIndex_ = function(fa, b, f) {
        return fa.reduceRight(function(b, a, i) {
          return f(i, a, b);
        }, b);
      },
      ReadonlyArray_traverse_ = function(F) {
        var traverseWithIndexF = traverseWithIndex_(F);
        return function(ta, f) {
          return traverseWithIndexF(ta, function(_, a) {
            return f(a);
          });
        };
      },
      traverseWithIndex_ = function(F) {
        return function(ta, f) {
          return reduceWithIndex_(ta, F.of(ReadonlyArray_zero()), function(
            i,
            fbs,
            a
          ) {
            return F.ap(
              F.map(fbs, function(bs) {
                return function(b) {
                  return snoc(bs, b);
                };
              }),
              f(i, a)
            );
          });
        };
      },
      ReadonlyArray_sequence = function(F) {
        return function(ta) {
          return ReadonlyArray_reduce_(ta, F.of(ReadonlyArray_zero()), function(
            fas,
            fa
          ) {
            return F.ap(
              F.map(fas, function(as) {
                return function(a) {
                  return snoc(as, a);
                };
              }),
              fa
            );
          });
        };
      },
      ReadonlyArray_Monad = {
        URI: "ReadonlyArray",
        map: ReadonlyArray_map_,
        ap: ReadonlyArray_ap_,
        of: ReadonlyArray_of,
        chain: ReadonlyArray_chain_
      };
    function unsafeUpdateAt(i, a, as) {
      if (as[i] === a) return as;
      var xs = as.slice();
      return (xs[i] = a), xs;
    }
    var empty = [],
      Array_lookup = lookup;
    var Array_updateAt = function(i, a) {
      return function(as) {
        return isOutOfBound(i, as) ? none : some(unsafeUpdateAt(i, a, as));
      };
    };
    var Array_map_ = ReadonlyArray_Monad.map,
      Array_Traversable = {
        URI: "Array",
        map: Array_map_,
        reduce: ReadonlyArray_reduce_,
        foldMap: ReadonlyArray_foldMap_,
        reduceRight: ReadonlyArray_reduceRight_,
        traverse: ReadonlyArray_traverse_,
        sequence: ReadonlyArray_sequence
      };
    function ReadonlyRecord_keys(r) {
      return Object.keys(r).sort();
    }
    function collect(f) {
      return function(r) {
        for (
          var out = [], _i = 0, _a = ReadonlyRecord_keys(r);
          _i < _a.length;
          _i++
        ) {
          var key = _a[_i];
          out.push(f(key, r[key]));
        }
        return out;
      };
    }
    collect(function(k, a) {
      return [k, a];
    });
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReadonlyRecord_deleteAt(k) {
      return function(r) {
        if (!_hasOwnProperty.call(r, k)) return r;
        var out = Object.assign({}, r);
        return delete out[k], out;
      };
    }
    function ReadonlyRecord_lookup(k, r) {
      return void 0 === r
        ? function(r) {
            return ReadonlyRecord_lookup(k, r);
          }
        : _hasOwnProperty.call(r, k)
        ? some(r[k])
        : none;
    }
    var ReadonlyRecord_empty = {};
    function ReadonlyRecord_traverseWithIndex(F) {
      var traverseWithIndexF = ReadonlyRecord_traverseWithIndex_(F);
      return function(f) {
        return function(ta) {
          return traverseWithIndexF(ta, f);
        };
      };
    }
    function ReadonlyRecord_sequence(F) {
      return ReadonlyRecord_traverseWithIndex(F)(function(_, a) {
        return a;
      });
    }
    var ReadonlyRecord_map_ = function(fa, f) {
        return ReadonlyRecord_mapWithIndex_(fa, function(_, a) {
          return f(a);
        });
      },
      ReadonlyRecord_mapWithIndex_ = function(fa, f) {
        for (
          var out = {}, _i = 0, keys_1 = Object.keys(fa);
          _i < keys_1.length;
          _i++
        ) {
          var key = keys_1[_i];
          out[key] = f(key, fa[key]);
        }
        return out;
      },
      ReadonlyRecord_reduce_ = function(fa, b, f) {
        return ReadonlyRecord_reduceWithIndex_(fa, b, function(_, b, a) {
          return f(b, a);
        });
      },
      ReadonlyRecord_foldMap_ = function(M) {
        var foldMapWithIndexM = ReadonlyRecord_foldMapWithIndex_(M);
        return function(fa, f) {
          return foldMapWithIndexM(fa, function(_, a) {
            return f(a);
          });
        };
      },
      ReadonlyRecord_reduceRight_ = function(fa, b, f) {
        return ReadonlyRecord_reduceRightWithIndex_(fa, b, function(_, a, b) {
          return f(a, b);
        });
      },
      ReadonlyRecord_reduceWithIndex_ = function(fa, b, f) {
        for (
          var out = b, ks = ReadonlyRecord_keys(fa), len = ks.length, i = 0;
          i < len;
          i++
        ) {
          var k = ks[i];
          out = f(k, out, fa[k]);
        }
        return out;
      },
      ReadonlyRecord_foldMapWithIndex_ = function(M) {
        return function(fa, f) {
          for (
            var out = M.empty,
              ks = ReadonlyRecord_keys(fa),
              len = ks.length,
              i = 0;
            i < len;
            i++
          ) {
            var k = ks[i];
            out = M.concat(out, f(k, fa[k]));
          }
          return out;
        };
      },
      ReadonlyRecord_reduceRightWithIndex_ = function(fa, b, f) {
        for (
          var out = b, ks = ReadonlyRecord_keys(fa), i = ks.length - 1;
          i >= 0;
          i--
        ) {
          var k = ks[i];
          out = f(k, fa[k], out);
        }
        return out;
      },
      ReadonlyRecord_traverseWithIndex_ = function(F) {
        return function(ta, f) {
          var ks = ReadonlyRecord_keys(ta);
          if (0 === ks.length) return F.of(ReadonlyRecord_empty);
          for (
            var fr = F.of({}),
              _loop_1 = function(key) {
                fr = F.ap(
                  F.map(fr, function(r) {
                    return function(b) {
                      return (r[key] = b), r;
                    };
                  }),
                  f(key, ta[key])
                );
              },
              _i = 0,
              ks_1 = ks;
            _i < ks_1.length;
            _i++
          ) {
            _loop_1(ks_1[_i]);
          }
          return fr;
        };
      };
    function Record_insertAt(k, a) {
      return (function(k, a) {
        return function(r) {
          if (r[k] === a) return r;
          var out = Object.assign({}, r);
          return (out[k] = a), out;
        };
      })(k, a);
    }
    var Record_lookup = ReadonlyRecord_lookup;
    function Record_traverse(F) {
      return (function(F) {
        var traverseWithIndexF = ReadonlyRecord_traverseWithIndex(F);
        return function(f) {
          return traverseWithIndexF(function(_, a) {
            return f(a);
          });
        };
      })(F);
    }
    function Record_sequence(F) {
      return ReadonlyRecord_sequence(F);
    }
    var Record_traverse_ = function(F) {
        var traverseF = Record_traverse(F);
        return function(ta, f) {
          return traverseF(f)(ta);
        };
      },
      Record_Traversable = {
        URI: "Record",
        map: ReadonlyRecord_map_,
        reduce: ReadonlyRecord_reduce_,
        foldMap: ReadonlyRecord_foldMap_,
        reduceRight: ReadonlyRecord_reduceRight_,
        traverse: Record_traverse_,
        sequence: Record_sequence
      },
      pipeable_pipe = pipe;
    var isLeft = function(ma) {
        return "Left" === ma._tag;
      },
      left = function(e) {
        return { _tag: "Left", left: e };
      },
      right = function(a) {
        return { _tag: "Right", right: a };
      };
    var isoAsLens = function(sa) {
        return { get: sa.get, set: flow(sa.reverseGet, constant) };
      },
      isoAsOptional = function(sa) {
        return {
          getOption: flow(sa.get, some),
          set: flow(sa.reverseGet, constant)
        };
      },
      lensAsOptional = function(sa) {
        return { getOption: flow(sa.get, some), set: sa.set };
      },
      lensAsTraversal = function(sa) {
        return {
          modifyF: function(F) {
            return function(f) {
              return function(s) {
                return F.map(f(sa.get(s)), function(a) {
                  return sa.set(a)(s);
                });
              };
            };
          }
        };
      },
      lensComposeLens = function(ab) {
        return function(sa) {
          return {
            get: function(s) {
              return ab.get(sa.get(s));
            },
            set: function(b) {
              return function(s) {
                return sa.set(ab.set(b)(sa.get(s)))(s);
              };
            }
          };
        };
      },
      lensComposePrism = function(ab) {
        return function(sa) {
          return optionalComposeOptional(prismAsOptional(ab))(
            lensAsOptional(sa)
          );
        };
      },
      lensId = function() {
        return { get: identity, set: constant };
      },
      lensProp = function(prop) {
        return function(lens) {
          return {
            get: function(s) {
              return lens.get(s)[prop];
            },
            set: function(ap) {
              return function(s) {
                var _a,
                  oa = lens.get(s);
                return ap === oa[prop]
                  ? s
                  : lens.set(
                      Object.assign({}, oa, (((_a = {})[prop] = ap), _a))
                    )(s);
              };
            }
          };
        };
      },
      lensProps = function() {
        for (var props = [], _i = 0; _i < arguments.length; _i++)
          props[_i] = arguments[_i];
        return function(lens) {
          return {
            get: function(s) {
              for (
                var a = lens.get(s), r = {}, _i = 0, props_1 = props;
                _i < props_1.length;
                _i++
              ) {
                var k = props_1[_i];
                r[k] = a[k];
              }
              return r;
            },
            set: function(a) {
              return function(s) {
                for (
                  var oa = lens.get(s), _i = 0, props_2 = props;
                  _i < props_2.length;
                  _i++
                ) {
                  var k = props_2[_i];
                  if (a[k] !== oa[k])
                    return lens.set(Object.assign({}, oa, a))(s);
                }
                return s;
              };
            }
          };
        };
      },
      lensComponent = function(prop) {
        return function(lens) {
          return {
            get: function(s) {
              return lens.get(s)[prop];
            },
            set: function(ap) {
              return function(s) {
                var oa = lens.get(s);
                if (ap === oa[prop]) return s;
                var copy = oa.slice();
                return (copy[prop] = ap), lens.set(copy)(s);
              };
            }
          };
        };
      },
      prismAsOptional = function(sa) {
        return {
          getOption: sa.getOption,
          set: function(a) {
            return prismSet(a)(sa);
          }
        };
      },
      prismAsTraversal = function(sa) {
        return {
          modifyF: function(F) {
            return function(f) {
              return function(s) {
                return pipeable_pipe(
                  sa.getOption(s),
                  fold(
                    function() {
                      return F.of(s);
                    },
                    function(a) {
                      return F.map(f(a), function(a) {
                        return prismSet(a)(sa)(s);
                      });
                    }
                  )
                );
              };
            };
          }
        };
      },
      prismModifyOption = function(f) {
        return function(sa) {
          return function(s) {
            return pipeable_pipe(
              sa.getOption(s),
              Option_map(function(o) {
                var n = f(o);
                return n === o ? s : sa.reverseGet(n);
              })
            );
          };
        };
      },
      prismModify = function(f) {
        return function(sa) {
          var g = prismModifyOption(f)(sa);
          return function(s) {
            return pipeable_pipe(
              g(s),
              getOrElse(function() {
                return s;
              })
            );
          };
        };
      },
      prismSet = function(a) {
        return prismModify(function() {
          return a;
        });
      },
      prismComposeLens = function(ab) {
        return function(sa) {
          return optionalComposeOptional(lensAsOptional(ab))(
            prismAsOptional(sa)
          );
        };
      },
      prismFromNullable = function() {
        return { getOption: fromNullable, reverseGet: identity };
      };
    function prismFromPredicate(predicate) {
      return {
        getOption: Option_fromPredicate(predicate),
        reverseGet: identity
      };
    }
    var prismSome = function() {
        return { getOption: identity, reverseGet: some };
      },
      prismRight = function() {
        return { getOption: Option_fromEither, reverseGet: right };
      },
      prismLeft = function() {
        return {
          getOption: function(s) {
            return isLeft(s) ? some(s.left) : none;
          },
          reverseGet: left
        };
      },
      optionalAsTraversal = function(sa) {
        return {
          modifyF: function(F) {
            return function(f) {
              return function(s) {
                return pipeable_pipe(
                  sa.getOption(s),
                  fold(
                    function() {
                      return F.of(s);
                    },
                    function(a) {
                      return F.map(f(a), function(a) {
                        return sa.set(a)(s);
                      });
                    }
                  )
                );
              };
            };
          }
        };
      },
      optionalModifyOption = function(f) {
        return function(optional) {
          return function(s) {
            return pipeable_pipe(
              optional.getOption(s),
              Option_map(function(a) {
                var n = f(a);
                return n === a ? s : optional.set(n)(s);
              })
            );
          };
        };
      },
      optionalModify = function(f) {
        return function(optional) {
          var g = optionalModifyOption(f)(optional);
          return function(s) {
            return pipeable_pipe(
              g(s),
              getOrElse(function() {
                return s;
              })
            );
          };
        };
      },
      optionalComposeOptional = function(ab) {
        return function(sa) {
          return {
            getOption: flow(
              sa.getOption,
              ((f = ab.getOption),
              function(ma) {
                return chain_(ma, f);
              })
            ),
            set: function(b) {
              return optionalModify(ab.set(b))(sa);
            }
          };
          var f;
        };
      };
    function traversalComposeTraversal(ab) {
      return function(sa) {
        return {
          modifyF: function(F) {
            return function(f) {
              return sa.modifyF(F)(ab.modifyF(F)(f));
            };
          }
        };
      };
    }
    function fromTraversable(T) {
      return function() {
        return {
          modifyF: function(F) {
            var traverseF = T.traverse(F);
            return function(f) {
              return function(s) {
                return traverseF(s, f);
              };
            };
          }
        };
      };
    }
    var indexArray = function() {
      return {
        index: function(i) {
          return {
            getOption: function(as) {
              return Array_lookup(i, as);
            },
            set: function(a) {
              return function(as) {
                return pipeable_pipe(
                  Array_updateAt(i, a)(as),
                  getOrElse(function() {
                    return as;
                  })
                );
              };
            }
          };
        }
      };
    };
    function indexRecord() {
      return {
        index: function(k) {
          return {
            getOption: function(r) {
              return Record_lookup(k, r);
            },
            set: function(a) {
              return function(r) {
                return r[k] === a || isNone(Record_lookup(k, r))
                  ? r
                  : Record_insertAt(k, a)(r);
              };
            }
          };
        }
      };
    }
    function atRecord() {
      return {
        at: function(key) {
          return {
            get: function(r) {
              return Record_lookup(key, r);
            },
            set: fold(
              function() {
                return ReadonlyRecord_deleteAt(key);
              },
              function(a) {
                return Record_insertAt(key, a);
              }
            )
          };
        }
      };
    }
    var id = lensId,
      asTraversal = lensAsTraversal,
      composePrism = lensComposePrism;
    var Lens_prop = lensProp;
    composePrism(prismSome()),
      composePrism(prismRight()),
      composePrism(prismLeft());
    var Traversal_fromTraversable = fromTraversable,
      Traversal_compose = traversalComposeTraversal;
    var Traversal_prop = function(prop) {
        return Traversal_compose(
          pipeable_pipe(lensId(), lensProp(prop), lensAsTraversal)
        );
      },
      Traversal_some = Traversal_compose(prismAsTraversal(prismSome()));
    Traversal_compose(prismAsTraversal(prismRight())),
      Traversal_compose(prismAsTraversal(prismLeft()));
    var i,
      lib_x = pipe(
        id(),
        Lens_prop("items"),
        flow(
          asTraversal,
          traversalComposeTraversal(fromTraversable(Array_Traversable)())
        ),
        Traversal_prop("foo"),
        (function(T) {
          return Traversal_compose(Traversal_fromTraversable(T)());
        })(Record_Traversable),
        Traversal_prop("nested"),
        Traversal_some,
        ((i = 2),
        function(sa) {
          return pipeable_pipe(
            sa,
            Traversal_compose(optionalAsTraversal(indexArray().index(i)))
          );
        }),
        Traversal_prop("baz")
      );
  }
]);
