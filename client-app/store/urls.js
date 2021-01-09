export const state = () => ({
  url: {
    worldMapData: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    covidData: {
      countriesConfirmed: `${process.env.COVID_WEBAPP_BASE_URL}/api/countries/confirmed`,
      countriesDeaths: `${process.env.COVID_WEBAPP_BASE_URL}/api/countries/deaths`,
      countriesRecovered: `${process.env.COVID_WEBAPP_BASE_URL}/api/countries/recovered`,
      global: `${process.env.COVID_WEBAPP_BASE_URL}/api/global`,
      countrySummaryBase: `${process.env.COVID_WEBAPP_BASE_URL}/api/summary`
    }
  }
})

export const getters = {
  url: state => state.url
}
