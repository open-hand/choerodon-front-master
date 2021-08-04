import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string';
import { Page } from '@/index';
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

  return (
    <Page className={prefixCls}>
      <WorkBenchSettingHeader />
      <WorkBenchDashboard isEdit dashboardId={dashboardId} />
    </Page>
  );
};

export default observer(WorkBenchSetting);
