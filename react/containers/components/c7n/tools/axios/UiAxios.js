import axios from 'axios';
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
  }]
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
    if (MenuStore.activeMenu) {
      const level = MenuStore.activeMenu.level;
      const menuGroup = JSON.parse(localStorage.getItem('menuGroup'));
      if (['site', 'users'].includes(level)) {
        correctId = menuGroup[level].find(m => m.code === MenuStore.activeMenu.code).id;
      } else {
        const data = menuGroup[level][urlSearchParam.get('id')]
        function cursiveSetCorrectId(source) {
          for(let i = 0; i < source.length; i ++) {
            if (source[i].code === MenuStore.activeMenu.code) {
              correctId = source[i].id;
              return false;
            } else if (source[i].subMenus && source[i].subMenus.length > 0) {
              return cursiveSetCorrectId(source[i].subMenus);
            }
          }
        }
        if (data) {
          cursiveSetCorrectId(data);
        }
      }
    }
    newConfig.headers['H-Menu-Id'] = correctId;
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
