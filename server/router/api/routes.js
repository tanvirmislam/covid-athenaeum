import { getCollectionClient } from '../../data/access/dbaccess'

const express = require('express')
const router = express.Router()

// Get Posts
router.get('/global/:status', async (request, response) => {
  try {
    const collection = await getCollectionClient(request.path)

    if (collection === undefined) {
      const error = { error: 'Invalid global status endpoint', accepted: ['/global/confirmed', '/global/deaths', '/global/recovered'] }
      response.send(JSON.stringify(error))
    } else {
      response.send(await collection.find({}, { projection: { _id: 0 } }).toArray())
    }
  } catch (err) {
    response.send(err)
  }
})

module.exports = router
