import React, { Component } from 'react';
import queryString from 'query-string';
import { Button, Icon, Dropdown, Menu } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { toJS } from 'mobx';
import findFirstLeafMenu from '../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../util';
import Setting from './Setting';

const prefixCls = 'c7n-boot-header-menu-type';
const homePage = '/projects';
@withRouter
@inject('AppState', 'HeaderStore', 'MenuStore')
@observer
export default class OrgSelect extends Component {
  autoSelect() {
    const { AppState: { currentMenuType: { orgId } }, history } = this.props;
    const currentData = this.getCurrentData() || [];
    const localOrgId = localStorage.getItem('C7N-ORG-ID');
    if (localOrgId) {
      const orgObj = currentData.find(v => String(v.id) === localOrgId);
      if (orgObj) {
        this.selectState(orgObj);
        return;
      }
    }
    if (!orgId && currentData.length) {
      this.selectState(currentData[0]);
    }
  }

  autoLocate = () => {
    const { history } = this.props;
    const parsed = queryString.parse(history.location.search);
    const path = `${history.location.pathname === '/' ? homePage : history.location.pathname}?${queryString.stringify(parsed)}`;
    historyPushMenu(history, path, null, 'replace');
  }

  selectState = (value, gotoBuzz) => {
    const { AppState, HeaderStore, MenuStore, history } = this.props;
    const { id, name, type, organizationId, category } = value;
    localStorage.setItem('C7N-ORG-ID', id);
    let parsed;
    let path;
    if (gotoBuzz) {
      parsed = {
        id,
        name,
        type,
        organizationId,
        category,
        orgId: id,
      };
      path = `${homePage}?${queryString.stringify(parsed)}`;
    } else {
      parsed = queryString.parse(history.location.search);
      parsed.orgId = id;
      path = `${history.location.pathname === '/' ? homePage : history.location.pathname}?${queryString.stringify(parsed)}`;
    }
    MenuStore.setActiveMenu(null);
    historyPushMenu(history, path, null, 'replace');
  };

  renderTable(dataSource) {
    if (dataSource && dataSource.length) {
      return (
        <Menu>
          {
            dataSource.map(org => (
              <Menu.Item key={org.id}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => this.selectState(org, true)}
                >
                  {org.name}
                </a>
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
      <div style={{ maxHeight: 400, marginTop: 44, overflow: 'auto', boxShadow: '0 0.02rem 0.08rem rgba(0, 0, 0, 0.12)' }}>
        {this.renderTable(currentData)}
      </div>
    );
  }

  render() {
    const {
      HeaderStore, AppState: { currentMenuType: { name: selectTitle = '选择组织', type, category, id, organizationId, orgId }, getUserInfo }, history,
    } = this.props;
    const currentData = this.getCurrentData() || [];
    const orgObj = currentData.find(v => String(v.id) === orgId);
    if (!orgObj && currentData.length && type !== 'project') {
      if (getUserInfo.admin) {
        const obj = queryString.parse(history.location.search);
        obj.into = true;
        obj.name = decodeURIComponent(obj.name);
        if (!obj.orgId) {
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
      } else {
        setTimeout(() => {
          this.autoSelect();
        }, 100);
        return null;
      }
    }
    const buttonClass = classnames(`${prefixCls}-button`, 'block', 'org-button');
    const menu = this.renderModalContent();
    return (
      <React.Fragment>
        <li style={{ width: 'auto' }}>
          <Button
            className={buttonClass}
            funcType="flat"
            style={{
              margin: 0,
              padding: '0 20px',
              width: 200,
              borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
              borderRight: '1px solid rgba(255, 255, 255, 0.3)',
              textAlign: 'left',
            }}
          >
            {
                (orgObj && orgObj.name) ? (
                  <div>
                    <div style={{ fontSize: '12px', lineHeight: '20px', color: 'rgba(255, 255, 255, 0.6)' }}>组织</div>
                    <div style={{ fontSize: '12px', lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'none' }}>{orgObj.name}</div>
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
          </Button>
        </li>
        {
          (orgObj && orgObj.into) ? (
            <li style={{ width: 'auto' }}>
              <Setting org={orgObj} />
            </li>
          ) : null
        }
      </React.Fragment>
    );
  }
}
