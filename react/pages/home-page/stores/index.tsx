/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { HomePageStoreContext, ProviderProps } from '../interface';

const Store = createContext({} as HomePageStoreContext);

export function useHomePageStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: ProviderProps) => {
  const {
    children,
    intl: { formatMessage },
    AppState: { currentMenuType: { projectId, organizationId } },
  } = props;

  const prefixCls = 'c7ncd-root' as const;

  const homeStore = useStore();

  const value = {
    ...props,
    formatMessage,
    projectId,
    homeStore,
    prefixCls,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
