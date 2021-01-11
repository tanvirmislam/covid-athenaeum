const path = require('path')
const fs = require('fs')
const fastcsv = require('fast-csv')

const dailyDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/usa_daily.csv')
const statesDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/usa_states.csv')
const totalDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/usa_total.csv')
const infoPortalDataCsvFilePath = path.join(__dirname, '../../../', 'raw-data/csv/usa_states_info_portals.csv')

const dailyDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/usa_daily.json')
const statesDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/usa_states.json')
const totalDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/usa_total.json')
const infoPortalDataJsonFilePath = path.join(__dirname, '../../../', 'raw-data/json/usa_states_info_portals.json')

export default async function formatUSAData () {
  try {
    console.log('\n*** Initializing USA data conversion ***\n')

    console.log('Reading data from CSV')
    const [daily, states, total, infoPortal] = await Promise.all(
      [
        getObjectsFromCsvFile(dailyDataCsvFilePath, 'daily'),
        getObjectsFromCsvFile(statesDataCsvFilePath, 'states'),
        getObjectsFromCsvFile(totalDataCsvFilePath, 'total'),
        getObjectsFromCsvFile(infoPortalDataCsvFilePath, 'infoPortal')
      ]
    )

    console.log('Writing data as JSON')
    await Promise.all(
      [
        fs.writeFile(dailyDataJsonFilePath, JSON.stringify(daily), (error) => console.log((error === null) ? `done: ${dailyDataJsonFilePath}` : error)),
        fs.writeFile(statesDataJsonFilePath, JSON.stringify(states), (error) => console.log((error === null) ? `done: ${statesDataJsonFilePath}` : error)),
        fs.writeFile(totalDataJsonFilePath, JSON.stringify(total), (error) => console.log((error === null) ? `done: ${totalDataJsonFilePath}` : error)),
        fs.writeFile(infoPortalDataJsonFilePath, JSON.stringify(infoPortal), (error) => console.log((error === null) ? `done: ${infoPortalDataJsonFilePath}` : error))
      ]
    )

    console.log('\n*** USA data conversion completed ***\n')
  } catch (error) {
    console.log('\n*** USA data conversion failed ***\n')
    console.log(error)
  }
}

function getObjectsFromCsvFile (csvFilePath, type) {
  const data = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(fastcsv.parse({ headers: true }))
      .on('data', (row) => {
        const formattedRow = {}

        switch (type) {
          case 'daily': {
            Object.keys(row).forEach((field) => {
              if (field !== 'hash' && field !== 'notes') {
                if (field === 'date') {
                  const dd = row[field].toString().slice(-2)
                  const mm = row[field].toString().slice(-4, -2)
                  const yyyy = row[field].toString().slice(-8, -4)

                  formattedRow.date = new Date(`${mm}/${dd}/${yyyy}`)
                } else {
                  formattedRow[field] = row[field]
                }
              }
            })
            break
          }

          case 'states': {
            Object.keys(row).forEach((field) => {
              if (field !== 'hash' && field !== 'notes') {
                if (field === 'dateModified' || field === 'dateChecked') {
                  const date = new Date(row[field].toString())

                  const mm = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1).toString()
                  const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString()
                  const yyyy = date.getFullYear().toString()

                  formattedRow[field] = `${mm}/${dd}/${yyyy}`
                } else {
                  formattedRow[field] = row[field]
                }
              }
            })
            break
          }

          case 'total': {
            const disregardedFields = ['hash', 'notes', 'posNeg', 'total', 'hospitalized']

            Object.keys(row).forEach((field) => {
              if (!disregardedFields.includes(field)) {
                formattedRow[field] = row[field]
              }
            })
            break
          }

          case 'infoPortal': {
            Object.keys(row).forEach((field) => {
              formattedRow[field] = row[field]
            })
            break
          }

          default: {
            break
          }
        }

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
