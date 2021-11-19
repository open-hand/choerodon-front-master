import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import queryString from 'query-string';
import { mount } from '@choerodon/inject';
import { Page } from '@/components/c7n-page';
import { useWorkBenchStore } from '../../stores';
import WorkBenchHeader from './components/WorkBenchHeader';
import WorkBenchPage from '../../components/work-bench-page';
import WorkBenchDashboard from '../../components/WorkBenchDashboard';
import './WorkBench.less';

const WorkBench = () => {
  const {
    prefixCls,
    viewDs,
    history,
    AppState,
    location: { search },
  } = useWorkBenchStore();

  useEffect(() => {
    async function loadUserWizard() {
      await AppState.loadUserWizard(AppState.currentMenuType.organizationId);
    }
    loadUserWizard();
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

  return AppState.getUserWizardList ? (
    <Page className={prefixCls}>
      {mount('base-pro:newUserGuidePage', {
        list: AppState.getUserWizardList,
      })}
    </Page>
  ) : (
    <Page className={prefixCls}>
      <WorkBenchHeader />
      {viewDs.current?.get('dashboardPageMode')
        ? <WorkBenchPage dashboardId={viewDs.current?.get('dashboardId')} />
        : (
          <WorkBenchDashboard
            dashboardId={viewDs.current?.get('dashboardId')}
            isEdit={false}
            onOpenCardModal={redirectToEdit}
          />
        )}
    </Page>
  );
};

export default observer(WorkBench);
