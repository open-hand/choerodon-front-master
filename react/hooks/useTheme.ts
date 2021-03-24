import { useCallback, useContext } from 'react';
import ThemeContext from '@hzero-front-ui/cfg/lib/utils/ThemeContext';
import useThemeHelper from '@hzero-front-ui/cfg/lib/components/Container/useThemeHelper';
import { defaultConfig } from '@hzero-front-ui/cfg/lib/utils/config';

export default function useTheme() {
  const { setTheme: changeTheme, schema } = useContext(ThemeContext);
  const { readOriginLocalTheme, setLocalTheme } = useThemeHelper();
  const setTheme = useCallback((theme: 'default' | 'theme4') => {
    localStorage.setItem('theme', theme);
    const conf = {
      current: {
        ...defaultConfig,
        schema: theme,
      },
      prev: {},
    };
    // @ts-ignore
    setLocalTheme(conf);
    changeTheme(conf);
  }, [changeTheme]);
  return [schema, setTheme];
}
