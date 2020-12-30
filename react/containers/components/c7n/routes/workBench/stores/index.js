import React, {
  createContext, useContext, useMemo, useEffect, useState,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import useStore from './useStore';
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
  const questionDs = useMemo(() => new DataSet(QuestionDataSet({ organizationId })), [organizationId]);

  useEffect(() => {
    const project = workBenchUseStore.getActiveStarProject;
    if (project && project.id) {
      questionDs.setQueryParameter('projectId', String(project.id));
    } else {
      questionDs.setQueryParameter('projectId', null);
    }
  }, [workBenchUseStore.getActiveStarProject, organizationId]);

  const value = {
    ...props,
    questionDs,
    workBenchUseStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
