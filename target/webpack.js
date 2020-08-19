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
    var Guard_namespaceObject = {};
    __webpack_require__.r(Guard_namespaceObject),
      __webpack_require__.d(Guard_namespaceObject, "literal", function() {
        return literal;
      }),
      __webpack_require__.d(Guard_namespaceObject, "string", function() {
        return string;
      }),
      __webpack_require__.d(Guard_namespaceObject, "number", function() {
        return number;
      }),
      __webpack_require__.d(Guard_namespaceObject, "boolean", function() {
        return Guard_boolean;
      }),
      __webpack_require__.d(Guard_namespaceObject, "UnknownArray", function() {
        return UnknownArray;
      }),
      __webpack_require__.d(Guard_namespaceObject, "UnknownRecord", function() {
        return UnknownRecord;
      }),
      __webpack_require__.d(Guard_namespaceObject, "refine", function() {
        return refine;
      }),
      __webpack_require__.d(Guard_namespaceObject, "nullable", function() {
        return nullable;
      }),
      __webpack_require__.d(Guard_namespaceObject, "type", function() {
        return type;
      }),
      __webpack_require__.d(Guard_namespaceObject, "partial", function() {
        return partial;
      }),
      __webpack_require__.d(Guard_namespaceObject, "array", function() {
        return array;
      }),
      __webpack_require__.d(Guard_namespaceObject, "record", function() {
        return record;
      }),
      __webpack_require__.d(Guard_namespaceObject, "tuple", function() {
        return Guard_tuple;
      }),
      __webpack_require__.d(Guard_namespaceObject, "intersect", function() {
        return intersect;
      }),
      __webpack_require__.d(Guard_namespaceObject, "union", function() {
        return union;
      }),
      __webpack_require__.d(Guard_namespaceObject, "sum", function() {
        return sum;
      }),
      __webpack_require__.d(Guard_namespaceObject, "lazy", function() {
        return Guard_lazy;
      }),
      __webpack_require__.d(Guard_namespaceObject, "alt", function() {
        return Guard_alt;
      }),
      __webpack_require__.d(Guard_namespaceObject, "zero", function() {
        return zero;
      }),
      __webpack_require__.d(Guard_namespaceObject, "compose", function() {
        return Guard_compose;
      }),
      __webpack_require__.d(Guard_namespaceObject, "id", function() {
        return Guard_id;
      }),
      __webpack_require__.d(Guard_namespaceObject, "URI", function() {
        return Guard_URI;
      }),
      __webpack_require__.d(Guard_namespaceObject, "Schemable", function() {
        return Schemable;
      }),
      __webpack_require__.d(
        Guard_namespaceObject,
        "WithUnknownContainers",
        function() {
          return WithUnknownContainers;
        }
      ),
      __webpack_require__.d(Guard_namespaceObject, "WithUnion", function() {
        return WithUnion;
      }),
      __webpack_require__.d(Guard_namespaceObject, "WithRefine", function() {
        return WithRefine;
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
    var isLeft = function(ma) {
        return "Left" === ma._tag;
      },
      isRight = function(ma) {
        return "Right" === ma._tag;
      },
      Either_left = function(e) {
        return { _tag: "Left", left: e };
      },
      Either_right = function(a) {
        return { _tag: "Right", right: a };
      };
    var map_ = function(ma, f) {
        return isLeft(ma) ? ma : Either_right(f(ma.right));
      },
      chain_ = function(ma, f) {
        return isLeft(ma) ? ma : f(ma.right);
      },
      bimap_ = function(fea, f, g) {
        return isLeft(fea)
          ? Either_left(f(fea.left))
          : Either_right(g(fea.right));
      },
      mapLeft_ = function(fea, f) {
        return isLeft(fea) ? Either_left(f(fea.left)) : fea;
      },
      Either_map = function(f) {
        return function(fa) {
          return map_(fa, f);
        };
      },
      chainW = function(f) {
        return function(ma) {
          return chain_(ma, f);
        };
      },
      Either_chain = chainW,
      URI = "Either";
    var pipeable_pipe = pipe;
    var FreeSemigroup_of = function(a) {
        return { _tag: "Of", value: a };
      },
      concat = function(left, right) {
        return { _tag: "Concat", left: left, right: right };
      };
    var DecodeError_key = function(key, kind, errors) {
      return { _tag: "Key", key: key, kind: kind, errors: errors };
    };
    function DecodeError_getSemigroup() {
      return { concat: concat };
    }
    function memoize(f) {
      var cache = new Map();
      return function(a) {
        if (!cache.has(a)) {
          var b = f(a);
          return cache.set(a, b), b;
        }
        return cache.get(a);
      };
    }
    var literal = function() {
        for (var values = [], _i = 0; _i < arguments.length; _i++)
          values[_i] = arguments[_i];
        return {
          is: function(u) {
            return (
              -1 !==
              values.findIndex(function(a) {
                return a === u;
              })
            );
          }
        };
      },
      string = {
        is: function(u) {
          return "string" == typeof u;
        }
      },
      number = {
        is: function(u) {
          return "number" == typeof u && !isNaN(u);
        }
      },
      Guard_boolean = {
        is: function(u) {
          return "boolean" == typeof u;
        }
      },
      UnknownArray = { is: Array.isArray },
      UnknownRecord = {
        is: function(u) {
          return "[object Object]" === Object.prototype.toString.call(u);
        }
      },
      refine = function(refinement) {
        return function(from) {
          return {
            is: function(i) {
              return from.is(i) && refinement(i);
            }
          };
        };
      },
      nullable = function(or) {
        return {
          is: function(i) {
            return null === i || or.is(i);
          }
        };
      },
      type = function(properties) {
        return pipeable_pipe(
          UnknownRecord,
          refine(function(r) {
            for (var k in properties)
              if (!(k in r) || !properties[k].is(r[k])) return !1;
            return !0;
          })
        );
      },
      partial = function(properties) {
        return pipeable_pipe(
          UnknownRecord,
          refine(function(r) {
            for (var k in properties) {
              var v = r[k];
              if (void 0 !== v && !properties[k].is(v)) return !1;
            }
            return !0;
          })
        );
      },
      array = function(item) {
        return pipeable_pipe(
          UnknownArray,
          refine(function(us) {
            return us.every(item.is);
          })
        );
      },
      record = function(codomain) {
        return pipeable_pipe(
          UnknownRecord,
          refine(function(r) {
            for (var k in r) if (!codomain.is(r[k])) return !1;
            return !0;
          })
        );
      },
      Guard_tuple = function() {
        for (var components = [], _i = 0; _i < arguments.length; _i++)
          components[_i] = arguments[_i];
        return {
          is: function(u) {
            return (
              Array.isArray(u) &&
              u.length === components.length &&
              components.every(function(c, i) {
                return c.is(u[i]);
              })
            );
          }
        };
      },
      intersect = function(right) {
        return function(left) {
          return {
            is: function(u) {
              return left.is(u) && right.is(u);
            }
          };
        };
      },
      union = function() {
        for (var members = [], _i = 0; _i < arguments.length; _i++)
          members[_i] = arguments[_i];
        return {
          is: function(u) {
            return members.some(function(m) {
              return m.is(u);
            });
          }
        };
      },
      sum = function(tag) {
        return function(members) {
          return pipeable_pipe(
            UnknownRecord,
            refine(function(r) {
              var v = r[tag];
              return v in members && members[v].is(r);
            })
          );
        };
      },
      Guard_lazy = function(f) {
        var get = memoize(f);
        return {
          is: function(u) {
            return get().is(u);
          }
        };
      },
      Guard_alt = function(that) {
        return function(me) {
          return {
            is: function(i) {
              return me.is(i) || that().is(i);
            }
          };
        };
      },
      zero = function() {
        return {
          is: function(_) {
            return !1;
          }
        };
      },
      Guard_compose = function(to) {
        return function(from) {
          return {
            is: function(i) {
              return from.is(i) && to.is(i);
            }
          };
        };
      },
      Guard_id = function() {
        return {
          is: function(_) {
            return !0;
          }
        };
      },
      Guard_URI = "io-ts/Guard",
      Schemable = {
        URI: Guard_URI,
        literal: literal,
        string: string,
        number: number,
        boolean: Guard_boolean,
        nullable: nullable,
        type: type,
        partial: partial,
        record: record,
        array: array,
        tuple: Guard_tuple,
        intersect: intersect,
        sum: sum,
        lazy: function(_, f) {
          return Guard_lazy(f);
        }
      },
      WithUnknownContainers = {
        UnknownArray: UnknownArray,
        UnknownRecord: UnknownRecord
      },
      WithUnion = { union: union },
      WithRefine = { refine: refine };
    function fromRefinement(M) {
      return function(refinement, onError) {
        return {
          decode: function(i) {
            return refinement(i) ? M.of(i) : M.throwError(onError(i));
          }
        };
      };
    }
    function Kleisli_compose(M) {
      return function(ab) {
        return function(ia) {
          return {
            decode: function(i) {
              return M.chain(ia.decode(i), ab.decode);
            }
          };
        };
      };
    }
    var patterns,
      onOf,
      onConcat,
      traverseRecordWithIndex = function(M) {
        return function(r, f) {
          var ks = Object.keys(r);
          if (0 === ks.length) return M.of({});
          for (
            var fr = M.of({}),
              _loop_2 = function(key) {
                fr = M.ap(
                  M.map(fr, function(r) {
                    return function(b) {
                      return (r[key] = b), r;
                    };
                  }),
                  f(key, r[key])
                );
              },
              _i = 0,
              ks_1 = ks;
            _i < ks_1.length;
            _i++
          ) {
            _loop_2(ks_1[_i]);
          }
          return fr;
        };
      },
      SE = DecodeError_getSemigroup(),
      Decoder_M = {
        URI: URI,
        _E: void 0,
        map: function(fa, f) {
          return pipeable_pipe(fa, Either_map(f));
        },
        ap: function(fab, fa) {
          return isLeft(fab)
            ? isLeft(fa)
              ? Either_left(SE.concat(fab.left, fa.left))
              : fab
            : isLeft(fa)
            ? fa
            : Either_right(fab.right(fa.right));
        },
        of: Either_right,
        chain: function(ma, f) {
          return pipeable_pipe(ma, Either_chain(f));
        },
        throwError: Either_left,
        bimap: function(fa, f, g) {
          return pipeable_pipe(
            fa,
            (function(f, g) {
              return function(fa) {
                return bimap_(fa, f, g);
              };
            })(f, g)
          );
        },
        mapLeft: function(fa, f) {
          return pipeable_pipe(
            fa,
            (function(f) {
              return function(fa) {
                return mapLeft_(fa, f);
              };
            })(f)
          );
        },
        alt: function(me, that) {
          if (isRight(me)) return me;
          var ea = that();
          return isLeft(ea) ? Either_left(SE.concat(me.left, ea.left)) : ea;
        }
      },
      error = function(actual, message) {
        return FreeSemigroup_of(
          (function(actual, error) {
            return { _tag: "Leaf", actual: actual, error: error };
          })(actual, message)
        );
      },
      fromGuard = function(guard, expected) {
        return (function(refinement, expected) {
          return fromRefinement(Decoder_M)(refinement, function(u) {
            return error(u, expected);
          });
        })(guard.is, expected);
      },
      Decoder_string = fromGuard(string, "string"),
      Decoder_number = fromGuard(number, "number"),
      Decoder_UnknownRecord = fromGuard(
        UnknownRecord,
        "Record<string, unknown>"
      ),
      Decoder_fromType = function(properties) {
        return ((traverse = traverseRecordWithIndex((M = Decoder_M))),
        function(onPropertyError) {
          return function(properties) {
            return {
              decode: function(i) {
                return traverse(properties, function(key, decoder) {
                  return M.mapLeft(decoder.decode(i[key]), function(e) {
                    return onPropertyError(key, e);
                  });
                });
              }
            };
          };
        })(function(k, e) {
          return FreeSemigroup_of(DecodeError_key(k, "required", e));
        })(properties);
        var M, traverse;
      },
      Decoder_type = function(properties) {
        return pipeable_pipe(
          Decoder_UnknownRecord,
          Decoder_compose(Decoder_fromType(properties))
        );
      },
      Decoder_compose = Kleisli_compose(Decoder_M),
      empty = [],
      make = function(value, forest) {
        return (
          void 0 === forest && (forest = empty),
          { value: value, forest: forest }
        );
      },
      toTree =
        ((patterns = {
          Leaf: function(input, error) {
            return make(
              "cannot decode " + JSON.stringify(input) + ", should be " + error
            );
          },
          Key: function(key, kind, errors) {
            return make(
              kind + " property " + JSON.stringify(key),
              toForest(errors)
            );
          },
          Index: function(index, kind, errors) {
            return make(kind + " index " + index, toForest(errors));
          },
          Member: function(index, errors) {
            return make("member " + index, toForest(errors));
          },
          Lazy: function(id, errors) {
            return make("lazy type " + id, toForest(errors));
          },
          Wrap: function(error, errors) {
            return make(error, toForest(errors));
          }
        }),
        function(e) {
          switch (e._tag) {
            case "Leaf":
              return patterns.Leaf(e.actual, e.error);
            case "Key":
              return patterns.Key(e.key, e.kind, e.errors);
            case "Index":
              return patterns.Index(e.index, e.kind, e.errors);
            case "Member":
              return patterns.Member(e.index, e.errors);
            case "Lazy":
              return patterns.Lazy(e.id, e.errors);
            case "Wrap":
              return patterns.Wrap(e.error, e.errors);
          }
        }),
      toForest =
        ((onOf = function(value) {
          return [toTree(value)];
        }),
        (onConcat = function(left, right) {
          return toForest(left).concat(toForest(right));
        }),
        function(f) {
          switch (f._tag) {
            case "Of":
              return onOf(f.value);
            case "Concat":
              return onConcat(f.left, f.right);
          }
        }),
      Person = Decoder_type({ name: Decoder_string, age: Decoder_number });
    console.log(Person.decode({}));
  }
]);
