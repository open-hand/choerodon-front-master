import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { useWorkBenchStore } from '@/containers/components/c7n/routes/workBench/stores';
import useStore from './useStore';
import quickLinkDataSet from './quickLinkDataSet';

const Store = createContext();

export function useQuickLinkStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState,
    AppState: { currentMenuType: { organizationId } },
  } = props;

  const {
    selectedProjectId,
  } = useWorkBenchStore();

  const quickLinkUseStore = useStore(organizationId, AppState);

  const {
    type,
  } = quickLinkUseStore;

  const quickLinkDs = useMemo(() => new DataSet(quickLinkDataSet({
    quickLinkUseStore,
    organizationId,
    linkType: type,
    selectedProjectId,
  })), [organizationId, quickLinkUseStore, selectedProjectId, type]);

  const value = {
    ...props,
    quickLinkUseStore,
    quickLinkDs,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
