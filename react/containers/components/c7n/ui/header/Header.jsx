import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { Tooltip, Icon, Button } from 'choerodon-ui';
import { EXTERNAL_LINK } from '@/utils/constants';
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
      sessionStorage.setItem('historyPath', nextProps.location.pathname + nextProps.location.search);
    }
  }

  handleGuideClick() {
    const { AppState } = this.props;
    AppState.setGuideExpanded(!AppState.getGuideExpanded);
  }

  renderExternalLink = () => {
    if (EXTERNAL_LINK && typeof EXTERNAL_LINK === 'string') {
      const [url, text, icon] = EXTERNAL_LINK.split(',');
      return (
        <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
          <Tooltip title={text}>
            <Button
              icon={icon}
              shape="circle"
              onClick={() => {
                window.open(url);
              }}
              style={{ margin: '0 15px' }}
            />
          </Tooltip>
        </li>
      );
    }
    return null;
  };

  shouldHiddenHead = (pathname) => {
    const defaultBlackList = ['/iam/enterprise'];
    if (defaultBlackList.some((pname) => pathname.startsWith(pname))) {
      return true;
    }
    return false;
  };

  render() {
    const {
      AppState: { getUserInfo: { image_url: imgUrl } },
      MenuStore: { getSiteMenuData },
      history,
      location: { pathname },
    } = this.props;
    if (this.shouldHiddenHead(pathname)) {
      return null;
    }
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
          {this.renderExternalLink()}
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
