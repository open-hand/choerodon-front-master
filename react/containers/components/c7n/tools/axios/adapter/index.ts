import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { API_HOST } from '@/utils/constants';
import { axiosCache } from '../instances';
import getMark from '../utils/getMark';
import transformRequestPage from '../interceptors/transformRequestPage';

interface customAxiosRequestConfig extends AxiosRequestConfig {
  isCustomTransformResponseHandled?: boolean
}

function handleCustomTransformResponseHandler(config:customAxiosRequestConfig, data:any) {
  const tempConfig = config;
  tempConfig.url = `${API_HOST}${config.url}`;
  const cancelCacheKey = getMark(transformRequestPage(tempConfig));
  axiosCache.set(cancelCacheKey, {
    ...axiosCache.get(cancelCacheKey),
    data,
  });
}

function adapter(config:customAxiosRequestConfig) {
  const tempConfig = config;
  if (tempConfig?.transformResponse) {
    const temp = tempConfig.transformResponse;
    if (temp && typeof temp === 'function') {
      tempConfig.isCustomTransformResponseHandled = true;
      tempConfig.transformResponse = function (data, ...rest) {
        handleCustomTransformResponseHandler(tempConfig, data);
        return temp(data, ...rest);
      };
      if (tempConfig?.adapter) {
        tempConfig.adapter = tempConfig.adapter.bind(null, tempConfig) as AxiosAdapter;
      }
    }
  }
  return config;
}
export default adapter;
