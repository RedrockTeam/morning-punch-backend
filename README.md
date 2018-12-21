# 2018版早起签到 - 后端部分

## API文档

所有请求方法均为 `POST`

#### /login

登陆接口。需要参数 `openid: string`

返回值：

- `jwt: string`  JWT鉴权串
- `isNewUser: boolean`  是不是新用户（判定依据是是否绑定了签到时段）
- `info: object`  如果是新用户，会有该字段。会带有用户的登记信息

返回值示例

```
// 如果是新用户
{
    "isNewUser": true,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieHh4IiwiaWF0IjoxNTQ1MzgwMDI0LCJleHAiOjE1NDUzODcyMjR9.sgUVI9_sdxChnYugag18DvnmO4blqZgXkahOXrn5bFg"
}

// 如果是老用户
{
    "info": {
        "openid": "xxx",
        "punch_time": 0,
        "score": 65
    },
    "isNewUser": false,
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieHh4IiwiaWF0IjoxNTQ1MzgwMDI0LCJleHAiOjE1NDUzODcyMjR9.sgUVI9_sdxChnYugag18DvnmO4blqZgXkahOXrn5bFg"
}
```

#### /set-info

登记签到时段

需要参数：`openid: string`，`punch_time: number`

约定 `punch_time`：0为6:30 - 7:00，1为7:00 - 7:30，2为7:30 - 8:00

返回值：

- `status: number` 状态，0为失败，1为成功。失败情况下会有`errmsg`字段

返回值示例

```
// 鉴权失败
{
    "status": 0,
    "errmsg": "JWT鉴权失败"
}

// 已经登记过了
{
    "status": 0,
    "errmsg": "已经有该openid了"
}

// 正常情况
{
    "status": 1
}
```

#### /punch

签到接口

需要参数：`opened: string`

返回值：

- `status: number` 状态，0为失败，1为成功。失败情况下会有`errmsg`字段

- `time: number` 如果是成功状态下会有该字段，表示服务器最终登记的用户签到的 timestamp（其实没什么用hhh）

返回值示例

```
// 尚未登记签到时间
{
    "status": 0,
    "errmsg": "该openid尚未登记时间"
}

// 传入的签到时间与之前设定的签到时间不符合
{
    "status": 0,
    "errmsg": "传入的签到时间与之前设定的签到时间不符合"
}

// 成功
{
    "status": 1,
    "time": 1545380735759
}
```

