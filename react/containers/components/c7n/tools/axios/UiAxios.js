import axios from 'axios';
import { getAccessToken } from '@/utils/accessToken';
import { API_HOST } from '@/utils/constants';
import JSONbig from 'json-bigint';
import get from 'lodash/get';
import { transformResponsePage, transformRequestPage } from './transformPageData';
import MenuStore from '../../../../stores/c7n/MenuStore';

import {
  cursiveSetCorrectId,
  handleResponseCancelToken,
  handleRequestCancelToken,
  handelResponseError,
  handleDefaultTransformParamsSerializer,
} from './common';

const JSONbigString = JSONbig({ storeAsString: true });

function handleDefaultTransformResponse(data) {
  try {
    return JSONbigString.parse(data);
  } catch (error) {
    return data;
  }
}

function handleResponseInttercept(response) {
  if (get(response, 'status') === 204) {
    return response;
  }
  if (response.data.failed === true) {
    throw response.data;
  }
  handleResponseCancelToken(response);
  return transformResponsePage(get(response, 'data'));
}

const instance = axios.create({
  timeout: 30000,
  baseURL: API_HOST,
  transformResponse: [handleDefaultTransformResponse],
  paramsSerializer: handleDefaultTransformParamsSerializer,
});

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
    newConfig.headers.Authorization = accessToken;
  }

  return handleRequestCancelToken(newConfig);
}
instance.defaults.routeChangeCancel = true;

instance.interceptors.request.use(
  handleRequestIntercept,
  (err) => {
    const error = err;
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  handleResponseInttercept,
  handelResponseError,
);

export default instance;
