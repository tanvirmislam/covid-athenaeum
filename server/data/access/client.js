const mongodb = require('mongodb');

export default class Client {

    constructor(config) {
        this._dbclient = undefined;
        this._isConnected = false;
        this._config = config
    }

    get dbclient()      { return this._dbclient; }
    get isConnected()   { return this._isConnectionInitialized; }

    async connect() {
        try {
            const client = await mongodb.MongoClient.connect(
                this._config['url'],
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            );

            this._dbclient = client.db(this._config['db']);
            this._isConnected = true;
        }
        catch(err) {
            console.log(err);
            this._dbclient = undefined;
            this._isConnected = false;
        }
    }
}

