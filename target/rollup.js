"use strict";
var extendStatics,
  isLeft = function (ma) {
    return "Left" === ma._tag;
  },
  isRight = function (ma) {
    return "Right" === ma._tag;
  },
  __extends =
    ((extendStatics = function (d, b) {
      return (
        (extendStatics =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (d, b) {
              d.__proto__ = b;
            }) ||
          function (d, b) {
            for (var p in b)
              Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
          }),
        extendStatics(d, b)
      );
    }),
    function (d, b) {
      if ("function" != typeof b && null !== b)
        throw new TypeError(
          "Class extends value " + String(b) + " is not a constructor or null"
        );
      function __() {
        this.constructor = d;
      }
      extendStatics(d, b),
        (d.prototype =
          null === b
            ? Object.create(b)
            : ((__.prototype = b.prototype), new __()));
    }),
  __assign = function () {
    return (
      (__assign =
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++)
            for (var p in (s = arguments[i]))
              Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
          return t;
        }),
      __assign.apply(this, arguments)
    );
  },
  failures = function (e) {
    return { _tag: "Left", left: e };
  },
  failure = function (value, context, message) {
    return failures([{ value: value, context: context, message: message }]);
  },
  success = function (a) {
    return { _tag: "Right", right: a };
  },
  Type = (function () {
    function Type(name, is, validate, encode) {
      (this.name = name),
        (this.is = is),
        (this.validate = validate),
        (this.encode = encode),
        (this.decode = this.decode.bind(this));
    }
    return (
      (Type.prototype.pipe = function (ab, name) {
        var _this = this;
        return (
          void 0 === name &&
            (name = "pipe(".concat(this.name, ", ").concat(ab.name, ")")),
          new Type(
            name,
            ab.is,
            function (i, c) {
              var e = _this.validate(i, c);
              return isLeft(e) ? e : ab.validate(e.right, c);
            },
            this.encode === identity && ab.encode === identity
              ? identity
              : function (b) {
                  return _this.encode(ab.encode(b));
                }
          )
        );
      }),
      (Type.prototype.asDecoder = function () {
        return this;
      }),
      (Type.prototype.asEncoder = function () {
        return this;
      }),
      (Type.prototype.decode = function (i) {
        return this.validate(i, [{ key: "", type: this, actual: i }]);
      }),
      Type
    );
  })(),
  identity = function (a) {
    return a;
  };
