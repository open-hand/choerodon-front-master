import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { HIDDEN_HEAD_PATHS } from '@/constants';

function useShouldHiddenHead() {
  const { pathname } = useLocation();

  const shouldHiddenHead = useMemo(() => {
    if (HIDDEN_HEAD_PATHS.some((pname) => pathname.startsWith(pname))) {
      return true;
    }
    return false;
  }, [pathname]);

  return shouldHiddenHead;
}

export default useShouldHiddenHead;
