import Koa from 'koa';
import httpProxy from "../middleware";
const app = new Koa()

app.use(httpProxy({ host: "localhost:3000" }));

app.use(async (ctx: any, next: any) => {
  if (ctx.url.startsWith('/next')) {
    const data = await ctx.httpProxy({
      host: '127.0.0.1:5500',
      url: '/service.config.js' // 多代理，nest地址代理到localhost:3000
    });
    // 这里可以做一些请求之后需要处理的事情
    ctx.body = data;
  } else {
    await next()
  }
})

app.use(async(ctx: any, next: any) => {
  ctx.body = 'hello world'
})

export default app
