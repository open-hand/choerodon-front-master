import _ from 'lodash';
import { useContext, useEffect } from 'react';
import { setLocalConfig, ThemeContext } from '@hzero-front-ui/core';

function syncBodyThemeAttribute(theme?: string) {
  if (!(_.isUndefined(theme) || _.isNull(theme))) {
    localStorage.setItem('theme', theme);
  }
  document.body.setAttribute('data-theme', localStorage.getItem('theme') ?? '');
}

export default function useTheme() {
  const { setTheme: changeTheme, config, schema } = useContext(ThemeContext);

  useEffect(() => {
    if (schema) {
      setTheme(schema);
    }
  }, []);

  const setTheme = (theme: any) => {
    changeTheme(theme === '' ? 'THEME_EMPTY' : theme, config);
    setLocalConfig(theme === '' ? 'THEME_EMPTY' : theme, config); // 保存到本地
    syncBodyThemeAttribute(theme === '' ? '' : theme);
  };

  return [schema, setTheme];
}
