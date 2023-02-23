/**
 * @Description proxy middleware
 * @author master_j
 * @createDate 2022/12/23
 * @modifyDate 2023/02/23
 */
import { GET } from "../constant";
import axios from "axios";
import qs from "qs";

interface IProxyParams {
  url?: string;
  method?: string;
  headers?: any;
  protocol?: string;
  host?: string;
  data?: any;
}

export default (opts = {}) => {
  return (ctx: any, next: any) => {
    if (!ctx.httpProxy) {
      proxy(ctx, next, opts);
    }
    return next();
  };
};

function proxy(ctx: any, next: any, opts: any) {
  ctx.httpProxy = async (params: IProxyParams = {}) => {
    params = Object.assign({}, { host: opts.host || "" }, params);

    let reqParams = Object.assign({}, params, formatParams(ctx, params)) as any;

    if (reqParams.method.toUpperCase() !== GET) {
      reqParams.data = params.data || ctx.request.data;
    }

    if (qs.stringify(ctx.request.body)) {
      reqParams = { ...reqParams, data: qs.stringify(ctx.request.body) };
    }

    delete reqParams.headers.host;

    try {
      const res = await axios(reqParams);
      const { data, headers } = res;
      setResCookies(ctx, headers);
      return data;
    } catch (err) {
      return err;
    }
  };
}

function formatParams(ctx: any, params: IProxyParams) {
  let { url, method, headers, protocol } = ctx;
  const { host } = params
  const hasProtocol = /(http|s):\/\//;

  url = params.url || url
  method = params.method || method
  protocol = hasProtocol.test(url) ? url.split(':')[0] : params.protocol || protocol

  url = `${protocol}://${host}${url}`

  return { url, method, headers, protocol }
}

function setResCookies(ctx: any, headers: any) {
  const resCookies = headers["set-cookie"];
  if (
    !headers ||
    !resCookies ||
    !Array.isArray(resCookies) ||
    !resCookies.length ||
    resCookies.length <= 0
  ) return

  ctx.res._heads = ctx.res._heads || {};
  ctx.res._headerNames = ctx.res._headerNames || {};
  ctx.res._headers['set-cookie'] = [...(ctx.res._headers['set-cookie'] || []), ...resCookies]
  ctx.res._headerNames['set-cookie'] = 'set-cookie';
}
