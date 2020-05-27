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
    function Either_left(e) {
      return { _tag: "Left", left: e };
    }
    function Either_right(a) {
      return { _tag: "Right", right: a };
    }
    function fold(onLeft, onRight) {
      return function(ma) {
        return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
      };
    }
    function isLeft(ma) {
      switch (ma._tag) {
        case "Left":
          return !0;
        case "Right":
          return !1;
      }
    }
    function swap(ma) {
      return isLeft(ma) ? Either_right(ma.left) : Either_left(ma.right);
    }
    var either = {
      URI: "Either",
      map: function(ma, f) {
        return isLeft(ma) ? ma : Either_right(f(ma.right));
      },
      of: Either_right,
      ap: function(mab, ma) {
        return isLeft(mab)
          ? mab
          : isLeft(ma)
          ? ma
          : Either_right(mab.right(ma.right));
      },
      chain: function(ma, f) {
        return isLeft(ma) ? ma : f(ma.right);
      },
      reduce: function(fa, b, f) {
        return isLeft(fa) ? b : f(b, fa.right);
      },
      foldMap: function(M) {
        return function(fa, f) {
          return isLeft(fa) ? M.empty : f(fa.right);
        };
      },
      reduceRight: function(fa, b, f) {
        return isLeft(fa) ? b : f(fa.right, b);
      },
      traverse: function(F) {
        return function(ma, f) {
          return isLeft(ma)
            ? F.of(Either_left(ma.left))
            : F.map(f(ma.right), Either_right);
        };
      },
      sequence: function(F) {
        return function(ma) {
          return isLeft(ma)
            ? F.of(Either_left(ma.left))
            : F.map(ma.right, Either_right);
        };
      },
      bimap: function(fea, f, g) {
        return isLeft(fea)
          ? Either_left(f(fea.left))
          : Either_right(g(fea.right));
      },
      mapLeft: function(fea, f) {
        return isLeft(fea) ? Either_left(f(fea.left)) : fea;
      },
      alt: function(fx, fy) {
        return isLeft(fx) ? fy() : fx;
      },
      extend: function(wa, f) {
        return isLeft(wa) ? wa : Either_right(f(wa));
      },
      chainRec: function(a, f) {
        return (function(a, f) {
          for (var v = f(a); "Left" === v._tag; ) v = f(v.left);
          return v.right;
        })(f(a), function(e) {
          return isLeft(e)
            ? Either_right(Either_left(e.left))
            : isLeft(e.right)
            ? Either_left(f(e.right.left))
            : Either_right(Either_right(e.right.right));
        });
      },
      throwError: Either_left
    };
    function getFunctorComposition(F, G) {
      return {
        map: function(fa, f) {
          return F.map(fa, function(ga) {
            return G.map(ga, f);
          });
        }
      };
    }
    var Applicative_assign = function() {
      return (Applicative_assign =
        Object.assign ||
        function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++)
            for (var p in (s = arguments[i]))
              Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
          return t;
        }).apply(this, arguments);
    };
    function getApplicativeComposition(F, G) {
      return Applicative_assign(
        Applicative_assign({}, getFunctorComposition(F, G)),
        {
          of: function(a) {
            return F.of(G.of(a));
          },
          ap: function(fgab, fga) {
            return F.ap(
              F.map(fgab, function(h) {
                return function(ga) {
                  return G.ap(h, ga);
                };
              }),
              fga
            );
          }
        }
      );
    }
    var EitherT_assign = function() {
      return (EitherT_assign =
        Object.assign ||
        function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++)
            for (var p in (s = arguments[i]))
              Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
          return t;
        }).apply(this, arguments);
    };
    function getEitherM(M) {
      var A = getApplicativeComposition(M, either);
      return EitherT_assign(EitherT_assign({}, A), {
        chain: function(ma, f) {
          return M.chain(ma, function(e) {
            return isLeft(e) ? M.of(Either_left(e.left)) : f(e.right);
          });
        },
        alt: function(fx, f) {
          return M.chain(fx, function(e) {
            return isLeft(e) ? f() : A.of(e.right);
          });
        },
        bimap: function(ma, f, g) {
          return M.map(ma, function(e) {
            return either.bimap(e, f, g);
          });
        },
        mapLeft: function(ma, f) {
          return M.map(ma, function(e) {
            return either.mapLeft(e, f);
          });
        },
        fold: function(ma, onLeft, onRight) {
          return M.chain(ma, fold(onLeft, onRight));
        },
        getOrElse: function(ma, onLeft) {
          return M.chain(ma, fold(onLeft, M.of));
        },
        orElse: function(ma, f) {
          return M.chain(
            ma,
            fold(f, function(a) {
              return A.of(a);
            })
          );
        },
        swap: function(ma) {
          return M.map(ma, swap);
        },
        rightM: function(ma) {
          return M.map(ma, Either_right);
        },
        leftM: function(ml) {
          return M.map(ml, Either_left);
        },
        left: function(e) {
          return M.of(Either_left(e));
        }
      });
    }
    function fromIO(ma) {
      return function() {
        return Promise.resolve(ma());
      };
    }
    var task = {
      URI: "Task",
      map: function(ma, f) {
        return function() {
          return ma().then(f);
        };
      },
      of: function(a) {
        return function() {
          return Promise.resolve(a);
        };
      },
      ap: function(mab, ma) {
        return function() {
          return Promise.all([mab(), ma()]).then(function(_a) {
            return (0, _a[0])(_a[1]);
          });
        };
      },
      chain: function(ma, f) {
        return function() {
          return ma().then(function(a) {
            return f(a)();
          });
        };
      },
      fromIO: fromIO,
      fromTask: identity
    };
    task.map, task.of, task.chain, task.fromIO, task.fromTask;
    var TaskEither_assign = function() {
        return (TaskEither_assign =
          Object.assign ||
          function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++)
              for (var p in (s = arguments[i]))
                Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
            return t;
          }).apply(this, arguments);
      },
      TaskEither_T = getEitherM(task),
      TaskEither_left = TaskEither_T.left,
      TaskEither_right = TaskEither_T.of;
    var rightTask = TaskEither_T.rightM;
    TaskEither_T.leftM, task.fromIO;
    TaskEither_T.swap;
    var taskEither = {
        URI: "TaskEither",
        bimap: TaskEither_T.bimap,
        mapLeft: TaskEither_T.mapLeft,
        map: TaskEither_T.map,
        of: TaskEither_T.of,
        ap: TaskEither_T.ap,
        chain: TaskEither_T.chain,
        alt: TaskEither_T.alt,
        fromIO: function(ma) {
          return rightTask(task.fromIO(ma));
        },
        fromTask: rightTask,
        throwError: TaskEither_left
      },
      TaskEither_pipeables =
        (TaskEither_assign(TaskEither_assign({}, taskEither), {
          ap: function(mab, ma) {
            return TaskEither_T.chain(mab, function(f) {
              return TaskEither_T.map(ma, f);
            });
          }
        }),
        pipeable(taskEither)),
      TaskEither_chain = (function() {
        return TaskEither_pipeables.chain;
      })(),
      TaskEither_map = (function() {
        return TaskEither_pipeables.map;
      })();
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
      TaskEither_right(1),
      TaskEither_map(function(n) {
        return n + 1;
      }),
      TaskEither_chain(function(n) {
        return TaskEither_right(n + 1);
      })
    );
  }
]);
