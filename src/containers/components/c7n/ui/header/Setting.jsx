import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Icon } from 'choerodon-ui';
import findFirstLeafMenu from '../../util/findFirstLeafMenu';
import { historyPushMenu } from '@choerodon/boot/lib/containers/common';

@withRouter
@inject('AppState', 'MenuStore')
@observer
export default class Setting extends Component {
  getGlobalMenuData = () => {
    const { MenuStore, history } = this.props;
    MenuStore.loadMenuData({ type: 'site' }, false).then((menus) => {
      if (menus.length) {
        const { route, domain } = findFirstLeafMenu(menus[0]);
        historyPushMenu(history, route, domain);
      }
    });
  };

  gotoOrganizationManager = () => {
    const { history } = this.props;
    console.log(history);
    history.push(`/iam/organization-manager/${history.location.search}`);
  }

  render() {
    const { AppState } = this.props;
    const classString = classNames({
      block: true,
      // active: AppState.currentMenuType.type === 'site' && !AppState.isTypeUser,
    });
    return (
      <Button className={classString} onClick={this.gotoOrganizationManager}>
        <Icon className="manager-icon" type="settings " style={{ marginLeft: '5px' }} />
        管理中心
      </Button>
    );
  }
}
