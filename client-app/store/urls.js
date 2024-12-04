const BASE_URL = process.env.NUXT_CLIENT_BASE_URL

export const state = () => ({
  url: {
    worldMapData: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    covidData: {
      countriesConfirmed: `${BASE_URL}/api/countries/confirmed`,
      countriesDeaths: `${BASE_URL}/api/countries/deaths`,
      countriesRecovered: `${BASE_URL}/api/countries/recovered`,
      global: `${BASE_URL}/api/global`,
      countrySummaryBase: `${BASE_URL}/api/summary`
    }
  }
})

export const getters = {
  url: state => state.url
}
