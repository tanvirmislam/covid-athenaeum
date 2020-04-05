import fetch from './fetcher/fetcher'
import scrape from './scraper/scraper'
import load from './loader/loader'

export default async function setup (config) {
  try {
    let status

    status = await fetch()
    if (!status) {
      return
    }

    status = await scrape()
    if (!status) {
      return
    }

    await load(config.user, config.password)
  } catch (error) {
    console.log(error)
  }
}
