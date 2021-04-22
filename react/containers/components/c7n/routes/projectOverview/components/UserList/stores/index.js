import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import UserListDataSet from './UserListDataSet';
import useStore from './useStore';

const Store = createContext();

export function useUserListChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { projectId } },
  } = props;

  const mainStore = useStore();

  const userListDs = useMemo(() => new DataSet(UserListDataSet({ projectId, mainStore })), [projectId]);

  const value = {
    ...props,
    userListDs,
    mainStore,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
