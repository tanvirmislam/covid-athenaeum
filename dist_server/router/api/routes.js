"use strict";

var _dbaccess = require("../../data/access/dbaccess");

var _global_countries_data_calculator = require("./util/global_countries_data_calculator");

var _valid_param_extractor = require("./util/valid_param_extractor");

var _latest_date_calculator = require("./util/latest_date_calculator");

var _countries_province_data_merger = require("./util/countries_province_data_merger");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var router = express.Router(); // Get Posts

router.get('/countries/:status', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (request, response) {
    try {
      var collection = yield (0, _dbaccess.getCollectionClientFromEndpoint)(request.path);

      if (collection === undefined) {
        var error = {
          error: 'Invalid countries data endpoint',
          accepted: ['/countries/confirmed', '/countries/deaths', '/countries/recovered']
        };
        response.json(error);
      } else {
        var params = (0, _valid_param_extractor.getValidCountriesDataRequestParams)(request);

        if (params === undefined) {
          var _error = {
            error: 'Invalid request parameters'
          };
          response.json(_error);
        } else {
          var match = {};
          var projection = {
            _id: 0,
            'province/state': 1,
            'country/region': 1,
            lat: 1,
            long: 1
          };
          var dataProjection = {
            $filter: {
              input: '$data',
              as: 'data',
              cond: undefined
            }
          };
          var filterCond = {};

          if (params.country !== 'all') {
            match['country/region'] = params.country;
          }

          if (params.onlyLatest === true) {
            var latestDate = yield (0, _latest_date_calculator.getLatestDate)(collection);
            filterCond = {
              $eq: ['$$data.date', latestDate]
            };
          } else {
            if (params.dateFrom !== 'start' && params.dateTo !== 'end') {
              filterCond = {
                $and: [{
                  $gte: ['$$data.date', params.dateFrom]
                }, {
                  $lte: ['$$data.date', params.dateTo]
                }]
              };
            } else if (params.dateFrom !== 'start') {
              filterCond = {
                $gte: ['$$data.date', params.dateFrom]
              };
            } else {
              filterCond = {
                $lte: ['$$data.date', params.dateTo]
              };
            }
          }

          dataProjection.$filter.cond = filterCond;
          projection.data = dataProjection;
          var pipeline = [{
            $match: match
          }, {
            $project: projection
          }];
          var data = yield collection.aggregate(pipeline).toArray();

          if (params.detailed === true) {
            response.send(data);
          } else {
            var dataWithProvincesCountMerged = yield (0, _countries_province_data_merger.mergeProvinceData)(data);
            response.send(dataWithProvincesCountMerged);
          }
        }
      }
    } catch (error) {
      response.send(error);
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/global', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (request, response) {
    try {
      var confirmedCollectionClient = yield (0, _dbaccess.getCollectionClient)('countries_confirmed');
      var [deathsCollectionClient, recoveredCollectionClient, latestDate] = yield Promise.all([(0, _dbaccess.getCollectionClient)('countries_deaths'), (0, _dbaccess.getCollectionClient)('countries_recovered'), (0, _latest_date_calculator.getLatestDate)(confirmedCollectionClient)]);
      var [globalConfirmed, globalDeaths, globalRecovered] = yield Promise.all([(0, _global_countries_data_calculator.getGlobalCountOfDate)(confirmedCollectionClient, latestDate), (0, _global_countries_data_calculator.getGlobalCountOfDate)(deathsCollectionClient, latestDate), (0, _global_countries_data_calculator.getGlobalCountOfDate)(recoveredCollectionClient, latestDate)]);
      response.json({
        confirmed: globalConfirmed,
        deaths: globalDeaths,
        recovered: globalRecovered
      });
    } catch (error) {
      response.send(error);
    }
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/summary/:country', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (request, response) {
    try {
      var confirmedCollectionClient = yield (0, _dbaccess.getCollectionClient)('countries_confirmed');
      var [deathsCollectionClient, recoveredCollectionClient, latestDate] = yield Promise.all([(0, _dbaccess.getCollectionClient)('countries_deaths'), (0, _dbaccess.getCollectionClient)('countries_recovered'), (0, _latest_date_calculator.getLatestDate)(confirmedCollectionClient)]);
      var match = {
        'country/region': request.params.country.toLowerCase()
      };
      var projection = {
        _id: 0,
        'province/state': 1,
        'country/region': 1,
        lat: 1,
        long: 1,
        data: {
          $filter: {
            input: '$data',
            as: 'data',
            cond: {
              $eq: ['$$data.date', latestDate]
            }
          }
        }
      };
      var pipeline = [{
        $match: match
      }, {
        $project: projection
      }];
      var [confirmedData, deathsData, recoveredData] = yield Promise.all([confirmedCollectionClient.aggregate(pipeline).toArray(), deathsCollectionClient.aggregate(pipeline).toArray(), recoveredCollectionClient.aggregate(pipeline).toArray()]);
      var [confirmedDataWithProvinceMerged, deathsDataWithProvinceMerged, recoveredDataWithProvinceMerged] = yield Promise.all([(0, _countries_province_data_merger.mergeProvinceData)(confirmedData), (0, _countries_province_data_merger.mergeProvinceData)(deathsData), (0, _countries_province_data_merger.mergeProvinceData)(recoveredData)]);
      var summary = {
        'province/state': '',
        'country/region': confirmedDataWithProvinceMerged[0]['country/region'],
        lat: confirmedDataWithProvinceMerged[0].lat,
        long: confirmedDataWithProvinceMerged[0].long,
        data: {
          date: latestDate,
          confirmed: confirmedDataWithProvinceMerged[0].data[0].count,
          deaths: deathsDataWithProvinceMerged[0].data[0].count,
          recovered: recoveredDataWithProvinceMerged[0].data[0].count,
          mortalityRate: (deathsDataWithProvinceMerged[0].data[0].count / confirmedDataWithProvinceMerged[0].data[0].count).toFixed(5),
          recoveryRate: (recoveredDataWithProvinceMerged[0].data[0].count / confirmedDataWithProvinceMerged[0].data[0].count).toFixed(5)
        }
      };
      response.json(summary);
    } catch (error) {
      response.send(error);
    }
  });

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
module.exports = router;