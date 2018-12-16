import { Middleware } from 'koa'

const preset: Middleware = async (ctx, next) => {
  // 先给 ctx.body 传值
  ctx.body = ctx.body || {}
  await next()
}

export default () => preset
