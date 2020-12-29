import React, {
  createContext, useContext, useMemo, useEffect, useState,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import useStore from './useStore';
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
  const questionDs = useMemo(() => new DataSet(QuestionDataSet({ organizationId })), [organizationId]);
  const docDs = useMemo(() => new DataSet(DocDataSet({ organizationId, projectId: activeProject, self: selfDoc })), [organizationId, activeProject, selfDoc]);

  useEffect(() => {
    docDs.query();
  }, [selfDoc, organizationId, activeProject]);

  useEffect(() => {
    const project = workBenchUseStore.getActiveStarProject;
    if (project && project.id) {
      questionDs.setQueryParameter('projectId', String(project.id));
      docDs.setQueryParameter('projectId', String(project.id));
      setActiveProject(project.id);
    } else {
      questionDs.setQueryParameter('projectId', null);
      docDs.setQueryParameter('projectId', null);
      setActiveProject(undefined);
    }
  }, [workBenchUseStore.getActiveStarProject, organizationId]);

  const value = {
    ...props,
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
