import { get } from 'lodash';
import { AxiosRequestConfig } from 'axios';
import paramsSerializer from './paramsSerializer';

export function transformDataToString(data:any) {
  if (typeof data !== 'string') {
    return JSON.stringify(data);
  }
  return data;
}

function getDataMark(data:any) {
  let stringifyData = data;
  if (typeof stringifyData === 'string') {
    stringifyData = JSON.parse(stringifyData);
  }
  return stringifyData;
}

// 区别请求的唯一标识，这里用方法名+请求路径
// 如果一个项目里有多个不同baseURL的请求 + 参数
export default function getMark(config:AxiosRequestConfig) {
  const tempQueryString = (config?.paramsSerializer ?? paramsSerializer)(config?.params);
  const dataMark = JSON.stringify(getDataMark(get(config, 'data')));
  const requestMark = [
    config?.method ? config?.method.toLowerCase() : '',
    config?.url,
  ];

  config?.params && requestMark.push(tempQueryString);
  get(config, 'data') && requestMark.push(dataMark);
  return requestMark.join('&');
}
