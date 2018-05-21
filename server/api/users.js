import Router from 'express-promise-router'
import { Client } from 'pg'
import secrets from '../config/server-secrets'
import download from '../plugins/download'
import sendNotification from '../plugins/onesignal'

const router = new Router()
const client = new Client(secrets.db);

client.connect();

router.get('/users/active', async (req, res, next) => {
  const qres = await client.query(`select count(bookmarks.id) as nrbookmarks, userid, users.name
    from bookmarks join users on bookmarks.userid=users.id
    where modified>now()-interval '30 days'
    group by userid,name order by nrbookmarks desc limit 5`)
  res.json(qres.rows)
})

let loadSubscriptions = async (userid) => {
  const usersubs = await client.query('select * from usersubs where userid=$1', [userid])
  const tagsubs = await client.query('select * from tagsubs where userid=$1', [userid])
  return {
    userid: userid,
    users: usersubs.rows.map((o) => o.targetuserid),
    tags: tagsubs.rows.map((o) => o.tag)
  }
}

router.get('/userinfo/:id?', async (req, res, next) => {
  const cond = req.params.id>0 ? `id=${req.params.id}` : `email='${req.query.email}'`;
  const qres = await client.query(`select id,name,gender,locale from users where ${cond}`)
  const user = qres.rows[0]
  res.json({
    user: user
  })
})

router.get('/user/:id/subscriptions', async (req, res, next) => {
  const userid = req.params.id;
  res.json(await loadSubscriptions(userid))
})

router.post('/user/:login?', async (req, res, next) => {
  let rv, qsel = await client.query('select id from users where email=$1', [req.body.user.email])
  if (qsel.rows.length){
    await client.query('update users set name=$1, gender=$2, locale=$3 where id=$4', [
      req.body.user.name,
      req.body.user.gender,
      req.body.user.locale,
      qsel.rows[0].id
    ])
    rv = Object.assign({}, req.body.user, { id: qsel.rows[0].id })
  }else{
    qsel = await client.query('insert into users values (DEFAULT, $1, $2, $3, $4) returning *', [
      req.body.user.name,
      req.body.user.email,
      req.body.user.gender,
      req.body.user.locale
    ])
    rv = qsel.rows[0]
  }

  if (req.body.user.picture){
    // Update avatar image saving google picture
    const avatarUrl = `/images/avatars/${rv.id}.jpg`
    const avatarFile = `${process.cwd()}/static${avatarUrl}`
    await download(req.body.user.picture, avatarFile)
  }

  if (req.params.login){
    req.session.authUser = rv
  }

  res.json(rv)
})

router.post('/logout', (req, res, next) => {
  delete req.session.authUser
  res.json({err:null})
})

export default router
