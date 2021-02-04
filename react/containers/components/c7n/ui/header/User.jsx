import React, { Component, Fragment } from 'react';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Popover, Icon } from 'choerodon-ui';
import { historyPushMenu, logout } from '@/utils';
import Avatar from './Avatar';
import findFirstLeafMenu from '../../util/findFirstLeafMenu';

const MenuItem = Menu.Item;
const PREFIX_CLS = 'c7n';
const prefixCls = `${PREFIX_CLS}-boot-header-user`;
const blackList = new Set(['choerodon.code.usercenter.receive-setting']);

@withRouter
@inject('AppState', 'MenuStore', 'HeaderStore')
@observer
export default class UserPreferences extends Component {
  componentDidMount() {
    const { history, MenuStore, HeaderStore } = this.props;
    if (window.location.href.split('#')[1].split('&')[1] === 'token_type=bearer') {
      history.push('/');
    }
    HeaderStore.axiosShowSiteMenu();
    MenuStore.loadMenuData({ type: 'site' }, true);
  }

  preferences = () => {
    const { MenuStore, history, HeaderStore } = this.props;
    MenuStore.loadMenuData({ type: 'site' }, true).then((menus) => {
      if (menus.length) {
        const { route, domain } = findFirstLeafMenu(menus[0]);
        historyPushMenu(history, `${route}?type=site`, domain);
      }
    });
    HeaderStore.setUserPreferenceVisible(false);
  };

  handleVisibleChange = (visible) => {
    this.props.HeaderStore.setUserPreferenceVisible(visible);
  };

  getGlobalMenuData = (organizationId) => {
    const { MenuStore, history } = this.props;
    MenuStore.loadMenuData({ type: 'site' }, false).then((menus) => {
      if (menus.length) {
        const { route, domain } = findFirstLeafMenu(menus[0]);
        const routeWithOrgId = `${route}/?organizationId=${organizationId}`;
        historyPushMenu(history, routeWithOrgId, domain);
      }
    });
  };

  handleMenuItemClick = ({ key }) => {
    const { history } = this.props;
    const { organizationId } = queryString.parse(history.location.search);
    if (key === 'site-setting') {
      this.getGlobalMenuData(organizationId);
    } else {
      history.push(`${key}?type=${key.includes('user-info') ? 'user' : 'site'}&organizationId=${organizationId}`);
    }
    this.handleVisibleChange(false);
  };

  findUserInfoMenuItem = (menu, res) => {
    if (menu.subMenus && menu.subMenus.length) {
      menu.subMenus.forEach(v => this.findUserInfoMenuItem(v, res));
    }
    if (menu.code === 'choerodon.code.person.setting.user-info') {
      res.res = menu;
    }
  }

  getUserInfoMenuItem = () => {
    const res = { res: {} };
    const { MenuStore } = this.props;
    const realData = MenuStore.menuGroup.user;
    realData.forEach(v => this.findUserInfoMenuItem(v, res));
    return res.res;
  }

  render() {
    const { AppState, HeaderStore, MenuStore, history } = this.props;
    const { organizationId } = queryString.parse(history.location.search);
    const { imageUrl, loginName, realName, email } = AppState.getUserInfo || {};
    // const realData = MenuStore.menuGroup && MenuStore.menuGroup.user.slice()[0] && MenuStore.menuGroup.user.slice()[0].subMenus.filter(item => !blackList.has(item.code));
    const realData = [this.getUserInfoMenuItem()];
    const AppBarIconRight = (
      <div className={`${prefixCls}-popover-content`}>
        <Avatar
          src={imageUrl}
          prefixCls={prefixCls}
          onClick={() => {
            history.push(`/iam/user-info?type=site&organizationId=${organizationId}`);
          }}
        >
          {realName && realName.charAt(0)}
        </Avatar>
        <div className={`${prefixCls}-popover-title`}>
          <span>{realName}</span>
          <span>{email}</span>
        </div>
        <div className={`${prefixCls}-popover-menu`}>
          <Menu selectedKeys={[-1]} onClick={this.handleMenuItemClick}>
            {realData && realData.map(item => (
              item.code && (
                <MenuItem className={`${prefixCls}-popover-menu-item`} key={item.route}>
                  <Icon type={item.icon} />
                  {item.name}
                </MenuItem>
              )
            ))}
            {
              HeaderStore.getShowSiteMenu ? [
                <Menu.Divider />,
                <MenuItem className={`${prefixCls}-popover-menu-item`} key="site-setting">
                  <Icon type="settings" />
                  平台管理
                </MenuItem>,
              ] : null
            }
          </Menu>
        </div>
        <div className="divider" />
        <div className={`${prefixCls}-popover-logout`}>
          <li
            onClick={() => logout()}
          >
            <Icon type="exit_to_app" />
            退出登录
          </li>
        </div>
      </div>
    );
    return (
      <Popover
        overlayClassName={`${prefixCls}-popover`}
        content={AppBarIconRight}
        trigger="click"
        visible={HeaderStore.userPreferenceVisible}
        placement="bottomRight"
        onVisibleChange={this.handleVisibleChange}
      >
        <Avatar src={imageUrl} prefixCls={prefixCls}>
          {realName && realName.charAt(0)}
        </Avatar>
      </Popover>
    );
  }
}
