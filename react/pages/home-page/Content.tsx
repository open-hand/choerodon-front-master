import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router';
import { useHomePageStore } from './stores';
import Header from './components/header';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

const HomePage = observer(() => {
  const {
    homeStore,
    prefixCls,
  } = useHomePageStore();

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {

  }, []);

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-header`}>
        <Header />
      </div>
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-content`}>
          helloworlx
        </div>
      </div>
    </div>
  );
});

export default HomePage;
