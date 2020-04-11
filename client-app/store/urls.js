export const state = () => ({
  url: {
    worldMapData: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    covidData: {
      countriesConfirmed: 'https://covid-athenaeum.herokuapp.com/api/countries/confirmed',
      countriesDeaths: 'https://covid-athenaeum.herokuapp.com/api/countries/deaths',
      countriesRecovered: 'https://covid-athenaeum.herokuapp.com/api/countries/recovered',
      global: 'https://covid-athenaeum.herokuapp.com/api/global',
      countrySummaryBase: 'https://covid-athenaeum.herokuapp.com/api/summary'
    }
  }
})

export const getters = {
  url: state => state.url
}
