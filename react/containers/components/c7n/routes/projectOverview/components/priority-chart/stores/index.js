import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import PriorityChartDsDataSet from './PriorityChartDsDataSet';
import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function usePriorityChartStore() {
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

  const priorityChartDs = useMemo(() => new DataSet(PriorityChartDsDataSet({ projectId, startedRecord, organizationId })), [organizationId, projectId, startedRecord]);

  const value = {
    ...props,
    priorityChartDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
