import React from 'react';
import { Icon } from 'choerodon-ui';
import TimeAgo from 'timeago-react';
import { observer } from 'mobx-react-lite';
import handleClickProject from '@/utils/gotoProject';
import { useProjectsProStore } from '../../stores';
import ProjectTaskContent from '../projectTaskContent';

import './index.less';

export default observer(() => {
  const {
    history,
    ProjectsProUseStore,
    AppState,
  } = useProjectsProStore();

  const renderProjects = () => ProjectsProUseStore.getRecentProjects?.map((p) => {
    if (!p || !p.projectDTO) {
      return null;
    }
    const r = p.projectDTO || {};
    return (
      <div
        role="none"
        key={p.projectId}
        onClick={() => {
          if (r.enabled) {
            handleClickProject(r, history, AppState);
          }
        }}
        className="recentProjects-content"
        style={{
          cursor: r.enabled ? 'pointer' : 'not-allowed',
        }}
      >
        <div className="recentProjects-content-time">
          <span>
            <Icon type="date_range-o" />
          </span>
          <p>
            <TimeAgo datetime={p.lastVisitTime} locale="zh_CN" />
          </p>
          <p style={{ marginLeft: 5 }}>使用</p>
        </div>
        <ProjectTaskContent data={r} />
      </div>
    );
  });

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
