import axios from 'axios';

import {
  prompt,
  getAccessToken,
} from '@/utils';
import { API_HOST } from '@/utils/constants';
import JSONbig from 'json-bigint';
import { transformResponsePage, transformRequestPage } from './transformPageData';
import {
  cursiveSetCorrectId,
  handleResponseCancelToken,
  handleRequestCancelToken,
  handelResponseError,
  handleDefaultTransformParamsSerializer,
} from './common';
// eslint-disable-next-line import/no-cycle
import MenuStore from '../../../../stores/c7n/MenuStore';

const JSONbigString = JSONbig({ storeAsString: true });

const handleDefaultTransformResponse = (data) => {
  try {
    return JSONbigString.parse(data);
  } catch (error) {
    return data;
  }
};

const handleRequestIntercept = (config) => {
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
      correctId = cursiveSetCorrectId(data, correctId);
    }
  }

  newConfig.headers['H-Menu-Id'] = correctId || 0;

  transformRequestPage(newConfig);

  const accessToken = getAccessToken();
  if (accessToken) {
    newConfig.headers.Authorization = accessToken;
  }

  return handleRequestCancelToken(newConfig);
};

const handleResponseInttercept = (response) => {
  if (response.status === 204) {
    return response;
  }
  if (Object.prototype.hasOwnProperty.call(response, 'data')) {
    if (response.data.failed === true) {
      if (!response.config.noPrompt) {
        prompt(response.data.message, 'error');
      }
      throw response.data;
    }
    return transformResponsePage(response.data);
  }
  return handleResponseCancelToken(response);
};

const ChoerodonAxios = () => {
  axios.defaults.timeout = 30000;
  axios.defaults.baseURL = API_HOST;
  axios.defaults.transformResponse = [
    handleDefaultTransformResponse,
  ];
  axios.defaults.routeChangeCancel = true;

  axios.defaults.paramsSerializer = handleDefaultTransformParamsSerializer;

  axios.interceptors.request.use(handleRequestIntercept,
    (err) => {
      const error = err;
      return Promise.reject(error);
    });

  axios.interceptors.response.use(handleResponseInttercept, handelResponseError);

  return axios;
};

export default ChoerodonAxios();
