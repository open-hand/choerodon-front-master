import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import get from 'lodash/get';
import { axiosRoutesCancel } from '../instances';
import getMark from '../utils/getMark';

export function routeCancelRequestSuccessInterceptor(config:AxiosRequestConfig) {
  const tempConfig = config;
  const enabledCancelRoute = get(tempConfig, 'enabledCancelRoute');
  if (enabledCancelRoute) {
    const cancelRouteKey = tempConfig?.cancelCacheKey || getMark(config);
    const { CancelToken } = axios;
    const source = CancelToken.source();

    tempConfig.cancelToken = source.token;
    // 将config赋值cancelCacheKey，避免了后续transformRequest重写了params会导致response拦截器里头getMark获取到的标识会和本次的不一样
    tempConfig.cancelCacheKey = cancelRouteKey;

    axiosRoutesCancel.set(cancelRouteKey, {
      cancel: source.cancel,
      name: cancelRouteKey,
    });
  }

  return tempConfig;
}

export function routeCancelResponseSuccessInterceptor(response:AxiosResponse) {
  const config = get(response, 'config');
  const { enabledCancelRoute } = config;
  const cancelCacheKey = config.cancelCacheKey || getMark(config);

  if (enabledCancelRoute) {
    axiosRoutesCancel.delete(cancelCacheKey);
  }
  return response;
}

export function routeCancelResponseFailedInterceptor(error:AxiosError) {
  const {
    config,
  } = error;
  const enabledCancelRoute = get(config, 'enabledCancelRoute');

  const cancelCacheKey = get(config, 'cancelCacheKey') || getMark(config);

  if (enabledCancelRoute) {
    axiosRoutesCancel.delete(cancelCacheKey);
  }

  // 如果是主动取消了请求，做个标识
  if (axios.isCancel(error)) {
    return new Promise(() => {});
  }
  return error;
}
