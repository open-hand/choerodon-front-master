import React, { createContext, useContext } from 'react';
import { inject } from 'mobx-react';
import useStore from './useStore';

const Store = createContext();

export function useStarTargetPro() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props) => {
  const {
    children,
    AppState,
    AppState: {
      currentMenuType: { organizationId },
    },
  } = props;

  const value = {
    ...props,
    starTargetProUseStore: useStore(AppState),
    prefixCls: 'c7n-starTargetPro',
    organizationId,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
