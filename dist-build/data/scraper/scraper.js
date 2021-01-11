"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrapeCsv = scrapeCsv;
exports.scrapeJson = scrapeJson;

var _countries_data_name_columns_fixer = _interopRequireDefault(require("./csv/countries_data_name_columns_fixer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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