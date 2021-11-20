import React, {
  FC, CSSProperties,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui/pro';
import { Menu } from 'choerodon-ui';
import map from 'lodash/map';
import { Link } from 'react-router-dom';
import pick from 'lodash/pick';
import { useMenuStore } from '../../stores';
import CollapsedBtn from './components/collapsed-btn';
import { MenuObjProps } from '../../interface';
import getRoutePath from '@/utils/getRoutePath';

import './index.less';

export type SubMenuProps = {

}

const prefixCls = 'c7ncd-subMenu' as const;

const { SubMenu, Item } = Menu;

type MenuItemProps = {
  menuLevel: number // 当前菜单的层级，目前的用处只是为了处理间距问题，递归的值number类型
  showIcon:boolean // 是否展示当前菜单选项的ICON
} & MenuObjProps

const SubMenus:FC<SubMenuProps> = () => {
  const {
    MenuStore: {
      getActiveMenuRoot,
      getMenuData,
      activeMenu,
      openKeys: savedOpenKeys,
      setOpenKeys,
    },
    AppState: {
      menuType,
    },
    mainStore: {
      isExpanded,
      handleStatisticCount,
    },
  } = useMenuStore();

  // 获取全局以及设置到Store里头的选中的父级菜单
  const activeMenuRoot = getActiveMenuRoot[menuType?.type] || {};

  // 获取到当前父菜单下的所有子菜单项
  const currentRootChildrenMenu = getMenuData.filter((item: { id: string; }) => item.id === activeMenuRoot.id)?.[0]?.subMenus || [];

  const renderMenuItem = ({
    subMenus = [],
    route,
    level,
    menuLevel = 0,
    icon,
    name: menuName,
    code: menuCode,
    showIcon = true,
  }:MenuItemProps) => {
    const chilMenuCssProperties:CSSProperties = {
      marginLeft: `${menuLevel * 20}px`,
    };

    // 根据当前的层级点击对应的路由带上不一样的参数
    const getCurrentQuerystring = () => getRoutePath(route);

    // Link click函数
    const handleLink = () => {
      handleStatisticCount(menuCode, level, menuName);
    };

    const renderMenuLink = () => (
      <Link
        className={`${prefixCls}-menuItem-link`}
        to={getCurrentQuerystring()}
        onClick={handleLink}
        style={chilMenuCssProperties}
      >
        {showIcon ? (
          <Icon
            className={`${prefixCls}-menuItem-link-icon`}
            type={icon}
          />
        ) : <span style={{ width: 10 }} />}
        <span
          className={`${prefixCls}-menuItem-link-name`}
        >
          {menuName}
        </span>
      </Link>
    );

    const renderSubMenuTitle = () => (
      <div
        style={chilMenuCssProperties}
        className={`${prefixCls}-menuItem-sub-title`}
      >
        <Icon
          type={icon}
          className={`${prefixCls}-menuItem-sub-title-icon`}
        />
        <span className={`${prefixCls}-menuItem-sub-title-name`}>
          {menuName}
        </span>
      </div>
    );

    const renderSubMenuChildMenus = () => subMenus.map((subMenuItem) => {
      const currentSubMenuObj = {
        ...pick(subMenuItem, ['subMenus', 'route', 'icon', 'name', 'code', 'level']),
        menuLevel: menuLevel + 1,
        showIcon: false,
      };
      return renderMenuItem({ ...currentSubMenuObj });
    });

    if (!menuName && !menuCode) {
      return null;
    }

    if (!subMenus.length) {
      return (
        <Item
          key={menuCode}
          className={`${prefixCls}-menuItem`}
        >
          {renderMenuLink()}
        </Item>
      );
    }

    return (
      <SubMenu
        className={`${prefixCls}-menuItem-sub`}
        title={renderSubMenuTitle()}
        key={menuCode}
      >
        {renderSubMenuChildMenus()}
      </SubMenu>
    );
  };

  const renderContent = () => {
    const content = (
      map(currentRootChildrenMenu, (item:any) => {
        const pickItemProps = pick(item, ['subMenus', 'route', 'icon', 'name', 'code', 'level']);
        const currentItem = { ...pickItemProps, menuLevel: 0, showIcon: true };
        return renderMenuItem({ ...currentItem });
      })
    );
    return content;
  };

  const handleOpenChange = (currentOpenKeys:string[]) => {
    setOpenKeys(currentOpenKeys);
  };

  if (!currentRootChildrenMenu.length) {
    return null;
  }

  return (
    <div
      className={prefixCls}
      style={{
        width: isExpanded ? 200 : 50,
      }}
    >
      <CollapsedBtn />
      <Menu
        inlineCollapsed={!isExpanded}
        className={`${prefixCls}-menu`}
        subMenuCloseDelay={0.1}
        subMenuOpenDelay={0.1}
        selectedKeys={[activeMenu?.code].filter(String)}
        openKeys={isExpanded ? savedOpenKeys : []}
        mode="inline"
        onOpenChange={handleOpenChange}
      >
        {renderContent()}
      </Menu>
    </div>
  );
};

export default observer(SubMenus);
