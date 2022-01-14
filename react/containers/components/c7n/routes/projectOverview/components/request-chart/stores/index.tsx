/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { RequestChartStoreContext, ProviderProps } from '../interface';
// import { useFormatCommon, useFormatMessage } from '@choerodon/master';

const Store = createContext({} as RequestChartStoreContext);

export function useRequestChartStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: ProviderProps) => {
  const {
    children,
  } = props;

  const prefixCls = 'c7ncd-request-chart' as const;
  const intlPrefix = 'c7ncd.request.chart' as const;

  // const formatCommon = useFormatCommon();
  // const formatRequestChart = useFormatMessage(intlPrefix);

  const mainStore = useStore();

  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    // formatRequestChart,
    // formatCommon,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
