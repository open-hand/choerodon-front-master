import React, {
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

const Menu = () => {
  const {
    prefixCls,
    AppState,
    MenuStore,
  } = useMenuStore();

  const location = useLocation();
  const { pathname } = location;

  const {
    menuType,
    getSiteInfo,
  } = AppState;

  const {
    loadMenuData: getMenuDatas,
    activeMenu,
  } = MenuStore;

  const loadMenuData = async () => {
    try {
      const menus = await getMenuDatas();
      const tree = { subMenus: menus };
      treeReduce({
        tree,
        callback: findCurrentRoute,
      });
      if (activeMenu && activeMenu.route === pathname && pathname !== '/') {
        document.title = `${activeMenu.name || ''} – ${activeMenu.parentName || ''} – ${menuType.type !== 'site' ? `${menuType.name} – ` : ''} ${getSiteInfo.systemTitle || window._env_.HEADER_TITLE_NAME || getSiteInfo.defaultTitle}`;
      } else {
        document.title = getSiteInfo.systemTitle
        || window._env_.HEADER_TITLE_NAME
        || getSiteInfo.defaultTitle;
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  function findCurrentRoute({
    treeNode,
    parents,
  }:TreeReduceCallbackProps) {
    if (treeNode.route === pathname || pathname.indexOf(`${treeNode.route}/`) === 0) {
      const currentActiveMenu = treeNode.type === 'tab' ? parents[parents.length - 1] : treeNode;
      if (currentActiveMenu && window.location.href.includes(currentActiveMenu.route)) {
        MenuStore.setActiveMenu(currentActiveMenu);
        MenuStore.setSelected(parents[0]);
        MenuStore.setRootBaseOnActiveMenu();
      }
      return true;
    }
    return false;
  }

  useEffect(() => {

  }, []);

  return (
    <div className={prefixCls}>
      <MainMenu />
      <SubMenu />
    </div>
  );
};

export default observer(Menu);
