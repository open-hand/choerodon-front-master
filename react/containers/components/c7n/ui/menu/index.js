import React, { Component } from 'react';
import _ from 'lodash';
import { Icon, Menu, Tooltip } from 'choerodon-ui';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import MenuSideIcon from '@/containers/components/c7n/ui/menu/MenuSideIcon';
import { defaultThemeColor } from '../../../../../constants';
import folding from '@/assets/images/folding.svg';
import unfold from '@/assets/images/unfold.svg';
import bg from '../header/style/icons/bg.svg';
import './RequireSvgResources';
import findFirstLeafMenu from '@/utils/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';
import './index.less';

const { SubMenu, Item, ItemGroup } = Menu;

const iconMap = {
  // 协作
  'choerodon.code.project.cooperation': 'xiezuo',
  // 部署
  'choerodon.code.project.deploy': 'bushu',
  // 开发
  'choerodon.code.project.develop': 'kaifa',
  //  测试
  'choerodon.code.project.test': 'ceshi',
  'choerodon.code.project.demand': 'xuqiu',
  'choerodon.code.site.infra': 'jichu',
  'choerodon.code.project.doc': 'wendang',
  // 设置
  'choerodon.code.project.setting': 'shezhi',
  // 组织层管理
  'choerodon.code.organization.manager': 'guanli',
  //  组织层设置
  'choerodon.code.organization.setting': 'shezhi',
  //  平台层管理
  'choerodon.code.site.manager': 'guanli',
  //  平台层设置
  'choerodon.code.site.setting': 'shezhi',
  //  平台层市场
  'choerodon.code.site.market': 'shichang',
  //  平台层hzero
  'choerodon.code.site.hzero.manager': 'hzero',
  //  用户层 个人
  'choerodon.code.person.setting': 'shezhi',
};

const defaultBlackList = ['/projects', '/applications', '/iam/app-market', '/knowledge/organization', '/workbench', '/market/app-market', '/iam/enterprise', '/agile/work-calendar'];

export { defaultBlackList };

@withRouter
@inject('AppState', 'MenuStore')
@observer
export default class CommonMenu extends Component {
  savedOpenKeys = [];

