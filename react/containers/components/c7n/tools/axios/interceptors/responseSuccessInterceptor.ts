import { AxiosResponse } from 'axios';
import get from 'lodash/get';
import {
  prompt,
} from '@/utils';
import { axiosCache, axiosEvent } from '../instances';
import getMark from '../utils/getMark';

export default function handleResponseInterceptor(response:AxiosResponse) {
  const resData = get(response, 'data');
  const config = get(response, 'config') || {};
  const isTransportResponseHandled = get(config, 'isCustomTransformResponseHandled');

  const { enabledCancelCache, useCache } = config;
  const cancelCacheKey = getMark(config);
  if (get(response, 'status') === 204) {
    return response;
  }
  if (resData?.failed === true) {
    axiosCache.set(cancelCacheKey, {
      ...(axiosCache.get(cancelCacheKey) || {}),
      isPending: false,
    });

    if (!response?.config?.noPrompt) {
      prompt(resData.message, 'error');
    }
    throw resData;
  }

  if (enabledCancelCache && !useCache) {
    debugger
    axiosCache.set(config?.cancelCacheKey || cancelCacheKey, {
      data: isTransportResponseHandled ? axiosCache.get(cancelCacheKey)?.data : resData,
      isPending: false,
      expire: Date.now() + Number(enabledCancelCache) * 500,
    });
    axiosEvent.emit(cancelCacheKey, resData);
  }

  return resData;
}
