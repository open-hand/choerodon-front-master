import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Icon } from 'choerodon-ui';
import findFirstLeafMenu from '../util/findFirstLeafMenu';
import { getMessage, historyPushMenu } from '@choerodon/boot/lib/containers/common';

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

  gotoProjects = () => {
    const { history } = this.props;
    console.log(history);
    history.push(`/projects/${history.location.search}`);
  }

  render() {
    const { AppState } = this.props;
    const classString = classNames({
      active: AppState.currentMenuType.type === 'site' && !AppState.isTypeUser,
    });
    return (
      <React.Fragment>
        <Button className={classString}>
          <Icon className="manager-icon" type="sync_user " style={{ marginLeft: '5px' }} />
          {getMessage('协作连接', 'Manage')}
        </Button>
        <Button className={classString} onClick={this.gotoProjects}>
          <Icon className="manager-icon" type="project_line " style={{ marginLeft: '5px' }} />
          {getMessage('项目', 'Manage')}
        </Button>
        <Button className={classString}>
          <Icon className="manager-icon" type="appmarket " style={{ marginLeft: '5px' }} />
          {getMessage('应用市场', 'Manage')}
        </Button>
        <Button className={classString}>
          <Icon className="manager-icon" type="book " style={{ marginLeft: '5px' }} />
          {getMessage('知识', 'Manage')}
        </Button>
      </React.Fragment>
    );
  }
}
