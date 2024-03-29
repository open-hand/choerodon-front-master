/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
// @ts-ignore
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import useStore from './useStore';
import { RequestChartStoreContext, ProviderProps } from '../interface';
import RequestChartDataSet from './requestChartDataSet';
import AppServiceDataSet from './appServiceDataSet';
import AppServiceOptionsDataSet from './appServiceOptionsDataSet';

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
  const mainStore = useStore();
  const AppServiceOptionDs = useMemo(() => new DataSet(AppServiceOptionsDataSet() as DataSetProps), []);
  const requestListDs = useMemo(() => new DataSet(RequestChartDataSet({ mainStore }) as DataSetProps), []);
  const AppServiceDs = useMemo(() => new DataSet(AppServiceDataSet({ AppServiceOptionDs }) as DataSetProps), []);

  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    requestListDs,
    AppServiceDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
