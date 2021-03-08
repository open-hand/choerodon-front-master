import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import ApproveListDataSet from './ApproveListDataSet';

const Store = createContext();

export function useApproveStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState,
    AppState: { currentMenuType: { organizationId, projectId } },
  } = props;

  const approveListDs = useMemo(() => new DataSet(ApproveListDataSet({ projectId })), [projectId]);

  const value = {
    ...props,
    approveListDs,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
