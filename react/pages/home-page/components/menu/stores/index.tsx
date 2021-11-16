/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { SideMenuStoreContext, ProviderProps } from '../interface';

const Store = createContext({} as SideMenuStoreContext);

export function useMenuStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState', 'MenuStore')((props: ProviderProps) => {
  const {
    children,
    intl: { formatMessage },
    MenuStore,
    AppState,
  } = props;

  const prefixCls = 'c7ncd-side-menu' as const;
  const intlPrefix = 'c7ncd.side.menu' as const;

  const mainStore = useStore();

  const value = {
    ...props,
    formatMessage,
    mainStore,
    prefixCls,
    AppState,
    MenuStore,
    intlPrefix,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
