import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { useWorkBenchStore } from '@/containers/components/c7n/routes/workBench/stores';
import { get } from 'lodash';
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
    cacheStore,
  } = useWorkBenchStore();

  const {
    cacheQuickLinkData,
  } = cacheStore;

  const quickLinkUseStore = useStore(organizationId, AppState);

  const {
    type,
  } = quickLinkUseStore;

  const quickLinkDs = useMemo(() => new DataSet(quickLinkDataSet({
    quickLinkUseStore,
    organizationId,
    linkType: type,
    selectedProjectId,
    cacheStore,
  })), [organizationId, quickLinkUseStore, selectedProjectId, type]);

  useEffect(() => {
    const mainData = cacheQuickLinkData;
    const tempArr = get(mainData, 'content');
    if (type !== get(mainData, 'type') || selectedProjectId !== get(mainData, 'selectedProjectId')) {
      quickLinkDs.query();
      return;
    }
    if (tempArr && get(tempArr, 'length')) {
      quickLinkUseStore.setListHasMore(
        mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
      );
      quickLinkDs.loadData(tempArr);
    }
  }, [cacheQuickLinkData, quickLinkDs]);

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
