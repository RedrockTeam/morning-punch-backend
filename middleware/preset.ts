import { Middleware } from 'koa'

const preset: Middleware = async (ctx, next) => {
  // 先给 ctx.body 传值
  ctx.body = ctx.body || {}

  await next()

  // 判断之前是否有修改过参数
  if (Object.keys(ctx.body).length) ctx.status = 200
  else {
    ctx.status = 404
    ctx.body = { status: 0, errmsg: '无数据' }
  }
}

export default () => preset
