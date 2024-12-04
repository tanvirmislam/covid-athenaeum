"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setup;
var _fetcher = _interopRequireDefault(require("./fetcher/fetcher"));
var _scraper = require("./scraper/scraper");
var _json_formatter = _interopRequireDefault(require("./csv2json/json_formatter"));
var _loader = _interopRequireDefault(require("./loader/loader"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function setup() {
  return _setup.apply(this, arguments);
}
function _setup() {
  _setup = _asyncToGenerator(function* () {
    try {
      var status;
      status = yield (0, _fetcher.default)();
      if (!status) {
        console.log('setup: Failed to fetch');
        return;
      }
      status = yield (0, _scraper.scrapeCsv)();
      if (!status) {
        console.log('setup: Failed to scrape CSV file(s)');
        return;
      }
      status = yield (0, _json_formatter.default)();
      if (!status) {
        console.log('setup: Failed to format the file(s)');
        return;
      }
      status = yield (0, _scraper.scrapeJson)();
      if (!status) {
        console.log('setup: Failed to scrape JSON file(s)');
        return;
      }
      status = yield (0, _loader.default)();
      if (!status) {
        console.log('setup: Failed to load the data into the database');
      }
    } catch (error) {
      console.log(error);
    }
  });
  return _setup.apply(this, arguments);
}