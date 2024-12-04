"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var mongodb = require('mongodb');
class Client {
  constructor(user, password, host, db) {
    this._dbclient = undefined;
    this._isConnected = false;
    this._user = user;
    this._password = password;
    this._host = host;
    this._db = db;
    this._uri = "mongodb+srv://".concat(user, ":").concat(password, "@").concat(host, "/").concat(db);
  }
  get dbclient() {
    return this._dbclient;
  }
  get isConnected() {
    return this._isConnectionInitialized;
  }
  connect() {
    var _this = this;
    return _asyncToGenerator(function* () {
      try {
        var client = yield mongodb.MongoClient.connect(_this._uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        _this._dbclient = client.db(_this._db);
        _this._isConnected = true;
      } catch (err) {
        console.log(err);
        _this._dbclient = undefined;
        _this._isConnected = false;
      }
    })();
  }
}
exports.default = Client;