import getDbConfig from '../config'

const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const dbConfig = getDbConfig()

function getExecCommand (host, db, collection, user, password) {
  const filepath = path.join(__dirname, '../../../', `raw_data/${collection}.csv`)
  return `mongoimport -h ${host} -d ${db} -c ${collection} -u ${user} -p ${password} --file ${filepath} --type csv --headerline --drop`
}

export default async function load (user, password) {
  for (const collection of Object.values(dbConfig.endpointToCollection)) {
    const cmd = getExecCommand(dbConfig.host, dbConfig.db, collection, user, password)

    const { stdout, stderr } = await exec(cmd)
    console.log(stdout)
    console.error(stderr)
  }
}
