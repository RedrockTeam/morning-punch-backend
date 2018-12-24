import * as KoaRouter from 'koa-router'

const router = new KoaRouter()

import { RouterFormat } from './index'

router.post('/', async ctx => {
  ctx.status = 200
  ctx.body = '12313'
})

const routes: RouterFormat = {
  path: '/templete',
  router
}

export default routes
