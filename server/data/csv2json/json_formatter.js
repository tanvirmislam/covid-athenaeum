import formatCoutriesData from './countries_data_formatter'
import formatUSAData from './usa_data_formatter.js'

export default async function format () {
  try {
    await Promise.all([formatCoutriesData(), formatUSAData()])
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
