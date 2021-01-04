import React, {
  createContext, useContext, useMemo, useEffect, useState,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { get } from 'lodash';
import AuditDataSet from './AuditDataSet';
import { useWorkBenchStore } from '../../../stores';

const Store = createContext();

export function useTodoStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const {
    selectedProjectId,
    cacheStore,
  } = useWorkBenchStore();

  const {
    todoThingsData,
  } = cacheStore;

  const auditDs = useMemo(() => new DataSet(AuditDataSet({ organizationId, selectedProjectId, cacheStore })), [organizationId, selectedProjectId]);

  useEffect(() => {
    if (todoThingsData.length) {
      auditDs.loadData(todoThingsData);
    } else {
      auditDs.query();
    }
  }, [auditDs, todoThingsData]);

  const value = {
    ...props,
    auditDs,
    organizationId,
    history,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
