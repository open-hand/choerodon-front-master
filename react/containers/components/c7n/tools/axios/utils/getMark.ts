import { get } from 'lodash';
import { AxiosRequestConfig } from 'axios';
import JSONbig from 'json-bigint';
import paramsSerializer from './paramsSerializer';

export function transformDataToString(data:any) {
  if (typeof data !== 'string') {
    return JSONbig.stringify(data);
  }
  return data;
}

// response里面返回的config.data是个字符串对象
function getDataMark(data:any) {
  let stringifyData = data;
  if (typeof stringifyData === 'string') {
    stringifyData = JSONbig.parse(stringifyData);
  }
  return stringifyData;
}

// 区别请求的唯一标识，这里用方法名+请求路径
// 如果一个项目里有多个不同baseURL的请求 + 参数
export default function getMark(config:AxiosRequestConfig) {
  const getKey = (key:string) => get(config, key);
  // params标识处理
  const tempQueryString = (getKey('paramsSerializer') ?? paramsSerializer)(getKey('params'));
  // data标识处理
  const dataMark = JSONbig.stringify(getDataMark(getKey('data')));
  // base标识
  const requestMark = [
    config?.method?.toLowerCase() || 'unknownMethod',
    config?.url,
  ];

  getKey('params') && requestMark.push(tempQueryString);
  getKey('data') && requestMark.push(dataMark);
  return requestMark.join('&');
}
