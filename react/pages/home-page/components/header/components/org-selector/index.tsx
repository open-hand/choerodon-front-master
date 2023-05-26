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
import { historyPushMenu } from '@/utils';
import { OrgSelectorProps } from './interface';
import { HOMEPAGE_PATH } from '@/constants';
import './index.less';

// 是否存在base的商业版本
const HAS_BASE_BUSINESS = (window as any).baseBusiness;

const prefixCls = 'c7ncd-orgSelector';

const OrgSelector:React.FC<OrgSelectorProps> = (props) => {
  const {
    AppState: {
      currentMenuType: {
        organizationId,
        name,
        id,
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

  // 这里的currentOrgdata的数据可能不包含当前选中的组织的数据，因为可能从平台组织管理那边跳转的
  const currentOrgData = useMemo(() => (getOrgData ? toJS(getOrgData) : []), [getOrgData]);

  // todo
  const currentSelectedOrg = useMemo(() => currentOrgData.find((v: { id: any; }) => String(v.id) === String(organizationId || id)), [currentOrgData, id, organizationId]);

  const {
    tenantName = name,
  } = currentSelectedOrg || {};

  // todo...
  const selectState = useCallback((value:Record<string, any>, gotoHome?:boolean) => {
    const {
      id: selectId, organizationId: selectOrgId,
    } = value;
    AppState.isProjectsLoading = true;

    const currentParams = pick(value, ['id', 'name', 'type', 'organizationId', 'category']);
    const parsed = new URLSearchParams(currentParams);

    localStorage.setItem('C7N-ORG-ID', selectId || selectOrgId);
    let path;
    // true跳转到主页
    if (gotoHome) {
      path = `${HOMEPAGE_PATH}?${parsed.toString()}`;
    } else {
      path = `${pathname === '/' ? HOMEPAGE_PATH : pathname}?${parsed.toString()}`;
      AppState.changeMenuType(path);
    }
    historyPushMenu(history, path, null, 'replace');
  }, [AppState, history, pathname]);

  // todo
  // 这是自动选中组织的函数，如果localstorage中存在就去调selectState，不存在就选中当前组织列表第一项
  // 待优化，选中组织的逻辑可以拆离
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
    // 这里如果出现显示的项目名称 而不是组织名称 多半原因是 下拉组织列表没有返回这个组织id对应的数据
    return (
      <div
        className={btnCls}
      >
        {tenantName && <Icon type="domain" />}
        <span>
          {tenantName || '请选择组织'}
        </span>
        {window.baseBusiness && (
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
      // disabled={!HAS_BASE_BUSINESS}
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
