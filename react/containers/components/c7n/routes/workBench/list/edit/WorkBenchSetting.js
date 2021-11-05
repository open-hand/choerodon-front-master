import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string';
import { Page } from '@/components/c7n-page';
import { useWorkBenchStore } from '../../stores';
import WorkBenchSettingHeader from './components/WorkBenchSettingHeader';
import WorkBenchDashboard from '../../components/WorkBenchDashboard';

const WorkBenchSetting = () => {
  const {
    prefixCls,
    editHeaderDs,
    location: { search },
  } = useWorkBenchStore();

  const [dashboardId, setDashboardId] = useState();
  const workbenchHeaderEl = useRef();

  useEffect(() => {
    const { dashboardId: searchDashboardId } = queryString.parse(search);
    if (searchDashboardId) {
      setDashboardId(searchDashboardId);
    }
  }, [search]);

  useEffect(() => {
    const internalTemplate = editHeaderDs.current.get('internalTemplate');
    if (internalTemplate) {
      setDashboardId(internalTemplate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editHeaderDs.current.get('internalTemplate')]);

  const handleOpenCardModal = () => {
    workbenchHeaderEl.current?.openAddComponents();
  };

  return (
    <Page className={prefixCls}>
      <WorkBenchSettingHeader ref={workbenchHeaderEl} />
      <WorkBenchDashboard isEdit dashboardId={dashboardId} onOpenCardModal={handleOpenCardModal} />
    </Page>
  );
};

export default observer(WorkBenchSetting);
