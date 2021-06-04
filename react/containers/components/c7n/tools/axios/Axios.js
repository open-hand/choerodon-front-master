import axios from 'axios';
import {
  prompt,
  getAccessToken,
} from '@/utils';
import { API_HOST } from '@/utils/constants';
import JSONbig from 'json-bigint';
import get from 'lodash/get';
import { transformResponsePage, transformRequestPage } from './transformPageData';
import {
  cursiveSetCorrectId,
  handleRequestCancelToken,
  handleResponseCancelToken,
  handelResponseError,
  handleDefaultTransformParamsSerializer,
} from './common';

// eslint-disable-next-line import/no-cycle
import MenuStore from '../../../../stores/c7n/MenuStore';

const JSONbigString = JSONbig({ storeAsString: true });

function handleDefaultTransformResponse(data) {
  try {
    return JSONbigString.parse(data);
  } catch (error) {
    return data;
  }
}

function handleRequestIntercept(config) {
  const newConfig = config;
  const str = window.location.hash.split('?')[1];
  const urlSearchParam = new URLSearchParams(str);
  const type = urlSearchParam.get('type');
  const orgId = urlSearchParam.get('organizationId');
  const id = !type || type === 'site' ? 0 : orgId || 0;

  newConfig.headers['Content-Type'] = 'application/json';
  newConfig.headers.Accept = 'application/json';
  newConfig.headers['H-Tenant-Id'] = id;

  let correctId = 0;
  const flag = 0;

  if (MenuStore.activeMenu) {
    let data;
    const { level } = MenuStore.activeMenu;
    const menuGroup = JSON.parse(localStorage.getItem('menuGroup'));

    if (['site', 'users'].includes(level)) {
      data = menuGroup[level];
    } else {
      data = menuGroup[level][urlSearchParam.get('id')];
    }
    if (data) {
      correctId = cursiveSetCorrectId(data, correctId, flag);
    }
  }

  newConfig.headers['H-Menu-Id'] = correctId || 0;

  transformRequestPage(newConfig);

  const accessToken = getAccessToken();
  if (accessToken) {
    newConfig.headers.Authorization = newConfig?.headers.Authorization || accessToken;
  }

  return handleRequestCancelToken(newConfig);
}

function handleResponseInttercept(response) {
  if (get(response, 'status') === 204) {
    return response;
  }
  if (response?.data?.failed === true) {
    if (!response?.config.noPrompt) {
      prompt(response?.data.message, 'error');
    }
    throw response.data;
  }
  handleResponseCancelToken(response);
  return transformResponsePage(get(response, 'data'));
}

axios.defaults.timeout = 30000;
axios.defaults.baseURL = API_HOST;
axios.defaults.transformResponse = [
  handleDefaultTransformResponse,
];

axios.defaults.paramsSerializer = handleDefaultTransformParamsSerializer;

// 这里配置一个路由取消请求得标识
axios.defaults.routeChangeCancel = false;

// 这里配置一个路由取消重复请求得标识
axios.defaults.enabledCancelMark = false;

axios.interceptors.request.use(handleRequestIntercept,
  (err) => {
    const error = err;
    return Promise.reject(error);
  });

axios.interceptors.response.use(handleResponseInttercept, handelResponseError);

export default axios;
