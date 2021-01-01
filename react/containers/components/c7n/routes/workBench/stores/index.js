import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { map } from 'lodash';
import { DataSet } from 'choerodon-ui/pro/lib';
import useStore from './useStore';
import mappings from './mappings';
import ComponentsDataset from './ComponentsDataset';

const Store = createContext();

export function useWorkBenchStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { organizationId } },
    history,
  } = props;

  const workBenchUseStore = useStore(history);

  const componentsDs = useMemo(() => new DataSet(ComponentsDataset({ workBenchUseStore })), [workBenchUseStore]);

  const {
    addNewComponents,
  } = workBenchUseStore;

  useEffect(() => {
    const localComponents = localStorage.getItem('tempComponents');
    let tempComponents;
    if (localComponents) {
      tempComponents = JSON.parse(localComponents);
    } else {
      tempComponents = map(mappings, (item) => item);
    }
    componentsDs.loadData(tempComponents);
  }, []);

  const value = {
    ...props,
    prefixCls: 'c7n-workbench',
    dragPrefixcls: 'c7ncd-dragCard',
    componentsDs,
    workBenchUseStore,
    organizationId,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
