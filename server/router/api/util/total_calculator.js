async function getLatestTotalCount (collectionClient) {
  let total = 0
  const data = await collectionClient.find({}, { projection: { _id: 0 } }).toArray()

  data.forEach((entry) => {
    const count = entry[Object.keys(entry).pop()]
    total += count
  })

  return total
}

export { getLatestTotalCount }
