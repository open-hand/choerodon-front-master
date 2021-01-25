import React, {
  createContext, useContext, useMemo, useEffect, useCallback,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { forEach, get } from 'lodash';
import SprintCountDataSet from './SprintCountDataSet';
import useStore from './useStore';
import SprintWaterWaveDataSet from './SprintWaterWaveDataSet';
import UserListDataSet from './UserListDataSet';
import AppServiceDataSet from './AppServiceDataSet';
import EnvDataSet from './EnvDataSet';
import CommitDataSet from './CommitDataSet';
import DeployDataSet from './DeployDataSet';
import PipelineDataSet from './PipelineDataSet';
import mappings from './mappings';
import ComponentsDataset from './ComponentsDataSet';
import StartSprintDataSet from './StartSprintDataSet';
import ChartDataSet from './ChartDataSet';
import ChartDatesDataSet from './ChartDatesDataSet';
import defectTreatmentDataSet from './DefectTreatmentDataSet';
import DefectCountDataSet from './DefectCountDataSet';

const Store = createContext();

export function useProjectOverviewStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState', 'MenuStore')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId } },
    MenuStore,
  } = props;

  const projectOverviewStore = useStore(projectId);

  const commitDs = useMemo(() => new DataSet(CommitDataSet({ projectId })), [projectId]);
  const deployDs = useMemo(() => new DataSet(DeployDataSet({ projectId })), [projectId]);
  const pipelineDs = useMemo(() => new DataSet(PipelineDataSet({ projectId })), [projectId]);

  const componentsDs = useMemo(() => new DataSet(ComponentsDataset({ projectId, projectOverviewStore })), [projectId, projectOverviewStore]);
  // 已开启的迭代DS
  const startSprintDs = useMemo(() => new DataSet(StartSprintDataSet({ projectId })), [projectId]);
  const startedRecord = startSprintDs.toData()[0];

  const sprintCountDataSet = useMemo(() => new DataSet(SprintCountDataSet({ projectId, sprint: startedRecord })), [projectId, startedRecord]);
  // 冲刺未完成
  const sprintWaterWaveDataSet = useMemo(() => new DataSet(SprintWaterWaveDataSet({ projectId, sprint: startedRecord })), [projectId, startedRecord]);
  // 在线成员
  const userListDs = useMemo(() => new DataSet(UserListDataSet({ projectId })), [projectId]);
  const appServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ projectId })), [projectId]);
  const envDs = useMemo(() => new DataSet(EnvDataSet({ projectId })), [projectId]);

  // 缺陷提出和解决ds
  const defectTreatDs = useMemo(() => new DataSet(defectTreatmentDataSet({ startedRecord, projectId })), [projectId, startedRecord]);
  // 缺陷累积趋势ds
  const defectCountDs = useMemo(() => new DataSet(DefectCountDataSet({ projectId, startedRecord })), [projectId, startedRecord]);
  const charDatesDs = useMemo(() => new DataSet(ChartDatesDataSet({ organizationId, projectId, startedRecord })), [organizationId, projectId, startedRecord]);
  const chartDs = useMemo(() => new DataSet(ChartDataSet({ projectId, startedRecord, charDatesDs })), [charDatesDs, projectId, startedRecord]);

  const loadBurnDownData = useCallback(async () => {
    try {
      const res = await charDatesDs.query();
      if (res && res.failed) {
        return;
      }
      chartDs.setQueryParameter('datesData', res);
      await chartDs.query();
    } catch (error) {
      throw new Error(error);
    }
  }, [charDatesDs, chartDs]);

  const cpOptsObj = useMemo(() => ({
    sprintNotDone: () => {
      if (startedRecord) {
        sprintWaterWaveDataSet.query();
      }
    },
    sprintCount: () => {
      if (startedRecord) {
        sprintCountDataSet.query();
      }
    },
    burnDownChart: () => {
      if (startedRecord) {
        loadBurnDownData();
      }
    },
    defectTreatment: () => {
      if (startedRecord) {
        defectTreatDs.query();
      }
    },
    defectChart: () => {
      if (startedRecord) {
        defectCountDs.query();
      }
    },
    appService: () => {
      appServiceDs.query();
    },
    env: () => {
      envDs.query();
    },
    pipelineChart: () => {
      if (startedRecord) {
        pipelineDs.query();
      }
    },
    commitChart: () => {
      if (startedRecord) {
        commitDs.query();
      }
    },
    deployChart: () => {
      if (startedRecord) {
        deployDs.query();
      }
    },
    onlineMember: () => {
      userListDs.query();
    },
  }), [appServiceDs, commitDs, defectCountDs, defectTreatDs, deployDs, envDs, loadBurnDownData, pipelineDs, sprintCountDataSet, sprintWaterWaveDataSet, startedRecord, userListDs]);

  useEffect(() => {
    const existCps = projectOverviewStore.queryComponents.slice();
    if (get(existCps, 'length')) {
      forEach(existCps, (item) => {
        const isFunc = typeof cpOptsObj[item] === 'function';
        if (isFunc) {
          cpOptsObj[item]();
        }
      });
    }
  }, [cpOptsObj, projectOverviewStore.queryComponents]);

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
    commitDs,
    deployDs,
    pipelineDs,
    componentsDs,
    startedRecord,
    chartDs,
    charDatesDs,
    defectTreatDs,
    defectCountDs,
    cpOptsObj,
    MenuStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
