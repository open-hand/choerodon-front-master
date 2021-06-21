import { AxiosResponse } from 'axios';
import get from 'lodash/get';
import {
  prompt,
} from '@/utils';
import { axiosCache, axiosEvent } from '../instances';
import getMark from '../utils/getMark';
import transformResponsePage from './transformResponsePage';

declare module 'axios' {
  interface AxiosRequestConfig {
    noPrompt?: boolean
    enabledCancelCache?: boolean,
    useCache?:boolean
  }
}

export default function handleResponseInterceptor(response:AxiosResponse) {
  const resData = get(response, 'data');
  const config = get(response, 'config') || {};
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

  const transformPageData = transformResponsePage(resData);

  if (enabledCancelCache && !useCache) {
    axiosCache.set(cancelCacheKey, {
      data: transformPageData,
      isPending: false,
      expire: Date.now() + Number(enabledCancelCache) * 1000,
    });
    axiosEvent.emit(cancelCacheKey, resData);
  }

  return transformPageData;
}
