import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { get } from 'lodash';
import getMark, { transformDataToString } from '../utils/getMark';
import { axiosCache, axiosEvent } from '../instances';
import handleCustomTransformResponseHandler from '../utils/customTransformResponseHandler';

export function handleCancelCacheRequest(config:AxiosRequestConfig) {
  const tempConfig = config;
  // 是否开启了缓存（复用重复请求状态）
  const enabledCancelCache = get(tempConfig, 'enabledCancelCache');
  if (enabledCancelCache) {
    // 获取标识
    const cancelCacheKey = getMark(tempConfig);

    if (!axiosCache.has(cancelCacheKey)) {
      axiosCache.set(cancelCacheKey, {});
    }

    const {
      data, // 缓存的数据
      isPending, // 请求是否是pending状态
      expire, // 时间戳
    } = axiosCache.get(cancelCacheKey);

    // 将config赋值cancelCacheKey，避免了后续transformRequest重写了params会导致response拦截器里头getMark获取到的标识会和本次的不一样
    tempConfig.cancelCacheKey = cancelCacheKey;

    const tempTransformResponse = tempConfig?.transformResponse;

    if (tempTransformResponse && typeof tempTransformResponse === 'function') {
      // @ts-ignore
      tempConfig.isCustomTransformResponseHandled = true;
      tempConfig.transformResponse = function (tempData:any, ...rest) {
        handleCustomTransformResponseHandler(tempConfig, tempData);
        return tempTransformResponse(tempData, ...rest);
      };
    }

    const forceUpdate = get(tempConfig, 'forceUpdate');

    if (isPending) {
      // 说明找到了请求但是找到的这个缓存的请求还在pending，这时候订阅一个期约待会要用
      tempConfig.adapter = () => new Promise((resolve) => {
        axiosEvent.once(cancelCacheKey, (res:unknown) => {
          const resolveData: AxiosResponse = {
            data: res,
            headers: tempConfig.headers,
            config: {
              ...tempConfig,
              useCache: true,
            },
            // @ts-expect-error
            request: tempConfig,
          };
          resolve(resolveData);
        });
      });
    } else if (!forceUpdate && expire && expire > Date.now()) {
      tempConfig.adapter = () => {
        const resolveData: AxiosResponse = {
          data: transformDataToString(data),
          headers: tempConfig.headers,
          config: {
            ...tempConfig,
            useCache: true,
          },
          // @ts-expect-error
          request: tempConfig,
        };
        return Promise.resolve(resolveData);
      };
    } else {
      axiosCache.set(cancelCacheKey, {
        isPending: true,
      });
    }
  }

  return tempConfig;
}
