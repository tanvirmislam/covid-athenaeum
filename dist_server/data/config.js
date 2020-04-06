"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getConfig;
var config = {
  db: 'heroku_ql4b57xq',
  user: 'athenaeum',
  password: 'knowcovid2019',
  host: 'ds041556.mlab.com:41556',
  url: 'mongodb://athenaeum:knowcovid2019@ds041556.mlab.com:41556/heroku_ql4b57xq',
  collectionToRawDataURL: {
    countries_confirmed: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
    countries_deaths: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
    countries_recovered: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
    usa_total: 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/us_current.csv',
    usa_daily: 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/us_daily.csv',
    usa_states: 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/states_current.csv',
    usa_states_info_portals: 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/states_info.csv'
  },
  endpointToCollection: {
    '/countries/confirmed': 'countries_confirmed',
    '/countries/deaths': 'countries_deaths',
    '/countries/recovered': 'countries_recovered',
    '/usa/total': 'usa_total',
    '/usa/daily': 'usa_daily',
    '/usa/states': 'usa_states',
    '/usa/states/infoportals': 'usa_states_info_portals'
  }
};

function getConfig() {
  return config;
}