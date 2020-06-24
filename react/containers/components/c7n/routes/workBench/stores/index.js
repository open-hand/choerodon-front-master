import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import AuditDataSet from './AuditDataSet';
import useStore from './useStore';
import AppServiceDataSet from './AppServiceDataSet';
import QuestionDataSet from './QuestionDataSet';

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
  const questionDs = useMemo(() => new DataSet(QuestionDataSet({ organizationId })), [organizationId]);

  useEffect(() => {
    const project = workBenchUseStore.getActiveStarProject;
    if (project && project.id) {
      auditDs.setQueryParameter('project_id', project.id);
      appServiceDs.setQueryParameter('project_id', project.id);
      questionDs.setQueryParameter('projectId', project.id);
    } else {
      auditDs.setQueryParameter('project_id', null);
      appServiceDs.setQueryParameter('project_id', null);
      questionDs.setQueryParameter('projectId', null);
    }
    auditDs.query();
    appServiceDs.query();
  }, [workBenchUseStore.getActiveStarProject, organizationId]);

  const value = {
    ...props,
    auditDs,
    appServiceDs,
    questionDs,
    workBenchUseStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
