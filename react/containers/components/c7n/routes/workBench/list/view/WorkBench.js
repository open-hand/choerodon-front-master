import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';

import queryString from 'query-string';
import { Page } from '@/index';
import { useWorkBenchStore } from '../../stores';
import WorkBenchHeader from './components/WorkBenchHeader';
import WorkBenchDashboard from '../../components/WorkBenchDashboard';
import './WorkBench.less';

const WorkBench = () => {
  const {
    prefixCls,
    viewDs,
    history,
    location: { search },
  } = useWorkBenchStore();

  const redirectToEdit = () => {
    const { dashboardId, dashboardName } = viewDs.current.toData();
    let searchParams = queryString.parse(search);
    searchParams = { ...searchParams, dashboardId, dashboardName };
    history.push({
      pathname: '/workbench/edit',
      search: `?${queryString.stringify(searchParams)}`,
    });
  };

  return (
    <Page className={prefixCls}>
      <WorkBenchHeader />
      <WorkBenchDashboard
        dashboardId={viewDs.current?.get('dashboardId')}
        isEdit={false}
        onOpenCardModal={redirectToEdit}
      />
    </Page>
  );
};

export default observer(WorkBench);
