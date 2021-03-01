import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import SelfCodeDataSet from './SelfCodeDataSet';
import { useWorkBenchStore } from '../../../stores';
import useStore from './useStore';

const Store = createContext();

export function useSelfCodeStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const {
    selectedProjectId,
    category,
  } = useWorkBenchStore();

  const mainStore = useStore();
  const prefixCls = 'c7ncd-selfCode';

  const selfCodeDs = useMemo(() => new DataSet(
    SelfCodeDataSet({ selectedProjectId, organizationId, mainStore }),
  ), [mainStore, organizationId, selectedProjectId]);

  const value = {
    ...props,
    selfCodeDs,
    prefixCls,
    organizationId,
    history,
    selectedProjectId,
    category,
    mainStore,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
