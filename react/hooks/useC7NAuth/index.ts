import { useQueryString } from '@choerodon/components';
import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { authorizeC7n, getAccessToken, setAccessToken } from '@/utils';

import AppState from '@/containers/stores/c7n/AppState';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';

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
    try {
      if (accessToken) {
        // 单点登录界面过来的时候
        setAccessToken(accessToken, tokenType, expiresIn);

        const res = await AppState.loadUserInfo(false);
        if (res.id !== sessionStorage.getItem('userId')) {
          window.location.href = `${window.location.href.replace(/[&?]redirectFlag.*/g, '').split('/#/')[0]}/#/workbench?`
          + `id=${res.tenantId}&name=${res.tenantName}&organizationId=${res.tenantId}&type=organization`;
        }

        window.location.href = window.location.href.replace(/[&?]redirectFlag.*/g, '');
        // try {
        //   openLink({ url: window.location.href.replace(/[&?]redirectFlag.*/g, '') }).then(() => close({}));
        // } catch (error) {
        //   console.log(error);
        // }
      } else if (!getAccessToken()) {
        // token过期
        authorizeC7n();
        return;
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
