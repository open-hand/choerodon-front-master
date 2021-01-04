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

  const url = !selectedProjectId ? `devops/v1/organizations/${organizationId}/work_bench/latest_app_service` : `devops/v1/organizations/${organizationId}/work_bench/latest_app_service?project_id=${selectedProjectId}`;

  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ url, cacheStore })), [url, cacheStore]);

  useEffect(() => {
    if (cacheAppServiceData.length) {
      appServiceDs.loadData(cacheAppServiceData);
    } else {
      appServiceDs.query();
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