  componentWillMount() {
    this.loadMenu(this.props);
    if (localStorage.getItem('rawStatistics')) {
      this.props.MenuStore.statistics = JSON.parse(localStorage.getItem('rawStatistics'));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.loadMenu(nextProps);
  }

  loadMenu(props) {
    const { location, AppState, MenuStore } = props;
    const { pathname } = location;
    const { type } = AppState.currentMenuType;
    if (type) {
      MenuStore.loadMenuData().then((menus) => {
        MenuStore.treeReduce({ subMenus: menus }, (menu, parents) => {
          // 当当前的路径和menu里头的route值匹配或者是以这个起步，比如pathname: /devops/test/1, menu.rout: /devops/test/，就能匹配到
          if (pathname.startsWith(menu.route)) {
            const activeMenu = menu.type === 'tab' ? parents[parents.length - 1] : menu;
            if (activeMenu && window.location.href.includes(activeMenu.route)) {
              MenuStore.setActiveMenu(activeMenu);
              MenuStore.setSelected(parents[0]);
              MenuStore.setRootBaseOnActiveMenu();
            }
            return true;
          }
          return false;
        });
        if (MenuStore.activeMenu && MenuStore.activeMenu.route === this.props.location.pathname && this.props.location.pathname !== '/') {
          document.title = `${MenuStore.activeMenu.name || ''} – ${MenuStore.activeMenu.parentName || ''} – ${AppState.menuType.type !== 'site' ? `${AppState.menuType.name} – ` : ''} ${AppState.getSiteInfo.systemTitle || window._env_.HEADER_TITLE_NAME || AppState.getSiteInfo.defaultTitle}`;
        } else {
          document.title = AppState.getSiteInfo.systemTitle
          || window._env_.HEADER_TITLE_NAME
          || AppState.getSiteInfo.defaultTitle;
        }
      });
    }
  }

  // isThird 是否渲染三级菜单
  getMenuSingle(data, num, collapsed, isThird = false) {
    const paddingStyleObj = num === 0 && collapsed ? { padding: '0 !important' } : {};
    if (!data.subMenus && !data.route) {
      return null;
    }
    if (!data.subMenus || data.subMenus.every((v) => v.type === 'tab')) {
      const { route } = findFirstLeafMenu(data);
      const link = (
        <Link
          to={this.getMenuLink(route)}
          onClick={() => {
            // 路由拦截时，url无变化但菜单发生变化了，暂时去除，后续测试
            // this.props.MenuStore.setActiveMenu(data);
            this.props.MenuStore.click(data.code, data.level, data.name);
          }}
          style={{
            marginLeft: collapsed && num === 0 ? 0 : parseInt(num, 10) * 20,
            fontSize: '0.14rem',
          }}
        >
          <span
            className="theme4-iconwrap"
            style={{
              marginRight: isThird ? '-3px' : '16px',
            }}
          >
            {
              !isThird && (
                <Icon
                  type={data.icon}
                />
              )
            }
          </span>
          <span
            className="theme4-iconwrap-text"
          >
            {data.name}
          </span>
        </Link>
      );
      return (
        <Item
          key={data.code}
          style={paddingStyleObj}
        >
          {link}
        </Item>
      );
    }
    return (
      <SubMenu
        key={data.code}
        className="common-menu-right-popup"
        title={(
          <span
            style={{
              marginLeft: parseInt(num, 10) * 20,
              fontSize: '0.14rem',
            }}
          >
            <span className="theme4-iconwrap">
              <Icon
                type={data.icon}
              />
            </span>
            {num === 0 && collapsed ? null : <span>{data.name}</span>}
          </span>
        )}
      >
        {data.subMenus.filter((v) => v.type !== 'tab' && v.code !== 'choerodon.code.project.deploy.app-deployment.pipeline').map(
          (two) => this.getMenuSingle(two, parseInt(num, 10) + 1, collapsed, true),
        )}
      </SubMenu>
    );
  }

  getMenuLink(route) {
    const { AppState } = this.props;
    const {
      id, name, type, organizationId, category,
    } = AppState.currentMenuType;
    const search = new URLSearchParams();
    switch (type) {
      case 'site':
        if (AppState.isTypeUser) {
          search.set('type', 'site');
        }
        break;
      case 'organization':
      case 'project':
        search.set('type', type);
        search.set('id', id);
        name && search.set('name', name);
        category && search.set('category', category);
        break;
      case 'user':
        search.set('type', type);
        break;
      default:
    }
    search.set('organizationId', organizationId);
    return `${route}?${search.toString()}`;
  }

  findSelectedMenuByCode(child, code) {
    let selected = false;
    child.forEach((item) => {
      if (selected) {
        return;
      }
      if (item.code === code) {
        selected = item;
      } else if (item.subMenus) {
        selected = this.findSelectedMenuByCode(item.subMenus, code);
      }
    });
    return selected;
  }

  handleOpenChange = (openKeys) => {
    let rest;
    if (openKeys.length < this.props.MenuStore.openKeys.length) {
      rest = _.difference(JSON.parse(JSON.stringify(this.props.MenuStore.openKeys)), openKeys);
      this.props.MenuStore.setClosedKeys(rest);
    } else {
      rest = _.difference(openKeys, JSON.parse(JSON.stringify(this.props.MenuStore.openKeys)));
      this.props.MenuStore.setClosedKeys(rest, true);
    }
    this.props.MenuStore.setOpenKeys(openKeys);
  };

  handleLeftOpenChange = (leftOpenKeys) => {
    this.props.MenuStore.setLeftOpenKeys(leftOpenKeys);
  };

  collapseMenu = () => {
    const { MenuStore } = this.props;
    MenuStore.setLeftOpenKeys([]);
  };

  toggleRightMenu = () => {
    const { MenuStore } = this.props;
    const { collapsed, openKeys } = MenuStore;
    if (collapsed) {
      MenuStore.setCollapsed(false);
      MenuStore.setOpenKeys(this.savedOpenKeys);
    } else {
      this.savedOpenKeys = openKeys;
      MenuStore.setCollapsed(true);
      MenuStore.setOpenKeys([]);
    }
  };

  renderLeftMenuItem(item, collapsed) {
    let icon = <Icon type={item.icon} />;
    let text;
    if (!collapsed) {
      text = <span>{item.name}</span>;
    } else {
      icon = (
        <Tooltip placement="right" title={item.name}>
          {icon}
        </Tooltip>
      );
    }
    if (!item.subMenus || item.subMenus.every((v) => v.type === 'tab')) {
      return (
        <Item key={item.code}>
          {icon}
          {text}
        </Item>
      );
    }

    return (
      <ItemGroup
        key={item.code}
        className="common-menu-right-popup"
      >
        {
          item.subMenus.filter((v) => v.type !== 'tab').map((two) => this.getMenuSingle(two, 0, collapsed))
        }
      </ItemGroup>
    );
  }

  renderRightMenu() {
    const { MenuStore, AppState } = this.props;
    const { collapsed, openKeys, activeMenu } = MenuStore;
    const activeMenuRoot = MenuStore.getActiveMenuRoot[AppState.menuType?.type] || {};
    const child = MenuStore.getMenuData.filter((item) => item.id === activeMenuRoot.id);
    return (
      <div
        className={
          classNames('common-menu-right', 'theme4-common-menu', {
            collapsed,
          })
        }
        style={{
          width: collapsed ? '50px' : 'calc(250px - 50px)',
        }}
      >
        <div
          className="common-menu-right-header"
          style={{
            position: 'relative',
            height: 0,
          }}
        >
          <div
            className="theme4-iconToggle"
          >
            <img
              role="none"
              style={{
                cursor: 'pointer',
              }}
              src={collapsed ? unfold : folding}
              alt="img"
              onClick={this.toggleRightMenu}
            />
          </div>
        </div>
        <div className="common-menu-right-content">
          <Menu
            className="theme4-menu-ul"
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[activeMenu && activeMenu.code]}
            openKeys={collapsed ? [] : openKeys.slice()}
            onOpenChange={this.handleOpenChange}
            subMenuCloseDelay={0.1}
            subMenuOpenDelay={0.1}
          >
            {child?.map((item) => this.renderLeftMenuItem(item, collapsed))}
          </Menu>
        </div>
      </div>
    );
  }

