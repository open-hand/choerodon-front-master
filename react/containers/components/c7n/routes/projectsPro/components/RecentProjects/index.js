import React from 'react';
import { Icon } from 'choerodon-ui';
import queryString from 'query-string';
import { observer } from 'mobx-react-lite';
import { useProjectsProStore } from "../../stores";
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import ProjectTaskContent from '../projectTaskContent';

import './index.less'

export default observer(() => {
  const {
    history,
    ProjectsProUseStore,
  } = useProjectsProStore();

  const renderProjects = () => {
    const { organizationId } = queryString.parse(history.location.search);
    return HeaderStore.getRecentItem.filter(i => String(i.organizationId) === String(organizationId)).map(r => (
      <div onClick={() => ProjectsProUseStore.handleClickProject(r)} className="recentProjects-content">
        <div className="recentProjects-content-time">
        <span>
          <Icon type="date_range-o" />
        </span>
          <p>5分钟前</p>
          <p style={{ marginLeft: 5 }}>使用</p>
        </div>
        <ProjectTaskContent data={r} />
      </div>
    ))
  }

  return (
    <div className="recentProjects">
      <p className="recentProjects-title">最近使用</p>
      {renderProjects()}
    </div>
  )
})
