export const state = () => ({
  url: {
    worldMapDataUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    covid: {
      countriesConfirmedDataApiPath: 'api/countries/confirmed',
      countriesDeathsDataApiPath: 'api/countries/deaths',
      countriesRecoveredDataApiPath: 'api/countries/recovered',
      globalDataApiPath: 'api/global',
      countrySummaryBaseDataApiPath: 'api/summary'
    }
  }
})

export const getters = {
  url: state => state.url
}
