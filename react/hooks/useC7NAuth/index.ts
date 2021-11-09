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

  const {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
  } = params;

  const handleAuth = useCallback(async () => {
    setTrue();
    try {
      if (accessToken) {
        // 单点登录界面过来的时候
        setAccessToken(accessToken, tokenType, expiresIn);
        window.location.href = window.location.href.replace(/[&?]redirectFlag.*/g, '');
      } else if (!getAccessToken()) {
        // token过期
        authorizeC7n();
        return;
      }
      // 一进页面就需要请求的接口
      HeaderStore.axiosGetRoles();
      AppState.loadModules();
      AppState.loadDeployServices();
      await HeaderStore.axiosGetOrgAndPro();
      await AppState.loadUserInfo();
      setFalse();
    } catch (e) {
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
