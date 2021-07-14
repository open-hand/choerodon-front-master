import { AxiosRequestConfig } from 'axios';
import BigNumber from 'bignumber.js';
import qs from 'qs';

export default function paramsSerializer(params:AxiosRequestConfig['params']) {
  if (params instanceof URLSearchParams) {
    return params.toString();
  }
  const newParams = { ...params };
  for (const key in newParams) {
    if (newParams[key] instanceof BigNumber) {
      newParams[key] = newParams[key].toString();
    }
  }
  return qs.stringify(newParams);
}
