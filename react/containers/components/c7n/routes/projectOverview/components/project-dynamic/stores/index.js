import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';

import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { DataSet } from 'choerodon-ui/pro';
import ProjectDynamicDataSet from './ProjectDynamicDataSet';

import { useProjectOverviewStore } from '../../../stores';

const Store = createContext();

export function useProjectDynamicChartStore() {
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

  const projectDynamicDs = useMemo(() => new DataSet(ProjectDynamicDataSet({
    projectId, startedRecord, organizationId,
  })), [organizationId, projectId, startedRecord]);

  function loadData() {
    projectDynamicDs.setQueryParameter('startDate', `${moment().format('YYYY-MM-DD')} 00:00:00`);
    projectDynamicDs.query();
  }

  const value = {
    ...props,
    loadData,
    projectDynamicDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
