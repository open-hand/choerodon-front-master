import { AxiosRequestConfig } from 'axios';
import { handleCancelCacheRequest } from '../utils/cacheHandler';
import addCustomHeader from './addCustomHeader';
import transformRequestPage from './transformRequestPage';

export default function handleRequestIntercept(config:AxiosRequestConfig) {
  const tempConfig = handleCancelCacheRequest(transformRequestPage(addCustomHeader(config)));
  return tempConfig;
}
