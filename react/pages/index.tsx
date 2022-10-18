import React, { useMemo, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import {
  useLocalStorageState,
  useMount,
  useUpdateEffect,
} from 'ahooks';
import { Provider } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import Cookies from 'universal-cookie';
import { message } from 'choerodon-ui';
import ErrorImage from '@/assets/images/errorhandle.png';
import stores from '@/containers/stores';

import Master from '@/containers/components/c7n/master';
import Outward from '@/containers/components/c7n/routes/outward';

import { enterprisesApi } from '@/apis';
import { ENTERPRISE_ADDRESS } from '@/constants';

import '@/containers/components/style';

// injects modules entry
import './moduleInjects';

import {
  C7NReactQueryContainer, UIConfigInitContainer,
} from '@/configs';

import {
  useC7NAuth, useMultiTabsAutoRefresh, useSafariAdapter, useSetHistoryPath,
} from '@/hooks';

import WSProvider from '@/components/ws/WSProvider';
import { PermissionProvider } from '@/components/permission';

import { WEBSOCKET_SERVER } from '@/utils';
import { MasterLocaleContainer } from '@/configs/masterLocaleConfigs';

/** @type {boolean} 是否安装了敏捷模块 */
const HAS_AGILE_PRO = C7NHasModule('@choerodon/agile-pro');

const cookies = new Cookies();

const MasterIndex = () => {
  const location = useLocation();
  const history = useHistory();

  const {
    pathname,
  } = location;

  useEffect(() => {
    window.addEventListener('error', (event) => {
      console.log(event);
      message.error('系统出现问题，请稍后再试');
    }, true);
    window.addEventListener('unhandledrejection', (event) => {
      console.log(event);
      message.error('系统出现问题，请稍后再试');
    });
  }, []);

  const [hasEnterpriseConfirmed, setEnterPriseConfirmed] = useLocalStorageState('hasEnterpriseConfirmed', false);

  // c7n登录hook
  const [loading, auth] = useC7NAuth();

  // // 监听storage，作用在于如果有其他重新登录了，就触发刷新事件
  const [, setReloginValue] = useMultiTabsAutoRefresh();

  // 注入Notification授权
  // useC7NNotification();

  // 为safari浏览器做适配
  useSafariAdapter();

  // 注入存储历史访问url的hook
  useSetHistoryPath();

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
      return splitArr.some((path) => pathname.startsWith(path));
    }
    return false;
  }, [pathname]);

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

  useMount(() => {
    document.body.setAttribute('data-theme', 'theme4');
    if (pathname === '/dingTalkTransition' && cookies.get('access_token')) {
      auth(); // auth() 没有异步抛出结果-- 在这里请求
    }
    // 不是就校验去登录
    !isInOutward && auth();
  });

  useUpdateEffect(() => {
    if (!isInOutward) {
      if (!loading) {
        if (pathname.startsWith(ENTERPRISE_ADDRESS) && !hasEnterpriseConfirmed && !HAS_AGILE_PRO) {
          checkEnterprise();
        }
        setReloginValue(true);
      }
    }
  }, [pathname, loading, isInOutward]);

  const getContainer = useMemo(() => {
    const content: any = isInOutward ? Outward : Master;
    return React.createElement(content);
  }, [isInOutward]);

  if (loading && !isInOutward) {
    return (<div />);
  }

  const handleFallBack = ({ error, resetErrorBoundary }: any) => {
    console.log(error);
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          <img style={{ width: 471 }} src={ErrorImage} alt="" />
          <p
            style={{
              fontSize: 24,
              fontFamily: 'PingFangSC-Regular, PingFang SC',
              fontWeight: 400,
              lineHeight: '33px',
              textAlign: 'center',
            }}
          >
            页面出错了，请
            <span
              role="none"
              style={{
                color: '#5365EA',
                cursor: 'pointer',
              }}
              onClick={() => {
                window.location.reload();
              }}
            >
              【刷新】

            </span>
          </p>
        </div>

      </div>
    );
  };

  return (
    <ErrorBoundary
      FallbackComponent={handleFallBack}
    >
      <Provider {...stores}>
        <MasterLocaleContainer>
          <UIConfigInitContainer>
            <C7NReactQueryContainer>
              <PermissionProvider>
                <WSProvider server={WEBSOCKET_SERVER}>
                  {getContainer}
                </WSProvider>
              </PermissionProvider>
            </C7NReactQueryContainer>
          </UIConfigInitContainer>
        </MasterLocaleContainer>
      </Provider>
    </ErrorBoundary>

  );
};

export default observer(MasterIndex);
