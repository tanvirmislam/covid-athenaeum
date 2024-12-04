"use strict";

var _setup = _interopRequireDefault(require("../data/setup"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var requiredEnvVars = ['COVID_DATABASE_USERNAME', 'COVID_DATABASE_PASSWORD', 'COVID_DATABASE_HOST', 'COVID_DATABASE_NAME'];
if (requiredEnvVars.every(envVar => process.env[envVar] !== undefined)) {
  (0, _setup.default)().then(() => {
    console.log('Setup Completed.');
  }).catch(error => {
    console.log(error);
  });
} else {
  console.log('setup_data::error - Failed to setup raw data, missing important env vars!');
}