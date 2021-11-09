import React, { Component } from 'react';
import queryString from 'query-string';
import {
  Button, Icon, Menu,
} from 'choerodon-ui';
import {
  Button as ProButton,
} from 'choerodon-ui/pro';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { toJS } from 'mobx';
import { mount, get } from '@choerodon/inject';
import { historyPushMenu } from '@/utils';
import Setting from './Setting';
import MouserOverWrapper from './components/MouseOverWrapper';

const HAS_BASE_PRO = C7NHasModule('@choerodon/base-business');
const prefixCls = 'c7n-boot-header-menu-type';
const homePage = '/workbench';
@withRouter
@inject('AppState', 'HeaderStore', 'MenuStore')
@observer
export default class OrgSelect extends Component {
  autoSelect() {
    const { AppState: { currentMenuType: { organizationId } }, history } = this.props;
    const currentData = this.getCurrentData() || [];
    const localOrgId = localStorage.getItem('C7N-ORG-ID');
    if (localOrgId && localOrgId !== 'undefined') {
      const orgObj = currentData.find((v) => String(v.id) === localOrgId);
      if (orgObj) {
        this.selectState(orgObj);
        return;
      }
    }
    if (!organizationId && currentData.length) {
      this.selectState(currentData[0]);
    }
  }

  autoLocate = () => {
    const { history } = this.props;
    const parsed = queryString.parse(history.location.search);
    const path = `${history.location.pathname === '/' ? homePage : history.location.pathname}?${queryString.stringify(parsed)}`;
    historyPushMenu(history, path, null, 'replace');
  }

  selectState = (value, gotoHome) => {
    const {
      AppState, MenuStore, history,
    } = this.props;
    const {
      id, name, type, organizationId, category,
    } = value;
    localStorage.setItem('C7N-ORG-ID', id || organizationId);
    let parsed;
    let path;
    if (gotoHome) {
      parsed = {
        id,
        name,
        type,
        organizationId: id || organizationId,
        category,
      };
      path = `${homePage}?${queryString.stringify(parsed)}`;
    } else {
      parsed = {
        id,
        name,
        type,
        organizationId: organizationId || id,
        category,
      };
      path = `${history.location.pathname === '/' ? homePage : history.location.pathname}?${queryString.stringify(parsed)}`;
      AppState.changeMenuType(parsed);
    }
    MenuStore.setActiveMenu(null);
    historyPushMenu(history, path, null, 'replace');
  };

  renderTable(dataSource) {
    if (dataSource && dataSource.length) {
      return (
        <Menu>
          {
            dataSource.map((org) => (
              <Menu.Item
                key={org.id}
                onClick={() => this.selectState(org, true)}
                className={`${prefixCls}-org-select-menu-item`}
              >
                <MouserOverWrapper width="167px" text={org.name}>
                  <span className={`${prefixCls}-org-select-menu-item-text`}>
                    {org.name}
                  </span>
                </MouserOverWrapper>
              </Menu.Item>
            ))
          }
        </Menu>
      );
    }
    return null;
  }

  getCurrentData() {
    const { HeaderStore } = this.props;
    const orgData = toJS(HeaderStore.getOrgData);
    return orgData;
  }

  renderModalContent() {
    const currentData = this.getCurrentData();
    return (
      <div style={{
        maxHeight: 400, overflow: 'auto', boxShadow: '0 0.02rem 0.08rem rgba(0, 0, 0, 0.12)', width: 200,
      }}
      >
        {this.renderTable(currentData)}
      </div>
    );
  }

  render() {
    const {
      HeaderStore, AppState: {
        currentMenuType: {
          name: selectTitle = '选择组织', type, category, id, organizationId,
        }, getUserInfo, getCurrentTheme,
      }, history,
    } = this.props;
    const SelfButton = true ? ProButton : Button;
    const currentData = this.getCurrentData() || [];
    const orgObj = currentData.find((v) => String(v.id) === (organizationId || id) || v.id === (organizationId || id));
    if (!orgObj && currentData.length && type !== 'project') {
      if (getUserInfo.admin) {
        const obj = queryString.parse(history.location.search);
        obj.into = true;
        obj.name = obj.name && decodeURIComponent(obj.name);
        if (!obj.organizationId || !obj.type || obj.type === 'site') {
          setTimeout(() => {
            this.autoSelect();
          }, 100);
          return null;
        }
        this.selectState(obj);
        HeaderStore.setOrgData([...currentData, {
          ...obj,
          enabled: true,
        }]);
        return null;
      }
      setTimeout(() => {
        this.autoSelect();
      }, 100);
      return null;
    }
    if (history.location.pathname === '/') {
      setTimeout(() => {
        this.autoSelect();
      }, 100);
      return null;
    }
    const buttonClass = classnames(`${prefixCls}-button`, 'block', 'org-button', { 'theme4-orgSelect': true });
    const orgButton = (
      <SelfButton
        className={buttonClass}
        funcType="flat"
        style={{
          margin: 0,
          padding: '0 20px',
          width: 200,
          borderLeft: `1px solid ${true ? '#D9E6F2' : 'rgba(255, 255, 255, 0.3)'}`,
          borderRight: `1px solid ${true ? '#D9E6F2' : 'rgba(255, 255, 255, 0.3)'}`,
          borderTop: false ? '1px solid #D9E6F2' : 'unset',
          borderBottom: false ? '1px solid #D9E6F2' : 'unset',
          textAlign: 'left',
        }}
      >
        {
        (orgObj && orgObj.name) ? (
          <div>
            {
              false ? (
                <div style={{ fontSize: '12px', lineHeight: '20px', color: 'rgba(255, 255, 255, 0.6)' }}>组织</div>
              ) : (
                <Icon type="domain" />
              )
            }
            <div
              style={{
                fontFamily: 'PingFangSC-Medium, PingFang SC',
                fontWeight: 500,
                color: 'rgba(15, 19, 88, 0.65)',
                fontSize: '14px',
                lineHeight: '20px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textTransform: 'none',
                ...true ? {
                  paddingLeft: 9,
                } : {},
              }}
            >
              {orgObj.name}
            </div>
          </div>
        ) : null
      }
        {
        !(orgObj && orgObj.name) ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>请选择组织</span>
            <Icon type="arrow_drop_down" />
          </div>
        ) : null
      }
        {
        HAS_BASE_PRO && orgObj ? (
          <Icon
            type="expand_more"
            style={{
              position: 'absolute', top: 0, right: 8, color: 'rgba(255, 255, 255, .65)', fontSize: '.24rem',
            }}
          />
        ) : null
      }
      </SelfButton>
    );
    return (
      <>
        <li style={{ width: 'auto' }}>
          {get('base-pro:OrgSelect_Dropdown') ? mount('base-pro:OrgSelect_Dropdown', {
            selectState: this.selectState,
            prefixCls,
            MouserOverWrapper,
            orgObj,
          }) : orgButton}
        </li>
        {
          (orgObj && orgObj.into) ? (
            <li style={{ width: 'auto' }}>
              <Setting org={orgObj} />
            </li>
          ) : null
        }
      </>
    );
  }
}
