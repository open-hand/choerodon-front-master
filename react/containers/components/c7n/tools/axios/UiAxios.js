import axios from 'axios';
import qs from 'qs';
import BigNumber from 'bignumber.js';
import { authorizeUrl } from '@/utils/authorize';
import { getAccessToken, removeAccessToken } from '@/utils/accessToken';
import { API_HOST } from '@/utils/constants';
import { transformResponsePage, transformRequestPage } from './transformPageData';
import MenuStore from '../../../../stores/c7n/MenuStore';
import JSONbig from 'json-bigint'

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

const instance = axios.create({
  timeout: 30000,
  baseURL: API_HOST,
  transformResponse: [function(data) {
    try {
      return JSONbig.parse(data);
    } catch (e) {
      return data;
    }
  }],
  paramsSerializer(params) {
    const newParams = { ...params };
    for (const key in newParams) {
      if (newParams[key] instanceof BigNumber) {
        newParams[key] = newParams[key].toString();
      }
    }
    return qs.stringify(newParams);
  },
});

instance.interceptors.request.use(
  (config) => {
    const newConfig = config;

    const str = window.location.hash.split('?')[1];
    const urlSearchParam = new URLSearchParams(str);
    const type = urlSearchParam.get('type');
    const orgId = urlSearchParam.get('organizationId');
    const id = !type || type === 'site' ? 0 : orgId || 0;
    newConfig.headers['H-Tenant-Id'] = id;
    newConfig.headers['H-Menu-Id'] = MenuStore.activeMenu ? MenuStore.activeMenu.id : 0;
    newConfig.headers['Content-Type'] = 'application/json';
    newConfig.headers.Accept = 'application/json';
    transformRequestPage(newConfig);
    const accessToken = getAccessToken();
    if (accessToken) {
      newConfig.headers.Authorization = accessToken;
    }
    return newConfig;
  },
  (err) => {
    const error = err;
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return response;
    }
    if (Object.prototype.hasOwnProperty.call(response, 'data')) {
      if (response.data.failed === true) {
        throw response.data;
      }
      return transformResponsePage(response.data);
    } else {
      return response;
    }
  },
  (error) => {
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

export default instance;
