import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { useHistory, useLocation } from 'react-router';
import { useQueryString, Loading } from '@choerodon/components';
import { useHomePageStore } from './stores';
import Header from './components/header';
import C7NMenu from './components/menu';
import {} from 'choerodon-ui/pro';

const HomePage = (props:any) => {
  const {
    homeStore,
    prefixCls,
  } = useHomePageStore();

  const {
    AppState: {
      isAuth,
      currentMenuType,
    },
  } = props;

  const history = useHistory();
  const location = useLocation();
  const params = useQueryString();

  useEffect(() => {

  }, []);

  if (!isAuth && !currentMenuType) {
    return <Loading type="c7n" />;
  }

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-header`}>
        <Header />
      </div>
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-content`}>
          <C7NMenu />
        </div>
      </div>
    </div>
  );
};

export default inject('AppState')(observer(HomePage));
