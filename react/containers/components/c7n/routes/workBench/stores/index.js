import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { forEach } from 'lodash';
import useStore from './useStore';
import mappings from './mappings';

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

  const {
    addNewComponents,
  } = workBenchUseStore;

  useEffect(() => {
    forEach(mappings, (item) => {
      addNewComponents(item);
    });
  }, []);

  const value = {
    ...props,
    prefixCls: 'c7n-workbench',
    dragPrefixcls: 'c7ncd-dragCard',

    workBenchUseStore,
    organizationId,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));
