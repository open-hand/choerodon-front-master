import React, { useMemo, useCallback } from 'react';
import {
  Icon, Dropdown, Menu, Tooltip,
} from 'choerodon-ui';
import pick from 'lodash/pick';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { toJS } from 'mobx';
import { historyPushMenu } from '@/utils';
import './index.less';
import { OrgSelectorProps } from './interface';

const HAS_BASE_PRO = C7NHasModule('@choerodon/base-business');
const prefixCls = 'c7ncd-orgSelector';
const homePage = '/workbench';

const OrgSelector:React.FC<OrgSelectorProps> = (props) => {
  const {
    AppState: {
      currentMenuType: {
        organizationId, id, name,
      },
      changeMenuType,
    },
    AppState,
    HeaderStore: {
      getOrgData,
    },
  } = props;

  const history = useHistory();
  const location = useLocation();

  const {
    pathname,
  } = location;

  const currentOrgData = useMemo(() => (getOrgData ? toJS(getOrgData) : []), [getOrgData]);

  const selectState = useCallback((value:Record<string, any>, gotoHome?:boolean) => {
    const {
      id: selectId, organizationId: selectOrgId,
    } = value;

    const currentParams = pick(value, ['id', 'name', 'type', 'organizationId', 'category']);
    const parsed = new URLSearchParams(currentParams);

    localStorage.setItem('C7N-ORG-ID', selectId || selectOrgId);

    let path;
    if (gotoHome) {
      path = `${homePage}?${parsed.toString()}`;
    } else {
      path = `${pathname === '/' ? homePage : pathname}?${parsed.toString()}`;
      changeMenuType.call(AppState);
    }
    historyPushMenu(history, path, null, 'replace');
  }, [changeMenuType, history, pathname]);

  const orgButton = useMemo(() => {
    const btnCls = classnames(`${prefixCls}-button`);
    const hasOrgName = name;
    return (
      <div
        className={btnCls}
      >
        {hasOrgName && <Icon type="domain" />}
        <span>
          {hasOrgName || '请选择组织'}
        </span>
        {HAS_BASE_PRO && (
          <Icon
            type="expand_more"
          />
        )}
      </div>
    );
  }, [name]);

  const renderMenu = () => (
    <Menu className={`${prefixCls}-menu`}>
      {
        currentOrgData.map((org: Record<string, any>) => (
          <Menu.Item
            key={org.id}
            onClick={() => selectState(org, true)}
            className={`${prefixCls}-menu-item`}
          >
            <Tooltip
              title={org.name}
              placement="left"
            >
              <span className={`${prefixCls}-menu-text`}>
                {org.name}
              </span>
            </Tooltip>
          </Menu.Item>
        ))
      }
    </Menu>
  );

  const renderContent = () => (
    <Dropdown
      // disabled={!HAS_BASE_PRO}
      overlay={renderMenu()}
      placement="bottomCenter"
      trigger={['click']}
    >
      {orgButton}
    </Dropdown>
  );

  return (
    <div className={prefixCls}>
      {renderContent()}
    </div>
  );
};

export default inject('HeaderStore', 'AppState', 'MenuStore')(observer(OrgSelector));
