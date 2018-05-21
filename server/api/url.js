import Router from 'express-promise-router'
import Puppeteer from 'puppeteer'
import fs from 'fs'
import request  from 'request';
import cheerio  from 'cheerio';

const router = new Router()

let browser = null;

router.get('/urlimg', async function (req, res, next) {
  const url = req.query.url
  if (url){
    const filename = url.toLowerCase().replace(/[^a-z0-9_-]/g, "__")+'.png'
    const filepath = `${process.cwd()}/static/images/urlimg/${filename}`

    let createScreenshot = !fs.existsSync(filepath)
    if (!createScreenshot) {
      // every week force recreation
      let mtimeDiff = new Date() - fs.statSync(filepath).mtime
      console.log(`Screenshot for "${url}" modified ${(mtimeDiff/3600000).toFixed(1)} hours from now`)
      createScreenshot = mtimeDiff > 604800000 // 3600*24*7*1000
    }

    if (createScreenshot){
      console.log(`Creating screenshot for "${url}" in "${filepath}"`)
      if (!browser) {
        browser = await Puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      }
      const page = await browser.newPage()
      await page.setViewport({ width: 800, height: 600 })
      await page.goto(url, { waitUntil: 'networkidle2' })
      await page.screenshot({ path: filepath })
      await page.close()
    }

    res.sendFile(filepath)
  }else{
    res.json({err:'url get parameter required'})
  }
})

router.get('/urltitle', async function (req, res, next) {
  const url = req.query.url
  if (url) {

    request({uri: url, timeout: 1000}, function (error, response, body) {
      var output = ''

      if (!error && response.statusCode === 200 && body.length < 1000000) {
        var $ = cheerio.load(body)
        output = $("head > title").text().trim()
      }

      res.json({title: output})
    })

  } else {
    res.json({ err: 'url get parameter required' })
  }
})

export default router
