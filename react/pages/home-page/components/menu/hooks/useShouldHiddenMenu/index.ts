import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { HIDDEN_MENU_PATHS_COLLECTION } from '@/constants';

/**
 * 是否需要展示菜单的hook，这里根据全局配置的constants来确定
 * @return {*}
 */
function useShouldHiddenMenu() {
  const { pathname } = useLocation();

  const shouldHiddenMenu = useMemo(() => HIDDEN_MENU_PATHS_COLLECTION.some((pname) => pathname.startsWith(pname)), [pathname]);

  return shouldHiddenMenu;
}

export default useShouldHiddenMenu;
