"use strict";
var isLeft = function(ma) {
    return "Left" === ma._tag;
  },
  left = function(e) {
    return { _tag: "Left", left: e };
  },
  right = function(a) {
    return { _tag: "Right", right: a };
  },
  map = function(f) {
    return function(fa) {
      return (function(ma, f) {
        return isLeft(ma) ? ma : right(f(ma.right));
      })(fa, f);
    };
  },
  bimap = function(f, g) {
    return function(fa) {
      return (function(fea, f, g) {
        return isLeft(fea) ? left(f(fea.left)) : right(g(fea.right));
      })(fa, f, g);
    };
  },
  mapLeft = function(f) {
    return function(fa) {
      return (function(fea, f) {
        return isLeft(fea) ? left(f(fea.left)) : fea;
      })(fa, f);
    };
  },
  chain = function(f) {
    return function(ma) {
      return (function(ma, f) {
        return isLeft(ma) ? ma : f(ma.right);
      })(ma, f);
    };
  },
  pipe$1 = function(a, ab, bc, cd, de, ef, fg, gh, hi, ij) {
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
  },
  of = function(a) {
    return { _tag: "Of", value: a };
  },
  concat = function(left, right) {
    return { _tag: "Concat", left: left, right: right };
  };
function getSemigroup$1() {
  return { concat: concat };
}
var string = {
    is: function(u) {
      return "string" == typeof u;
    }
  },
  number = {
    is: function(u) {
      return "number" == typeof u && !isNaN(u);
    }
  },
  UnknownRecord = {
    is: function(u) {
      return "[object Object]" === Object.prototype.toString.call(u);
    }
  };
function compose(M) {
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
var traverseRecordWithIndex = function(M) {
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
  SE = getSemigroup$1(),
  M = {
    URI: "Either",
    _E: void 0,
    map: function(fa, f) {
      return pipe$1(fa, map(f));
    },
    ap: function(fab, fa) {
      return isLeft(fab)
        ? isLeft(fa)
          ? left(SE.concat(fab.left, fa.left))
          : fab
        : isLeft(fa)
        ? fa
        : right(fab.right(fa.right));
    },
    of: right,
    chain: function(ma, f) {
      return pipe$1(ma, chain(f));
    },
    throwError: left,
    bimap: function(fa, f, g) {
      return pipe$1(fa, bimap(f, g));
    },
    mapLeft: function(fa, f) {
      return pipe$1(fa, mapLeft(f));
    },
    alt: function(me, that) {
      if ("Right" === me._tag) return me;
      var ea = that();
      return isLeft(ea) ? left(SE.concat(me.left, ea.left)) : ea;
    }
  },
  fromRefinement$1 = function(refinement, expected) {
    return (function(M) {
      return function(refinement, onError) {
        return {
          decode: function(i) {
            return refinement(i) ? M.of(i) : M.throwError(onError(i));
          }
        };
      };
    })(M)(refinement, function(u) {
      return of(
        (function(actual, error) {
          return { _tag: "Leaf", actual: actual, error: error };
        })(u, expected)
      );
    });
  },
  fromGuard = function(guard, expected) {
    return fromRefinement$1(guard.is, expected);
  },
  string$1 = fromGuard(string, "string"),
  number$1 = fromGuard(number, "number"),
  fromType$1 = function(properties) {
    return (function(M) {
      var traverse = traverseRecordWithIndex(M);
      return function(onPropertyError) {
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
      };
    })(M)(function(k, e) {
      return of(
        (function(key, kind, errors) {
          return { _tag: "Key", key: key, kind: kind, errors: errors };
        })(k, "required", e)
      );
    })(properties);
  },
  Person = pipe$1(
    fromGuard(UnknownRecord, "Record<string, unknown>"),
    compose(M)(fromType$1({ name: string$1, age: number$1 }))
  );
console.log(Person.decode({}));
