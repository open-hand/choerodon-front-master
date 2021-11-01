import { useEffect } from 'react';
import { configure } from 'choerodon-ui';
import { UI_CONFIG } from './config';

/**
 *初始化UI默认配置的hook
 *
 */
function useInitUiConfig() {
  useEffect(() => {
    configure(UI_CONFIG as any);
  }, []);
}

export {
  useInitUiConfig,
};
