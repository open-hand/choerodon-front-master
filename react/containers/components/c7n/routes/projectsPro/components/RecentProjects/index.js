import React from 'react';
import { Icon } from 'choerodon-ui';
import queryString from 'query-string';
import TimeAgo from 'timeago-react';
import { observer } from 'mobx-react-lite';
import { useProjectsProStore } from '../../stores';
import HeaderStore from '../../../../../../stores/c7n/HeaderStore';
import ProjectTaskContent from '../projectTaskContent';

import './index.less';

export default observer(() => {
  const {
    history,
    ProjectsProUseStore,
  } = useProjectsProStore();

  const renderProjects = () => {
    return ProjectsProUseStore.getRecentProjects.map(p => {
      const r = p.projectDTO;
      return (
        <div
          onClick={() => {
            if (r.enabled) {
              ProjectsProUseStore.handleClickProject(r);
            }
          }}
          className="recentProjects-content"
          style={{
            cursor: r.enabled ? 'pointer' : 'not-allowed',
          }}
        >1
          <div className="recentProjects-content-time">
          <span>
            <Icon type="date_range-o" />
          </span>
            <p>
              <TimeAgo datetime={r.lastUpdateDate} locale='zh_CN' />
            </p>
            <p style={{ marginLeft: 5 }}>使用</p>
          </div>
          <ProjectTaskContent data={r} />
        </div>
      )
    });
  };

  return (
    <div className="recentProjects">
      <div className="recentProjects-title-wrap">
        <p className="recentProjects-title">最近使用</p>
      </div>
      <div className="recentProjects-content-wrap">
        {renderProjects()}
      </div>
    </div>
  );
});
