import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import Logo from './Logo';
import User from './User';
import Inbox from './Inbox';
import HeaderSetting from './HeaderSetting';
import './style';
import OrgSelect from './OrgSelect';

const prefixCls = 'c7n-boot-header';

@withRouter
@inject('AppState', 'HeaderStore', 'MenuStore')
@observer
class Header extends Component {
  componentDidMount() {
    const { AppState, HeaderStore, MenuStore } = this.props;
    // MenuStore.loadMenuData({ type: 'site' }, false);
    HeaderStore.axiosGetOrgAndPro(AppState.getUserId);
  }

  componentWillReceiveProps(nextProps) {
    const { getUserId } = this.props.AppState;
    if (!nextProps.location.pathname.includes('unauthorized')) {
      localStorage.setItem('historyPath', nextProps.location.pathname + nextProps.location.search);
    }
  }

  handleGuideClick() {
    const { AppState } = this.props;
    AppState.setGuideExpanded(!AppState.getGuideExpanded);
  }

  render() {
    const { AppState: { getUserInfo: { image_url: imgUrl } }, MenuStore: { getSiteMenuData }, history } = this.props;
    return (
      <div className={`${prefixCls}-wrap`}>
        <div className={`${prefixCls}-left`}>
          <Logo history={history} />
        </div>
        <ul className={`${prefixCls}-center`}>
          <li><HeaderSetting /></li>
        </ul>
        <ul className={`${prefixCls}-right`}>
          <OrgSelect />
          <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
            <Inbox />
          </li>
          <li style={{ marginLeft: 20 }} className={`${prefixCls}-right-li`}>
            <User imgUrl={imgUrl} />
          </li>
        </ul>
      </div>
    );
  }
}

export default Header;
