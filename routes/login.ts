import * as KoaRouter from 'koa-router'
const jwt = require('jsonwebtoken')

const router = new KoaRouter()
import { getOne } from '../lib/mysql'
import { RouterFormat } from './index'
import { tokenSecret } from '../config'

router.post('/', async ctx => {
  const { openid } = <{ [key: string]: any }>ctx.request.body
  let userData = await getOne(openid)
  if (userData.openid) {
    ctx.body.info = userData
    ctx.body.isNewUser = false
  } else {
    ctx.body.isNewUser = true
  }
  ctx.body.jwt = jwt.sign({ name: openid }, tokenSecret, { expiresIn: '2h' })
})

const routes: RouterFormat = {
  path: '/login',
  router
}

export default routes
