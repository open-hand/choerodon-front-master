import React from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Button, Icon } from 'choerodon-ui';
import getSearchString from '../../util/gotoSome';

const iconStyle = { marginLeft: '.05rem' };
const LI_MAPPING = [
  { title: '协作共享', icon: 'sync_user', activePath: '/buzz/cooperate', exclude: '/buzz/cooperate-pro' },
  { title: '项目', icon: 'project_line', activePath: '/projects' },
  { title: '应用', icon: 'appmarket', activePath: '/applications' },
  { title: '知识库', icon: 'book', activePath: '/knowledge/organization' },
  { title: '应用市场', icon: 'redeploy_line', activePath: '/base/app-market' },
];

const Setting = ({ AppState, HeaderStore, history, ...props }) => {
  function goto(obj) {
    const queryObj = queryString.parse(history.location.search);
    const search = getSearchString('organization', 'id', queryObj.orgId);
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
          <Button className={`block ${extraCls(list)}`} onClick={() => goto(list)}>
            <Icon type={list.icon} style={iconStyle} />
            {list.title}
          </Button>
        ))
      }
    </React.Fragment>
  );
};

export default withRouter(inject('AppState', 'HeaderStore')(observer(Setting)));
