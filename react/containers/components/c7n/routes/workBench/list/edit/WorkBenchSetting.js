import React, {
  useCallback, useMemo, useState, useEffect, useRef
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string';

import useUpgrade from '@/hooks/useUpgrade';
import { Page } from '@/index';

import { useWorkBenchStore } from '../../stores';

// import './WorkBench.less';
import WorkBenchSettingHeader from './components/WorkBenchSettingHeader';

import WorkBenchDashboard from '../../components/WorkBenchDashboard';

const WorkBenchSetting = () => {
  const {
    workBenchUseStore,
    prefixCls,
    editHeaderDs,
    history,
    allowedModules,
    AppState,
    organizationId,
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

  const { data: needUpgrade } = useUpgrade({
    organizationId: AppState.currentMenuType?.organizationId,
  });

  return (
    <Page className={prefixCls}>
      <WorkBenchSettingHeader />
      <WorkBenchDashboard isEdit dashboardId={dashboardId} />
    </Page>
  );
};

export default observer(WorkBenchSetting);
