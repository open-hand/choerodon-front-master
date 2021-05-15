import React, { Component } from 'react';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Icon } from 'choerodon-ui';
import { Button as ProButton } from 'choerodon-ui/pro';
import findFirstLeafMenu from '../../util/findFirstLeafMenu';

@withRouter
@inject('AppState', 'MenuStore')
@observer
export default class Setting extends Component {
  gotoOrganizationManager = () => {
    const { org: { id, name, type, category, organizationId }, history, MenuStore } = this.props;
    MenuStore.loadMenuData({ type: 'organization', id }, false).then((menus) => {
      if (menus.length) {
        const { route, domain } = findFirstLeafMenu(menus[0]);
        let path = route || '';
        path += `?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
        path += `&organizationId=${id}`;
        history.push(path);
      }
    });
  }

  render() {
    const classString = classNames({ block: true });
    return (
      <ProButton
        funcType="flat"
        className={classNames({
          [classString]: true,
          'theme4-setting': true,
        })}
        onClick={this.gotoOrganizationManager}
        icon="settings-o"
      />
    );
  }
}
