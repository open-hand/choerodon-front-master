import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import SprintCountDataSet from './SprintCountDataSet';
import useStore from './useStore';
import SprintWaterWaveDataSet from './SprintWaterWaveDataSet';
import UserListDataSet from './UserListDataSet';
import AppServiceDataSet from './AppServiceDataSet';
import EnvDataSet from './EnvDataSet';
import AsgardDataSet from './AsgardDataSet';
import CommitDataSet from './CommitDataSet';
import DeployDataSet from './DeployDataSet';

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
  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ projectId })), [projectId]);
  const envDs = useMemo(() => new DataSet(EnvDataSet({ projectId })), [projectId]);
  const asgardDs = useMemo(() => new DataSet(AsgardDataSet({ projectId })), [projectId]);
  const commitDs = useMemo(() => new DataSet(CommitDataSet({ projectId })), [projectId]);
  const deployDs = useMemo(() => new DataSet(DeployDataSet({ projectId })), [projectId]);

  useEffect(() => {
    function loadData() {
      commitDs.query();
      deployDs.query();
    }

    projectOverviewStore.loadAllSprint().then(
      sprints => {
        projectOverviewStore.setSprints(sprints);
        const staredSprint = sprints.find(sprint => sprint.statusCode === 'started');
        projectOverviewStore.setStaredSprint(staredSprint);
        projectOverviewStore.setIsFinishLoad(true);
        if (staredSprint) {
          loadData();
        }
      },
    );
  }, []);

  const value = {
    ...props,
    sprintCountDataSet,
    projectOverviewStore,
    sprintWaterWaveDataSet,
    userListDs,
    appServiceDs,
    envDs,
    asgardDs,
    commitDs,
    deployDs,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
