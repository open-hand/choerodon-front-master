import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { get } from 'lodash';
import AppServiceDataSet from './AppServiceDataSet';
import { useWorkBenchStore } from '../../../stores';

const Store = createContext();

export function useRecentAppStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const {
    cacheStore,
    selectedProjectId,
    category,
  } = useWorkBenchStore();

  const {
    cacheAppServiceData,
  } = cacheStore;

  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ selectedProjectId, cacheStore, organizationId })), [organizationId, selectedProjectId, cacheStore]);

  useEffect(() => {
    const mainData = cacheAppServiceData;
    if (selectedProjectId !== get(mainData, 'selectedProjectId')) {
      appServiceDs.query();
      return;
    }
    if (cacheAppServiceData && get(cacheAppServiceData, 'length')) {
      appServiceDs.loadData(cacheAppServiceData);
    }
  }, [appServiceDs, cacheAppServiceData]);

  const value = {
    ...props,
    appServiceDs,
    organizationId,
    history,
    selectedProjectId,
    category,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
