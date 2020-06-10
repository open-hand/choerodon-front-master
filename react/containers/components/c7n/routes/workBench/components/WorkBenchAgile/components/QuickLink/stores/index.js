import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { DataSet } from "choerodon-ui/pro";
import addLinkDataSet from './addLinkDataSet';

const Store = createContext();

export function useQuickLinkStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props) => {
  const {
    children
  } = props;

  const AddLinkDataSet = useMemo(() => new DataSet(addLinkDataSet()), []);

  const value = {
    ...props,
    AddLinkDataSet,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});
