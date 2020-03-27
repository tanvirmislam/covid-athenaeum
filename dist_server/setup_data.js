"use strict";

var _setup = _interopRequireDefault(require("./data/setup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _setup.default)().then(() => {
  console.log('Setup Completed.');
}).catch(error => {
  console.log(error);
});