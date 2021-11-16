import React, {
  useCallback,
  useEffect,
} from 'react';
import { useLocation } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useMenuStore } from './stores';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';
import MainMenu from './components/main-menu';
import SubMenu from './components/sub-menu';
import { treeReduce } from './services';
import { TreeReduceCallbackProps } from './interface';
import { HEADERER_TITLE } from '@/constants';
import useShouldHiddenMenu from './hooks/useShouldHiddenMenu';

const Menu = () => {
  const {
    prefixCls,
    AppState,
    MenuStore,
  } = useMenuStore();

  const location = useLocation();

  // 是否展示menu
  const shouldHiddenMenu = useShouldHiddenMenu();

  const { pathname } = location;

  const {
    menuType,
    getSiteInfo,
  } = AppState;

  const {
    loadMenuData: getMenuDatas,
    activeMenu,
    setActiveMenu,
    setSelected,
    setRootBaseOnActiveMenu,
    getMenuData: currentTypeMenuDatas,
    notFoundSign,
  } = MenuStore;

  const findCurrentRoute = useCallback(({
    treeNode,
    parents,
  }:TreeReduceCallbackProps) => {
    if (pathname.startsWith(treeNode.route)) {
      const currentActiveMenu = treeNode.type === 'tab' ? parents[parents.length - 1] : treeNode;
      if (currentActiveMenu && window.location.href.includes(currentActiveMenu.route)) {
        setActiveMenu(currentActiveMenu);
        setSelected(parents[0]);
        setRootBaseOnActiveMenu();
      }
      return true;
    }
    return false;
  }, [pathname]);

  const loadMenuData = useCallback(async () => {
    try {
      const menus = await getMenuDatas();
      const tree = { subMenus: menus };
      treeReduce({
        tree,
        callback: findCurrentRoute,
      });
      const displayTitle = getSiteInfo.systemTitle || HEADERER_TITLE || getSiteInfo.defaultTitle;
      // todo... 这里逻辑可以拆分为一个hook，监听activeMenu变化而变化，这个逻辑是肯定要拆到全局去的
      if (activeMenu && activeMenu.route === pathname && pathname !== '/') {
        document.title = `${activeMenu.name || ''} – ${activeMenu.parentName || ''} – ${menuType.type !== 'site' ? `${menuType.name} – ` : ''} ${displayTitle}`;
      } else {
        document.title = displayTitle;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [activeMenu, findCurrentRoute, getSiteInfo, menuType, pathname]);

  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

  // shouldHiddenMenu：通过配置的默认路径判断是否展示menu
  // currentTypeMenuDatas: menustore里头获取的当前type的菜单数组
  // 404界面出现的时候，在MenuStore中设置的
  if (shouldHiddenMenu || currentTypeMenuDatas?.length || notFoundSign) {
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
