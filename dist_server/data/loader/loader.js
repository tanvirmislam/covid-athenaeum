"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var path = require('path');

var util = require('util');

var exec = util.promisify(require('child_process').exec);
var dbConfig = (0, _config.default)();

function getExecCommand(collection) {
  var filepath = path.join(__dirname, '../../../', "raw_data/".concat(collection, ".csv"));
  return "mongoimport -h ".concat(dbConfig['host'], " -d ").concat(dbConfig['db'], " -c ").concat(collection, " -u ").concat(dbConfig['user'], " -p ").concat(dbConfig['password'], " --file ").concat(filepath, " --type csv --headerline --drop");
}

function load() {
  return _load.apply(this, arguments);
}

function _load() {
  _load = _asyncToGenerator(function* () {
    for (var [endpoint, collection] of Object.entries(dbConfig['endpointToCollection'])) {
      var cmd = getExecCommand(collection);
      var {
        stdout,
        stderr
      } = yield exec(cmd);
      console.log(stdout);
      console.error(stderr);
    }
  });
  return _load.apply(this, arguments);
}