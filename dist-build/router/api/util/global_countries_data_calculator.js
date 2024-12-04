"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalCountOfDate = getGlobalCountOfDate;
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function getGlobalCountOfDate(_x, _x2) {
  return _getGlobalCountOfDate.apply(this, arguments);
}
function _getGlobalCountOfDate() {
  _getGlobalCountOfDate = _asyncToGenerator(function* (collection, date) {
    var globalInfo = {
      total: 0,
      min: undefined,
      max: undefined
    };
    var countryNameToCount = {};
    var data = yield collection.aggregate([{
      $project: {
        _id: 0,
        'country/region': '$country/region',
        data: {
          $filter: {
            input: '$data',
            as: 'data',
            cond: {
              $eq: ['$$data.date', date]
            }
          }
        }
      }
    }]).toArray();
    data.forEach(entry => {
      var name = entry['country/region'];
      var count = parseInt(entry.data[0].count);
      if (countryNameToCount[name] === undefined) {
        countryNameToCount[name] = count;
      } else {
        countryNameToCount[name] += count;
      }
      if (globalInfo.min === undefined || countryNameToCount[name] < globalInfo.min.count) {
        globalInfo.min = {
          country: name,
          count: countryNameToCount[name]
        };
      }
      if (globalInfo.max === undefined || countryNameToCount[name] > globalInfo.max.count) {
        globalInfo.max = {
          country: name,
          count: countryNameToCount[name]
        };
      }
      globalInfo.total += count;
    });
    return globalInfo;
  });
  return _getGlobalCountOfDate.apply(this, arguments);
}