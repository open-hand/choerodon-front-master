import React, { Component } from 'react';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Icon } from 'choerodon-ui';

@withRouter
@inject('AppState', 'MenuStore')
@observer
export default class Setting extends Component {
  gotoOrganizationManager = () => {
    const { org: { id, name, type, category, organizationId }, history } = this.props;
    let path = '/base/organization-manager';
    path += `/?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
    path += `&organizationId=${id}&orgId=${id}`;
    history.push(path);
  }

  render() {
    const classString = classNames({ block: true });
    return (
      <Button className={classString} onClick={this.gotoOrganizationManager}>
        <Icon className="manager-icon" type="settings " style={{ marginLeft: '5px' }} />
        管理中心
      </Button>
    );
  }
}
