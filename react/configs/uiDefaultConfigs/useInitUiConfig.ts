import { useEffect } from 'react';
import { configure } from 'choerodon-ui';
import { useUiConfigs } from './config';

/**
 *初始化UI默认配置的hook
 */
function useInitUiConfig() {
  const UI_CONFIG = useUiConfigs();
  console.log(UI_CONFIG);

  useEffect(() => {
    configure(UI_CONFIG as any);
  }, [UI_CONFIG]);
}

export default useInitUiConfig;
