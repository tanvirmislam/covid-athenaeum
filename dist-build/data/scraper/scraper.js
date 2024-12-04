"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrapeCsv = scrapeCsv;
exports.scrapeJson = scrapeJson;
var _countries_data_name_columns_fixer = _interopRequireDefault(require("./csv/countries_data_name_columns_fixer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function scrapeCsv() {
  return _scrapeCsv.apply(this, arguments);
}
function _scrapeCsv() {
  _scrapeCsv = _asyncToGenerator(function* () {
    try {
      yield (0, _countries_data_name_columns_fixer.default)();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
  return _scrapeCsv.apply(this, arguments);
}
function scrapeJson() {
  return _scrapeJson.apply(this, arguments);
}
function _scrapeJson() {
  _scrapeJson = _asyncToGenerator(function* () {
    return true;
  });
  return _scrapeJson.apply(this, arguments);
}