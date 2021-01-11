"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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