import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro/lib';
import { observer } from 'mobx-react-lite';
import starProjectDataset from './starProjectDataset';

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

  const starProjectsDs = useMemo(() => new DataSet(starProjectDataset({ organizationId })), [organizationId]);

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
