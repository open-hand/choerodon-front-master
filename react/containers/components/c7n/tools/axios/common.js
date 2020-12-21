import axios from 'axios';
import { removeAccessToken } from '@/utils/accessToken';
import { authorizeUrl } from '@/utils/authorize';
import qs from 'qs';
import BigNumber from 'bignumber.js';

// eslint-disable-next-line import/no-cycle
import MenuStore from '../../../../stores/c7n/MenuStore';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

const pendingRequest = [];

const cursiveSetCorrectId = (source, correctId) => {
  let tempCorrectedId = correctId;
  source.forEach((item) => {
    if (item.code === MenuStore.activeMenu.code) {
      tempCorrectedId = item.id;
    } else if (item.subMenus && item.subMenus.length > 0) {
      tempCorrectedId = cursiveSetCorrectId(item?.subMenus || [], tempCorrectedId);
    }
  });
  return tempCorrectedId;
};

const handleResponseCancelToken = (config) => {
  const markIndex = pendingRequest.findIndex((item) => item.name === config.requestMark);
  // 找到了就删除该标识
  markIndex > -1 && pendingRequest.splice(markIndex, 1);
};

const handleDefaultTransformParamsSerializer = (params) => {
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

const handelResponseError = (error) => {
  const { response } = error;
  let errorFormat = {};
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
    handleResponseCancelToken(response.config);
    // 设置返回的错误对象格式
    errorFormat = {
      status: response.status,
      data: response.data,
    };
  }
  // 如果是主动取消了请求，做个标识
  if (axios.isCancel(error)) {
    errorFormat.selfCancel = true;
  }
  throw errorFormat;
};

const handleRequestCancelToken = (config) => {
  const tempConfig = config;
  // 区别请求的唯一标识，这里用方法名+请求路径
  // 如果一个项目里有多个不同baseURL的请求 + 参数
  const queryParams = config.params || {};

  const tempQueryString = Object.entries(queryParams).reduce((queryString, [key, value], index) => {
    const symbol = queryString.length === 0 ? '?' : '&';
    queryString += typeof value === 'string' ? `${symbol}${key}=${value}` : '';
    return queryString;
  }, '');

  const requestMark = `${tempConfig.method} ${config.baseURL}${tempConfig.url}${tempQueryString}`;

  // 找当前请求的标识是否存在pendingRequest中，即是否重复请求了
  const markIndex = pendingRequest.findIndex((item) => item.name === requestMark);
  // 存在，即重复了
  if (markIndex > -1) {
    // 取消上个重复的请求
    pendingRequest[markIndex].cancel();
    // 删掉在pendingRequest中的请求标识
    pendingRequest.splice(markIndex, 1);
  }
  // （重新）新建针对这次请求的axios的cancelToken标识
  const { CancelToken } = axios;
  const source = CancelToken.source();
  tempConfig.cancelToken = source.token;
  // 设置自定义配置requestMark项，主要用于响应拦截中
  tempConfig.requestMark = requestMark;
  // 记录本次请求的标识
  pendingRequest.push({
    name: requestMark,
    cancel: source.cancel,
    routeChangeCancel: config.routeChangeCancel, // 可能会有优先级高于默认设置的routeChangeCancel项值
  });

  return tempConfig;
};

export {
  cursiveSetCorrectId,
  pendingRequest,
  handleRequestCancelToken,
  handleResponseCancelToken,
  handelResponseError,
  handleDefaultTransformParamsSerializer,
};
