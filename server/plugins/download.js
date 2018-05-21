import fs from 'fs'
import request from 'request'

/* Usage: download('https://www.google.com/images/srpr/logo3w.png', 'google.png').then(() {
  console.log('done');
}); */

const download = (uri, filename) => {
  // console.log('download', uri, filename)
  return new Promise((resolve, reject) => {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
  })
}

export default download
