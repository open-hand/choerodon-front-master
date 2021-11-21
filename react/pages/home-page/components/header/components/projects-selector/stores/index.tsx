/* eslint-disable max-len */
import React, {
  createContext, useContext, useRef,
} from 'react';
import { inject } from 'mobx-react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
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

  // 收起select的pop content并且失焦
  const handleSelectorBlur = () => {
    selectorRef.current.setPopup(false);
    selectorRef.current.blur();
  };

  /**
   * 点中某个项目的时候去触发这些操作，appstate的操作是需要优化的，todo这块逻辑关联太强了，得优化
   * @param {Record<string, any>} item
   */
  const handleSelectProjectCallback = (item:Record<string, any>) => {
    AppState.setDropDownPro(item.name);
    handleClickProject(item, history, AppState);
    handleSelectorBlur();
  };

  const value = {
    ...props,
    projectId,
    prefixCls,
    intlPrefix,
    handleSelectProjectCallback,
    handleSelectorBlur,
    selectorRef,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
