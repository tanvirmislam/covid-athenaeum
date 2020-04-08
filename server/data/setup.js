import fetch from './fetcher/fetcher'
import { scrapeCsv, scrapeJson } from './scraper/scraper'
import format from './csv2json/json_formatter'
import load from './loader/loader'

export default async function setup (config) {
  try {
    let status

    status = await fetch()
    if (!status) {
      return
    }

    status = await scrapeCsv()
    if (!status) {
      return
    }

    status = await format()
    if (!status) {
      return
    }

    status = await scrapeJson()
    if (!status) {
      return
    }

    await load(config.user, config.password)
  } catch (error) {
    console.log(error)
  }
}
