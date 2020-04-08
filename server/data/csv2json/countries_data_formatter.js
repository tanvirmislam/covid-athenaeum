const path = require('path')
const fs = require('fs')
const fastcsv = require('fast-csv')

const notDateFields = ['province/state', 'country/region', 'lat', 'long']

const confirmedDataCsvFilePath = path.join(__dirname, '../../../', 'raw_data/csv/countries_confirmed.csv')
const deathsDataCsvFilePath = path.join(__dirname, '../../../', 'raw_data/csv/countries_deaths.csv')
const recoveredDataCsvFilePath = path.join(__dirname, '../../../', 'raw_data/csv/countries_recovered.csv')

const confirmedDataJsonFilePath = path.join(__dirname, '../../../', 'raw_data/json/countries_confirmed.json')
const deathsDataJsonFilePath = path.join(__dirname, '../../../', 'raw_data/json/countries_deaths.json')
const recoveredDataJsonFilePath = path.join(__dirname, '../../../', 'raw_data/json/countries_recovered.json')

export default async function formatCoutriesData () {
  try {
    console.log('\n*** Initializing countries data conversion ***\n')

    console.log('Reading data from CSV')
    const [confirmed, deaths, recovered] = await Promise.all(
      [
        getObjectsFromCsvFile(confirmedDataCsvFilePath),
        getObjectsFromCsvFile(deathsDataCsvFilePath),
        getObjectsFromCsvFile(recoveredDataCsvFilePath)
      ]
    )

    console.log('Writing data as JSON')
    await Promise.all(
      [
        fs.writeFile(confirmedDataJsonFilePath, JSON.stringify(confirmed), (error) => console.log((error === null) ? `done: ${confirmedDataJsonFilePath}` : error)),
        fs.writeFile(deathsDataJsonFilePath, JSON.stringify(deaths), (error) => console.log((error === null) ? `done: ${deathsDataJsonFilePath}` : error)),
        fs.writeFile(recoveredDataJsonFilePath, JSON.stringify(recovered), (error) => console.log((error === null) ? `done: ${recoveredDataJsonFilePath}` : error))
      ]
    )

    console.log('\n*** Countries data conversion completed ***\n')
  } catch (error) {
    console.log('\n*** Countries data conversion failed ***\n')
    console.log(error)
  }
}

function getObjectsFromCsvFile (csvFilePath) {
  const data = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(fastcsv.parse({ headers: true }))
      .on('data', (row) => {
        const formattedRow = {}
        const countData = []

        Object.keys(row).forEach((field) => {
          if (notDateFields.includes(field)) {
            formattedRow[field] = row[field]
          } else {
            const date = new Date(field)

            const mm = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1).toString()
            const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString()
            const yyyy = date.getFullYear().toString()

            countData.push(
              {
                date: `${mm}/${dd}/${yyyy}`,
                count: row[field]
              }
            )
          }
        })

        formattedRow.data = countData
        data.push(formattedRow)
      })
      .on('end', () => {
        resolve(data)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
