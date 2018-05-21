import Router from 'express-promise-router'
import { Client } from 'pg'
import secrets from '../config/server-secrets'

const router = new Router()
const client = new Client(secrets.db);

client.connect();

router.get('/tag/cloud/:userid?/:daysback?/', async function (req, res, next) {
  const usercond=req.params.userid>0 ? `bookmarks.userid=${req.params.userid}` : 'true'
  const dayscond = req.params.daysback>0 ? `bookmarks.modified>now()-interval '${req.params.daysback} days'`:'true'
  const q =`select tag, count(tag) as count
            from tags join bookmarks on tags.bookmarkid=bookmarks.id
            where ${dayscond} and ${usercond}
            group by tags.tag
            order by tag`
  const qres = await client.query(q)

  res.json(qres.rows)
})

export default router
