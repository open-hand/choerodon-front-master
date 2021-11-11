/* eslint-disable max-len */
import React, { createContext, useContext } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore from './useStore';
import { UserAvatarStoreContext, ProviderProps } from '../interface';

const Store = createContext({} as UserAvatarStoreContext);

export function useUserAvatarStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState', 'HeaderStore')((props: ProviderProps) => {
  const {
    children,
    intl: { formatMessage },
    AppState: {
      currentMenuType: { projectId, organizationId },
    },
    AppState,
  } = props;

  const prefixCls = 'c7ncd-user-avatar' as const;
  const intlPrefix = 'c7ncd.user.avatar' as const;

  const mainStore = useStore();

  const {
    imageUrl, realName, email,
  } = AppState.getUserInfo || {};

  const value = {
    ...props,
    imageUrl,
    realName,
    email,
    formatMessage,
    organizationId,
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
