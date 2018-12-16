import * as KoaRouter from 'koa-router'

const router = new KoaRouter()
import { getOne, setOne } from '../lib/mysql'
import { RouterFormat } from './index'

router.get('/', async ctx => {
  const { openid } = <{ [key: string]: any }>ctx.request.body
  if (!openid) return
  let userData = <{ [key: string]: any }>await getOne(openid)
  if (!userData) {
    ctx.body.status = 0
    ctx.body.errmsg = '该openid尚未登记时间'
  } else {
    const { openid, punch_time, score } = userData
  }
})

const routes: RouterFormat = {
  path: '/punch',
  router
}

export default routes
