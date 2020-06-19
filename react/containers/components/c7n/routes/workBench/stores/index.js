import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import AuditDataSet from './AuditDataSet';
import useStore from './useStore';
import AppServiceDataSet from './AppServiceDataSet';

const Store = createContext();

export function useWorkBenchStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const workBenchUseStore = useStore(history);
  const auditDs = useMemo(() => new DataSet(AuditDataSet({ organizationId })), [organizationId]);
  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ organizationId })), [organizationId]);

  useEffect(() => {
    const project = workBenchUseStore.getActiveStarProject;
    if (project && project.id) {
      auditDs.setQueryParameter('projectId', project.id);
      appServiceDs.setQueryParameter('projectId', project.id);
    } else {
      auditDs.setQueryParameter('projectId', null);
      appServiceDs.setQueryParameter('projectId', null);
    }
    auditDs.query();
    appServiceDs.query();
  }, [workBenchUseStore.getActiveStarProject]);

  const value = {
    ...props,
    auditDs,
    appServiceDs,
    workBenchUseStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
