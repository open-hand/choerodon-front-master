import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';

import { DataSet } from 'choerodon-ui/pro';
import IssueTableDataSet from './IssueTableDataSet';

import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useIssueTableChartStore() {
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

  const issueTableDs = useMemo(() => new DataSet(IssueTableDataSet({ projectId, startedRecord, organizationId })), [organizationId, projectId, startedRecord]);

  const value = {
    ...props,
    issueTableDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
