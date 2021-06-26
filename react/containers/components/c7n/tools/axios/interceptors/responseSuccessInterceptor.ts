import { AxiosResponse } from 'axios';
import get from 'lodash/get';
import {
  prompt,
} from '@/utils';
import { axiosCache, axiosEvent, axiosRoutesCancel } from '../instances';
import getMark from '../utils/getMark';

export default function handleResponseInterceptor(response:AxiosResponse) {
  const resData = get(response, 'data');
  const config = get(response, 'config') || {};
  const isTransportResponseHandled = get(config, 'isCustomTransformResponseHandled');

  const { enabledCancelCache, useCache, enabledCancelRoute } = config;
  const cancelCacheKey = get(config, 'cancelCacheKey') || getMark(config);

  if (enabledCancelRoute) {
    axiosRoutesCancel.delete(cancelCacheKey);
  }

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
    const finalData = isTransportResponseHandled ? axiosCache.get(cancelCacheKey)?.data : resData;
    debugger
    axiosCache.set(config?.cancelCacheKey || cancelCacheKey, {
      data: finalData,
      isPending: false,
      expire: Date.now() + Number(enabledCancelCache) * 500,
    });
    axiosEvent.emit(cancelCacheKey, finalData);
  }

  return resData;
}
