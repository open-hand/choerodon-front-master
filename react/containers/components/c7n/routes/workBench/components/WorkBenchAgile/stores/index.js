import React, { createContext, useContext } from 'react';
import { inject } from 'mobx-react';

const Store = createContext();

export function useWorkBenchAgile() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props) => {
  const {
    children
  } = props;

  const value = {
    ...props,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
