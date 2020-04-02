"use strict";

var _setup = _interopRequireDefault(require("../data/setup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = getValidCmdArgs();

if (Object.keys(config).length === 0) {
  console.log('setup_data::error - Failed to setup raw data');
} else {
  (0, _setup.default)(config).then(() => {
    console.log('Setup Completed.');
  }).catch(error => {
    console.log(error);
  });
}

function getValidCmdArgs() {
  if (process.argv.length !== 6) {
    console.log('Invalid arguments');
    return {};
  } else if (!process.argv.includes('-u', '-p')) {
    console.log('Could not find -u or -p indicators in the arguments');
    return {};
  } else {
    var user = process.argv[process.argv.findIndex(element => element === '-u') + 1];
    var password = process.argv[process.argv.findIndex(element => element === '-p') + 1];

    if (user === undefined || password === undefined) {
      console.log('Could not retreive username or password from the arguments');
      return {};
    }

    return {
      user: user,
      password: password
    };
  }
}