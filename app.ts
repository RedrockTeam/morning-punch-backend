import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'

import preset from './middleware/preset'
import jwt from './middleware/jwt'
import router from './routes/index'

const app = new Koa()

app.use(logger())
app.use(bodyParser())

app.use(preset())
app.use(jwt())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080, () => {
  console.log(`Server is running at http://localhost:8080`)
})
