async function getGlobalCountOfDate (collection, date) {
  const globalInfo = {
    total: 0,
    min: undefined,
    max: undefined
  }

  const countryNameToCount = {}

  const data = await collection.aggregate([
    {
      $project: {
        _id: 0,
        'country/region': '$country/region',
        data: {
          $filter: {
            input: '$data',
            as: 'data',
            cond: {
              $eq: ['$$data.date', date]
            }
          }
        }
      }
    }
  ]).toArray()

  data.forEach((entry) => {
    const name = entry['country/region']
    const count = parseInt(entry.data[0].count)

    if (countryNameToCount[name] === undefined) {
      countryNameToCount[name] = count
    } else {
      countryNameToCount[name] += count
    }

    if (globalInfo.min === undefined || countryNameToCount[name] < globalInfo.min.count) {
      globalInfo.min = { country: name, count: countryNameToCount[name] }
    }

    if (globalInfo.max === undefined || countryNameToCount[name] > globalInfo.max.count) {
      globalInfo.max = { country: name, count: countryNameToCount[name] }
    }

    globalInfo.total += count
  })

  return globalInfo
}

export { getGlobalCountOfDate }
