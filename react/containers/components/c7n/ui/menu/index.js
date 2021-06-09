import React, { Component } from 'react';
import queryString from 'query-string';
import _ from 'lodash';
import { Icon, Menu, Tooltip } from 'choerodon-ui';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import MenuSideIcon from '@/containers/components/c7n/ui/menu/MenuSideIcon';
import folding from '../../../../images/folding.svg';
import unfold from '../../../../images/unfold.svg';
import bg from '../header/style/icons/bg.svg';
import './RequireSvgResources';
import findFirstLeafMenu from '../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../util';
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

const defaultBlackList = ['/projects', '/applications', '/iam/app-market', '/knowledge/organization', '/workbench', '/market/app-market', '/iam/enterprise'];

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
    const {
      type: currentType, isUser: currentIsUser, id: currentId, selected, collapsed,
    } = MenuStore;
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
          // MenuStore.setOpenKeys([]);
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
                // MenuStore.setOpenKeys(collapsed ? [] : [menu, ...parents].map(({ code }) => code));
                // this.savedOpenKeys = [menu, ...parents].map(({ code }) => code);
              }
              MenuStore.setActiveMenu(menu.type === 'tab' ? parents[parents.length - 1] : menu);
              MenuStore.setActiveMenuParents(parents);
              MenuStore.setSelected(parents[0]);
              MenuStore.setType(type);
              MenuStore.setId(id);
              MenuStore.setIsUser(isUser);
              MenuStore.setRootBaseOnActiveMenu();
              return true;
            }
            return false;
          });
        }
        if (MenuStore.activeMenu && MenuStore.activeMenu.route === this.props.location.pathname && this.props.location.pathname !== '/') {
          // eslint-disable-next-line no-underscore-dangle
          document.getElementsByTagName('title')[0].innerText = `${MenuStore.activeMenu.name || ''} – ${MenuStore.activeMenu.parentName || ''} – ${AppState.menuType.type !== 'site' ? `${AppState.menuType.name} – ` : ''} ${AppState.getSiteInfo.systemTitle || window._env_.HEADER_TITLE_NAME || AppState.getSiteInfo.defaultTitle}`;
        } else {
          // eslint-disable-next-line no-underscore-dangle
          document.getElementsByTagName('title')[0].innerText = AppState.getSiteInfo.systemTitle || window._env_.HEADER_TITLE_NAME || AppState.getSiteInfo.defaultTitle;
        }
      });
    }
  }

  getMenuSingle(data, num, collapsed) {
    const paddingStyleObj = num === 0 && collapsed ? { padding: '0 !important' } : {};
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
            className={classNames({
              'theme4-iconwrap': true,
            })}
          >
            <Icon
              type={data.icon}
            />
          </span>
          <span
            className={classNames({
              'theme4-iconwrap-text': true,
            })}
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
            <span className={classNames({
              'theme4-iconwrap': true,
            })}
            >
              <Icon
                type={data.icon}
              />
            </span>
            {num === 0 && collapsed ? null : <span>{data.name}</span>}
          </span>
          )}
      >
        {data.subMenus.filter((v) => v.type !== 'tab' && v.code !== 'choerodon.code.project.deploy.app-deployment.pipeline').map(
          (two) =>
            this.getMenuSingle(two, parseInt(num, 10) + 1, collapsed)
        )}
      </SubMenu>
    );
  }

  TooltipMenu(reactNode, code) {
    const { AppState } = this.props;
    if (AppState.getDebugger) {
      return (
        <Tooltip defaultVisible="true" trigger="hover" placement="right">
          {reactNode}
        </Tooltip>
      );
    }
    return reactNode;
  }

  getMenuLink(route) {
    const { AppState, history } = this.props;
    const {
      id, name, type, organizationId, category,
    } = AppState.currentMenuType;
    let search = '';
    switch (type) {
      case 'site':
        if (AppState.isTypeUser) {
          search = '?type=site';
        }
        break;
      case 'organization':
      case 'project':
        search = `?type=${type}&id=${id}${name && `&name=${encodeURIComponent(name)}`}&category=${category}`;
        break;
      case 'user':
        search = `?type=${type}`;
        break;
      default:
    }
    return `${route}${search}${search === '' ? `?organizationId=${organizationId}` : `&organizationId=${organizationId}`}`;
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
      // MenuStore.setOpenKeys([]);
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
          // onTitleClick={this.handleClick}
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
    let child;
    const activeMenuRoot = MenuStore.getActiveMenuRoot[AppState.menuType?.type] || {};
    child = MenuStore.getMenuData.filter((item) => item.id === activeMenuRoot.id);
    // if (AppState.getCurrentTheme === 'theme4') {
    //   const activeMenuRoot = MenuStore.getActiveMenuRoot[AppState.menuType?.type] || {};
    //   child = MenuStore.getMenuData.filter((item) => item.id === activeMenuRoot.id);
    // } else {
    //   child = MenuStore.getMenuData;
    // }
    return (
      <div
        className={
          classNames('common-menu-right', {
            collapsed,
            'theme4-common-menu': true,
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
            className={classNames({
              'theme4-iconToggle': true,
            })}
          >
            {
              true ? (
                <img
                  role="none"
                  style={{
                    cursor: 'pointer',
                  }}
                  src={collapsed ? unfold : folding}
                  alt=""
                  onClick={this.toggleRightMenu}
                />
              ) : (
                <Icon
                  type={(function () {
                    // if (AppState.getCurrentTheme === 'theme4') {
                    //   if (collapsed) {
                    //     return 'keyboard_arrow_right';
                    //   }
                    //   return 'keyboard_arrow_left';
                    // }
                    return 'menu';
                  }())}
                  onClick={this.toggleRightMenu}
                />
              )
            }
          </div>
        </div>
        <div className="common-menu-right-content">
          <Menu
            className={classNames({ 'theme4-menu-ul': true })}
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[activeMenu && activeMenu.code]}
            openKeys={openKeys.slice()}
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
    const { MenuStore, AppState } = this.props;
    const str = iconMap[data.code] || 'xiezuo';
    const root = MenuStore.getActiveMenuRoot;
    if (true) {
      return `${str}new.sprite`;
    }
    if (root && data.code === root[AppState.menuType.type]?.code) {
      return `${str}click.sprite`;
    }
    return `${str}.sprite`;
  }

  handleClickItemMenuSide = (item) => {
    const { MenuStore, AppState } = this.props;
    const origin = MenuStore.getActiveMenuRoot;
    origin[AppState.menuType.type] = item;
    MenuStore.setOpenkeysBaseonRoot(item);
    MenuStore.setActiveMenuRoot(JSON.parse(JSON.stringify(origin)));
  }

  renderNewMenuSide = () => {
    const { MenuStore, AppState } = this.props;
    const menuData = MenuStore.getMenuData;
    const activeMenuRoot = MenuStore.getActiveMenuRoot[AppState.menuType?.type] || {};
    return (
      <div
        className="c7ncd-theme4-menuSide"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
        }}
      >
        {
          menuData.map((data) => (
            <div
              className={classNames('c7ncd-theme4-menuSide-item', {
                // 'c7ncd-origin-menuSide': activeMenuRoot.id === data.id && AppState.getCurrentTheme === '',
                // 'c7ncd-origin-menuSide-item': AppState.getCurrentTheme === '',
                'c7ncd-theme4-menuSide-item-hover': true,
              })}
              {
                ...(activeMenuRoot.id === data.id) && true ? {
                  style: {
                    background: 'rgba(140, 158, 255, 0.35)',
                  },
                } : {}
              }
              onClick={() => this.handleClickItemMenuSide(data)}
            >
              {/*{*/}
              {/*  (activeMenuRoot.id === data.id) && AppState.getCurrentTheme === '' && (*/}
              {/*    <div className="c7ncd-origin-selected-line" />*/}
              {/*  )*/}
              {/*}*/}
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
              <p
              >
                {data.name}
              </p>
            </div>
          ))
        }
      </div>
    );
  }

  render() {
    const { MenuStore, location: { pathname }, AppState } = this.props;
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
