import React, { createContext, useContext, useEffect } from 'react';
import { inject } from 'mobx-react';
import useStore from './useStore';

const Store = createContext();

export function useDoc() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props) => {
  const {
    children,
    AppState,
  } = props;

  const docStore = useStore(AppState);
  useEffect(() => {
    docStore.axiosGetDoc(docStore.self, true);
  }, [AppState.currentMenuType.organizationId]);
  return (
    <Store.Provider value={{ docStore, organizationId: AppState.currentMenuType.organizationId, ...props }}>
      {children}
    </Store.Provider>
  );
});
