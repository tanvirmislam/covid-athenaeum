import getDbConfig from '../config';

const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const dbConfig = getDbConfig();

function getExecCommand(collection) {
    const filepath = path.join(__dirname, '../../../', `raw_data/${collection}.csv`);
    return `mongoimport -h ${dbConfig['host']} -d ${dbConfig['db']} -c ${collection} -u ${dbConfig['user']} -p ${dbConfig['password']} --file ${filepath} --type csv --headerline --drop`;
}

export default async function load() {
    for (let [endpoint, collection] of Object.entries(dbConfig['endpointToCollection'])) {
        let cmd = getExecCommand(collection);

        const { stdout, stderr } = await exec(cmd);
        console.log(stdout);
        console.error(stderr);
    }
}
