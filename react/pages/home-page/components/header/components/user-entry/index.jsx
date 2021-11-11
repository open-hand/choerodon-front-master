/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Menu, Popover, Icon } from 'choerodon-ui';
import { Modal } from 'choerodon-ui/pro';
import { historyPushMenu, logout } from '@/utils';
import Avatar from './Avatar';
import findFirstLeafMenu from '@/utils/findFirstLeafMenu';
import InvitationModal from './InvitationModal';
import { MODAL_WIDTH } from '@/constants/MODAL';
import './index.less';

const MenuItem = Menu.Item;
const PREFIX_CLS = 'c7n';
const prefixCls = `${PREFIX_CLS}-boot-header-user`;

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

  handleVisibleChange = (visible) => {
    this.props.HeaderStore.setUserPreferenceVisible(visible);
  };

  getGlobalMenuData = (organizationId, name) => {
    const { MenuStore, history } = this.props;
    MenuStore.loadMenuData({ type: 'site' }, false).then((menus) => {
      if (menus.length) {
        const { route, domain } = findFirstLeafMenu(menus[0]);
        const routeWithOrgId = `${route}?organizationId=${organizationId}&name=${name}`;
        historyPushMenu(history, routeWithOrgId, domain);
      }
    });
  };

  handleMenuItemClick = ({ key }) => {
    const { history, AppState } = this.props;
    const { organizationId, name } = queryString.parse(history.location.search);
    if (key === 'site-setting') {
      this.getGlobalMenuData(organizationId, name);
    } else if (key === 'invitation') {
      this.invitation();
    } else {
      AppState.menuType.type = 'user';
      history.push(`${key}?type=user&name=${name}&organizationId=${organizationId}`);
    }
    this.handleVisibleChange(false);
  };

  findUserInfoMenuItem = (menu, res) => {
    if (menu.subMenus && menu.subMenus.length) {
      menu.subMenus.forEach((v) => this.findUserInfoMenuItem(v, res));
    }
    if (menu.code === 'choerodon.code.person.setting.user-info') {
      res.res = menu;
    }
  }

  getUserInfoMenuItem = () => {
    const res = { res: {} };
    const { MenuStore } = this.props;
    const realData = MenuStore.menuGroup.user;
    realData.forEach((v) => this.findUserInfoMenuItem(v, res));
    return res.res;
  }

  invitation = () => {
    const { MIN } = MODAL_WIDTH;
    Modal.open({
      title: '注册邀请',
      maskClosable: true,
      destroyOnClose: true,
      drawer: true,
      style: { width: MIN },
      children: <InvitationModal />,
    });
  };

  render() {
    const {
      AppState, HeaderStore, history,
    } = this.props;
    const { organizationId } = queryString.parse(history.location.search);
    const {
      imageUrl, realName, email,
    } = AppState.getUserInfo || {};
    const realData = [this.getUserInfoMenuItem()];
    debugger
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
            {realData && realData.map((item) => (
              item.code && (
                <MenuItem className={`${prefixCls}-popover-menu-item`} key={item.route}>
                  <Icon type="account_circle-o" />
                  {item.name}
                </MenuItem>
              )
            ))}
            {
              HeaderStore.getShowSiteMenu ? [
                <Menu.Divider />,
                <MenuItem className={`${prefixCls}-popover-menu-item`} key="site-setting">
                  <Icon type="settings-o" />
                  平台管理
                </MenuItem>,
              ] : null
            }
            <Menu.Divider />
            <MenuItem className={`${prefixCls}-popover-menu-item`} key="invitation">
              <Icon type="share" />
              注册邀请
            </MenuItem>
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
