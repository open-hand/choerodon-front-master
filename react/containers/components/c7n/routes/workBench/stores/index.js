import React, { createContext, useContext } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

const Store = createContext();

export function useWorkBenchStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(inject('AppState')((props) => {
  const {
    children,
  } = props;

  const value = {
    ...props,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
