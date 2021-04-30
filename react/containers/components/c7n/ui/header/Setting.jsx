import React, { Component } from 'react';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Icon } from 'choerodon-ui/pro';
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
      <Button
        funcType="flat"
        className={classNames({
          [classString]: true,
          'theme4-setting': this.props.AppState.getCurrentTheme === 'theme4',
        })}
        onClick={this.gotoOrganizationManager}
      >
        <Icon
          className={classNames({
            'theme4-setting-icon': this.props.AppState.getCurrentTheme === 'theme4'
          })}
          type={this.props.AppState.getCurrentTheme === 'theme4' ? 'settings-o' : "settings"}
          style={{ marginLeft: '5px' }}
        />
        { this.props.AppState.getCurrentTheme === '' && '管理中心' }
      </Button>
    );
  }
}
