import { Middleware } from 'koa'

const afterset: Middleware = async (ctx, next) => {
  // 判断之前是否有修改过参数
  if (Object.keys(ctx.body)) ctx.status = 200
  else ctx.status = 404
  ctx.body = { status: 0, errmsg: '无数据' }
  await next()
}

export default () => afterset
