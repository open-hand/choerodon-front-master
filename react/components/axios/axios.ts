import axios from 'axios';
import { API_HOST } from '@/utils/constants';
import paramsSerializer from './utils/paramsSerializer';
import handleRequestError from './interceptors/requestErrorInterceptor';
import handleResponseInterceptor from './interceptors/responseSuccessInterceptor';
import handelResponseError from './interceptors/responseErrorInterceptor';
import transformJSONBig from './utils/transformJSONBig';
import addCustomHeader from './interceptors/addCustomHeader';
import transformRequestPage from './interceptors/transformRequestPage';
import transformResponsePage from './interceptors/transformResponsePage';
import {
  routeCancelRequestSuccessInterceptor,
  routeCancelResponseFailedInterceptor,
  routeCancelResponseSuccessInterceptor,
} from './interceptors/routeCancelHandler';

type choerodonAxiosProps = {
  type: 'default' | 'ui',
}

function choerodonAxios({
  type,
}:choerodonAxiosProps) {
  // @ts-ignore
  const instance = axios.create({
    timeout: 30000,
    baseURL: API_HOST,
  });
  // 这里配置一个切换路由取消全部pending请求的标识
  instance.defaults.enabledCancelRoute = true;

  // ds还是默认
  instance.defaults.application = type || 'default';

  instance.defaults.transformResponse = [
    transformJSONBig,
  ];

  // 是否展示全部的axiosResponse数据，默认：成功返回的数据内容
  instance.defaults.showAllRepsonseConfigData = false;

  instance.defaults.paramsSerializer = paramsSerializer;

  // 添加切换路由取消pending请求拦截器
  instance.interceptors.request.use(routeCancelRequestSuccessInterceptor, handleRequestError); // 3

  // 分页数据转换拦截器
  instance.interceptors.request.use(transformRequestPage); // 2

  // 添加头部拦截器， 以及请求失败拦截器
  instance.interceptors.request.use(addCustomHeader); // 1

  // -------------------------------------------------------------------
  // 添加响应拦截器
  instance.interceptors.response.use(transformResponsePage); // 1
  instance.interceptors.response.use(routeCancelResponseSuccessInterceptor, routeCancelResponseFailedInterceptor);
  instance.interceptors.response.use(handleResponseInterceptor, handelResponseError); // 2

  instance.all = axios.all;
  instance.bind = axios.bind;
  instance.spread = axios.spread;
  return instance;
}

export default choerodonAxios;
