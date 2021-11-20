import React, {
  useCallback,
  useEffect,
} from 'react';
import { useLocation } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useMenuStore } from './stores';
import MainMenu from './components/main-menu';
import SubMenu from './components/sub-menu';
import { treeReduce } from './services';
import { TreeReduceCallbackProps } from './interface';
import { HEADERER_TITLE } from '@/constants';
import useShouldHiddenMenu from './hooks/useShouldHiddenMenu';
import useIsFullPage from '../../hooks/useIsFullPage';

const Menu = () => {
  const {
    prefixCls,
    AppState,
    MenuStore,
  } = useMenuStore();

  const location = useLocation();

  // 是否展示menu
  const shouldHiddenMenu = useShouldHiddenMenu();
  const isFullPage = useIsFullPage();

  const { pathname } = location;

  const {
    menuType,
    getSiteInfo,
  } = AppState;

  const {
    activeMenu,
  } = MenuStore;

  const findCurrentRoute = useCallback(({
    treeNode,
  }:TreeReduceCallbackProps) => {
    if (treeNode.route === pathname) {
      const currentActiveMenu = treeNode;
      if (currentActiveMenu && window.location.href.includes(currentActiveMenu.route)) {
        MenuStore.setActiveMenu(currentActiveMenu);
        MenuStore.setRootBaseOnActiveMenu();
      }
      return true;
    }
    return false;
  }, [pathname]);

  const loadMenuData = useCallback(async () => {
    try {
      const menus = await MenuStore.loadMenuData();
      const tree = { subMenus: menus };
      treeReduce({
        tree,
        callback: findCurrentRoute,
      });
      const displayTitle = getSiteInfo.systemTitle || HEADERER_TITLE || getSiteInfo.defaultTitle;
      // todo... 这里逻辑可以拆分为一个hook，监听activeMenu变化而变化，这个逻辑是肯定要拆到全局去的
      if (activeMenu && activeMenu.route === pathname && pathname !== '/') {
        document.title = `${MenuStore.activeMenu.name || ''} – ${MenuStore.activeMenu.parentName || ''} – ${menuType.type !== 'site' ? `${menuType.name} – ` : ''} ${displayTitle}`;
      } else {
        document.title = displayTitle;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [activeMenu, findCurrentRoute, getSiteInfo.defaultTitle, getSiteInfo.systemTitle, menuType.name, menuType.type, pathname]);

  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

  // shouldHiddenMenu：通过配置的默认路径判断是否展示menu
  // currentTypeMenuDatas: menustore里头获取的当前type的菜单数组
  // 404界面出现的时候，在MenuStore中设置的
  if (isFullPage || shouldHiddenMenu || !MenuStore.getMenuData?.length || MenuStore.notFoundSign) {
    return null;
  }

  return (
    <div className={prefixCls}>
      <MainMenu />
      <SubMenu />
    </div>
  );
};

export default observer(Menu);
