import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';
// import { dashboard } from '@choerodon/boot/lib/containers/common';

const PREFIX_CLS = 'c7n';
const prefixCls = `${PREFIX_CLS}-boot-header-logo`;

@withRouter
@inject('AppState', 'MenuStore')
@observer
export default class Logo extends Component {
  handleMenuClick = () => {
    const { AppState } = this.props;
    AppState.setMenuExpanded(!AppState.getMenuExpanded);
  };

  render() {
    const { AppState, MenuStore, location } = this.props;
    const { pathname, search } = location;
    const { systemLogo, systemName } = AppState.getSiteInfo;
    const menus = MenuStore.getMenuData;
    let homePath = '/';
    if (false) {
      const { type, id, name, organizationId } = AppState.currentMenuType;
      if (type && type !== 'site') {
        homePath = `${homePath}?type=${type}&id=${id}&name=${name}`;
        if (organizationId) {
          homePath += `&organizationId=${organizationId}`;
        }
      }
    }
    return (
      <div className={`${prefixCls}-wrap`}>
        <div className={classnames(`${prefixCls}-icon`, systemLogo ? null : `${prefixCls}-default-icon`)} style={{ backgroundImage: systemLogo ? `url(${systemLogo})` : null }} />
        {
          pathname === '/' && !search
            ? <div className={classnames(`${prefixCls}`, systemName ? null : `${prefixCls}-default-logo`)}>{systemName}</div>
            : <Link to={homePath} className={classnames(`${prefixCls}`, systemName ? null : `${prefixCls}-default-logo`)} style={{ textDecoration: 'none' }}>{systemName}</Link>
        }
      </div>
    );
  }
}
