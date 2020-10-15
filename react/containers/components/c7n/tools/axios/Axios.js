import axios from 'axios';
import qs from 'qs';
import BigNumber from 'bignumber.js';
import {
  prompt,
  getAccessToken,
  removeAccessToken,
} from '@/utils';
import { authorizeUrl } from '@/utils/authorize';
import { API_HOST } from '@/utils/constants';
import JSONbig from 'json-bigint';
import { transformResponsePage, transformRequestPage } from './transformPageData';
// eslint-disable-next-line import/no-cycle
import MenuStore from '../../../../stores/c7n/MenuStore';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;
axios.defaults.timeout = 30000;
axios.defaults.baseURL = API_HOST;
axios.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data);
  } catch (e) {
    return data;
  }
}];
axios.defaults.paramsSerializer = function (params) {
  if (params instanceof URLSearchParams) {
    return params.toString();
  }
  const newParams = { ...params };
  for (const key in newParams) {
    if (newParams[key] instanceof BigNumber) {
      newParams[key] = newParams[key].toString();
    }
  }
  return qs.stringify(newParams);
};
axios.interceptors.request.use(
  config => {
    const newConfig = config;
    const str = window.location.hash.split('?')[1];
    const urlSearchParam = new URLSearchParams(str);
    const type = urlSearchParam.get('type');
    const orgId = urlSearchParam.get('organizationId');
    const id = !type || type === 'site' ? 0 : orgId || 0;
    newConfig.headers['Content-Type'] = 'application/json';
    newConfig.headers.Accept = 'application/json';
    newConfig.headers['H-Tenant-Id'] = id;
    newConfig.headers['H-Menu-Id'] = MenuStore.activeMenu ? MenuStore.activeMenu.id : 0;
    transformRequestPage(newConfig);
    const accessToken = getAccessToken();
    if (accessToken) {
      newConfig.headers.Authorization = accessToken;
    }
    return newConfig;
  },
  err => {
    const error = err;
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    if (response.status === 204) {
      return response;
    }
    if (Object.prototype.hasOwnProperty.call(response, 'data')) {
      if (response.data.failed === true) {
        prompt(response.data.message, 'error');
        throw response.data;
      }
      return transformResponsePage(response.data);
    } else {
      return response;
    }
  },
  error => {
    const { response } = error;
    if (response) {
      const { status } = response;
      switch (status) {
        case 401: {
          removeAccessToken();
          authorizeUrl();
          break;
        }
        case 403: {
          if (regTokenExpired.test(response.data)) {
            removeAccessToken();
            authorizeUrl();
          }
          break;
        }
        default:
          break;
      }
    }
    throw error;
  },
);

export default axios;
