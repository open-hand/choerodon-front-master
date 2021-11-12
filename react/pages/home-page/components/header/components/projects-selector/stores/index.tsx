/* eslint-disable max-len */
import React, {
  createContext, useContext, useRef, useEffect,
} from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useMount } from 'ahooks';
import { ProjectsSelectorStoreContext, ProviderProps } from '../interface';
import handleClickProject from '@/utils/gotoProject';

const Store = createContext({} as ProjectsSelectorStoreContext);

export function useProjectsSelectorStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')(observer((props: ProviderProps) => {
  const {
    children,
    AppState: { currentMenuType: { projectId } },
    AppState,
  } = props;

  const prefixCls = 'c7ncd-projects-selector' as const;
  const intlPrefix = 'c7ncd.projects.selector' as const;

  const history = useHistory();
  const selectorRef = useRef<any>();

  const handleSelectProjectCallback = (item:Record<string, any>) => {
    AppState.setDropDownPro(item.name);
    handleClickProject(item, history, AppState);
    selectorRef.current.setPopup(false);
    selectorRef.current.blur();
  };

  const value = {
    ...props,
    projectId,
    prefixCls,
    intlPrefix,
    handleSelectProjectCallback,
    selectorRef,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
