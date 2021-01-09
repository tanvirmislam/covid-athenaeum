import getDataConfig from '../config'
import Client from './client'

const dataConfig = getDataConfig()
let singletonClient

async function getDbClient () {
  if (!singletonClient) {
    singletonClient = new Client(
      process.env.COVID_DATABASE_USERNAME,
      process.env.COVID_DATABASE_PASSWORD,
      process.env.COVID_DATABASE_HOST,
      process.env.COVID_DATABASE_NAME
    )
  }

  if (!singletonClient.isConnected) {
    try {
      await singletonClient.connect()
    } catch (err) {
      console.log(err)
      return undefined
    }
  }

  return singletonClient.dbclient
}

async function getCollectionClient (collectionName) {
  const dbclient = await getDbClient()
  return dbclient.collection(collectionName)
}

async function getCollectionClientFromEndpoint (endpoint) {
  if (dataConfig.endpointToCollection[endpoint] === undefined) {
    return undefined
  }
  const collectionName = dataConfig.endpointToCollection[endpoint]
  const dbclient = await getDbClient()
  return dbclient.collection(collectionName)
}

export { getDbClient, getCollectionClient, getCollectionClientFromEndpoint }
