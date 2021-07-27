import React, {
  createContext, useContext, useMemo, useEffect, useState,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { get } from 'lodash';
import CreateViewDataSet from './CreateViewDataSet';
// import { useWorkBenchStore } from '../../../stores';

const Store = createContext();

export default Store;

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState,
    AppState: { currentMenuType: { organizationId } },
  } = props;


  const createViewDS = useMemo(() => new DataSet(CreateViewDataSet()), [organizationId]);

  const value = {
    ...props,
    // viewDs,
    createViewDS,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
