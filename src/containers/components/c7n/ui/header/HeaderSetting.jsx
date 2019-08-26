import React from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Button, Icon } from 'choerodon-ui';

const iconStyle = { marginLeft: '.05rem' };

const Setting = ({ AppState, HeaderStore, history, ...props }) => {
  function gotoCooperate() {
    const { currentMenuType: { type, orgId } } = AppState;
    const queryObj = queryString.parse(history.location.search);
    let queryNeedObj;
    if (type === 'project') {
      queryNeedObj = {
        type: 'project',
        id: queryObj.id,
        name: queryObj.name,
        category: queryObj.category,
        organizationId: queryObj.organizationId,
        orgId: queryObj.orgId,
      };
    } else {
      const orgData = HeaderStore.getOrgData;
      const orgObj = orgData.find(v => String(v.id) === orgId) || {};
      queryNeedObj = {
        type: 'organization',
        id: queryObj.orgId,
        name: queryObj.name || orgObj.name,
        category: queryObj.category || orgObj.category,
        organizationId: queryObj.orgId,
        orgId: queryObj.orgId,
      };
    }
    history.push(`/buzz/cooperate?${queryString.stringify(queryNeedObj)}`);
  }

  function gotoProjects() {
    history.push(`/projects${history.location.search}`);
  }

  function gotoApplications() {
    history.push(`/applications${history.location.search}`);
  }

  function gotoAppMarket() {
    history.push(`/iam/app-market${history.location.search}`);
  }

  function gotoKnowledge() {
    const { currentMenuType: { orgId } } = AppState;
    const queryObj = queryString.parse(history.location.search);
    
    const orgData = HeaderStore.getOrgData;
    const orgObj = orgData.find(v => String(v.id) === orgId) || {};
    const queryNeedObj = {
      type: 'organization',
      id: queryObj.orgId,
      name: queryObj.name || orgObj.name,
      category: queryObj.category || orgObj.category,
      organizationId: queryObj.orgId,
      orgId: queryObj.orgId,
    };
    history.push(`/knowledge/organization?${queryString.stringify(queryNeedObj)}`);
  }

  function loop() {}

  const LI_MAPPING = [
    { title: '协作共享', icon: 'sync_user', action: gotoCooperate },
    { title: '项目', icon: 'project_line', action: gotoProjects },
    { title: '应用', icon: 'appmarket', action: gotoApplications },
    { title: '知识库', icon: 'book', action: gotoKnowledge },
    { title: '应用市场', icon: 'redeploy_line', action: gotoAppMarket },
  ];

  return (
    <React.Fragment>
      {
        LI_MAPPING.map(list => (
          <Button className="block" onClick={list.action}>
            <Icon className="manager-icon" type={list.icon} style={iconStyle} />
            {list.title}
          </Button>
        ))
      }
    </React.Fragment>
  );
};

export default withRouter(inject('AppState', 'HeaderStore')(observer(Setting)));
