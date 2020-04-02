"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setup;

var _fetcher = _interopRequireDefault(require("./fetcher/fetcher"));

var _loader = _interopRequireDefault(require("./loader/loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function setup(_x) {
  return _setup.apply(this, arguments);
}

function _setup() {
  _setup = _asyncToGenerator(function* (config) {
    yield (0, _fetcher.default)();
    yield (0, _loader.default)(config.user, config.password);
  });
  return _setup.apply(this, arguments);
}