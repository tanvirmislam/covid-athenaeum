"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require('fs');

var path = require('path');

var axios = require('axios');

var downloadURLs = (0, _config.default)().collectionToRawDataURL;

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