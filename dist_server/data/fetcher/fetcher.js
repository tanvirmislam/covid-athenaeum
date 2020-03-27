"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var downloadURLs = {
  "global_confirmed": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
  "global_deaths": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
  "global_recovered": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv",
  "usa_total": "https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/us_current.csv",
  "usa_daily": "https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/us_daily.csv",
  "usa_states": "https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/states_current.csv",
  "usa_states_info_portals": "https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/states_info.csv"
};

var fs = require('fs');

var path = require('path');

var axios = require('axios');

function downloadFile(_x, _x2) {
  return _downloadFile.apply(this, arguments);
}

function _downloadFile() {
  _downloadFile = _asyncToGenerator(function* (filename, url) {
    var outputPath = path.join(__dirname, '../../../', "raw_data/".concat(filename, ".csv"));
    var writer = fs.createWriteStream(outputPath);

    try {
      var response = yield axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
      });
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (err) {
      console.log("fetcher::downloadFile error - unable to download files\n".concat(err));
    }
  });
  return _downloadFile.apply(this, arguments);
}

function fetch() {
  return _fetch.apply(this, arguments);
}

function _fetch() {
  _fetch = _asyncToGenerator(function* () {
    for (var [filename, url] of Object.entries(downloadURLs)) {
      yield downloadFile(filename, url);
      console.log("Download completed: ".concat(filename));
    }
  });
  return _fetch.apply(this, arguments);
}