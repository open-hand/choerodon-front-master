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
    if (schema) {
      setTheme(schema);
    }
    // eslint-disable-next-line no-shadow
    // const { schema: localSchema, config: schemaConfig } = getLocalConfig();
    // if (localSchema) {
    //   changeTheme(localSchema, schemaConfig);
    // }
    // if (schema) {
    //   setLocalConfig(schema, config); // 保存到本地
    // }
  }, []);

  const setTheme = (theme: any) => {
    changeTheme(theme === '' ? 'THEME_EMPTY' : theme, config);
    setLocalConfig(theme === '' ? 'THEME_EMPTY' : theme, config); // 保存到本地
    syncBodyThemeAttribute(theme === '' ? '' : theme);
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
