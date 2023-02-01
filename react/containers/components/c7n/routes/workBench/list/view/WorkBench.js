import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import queryString from 'query-string';
import { mount, get } from '@choerodon/inject';
import { Page } from '@/components/c7n-page';
import { useWorkBenchStore } from '../../stores';
import WorkBenchHeader from './components/WorkBenchHeader';
import WorkBenchPage from '../../components/work-bench-page';
import WorkBenchDashboard from '../../components/WorkBenchDashboard';
import ExternalComponent from '@/components/external-component';
import './WorkBench.less';

const WorkBench = () => {
  const {
    prefixCls,
    viewDs,
    history,
    location: { search },
    getUserId,
  } = useWorkBenchStore();

  const method = get('base-pro:useRegisterCompleteInfoModal') || function Tentative() {};
  method({
    userId: getUserId,
  });

  useEffect(() => {
    // 这个是是否有重定向工作台 有就跳转到传入的重定向地址
    const redirectWorkBench = get('configuration.master-global:redirectWorkBench');
    if (redirectWorkBench) {
      window.location.replace(`${window.location.origin}/#${redirectWorkBench}`);
    }
  }, []);
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
      {viewDs.current?.get('dashboardPageMode')
        ? <WorkBenchPage dashboardId={viewDs.current?.get('dashboardPageCode')} />
        : (
          <WorkBenchDashboard
            dashboardId={viewDs.current?.get('dashboardId')}
            isEdit={false}
            onOpenCardModal={redirectToEdit}
          />
        )}
      {mount('base-pro:newUserGuidePage', {})}
      <ExternalComponent system={{ scope: 'basePro', module: 'RegisterenterSystemModal' }} fallback={<span />} />
    </Page>
  );
};

export default observer(WorkBench);
