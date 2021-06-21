import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { get } from 'lodash';
import getMark from './getMark';
import { axiosCache, axiosEvent } from '../instances';

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

    if (isPending) {
      // 说明上个重复的请求还在pending，这时候
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
          data,
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
        ...axiosCache.get(cancelCacheKey),
        isPending: true,
      });
    }
  }

  return tempConfig;
}
