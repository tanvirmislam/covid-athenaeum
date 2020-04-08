async function getLatestDate (collection) {
  const latestDateQueryResponse = await collection.aggregate([
    { $limit: 1 },
    { $unwind: '$data' },
    { $group: { _id: '$country/region', latestDate: { $last: '$data.date' } } }
  ]).toArray()

  return latestDateQueryResponse[0].latestDate
}

export { getLatestDate }
