import { getCollectionClientFromEndpoint } from '../../data/access/dbaccess'
import { getGlobalCountOfDate } from './util/global_countries_data_calculator'
import { getValidCountriesDataRequestParams } from './util/valid_param_extractor'
import { getLatestDate } from './util/latest_date_calculator'

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
      const params = getValidCountriesDataRequestParams(request)
      console.log(params)

      if (params === undefined) {
        const error = { error: 'Invalid request parameters' }
        response.send(JSON.stringify(error))
      } else {
        const match = {}

        const projection = {
          _id: 0,
          'province/state': 1,
          'country/region': 1,
          Lat: 1,
          Long: 1
        }

        let dataProjectionFilterCondition = {}
        const dataProjection = {
          $filter: {
            input: '$data',
            as: 'data',
            cond: undefined
          }
        }

        if (params.country !== 'all') {
          match['country/region'] = params.country
        }

        if (params.onlyLatest === true) {
          const latestDate = await getLatestDate(collection)

          dataProjectionFilterCondition = {
            $eq: ['$$data.date', latestDate]
          }
        } else {
          if (params.dateFrom !== 'start' && params.dateTo !== 'end') {
            dataProjectionFilterCondition = {
              $and: [
                { $gte: ['$$data.date', params.dateFrom] },
                { $lte: ['$$data.date', params.dateTo] }
              ]
            }
          } else if (params.dateFrom !== 'start') {
            dataProjectionFilterCondition = {
              $gte: ['$$data.date', params.dateFrom]
            }
          } else {
            dataProjectionFilterCondition = {
              $lte: ['$$data.date', params.dateTo]
            }
          }
        }

        dataProjection.$filter.cond = dataProjectionFilterCondition
        projection.data = dataProjection

        const pipeline = [
          { $match: match },
          { $project: projection }
        ]

        const data = await collection.aggregate(pipeline).toArray()

        if (params.detailed === true) {
          response.send(data)
        } else {
          const countryNameToData = {}

          data.forEach((entry) => {
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

          response.send(Object.values(countryNameToData))
        }
      }
    }
  } catch (error) {
    response.send(error)
  }
})

router.get('/global', async (request, response) => {
  try {
    const confirmedCollectionClient = await getCollectionClientFromEndpoint('/countries/confirmed')

    const [deathsCollectionClient, recoveredCollectionClient, latestDate] = await Promise.all(
      [
        getCollectionClientFromEndpoint('/countries/deaths'),
        getCollectionClientFromEndpoint('/countries/recovered'),
        getLatestDate(confirmedCollectionClient)
      ]
    )

    const [globalConfirmed, globalDeaths, globalRecovered] = await Promise.all(
      [
        getGlobalCountOfDate(confirmedCollectionClient, latestDate),
        getGlobalCountOfDate(deathsCollectionClient, latestDate),
        getGlobalCountOfDate(recoveredCollectionClient, latestDate)
      ]
    )

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
