"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestDate = getLatestDate;
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function getLatestDate(_x) {
  return _getLatestDate.apply(this, arguments);
}
function _getLatestDate() {
  _getLatestDate = _asyncToGenerator(function* (collection) {
    var latestDateQueryResponse = yield collection.aggregate([{
      $limit: 1
    }, {
      $unwind: '$data'
    }, {
      $group: {
        _id: '$country/region',
        latestDate: {
          $last: '$data.date'
        }
      }
    }]).toArray();
    return latestDateQueryResponse[0].latestDate;
  });
  return _getLatestDate.apply(this, arguments);
}