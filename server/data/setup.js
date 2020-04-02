import fetch from './fetcher/fetcher'
import load from './loader/loader'

export default async function setup (config) {
  await fetch()
  await load(config.user, config.password)
}
