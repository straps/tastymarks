import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { Nuxt, Builder } from 'nuxt'
import pg from 'pg'
import connectPgSimple from 'connect-pg-simple'
import secrets from './config/server-secrets.js'
import nuxtConfig from '../nuxt.config.js'
import forceDomain from 'express-force-domain'
import greenlock from 'greenlock-express'
import ConsoleStamp from 'console-stamp'
import path from 'path'
import os from 'os'

ConsoleStamp(console, {pattern:'yyyy-mm-dd HH:MM:ss'})

import api from './api'

const app = express()
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || (dev ? 3000 : 80)

app.use(cookieParser(secrets.session.key));

const pgSession = connectPgSimple(session)
const pgPool = new pg.Pool(secrets.db);

app.use(session({
  store: new pgSession({
    pool: pgPool
  }),
  secret: secrets.session.key,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.set('port', port)

if (!dev) {
  app.use(forceDomain('https://tastymarks.com'));
}

//Check Auth
app.use((req, res, next) => {
  if (req.method==='GET' ||
      req.session.authUser ||
      req.url.indexOf('/api/user')===0){
    next()
  } else {
    res.status(401).send({ error: 'Unauthorized' });
  }
})

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
let config = nuxtConfig
config.dev = dev

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

if (dev) {
  app.listen(port)
  console.log('Server listening on port ' + port)
} else {

  // https://www.npmjs.com/package/greenlock-express
  greenlock.create({
    // Let's Encrypt v2 is ACME draft 11
    version: 'draft-11'
    // You MUST change 'acme-staging-v02' to 'acme-v02' in production
    , server: 'https://acme-v02.api.letsencrypt.org/directory'  // staging
    // You MUST change this to a valid email address
    , email: 'fstraps@gmail.com'
    // You MUST NOT build clients that accept the ToS without asking the user
    , agreeTos: true
    // You MUST change these to valid domains
    // NOTE: all domains will validated and listed on the certificate
    , approveDomains: ['tastymarks.com', 'www.tastymarks.com']
    // You MUST have access to write to directory where certs are saved
    // ex: /home/foouser/acme/etc
    , configDir: path.join(os.homedir(), 'certs')
    , app
  }).listen(80, 443);
}
