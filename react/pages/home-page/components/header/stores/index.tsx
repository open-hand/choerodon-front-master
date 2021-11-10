/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { HeaderStoreContext, ProviderProps } from '../interface';

const Store = createContext({} as HeaderStoreContext);

export function useHeaderStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: ProviderProps) => {
  const {
    children,
    intl: { formatMessage },
    AppState: { currentMenuType: { projectId, organizationId } },
  } = props;

  const prefixCls = 'c7ncd-header' as const;
  const intlPrefix = 'c7ncd.header' as const;

  const mainStore = useStore();

  const value = {
    ...props,
    formatMessage,
    projectId,
    mainStore,
    prefixCls,
    intlPrefix,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
