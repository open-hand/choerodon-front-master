import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro/lib';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash';
import starProjectDataset from './starProjectDataset';
import { useWorkBenchStore } from '../../../stores';

const Store = createContext();

export function useStarTargetPro() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: {
      currentMenuType: { organizationId },
    },
  } = props;

  const {
    cacheStore,
  } = useWorkBenchStore();

  const {
    starProjects,
  } = cacheStore;

  const starProjectsDs = useMemo(() => new DataSet(starProjectDataset({ organizationId, cacheStore })), [organizationId]);

  useEffect(() => {
    const mainData = starProjects;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'organizationId');
    if (organizationId !== currentId) {
      starProjectsDs.query();
      return;
    }
    if (tempArr) {
      starProjectsDs.loadData(tempArr);
    } else {
      starProjectsDs.query();
    }
  }, [starProjects, starProjectsDs]);

  const value = {
    ...props,
    prefixCls: 'c7n-starTargetPro',
    starProjectsDs,
    organizationId,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
