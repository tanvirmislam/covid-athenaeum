"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mergeProvinceData;

function mergeProvinceData(detailedCountriesData) {
  var countryNameToData = {};
  return new Promise((resolve, reject) => {
    try {
      detailedCountriesData.forEach(entry => {
        var name = entry['country/region'];

        if (countryNameToData[name] === undefined) {
          entry['province/state'] = '';
          countryNameToData[name] = entry;
        } else {
          for (var i = 0; i < entry.data.length; ++i) {
            var total = parseInt(countryNameToData[name].data[i].count) + parseInt(entry.data[i].count);
            countryNameToData[name].data[i].count = total.toString();
          }
        }
      });
      return Object.values(countryNameToData);
    } catch (error) {
      reject(error);
    }
  });
}