function appendContext(c, key, decoder, actual) {
  for (var len = c.length, r = Array(len + 1), i = 0; i < len; i++) r[i] = c[i];
  return (r[len] = { key: key, type: decoder, actual: actual }), r;
}
function pushAll(xs, ys) {
  for (var l = ys.length, i = 0; i < l; i++) xs.push(ys[i]);
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function getInterfaceTypeName(props) {
  return "{ ".concat(
    (function (props) {
      return Object.keys(props)
        .map(function (k) {
          return "".concat(k, ": ").concat(props[k].name);
        })
        .join(", ");
    })(props),
    " }"
  );
}
new ((function (_super) {
  function NullType() {
    var _this =
      _super.call(
        this,
        "null",
        function (u) {
          return null === u;
        },
        function (u, c) {
          return _this.is(u) ? success(u) : failure(u, c);
        },
        identity
      ) || this;
    return (_this._tag = "NullType"), _this;
  }
  return __extends(NullType, _super), NullType;
})(Type))();
var undefinedType = new ((function (_super) {
  function UndefinedType() {
    var _this =
      _super.call(
        this,
        "undefined",
        function (u) {
          return void 0 === u;
        },
        function (u, c) {
          return _this.is(u) ? success(u) : failure(u, c);
        },
        identity
      ) || this;
    return (_this._tag = "UndefinedType"), _this;
  }
  return __extends(UndefinedType, _super), UndefinedType;
})(Type))();
new ((function (_super) {
  function VoidType() {
    var _this =
      _super.call(
        this,
        "void",
        undefinedType.is,
        undefinedType.validate,
        identity
      ) || this;
    return (_this._tag = "VoidType"), _this;
  }
  return __extends(VoidType, _super), VoidType;
})(Type))(),
  new ((function (_super) {
    function UnknownType() {
      var _this =
        _super.call(
          this,
          "unknown",
          function (_) {
            return !0;
          },
          success,
          identity
        ) || this;
      return (_this._tag = "UnknownType"), _this;
    }
    return __extends(UnknownType, _super), UnknownType;
  })(Type))();
var string = new ((function (_super) {
    function StringType() {
      var _this =
        _super.call(
          this,
          "string",
          function (u) {
            return "string" == typeof u;
          },
          function (u, c) {
            return _this.is(u) ? success(u) : failure(u, c);
          },
          identity
        ) || this;
      return (_this._tag = "StringType"), _this;
    }
    return __extends(StringType, _super), StringType;
  })(Type))(),
  number = new ((function (_super) {
    function NumberType() {
      var _this =
        _super.call(
          this,
          "number",
          function (u) {
            return "number" == typeof u;
          },
          function (u, c) {
            return _this.is(u) ? success(u) : failure(u, c);
          },
          identity
        ) || this;
      return (_this._tag = "NumberType"), _this;
    }
    return __extends(NumberType, _super), NumberType;
  })(Type))();
new ((function (_super) {
  function BigIntType() {
    var _this =
      _super.call(
        this,
        "bigint",
        function (u) {
          return "bigint" == typeof u;
        },
        function (u, c) {
          return _this.is(u) ? success(u) : failure(u, c);
        },
        identity
      ) || this;
    return (_this._tag = "BigIntType"), _this;
  }
  return __extends(BigIntType, _super), BigIntType;
})(Type))(),
  new ((function (_super) {
    function BooleanType() {
      var _this =
        _super.call(
          this,
          "boolean",
          function (u) {
            return "boolean" == typeof u;
          },
          function (u, c) {
            return _this.is(u) ? success(u) : failure(u, c);
          },
          identity
        ) || this;
      return (_this._tag = "BooleanType"), _this;
    }
    return __extends(BooleanType, _super), BooleanType;
  })(Type))(),
  new ((function (_super) {
    function AnyArrayType() {
      var _this =
        _super.call(
          this,
          "UnknownArray",
          Array.isArray,
          function (u, c) {
            return _this.is(u) ? success(u) : failure(u, c);
          },
          identity
        ) || this;
      return (_this._tag = "AnyArrayType"), _this;
    }
    return __extends(AnyArrayType, _super), AnyArrayType;
  })(Type))();
var UnknownRecord = new ((function (_super) {
  function AnyDictionaryType() {
    var _this =
      _super.call(
        this,
        "UnknownRecord",
        function (u) {
          return null !== u && "object" == typeof u && !Array.isArray(u);
        },
        function (u, c) {
          return _this.is(u) ? success(u) : failure(u, c);
        },
        identity
      ) || this;
    return (_this._tag = "AnyDictionaryType"), _this;
  }
  return __extends(AnyDictionaryType, _super), AnyDictionaryType;
})(Type))();
!(function (_super) {
  function LiteralType(name, is, validate, encode, value) {
    var _this = _super.call(this, name, is, validate, encode) || this;
    return (_this.value = value), (_this._tag = "LiteralType"), _this;
  }
  __extends(LiteralType, _super);
})(Type),
  (function (_super) {
    function KeyofType(name, is, validate, encode, keys) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      return (_this.keys = keys), (_this._tag = "KeyofType"), _this;
    }
    __extends(KeyofType, _super);
  })(Type);
