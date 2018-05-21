import { Router } from 'express'
import BodyParser from 'body-parser'

import users from './users'
import bookmarks from './bookmarks'
import url from './url'
import tags from './tags'
import subscriptions from './subscriptions'

const router = Router()

router.use(BodyParser.json())

// Add USERS Routes
router.use(users)
router.use(bookmarks)
router.use(url)
router.use(tags)
router.use(subscriptions)

export default router
