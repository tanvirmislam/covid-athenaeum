"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestTotalCount = getLatestTotalCount;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getLatestTotalCount(_x) {
  return _getLatestTotalCount.apply(this, arguments);
}

function _getLatestTotalCount() {
  _getLatestTotalCount = _asyncToGenerator(function* (collectionClient) {
    var total = 0;
    var data = yield collectionClient.find({}, {
      projection: {
        _id: 0
      }
    }).toArray();
    data.forEach(entry => {
      var count = entry[Object.keys(entry).pop()];
      total += count;
    });
    return total;
  });
  return _getLatestTotalCount.apply(this, arguments);
}