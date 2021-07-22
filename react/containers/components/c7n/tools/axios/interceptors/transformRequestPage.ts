// @ts-nocheck
import { AxiosRequestConfig } from 'axios';
import queryString from 'query-string';

export default function transformRequestPage(config: AxiosRequestConfig) {
  const tempConfig = config;
  // 先把url上的参数去掉，放到params上
  const [url, search] = tempConfig.url.split('?');
  if (search) {
    const parsed = queryString.parse(search);
    tempConfig.url = url;
    if (!tempConfig.params) {
      tempConfig.params = {};
    }
    Object.assign(tempConfig.params, parsed || {});
  }
  // page-1
  if (tempConfig.params) {
    const { pagesize, size, page } = tempConfig.params;
    if (page !== undefined) {
      tempConfig.params.page = Math.max(tempConfig.params.page - 1, 0);
    }
    if (pagesize && !size) {
      tempConfig.params.size = pagesize;
      delete tempConfig.params.pagesize;
    }
  }
  return tempConfig;
}
