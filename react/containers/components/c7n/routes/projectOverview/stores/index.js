import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import SprintCountDataSet from './SprintCountDataSet';
import useStore from './useStore';
import SprintWaterWaveDataSet from './SprintWaterWaveDataSet';
import UserListDataSet from "./UserListDataSet";

const Store = createContext();

export function useProjectOverviewStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId } },
    history,
  } = props;
  
  const projectOverviewStore = useStore(projectId);
  const sprintCountDataSet = useMemo(() => new DataSet(SprintCountDataSet({ projectId, sprint: projectOverviewStore.getStaredSprint })), [projectId, projectOverviewStore.getStaredSprint]);
  const sprintWaterWaveDataSet = useMemo(() => new DataSet(SprintWaterWaveDataSet({ projectId, sprint: projectOverviewStore.getStaredSprint })), [projectId, projectOverviewStore.getStaredSprint]);
  const userListDs = useMemo(() => new DataSet(UserListDataSet({ projectId })), [projectId]);

  useEffect(() => {
    projectOverviewStore.loadAllSprint().then(
      sprints => {
        projectOverviewStore.setSprints(sprints);
        const staredSprint = sprints.find(sprint => sprint.statusCode === 'started');
        projectOverviewStore.setStaredSprint(staredSprint);
      },
    );
  }, []);

  useEffect(() => {
    if (projectOverviewStore.getStaredSprint) {
      sprintCountDataSet.query();
      sprintWaterWaveDataSet.query();
    }
  }, [projectOverviewStore.getStaredSprint]);

  const value = {
    ...props,
    sprintCountDataSet,
    projectOverviewStore,
    sprintWaterWaveDataSet,
    userListDs,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
