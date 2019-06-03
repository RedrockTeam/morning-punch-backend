import { Middleware } from 'koa'

const HOST = 'https://nalgd.top/'
const REDIRECT_URI = `${HOST}api/info`
const FRONT_END = 'https://nalgd.top/zqqd/'

const preset: Middleware = async (ctx, next) => {
  // 先给 ctx.body 传值
  ctx.body = ctx.body || {}

  await next()

  // 判断之前是否有修改过参数
  if (Object.keys(ctx.body).length) ctx.status = 200
  else if(ctx.request.URL.pathname.replace('/', '') === 'entrance') {
    ctx.status = 301
    ctx.set('Location', `https://wx.idsbllp.cn/game/api/index.php?redirect=${encodeURIComponent(REDIRECT_URI)}`)
  }
  else if(ctx.request.URL.pathname.replace('/', '') === 'info') {
    const openid = ctx.query['openid']
    ctx.status = 301
    ctx.cookies.set('openid', openid, {httpOnly: false})
    ctx.set({
        'Location': `${FRONT_END}`
    })
  }
  else if (ctx.method !== 'POST') {
    ctx.status = 404
    ctx.body = { status: 0, errmsg: '本API只支持POST访问' }
  } else {
    ctx.status = 404
    ctx.body = { status: 0, errmsg: '无数据' }
  }
}

export default () => preset
