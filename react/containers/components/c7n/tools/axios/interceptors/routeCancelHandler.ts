import axios, { AxiosRequestConfig } from 'axios';
import get from 'lodash/get';
import { axiosRoutesCancel } from '../instances';
import getMark from '../utils/getMark';

export function routeCancelInterceptor(config:AxiosRequestConfig) {
  const enabledCancelRoute = get(config, 'enabledCancelRoute');

  if (enabledCancelRoute) {
    const cancelRouteKey = config.cancelCacheKey || getMark(config);
    const { CancelToken } = axios;
    const source = CancelToken.source();
    axiosRoutesCancel.set(cancelRouteKey, {
      cancel: source.cancel,
      name: cancelRouteKey,
    });
  }

  return config;
}
