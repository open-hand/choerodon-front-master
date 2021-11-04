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
        setAccessToken(accessToken, tokenType, expiresIn);
        window.location.href = window.location.href.replace(/[&?]redirectFlag.*/g, '');
        HeaderStore.axiosGetRoles();
        AppState.loadModules();
        AppState.loadDeployServices();
        await AppState.loadUserInfo();
      } else if (!getAccessToken()) {
        authorizeC7n();
      }
      setFalse();
    } catch (e) {
      throw new Error(e);
    }
  }, [accessToken, expiresIn, tokenType]);

  useEffect(() => {
    autoAuth && handleAuth();
  }, [autoAuth, handleAuth]);

  return [loading, handleAuth] as const;
}

export default useC7NAuth;

export {
  AuthStatus,
};
