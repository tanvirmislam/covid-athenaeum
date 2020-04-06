"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fixNames;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var path = require('path');

var fs = require('fs');

var fastcsv = require('fast-csv');

var ObjectsToCsv = require('objects-to-csv');

var countryRenameMap = {
  US: 'United States of America',
  Congo: 'Dem. Rep. Congo',
  'Korea, South': 'South Korea',
  'Central African Republic': 'Central African Rep.',
  'Congo (Brazzaville)': 'Congo',
  'Congo (Kinshasa)': 'Dem. Rep. Congo',
  'Cote d\'Ivoire': 'Côte d\'Ivoire',
  'Equatorial Guinea': 'Eq. Guinea',
  'Bosnia and Herzegovina': 'Bosnia and Herz.',
  'ominican Republic': 'Dominican Rep.',
  'North Macedonia': 'Macedonia'
};
var provinceToCountryMap = {
  Greenland: 'Greenland'
};
var confirmedDataFilePath = path.join(__dirname, '../../../', 'raw_data/countries_confirmed.csv');
var deathsDataFilePath = path.join(__dirname, '../../../', 'raw_data/countries_deaths.csv');
var recoveredDataFilePath = path.join(__dirname, '../../../', 'raw_data/countries_recovered.csv');

function fixNames() {
  return _fixNames.apply(this, arguments);
}

function _fixNames() {
  _fixNames = _asyncToGenerator(function* () {
    try {
      console.log('\n*** Initializing name fix ***\n');
      yield Promise.all([processFile(confirmedDataFilePath), processFile(deathsDataFilePath), processFile(recoveredDataFilePath)]);
      console.log('\n*** Name fix completed ***\n');
    } catch (error) {
      console.log('\n*** Name fix failed ***\n');
      console.log(error);
    }
  });
  return _fixNames.apply(this, arguments);
}

function processFile(_x) {
  return _processFile.apply(this, arguments);
}

function _processFile() {
  _processFile = _asyncToGenerator(function* (csvFilePath) {
    console.log("Processing file ".concat(csvFilePath));

    try {
      console.log("Reading file ".concat(csvFilePath));
      var data = yield readCsvFile(csvFilePath);
      console.log("Writing to file ".concat(csvFilePath));
      yield writeCsvFile(csvFilePath, data);
    } catch (error) {
      console.log("Failed to process file ".concat(csvFilePath));
      console.log(error);
    }
  });
  return _processFile.apply(this, arguments);
}

function readCsvFile(csvFilePath) {
  var data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath).pipe(fastcsv.parse({
      headers: true
    })).on('data', row => {
      if (Object.keys(row).length !== 0) {
        var currentCountryName = row['Country/Region'];
        var currentProvinceName = row['Province/State'];

        if (currentCountryName !== undefined && countryRenameMap[currentCountryName] !== undefined) {
          row['Country/Region'] = countryRenameMap[currentCountryName];
        } else if (currentProvinceName !== undefined && provinceToCountryMap[currentProvinceName] !== undefined) {
          row['Country/Region'] = provinceToCountryMap[currentProvinceName];
        }

        data.push(row);
      }
    }).on('end', () => {
      resolve(data);
    }).on('error', error => {
      reject(error);
    });
  });
}

function writeCsvFile(_x2, _x3) {
  return _writeCsvFile.apply(this, arguments);
}

function _writeCsvFile() {
  _writeCsvFile = _asyncToGenerator(function* (csvFilePath, data) {
    var csv = new ObjectsToCsv(data);

    try {
      yield csv.toDisk(csvFilePath);
    } catch (error) {
      console.log(error);
    }
  });
  return _writeCsvFile.apply(this, arguments);
}