"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCollectionClient = getCollectionClient;
exports.getCollectionClientFromEndpoint = getCollectionClientFromEndpoint;
exports.getDbClient = getDbClient;
var _config = _interopRequireDefault(require("../config"));
var _client = _interopRequireDefault(require("./client"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var dataConfig = (0, _config.default)();
var singletonClient;
function getDbClient() {
  return _getDbClient.apply(this, arguments);
}
function _getDbClient() {
  _getDbClient = _asyncToGenerator(function* () {
    if (!singletonClient) {
      singletonClient = new _client.default(process.env.COVID_DATABASE_USERNAME, process.env.COVID_DATABASE_PASSWORD, process.env.COVID_DATABASE_HOST, process.env.COVID_DATABASE_NAME);
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
    if (dataConfig.endpointToCollection[endpoint] === undefined) {
      return undefined;
    }
    var collectionName = dataConfig.endpointToCollection[endpoint];
    var dbclient = yield getDbClient();
    return dbclient.collection(collectionName);
  });
  return _getCollectionClientFromEndpoint.apply(this, arguments);
}