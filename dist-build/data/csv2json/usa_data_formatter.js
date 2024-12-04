"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatUSAData;
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var path = require('path');
var fs = require('fs');
var fastcsv = require('fast-csv');
var dailyDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/usa_daily.csv');
var statesDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/usa_states.csv');
var totalDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/usa_total.csv');
var infoPortalDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/usa_states_info_portals.csv');
var dailyDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/usa_daily.json');
var statesDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/usa_states.json');
var totalDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/usa_total.json');
var infoPortalDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/usa_states_info_portals.json');
function formatUSAData() {
  return _formatUSAData.apply(this, arguments);
}
function _formatUSAData() {
  _formatUSAData = _asyncToGenerator(function* () {
    try {
      console.log('\n*** Initializing USA data conversion ***\n');
      console.log('Reading data from CSV');
      var [daily, states, total, infoPortal] = yield Promise.all([getObjectsFromCsvFile(dailyDataCsvFilePath, 'daily'), getObjectsFromCsvFile(statesDataCsvFilePath, 'states'), getObjectsFromCsvFile(totalDataCsvFilePath, 'total'), getObjectsFromCsvFile(infoPortalDataCsvFilePath, 'infoPortal')]);
      console.log('Writing data as JSON');
      yield Promise.all([fs.writeFile(dailyDataJsonFilePath, JSON.stringify(daily), error => console.log(error === null ? "done: ".concat(dailyDataJsonFilePath) : error)), fs.writeFile(statesDataJsonFilePath, JSON.stringify(states), error => console.log(error === null ? "done: ".concat(statesDataJsonFilePath) : error)), fs.writeFile(totalDataJsonFilePath, JSON.stringify(total), error => console.log(error === null ? "done: ".concat(totalDataJsonFilePath) : error)), fs.writeFile(infoPortalDataJsonFilePath, JSON.stringify(infoPortal), error => console.log(error === null ? "done: ".concat(infoPortalDataJsonFilePath) : error))]);
      console.log('\n*** USA data conversion completed ***\n');
    } catch (error) {
      console.log('\n*** USA data conversion failed ***\n');
      console.log(error);
    }
  });
  return _formatUSAData.apply(this, arguments);
}
function getObjectsFromCsvFile(csvFilePath, type) {
  var data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath).pipe(fastcsv.parse({
      headers: true
    })).on('data', row => {
      var formattedRow = {};
      switch (type) {
        case 'daily':
          {
            Object.keys(row).forEach(field => {
              if (field !== 'hash' && field !== 'notes') {
                if (field === 'date') {
                  var dd = row[field].toString().slice(-2);
                  var mm = row[field].toString().slice(-4, -2);
                  var yyyy = row[field].toString().slice(-8, -4);
                  formattedRow.date = new Date("".concat(mm, "/").concat(dd, "/").concat(yyyy));
                } else {
                  formattedRow[field] = row[field];
                }
              }
            });
            break;
          }
        case 'states':
          {
            Object.keys(row).forEach(field => {
              if (field !== 'hash' && field !== 'notes') {
                if (field === 'dateModified' || field === 'dateChecked') {
                  var date = new Date(row[field].toString());
                  var mm = date.getMonth() + 1 < 10 ? "0".concat(date.getMonth() + 1) : (date.getMonth() + 1).toString();
                  var dd = date.getDate() < 10 ? "0".concat(date.getDate()) : date.getDate().toString();
                  var yyyy = date.getFullYear().toString();
                  formattedRow[field] = "".concat(mm, "/").concat(dd, "/").concat(yyyy);
                } else {
                  formattedRow[field] = row[field];
                }
              }
            });
            break;
          }
        case 'total':
          {
            var disregardedFields = ['hash', 'notes', 'posNeg', 'total', 'hospitalized'];
            Object.keys(row).forEach(field => {
              if (!disregardedFields.includes(field)) {
                formattedRow[field] = row[field];
              }
            });
            break;
          }
        case 'infoPortal':
          {
            Object.keys(row).forEach(field => {
              formattedRow[field] = row[field];
            });
            break;
          }
        default:
          {
            break;
          }
      }
      data.push(formattedRow);
    }).on('end', () => {
      resolve(data);
    }).on('error', error => {
      reject(error);
    });
  });
}