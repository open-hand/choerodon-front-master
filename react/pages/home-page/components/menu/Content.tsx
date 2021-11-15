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

  const loadMenuData = async () => {
    try {
      const menus = await MenuStore.loadMenuData();
    } catch (error) {

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
