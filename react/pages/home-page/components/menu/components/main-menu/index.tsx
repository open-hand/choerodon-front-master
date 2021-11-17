import React, {
  useEffect, FC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import { useMenuStore } from '../../stores';

export type MainMenuProps = {

}

const prefixCls = 'c7ncd-main-menu';
const intlPrefix = 'c7ncd.main.menu';

const MainMenu:FC<MainMenuProps> = () => {
  const {
    type,
    MenuStore,
    AppState,
  } = useMenuStore();

  // 获取当前层级的menu数据
  const menuData = MenuStore.getMenuData;

  // 这里是获取全局以及设置到Store里头的选中的父级菜单
  const activeMenuRoot = MenuStore.getActiveMenuRoot[AppState.menuType?.type] || {};

  useEffect(() => {

  }, []);

  return (
    <div className={prefixCls}>
      MainMenu
    </div>
  );
};

export default observer(MainMenu);
