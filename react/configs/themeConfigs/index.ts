import { useLayoutEffect, useCallback } from 'react';
import { initTheme } from '@hzero-front-ui/core';
import { useUpdateEffect } from 'ahooks';
import { theme4Configs } from './config';

/**
 * hook
 * 初始化新UI hook
 */
function useC7NThemeInit() {
  const handleInitTheme = useCallback(() => {
    initTheme(theme4Configs);
  }, []);

  function syncBodyThemeAttribute() {
    document.body.setAttribute('data-theme', localStorage.getItem('theme') ?? '');
  }

  useUpdateEffect(() => {
    syncBodyThemeAttribute();
  });

  useLayoutEffect(() => {
    handleInitTheme();
  }, []);
}

export { useC7NThemeInit };
