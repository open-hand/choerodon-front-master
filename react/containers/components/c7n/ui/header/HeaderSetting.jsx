import React from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Button, Icon } from 'choerodon-ui';
import getSearchString from '../../util/gotoSome';

const iconStyle = { marginLeft: 0, marginRight: 0 };
const LI_MAPPING = [
  { title: '工作台', icon: 'home', activePath: '/workbench' },
  // { title: '协作共享', icon: 'question_answer', activePath: '/buzz/cooperate', exclude: '/buzz/cooperate-pro' },
  { title: '项目', icon: 'project_filled', activePath: '/projects' },
  { title: '项目2', icon: 'project_filled', activePath: '/projectsPro' },
  // { title: '应用', icon: 'widgets', activePath: '/applications' },
  { title: '知识库', icon: 'knowledge', activePath: '/knowledge/organization' },
  // { title: '应用市场', icon: 'application_market', activePath: '/iam/choerodon/app-market' },
];

const Setting = ({ AppState, HeaderStore, MenuStore, history, ...props }) => {
  function goto(obj) {
    const queryObj = queryString.parse(history.location.search);
    const search = getSearchString('organization', 'id', queryObj.organizationId);
    MenuStore.setActiveMenu(null);
    history.push(`${obj.activePath}${search}`);
  }

  function extraCls(list) {
    const { location: { pathname } } = props;
    if (pathname.startsWith(list.activePath)) {
      if ('exclude' in list) {
        if (!pathname.startsWith(list.exclude)) {
          return 'header-setting-active';
        }
      } else {
        return 'header-setting-active';
      }
    }
    return '';
  }

  return (
    <React.Fragment>
      {
        LI_MAPPING.map(list => (
          <Button key={list.activePath} className={`block ${extraCls(list)}`} onClick={() => goto(list)}>
            <Icon type={list.icon} style={iconStyle} />
            {list.title}
          </Button>
        ))
      }
    </React.Fragment>
  );
};

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(observer(Setting)));
