import React, {
  createContext, useContext,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

const Store = createContext();

export function useStarTargetPro() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props) => {
  const {
    children,
    AppState: {
      currentMenuType: { organizationId },
      getStarProject,
    },
  } = props;

  const value = {
    ...props,
    prefixCls: 'c7n-starTargetPro',
    getStarProject,
    organizationId,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
