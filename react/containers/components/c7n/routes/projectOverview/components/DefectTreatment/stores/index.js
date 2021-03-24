import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';

import { DataSet } from 'choerodon-ui/pro';
import useStore from './useStore';
import { useProjectOverviewStore } from '../../../stores';
import defectTreatmentDataSet from './DefectTreatmentDataSet';

const Store = createContext();

export function useDefectTreatmentStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId } },
  } = props;

  const defectTreatmentStore = useStore(organizationId, projectId);

  const {
    startedRecord,
  } = useProjectOverviewStore();

  const defectTreatDs = useMemo(() => new DataSet(defectTreatmentDataSet({ startedRecord, projectId })), [projectId, startedRecord]);

  const value = {
    ...props,
    defectTreatmentStore,
    defectTreatDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
