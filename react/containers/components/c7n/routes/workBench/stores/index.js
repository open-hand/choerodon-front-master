import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import AuditDataSet from './AuditDataSet';
import AppServiceDataSet from './AppServiceDataSet';

const Store = createContext();

export function useWorkBenchStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
  } = props;

  const auditDs = useMemo(() => new DataSet(AuditDataSet({ organizationId })), [organizationId]);
  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ organizationId })), [organizationId]);

  const value = {
    ...props,
    auditDs,
    appServiceDs,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
