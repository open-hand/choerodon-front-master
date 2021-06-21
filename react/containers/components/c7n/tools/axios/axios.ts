import axios, { AxiosInstance, AxiosStatic } from 'axios';
import { API_HOST } from '@/utils/constants';
import handleRequestIntercept from './interceptors/requestSuccessInterceptor';
import paramsSerializer from './utils/paramsSerializer';
import handleRequestError from './interceptors/requestErrorInterceptor';
import handleResponseInterceptor from './interceptors/responseSuccessInterceptor';
import handelResponseError from './interceptors/responseErrorInterceptor';
import transformJSONBig from './utils/transformJSONBig';

// @ts-ignore
const instance:AxiosStatic = axios.create({
  timeout: 30000,
  baseURL: API_HOST,
});

instance.defaults.transformResponse = [
  transformJSONBig,
];

instance.defaults.paramsSerializer = paramsSerializer;

// 这里配置一个路由取消重复请求得标识
instance.defaults.enabledCancelCache = true;

instance.interceptors.request.use(handleRequestIntercept, handleRequestError);

instance.interceptors.response.use(handleResponseInterceptor, handelResponseError);

instance.all = axios.all;
instance.bind = axios.bind;

export default instance;
