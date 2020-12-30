import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { useWorkBenchStore } from '@/containers/components/c7n/routes/workBench/stores';
import addLinkDataSet from './addLinkDataSet';
import useStore from './useStore';

const Store = createContext();

export function useQuickLinkStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState,
  } = props;

  const value = {
    ...props,
    quickLinkUseStore: useStore(AppState),
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
