"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;
var _config = _interopRequireDefault(require("../config"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var fs = require('fs');
var path = require('path');
var axios = require('axios');
var downloadURLs = (0, _config.default)().collectionToRawDataURL;
function downloadFile(_x, _x2) {
  return _downloadFile.apply(this, arguments);
}
function _downloadFile() {
  _downloadFile = _asyncToGenerator(function* (filename, url) {
    var outputPath = path.join(__dirname, '../../../', "raw-data/csv/".concat(filename, ".csv"));
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
      try {
        yield downloadFile(filename, url);
        console.log("Download completed: ".concat(filename));
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return true;
  });
  return _fetch.apply(this, arguments);
}