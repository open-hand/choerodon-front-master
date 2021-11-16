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

const Menu = () => {
  const {
    prefixCls,
    type,
    MenuStore,
  } = useMenuStore();

  const location = useLocation();
  const { pathname } = location;

  const {
    treeReduce,
    loadMenuData: getMenuDatas,
  } = MenuStore;

  const loadMenuData = async () => {
    try {
      const menus = await getMenuDatas();
      treeReduce({ subMenus: menus }, (menu: { route: string; type: string; }, parents: string | any[]) => {
        if (menu.route === pathname || pathname.indexOf(`${menu.route}/`) === 0) {
          const activeMenu = menu.type === 'tab' ? parents[parents.length - 1] : menu;
          if (activeMenu && window.location.href.includes(activeMenu.route)) {
            MenuStore.setActiveMenu(activeMenu);
            MenuStore.setActiveMenuParents(parents);
            MenuStore.setSelected(parents[0]);
            MenuStore.setRootBaseOnActiveMenu();
          }
          return true;
        }
        return false;
      });
    } catch (error) {
      throw new Error(error);
    }
  };

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
