import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { forEach, get } from 'lodash';
import { has } from '@choerodon/inject';
import { localPageCacheStore } from '@/containers/stores/c7n/LocalPageCacheStore';
import useStore from './useStore';
import modulesMapping from './modulesMapping';
import ComponentsDataset from './ComponentsDataSet';
import StartSprintDataSet from './StartSprintDataSet';

const Store = createContext();

export function useProjectOverviewStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState', 'MenuStore')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId, categories } },
    MenuStore,
  } = props;
  localPageCacheStore.setProjectId(projectId); // 设置页面缓存项目id

  function getAllCode() {
    let allowedModules = [...modulesMapping.GENERAL];
    forEach(categories, (item) => {
      const tempCode = get(item, 'code');
      if (Object.prototype.hasOwnProperty.call(modulesMapping, tempCode)) {
        allowedModules = allowedModules.concat(modulesMapping[tempCode]);
      }
    });
    return [...new Set(allowedModules)];
  }

  const projectOverviewStore = useStore(projectId);
  useEffect(() => {
    projectOverviewStore.loadAgileCustomData();
  }, [projectOverviewStore]);
  const componentsDs = useMemo(() => new DataSet(ComponentsDataset({ projectId, projectOverviewStore })), [projectId, projectOverviewStore]);

  // 已开启的迭代DS
  const startSprintDs = useMemo(() => new DataSet(StartSprintDataSet({ projectId })), [projectId]);
  const startedRecord = startSprintDs.toData()[0];
  const customChartAvailableList = useMemo(() => {
    // return ['agile'];
    if (has('agile:AgileCustomChartLoadData')) {
      return ['agile'];
    }
    return [];
  }, []);
  const value = {
    ...props,
    projectOverviewStore,
    startSprintDs,
    prefixCls: 'c7n-project-overview',
    componentsDs,
    startedRecord,
    MenuStore,
    customChartAvailableList,
    allCode: getAllCode(),
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
