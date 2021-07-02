import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import MyHandlerDataSet from './MyHandlerDataSet';
import { useWorkBenchStore } from '../../../stores';
import useStore from './useStore';

const Store = createContext();

export function useMyHandler() {
  return useContext(Store);
}

export const StoreProvider = withRouter(injectIntl(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const {
    selectedProjectId,
    cacheStore,
  } = useWorkBenchStore();

  const {
    myHandlerIssues,
  } = cacheStore;

  const myHandlerStore = useStore();

  const prefixCls = 'c7n-workbench-myHandler';

  const myHandlerDs = useMemo(() => new DataSet(MyHandlerDataSet({
    organizationId, myHandlerStore, cacheStore, selectedProjectId,
  })), [cacheStore, myHandlerStore, organizationId, selectedProjectId]);

  useEffect(() => {
    const mainData = myHandlerIssues;
    const tempArr = get(mainData, 'content');
    const currentId = get(mainData, 'selectedProjectId');
    const searchDataId = get(mainData, 'searchDataId');
    const searchData = get(mainData, 'searchData');

    if (selectedProjectId !== currentId) {
      myHandlerStore.setPage(0);
      myHandlerStore.setTotalCount(0);
      searchDataId || myHandlerDs.query();
      return;
    }
    if (tempArr) {
      searchDataId && myHandlerDs.setQueryParameter('searchDataId', searchDataId);
      searchDataId && myHandlerDs.setQueryParameter('searchData', searchData);

      myHandlerDs.loadData(tempArr);
      myHandlerStore.setHasMore(
        mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
      );
      myHandlerStore.setTotalCount(mainData.totalElements);
    } else {
      myHandlerDs.query();
    }
  }, [myHandlerDs, myHandlerStore, myHandlerIssues, selectedProjectId]);

  const value = {
    ...props,
    organizationId,
    myHandlerDs,
    myHandlerStore,
    history,
    prefixCls,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}))));
