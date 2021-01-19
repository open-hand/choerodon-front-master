import React, { createContext, useContext, useEffect } from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';

import moment from 'moment';
import useStore from './useStore';
import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useWorkloadStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId } },
  } = props;
  const { startedRecord } = useProjectOverviewStore();
  const workloadStore = useStore(projectId);
  useEffect(() => {
    if (startedRecord) {
      workloadStore.axiosGetTableData(startedRecord.sprintId);
    }
  }, [startedRecord]);
  const value = {
    ...props,
    workloadStore,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
