const mongodb = require('mongodb')

export default class Client {
  constructor (user, password, host, db) {
    this._dbclient = undefined
    this._isConnected = false
    this._user = user
    this._password = password
    this._host = host
    this._db = db
    this._uri = `mongodb+srv://${user}:${password}@${host}/${db}`
  }

  get dbclient () { return this._dbclient }
  get isConnected () { return this._isConnectionInitialized }

  async connect () {
    try {
      const client = await mongodb.MongoClient.connect(
        this._uri,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      )

      this._dbclient = client.db(this._db)
      this._isConnected = true
    } catch (err) {
      console.log(err)
      this._dbclient = undefined
      this._isConnected = false
    }
  }
}
