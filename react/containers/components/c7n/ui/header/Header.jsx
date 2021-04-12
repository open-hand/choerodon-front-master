import React, { useEffect, useContext } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router';
import { Tooltip, Icon, Button } from 'choerodon-ui';
import { EXTERNAL_LINK } from '@/utils/constants';
import classNames from 'classnames';
import Logo from './Logo';
import User from './User';
import Inbox from './Inbox';
// import SkinPeeler from './SkinPeeler';
import HeaderSetting from './HeaderSetting';
import './style';
import OrgSelect from './OrgSelect';

const prefixCls = 'c7n-boot-header';

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(observer((props) => {
  const schema = '';

  useEffect(() => {
    const { AppState, HeaderStore, MenuStore } = props;
    // MenuStore.loadMenuData({ type: 'site' }, false);
    HeaderStore.axiosGetOrgAndPro(AppState.getUserId);
  }, []);
  //
  useEffect(() => {
    const { getUserId } = props.AppState;
    if (!props.location.pathname.includes('unauthorized')) {
      sessionStorage.setItem('historyPath', props.location.pathname + props.location.search);
    }
  }, [props.location.pathname, props.location.search]);

  function handleGuideClick() {
    const { AppState } = props;
    AppState.setGuideExpanded(!AppState.getGuideExpanded);
  }

  const renderExternalLink = () => {
    if (EXTERNAL_LINK && typeof EXTERNAL_LINK === 'string') {
      const [url, text, icon] = EXTERNAL_LINK.split(',');
      return (
        <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
          <Tooltip title={text}>
            <Button
              className={classNames({
                'theme4-external': props.AppState.getCurrentTheme === 'theme4',
              })}
              icon={icon}
              {
                ...props.AppState.getCurrentTheme === '' ? {
                  shape: 'circle',
                } : {}
              }
              onClick={() => {
                window.open(url);
              }}
              style={{ margin: `0 ${props.AppState.getCurrentTheme === 'theme4' ? '20px' : '15px'}` }}
            />
          </Tooltip>
        </li>
      );
    }
    return <span style={{ margin: '0 0 0 20px' }} />;
  };

  const {
    AppState: { getUserInfo: { image_url: imgUrl } }, MenuStore: { getSiteMenuData }, history, location: { pathname },
  } = props;

  const shouldHiddenHead = (pathname) => {
    const defaultBlackList = ['/iam/enterprise'];
    if (defaultBlackList.some((pname) => pathname.startsWith(pname))) {
      return true;
    }
    return false;
  };

  if (shouldHiddenHead(pathname)) {
    return null;
  }
  return (
    <div
      className={classNames({
        [`${prefixCls}-wrap`]: true,
        [`${prefixCls}-wrap-theme4`]: schema === 'theme4',
      })}
    >
      <div className={`${prefixCls}-left`}>
        <Logo history={history} />
      </div>
      <ul className={`${prefixCls}-center`}>
        <li style={{ display: 'flex' }}><HeaderSetting /></li>
      </ul>
      <ul className={`${prefixCls}-right`}>
        <OrgSelect />
        <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
          <SkinPeeler />
          {/* <Button */}
          {/*  icon="toys" */}
          {/*  onClick={() => { */}
          {/*    const { AppState } = this.props; */}
          {/*    const theme = AppState.getTheme; */}
          {/*    let newTheme; */}
          {/*    if (theme === 'theme4') { */}
          {/*      newTheme = ''; */}
          {/*    } else { */}
          {/*      newTheme = 'theme4'; */}
          {/*    } */}
          {/*    AppState.setTheme(newTheme); */}
          {/*  }} */}
          {/* /> */}
        </li>
        {renderExternalLink()}
        <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
          <Inbox />
        </li>
        <li style={{ marginLeft: 20 }} className={`${prefixCls}-right-li`}>
          <User imgUrl={imgUrl} />
        </li>
      </ul>
    </div>
  );
})));
