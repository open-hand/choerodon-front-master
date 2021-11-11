/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import useStore, { StoreProps } from './useStore';
import { InviteEntryStoreContext, ProviderProps } from '../interface';
import FormDS from './FormDataset';

const Store = createContext({} as InviteEntryStoreContext);

export function useInviteEntryStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: ProviderProps) => {
  const {
    children,
    intl: { formatMessage },
    AppState: { currentMenuType: { projectId, organizationId } },
  } = props;

  const prefixCls = 'c7ncd-invite-entry' as const;
  const intlPrefix = 'c7ncd.invite.entry' as const;

  const mainStore = useStore();

  const formDs = useMemo(() => new DataSet(FormDS()), []);

  const value = {
    ...props,
    formatMessage,
    projectId,
    mainStore,
    prefixCls,
    intlPrefix,
    formDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
