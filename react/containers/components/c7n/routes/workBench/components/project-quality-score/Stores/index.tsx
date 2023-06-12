import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import TableDs from './tableDataSet';
import { IProps } from '../index';

interface ContextProps extends StoreProviderProps {
  intlPrefix: string,
  prefixCls: string
  tableDs: DataSet
}

interface StoreProviderProps extends IProps {
  children: React.ReactElement
}

const Store = createContext({} as ContextProps);

export function useStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: StoreProviderProps) => {
  const {
    children,
  } = props;

  const tableDs = useMemo(() => new DataSet(TableDs({})), []);

  const value = {
    ...props,
    intlPrefix: 'c7ncd.workbench.projectQualityScore.table',
    prefixCls: 'c7ncd-workbench-projectQualityScore-table',
    tableDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
