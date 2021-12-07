/* eslint-disable max-len */
import React, { createContext, useContext } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import useStore from './useStore';
import { UserAvatarStoreContext, ProviderProps } from '../interface';
import { useFormatCommon, useFormatMessage } from '@/hooks';

const Store = createContext({} as UserAvatarStoreContext);

export function useUserAvatarStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState', 'HeaderStore')(observer((props: ProviderProps) => {
  const {
    children,
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

  const formatCommon = useFormatCommon();
  const formatUserAvater = useFormatMessage(intlPrefix);

  const value = {
    ...props,
    formatUserAvater,
    formatCommon,
    imageUrl,
    realName,
    email,
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
