import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Icon } from 'choerodon-ui';
import { historyPushMenu } from '@choerodon/boot/lib/containers/common';
import findFirstLeafMenu from '../../util/findFirstLeafMenu';

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
    history.push(`/projects/${history.location.search}`);
  }

  render() {
    const { AppState } = this.props;
    const classString = classNames({
      block: true,
      // active: AppState.currentMenuType.type === 'site' && !AppState.isTypeUser,
    });
    return (
      <React.Fragment>
        <Button className={classString}>
          <Icon className="manager-icon" type="sync_user " style={{ marginLeft: '5px' }} />
          协作共享
        </Button>
        <Button className={classString} onClick={this.gotoProjects}>
          <Icon className="manager-icon" type="project_line " style={{ marginLeft: '5px' }} />
          项目
        </Button>
        <Button className={classString}>
          <Icon className="manager-icon" type="appmarket " style={{ marginLeft: '5px' }} />
          应用
        </Button>
        <Button className={classString}>
          <Icon className="manager-icon" type="book " style={{ marginLeft: '5px' }} />
          知识库
        </Button>
        <Button className={classString}>
          <Icon className="manager-icon" type="redeploy_line " style={{ marginLeft: '5px' }} />
          应用市场
        </Button>
      </React.Fragment>
    );
  }
}
