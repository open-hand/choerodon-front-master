import axios from 'axios';
import qs from 'qs';
import BigNumber from 'bignumber.js';
import { authorizeUrl } from '@/utils/authorize';
import { getAccessToken, removeAccessToken } from '@/utils/accessToken';
import { API_HOST } from '@/utils/constants';
import JSONbig from 'json-bigint';
import { prompt } from '@/utils';
import { transformResponsePage, transformRequestPage } from './transformPageData';
import MenuStore from '../../../../stores/c7n/MenuStore';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

const JSONbigString = JSONbig({ storeAsString: true });
const instance = axios.create({
  timeout: 30000,
  baseURL: API_HOST,
  transformResponse: [function (data) {
    try {
      return JSONbigString.parse(data);
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
    let correctId = 0;
    let flag = 0;
    if (MenuStore.activeMenu) {
      let data;
      const { level } = MenuStore.activeMenu;
      const menuGroup = JSON.parse(localStorage.getItem('menuGroup'));
      function cursiveSetCorrectId(source) {
        for (let i = 0; i < source.length; i++) {
          if (source[i].code === MenuStore.activeMenu.code) {
            correctId = source[i].id;
            flag = 1;
          } if (source[i].subMenus && source[i].subMenus.length > 0) {
            return cursiveSetCorrectId(source[i].subMenus);
          }
          if (flag === 1) {
            break;
          }
        }
      }
      if (['site', 'users'].includes(level)) {
        data = menuGroup[level];
      } else {
        data = menuGroup[level][urlSearchParam.get('id')];
      }
      if (data) {
        cursiveSetCorrectId(data);
      }
    }
    newConfig.headers['H-Menu-Id'] = correctId || 0;
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
      if (response.data?.failed === true) {
        throw response.data;
      }
      return transformResponsePage(response.data);
    }
    return response;
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
          prompt(response.data, 'error');
          break;
      }
    }
    throw error;
  },
);

export default instance;
