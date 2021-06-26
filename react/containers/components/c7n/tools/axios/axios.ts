import axios, { AxiosStatic } from 'axios';
import { API_HOST } from '@/utils/constants';
import paramsSerializer from './utils/paramsSerializer';
import handleRequestError from './interceptors/requestErrorInterceptor';
import handleResponseInterceptor from './interceptors/responseSuccessInterceptor';
import handelResponseError from './interceptors/responseErrorInterceptor';
import transformJSONBig from './utils/transformJSONBig';
import { handleCancelCacheRequest } from './interceptors/cacheHandlers';
import addCustomHeader from './interceptors/addCustomHeader';
import transformRequestPage from './interceptors/transformRequestPage';
import transformResponsePage from './interceptors/transformResponsePage';
import { routeCancelInterceptor } from './interceptors/routeCancelHandler';

declare module 'axios' {
  interface AxiosRequestConfig {
    noPrompt?: boolean
    enabledCancelCache?: boolean,
    useCache?:boolean
    enabledCancelRoute?:boolean,
    cancelCacheKey?: string,
  }
}

// @ts-ignore
const instance:AxiosStatic = axios.create({
  timeout: 30000,
  baseURL: API_HOST,
});

instance.defaults.transformResponse = [
  transformJSONBig,
];

instance.defaults.paramsSerializer = paramsSerializer;

// 这里配置一个缓存请求得标识
instance.defaults.enabledCancelCache = true;

// 这里配置一个切换路由取消全部pending请求的标识
instance.defaults.enabledCancelRoute = true;

// -------------------------------------------------------------------

// 添加切换路由取消pending请求拦截器
instance.interceptors.request.use(routeCancelInterceptor); // 3

// 添加缓存(复用重复请求)请求拦截器
instance.interceptors.request.use(handleCancelCacheRequest, handleRequestError); // 3

// 分页数据转换拦截器
instance.interceptors.request.use(transformRequestPage); // 2

// 添加头部拦截器， 以及请求失败拦截器
instance.interceptors.request.use(addCustomHeader); // 1

// -------------------------------------------------------------------
// 添加响应拦截器
instance.interceptors.response.use(transformResponsePage); // 1
instance.interceptors.response.use(handleResponseInterceptor, handelResponseError); // 2
instance.interceptors.response.use((value) => value); // 3

instance.all = axios.all;
instance.bind = axios.bind;

export default instance;
