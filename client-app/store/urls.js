export const state = () => ({
  url: {
    worldMapData: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    covidData: {
      countriesConfirmed: 'https://covid-athenaeum.herokuapp.com/api/countries/confirmed',
      countriesLatestConfirmed: 'https://covid-athenaeum.herokuapp.com/api/countries/confirmed?onlyLatest=true',
      countriesDeaths: 'https://covid-athenaeum.herokuapp.com/api/countries/deaths',
      countriesLatestDeaths: 'https://covid-athenaeum.herokuapp.com/api/countries/deaths?onlyLatest=true',
      countriesRecovered: 'https://covid-athenaeum.herokuapp.com/api/countries/recovered',
      countriesLatestRecovered: 'https://covid-athenaeum.herokuapp.com/api/countries/recovered?onlyLatest=true',
      global: 'https://covid-athenaeum.herokuapp.com/api/global'
    }
  }
})

export const getters = {
  url: state => state.url
}
