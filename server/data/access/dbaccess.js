import getConfig from '../config';
import Client from './client';

const config = getConfig();
var singletonClient = undefined;

async function getDbClient() {
    if (singletonClient === undefined) {
        singletonClient = new Client(config);
    }

    if (!singletonClient.isConnected) {
        try {
            await singletonClient.connect();
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }

    return singletonClient.dbclient;
}

async function getCollectionClient(endpoint) {
    if (config['endpointToCollection'][endpoint] === undefined) {
        return undefined;
    }

    const collectionName = config['endpointToCollection'][endpoint];
    const dbclient = await getDbClient();

    return dbclient.collection(collectionName);
}

export { getDbClient, getCollectionClient };
