import React, { useEffect, useContext } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router';
import { Button } from 'choerodon-ui';
import {
  Menu, Dropdown, Icon, Tooltip, Button as ProButton,
} from 'choerodon-ui/pro';

import { EXTERNAL_LINK, SAAS_FEEDBACK } from '@/utils/constants';
import classNames from 'classnames';
import useTheme from '@/hooks/useTheme';
import { mount } from '@choerodon/inject';
import SaasFeedbackItem from './components/saasFeedback';
// import ThemeContext from '@hzero-front-ui/cfg/lib/utils/ThemeContext';
import Logo from './Logo';
import User from './User';
import Inbox from './Inbox';
import SkinPeeler from './SkinPeeler';
import HeaderSetting from './HeaderSetting';
import OrgSelect from './OrgSelect';

import './style';

const prefixCls = 'c7n-boot-header';

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(observer((props) => {
  // const { setTheme, schema } = useContext(ThemeContext);
  const [schema, setTheme] = useTheme();

  console.log(schema);

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

  const menuItems = () => {
    const [url, text, icon] = EXTERNAL_LINK.split(',');
    const itemsGroup = [];
    const docItem = (
      <Menu.Item>
        <div
          role="none"
          onClick={() => {
            window.open(url);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Icon type="collections_bookmark-o" />
          <span>
            {text}
          </span>
        </div>
      </Menu.Item>
    );
    const saasFeedbackItem = (
      <Menu.Item>
        <SaasFeedbackItem />
      </Menu.Item>
    );
    itemsGroup.push(docItem);
    itemsGroup.push(saasFeedbackItem);
    return (
      <Menu>
        {
        itemsGroup
      }
      </Menu>
    );
  };

  const renderExternalLink = () => {
    const SelfButton = schema === 'theme4' ? ProButton : Button;
    if ((EXTERNAL_LINK && typeof EXTERNAL_LINK === 'string') || (SAAS_FEEDBACK && typeof SAAS_FEEDBACK === 'string')) {
      return (
        <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
          <Dropdown overlay={menuItems()} trigger={['click']} placement="bottomCenter">
            <SelfButton
              funcType="flat"
              className={classNames('theme4-external')}
              icon={icon}
              onClick={() => {
                window.open(url);
              }}
              style={{ margin: `0 ${true ? '20px' : '15px'}` }}
            />
          </Dropdown>
        </li>
      );
    }
    return <span style={{ margin: '0 0 0 20px' }} />;
  };

  const {
    AppState: { getUserInfo: { image_url: imgUrl } }, MenuStore: { getSiteMenuData }, history, location: { pathname },
  } = props;

  const shouldHiddenHead = () => {
    const defaultBlackList = ['/iam/enterprise'];
    if (defaultBlackList.some((pname) => pathname.startsWith(pname))) {
      return true;
    }
    return false;
  };

  if (shouldHiddenHead()) {
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
        <li style={{ display: 'flex' }}>
          <HeaderSetting />
          {mount('base-pro:saasUpgrade')}
        </li>
      </ul>
      <ul className={`${prefixCls}-right`}>
        <OrgSelect />
        <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
          <SkinPeeler />
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
