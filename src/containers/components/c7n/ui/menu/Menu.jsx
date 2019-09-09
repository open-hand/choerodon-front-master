import React, { Component } from 'react';
import queryString from 'query-string';
import { Icon, Menu, Tooltip } from 'choerodon-ui';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import findFirstLeafMenu from '../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../util';
import './style';

const { SubMenu, Item, ItemGroup } = Menu;

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
    const { type: currentType, isUser: currentIsUser, id: currentId, selected, collapsed } = MenuStore;
    const { pathname } = location;
    const { type, id } = AppState.currentMenuType;
    if (type) {
      MenuStore.loadMenuData().then((menus) => {
        const isUser = AppState.isTypeUser;
        if (pathname === '/') {
          MenuStore.setActiveMenu(null);
          MenuStore.setSelected(selected ? menus.find(({ code }) => code === selected.code) || menus[0] : menus[0]);
          MenuStore.setType(type);
          MenuStore.setId(id);
          MenuStore.setIsUser(isUser);
          MenuStore.setOpenKeys([]);
        } else {
          MenuStore.treeReduce({ subMenus: menus }, (menu, parents) => {
            if (menu.route === pathname || pathname.indexOf(`${menu.route}/`) === 0) {
              const nCode = parents.length && parents[parents.length - 1].code;
              const oCode = selected && selected.code;
              if (
                oCode !== nCode
                || currentType !== type
                || isUser !== currentIsUser
                || currentId !== id
              ) {
                MenuStore.setOpenKeys(collapsed ? [] : [menu, ...parents].map(({ code }) => code));
                this.savedOpenKeys = [menu, ...parents].map(({ code }) => code);
              }
              MenuStore.setActiveMenu(menu);
              MenuStore.setActiveMenuParents(parents);
              MenuStore.setSelected(parents[0]);
              MenuStore.setType(type);
              MenuStore.setId(id);
              MenuStore.setIsUser(isUser);
              return true;
            }
            return false;
          });
        }
        if (MenuStore.activeMenu && this.props.location.pathname !== '/') {
          document.getElementsByTagName('title')[0].innerText = `${MenuStore.activeMenu.name} – ${MenuStore.activeMenu.parentName} – ${AppState.menuType.type !== 'site' ? `${AppState.menuType.name} – ` : ''} ${AppState.getSiteInfo.systemTitle || AppState.getSiteInfo.defaultTitle}`;
        }
      });
    }
  }

  getMenuSingle(data, num, collapsed) {
    const paddingStyleObj = num === 0 && collapsed ? { padding: '0 !important' } : {};
    if (!data.subMenus || data.subMenus.every(v => v.type === 'tab')) {
      const { route } = findFirstLeafMenu(data);
      const link = (
        <Link
          to={this.getMenuLink(route)}
          onClick={() => this.props.MenuStore.click(data.code, data.resourceLevel, data.name)}
          style={{
            marginLeft: collapsed && num === 0 ? 0 : parseInt(num, 10) * 20,
          }}
        >
          <Icon type={data.icon} />
          <span>{data.name}</span>
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
    } else {
      return (
        <SubMenu
          key={data.code}
          className="common-menu-right-popup"
          title={(
            <span
              style={{
                marginLeft: parseInt(num, 10) * 20,
              }}
            >
              <Icon type={data.icon} />
              {num === 0 && collapsed ? null : <span>{data.name}</span>}
            </span>
          )}
        >
          {data.subMenus.filter(v => v.type !== 'tab').map(
            two => this.getMenuSingle(two, parseInt(num, 10) + 1, collapsed),
          )}
        </SubMenu>
      );
    }
  }

  TooltipMenu(reactNode, code) {
    const { AppState } = this.props;
    if (AppState.getDebugger) {
      return (
        <Tooltip defaultVisible="true" trigger="hover" placement="right">
          {reactNode}
        </Tooltip>
      );
    } else {
      return reactNode;
    }
  }

  getMenuLink(route) {
    const { AppState, history } = this.props;
    const { orgId } = queryString.parse(history.location.search);
    const { id, name, type, organizationId, category } = AppState.currentMenuType;
    let search = '';
    switch (type) {
      case 'site':
        if (AppState.isTypeUser) {
          search = '?type=site';
        }
        break;
      case 'organization':
      case 'project':
        search = `?type=${type}&id=${id}&name=${encodeURIComponent(name)}&category=${category}`;
        if (organizationId) {
          search += `&organizationId=${organizationId}`;
        }
        break;
      default:
    }
    return `${route}${search}${search === '' ? `?orgId=${orgId}` : `&orgId=${orgId}`}`;
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

  handleClick = (e) => {
    const { MenuStore, AppState } = this.props;
    const child = MenuStore.getMenuData;
    const selected = this.findSelectedMenuByCode(child, e.key);
    const paths = e.keyPath && e.keyPath.reverse()[0]; // 去掉boot的
    const selectedRoot = paths ? child.find(({ code }) => code === paths) : selected;
    MenuStore.click(e.key, AppState.menuType.type, e.domEvent.currentTarget.innerText);
    if (selected) {
      const { history } = this.props;
      MenuStore.treeReduce(selectedRoot, (menu, parents, index) => {
        if (index === 0 && !menu.subMenus) {
          MenuStore.setActiveMenu(selected);
          MenuStore.setSelected(selectedRoot);
          MenuStore.setOpenKeys([selected, ...parents].map(({ code }) => code));
          return true;
        }
        return false;
      });
      const { route, domian } = findFirstLeafMenu(selected);
      const link = this.getMenuLink(route);
      historyPushMenu(history, link, domian);
    }
    this.collapseMenu();
  };

  handleOpenChange = (openKeys) => {
    this.props.MenuStore.setOpenKeys(openKeys);
  };

  handleLeftOpenChange = (leftOpenKeys) => {
    this.props.MenuStore.setLeftOpenKeys(leftOpenKeys);
  };

  collapseMenu = () => {
    const { AppState, MenuStore } = this.props;
    MenuStore.setLeftOpenKeys([]);
    AppState.setMenuExpanded(false);
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
    if (!item.subMenus || item.subMenus.every(v => v.type === 'tab')) {
      return (
        <Item key={item.code}>
          {icon}
          {text}
        </Item>
      );
    } else {
      return (
        <ItemGroup
          // onTitleClick={this.handleClick}
          key={item.code}
          className="common-menu-right-popup"
          title={item.name}
        >
          {
            item.subMenus.filter(v => v.type !== 'tab').map(two => this.getMenuSingle(two, 0, collapsed))
          }
        </ItemGroup>
      );
    }
  }

  renderRightMenu() {
    const { MenuStore } = this.props;
    const { collapsed, openKeys, activeMenu } = MenuStore;
    const child = MenuStore.getMenuData;
    return (
      <div className={classNames('common-menu-right', { collapsed })}>
        <div className="common-menu-right-header">
          <Icon type="menu" onClick={this.toggleRightMenu} />
        </div>
        <div className="common-menu-right-content">
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[activeMenu && activeMenu.code]}
            openKeys={openKeys.slice()}
            onOpenChange={this.handleOpenChange}
            subMenuCloseDelay={0.1}
            subMenuOpenDelay={0.1}
          >
            {child.map(item => this.renderLeftMenuItem(item, collapsed))}
          </Menu>
        </div>
      </div>
    );
  }

  shouldHiddenMenu = (pathname) => {
    const defaultBlackList = ['/projects', '/applications', '/base/app-market', '/knowledge/organization'];
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

  render() {
    const { MenuStore, location: { pathname } } = this.props;
    const child = MenuStore.getMenuData;
    if (!(child && child.length > 0) || this.shouldHiddenMenu(pathname)) {
      return null;
    }
    
    return (
      <div className="common-menu">
        {this.renderRightMenu()}
      </div>
    );
  }
}
