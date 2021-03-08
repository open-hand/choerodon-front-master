import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { forEach, get } from 'lodash';
import { DataSet } from 'choerodon-ui/pro/lib';
import useStore from './useStore';
import useCpCacheStore from './useCpCacheStore';
import modulesMapping from './modulesMapping';
import ComponentsDataset from './ComponentsDataset';

const Store = createContext();

export function useWorkBenchStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId, projectId }, currentModules },
    history,
  } = props;

  function getAllCode() {
    let allowedModules = [...modulesMapping.common, ...modulesMapping.backlog];
    forEach(currentModules, (item) => {
      if (Object.prototype.hasOwnProperty.call(modulesMapping, item)) {
        allowedModules = allowedModules.concat(modulesMapping[item]);
      }
    });
    return [...new Set(allowedModules)];
  }

  const workBenchUseStore = useStore(history);
  const cacheStore = useCpCacheStore();

  const selectedProjectId = get(workBenchUseStore.getActiveStarProject, 'id');
  const category = get(workBenchUseStore.getActiveStarProject, 'category');

  const componentsDs = useMemo(() => new DataSet(ComponentsDataset({ workBenchUseStore })), [workBenchUseStore]);

  const value = {
    ...props,
    prefixCls: 'c7n-workbench',
    dragPrefixcls: 'c7ncd-dragCard',
    componentsDs,
    cacheStore,
    workBenchUseStore,
    organizationId,
    selectedProjectId,
    category,
    history,
    currentModules,
    allowedModules: getAllCode(),
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
