export default function mergeProvinceData (detailedCountriesData) {
  const countryNameToData = {}

  return new Promise((resolve, reject) => {
    try {
      detailedCountriesData.forEach((entry) => {
        const name = entry['country/region']

        if (countryNameToData[name] === undefined) {
          entry['province/state'] = ''
          countryNameToData[name] = entry
        } else {
          for (let i = 0; i < entry.data.length; ++i) {
            const total = parseInt(countryNameToData[name].data[i].count) + parseInt(entry.data[i].count)
            countryNameToData[name].data[i].count = total.toString()
          }
        }
      })

      return Object.values(countryNameToData)
    } catch (error) {
      reject(error)
    }
  })
}
