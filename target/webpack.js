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
    var monoidOrdering = {
      concat: function(x, y) {
        return 0 !== x ? x : y;
      },
      empty: 0
    };
    var compare = function(x, y) {
      return x < y ? -1 : x > y ? 1 : 0;
    };
    function strictEqual(a, b) {
      return a === b;
    }
    var ordNumber = { equals: strictEqual, compare: compare };
    function max(O) {
      return function(x, y) {
        return -1 === O.compare(x, y) ? y : x;
      };
    }
    function fromCompare(compare) {
      var optimizedCompare = function(x, y) {
        return x === y ? 0 : compare(x, y);
      };
      return {
        equals: function(x, y) {
          return 0 === optimizedCompare(x, y);
        },
        compare: optimizedCompare
      };
    }
    fromCompare(function() {
      return 0;
    });
    var ord_contramap = function(fa, f) {
      return fromCompare(function(x, y) {
        return fa.compare(f(x), f(y));
      });
    };
    ord_contramap(ordNumber, function(date) {
      return date.valueOf();
    });
    console.log(max);
  }
]);
