"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("fp-ts/Task");
var function_1 = require("fp-ts/function");
function_1.pipe(_.of(1), _.map(function (n) { return n + 1; }), _.chain(function (n) { return _.of(n + 1); }));
