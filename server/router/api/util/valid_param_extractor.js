function getValidCountriesDataRequestParams (request) {
  let country
  let dateFrom
  let dateTo
  let onlyLatest
  let detailed

  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20|21|22)\d{2}$/g

  if (request.query.country === undefined) {
    country = 'all'
  } else {
    country = request.query.country.toLowerCase()
  }

  if (request.query.dateFrom === undefined) {
    dateFrom = 'start'
  } else {
    const requestedDateFrom = request.query.dateFrom.toString()
    const match = requestedDateFrom.match(dateRegex)
    if (match === null || match.length !== 1 || requestedDateFrom !== match[0]) {
      return undefined
    } else {
      dateFrom = requestedDateFrom
    }
  }

  if (request.query.dateTo === undefined) {
    dateTo = 'end'
  } else {
    const requestedDateTo = request.query.dateTo.toString()
    const match = requestedDateTo.match(dateRegex)
    if (match === null || match.length !== 1 || requestedDateTo !== match[0]) {
      return undefined
    } else {
      dateTo = requestedDateTo
    }
  }

  if (request.query.onlyLatest === undefined) {
    onlyLatest = false
  } else {
    if (request.query.onlyLatest !== 'true' && request.query.onlyLatest !== 'false') {
      return undefined
    } else {
      onlyLatest = (request.query.onlyLatest === 'true')
    }
  }

  if (request.query.detailed === undefined) {
    detailed = false
  } else {
    if (request.query.detailed !== 'true' && request.query.detailed !== 'false') {
      return undefined
    } else {
      detailed = (request.query.detailed === 'true')
    }
  }

  return {
    country: country,
    dateFrom: dateFrom,
    dateTo: dateTo,
    onlyLatest: onlyLatest,
    detailed: detailed
  }
}

export { getValidCountriesDataRequestParams }
