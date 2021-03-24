import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import CommitDataSet from './CommitDataSet';

const Store = createContext();

export function useCommitChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { projectId } },
  } = props;

  const commitDs = useMemo(() => new DataSet(CommitDataSet({ projectId })), [projectId]);

  const value = {
    ...props,
    commitDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
