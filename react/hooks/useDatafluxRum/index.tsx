import React, { useRef, useCallback } from 'react';
import { get } from '@choerodon/inject';
import useExternalFunc from '@/hooks/useExternalFunc';

const useDatafluxRum = () => {
  const originAppState = useRef({
    type: null,
    currentProject: null,
  });

  const setUser = (useInfo: any) => {
    // get('base-pro:datafluxRumSetUser') && get('base-pro:datafluxRumSetUser')(useInfo);
  };
  const { func: datafluxRumSetUser } = useExternalFunc('basePro', 'base-pro:datafluxRumSetUser');
  const { func: datafluxRumSetGlobalContext } = useExternalFunc('basePro', 'base-pro:datafluxRumSetGlobalContext');

  const setGlobalContext = useCallback(
    (AppState: any) => {
      if (AppState?.menuType?.type === 'project' && !AppState?.currentProject) {
        // 如果是项目 需要拿到currentProject
        // @ts-ignore
      } else if (originAppState?.current?.type !== AppState?.menuType?.type || (originAppState?.current?.currentProject?.id !== AppState?.currentProject?.id)) {
        originAppState.current = {
          type: AppState?.menuType?.type,
          currentProject: AppState?.currentProject,
        };
        if (datafluxRumSetGlobalContext) {
          (datafluxRumSetGlobalContext as any).default(AppState);
        }
      }
    },
    [datafluxRumSetGlobalContext],
  );

  return [setUser, setGlobalContext];
};

export default useDatafluxRum;
