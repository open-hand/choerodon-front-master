/* eslint-disable no-shadow */
import React, { createContext, useMemo, useContext } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import useStore from './useStore';

const Store = createContext({});

export function useSagaDetailsStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const {
      AppState: { currentMenuType: { type, id, organizationId } },
      intl,
      children,
      sagaInstanceId,
      instance,
    } = props;

    const apiGetway = type === 'site' ? '/hagd/v1/sagas/' : `/hagd/v1/sagas/${type}s/${id}/`;

    const intlPrefix = 'global.saga';

    const sagaStore = useStore();

    const value = {
      ...props,
      apiGetway,
      intl,
      prefixCls: 'c7n-saga',
      intlPrefix,
      organizationId,
      sagaInstanceId,
      sagaStore,
      instance,
      type,
    };

    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));
