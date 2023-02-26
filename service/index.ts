import Koa from 'koa';
import httpProxy from "../middleware";
import config from '../service.config'
import fs from 'fs'
import md5 from 'md5';
import path from 'path'
import { saveData, judgeFileExist } from '../utils'

const app = new Koa()

const { host, apiListConfig, mode } = config

app.use(httpProxy({ host }));

app.use(async (ctx: any, next: any) => {
  let prefix = apiListConfig.find((item: any) => ctx.url.startsWith(item.url))

  if(prefix) {
    const host = prefix.proxyHost|| prefix.host
    const url = prefix.proxyUrl || prefix.url
    const nameMd5 = md5(prefix.url)
    const filePathMd5 = path.join(__dirname, `../mock/${nameMd5}.json`)
    let curMode = prefix?.mode || mode

    let data = judgeFileExist(filePathMd5)
    
    if (!data) {
      data = await ctx.httpProxy({
        host,
        url,
      })
      curMode === 1 && saveData(filePathMd5, data)
    }

    ctx.body = data
  } else {
    await next()
  }
})

app.use(async(ctx: any, next: any) => {
  ctx.body = 'hello world'
})

export default app
