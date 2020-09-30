import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import AuditDataSet from './AuditDataSet';
import useStore from './useStore';
import AppServiceDataSet from './AppServiceDataSet';
import QuestionDataSet from './QuestionDataSet';
import DocDataSet from './DocDataSet';

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
  const [selfDoc, setSelfDoc] = useState(false);
  const [activeProject, setActiveProject] = useState();
  const workBenchUseStore = useStore(history);
  const auditDs = useMemo(() => new DataSet(AuditDataSet({ organizationId })), [organizationId]);
  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ organizationId })), [organizationId]);
  const questionDs = useMemo(() => new DataSet(QuestionDataSet({ organizationId })), [organizationId]);
  const docDs = useMemo(() => new DataSet(DocDataSet({ organizationId, projectId: activeProject, self: selfDoc })), [organizationId, activeProject, selfDoc]);
  useEffect(() => {
    docDs.query();
  }, [selfDoc, organizationId, activeProject]);
  useEffect(() => {
    const project = workBenchUseStore.getActiveStarProject;
    if (project && project.id) {
      auditDs.setQueryParameter('project_id', String(project.id));
      appServiceDs.setQueryParameter('project_id', String(project.id));
      questionDs.setQueryParameter('projectId', String(project.id));
      docDs.setQueryParameter('projectId', String(project.id));
      setActiveProject(project.id);
    } else {
      auditDs.setQueryParameter('project_id', null);
      appServiceDs.setQueryParameter('project_id', null);
      questionDs.setQueryParameter('projectId', null);
      docDs.setQueryParameter('projectId', null);
      setActiveProject(undefined);
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
    docDs,
    selfDoc,
    setSelfDoc,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
