import { Middleware } from 'koa'
import * as koajwt from 'koa-jwt'

import { tokenSecret } from '../config'

const jwt: Middleware = async (ctx, next) => {
  try {
    await koajwt({ secret: tokenSecret }).unless({ path: [/\/login/, /\/entrance/, /\/info/]})(ctx, next)
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
