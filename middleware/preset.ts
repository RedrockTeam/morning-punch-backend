import { Middleware } from 'koa'

const preset: Middleware = async (ctx, next) => {
  ctx.body = {}
  await next()
}

export default preset
