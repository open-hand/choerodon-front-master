import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';

interface ContextProps {
  intlPrefix: string,
  prefixCls: string
  intl: { formatMessage(arg0: object, arg1?: object): string },
  organizationId: string,
}

const Store = createContext({} as ContextProps);

export function useSaaSFeedbackUploadStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    intl: { formatMessage },
    AppState: { currentMenuType: { id, organizationId } },
  } = props;

  const value = {
    ...props,
    prefixCls: 'c7ncd-saas-feedbackUpload',
    organizationId,
    // emergencyDs,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
