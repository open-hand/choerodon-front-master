import { useLayoutEffect, useCallback } from 'react';
import { initTheme } from '@hzero-front-ui/core';
import { theme4Configs } from './config';

/**
 * hook
 * 初始化新UI hook
 */
function useC7NThemeInit() {
  const handleInitTheme = useCallback(() => {
    initTheme(theme4Configs);
  }, []);

  useLayoutEffect(() => {
    handleInitTheme();
  }, []);
}

export default useC7NThemeInit;
