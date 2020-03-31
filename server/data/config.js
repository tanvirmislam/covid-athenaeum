const config = {
    db: 'heroku_ql4b57xq',
    user: 'athenaeum',
    password: 'knowcovid2019',
    host: 'ds041556.mlab.com:41556',
    url: 'mongodb://athenaeum:knowcovid2019@ds041556.mlab.com:41556/heroku_ql4b57xq',
    collectionToRawDataURL: {
        'global_confirmed': 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
        'global_deaths': 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
        'global_recovered': 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
        'usa_total': 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/us_current.csv',
        'usa_daily': 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/us_daily.csv',
        'usa_states': 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/states_current.csv',
        'usa_states_info_portals': 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/states_info.csv'
    },
    endpointToCollection: {
        '/global/confirmed': 'global_confirmed',
        '/global/deaths': 'global_deaths',
        '/global/recovered': 'global_recovered',
        '/usa/total': 'usa_total',
        '/usa/daily': 'usa_daily',
        '/usa/states': 'usa_states',
        '/usa/states/infoportals': 'usa_states_info_portals'
    }
}

export default function getConfig() {
    return config;
}
