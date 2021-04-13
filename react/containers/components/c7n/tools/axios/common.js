import axios from 'axios';
import { removeAccessToken } from '@/utils/accessToken';
import { authorizeUrl } from '@/utils/authorize';
import {
  prompt,
} from '@/utils';
import qs from 'qs';
import BigNumber from 'bignumber.js';

// eslint-disable-next-line import/no-cycle
import MenuStore from '../../../../stores/c7n/MenuStore';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

const pendingRequest = [];

function cursiveSetCorrectId(source, correctId, flag) {
  let tempCorrectedId = correctId;
  let tempFlag = flag;
  for (let i = 0; i < source.length; i += 1) {
    if (source[i].code === MenuStore.activeMenu.code) {
      tempCorrectedId = source[i].id;
      tempFlag = 1;
    }
    if (source[i].subMenus && source[i].subMenus.length > 0) {
      tempCorrectedId = cursiveSetCorrectId(
        source[i].subMenus,
        tempCorrectedId,
        tempFlag,
      );
    }
    if (tempFlag === 1) {
      break;
    }
  }
  return tempCorrectedId;
}

function handleRequestCancelToken(config) {
  const tempConfig = config;
  // 区别请求的唯一标识，这里用方法名+请求路径
  // 如果一个项目里有多个不同baseURL的请求 + 参数
  const queryParams = tempConfig.params || {};

  const tempQueryString = Object.entries(queryParams).reduce(
    (queryString, [key, value], index) => {
      const symbol = queryString.length === 0 ? '?' : '&';
      let current = queryString;
      current += typeof value === 'string' ? `${symbol}${key}=${value}` : `${symbol}${key}=${String(value)}`;
      return current;
    },
    '',
  );

  const requestMark = `${tempConfig.method} ${tempConfig.url}${tempQueryString}`;

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
    // type: ,
    name: requestMark,
    cancel: source.cancel,
    routeChangeCancel: tempConfig.routeChangeCancel, // 可能会有优先级高于默认设置的routeChangeCancel项值
  });

  return tempConfig;
}

function handleResponseCancelToken(config) {
  const markIndex = pendingRequest.findIndex(
    (item) => item.name === config?.config?.requestMark,
  );
  // 找到了就删除该标识
  markIndex > -1 && pendingRequest.splice(markIndex, 1);
}

function handelResponseError(error) {
  const { response } = error;
  let errorFormat = error;
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
    handleResponseCancelToken(response.config);
    // 设置返回的错误对象格式
    errorFormat = {
      status: response.status,
      data: response.data,
      ...errorFormat,
    };
  }
  // 如果是主动取消了请求，做个标识
  if (axios.isCancel(error)) {
    return;
  }
  throw errorFormat;
}

function handleDefaultTransformParamsSerializer(params) {
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
}

export {
  cursiveSetCorrectId,
  handleRequestCancelToken,
  handleResponseCancelToken,
  handelResponseError,
  handleDefaultTransformParamsSerializer,
  pendingRequest,
};
