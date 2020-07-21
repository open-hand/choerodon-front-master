import React, { createContext, useContext } from 'react';
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
  const value = {
    ...props,
    docStore: useStore(AppState),
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
