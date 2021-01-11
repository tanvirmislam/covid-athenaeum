"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalCountOfDate = getGlobalCountOfDate;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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