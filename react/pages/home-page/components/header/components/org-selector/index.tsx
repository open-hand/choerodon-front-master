import React, { useMemo, useCallback, useEffect } from 'react';
import {
  Icon, Dropdown, Menu, Tooltip,
} from 'choerodon-ui';
import pick from 'lodash/pick';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { toJS } from 'mobx';
import { findIndex } from 'lodash';
import { historyPushMenu } from '@/utils';
import { OrgSelectorProps } from './interface';
import { HOMEPAGE_PATH } from '@/constants';
import './index.less';

const HAS_BASE_PRO = C7NHasModule('@choerodon/base-business');
const prefixCls = 'c7ncd-orgSelector';

const OrgSelector:React.FC<OrgSelectorProps> = (props) => {
  const {
    AppState: {
      currentMenuType: {
        organizationId,
      },
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

  // todo
  const currentSelectedOrg = currentOrgData[findIndex(currentOrgData, (item:any) => String(organizationId) === String(item.tenantId))];

  const {
    tenantName,
  } = currentSelectedOrg || {};

  // todo...
  const selectState = useCallback((value:Record<string, any>, gotoHome?:boolean) => {
    const {
      id: selectId, organizationId: selectOrgId,
    } = value;

    const currentParams = pick(value, ['id', 'name', 'type', 'organizationId', 'category']);
    const parsed = new URLSearchParams(currentParams);

    localStorage.setItem('C7N-ORG-ID', selectId || selectOrgId);

    let path;
    if (gotoHome) {
      path = `${HOMEPAGE_PATH}?${parsed.toString()}`;
    } else {
      path = `${pathname === '/' ? HOMEPAGE_PATH : pathname}?${parsed.toString()}`;
      AppState.changeMenuType(path);
    }
    historyPushMenu(history, path, null, 'replace');
  }, [AppState, history, pathname]);

  // todo
  const autoSelect = useCallback(() => {
    const localOrgId = localStorage.getItem('C7N-ORG-ID');
    if (localOrgId && localOrgId !== 'undefined') {
      const orgObj = currentOrgData.find((v:Record<string, any>) => String(v.id) === localOrgId);
      if (orgObj) {
        selectState(orgObj);
        return;
      }
    }
    if (!organizationId && currentOrgData.length) {
      selectState(currentOrgData[0]);
    }
  }, [currentOrgData, organizationId, selectState]);

  const orgButton = useMemo(() => {
    const btnCls = classnames(`${prefixCls}-button`);
    return (
      <div
        className={btnCls}
      >
        {tenantName && <Icon type="domain" />}
        <span>
          {tenantName || '请选择组织'}
        </span>
        {HAS_BASE_PRO && (
          <Icon
            type="expand_more"
          />
        )}
      </div>
    );
  }, [tenantName]);

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

  useEffect(() => {
    if (!organizationId) {
      autoSelect();
    }
  }, [autoSelect, organizationId]);

  return (
    <div className={prefixCls}>
      {renderContent()}
    </div>
  );
};

export default inject('HeaderStore', 'AppState', 'MenuStore')(observer(OrgSelector));