var RefinementType = (function (_super) {
  function RefinementType(name, is, validate, encode, type, predicate) {
    var _this = _super.call(this, name, is, validate, encode) || this;
    return (
      (_this.type = type),
      (_this.predicate = predicate),
      (_this._tag = "RefinementType"),
      _this
    );
  }
  return __extends(RefinementType, _super), RefinementType;
})(Type);
refinement(
  number,
  function (n) {
    return Number.isInteger(n);
  },
  "Int"
);
var RecursiveType = (function (_super) {
  function RecursiveType(name, is, validate, encode, runDefinition) {
    var _this = _super.call(this, name, is, validate, encode) || this;
    return (
      (_this.runDefinition = runDefinition),
      (_this._tag = "RecursiveType"),
      _this
    );
  }
  return __extends(RecursiveType, _super), RecursiveType;
})(Type);
Object.defineProperty(RecursiveType.prototype, "type", {
  get: function () {
    return this.runDefinition();
  },
  enumerable: !0,
  configurable: !0,
}),
  (function (_super) {
    function ArrayType(name, is, validate, encode, type) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      return (_this.type = type), (_this._tag = "ArrayType"), _this;
    }
    __extends(ArrayType, _super);
  })(Type);
var InterfaceType = (function (_super) {
  function InterfaceType(name, is, validate, encode, props) {
    var _this = _super.call(this, name, is, validate, encode) || this;
    return (_this.props = props), (_this._tag = "InterfaceType"), _this;
  }
  return __extends(InterfaceType, _super), InterfaceType;
})(Type);
!(function (_super) {
  function PartialType(name, is, validate, encode, props) {
    var _this = _super.call(this, name, is, validate, encode) || this;
    return (_this.props = props), (_this._tag = "PartialType"), _this;
  }
  __extends(PartialType, _super);
})(Type),
  (function (_super) {
    function DictionaryType(name, is, validate, encode, domain, codomain) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      return (
        (_this.domain = domain),
        (_this.codomain = codomain),
        (_this._tag = "DictionaryType"),
        _this
      );
    }
    __extends(DictionaryType, _super);
  })(Type);
var UnionType = (function (_super) {
  function UnionType(name, is, validate, encode, types) {
    var _this = _super.call(this, name, is, validate, encode) || this;
    return (_this.types = types), (_this._tag = "UnionType"), _this;
  }
  return __extends(UnionType, _super), UnionType;
})(Type);
function refinement(codec, predicate, name) {
  var f;
  return (
    void 0 === name &&
      (name = "("
        .concat(codec.name, " | ")
        .concat(
          (f = predicate).displayName ||
            f.name ||
            "<function".concat(f.length, ">"),
          ")"
        )),
    new RefinementType(
      name,
      function (u) {
        return codec.is(u) && predicate(u);
      },
      function (i, c) {
        var e = codec.validate(i, c);
        if (isLeft(e)) return e;
        var a = e.right;
        return predicate(a) ? success(a) : failure(a, c);
      },
      codec.encode,
      codec,
      predicate
    )
  );
}
!(function (_super) {
  function IntersectionType(name, is, validate, encode, types) {
    var _this = _super.call(this, name, is, validate, encode) || this;
    return (_this.types = types), (_this._tag = "IntersectionType"), _this;
  }
  __extends(IntersectionType, _super);
})(Type),
  (function (_super) {
    function TupleType(name, is, validate, encode, types) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      return (_this.types = types), (_this._tag = "TupleType"), _this;
    }
    __extends(TupleType, _super);
  })(Type),
  (function (_super) {
    function ReadonlyType(name, is, validate, encode, type) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      return (_this.type = type), (_this._tag = "ReadonlyType"), _this;
    }
    __extends(ReadonlyType, _super);
  })(Type),
  (function (_super) {
    function ReadonlyArrayType(name, is, validate, encode, type) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      return (_this.type = type), (_this._tag = "ReadonlyArrayType"), _this;
    }
    __extends(ReadonlyArrayType, _super);
  })(Type),
  (function (_super) {
    function ExactType(name, is, validate, encode, type) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      return (_this.type = type), (_this._tag = "ExactType"), _this;
    }
    __extends(ExactType, _super);
  })(Type),
  new ((function (_super) {
    function FunctionType() {
      var _this =
        _super.call(
          this,
          "Function",
          function (u) {
            return "function" == typeof u;
          },
          function (u, c) {
            return _this.is(u) ? success(u) : failure(u, c);
          },
          identity
        ) || this;
      return (_this._tag = "FunctionType"), _this;
    }
    return __extends(FunctionType, _super), FunctionType;
  })(Type))(),
  new ((function (_super) {
    function NeverType() {
      var _this =
        _super.call(
          this,
          "never",
          function (_) {
            return !1;
          },
          function (u, c) {
            return failure(u, c);
          },
          function () {
            throw new Error("cannot encode never");
          }
        ) || this;
      return (_this._tag = "NeverType"), _this;
    }
    return __extends(NeverType, _super), NeverType;
  })(Type))(),
  new ((function (_super) {
    function AnyType() {
      var _this =
        _super.call(
          this,
          "any",
          function (_) {
            return !0;
          },
          success,
          identity
        ) || this;
      return (_this._tag = "AnyType"), _this;
    }
    return __extends(AnyType, _super), AnyType;
  })(Type))(),
  refinement(number, Number.isInteger, "Integer"),
  (function (_super) {
    function TaggedUnionType(name, is, validate, encode, codecs, tag) {
      var _this = _super.call(this, name, is, validate, encode, codecs) || this;
      return (_this.tag = tag), _this;
    }
    __extends(TaggedUnionType, _super);
  })(UnionType),
  new ((function (_super) {
    function ObjectType() {
      var _this =
        _super.call(
          this,
          "object",
          function (u) {
            return null !== u && "object" == typeof u;
          },
          function (u, c) {
            return _this.is(u) ? success(u) : failure(u, c);
          },
          identity
        ) || this;
      return (_this._tag = "ObjectType"), _this;
    }
    return __extends(ObjectType, _super), ObjectType;
  })(Type))(),
  (function (_super) {
    function StrictType(name, is, validate, encode, props) {
      var _this = _super.call(this, name, is, validate, encode) || this;
      return (_this.props = props), (_this._tag = "StrictType"), _this;
    }
    __extends(StrictType, _super);
  })(Type);
