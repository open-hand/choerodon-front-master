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

  const appServiceDs = useMemo(() => new DataSet(
    AppServiceDataSet({ selectedProjectId, cacheStore, organizationId }),
  ), [organizationId, selectedProjectId, cacheStore]);

  useEffect(() => {
    const mainData = cacheAppServiceData;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'selectedProjectId');
    if (selectedProjectId !== currentId) {
      appServiceDs.query();
      return;
    }
    if (tempArr) {
      appServiceDs.loadData(tempArr);
    } else {
      appServiceDs.query();
    }
  }, [appServiceDs]);

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
