import { useQueryString } from '@choerodon/components';
import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import * as dd from 'dingtalk-jsapi';
import openLink from 'dingtalk-jsapi/api/biz/util/openLink';
import close from 'dingtalk-jsapi/api/biz/navigation/close';
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
    // eslint-disable-next-line no-debugger
    debugger;
    setTrue();
    try {
      if (accessToken) {
        // 单点登录界面过来的时候
        setAccessToken(accessToken, tokenType, expiresIn);

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
