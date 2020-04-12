import { getCollectionClient, getCollectionClientFromEndpoint } from '../../data/access/dbaccess'
import { getGlobalCountOfDate } from './util/global_countries_data_calculator'
import { getValidCountriesDataRequestParams } from './util/valid_param_extractor'
import { getLatestDate } from './util/latest_date_calculator'
import { mergeProvinceData } from './util/countries_province_data_merger'

const express = require('express')
const router = express.Router()

// Get Posts
router.get('/countries/:status', async (request, response) => {
  try {
    const collection = await getCollectionClientFromEndpoint(request.path)

    if (collection === undefined) {
      const error = { error: 'Invalid countries data endpoint', accepted: ['/countries/confirmed', '/countries/deaths', '/countries/recovered'] }
      response.json(error)
    } else {
      const params = getValidCountriesDataRequestParams(request)

      if (params === undefined) {
        const error = { error: 'Invalid request parameters' }
        response.json(error)
      } else {
        const match = {}

        const projection = {
          _id: 0,
          'province/state': 1,
          'country/region': 1,
          lat: 1,
          long: 1
        }

        const dataProjection = {
          $filter: {
            input: '$data',
            as: 'data',
            cond: undefined
          }
        }
        let filterCond = {}

        if (params.country !== 'all') {
          match['country/region'] = params.country
        }

        if (params.onlyLatest === true) {
          const latestDate = await getLatestDate(collection)

          filterCond = {
            $eq: ['$$data.date', latestDate]
          }
        } else {
          if (params.dateFrom !== 'start' && params.dateTo !== 'end') {
            filterCond = {
              $and: [
                { $gte: ['$$data.date', params.dateFrom] },
                { $lte: ['$$data.date', params.dateTo] }
              ]
            }
          } else if (params.dateFrom !== 'start') {
            filterCond = {
              $gte: ['$$data.date', params.dateFrom]
            }
          } else {
            filterCond = {
              $lte: ['$$data.date', params.dateTo]
            }
          }
        }

        dataProjection.$filter.cond = filterCond
        projection.data = dataProjection

        const pipeline = [
          { $match: match },
          { $project: projection }
        ]

        const data = await collection.aggregate(pipeline).toArray()

        if (params.detailed === true) {
          response.send(data)
        } else {
          const dataWithProvincesCountMerged = await mergeProvinceData(data)
          response.send(dataWithProvincesCountMerged)
        }
      }
    }
  } catch (error) {
    response.send(error)
  }
})

router.get('/global', async (request, response) => {
  try {
    const confirmedCollectionClient = await getCollectionClient('countries_confirmed')

    const [deathsCollectionClient, recoveredCollectionClient, latestDate] = await Promise.all(
      [
        getCollectionClient('countries_deaths'),
        getCollectionClient('countries_recovered'),
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

    response.json(
      {
        confirmed: globalConfirmed,
        deaths: globalDeaths,
        recovered: globalRecovered
      }
    )
  } catch (error) {
    response.send(error)
  }
})

router.get('/summary/:country', async (request, response) => {
  try {
    const confirmedCollectionClient = await getCollectionClient('countries_confirmed')

    const [deathsCollectionClient, recoveredCollectionClient, latestDate] = await Promise.all(
      [
        getCollectionClient('countries_deaths'),
        getCollectionClient('countries_recovered'),
        getLatestDate(confirmedCollectionClient)
      ]
    )

    const match = {
      'country/region': request.params.country.toLowerCase()
    }

    const projection = {
      _id: 0,
      'province/state': 1,
      'country/region': 1,
      lat: 1,
      long: 1,
      data: {
        $filter: {
          input: '$data',
          as: 'data',
          cond: { $eq: ['$$data.date', latestDate] }
        }
      }
    }

    const pipeline = [
      { $match: match },
      { $project: projection }
    ]

    const [confirmedData, deathsData, recoveredData] = await Promise.all(
      [
        confirmedCollectionClient.aggregate(pipeline).toArray(),
        deathsCollectionClient.aggregate(pipeline).toArray(),
        recoveredCollectionClient.aggregate(pipeline).toArray()
      ]
    )

    const [confirmedDataWithProvinceMerged, deathsDataWithProvinceMerged, recoveredDataWithProvinceMerged] = await Promise.all(
      [
        mergeProvinceData(confirmedData),
        mergeProvinceData(deathsData),
        mergeProvinceData(recoveredData)
      ]
    )

    const summary = {
      'province/state': '',
      'country/region': confirmedDataWithProvinceMerged[0]['country/region'],
      lat: confirmedDataWithProvinceMerged[0].lat,
      long: confirmedDataWithProvinceMerged[0].long,
      data: {
        date: latestDate,
        confirmed: confirmedDataWithProvinceMerged[0].data[0].count,
        deaths: deathsDataWithProvinceMerged[0].data[0].count,
        recovered: recoveredDataWithProvinceMerged[0].data[0].count,
        mortalityRate: (deathsDataWithProvinceMerged[0].data[0].count / confirmedDataWithProvinceMerged[0].data[0].count).toFixed(5),
        recoveryRate: (recoveredDataWithProvinceMerged[0].data[0].count / confirmedDataWithProvinceMerged[0].data[0].count).toFixed(5)
      }
    }

    response.json(summary)
  } catch (error) {
    response.send(error)
  }
})

module.exports = router
