import Router from 'express-promise-router'
import { Client } from 'pg'
import secrets from '../config/server-secrets'
import sendNotification from '../plugins/onesignal'
import { sendMailTemplate } from '../plugins/mailgun'
import uniq from 'lodash.uniq'

const router = new Router()
const client = new Client(secrets.db);

client.connect();

const queryPrefix = `select b.id, b.url, b.title, b.notes, b.userid, b.created, b.modified,
  u.name as username,
  concat_pipe(t.tag) as tags
  from bookmarks b
    left join tags t on b.id=t.bookmarkid
    join users u on b.userid=u.id`
const querySuffix = `group by b.id, b.url, b.title, b.notes, b.userid, b.created, b.modified, u.name
  order by b.modified desc`

const getSearchCondition = (search) => {
  return `lower(b.title) like lower('%${search}%') or lower(t.tag)=lower('${search}')`
}

router.get('/bookmarks/:userid?/:tag?', async function ({params, query}, res, next) {
  const usercond=params.userid>0 ? `userid=${params.userid}` : 'true'
  const tagcond=params.tag ? `b.id in (select bookmarkid from tags where tag='${params.tag}')` : 'true'
  let q=`${queryPrefix} where ${usercond} and ${tagcond} `
  if (query.search){
    q = `${q} and (${getSearchCondition(query.search)}) `
  }
  q=`${q} ${querySuffix} limit ${query.limit||100} offset ${query.offset||0}`

  const qres = await client.query(q)

  res.json(qres.rows.map((el) => {
    el.tags=el.tags?el.tags.split('|'):[];
    el.tags = el.tags.sort();
    return el
  }))
})

router.get('/trending/bookmarks', async function ({params, query}, res, next) {
  let subq = `select max(id) as id
    from bookmarks b where modified>now()-interval '30 days'`
  if (query.search) {
    subq = `${subq} and (${getSearchCondition(query.search)})`
  }
  subq=`${subq} group by url
    order by count(id) desc, max(modified) desc
    limit ${query.limit || 100} offset ${query.offset || 0}`;
  const q=`${queryPrefix} where b.id in (${subq}) ${querySuffix}`

  const qres = await client.query(q)

  res.json(qres.rows.map((el) => {
    el.tags=el.tags?el.tags.split('|'):[];
    el.tags = el.tags.sort();
    return el
  }))
})

router.get('/bookmark/:id', async function (req, res, next) {
  const qres = await client.query(`${queryPrefix} where b.id=$1 ${querySuffix}`, [req.params.id])

  const el = qres.rows[0];
  el.tags = el.tags ? el.tags.split('|') : [];
  el.tags = el.tags.sort();
  res.json(el)
})

router.post('/bookmark/add', async function (req, res, next) {
  const bookmark = req.body.bookmark;

  let id = bookmark.id;

  if (!id) {
    let exists = await client.query('select id from bookmarks where userid=$1 and url=$2', [bookmark.userid, bookmark.url])
    id = exists.rows.length ? exists.rows[0].id : 0
  }

  if (id){  // update
    await client.query('update bookmarks set title=$1, url=$2, notes=$3, modified=now() where id=$4', [bookmark.title, bookmark.url, bookmark.notes, id])
  }else{                    // insert
    const inserted = await client.query('insert into bookmarks values (DEFAULT, $1, $2, $3, $4) returning *', [bookmark.url, bookmark.title, bookmark.notes, bookmark.userid])
    id = inserted.rows[0].id

    // Check for user subscriptions
    let user = await client.query('select * from users where id=$1', [bookmark.userid])
    user = user.rows[0]

    const subscribers = await client.query('select users.* from users join usersubs on users.id=usersubs.userid where usersubs.targetuserid=$1', [bookmark.userid])
    for (let subscriber of subscribers.rows) {
      sendNotification({
        contents: { "en": `${user.name} just added a bookmark on TastyMarks: ${bookmark.title}` },
        url: `https://tastymarks.com/user/${user.id}/bookmarks`,
        filters: [
          { "field": "tag", "key": "tasty_userid", "relation": "=", "value": subscriber.id }
        ]
      })

      sendMailTemplate(subscriber.email, 'TastyMarks notification', 'email-template', {
        title: `Bookmark added`,
        subtitle: `User ${user.name} added the following bookmark right now`,
        burl: bookmark.url,
        btitle: bookmark.title,
        unsubscribeUrl: `https://tastymarks.com/user/${user.id}/bookmarks`
      })
    }

    //TODO check for tags subscriptions

  }

  // Update tags
  bookmark.tags = uniq(bookmark.tags.map(tag => tag.trim()))
  await client.query('delete from tags where bookmarkid=$1', [id])
  for (let tag of bookmark.tags) {
    await client.query('insert into tags values ($1, $2)', [id, tag])
  }

  bookmark.id = id

  res.json({ bookmark })
})

router.post('/bookmark/del/:id', async function (req, res, next) {
  if (req.session.authUser) {
    let exists = await client.query('select id from bookmarks where id=$1 and userid=$2', [req.params.id, req.session.authUser.id])

    if (exists.rows.length) {

      await client.query('delete from bookmarks where id=$1', [req.params.id])

      res.json({ err: null })

    } else res.json({ err: 'Unauthorized' })

  } else res.json({ err: 'Unauthorized' })
})


export default router
