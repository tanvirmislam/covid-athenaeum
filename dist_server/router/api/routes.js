"use strict";

var _dbaccess = require("../../data/access/dbaccess");

var _global_countries_data_calculator = require("./util/global_countries_data_calculator");

var _valid_param_extractor = require("./util/valid_param_extractor");

var _latest_date_calculator = require("./util/latest_date_calculator");

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
        response.send(JSON.stringify(error));
      } else {
        var params = (0, _valid_param_extractor.getValidCountriesDataRequestParams)(request);
        console.log(params);

        if (params === undefined) {
          var _error = {
            error: 'Invalid request parameters'
          };
          response.send(JSON.stringify(_error));
        } else {
          var match = {};
          var projection = {
            _id: 0,
            'province/state': 1,
            'country/region': 1,
            Lat: 1,
            Long: 1
          };
          var dataProjectionFilterCondition = {};
          var dataProjection = {
            $filter: {
              input: '$data',
              as: 'data',
              cond: undefined
            }
          };

          if (params.country !== 'all') {
            match['country/region'] = params.country;
          }

          if (params.onlyLatest === true) {
            var latestDate = yield (0, _latest_date_calculator.getLatestDate)(collection);
            dataProjectionFilterCondition = {
              $eq: ['$$data.date', latestDate]
            };
          } else {
            if (params.dateFrom !== 'start' && params.dateTo !== 'end') {
              dataProjectionFilterCondition = {
                $and: [{
                  $gte: ['$$data.date', params.dateFrom]
                }, {
                  $lte: ['$$data.date', params.dateTo]
                }]
              };
            } else if (params.dateFrom !== 'start') {
              dataProjectionFilterCondition = {
                $gte: ['$$data.date', params.dateFrom]
              };
            } else {
              dataProjectionFilterCondition = {
                $lte: ['$$data.date', params.dateTo]
              };
            }
          }

          dataProjection.$filter.cond = dataProjectionFilterCondition;
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
            var countryNameToData = {};
            data.forEach(entry => {
              var name = entry['country/region'];

              if (countryNameToData[name] === undefined) {
                entry['province/state'] = '';
                countryNameToData[name] = entry;
              } else {
                for (var i = 0; i < entry.data.length; ++i) {
                  var total = parseInt(countryNameToData[name].data[i].count) + parseInt(entry.data[i].count);
                  countryNameToData[name].data[i].count = total.toString();
                }
              }
            });
            response.send(Object.values(countryNameToData));
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
      var confirmedCollectionClient = yield (0, _dbaccess.getCollectionClientFromEndpoint)('/countries/confirmed');
      var [deathsCollectionClient, recoveredCollectionClient, latestDate] = yield Promise.all([(0, _dbaccess.getCollectionClientFromEndpoint)('/countries/deaths'), (0, _dbaccess.getCollectionClientFromEndpoint)('/countries/recovered'), (0, _latest_date_calculator.getLatestDate)(confirmedCollectionClient)]);
      var [globalConfirmed, globalDeaths, globalRecovered] = yield Promise.all([(0, _global_countries_data_calculator.getGlobalCountOfDate)(confirmedCollectionClient, latestDate), (0, _global_countries_data_calculator.getGlobalCountOfDate)(deathsCollectionClient, latestDate), (0, _global_countries_data_calculator.getGlobalCountOfDate)(recoveredCollectionClient, latestDate)]);
      response.send(JSON.stringify({
        confirmed: globalConfirmed,
        deaths: globalDeaths,
        recovered: globalRecovered
      }));
    } catch (error) {
      response.send(error);
    }
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
module.exports = router;