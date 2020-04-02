import getDbConfig from '../config'

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const downloadURLs = getDbConfig().collectionToRawDataURL

async function downloadFile (filename, url) {
  const outputPath = path.join(__dirname, '../../../', `raw_data/${filename}.csv`)
  const writer = fs.createWriteStream(outputPath)

  try {
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  } catch (err) {
    console.log(`fetcher::downloadFile error - unable to download files\n${err}`)
  }
}

export default async function fetch () {
  for (const [filename, url] of Object.entries(downloadURLs)) {
    await downloadFile(filename, url)
    console.log(`Download completed: ${filename}`)
  }
}
