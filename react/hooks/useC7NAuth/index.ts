import { useQueryString } from '@choerodon/components';
import { useCallback, useEffect, useState } from 'react';
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
  const [authStatus, setStatus] = useState<AuthStatus>('pending');

  // 获取url的params
  const params = useQueryString();

  const {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
  } = params;

  const handleAuth = useCallback(async () => {
    try {
      if (accessToken) {
        setAccessToken(accessToken, tokenType, expiresIn);
        window.location.href = window.location.href.replace(/[&?]redirectFlag.*/g, '');
        setStatus('pending');
        HeaderStore.axiosGetRoles();
        AppState.loadModules();
        AppState.loadDeployServices();
        await AppState.loadUserInfo();
        setStatus('success');
      } else if (!getAccessToken()) {
        authorizeC7n();
        setStatus('noAuth');
      } else {
        setStatus('failed');
      }
    } catch (e) {
      setStatus('failed');
    }
  }, [accessToken, expiresIn, tokenType]);

  useEffect(() => {
    autoAuth && handleAuth();
  }, [autoAuth, handleAuth]);

  return [authStatus, handleAuth] as const;
}

export default useC7NAuth;

export {
  AuthStatus,
};
