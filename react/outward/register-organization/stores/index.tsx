import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import RegisterFormDs from './registerFormDs';
import MobileFormDs from './mobileFormDs';
import CompeleteInfoDs from './compeleteInfoDs';
import useMainStore from './useStore';

  interface ContextProps {
      intlPrefix: string,
      prefixCls: string
      registerFormDs: DataSet
      compeleteInfoDs: DataSet
      mobileFormDs:DataSet
      mainStore: any
  }

  interface StoreProviderProps {
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

  const mainStore = useMainStore();
  const registerFormDs = useMemo(() => new DataSet(RegisterFormDs({ })), []);
  const compeleteInfoDs = useMemo(() => new DataSet(CompeleteInfoDs({ })), []);
  const mobileFormDs = useMemo(() => new DataSet(MobileFormDs({})), []);
  const value = {
    ...props,
    intlPrefix: '',
    prefixCls: 'register-organization',
    registerFormDs,
    compeleteInfoDs,
    mobileFormDs,
    mainStore,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
