import * as Koa from 'koa'
import * as koajwt from 'koa-jwt'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'

import preset from './middleware/preset'
import afterset from './middleware/afterset'

import router from './routes/index'

const app = new Koa()

app.use(logger())
app.use(bodyParser())

app.use(preset())
app.use(async (ctx, next) => {
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = { status: 0, message: 'JWT鉴权失败' }
    } else throw err
  })
})

app.use(koajwt({ secret: 'my_token' }).unless({ path: [/\/login/] }))

app.use(router.routes())
app.use(router.allowedMethods())

app.use(afterset())

app.listen(8080, () => {
  console.log(`Server is running at http://localhost:8080`)
})
