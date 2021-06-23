import axios, { AxiosStatic } from 'axios';
import { API_HOST } from '@/utils/constants';
import paramsSerializer from './utils/paramsSerializer';
import handleRequestError from './interceptors/requestErrorInterceptor';
import handleResponseInterceptor from './interceptors/responseSuccessInterceptor';
import handelResponseError from './interceptors/responseErrorInterceptor';
import transformJSONBig from './utils/transformJSONBig';
import { handleCancelCacheRequest } from './interceptors/cacheHandler';
import addCustomHeader from './interceptors/addCustomHeader';
import transformRequestPage from './interceptors/transformRequestPage';

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

// -------------------------------------------------------------------

// 添加缓存(复用重复请求)请求拦截器
instance.interceptors.request.use(handleCancelCacheRequest);

// 分页数据转换拦截器
instance.interceptors.request.use(transformRequestPage);

// 添加头部拦截器， 以及请求失败拦截器
instance.interceptors.request.use(addCustomHeader, handleRequestError);

// -------------------------------------------------------------------
// 添加响应拦截器
instance.interceptors.response.use(handleResponseInterceptor, handelResponseError);

instance.all = axios.all;
instance.bind = axios.bind;


console.log(axios, instance);
debugger

export default instance;
