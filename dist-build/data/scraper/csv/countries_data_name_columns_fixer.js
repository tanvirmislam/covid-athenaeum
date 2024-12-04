"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fixNames;
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
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
  'Dominican Republic': 'Dominican Rep.',
  'North Macedonia': 'Macedonia'
};
var provinceToCountryMap = {
  Greenland: 'Greenland'
};
var confirmedDataFilePath = path.join(__dirname, '../../../../', 'raw-data/csv/countries_confirmed.csv');
var deathsDataFilePath = path.join(__dirname, '../../../../', 'raw-data/csv/countries_deaths.csv');
var recoveredDataFilePath = path.join(__dirname, '../../../../', 'raw-data/csv/countries_recovered.csv');
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
        var renamedRow = {};
        var notDateFields = ['Province/State', 'Country/Region', 'Lat', 'Long'];
        var currentCountryName = row['Country/Region'];
        var currentProvinceName = row['Province/State'];
        renamedRow['province/state'] = row['Province/State'].toLowerCase();
        if (currentCountryName !== undefined && countryRenameMap[currentCountryName] !== undefined) {
          renamedRow['country/region'] = countryRenameMap[currentCountryName].toLowerCase();
        } else if (currentProvinceName !== undefined && provinceToCountryMap[currentProvinceName] !== undefined) {
          renamedRow['country/region'] = provinceToCountryMap[currentProvinceName].toLowerCase();
        } else {
          renamedRow['country/region'] = row['Country/Region'].toLowerCase();
        }
        renamedRow.lat = row.Lat;
        renamedRow.long = row.Long;
        Object.keys(row).forEach(field => {
          if (!notDateFields.includes(field)) {
            renamedRow[field] = row[field];
          }
        });
        data.push(renamedRow);
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