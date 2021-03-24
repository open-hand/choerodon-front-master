import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import EnvDataSet from './EnvDataSet';

const Store = createContext();

export function useEnvChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { projectId } },
  } = props;

  const envDs = useMemo(() => new DataSet(EnvDataSet({ projectId })), [projectId]);

  const value = {
    ...props,
    envDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
