/* eslint-disable no-underscore-dangle */
import { useQueryString } from '@zknow/components';
import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import {
  authorizeC7n, getAccessToken, setAccessToken, logout, removeCookie,
} from '@/utils';

import AppState from '@/containers/stores/c7n/AppState';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';
import axios from '@/components/axios';
import { getCookie } from '@/utils/cookie';

type AuthStatus = 'noAuth' | 'pending' | 'success' | 'failed'

/**
 * 猪齿鱼登陆hook逻辑
 * @param {boolean} [autoAuth]
 * @return {[AuthStatus, auth]}
 */
function useC7NAuth(autoAuth?:boolean) {
  const [loading, { setTrue, setFalse }] = useBoolean(true);

  // 获取url的params
  const params = useQueryString();

  let {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
  } = params;

  if (window.location.href.indexOf('access_token') !== -1 && !accessToken) {
    const paramsObj: {
      [propName: string]: any
    } = {};
    const str = window.location.href.split('/#/')[1];
    // @ts-ignore
    str.replace(/([^=&]+)=([^&]*)/g, (m, key, value) => {
      paramsObj[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    accessToken = paramsObj.access_token;
    tokenType = paramsObj.token_type;
    expiresIn = paramsObj.expires_in;
  }

  useEffect(() => {
    function handleStorageChange(e:StorageEvent) {
      if (e.key === 'accessToken' && localStorage.getItem('accessToken') !== 'undefined') {
        window.location.reload();
      }
    }
    localStorage.setItem('accessToken', accessToken);
    window.addEventListener('storage', handleStorageChange);
  }, []);

  const handleAuth = useCallback(async () => {
    setTrue();

    //  上海电气单点登录逻辑处理 （后续有功能二开，把逻辑挪到二开仓库）
    const isShanghaiElectric = (window as any)._env_.shanghaiElectric;
    const shanghaiElectricToken = getCookie('LtpaToken', {
      domain: '.shanghai-electric.com',
    });
    try {
      if (accessToken) {
        // 单点登录界面过来的时候
        setAccessToken(accessToken, tokenType, expiresIn);

        const res = await AppState.loadUserInfo(false);
        console.log("sessionStorage.getItem('userId')", sessionStorage.getItem('userId'));
        console.log('res.id', res.id);
        if (sessionStorage.getItem('userId') && (String(res.loginName) !== (sessionStorage.getItem('userId')))) {
          window.location.href = `${window.location.href.replace(/[&?]redirectFlag.*/g, '').split('/#/')[0]}/#/workbench?`
          + `id=${res.tenantId}&name=${res.tenantName}&organizationId=${res.tenantId}&type=organization`;
        }
        if (window.location.href?.includes('redirectFlag')) {
          window.location.href = window.location.href.replace(/[&?]redirectFlag.*/g, '');
        } else {
          window.location.href = `${window.location.href.replace(/[&?]redirectFlag.*/g, '').split('/#/')[0]}/#/workbench?`
          + `id=${res.tenantId}&name=${res.tenantName}&organizationId=${res.tenantId}&type=organization`;
        }
      } else if (!getAccessToken()) {
        if (isShanghaiElectric) {
          if (!shanghaiElectricToken) {
            const { API_HOST } = (window as any)._env_;
            window.location.href = `${API_HOST}/oauth/choerodon/login`;
            return;
          }
          try {
            const res = await axios.post('/oauth/choerodon/electric/authorization_by_token', {
              token: shanghaiElectricToken,
              authType: 'token',
            }, { noPrompt: true });

            window.location.href = res;
            if (res.indexOf('/oauth/choerodon/login') === -1) {
              window.location.reload();
            }
          } catch (error) {
            window.location.href = '/#/authenticationFailure/notExistUser';
          }
          return;
        }
        // token过期
        authorizeC7n();
        return;
      } else if (isShanghaiElectric && shanghaiElectricToken && getAccessToken()) {
        // 防止token过期登录不上刷新token
        try {
          const newToken = await axios.post('/oauth/choerodon/electric/refresh_token', {
            token: shanghaiElectricToken,
            authType: 'token',
          });
          setAccessToken(newToken, 'bearer', 'placeholder');
        } catch (error) {
          removeCookie('LtpaToken', {
            path: '/',
          });
          logout();
          return;
        }
      }
      // 一进页面就需要请求的接口
      HeaderStore.axiosGetRoles(); // 请求角色
      AppState.loadModules(); // 加载所有模块
      AppState.loadDeployServices(); // 后端部署的所有服务
      await HeaderStore.axiosGetOrgAndPro(); // 获取所有组织
      await AppState.loadUserInfo();
      setFalse();
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }, [accessToken, expiresIn, setFalse, setTrue, tokenType]);

  useEffect(() => {
    autoAuth && handleAuth();
  }, [autoAuth, handleAuth]);

  return [loading, handleAuth] as const;
}

export default useC7NAuth;

export {
  AuthStatus,
};
