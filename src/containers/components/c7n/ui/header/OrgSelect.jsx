import React, { Component } from 'react';
import queryString from 'query-string';
import { Button, Icon, Dropdown, Menu } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { toJS } from 'mobx';
import findFirstLeafMenu from '../../util/findFirstLeafMenu';
import { historyPushMenu } from '../../util';

const prefixCls = 'c7n-boot-header-menu-type';

@withRouter
@inject('AppState', 'HeaderStore', 'MenuStore')
@observer
export default class OrgSelect extends Component {
  selectState = (value) => {
    const { AppState, HeaderStore, MenuStore, history } = this.props;
    const { id, name, type, organizationId, category } = value;
    const parsed = queryString.parse(history.location.search);
    parsed.orgId = id;
    const path = `${history.location.pathname}?${queryString.stringify(parsed)}`;
    historyPushMenu(history, path);
  };

  renderTable(dataSource, isNotRecent) {
    if (dataSource && dataSource.length) {
      return (
        <Menu>
          {
            dataSource.map(org => (
              <Menu.Item>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => this.selectState(org)}
                >
                  {org.name}
                </a>
              </Menu.Item>
            ))
          }
        </Menu>
      );
    } else {
      return (
        <div className={`${prefixCls}-empty`}>
          {
            isNotRecent ? '您还没有在任何组织或项目中被分配角色' : '您没有最近浏览记录'
          }
        </div>
      );
    }
  }

  getCurrentData() {
    const { HeaderStore } = this.props;
    const orgData = toJS(HeaderStore.getOrgData);
    return orgData;
  }

  renderModalContent() {
    const currentData = this.getCurrentData();
    return (
      <div style={{ maxHeight: 500, overflow: 'auto', boxShadow: '0 0.02rem 0.08rem rgba(0, 0, 0, 0.12)' }}>
        {this.renderTable(currentData, true)}
      </div>
    );
  }

  render() {
    const {
      AppState: { currentMenuType: { name: selectTitle = '选择组织', type, category, id, organizationId, orgId } },
    } = this.props;
    const currentData = this.getCurrentData() || [];
    const orgObj = currentData.find(v => String(v.id) === orgId);
    const buttonClass = classnames(`${prefixCls}-button`, 'block', 'org-button');
    const menu = this.renderModalContent();
    return (
      <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
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
                <div style={{ fontSize: '12px', lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{orgObj.name}</div>
              </div>
            ) : null
          }
          {
            !(orgObj && orgObj.name) ? (
              <div>
                <span>请选择组织</span>
                <Icon type="arrow_drop_down" />
              </div>
            ) : null
          }
        </Button>
      </Dropdown>
    );
  }
}
