import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'

import router from './routes/index'

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.use(ctx => {
  ctx.status = 404
  ctx.body = {
    msg: 'not found'
  }
})

app.listen(8080, () => {
  console.log(`Server is running at http://localhost:8080`)
})
