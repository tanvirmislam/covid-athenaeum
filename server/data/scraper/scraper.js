import fixNames from './country_name_fixer'

export default async function scrape () {
  try {
    await fixNames()
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
