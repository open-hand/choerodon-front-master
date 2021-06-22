import { removeAccessToken } from '@/utils/accessToken';
import { authorizeUrl, authorizeC7n } from '@/utils/authorize';
import React from 'react';
import {
  prompt,
} from '@/utils';
import { AxiosError } from 'axios';
import { notification } from 'choerodon-ui';

// 是否出现身份认证失效的弹框
let isExistInvalidTokenNotification = false;

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

export default function handelResponseError(error: AxiosError) {
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
        prompt(response.data, 'error');
        break;
    }
  }
  throw error;
}
