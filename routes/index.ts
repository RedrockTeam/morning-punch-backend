import * as fs from 'fs'
import * as path from 'path'
import * as KoaRouter from 'koa-router'

const router = new KoaRouter()

// Router Module 输出的格式
export interface RouterFormat {
  // 监听的路由
  path: string | RegExp
  // Router主体
  router: KoaRouter
}

const routerList: RouterFormat[] = []

const readRouter: (list: RouterFormat[]) => Promise<RouterFormat[]> = async list => {
  const routerFiles = fs.readdirSync(__dirname)
  let length = routerFiles.length
  for (let i = 0; i < length; i++) {
    let el = routerFiles[i]
    if (el === 'index.ts') continue
    list.push((await import(path.resolve(__dirname, el))).default)
  }
  return list
}

readRouter(routerList).then(res =>
  res.forEach(obj => {
    router.use(obj.path, obj.router.routes(), obj.router.allowedMethods())
  })
)

export default router
