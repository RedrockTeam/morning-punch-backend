import * as KoaRouter from 'koa-router'

const router = new KoaRouter()

import { RouterFormat } from './index'

router.get('/', async ctx => {
  ctx.status = 200
  ctx.body = '12313'
})

const routes: RouterFormat = {
  path: '/',
  router
}

export default routes
