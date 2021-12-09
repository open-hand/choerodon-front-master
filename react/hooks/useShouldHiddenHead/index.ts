import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { HIDDEN_HEAD_PATHS_COLLECTION } from '@/constants';

/**
 * 是否需要展示头部的hook，这里根据全局配置的constants来确定
 * @return {*}
 */
function useShouldHiddenHead() {
  const { pathname } = useLocation();

  const shouldHiddenHead = useMemo(() => HIDDEN_HEAD_PATHS_COLLECTION.some((pname) => pathname.indexOf(pname) !== -1), [pathname]);

  return shouldHiddenHead;
}

export default useShouldHiddenHead;
