const config = {
    db: 'heroku_ql4b57xq',
    user: 'covid',
    password: 'knowcovid2019',
    host: 'ds041556.mlab.com:41556',
    url: 'mongodb://covid:knowcovid2019@ds041556.mlab.com:41556/heroku_ql4b57xq',
    endpointToCollection: {
        '/covid/global/confirmed': 'global_confirmed',
        '/covid/global/deaths': 'global_deaths',
        '/covid/global/recovered': 'global_recovered',
        '/covid/usa/total': 'usa_total',
        '/covid/usa/daily': 'usa_daily',
        '/covid/usa/states': 'usa_states',
        '/covid/usa/states/infoportals': 'usa_states_info_portals'
    }
}

export default function getConfig() {
    return config;
}
