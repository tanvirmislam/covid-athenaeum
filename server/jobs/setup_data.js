import setup from '../data/setup'

const config = getValidCmdArgs()

if (Object.keys(config).length === 0) {
  console.log('setup_data::error - Failed to setup raw data')
} else {
  setup(config)
    .then(() => { console.log('Setup Completed.') })
    .catch(error => { console.log(error) })
}

function getValidCmdArgs () {
  if (process.argv.length !== 6) {
    console.log('Invalid arguments')
    return {}
  } else if (!process.argv.includes('-u', '-p')) {
    console.log('Could not find -u or -p indicators in the arguments')
    return {}
  } else {
    const user = process.argv[process.argv.findIndex(element => element === '-u') + 1]
    const password = process.argv[process.argv.findIndex(element => element === '-p') + 1]

    if (user === undefined || password === undefined) {
      console.log('Could not retreive username or password from the arguments')
      return {}
    }

    return {
      user: user,
      password: password
    }
  }
}
