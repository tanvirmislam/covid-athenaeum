const path = require('path')
const fs = require('fs')
const fastcsv = require('fast-csv')
const ObjectsToCsv = require('objects-to-csv')

const countryRenameMap = {
  US: 'United States of America',
  Congo: 'Dem. Rep. Congo',
  'Korea, South': 'South Korea',
  'Central African Republic': 'Central African Rep.',
  'Congo (Brazzaville)': 'Congo',
  'Congo (Kinshasa)': 'Dem. Rep. Congo',
  'Cote d\'Ivoire': 'Côte d\'Ivoire',
  'Equatorial Guinea': 'Eq. Guinea',
  'Bosnia and Herzegovina': 'Bosnia and Herz.',
  'ominican Republic': 'Dominican Rep.',
  'North Macedonia': 'Macedonia'
}

const provinceToCountryMap = {
  Greenland: 'Greenland'
}

const confirmedDataFilePath = path.join(__dirname, '../../../', 'raw_data/countries_confirmed.csv')
const deathsDataFilePath = path.join(__dirname, '../../../', 'raw_data/countries_deaths.csv')
const recoveredDataFilePath = path.join(__dirname, '../../../', 'raw_data/countries_recovered.csv')

export default async function fixNames () {
  try {
    console.log('\n*** Initializing name fix ***\n')
    await Promise.all([processFile(confirmedDataFilePath), processFile(deathsDataFilePath), processFile(recoveredDataFilePath)])
    console.log('\n*** Name fix completed ***\n')
  } catch (error) {
    console.log('\n*** Name fix failed ***\n')
    console.log(error)
  }
}

async function processFile (csvFilePath) {
  console.log(`Processing file ${csvFilePath}`)
  try {
    console.log(`Reading file ${csvFilePath}`)
    const data = await readCsvFile(csvFilePath)

    console.log(`Writing to file ${csvFilePath}`)
    await writeCsvFile(csvFilePath, data)
  } catch (error) {
    console.log(`Failed to process file ${csvFilePath}`)
    console.log(error)
  }
}

function readCsvFile (csvFilePath) {
  const data = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(fastcsv.parse({ headers: true }))
      .on('data', (row) => {
        if (Object.keys(row).length !== 0) {
          const currentCountryName = row['Country/Region']
          const currentProvinceName = row['Province/State']

          if (currentCountryName !== undefined && countryRenameMap[currentCountryName] !== undefined) {
            row['Country/Region'] = countryRenameMap[currentCountryName]
          } else if (currentProvinceName !== undefined && provinceToCountryMap[currentProvinceName] !== undefined) {
            row['Country/Region'] = provinceToCountryMap[currentProvinceName]
          }

          data.push(row)
        }
      })
      .on('end', () => {
        resolve(data)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

async function writeCsvFile (csvFilePath, data) {
  const csv = new ObjectsToCsv(data)
  try {
    await csv.toDisk(csvFilePath)
  } catch (error) {
    console.log(error)
  }
}
