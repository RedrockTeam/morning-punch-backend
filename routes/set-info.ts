import * as KoaRouter from 'koa-router'

const router = new KoaRouter()
import { getOne, setOne } from '../lib/mysql'
import { RouterFormat } from './index'

router.post('/', async ctx => {
  console.log(1231)
  const { openid, punch_time } = <{ [key: string]: any }>ctx.request.body
  console.log(<{ [key: string]: any }>ctx.request.body)
  if ((await getOne(openid)).openid) {
    ctx.body.status = 0
    ctx.body.errmsg = '已经有该openid了'
  } else {
    await setOne({ openid, punch_time })
    ctx.body.status = 1
    ctx.body.info = await getOne(openid)
  }
})

const routes: RouterFormat = {
  path: '/set-info',
  router
}

export default routes
