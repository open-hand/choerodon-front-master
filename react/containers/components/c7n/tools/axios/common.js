import axios from 'axios';
import React from 'react';
import { removeAccessToken } from '@/utils/accessToken';
import { authorizeUrl } from '@/utils/authorize';
import {
  prompt,
} from '@/utils';
import { notification } from 'choerodon-ui';
import qs from 'qs';
import BigNumber from 'bignumber.js';
import get from 'lodash/get';
import { authorizeC7n } from "@/utils/authorize";

// eslint-disable-next-line import/no-cycle
import MenuStore from '../../../../stores/c7n/MenuStore';

import AxiosEmmitter from './utils/axiosEventEmmiter';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

const axiosEvent = new AxiosEmmitter();

const cacheSymbol = Symbol('choerodon_axios_cache');

window[cacheSymbol] = {};

// 是否出现身份认证失效的弹框
let isExistInvalidTokenNotification = false;

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

function getDataMark(data) {
  if (typeof data === 'string') {
    return JSON.parse(data);
  }
  return data;
}

// 区别请求的唯一标识，这里用方法名+请求路径
// 如果一个项目里有多个不同baseURL的请求 + 参数
function getMark(config) {
  const tempQueryString = config.paramsSerializer(config.params);
  const dataMark = JSON.stringify(getDataMark(get(config, 'data')));
  let requestMark = [
    config.method,
    config.url,
  ];

  tempQueryString && requestMark.push(tempQueryString);
  dataMark && requestMark.push(dataMark);
  requestMark = requestMark.join('&');
  return requestMark;
}

function handleRequestCancelToken(config) {
  const tempConfig = config;
  const enabledCancelCache = get(tempConfig, 'enabledCancelCache');

  if (enabledCancelCache) {
    const cancelCacheKey = getMark(tempConfig);
    console.log(cancelCacheKey);
    if (!window[cacheSymbol][cancelCacheKey]) {
      window[cacheSymbol][cancelCacheKey] = {};
    }
    const {
      data,
      isPending,
      expire,
    } = window[cacheSymbol][cancelCacheKey];

    // if(cancelCacheKey === 'get&http://api.c7n.devops.hand-china.com/iam/choerodon/v1/organizations/631/star_projects'){
    //   debugger
    // }

    if (isPending) {
      // 说明上个重复的请求还在pending，这时候
      tempConfig.adapter = () => new Promise((resolve) => {
        axiosEvent.once(cancelCacheKey, (res) => {
          const resolveData = {
            data: res,
            headers: tempConfig.headers,
            config: {
              ...tempConfig,
              useCache: true,
            },
            request: tempConfig,
          };
          resolve(resolveData);
        });
      });
    } else if (expire && expire > Date.now()) {
      tempConfig.adapter = () => {
        const resolveData = {
          data,
          headers: tempConfig.headers,
          config: {
            ...tempConfig,
            useCache: true,
          },
          request: tempConfig,
        };
        return Promise.resolve(resolveData);
      };
    } else {
      window[cacheSymbol][cancelCacheKey].isPending = true;
    }
  }

  return tempConfig;
}

function handelResponseError(error, ...rest) {
  const { response } = error;
  if (response) {
    const { status } = response;
    switch (status) {
      case 401: {
        if (!isExistInvalidTokenNotification) {
          isExistInvalidTokenNotification = true;
          notification.error({
            message: '未登录或身份认证已失效',
            description:
              // '您未登录或者身份认证已失效 ，请',
            (
              <span>
                您未登录或者身份认证已失效 ，请
                <a onClick={() => {
                  removeAccessToken();
                  authorizeC7n();
                }}>重新登录</a>
              </span>
            ),
            duration: null,
            placement: 'bottomLeft',
            onClose: () => {
              isExistInvalidTokenNotification = false;
            }
          });
        }
        // authorizeUrl();
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
  return Promise.reject(error);
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
  handelResponseError,
  getMark,
  handleDefaultTransformParamsSerializer,
  cacheSymbol,
  axiosEvent,
};
