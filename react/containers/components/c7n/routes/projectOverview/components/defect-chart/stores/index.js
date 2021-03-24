import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';

import { DataSet } from 'choerodon-ui/pro';
import useStore from './useStore';
import DefectCountDataSet from './DefectCountDataSet';

import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useDefectChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { projectId } },
  } = props;
  const defectChartStore = useStore(projectId);

  const {
    startedRecord,
  } = useProjectOverviewStore();

  const defectCountDs = useMemo(() => new DataSet(DefectCountDataSet({ projectId, startedRecord })), [projectId, startedRecord]);

  const value = {
    ...props,
    defectCountDs,
    defectChartStore,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
