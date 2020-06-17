import React, { createContext, useContext } from 'react';
import useStore from './useStore';
import { inject } from 'mobx-react';

const Store = createContext();

export function useStarTargetPro() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props) => {
  const {
    children,
    AppState,
  } = props;

  const value = {
    ...props,
    starTargetProUseStore: useStore(AppState),
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
