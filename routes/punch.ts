import * as KoaRouter from 'koa-router'

const router = new KoaRouter()
import { getOne, punchOne } from '../lib/mysql'
import { RouterFormat } from './index'

router.post('/', async ctx => {
  const { openid } = <{ [key: string]: any }>ctx.request.body
  if (!openid) return
  let userData = await getOne(openid)
  if (!userData.openid) {
    ctx.body.status = 0
    ctx.body.errmsg = '该openid尚未登记时间'
  } else {
    const { openid, punch_time } = userData
    let prevInfo = await getOne(openid)
    // 处理非法参数
    if (prevInfo.punch_time !== punch_time) {
      ctx.body.status = 0
      ctx.body.errmsg = `传入的签到时间与之前设定的签到时间不符合`
      return
    }
    ctx.body.status = 1
    ctx.body.time = Date.now()
    ctx.body.info = await punchOne(openid)
  }
})

const routes: RouterFormat = {
  path: '/punch',
  router
}

export default routes
