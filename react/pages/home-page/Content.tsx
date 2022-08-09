import React from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { useHistory, useLocation } from 'react-router';
import { useQueryString, Loading } from '@choerodon/components';
import { get } from '@choerodon/inject';

import { useHomePageStore } from './stores';
import Header from './components/header';
import C7NMenu from './components/menu';
import C7NRoutes from '@/routes';
import { useLoadUserInfo } from '@/hooks/useUserInfo';
import useCheckPasswordOutdate from './hooks/useCheckPasswordOutdate';

const HomePage = (props:any) => {
  const {
    homeStore,
    prefixCls,
  } = useHomePageStore();

  const {
    AppState: {
      currentMenuType,
    },
  } = props;

  // 拉取用户的个人信息, 全局有且仅有一个！除非其他特殊的情况，重新拉取个人信息请调用queryClient.invalidateQueries
  const { data: userInfo, isFetching, isLoading } = useLoadUserInfo();

  useCheckPasswordOutdate();

  const history = useHistory();
  const location = useLocation();
  const params = useQueryString();

  if (isLoading || !currentMenuType) {
    return <Loading type={get('configuration.master-global:loadingType') || 'c7n'} />;
  }

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-header`}>
        <Header />
      </div>
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-content`}>
          <C7NMenu />
          <C7NRoutes />
        </div>
      </div>
    </div>
  );
};

export default inject('AppState')(observer(HomePage));