var User = (function (props, name) {
    void 0 === name && (name = getInterfaceTypeName(props));
    var keys = Object.keys(props),
      types = keys.map(function (key) {
        return props[key];
      }),
      len = keys.length;
    return new InterfaceType(
      name,
      function (u) {
        if (UnknownRecord.is(u)) {
          for (var i = 0; i < len; i++) {
            var k = keys[i],
              uk = u[k];
            if (
              (void 0 === uk && !hasOwnProperty.call(u, k)) ||
              !types[i].is(uk)
            )
              return !1;
          }
          return !0;
        }
        return !1;
      },
      function (u, c) {
        var e = UnknownRecord.validate(u, c);
        if (isLeft(e)) return e;
        for (var o = e.right, a = o, errors = [], i = 0; i < len; i++) {
          var k = keys[i],
            ak = a[k],
            type_1 = types[i],
            result = type_1.validate(ak, appendContext(c, k, type_1, ak));
          if (isLeft(result)) pushAll(errors, result.left);
          else {
            var vak = result.right;
            (vak !== ak || (void 0 === vak && !hasOwnProperty.call(a, k))) &&
              (a === o && (a = __assign({}, o)), (a[k] = vak));
          }
        }
        return errors.length > 0 ? failures(errors) : success(a);
      },
      (function (codecs) {
        for (var i = 0; i < codecs.length; i++)
          if (codecs[i].encode !== identity) return !1;
        return !0;
      })(types)
        ? identity
        : function (a) {
            for (var s = __assign({}, a), i = 0; i < len; i++) {
              var k = keys[i],
                encode = types[i].encode;
              encode !== identity && (s[k] = encode(a[k]));
            }
            return s;
          },
      props
    );
  })({ userId: number, name: string }),
  result = User.decode({ userId: 1, name: "name" });
isRight(result) && console.log(result.right);
