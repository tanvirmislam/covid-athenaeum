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
var dataConfig = (0, _config.default)();

function getExecCommand(user, password, host, db, collection) {
  var filepath = path.join(__dirname, '../../../', "raw_data/json/".concat(collection, ".json"));
  return "mongoimport --drop --jsonArray --uri mongodb+srv://".concat(user, ":").concat(password, "@").concat(host, "/").concat(db, " --collection ").concat(collection, " --type json --file ").concat(filepath);
}

function load() {
  return _load.apply(this, arguments);
}

function _load() {
  _load = _asyncToGenerator(function* () {
    for (var collection of Object.values(dataConfig.endpointToCollection)) {
      var cmd = getExecCommand(process.env.COVID_DATABASE_USERNAME, process.env.COVID_DATABASE_PASSWORD, process.env.COVID_DATABASE_HOST, process.env.COVID_DATABASE_NAME, collection);
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