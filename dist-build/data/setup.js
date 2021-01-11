"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setup;

var _fetcher = _interopRequireDefault(require("./fetcher/fetcher"));

var _scraper = require("./scraper/scraper");

var _json_formatter = _interopRequireDefault(require("./csv2json/json_formatter"));

var _loader = _interopRequireDefault(require("./loader/loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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