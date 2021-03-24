import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';

import { DataSet } from 'choerodon-ui/pro';
import AssigneeChartDsDataSet from './AssigneeChartDsDataSet';

import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useAssigneeChartStore() {
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

  const assigneeChartDs = useMemo(() => new DataSet(AssigneeChartDsDataSet({ projectId, startedRecord, organizationId })), [organizationId, projectId, startedRecord]);

  const value = {
    ...props,
    assigneeChartDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
