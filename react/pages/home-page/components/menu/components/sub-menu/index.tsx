// @ts-nocheck
import React, {
  FC, CSSProperties, useMemo, useCallback, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui/pro';
import { OverflowWrap } from '@zknow/components';
import { Menu } from 'choerodon-ui';
import map from 'lodash/map';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import pick from 'lodash/pick';
import classNames from 'classnames';
import { difference } from 'lodash';
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
      collapsed,
    },
    MenuStore,
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
  const currentRootChildrenMenu = useMemo(() => getMenuData.filter((item: { id: string; }) => item.id === activeMenuRoot.id)?.[0]?.subMenus || [], [activeMenuRoot.id, getMenuData]);

  const history = useHistory();

  const location = useLocation();

  const {
    search,
  } = location;

  const renderMenuItem = useCallback(({
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
      // 项目模板edit的url保存
      const params = new URLSearchParams(search);
      const edit = params.get('edit');
      history.push({
        pathname: getCurrentQuerystring()?.pathname,
        search: `${getCurrentQuerystring()?.search}${edit ? `&edit=${edit}` : ''}`,
      });
    };

    const renderMenuLink = () => {
      const linkCls = classNames(`${prefixCls}-menuItem-link`, {
        [`${prefixCls}-menuItem-link-collapsed`]: !isExpanded,
      });
      return (
        // eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events
        <div
          className={linkCls}
          onClick={handleLink}
          style={chilMenuCssProperties}
          role="button"
        >
          {showIcon ? (
            <Icon
              className={`${prefixCls}-menuItem-link-icon`}
              type={icon}
            />
          ) : <span style={{ width: 10 }} />}
          <OverflowWrap
            tooltipsConfig={{
              placement: 'right',
            }}
            className={`${prefixCls}-menuItem-link-name`}
          >
            {menuName}
          </OverflowWrap>
        </div>
      );
    };

    const renderSubMenuTitle = () => (
      <div
        style={chilMenuCssProperties}
        className={`${prefixCls}-menuItem-sub-title`}
      >
        <Icon
          type={icon}
          className={`${prefixCls}-menuItem-sub-title-icon`}
        />
        <OverflowWrap
          tooltipsConfig={{
            placement: 'right',
          }}
          className={`${prefixCls}-menuItem-sub-title-name`}
        >
          {menuName}
        </OverflowWrap>
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

    if (!subMenus?.length) {
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
  }, []);

  const renderContent = useMemo(() => {
    const filterListCodes = ['choerodon.code.project.market.publish'];
    const filterSub = currentRootChildrenMenu.filter((i) => !filterListCodes.includes(i.code));
    const content = (
      map(filterSub, (item:any) => {
        const pickItemProps = pick(item, ['subMenus', 'route', 'icon', 'name', 'code', 'level']);
        const currentItem = { ...pickItemProps, menuLevel: 0, showIcon: true };
        return renderMenuItem({ ...currentItem });
      })
    );
    return content;
  }, [currentRootChildrenMenu, renderMenuItem]);

  const handleOpenChange = (currentOpenKeys:string[]) => {
    let rest;
    if (currentOpenKeys.length < MenuStore.openKeys.length) {
      rest = difference(JSON.parse(JSON.stringify(MenuStore.openKeys)), currentOpenKeys);
      MenuStore.setClosedKeys(rest);
    } else {
      rest = difference(currentOpenKeys, JSON.parse(JSON.stringify(MenuStore.openKeys)));
      MenuStore.setClosedKeys(rest, true);
    }
    MenuStore.setOpenKeys(currentOpenKeys);
  };

  if (!currentRootChildrenMenu?.length) {
    return null;
  }

  // 这里是如果在切换项目时 是重新设置了openkeys 所以再次判断如果还是收起状态 就把openkeys设置为空
  if (!isExpanded && savedOpenKeys?.length > 0) {
    MenuStore.setOpenKeys([]);
  }

  return (
    <div
      className={prefixCls}
      style={{
        width: isExpanded ? 210 : 50,
      }}
    >
      <CollapsedBtn />
      <Menu
        inlineCollapsed={!isExpanded}
        className={`${prefixCls}-menu`}
        subMenuCloseDelay={0.1}
        subMenuOpenDelay={0.1}
        selectedKeys={[activeMenu?.code].filter(String)}
        // 为了解决收起状态的菜单 所有展开二级菜单都弹出的问题
        openKeys={savedOpenKeys}
        // {...isExpanded ? {
        //   openKeys: savedOpenKeys,
        // } : {}}
        mode="inline"
        onOpenChange={handleOpenChange}
        style={{ overflow: 'hidden overlay' }}
      >
        {renderContent}
      </Menu>
    </div>
  );
};

export default observer(SubMenus);
