import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { get } from 'lodash';
import getMark, { transformDataToString } from '../utils/getMark';
import { axiosCache, axiosEvent } from '../instances';
import handleCustomTransformResponseHandler from '../utils/customTransformResponseHandler';

export function handleCancelCacheRequest(config:AxiosRequestConfig) {
  const tempConfig = config;
  const enabledCancelCache = get(tempConfig, 'enabledCancelCache');
  if (enabledCancelCache) {
    const cancelCacheKey = getMark(tempConfig);
    if (!axiosCache.has(cancelCacheKey)) {
      axiosCache.set(cancelCacheKey, {});
    }
    const {
      data,
      isPending,
      expire,
    } = axiosCache.get(cancelCacheKey);

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
    } else if (expire && expire > Date.now()) {
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
        useCache: false,
        isPending: true,
      });
    }
  }

  return tempConfig;
}
