import fetch from './fetcher/fetcher'
import { scrapeCsv, scrapeJson } from './scraper/scraper'
import format from './csv2json/json_formatter'
import load from './loader/loader'

export default async function setup () {
  try {
    let status

    status = await fetch()
    if (!status) {
      console.log('setup: Failed to fetch')
      return
    }

    status = await scrapeCsv()
    if (!status) {
      console.log('setup: Failed to scrape CSV file(s)')
      return
    }

    status = await format()
    if (!status) {
      console.log('setup: Failed to format the file(s)')
      return
    }

    status = await scrapeJson()
    if (!status) {
      console.log('setup: Failed to scrape JSON file(s)')
      return
    }

    status = await load()
    if (!status) {
      console.log('setup: Failed to load the data into the database')
    }
  } catch (error) {
    console.log(error)
  }
}
