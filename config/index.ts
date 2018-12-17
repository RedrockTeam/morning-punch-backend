import { ConnectionConfig } from 'mysql'

export const tokenSecret = 'redrock-zqqd'

export const mysqlConfig: ConnectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'coderming',
  database: 'short_url'
}

export const defaultScore = [55, 50, 45]
