import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';

import { DataSet } from 'choerodon-ui/pro';
import SprintCountDataSet from './SprintCountDataSet';

import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useSprintCountChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { projectId, organizationId } },
  } = props;

  const {
    startedRecord,
  } = useProjectOverviewStore();

  const sprintCountDataSet = useMemo(() => new DataSet(SprintCountDataSet({ projectId, sprint: startedRecord })), [projectId, startedRecord]);

  const value = {
    ...props,
    sprintCountDataSet,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
