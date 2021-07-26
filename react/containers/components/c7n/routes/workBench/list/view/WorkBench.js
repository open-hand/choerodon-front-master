import React from 'react';
import { observer } from 'mobx-react-lite';

import { Page } from '@/index';
import { useWorkBenchStore } from '../../stores';
import WorkBenchHeader from './components/WorkBenchHeader';
import WorkBenchDashboard from '../../components/WorkBenchDashboard';
import './WorkBench.less';

const WorkBench = () => {
  const {
    prefixCls,
    viewDs,
  } = useWorkBenchStore();

  return (
    <Page className={prefixCls}>
      <WorkBenchHeader />
      <WorkBenchDashboard dashboardId={viewDs.current?.get('dashboardId')} isEdit={false} />
    </Page>
  );
};

export default observer(WorkBench);
