import Router from 'express-promise-router'
import { Client } from 'pg'
import secrets from '../config/server-secrets'

const router = new Router()
const client = new Client(secrets.db);

client.connect();

//Subscription to users
router.post('/subscribe/:userid/to/user/:targetuserid', async function (req, res, next) {
  const qres = await client.query('insert into usersubs values ($1, $2) returning *', [req.params.userid, req.params.targetuserid])

  res.json(qres.rows[0])
})
router.post('/unsubscribe/:userid/from/user/:targetuserid', async function (req, res, next) {
  const qres = await client.query('delete from usersubs where userid=$1 and targetuserid=$2', [req.params.userid, req.params.targetuserid])

  res.json({err: null})
})

//Subscriptions to tags
router.post('/subscribe/:userid/to/tag/:tag', async function (req, res, next) {
  const qres = await client.query('insert into tagsubs values ($1, $2) returning *', [req.params.userid, req.params.tag])

  res.json(qres.rows[0])
})
router.post('/unsubscribe/:userid/from/tag/:tag', async function (req, res, next) {
  const qres = await client.query('delete from tagsubs where userid=$1 and tag=$2', [req.params.userid, req.params.tag])

  res.json({err: null})
})


export default router
