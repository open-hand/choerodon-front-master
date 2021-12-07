import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { forEach, get } from 'lodash';
import { DataSet } from 'choerodon-ui/pro/lib';
import useStore from './useStore';
import useCpCacheStore from './useCpCacheStore';
import modulesMapping from './modulesMapping';
import ViewDataSet from './ViewDataSet';
import DashboardDataset from './DashboardDataset';
import EditHeaderDataSet from './EditHeaderDataSet';
import AddCardDataSet from './AddCardDataSet';
import { useFormatMessage, useFormatCommon } from '@/hooks';

// eslint-disable-next-line no-undef
const HAS_BACKLOG = C7NHasModule('@choerodon/backlog');
const Store = createContext();

export function useWorkBenchStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId }, currentModules },
    AppState,
    history,
  } = props;
  const hasAgile = currentModules && currentModules.includes('agile');

  function getAllCode() {
    let allowedModules = [...modulesMapping.common, ...hasAgile && HAS_BACKLOG ? modulesMapping.backlog : []];
    forEach(currentModules, (item) => {
      if (Object.prototype.hasOwnProperty.call(modulesMapping, item)) {
        allowedModules = allowedModules.concat(modulesMapping[item]);
      }
    });
    return [...new Set(allowedModules)];
  }

  const workBenchUseStore = useStore(history, AppState);
  const cacheStore = useCpCacheStore();

  const selectedProjectId = get(workBenchUseStore.getActiveStarProject, 'id');
  const category = get(workBenchUseStore.getActiveStarProject, 'category');

  const dashboardDs = useMemo(() => new DataSet(DashboardDataset({ workBenchUseStore })), [workBenchUseStore]);
  const addCardDs = useMemo(() => new DataSet(AddCardDataSet()), []);

  const pageDS = {};
  if (history.location.pathname === '/workbench/edit') {
    pageDS.editHeaderDs = useMemo(() => new DataSet(EditHeaderDataSet({ workBenchUseStore })), [workBenchUseStore]);
  } else {
    pageDS.viewDs = useMemo(() => new DataSet(ViewDataSet({ workBenchUseStore })), [workBenchUseStore]);
    // pageDS.dashboardDs = useMemo(() => new DataSet(DashboardDataset({ workBenchUseStore })), [workBenchUseStore]);
  }

  const intlPrefix = 'c7ncd.workbench';

  const formatWorkbench = useFormatMessage(intlPrefix);
  const formatCommon = useFormatCommon();

  const value = {
    ...props,
    prefixCls: 'c7n-workbench',
    intlPrefix,
    formatWorkbench,
    formatCommon,
    dragPrefixcls: 'c7ncd-dragCard',
    cacheStore,
    workBenchUseStore,
    organizationId,
    selectedProjectId,
    category,
    history,
    currentModules,
    allowedModules: getAllCode(),
    dashboardDs,
    addCardDs,
    ...pageDS,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
