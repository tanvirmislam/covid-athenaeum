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

function getExecCommand(host, db, collection, user, password) {
  var filepath = path.join(__dirname, '../../../', "raw_data/json/".concat(collection, ".json"));
  return "mongoimport --drop --jsonArray -h ".concat(host, " -d ").concat(db, " -c ").concat(collection, " -u ").concat(user, " -p ").concat(password, " --file ").concat(filepath);
}

function load(_x, _x2) {
  return _load.apply(this, arguments);
}

function _load() {
  _load = _asyncToGenerator(function* (user, password) {
    for (var collection of Object.values(dbConfig.endpointToCollection)) {
      var cmd = getExecCommand(dbConfig.host, dbConfig.db, collection, user, password);
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