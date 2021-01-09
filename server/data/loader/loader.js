import getDataConfig from '../config'

const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const dataConfig = getDataConfig()

function getExecCommand (user, password, host, db, collection) {
  const filepath = path.join(__dirname, '../../../', `raw_data/json/${collection}.json`)
  return `mongoimport --drop --jsonArray --uri mongodb+srv://${user}:${password}@${host}/${db} --collection ${collection} --type json --file ${filepath}`
}

export default async function load () {
  for (const collection of Object.values(dataConfig.endpointToCollection)) {
    const cmd = getExecCommand(
      process.env.COVID_DATABASE_USERNAME,
      process.env.COVID_DATABASE_PASSWORD,
      process.env.COVID_DATABASE_HOST,
      process.env.COVID_DATABASE_NAME,
      collection
    )

    const { stdout, stderr } = await exec(cmd)
    console.log(stdout)
    console.error(stderr)
  }
}