  shouldHiddenMenu = (pathname) => {
    if (pathname.startsWith('/buzz/cooperate') && !pathname.startsWith('/buzz/cooperate-pro')) return true;
    if (defaultBlackList.some((pname) => pathname.startsWith(pname))) {
      return true;
    }
    // eslint-disable-next-line no-underscore-dangle
    const blackListString = window._env_.hiddenMenuList;
    if (!blackListString) return false;

    const blackListArray = blackListString.split(',');
    return blackListArray.some((pname) => pathname.startsWith(pname));
  }

  renderMenuSideIconName = (data) => {
    const str = iconMap[data.code] || 'xiezuo';
    return `${str}new.sprite`;
  }

  handleClickItemMenuSide = (item) => {
    const { MenuStore, AppState } = this.props;
    const origin = MenuStore.getActiveMenuRoot;
    origin[AppState.menuType.type] = item;
    MenuStore.setOpenkeysBaseonRoot(item);
    MenuStore.setActiveMenuRoot(JSON.parse(JSON.stringify(origin)));
  }

  getBackgroundImage = (color, isDefault) => {
    if (color) {
      if (isDefault) {
        return `url(${bg})`;
      }
      return 'unset';
    }
    return `url(${bg})`;
  }

  getBackgroundColor = (color, isDefault) => {
    if (color) {
      if (isDefault) {
        return 'unset';
      }
      return color;
    }
    return 'unset';
  }

  renderNewMenuSide = () => {
    const { MenuStore, AppState } = this.props;
    const menuData = MenuStore.getMenuData;
    const activeMenuRoot = MenuStore.getActiveMenuRoot[AppState.menuType?.type] || {};
    const { themeColor } = AppState.getSiteInfo;
    const isDefaultThemeColor = themeColor?.toLowerCase() === defaultThemeColor?.toLowerCase();
    return (
      <div
        className="c7ncd-theme4-menuSide"
        style={{
          backgroundImage: this.getBackgroundImage(themeColor, isDefaultThemeColor),
          backgroundSize: 'cover',
          backgroundColor: this.getBackgroundColor(themeColor, isDefaultThemeColor),
        }}
      >
        {
          menuData.map((data) => (
            <div
              className={classNames('c7ncd-theme4-menuSide-item', 'c7ncd-theme4-menuSide-item-hover')}
              {
              ...(activeMenuRoot.id === data.id) ? {
                style: {
                  background: 'rgba(140, 158, 255, 0.35)',
                },
              } : {}
              }
              role="none"
              onClick={() => this.handleClickItemMenuSide(data)}
            >
              <div
                style={{
                  borderRadius: '8px',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MenuSideIcon name={this.renderMenuSideIconName(data)} />
              </div>
              <p>
                {data.name}
              </p>
            </div>
          ))
        }
      </div>
    );
  }

  render() {
    const { MenuStore, location: { pathname } } = this.props;
    const child = MenuStore.getMenuData;
    if (!(child && child.length > 0) || this.shouldHiddenMenu(pathname) || MenuStore.notFoundSign) {
      return null;
    }

    return (
      <div className="common-menu">
        {this.renderNewMenuSide()}
        {this.renderRightMenu()}
      </div>
    );
  }
}
