"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;
var _config = _interopRequireDefault(require("../config"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var path = require('path');
var util = require('util');
var exec = util.promisify(require('child_process').exec);
var dataConfig = (0, _config.default)();
function getExecCommand(user, password, host, db, collection) {
  var filepath = path.join(__dirname, '../../../', "raw-data/json/".concat(collection, ".json"));
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