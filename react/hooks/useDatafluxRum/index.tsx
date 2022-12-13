import React, { useState, useRef } from 'react';
import { get } from '@choerodon/inject';

const useDatafluxRum = () => {
  const originAppState = useRef({
    type: null,
    currentProject: null,
  });

  const setUser = (useInfo: any) => {
    get('base-pro:datafluxRumSetUser') && get('base-pro:datafluxRumSetUser')(useInfo);
  };

  const setGlobalContext = (AppState: any) => {
    if (AppState?.menuType?.type === 'project' && !AppState?.currentProject) {
      // 如果是项目 需要拿到currentProject
      // @ts-ignore
    } else if (originAppState?.current?.type !== AppState?.menuType?.type || (originAppState?.current?.currentProject?.id !== AppState?.currentProject?.id)) {
      originAppState.current = {
        type: AppState?.menuType?.type,
        currentProject: AppState?.currentProject,
      };
      get('base-pro:datafluxRumSetGlobalContext') && get('base-pro:datafluxRumSetGlobalContext')(AppState);
    }
  };

  return [setUser, setGlobalContext];
};

export default useDatafluxRum;
