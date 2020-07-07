import React, { createContext, useContext, useEffect } from 'react';
import useStore from './useStore';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';

import moment from 'moment';
import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useDefectTreatmentStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId } },
  } = props;
  const { projectOverviewStore } = useProjectOverviewStore();
  const defectTreatmentStore = useStore(organizationId, projectId);

  const value = {
    ...props,
    defectTreatmentStore,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
