import md5 from 'md5';
import fs from 'fs'
import path from 'path'
import config from '../service.config'

const { mode } = config

export const judgeFileExist = (filePathMd5: string): string | null => {
  try {
    fs.accessSync(filePathMd5)
    return fs.readFileSync(path.join(filePathMd5)).toString()
  } catch (err) {
    return null
  }
}

export const saveData = (filePathMd5: string, data: any) => {
  // let arr = [{
  //   "host": "127.0.0.1:5500",
  //   "url": "/next",
  //   "proxyHost": "",
  //   "proxyUrl": "/service.config.ts",
  //   "data": [],
  //   "dataType": {}
  // }]
  fs.writeFileSync(filePathMd5, `{
  "data": ${JSON.stringify(data, null, 2)}
}`)
}