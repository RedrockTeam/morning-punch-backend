import * as mysql from 'mysql'
import { promisify } from 'util'
import * as dayjs from 'dayjs'
import { mysqlConfig } from '../config'

console.log(dayjs().diff(dayjs('2018-12-24'), 'day'))
// 先将参数的database设置为空 然后连接上再想法子进数据库
let realConf: { [key: string]: any } = { ...mysqlConfig }
let baseName = realConf.database
realConf.database = void 0

const connection = mysql.createConnection(realConf)
const sqlQuery = promisify(connection.query).bind(connection)
connection.connect(err => {
  if (err) return console.error('error connecting: ' + err.stack)
})

// 处理没有初始化数据库的问题
;(async () => {
  await sqlQuery(`CREATE DATABASE IF NOT EXISTS ${baseName}`)
    .then(async () => {
      await sqlQuery(`USE ${baseName}`)
    })
    .then(async () => {
      // 初始化列表
      await sqlQuery(
        `CREATE TABLE IF NOT EXISTS user_set (
          openid varchar(255) NOT NULL,
          punch_time int NOT NULL,
          score int NOT NULL,
          last_date varchar(255) NOT NULL,
          PRIMARY KEY (openid)
        ) COMMENT='';`
      )
      await sqlQuery(
        `CREATE TABLE IF NOT EXISTS punch_set (
          openid varchar(255) NOT NULL,
          timestamp varchar(255) NOT NULL,
          iswining int
        ) COMMENT='';`
      )
    })
})()

export const setOne = async (user: {
  openid: string
  punch_time: number
  score?: number
}): Promise<Boolean> => {
  try {
    const { openid, punch_time, score = 1 } = user
    await sqlQuery(`insert into user_set 
      ( openid, punch_time, score, last_date ) values ( '${openid}', '${punch_time}', '${score}', '${Date.now()}')`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export const getOne = async (openid: string): Promise<{ openid?: string; [key: string]: any }> => {
  let queryRes = await sqlQuery(`SELECT * FROM user_set WHERE openid='${openid}';`)

  if (queryRes.length === 1) return queryRes[0]
  // 处理有多个记录的情况
  return {}
}

export const punchOne = async (openid: string): Promise<{ totalTime: number; conTime: number }> => {
  let { score, last_date } = (await sqlQuery(
    `SELECT score, last_date FROM user_set WHERE openid='${openid}';`
  ))[0]
  let conTime = 1,
    diffTime = dayjs().diff(dayjs(Number(last_date)), 'day')
  // 看是否是连续签到
  if (diffTime > 1) {
    await sqlQuery(
      `update user_set set score='${score + 1}', last_date='${Date.now()}' where openid='${openid}'`
    )
  } else {
    conTime += diffTime
  }
  // 添加子表
  await sqlQuery(`insert into punch_set 
      ( openid, timestamp ) values ( '${openid}', '${Date.now()}')`)
  // 更新分数
  await sqlQuery(`update user_set set score='${score + 1}' where openid='${openid}'`)

  return {
    totalTime: Number(score + 1),
    conTime
  }
}
