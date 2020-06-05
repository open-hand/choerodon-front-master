import axios from 'axios';
import {
  prompt,
  getAccessToken,
  removeAccessToken,
} from '@/utils';
import { authorizeUrl } from '@/utils/authorize';
import { API_HOST } from '@/utils/constants';
import { transformResponsePage, transformRequestPage } from './transformPageData';
// eslint-disable-next-line import/no-cycle
import MenuStore from '../../../../stores/c7n/MenuStore';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|PERMISSION_ACCESS_TOKEN_EXPIRED)/;
axios.defaults.timeout = 30000;
axios.defaults.baseURL = API_HOST;

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
    if (response.data) {
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
