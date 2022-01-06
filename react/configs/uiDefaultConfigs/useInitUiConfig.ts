import { useEffect } from 'react';
import { configure } from 'choerodon-ui';
import { useUiConfigs } from './config';

/**
 *初始化UI默认配置的hook
 */
function useInitUiConfig() {
  const UI_CONFIG = useUiConfigs();

  useEffect(() => {
    configure(UI_CONFIG as any);
  }, [UI_CONFIG]);
}

export default useInitUiConfig;
