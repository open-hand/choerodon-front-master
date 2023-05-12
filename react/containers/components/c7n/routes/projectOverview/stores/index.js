import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { forEach, get } from 'lodash';
import { localPageCacheStore } from '@/containers/stores/c7n/LocalPageCacheStore';
import useStore from './useStore';
import modulesMapping from './modulesMapping';
import ComponentsDataset from './ComponentsDataSet';
import StartSprintDataSet from './StartSprintDataSet';
import useExternalFunc from '@/hooks/useExternalFunc';

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

  const { func: loadAgileCustomChart } = useExternalFunc('agile', 'agile:AgileCustomChartLoadData');

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
  // 返回 "N_DEVOPS", "N_TEST", "N_AGILE", "N_REQUIREMENT"--> 'devops' 'test' 'agile' 'backlog'
  const availableServiceList = useMemo(() => {
    const maps = {
      N_DEVOPS: 'devops', N_TEST: 'test', N_AGILE: 'agile', N_REQUIREMENT: 'backlog', N_PROGRAM: 'agilePro', N_WATERFALL: 'waterfallPro',
    };
    return categories?.map((i) => maps[i.code] || i.code) || [];
  }, [categories]);
  const componentsDs = useMemo(() => new DataSet(categories?.length ? ComponentsDataset({ projectId, availableServiceList, projectOverviewStore }) : {}), [categories?.length, projectId, projectOverviewStore]);

  // 已开启的迭代DS
  const startSprintDs = useMemo(() => new DataSet(StartSprintDataSet({ projectId })), [projectId]);
  const startedRecord = startSprintDs.toData()[0];

  const customChartAvailableList = useMemo(() => {
    // return ['agile'];
    if (loadAgileCustomChart?.default) {
      return ['agile'];
    }
    return [];
  }, [loadAgileCustomChart]);

  useEffect(() => {
    projectId && projectOverviewStore.loadAgileCustomData(projectId);
  }, [projectOverviewStore, projectId]);
  const value = {
    ...props,
    projectOverviewStore,
    startSprintDs,
    prefixCls: 'c7n-project-overview',
    componentsDs,
    startedRecord,
    MenuStore,
    customChartAvailableList,
    availableServiceList,
    allCode: getAllCode(),
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
