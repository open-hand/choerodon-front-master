import React, {
  createContext, useContext, useMemo, useEffect, useCallback,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { map } from 'lodash';
import SprintCountDataSet from './SprintCountDataSet';
import useStore from './useStore';
import SprintWaterWaveDataSet from './SprintWaterWaveDataSet';
import UserListDataSet from './UserListDataSet';
import AppServiceDataSet from './AppServiceDataSet';
import EnvDataSet from './EnvDataSet';
import AsgardDataSet from './AsgardDataSet';
import CommitDataSet from './CommitDataSet';
import DeployDataSet from './DeployDataSet';
import PipelineDataSet from './PipelineDataSet';
import DelayIssueDataSet from './DelayIssueDataSet';
import mappings from './mappings';
import ComponentsDataset from './ComponentsDataSet';
import StartSprintDataSet from './StartSprintDataSet';

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

  const commitDs = useMemo(() => new DataSet(CommitDataSet({ projectId })), [projectId]);
  const deployDs = useMemo(() => new DataSet(DeployDataSet({ projectId })), [projectId]);
  const pipelineDs = useMemo(() => new DataSet(PipelineDataSet({ projectId })), [projectId]);

  const componentsDs = useMemo(() => new DataSet(ComponentsDataset({ projectId, projectOverviewStore })), [projectId]);

  const loadStartedSprintBlock = useCallback(() => {
    commitDs.query();
    deployDs.query();
    pipelineDs.query();
  }, [commitDs, deployDs, pipelineDs]);

  // 已开启的迭代DS
  const startSprintDs = useMemo(() => new DataSet(StartSprintDataSet({ projectId, loadStartedSprintBlock, projectOverviewStore })), [loadStartedSprintBlock, projectId]);
  const startedRecord = startSprintDs.toData()[0];

  const sprintCountDataSet = useMemo(() => new DataSet(SprintCountDataSet({ projectId, sprint: startedRecord })), [projectId, startedRecord]);
  const sprintWaterWaveDataSet = useMemo(() => new DataSet(SprintWaterWaveDataSet({ projectId, sprint: startedRecord })), [projectId, startedRecord]);
  const userListDs = useMemo(() => new DataSet(UserListDataSet({ projectId, projectOverviewStore })), [projectId]);
  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ projectId })), [projectId]);
  const envDs = useMemo(() => new DataSet(EnvDataSet({ projectId })), [projectId]);
  const asgardDs = useMemo(() => new DataSet(AsgardDataSet({ projectId })), [projectId]);
  const delayIssueDs = useMemo(() => new DataSet(DelayIssueDataSet({ projectId, organizationId })));

  const value = {
    ...props,
    sprintCountDataSet,
    projectOverviewStore,
    startSprintDs,
    prefixCls: 'c7n-project-overview',
    sprintWaterWaveDataSet,
    userListDs,
    appServiceDs,
    envDs,
    asgardDs,
    commitDs,
    deployDs,
    pipelineDs,
    delayIssueDs,
    componentsDs,
    startedRecord,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
