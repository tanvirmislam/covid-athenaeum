import fixNames from './csv/countries_data_name_columns_fixer'

async function scrapeCsv () {
  try {
    await fixNames()
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

async function scrapeJson () {
  return true
}

export { scrapeCsv, scrapeJson }
