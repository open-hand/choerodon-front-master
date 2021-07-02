import get from 'lodash/get';
import { axiosCache } from '../instances';
import { customAxiosRequestConfig } from '../interface';

export default function handleCustomTransformResponseHandler(config:customAxiosRequestConfig, data:any) {
  const tempConfig = config;
  const cancelCacheKey = get(tempConfig, 'cancelCacheKey');
  axiosCache.set(cancelCacheKey, {
    ...axiosCache.get(cancelCacheKey),
    data,
  });
}
