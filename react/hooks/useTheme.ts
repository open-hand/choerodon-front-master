import { useCallback } from 'react';

export default function useTheme() {
  const setTheme = useCallback((theme: 'default' | 'theme4') => {

  }, []);
  return ['', setTheme];
}
