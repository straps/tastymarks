import https from 'https'
import secrets from '../config/server-secrets'

const sendNotification = (data) => {
  data.app_id = secrets.onesignal.appId

  console.log('sendNotification, data=', data)

  let headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": secrets.onesignal.authorization
  }

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  }

  var req = https.request(options, function (res) {
    res.on('data', function (data) {
      console.log("Response:")
      console.log(JSON.parse(data))
    })
  })

  req.on('error', function (e) {
    console.log("ERROR:")
    console.log(e)
  })

  req.write(JSON.stringify(data))

  req.end()
}

export default sendNotification
