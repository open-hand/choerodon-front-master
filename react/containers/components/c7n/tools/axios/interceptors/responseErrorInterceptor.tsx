/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */
import React from 'react';
import axios, { AxiosError } from 'axios';
import { notification } from 'choerodon-ui';
import get from 'lodash/get';
import {
  prompt,
} from '@/utils';
import { authorizeUrl, authorizeC7n } from '@/utils/authorize';
import { removeAccessToken } from '@/utils/accessToken';
import getMark from '../utils/getMark';
import { axiosCache, axiosRoutesCancel } from '../instances';

// 是否出现身份认证失效的弹框
let isExistInvalidTokenNotification = false;

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

export default function handelResponseError(error: AxiosError) {
  const { response, config } = error;

  const enabledCancelRoute = get(config, 'enabledCancelRoute');
  const enabledCancelCache = get(config, 'enabledCancelCache');

  const cancelCacheKey = get(config, 'cancelCacheKey') || getMark(config);

  if (enabledCancelRoute) {
    axiosRoutesCancel.delete(cancelCacheKey);
  }

  if (enabledCancelCache && axiosCache.has(cancelCacheKey)) {
    axiosCache.delete(cancelCacheKey);
  }

  // 如果是主动取消了请求，做个标识
  if (axios.isCancel(error)) {
    return new Promise(() => {});
  }

  if (response) {
    const { status } = response;
    switch (status) {
      case 401: {
        const hasPageHeader = document.querySelectorAll('.page-header').length > 0;
        // 如果没有出现头部 说明系统都没进去 直接进入重新登录界面
        if (!hasPageHeader) {
          authorizeUrl();
        } else if (!isExistInvalidTokenNotification) {
          isExistInvalidTokenNotification = true;
          notification.error({
            message: '未登录或身份认证已失效',
            description:
                (
                  <span>
                    您未登录或者身份认证已失效 ，请
                    <a
                      role="none"
                      onClick={() => {
                        removeAccessToken();
                        authorizeC7n();
                      }}
                    >
                      重新登录
                    </a>
                  </span>
                ),
            duration: null,
            placement: 'bottomLeft',
            onClose: () => {
              isExistInvalidTokenNotification = false;
            },
          });
        }
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
        if (Object.prototype.toString.call(response.data) !== '[object Blob]') {
          prompt(response.data, 'error');
        }
        break;
    }
  }
  throw error;
}
