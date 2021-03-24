import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import AppServiceDataSet from './AppServiceDataSet';

const Store = createContext();

export function useServiceChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { projectId } },
  } = props;

  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ projectId })), [projectId]);

  const value = {
    ...props,
    appServiceDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
