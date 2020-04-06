import { getCollectionClientFromEndpoint } from '../../data/access/dbaccess'
import { getLatestTotalCount } from './util/total_calculator'

const express = require('express')
const router = express.Router()

// Get Posts
router.get('/countries/:status', async (request, response) => {
  try {
    const collection = await getCollectionClientFromEndpoint(request.path)

    if (collection === undefined) {
      const error = { error: 'Invalid countries data endpoint', accepted: ['/countries/confirmed', '/countries/deaths', '/countries/recovered'] }
      response.send(JSON.stringify(error))
    } else {
      response.send(await collection.find({}, { projection: { _id: 0 } }).toArray())
    }
  } catch (error) {
    response.send(error)
  }
})

router.get('/global', async (request, response) => {
  try {
    const confirmedCollectionClient = await getCollectionClientFromEndpoint('/countries/confirmed')
    const deathsCollectionClient = await getCollectionClientFromEndpoint('/countries/deaths')
    const recoveredCollectionClient = await getCollectionClientFromEndpoint('/countries/recovered')

    const [globalConfirmed, globalDeaths, globalRecovered] = await Promise.all(getLatestTotalCount(confirmedCollectionClient), getLatestTotalCount(deathsCollectionClient), getLatestTotalCount(recoveredCollectionClient))

    response.send(JSON.stringify(
      {
        confirmed: globalConfirmed,
        deaths: globalDeaths,
        recovered: globalRecovered
      }
    ))
  } catch (error) {
    response.send(error)
  }
})

module.exports = router
