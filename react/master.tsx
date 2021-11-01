import React, { useState, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import {
  useEventListener,
  useLocalStorageState,
  useMount,
  useUpdateEffect,
} from 'ahooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { ModalProvider } from 'choerodon-ui/pro';
import { Container } from '@hzero-front-ui/core';
import { Loading, useQueryString } from '@choerodon/components';
import {
  authorizeC7n, getAccessToken, setAccessToken,
} from '@/utils';
import Outward from './containers/components/c7n/routes/outward';
import { asyncLocaleProvider, asyncRouter } from '@/hoc';

import AppState from './containers/stores/c7n/AppState';
import HeaderStore from './containers/stores/c7n/HeaderStore';
import stores from './containers/stores';

import Master from './containers/components/c7n/master';
import './containers/components/style';
import { enterprisesApi } from './apis';
import { ENTERPRISE_ADDRESS } from './constants';
import { useC7NThemeInit } from './configs';
import { useC7NNotification, useSafariAdapter } from './hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const language = AppState.currentLanguage;

const UILocaleProviderAsync = asyncRouter(
  () => import('choerodon-ui/lib/locale-provider'),
  { locale: () => import(`choerodon-ui/lib/locale-provider/${language}.js`) },
);

const IntlProviderAsync = asyncLocaleProvider(language,
  () => import(`./locale/${language}`));

/** @type {boolean} 是否安装了敏捷模块 */
const HAS_AGILE_PRO = C7NHasModule('@choerodon/agile-pro');

const MasterIndex = (props:{
  [fields:string]:any
}) => {
  const {
    location,
    history,
    AutoRouter,
  } = props;

  const {
    pathname,
    search,
  } = location;

  // 历史路径
  const historyPath = sessionStorage.getItem('historyPath');

  const [hasEnterpriseConfirmed, setEnterPriseConfirmed] = useLocalStorageState('hasEnterpriseConfirmed', false);

  // 用于多relogin的逻辑，多tab之间刷新页面
  const [, setReloginValue] = useLocalStorageState('relogin', false);

  const [loading, setLoading] = useState<boolean>(true);

  // 获取url的params
  const params = useQueryString();

  // 监听storage，作用在于如果有其他重新登录了，就触发刷新事件
  useEventListener('storage', handleStorageChange);

  // 注入Notification授权的hook
  useC7NNotification();

  // 初始化注入新UI的版本hook
  useC7NThemeInit();

  // 为safari浏览器做适配的hook
  useSafariAdapter();

  /**
   * 判断当前pathname是否存在于环境变量outward中，表明是否需要认证
   * @return {boolean}
   */
  const isInOutward = useMemo(() => {
    // "/knowledge/share,/knowledge/organizations/create,/knowledge/project/create,/iam/register-organization,/iam/invite-user"
    // eslint-disable-next-line no-underscore-dangle
    const injectOutward = window._env_.outward;
    if (injectOutward) {
      const splitArr = injectOutward.split(',').map((r) => r.replace(/['"']/g, ''));
      splitArr.push('/unauthorized');
      return splitArr.indexOf(pathname) >= 0;
    }
    return false;
  }, [pathname]);

  /**
   * 其他tab页重新登录，刷新当前页面
   * @param {*} e {StorageEvent}
   */
  function handleStorageChange(e:StorageEvent) {
    if (e.key === 'relogin') {
      window.location.reload();
    }
  }

  /**
   * 开源版admin账号登录判断是否展示企业信息完善页面
   */
  async function checkEnterprise() {
    try {
      const res = await enterprisesApi.checkEnterpriseInfo();
      if (res) {
        setEnterPriseConfirmed(true);
      } else {
        history.push(ENTERPRISE_ADDRESS);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * todo....
   * @return {*}
   */
  async function auth() {
    setLoading(true);
    const {
      access_token: accessToken,
      token_type: tokenType,
      expires_in: expiresIn,
    } = params;
    if (accessToken) {
      setAccessToken(accessToken, tokenType, expiresIn);
      // 通知其他tab页刷新，在localstorage里头设置
      setReloginValue(true);
      window.location.href = window.location.href.replace(/[&?]redirectFlag.*/g, '');
    } else if (!getAccessToken()) {
      authorizeC7n();
      return;
    }
    if (!HAS_AGILE_PRO && !pathname?.startsWith(ENTERPRISE_ADDRESS)) {
      await checkEnterprise();
    }
    HeaderStore.axiosGetRoles();
    AppState.loadModules();
    AppState.loadDeployServices();
    await AppState.loadUserInfo();
    setLoading(false);
  }

  useMount(() => {
    // 如果不存在历史地址则设置当前地址为跳转地址
    !historyPath && sessionStorage.setItem('historyPath', pathname + search);

    // 不是就校验去登录
    !isInOutward && auth();
  });

  useUpdateEffect(() => {
    if (!isInOutward) {
      if (loading) {
        auth();
      } else if (pathname.startsWith(ENTERPRISE_ADDRESS) && !hasEnterpriseConfirmed && !HAS_AGILE_PRO) {
        checkEnterprise();
      }
    }
  }, [pathname, loading, isInOutward]);

  const getContainer = useMemo(() => {
    const content = isInOutward ? Outward : Master;
    return React.createElement(content, {
      AutoRouter,
    });
  }, [isInOutward, AutoRouter]);

  if (loading && !isInOutward) {
    return (
      <Loading
        style={{
          position: 'fixed',
          margin: 'auto',
          inset: 0,
        }}
        type="c7n"
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UILocaleProviderAsync>
        <IntlProviderAsync>
          <ModalProvider location={window.location}>
            <Provider {...stores}>
              <Container>
                {getContainer}
              </Container>
            </Provider>
          </ModalProvider>
        </IntlProviderAsync>
      </UILocaleProviderAsync>
    </QueryClientProvider>
  );
};

export default withRouter(observer(MasterIndex));
