import * as mysql from 'mysql'
import { promisify } from 'util'

import { mysqlConfig } from '../config'

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
          PRIMARY KEY (openid)
        ) COMMENT='';`
      )
      await sqlQuery(
        `CREATE TABLE punch_set (
          openid varchar(255) NOT NULL,
          timestamp datetime NOT NULL,
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
    const { openid, punch_time, score = 45 } = user
    await sqlQuery(`insert into user_set 
      ( openid, punch_time, score) values ( '${openid}', '${punch_time}', '${score}')`)
    return true
  } catch (err) {
    return false
  }
}

export const getOne = async (openid: string): Promise<{ [key: string]: any } | Boolean> => {
  let queryRes = await sqlQuery(`SELECT * FROM user_set WHERE openid='${openid}';`)

  if (queryRes.length === 1) return queryRes[0]

  return false
}

export const punchOne = async (openid: string): Promise<Boolean> => {
  let prevScore = (await sqlQuery(`SELECT score FROM user_set WHERE openid='${openid}';`))[0].score
  console.log(
    await sqlQuery(`insert into punch_set 
      ( openid, timestamp ) values ( '${openid}', '${Date.now()}')`)
  )
  await sqlQuery(`update user_set set score='${prevScore + 10}' where openid='${openid}'`)
  return true
}
