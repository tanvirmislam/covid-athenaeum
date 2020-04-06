"use strict";

var _dbaccess = require("../../data/access/dbaccess");

var _total_calculator = require("./util/total_calculator");

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
        response.send((yield collection.find({}, {
          projection: {
            _id: 0
          }
        }).toArray()));
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
      var deathsCollectionClient = yield (0, _dbaccess.getCollectionClientFromEndpoint)('/countries/deaths');
      var recoveredCollectionClient = yield (0, _dbaccess.getCollectionClientFromEndpoint)('/countries/recovered');
      var [globalConfirmed, globalDeaths, globalRecovered] = yield Promise.all((0, _total_calculator.getLatestTotalCount)(confirmedCollectionClient), (0, _total_calculator.getLatestTotalCount)(deathsCollectionClient), (0, _total_calculator.getLatestTotalCount)(recoveredCollectionClient));
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