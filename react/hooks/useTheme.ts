import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { getLocalConfig, setLocalConfig, ThemeContext } from '@hzero-front-ui/core';

function syncBodyThemeAttribute(theme?: string) {
  if (!(_.isUndefined(theme) || _.isNull(theme))) {
    localStorage.setItem('theme', theme);
  }
  document.body.setAttribute('data-theme', localStorage.getItem('theme') ?? '');
}

export default function useTheme() {
  const { setTheme: changeTheme, config, schema } = useContext(ThemeContext);

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const { schema, config: schemaConfig } = getLocalConfig();
    if (schema) {
      changeTheme(schema, schemaConfig);
    }
    syncBodyThemeAttribute(schema || '');
  }, []);

  const setTheme = (theme: 'default' | 'theme4') => {
    changeTheme(theme === 'default' ? '' : theme, config);
    setLocalConfig(theme === 'default' ? '' : theme, config); // 保存到本地
    syncBodyThemeAttribute(theme === 'default' ? '' : theme);
  };

  return [schema, setTheme];

  // const { setTheme: changeTheme, schema } = useContext(ThemeContext);
  // const { readOriginLocalTheme, setLocalTheme } = useThemeHelper();
  // const setTheme = useCallback((theme: 'default' | 'theme4') => {
  //   localStorage.setItem('theme', theme);
  //   const conf = {
  //     current: {
  //       ...defaultConfig,
  //       schema: theme,
  //     },
  //     prev: {},
  //   };
  //   // @ts-ignore
  //   setLocalTheme(conf);
  //   changeTheme(conf);
  // }, [changeTheme]);
  // return [schema, setTheme];
}
