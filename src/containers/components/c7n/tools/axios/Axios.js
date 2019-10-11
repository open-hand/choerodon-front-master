import axios from 'axios';
import { authorizeUrl } from '../../../../common/authorize';
import { getAccessToken, removeAccessToken } from '../../../../common/accessToken';
import { API_HOST } from '../../../../common/constants';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|PERMISSION_ACCESS_TOKEN_EXPIRED)/;

axios.defaults.timeout = 30000;
axios.defaults.baseURL = API_HOST;

axios.interceptors.request.use(
  (config) => {
    const newConfig = config;
    newConfig.headers['Content-Type'] = 'application/json';
    newConfig.headers.Accept = 'application/json';
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

axios.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return response;
    }
    return 'data' in response ? response.data : response;
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

export default axios;
