"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDbClient = getDbClient;
exports.getCollectionClient = getCollectionClient;
exports.getCollectionClientFromEndpoint = getCollectionClientFromEndpoint;

var _config = _interopRequireDefault(require("../config"));

var _client = _interopRequireDefault(require("./client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var config = (0, _config.default)();
var singletonClient;

function getDbClient() {
  return _getDbClient.apply(this, arguments);
}

function _getDbClient() {
  _getDbClient = _asyncToGenerator(function* () {
    if (!singletonClient) {
      singletonClient = new _client.default(config);
    }

    if (!singletonClient.isConnected) {
      try {
        yield singletonClient.connect();
      } catch (err) {
        console.log(err);
        return undefined;
      }
    }

    return singletonClient.dbclient;
  });
  return _getDbClient.apply(this, arguments);
}

function getCollectionClient(_x) {
  return _getCollectionClient.apply(this, arguments);
}

function _getCollectionClient() {
  _getCollectionClient = _asyncToGenerator(function* (collectionName) {
    var dbclient = yield getDbClient();
    return dbclient.collection(collectionName);
  });
  return _getCollectionClient.apply(this, arguments);
}

function getCollectionClientFromEndpoint(_x2) {
  return _getCollectionClientFromEndpoint.apply(this, arguments);
}

function _getCollectionClientFromEndpoint() {
  _getCollectionClientFromEndpoint = _asyncToGenerator(function* (endpoint) {
    if (config.endpointToCollection[endpoint] === undefined) {
      return undefined;
    }

    var collectionName = config.endpointToCollection[endpoint];
    var dbclient = yield getDbClient();
    return dbclient.collection(collectionName);
  });
  return _getCollectionClientFromEndpoint.apply(this, arguments);
}