import axios, { AxiosRequestConfig } from 'axios';
import get from 'lodash/get';
import { axiosRoutesCancel } from '../instances';
import getMark from '../utils/getMark';

export function routeCancelInterceptor(config:AxiosRequestConfig) {
  const tempConfig = config;
  const enabledCancelRoute = get(tempConfig, 'enabledCancelRoute');
  if (enabledCancelRoute) {
    const cancelRouteKey = tempConfig?.cancelCacheKey || getMark(config);
    const { CancelToken } = axios;
    const source = CancelToken.source();
    tempConfig.cancelToken = source.token;
    axiosRoutesCancel.set(cancelRouteKey, {
      cancel: source.cancel,
      name: cancelRouteKey,
    });
  }

  return tempConfig;
}
