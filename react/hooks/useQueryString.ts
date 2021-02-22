import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function useQueryString() {
  const location = useLocation();
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  // @ts-ignore
  const params = useMemo(() => Object.fromEntries(urlParams), [urlParams]);
  return params;
}
