"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatCoutriesData;
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var path = require('path');
var fs = require('fs');
var fastcsv = require('fast-csv');
var notDateFields = ['province/state', 'country/region', 'lat', 'long'];
var confirmedDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/countries_confirmed.csv');
var deathsDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/countries_deaths.csv');
var recoveredDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/countries_recovered.csv');
var confirmedDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/countries_confirmed.json');
var deathsDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/countries_deaths.json');
var recoveredDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/countries_recovered.json');
function formatCoutriesData() {
  return _formatCoutriesData.apply(this, arguments);
}
function _formatCoutriesData() {
  _formatCoutriesData = _asyncToGenerator(function* () {
    try {
      console.log('\n*** Initializing countries data conversion ***\n');
      console.log('Reading data from CSV');
      var [confirmed, deaths, recovered] = yield Promise.all([getObjectsFromCsvFile(confirmedDataCsvFilePath), getObjectsFromCsvFile(deathsDataCsvFilePath), getObjectsFromCsvFile(recoveredDataCsvFilePath)]);
      console.log('Writing data as JSON');
      yield Promise.all([fs.writeFile(confirmedDataJsonFilePath, JSON.stringify(confirmed), error => console.log(error === null ? "done: ".concat(confirmedDataJsonFilePath) : error)), fs.writeFile(deathsDataJsonFilePath, JSON.stringify(deaths), error => console.log(error === null ? "done: ".concat(deathsDataJsonFilePath) : error)), fs.writeFile(recoveredDataJsonFilePath, JSON.stringify(recovered), error => console.log(error === null ? "done: ".concat(recoveredDataJsonFilePath) : error))]);
      console.log('\n*** Countries data conversion completed ***\n');
    } catch (error) {
      console.log('\n*** Countries data conversion failed ***\n');
      console.log(error);
    }
  });
  return _formatCoutriesData.apply(this, arguments);
}
function getObjectsFromCsvFile(csvFilePath) {
  var data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath).pipe(fastcsv.parse({
      headers: true
    })).on('data', row => {
      var formattedRow = {};
      var countData = [];
      Object.keys(row).forEach(field => {
        if (notDateFields.includes(field)) {
          formattedRow[field] = row[field];
        } else {
          var date = new Date(field);
          var mm = date.getMonth() + 1 < 10 ? "0".concat(date.getMonth() + 1) : (date.getMonth() + 1).toString();
          var dd = date.getDate() < 10 ? "0".concat(date.getDate()) : date.getDate().toString();
          var yyyy = date.getFullYear().toString();
          countData.push({
            date: "".concat(mm, "/").concat(dd, "/").concat(yyyy),
            count: row[field]
          });
        }
      });
      formattedRow.data = countData;
      data.push(formattedRow);
    }).on('end', () => {
      resolve(data);
    }).on('error', error => {
      reject(error);
    });
  });
}