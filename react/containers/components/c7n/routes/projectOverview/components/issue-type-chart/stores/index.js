import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';

import { DataSet } from 'choerodon-ui/pro';
import IssueTypeChartDsDataSet from './IssueTypeChartDataSet';

import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useIssueTypeChartStore() {
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

  const issueTypeChartDs = useMemo(() => new DataSet(IssueTypeChartDsDataSet({ projectId, startedRecord, organizationId })), [organizationId, projectId, startedRecord]);

  const value = {
    ...props,
    issueTypeChartDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
