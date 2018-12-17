import { Middleware } from 'koa'
import * as koajwt from 'koa-jwt'

const jwt: Middleware = async (ctx, next) => {
  try {
    await koajwt({ secret: 'my_token' }).unless({ path: [/\/login/] })(ctx, next)
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        status: 0,
        errmsg: 'JWT鉴权失败'
      }
    }
  }
}

export default () => jwt
