import { API_HOST } from '@/utils/constants';
import { axiosCache } from '../instances';
import getMark from '../utils/getMark';
import transformRequestPage from '../interceptors/transformRequestPage';
import { customAxiosRequestConfig } from '../interface';

export default function handleCustomTransformResponseHandler(config:customAxiosRequestConfig, data:any) {
  const tempConfig = config;
  if (tempConfig.url?.indexOf(API_HOST) === -1) {
    tempConfig.url = `${API_HOST}${config.url}`;
  }
  const cancelCacheKey = getMark(transformRequestPage(tempConfig));
  axiosCache.set(cancelCacheKey, {
    ...axiosCache.get(cancelCacheKey),
    data,
  });
}
