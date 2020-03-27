const downloadURLs = {
    "global_confirmed": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
    "global_deaths": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
    "global_recovered": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv",
    "usa_total": "https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/us_current.csv",
    "usa_daily": "https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/us_daily.csv",
    "usa_states": "https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/states_current.csv",
    "usa_states_info_portals": "https://raw.githubusercontent.com/COVID19Tracking/covid-tracking-data/master/data/states_info.csv"
}

const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadFile (filename, url) {
    const outputPath = path.join(__dirname, '../../../', `raw_data/${filename}.csv`);
    const writer = fs.createWriteStream(outputPath);

    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
    catch (err) {
        console.log(`fetcher::downloadFile error - unable to download files\n${err}`);
    }
}

export default async function fetch() {
    for (let [filename, url] of Object.entries(downloadURLs)) {
        await downloadFile(filename, url);
        console.log(`Download completed: ${filename}`);
    }
}
