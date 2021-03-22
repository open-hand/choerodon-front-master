import { useCallback, useContext } from 'react';
import ThemeContext from '@hzero-front-ui/cfg/lib/utils/ThemeContext';
import { defaultConfig } from '@hzero-front-ui/cfg/lib/utils/config';

export default function useTheme() {
  const { setTheme: changeTheme, schema } = useContext(ThemeContext);
  const setTheme = useCallback((theme: 'default' | 'theme4') => {
    localStorage.setItem('theme', theme);
    changeTheme({
      current: {
        ...defaultConfig,
        schema: theme,
      },
      prev: {},
    });
  }, [changeTheme]);
  return [schema, setTheme];
}
