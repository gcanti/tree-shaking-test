"use strict";
function identity(a) {
  return a;
}
function constant(a) {
  return function() {
    return a;
  };
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
Object.defineProperty(exports, "__esModule", { value: !0 });
var isNone = function(fa) {
    return "None" === fa._tag;
  },
  none = { _tag: "None" },
  some = function(a) {
    return { _tag: "Some", value: a };
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
  },
  map = function(f) {
    return function(fa) {
      return (function(fa, f) {
        return isNone(fa) ? none : some(f(fa.value));
      })(fa, f);
    };
  };
function isOutOfBound(i, as) {
  return i < 0 || i >= as.length;
}
function snoc(init, end) {
  for (var len = init.length, r = Array(len + 1), i = 0; i < len; i++)
    r[i] = init[i];
  return (r[len] = end), r;
}
var zero = function() {
    return empty;
  },
  reduce_ = function(fa, b, f) {
    return reduceWithIndex_(fa, b, function(_, b, a) {
      return f(b, a);
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
  traverseWithIndex_ = function(F) {
    return function(ta, f) {
      return reduceWithIndex_(ta, F.of(zero()), function(i, fbs, a) {
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
  Traversable = {
    URI: "ReadonlyArray",
    map: function(fa, f) {
      return fa.map(function(a) {
        return f(a);
      });
    },
    reduce: reduce_,
    foldMap: function(M) {
      var foldMapWithIndexM = foldMapWithIndex_(M);
      return function(fa, f) {
        return foldMapWithIndexM(fa, function(_, a) {
          return f(a);
        });
      };
    },
    reduceRight: function(fa, b, f) {
      return reduceRightWithIndex_(fa, b, function(_, a, b) {
        return f(a, b);
      });
    },
    traverse: function(F) {
      var traverseWithIndexF = traverseWithIndex_(F);
      return function(ta, f) {
        return traverseWithIndexF(ta, function(_, a) {
          return f(a);
        });
      };
    },
    sequence: function(F) {
      return function(ta) {
        return reduce_(ta, F.of(zero()), function(fas, fa) {
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
    }
  };
var empty = [];
function keys(r) {
  return Object.keys(r).sort();
}
var empty$1 = {};
var mapWithIndex_ = function(fa, f) {
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
  reduceWithIndex_$1 = function(fa, b, f) {
    for (var out = b, ks = keys(fa), len = ks.length, i = 0; i < len; i++) {
      var k = ks[i];
      out = f(k, out, fa[k]);
    }
    return out;
  },
  foldMapWithIndex_$1 = function(M) {
    return function(fa, f) {
      for (
        var out = M.empty, ks = keys(fa), len = ks.length, i = 0;
        i < len;
        i++
      ) {
        var k = ks[i];
        out = M.concat(out, f(k, fa[k]));
      }
      return out;
    };
  },
  reduceRightWithIndex_$1 = function(fa, b, f) {
    for (var out = b, ks = keys(fa), i = ks.length - 1; i >= 0; i--) {
      var k = ks[i];
      out = f(k, fa[k], out);
    }
    return out;
  },
  traverseWithIndex_$1 = function(F) {
    return function(ta, f) {
      var ks = keys(ta);
      if (0 === ks.length) return F.of(empty$1);
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
  },
  Traversable$1 = {
    URI: "ReadonlyRecord",
    map: function(fa, f) {
      return mapWithIndex_(fa, function(_, a) {
        return f(a);
      });
    },
    reduce: function(fa, b, f) {
      return reduceWithIndex_$1(fa, b, function(_, b, a) {
        return f(b, a);
      });
    },
    foldMap: function(M) {
      var foldMapWithIndexM = foldMapWithIndex_$1(M);
      return function(fa, f) {
        return foldMapWithIndexM(fa, function(_, a) {
          return f(a);
        });
      };
    },
    reduceRight: function(fa, b, f) {
      return reduceRightWithIndex_$1(fa, b, function(_, a, b) {
        return f(a, b);
      });
    },
    traverse: function(F) {
      var traverseWithIndexF = traverseWithIndex_$1(F);
      return function(ta, f) {
        return traverseWithIndexF(ta, function(_, a) {
          return f(a);
        });
      };
    },
    sequence: function(F) {
      return (function(F) {
        var traverseWithIndexF = traverseWithIndex_$1(F);
        return function(f) {
          return function(ta) {
            return traverseWithIndexF(ta, f);
          };
        };
      })(F)(function(_, a) {
        return a;
      });
    }
  },
  pipe$1 = pipe,
  lookup$1 = function lookup(i, as) {
    return void 0 === as
      ? function(as) {
          return lookup(i, as);
        }
      : isOutOfBound(i, as)
      ? none
      : some(as[i]);
  },
  updateAt$1 = function(i, a) {
    return function(as) {
      return isOutOfBound(i, as)
        ? none
        : some(
            (function(i, a, as) {
              if (as[i] === a) return as;
              var xs = as.slice();
              return (xs[i] = a), xs;
            })(i, a, as)
          );
    };
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
              : lens.set(Object.assign({}, oa, (((_a = {})[prop] = ap), _a)))(
                  s
                );
          };
        }
      };
    };
  },
  prismModify = function(f) {
    return function(sa) {
      var g = (function(f) {
        return function(sa) {
          return function(s) {
            return pipe$1(
              sa.getOption(s),
              map(function(o) {
                var n = f(o);
                return n === o ? s : sa.reverseGet(n);
              })
            );
          };
        };
      })(f)(sa);
      return function(s) {
        return pipe$1(
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
            return lookup$1(i, as);
          },
          set: function(a) {
            return function(as) {
              return pipe$1(
                updateAt$1(i, a)(as),
                getOrElse(function() {
                  return as;
                })
              );
            };
          }
        };
      }
    };
  },
  id = lensId,
  asTraversal = lensAsTraversal,
  prop = lensProp;
var sa,
  fromTraversable$1 = fromTraversable,
  compose = traversalComposeTraversal,
  prop$1 = function(prop) {
    return compose(pipe$1(lensId(), lensProp(prop), lensAsTraversal));
  },
  some$1 = compose(
    ((sa = { getOption: identity, reverseGet: some }),
    {
      modifyF: function(F) {
        return function(f) {
          return function(s) {
            return pipe$1(
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
    })
  );
var i,
  x = pipe(
    id(),
    prop("items"),
    (function(ab, bc, cd, de, ef, fg, gh, hi, ij) {
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
    })(asTraversal, traversalComposeTraversal(fromTraversable(Traversable)())),
    prop$1("foo"),
    (function(T) {
      return compose(fromTraversable$1(T)());
    })(Traversable$1),
    prop$1("nested"),
    some$1,
    ((i = 2),
    function(sa) {
      return pipe$1(
        sa,
        compose(
          (function(sa) {
            return {
              modifyF: function(F) {
                return function(f) {
                  return function(s) {
                    return pipe$1(
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
          })(indexArray().index(i))
        )
      );
    }),
    prop$1("baz")
  );
exports.x = x;
