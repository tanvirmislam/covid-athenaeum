export const state = () => ({
  url: {
    worldMapData: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    covidData: {
      countriesConfirmed: 'api/countries/confirmed',
      countriesDeaths: 'api/countries/deaths',
      countriesRecovered: 'api/countries/recovered',
      global: 'api/global',
      countrySummaryBase: 'api/summary'
    }
  }
})

export const getters = {
  url: state => state.url
}
