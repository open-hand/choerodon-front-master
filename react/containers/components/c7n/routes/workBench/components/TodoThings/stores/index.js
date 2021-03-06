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
    const mainData = todoThingsData;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'selectedProjectId');
    if (selectedProjectId !== currentId) {
      auditDs.query();
      return;
    }
    if (tempArr) {
      auditDs.loadData(tempArr);
    } else {
      auditDs.query();
    }
  }, [auditDs]);

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
