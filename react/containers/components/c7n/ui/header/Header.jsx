import React, {
  useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router';
import {
  Menu, Dropdown, Icon, Button as ProButton,
} from 'choerodon-ui/pro';

import classNames from 'classnames';
import { mount, has as hasInject } from '@choerodon/inject';
import { EXTERNAL_LINK, SAAS_FEEDBACK } from '@/utils/constants';

import './style';
import OrgSelect from './OrgSelect';
import HeaderSetting from './HeaderSetting';
import Inbox from './Inbox';
import User from './User';
import Logo from './Logo';
import ProjectSelector from './components/ProjectSelector';

const prefixCls = 'c7n-boot-header';

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(observer((props) => {
  const {
    AppState: { getUserInfo: { image_url: imgUrl } }, history, location: { pathname },
  } = props;

  useEffect(() => {
    const { AppState } = props;
    AppState.setCurrentDropDown(AppState.getStarProject, AppState.getRecentUse);
  }, [props.location]);

  useEffect(() => {
    const { AppState, HeaderStore } = props;
    HeaderStore.axiosGetOrgAndPro(AppState.getUserId);
    AppState.getProjects();
  }, []);

  useEffect(() => {
    if (!props.location.pathname.includes('unauthorized')) {
      sessionStorage.setItem('historyPath', props.location.pathname + props.location.search);
    }
  }, [props.location.pathname, props.location.search]);

  const menuItems = () => {
    const { AppState } = props;
    const [url, text, icon] = EXTERNAL_LINK?.split(',') || [];
    const itemsGroup = [];
    const docItem = (
      <Menu.Item>
        <div
          role="none"
          onClick={() => {
            window.open(AppState.getDocUrl.status ? 'https://open.hand-china.com/document-center/doc/product/10177/10419?doc_code=118818&doc_id=124273' : AppState.getDocUrl);
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
    if (EXTERNAL_LINK) {
      itemsGroup.push(docItem);
    }
    const saasFeedbackItem = (
      <Menu.Item>
        {mount('base-pro:saasFeebackBtn')}
      </Menu.Item>
    );
    itemsGroup.push(saasFeedbackItem);
    // }
    return (
      <Menu>
        {
          itemsGroup
        }
      </Menu>
    );
  };

  // 问号提示
  const renderExternalLink = () => {
    if ((EXTERNAL_LINK && typeof EXTERNAL_LINK === 'string') || (SAAS_FEEDBACK)) {
      const isPro = !!mount('base-pro:saasFeebackBtn');
      return (
        isPro ? (
          <li style={{ width: 'auto' }} className={`${prefixCls}-right-li`}>
            <Dropdown
              overlay={menuItems()}
              trigger={['click']}
              placement="bottomCenter"
            >
              <ProButton
                funcType="flat"
                className="theme4-external"
                icon="help_outline"
                shape="circle"
                style={{ margin: '0 20px' }}
              />
            </Dropdown>
          </li>
        ) : <span style={{ margin: '0 0 0 20px' }} />
      );
    }
    return <span style={{ margin: '0 0 0 20px' }} />;
  };

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
        [`${prefixCls}-wrap-theme4`]: true,
      })}
    >
      {/* done */}
      <div className={`${prefixCls}-left`}>
        <Logo history={history} />
      </div>
      {/* not yet */}
      <ProjectSelector />
      {/* done */}
      <ul className={`${prefixCls}-center`}>
        <li style={{ display: 'flex' }}>
          <HeaderSetting />
        </li>
      </ul>
      {/* doing */}
      <ul className={`${prefixCls}-right`}>
        {hasInject('base-saas:saasUpgrade') ? (
          <li style={{ width: 'auto', marginRight: 10 }} className={`${prefixCls}-right-li`}>
            {mount('base-saas:saasUpgrade')}
          </li>
        ) : null}
        <OrgSelect />
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
