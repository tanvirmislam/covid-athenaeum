"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = format;
var _countries_data_formatter = _interopRequireDefault(require("./countries_data_formatter"));
var _usa_data_formatter = _interopRequireDefault(require("./usa_data_formatter.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function format() {
  return _format.apply(this, arguments);
}
function _format() {
  _format = _asyncToGenerator(function* () {
    try {
      yield Promise.all([(0, _countries_data_formatter.default)(), (0, _usa_data_formatter.default)()]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  return _format.apply(this, arguments);
}