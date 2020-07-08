import React, { useState, useCallback } from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { useProjectsProStore } from '../../stores';
import ProjectTaskContent from '../projectTaskContent';

import './index.less';

export default observer(() => {
  const {
    ProjectsProUseStore,
  } = useProjectsProStore();

  const renderProjects = useCallback(() => ProjectsProUseStore.getStarProjectsList.map(p => (
    <div
      onClick={() => {
        if (p.enabled) {
          ProjectsProUseStore.handleClickProject(p);
        }
      }}
      className="starProjects-items"
      style={{
        cursor: p.enabled ? 'pointer' : 'not-allowed',
      }}
    >
      <div className="starProjects-items-topborder" />
      <ProjectTaskContent alltrue data={p} />
    </div>
  )), [ProjectsProUseStore.getStarProjectsList]);

  return (
    <div className="starProjects">
      <div className="starProjects-title-wrap">
        <p className="starProjects-title">星标项目
          <span>{
            ProjectsProUseStore.getStarProjectsList.length || 0
          }
          </span>
        </p>
      </div>
      <div className="starProjects-content-wrap">
        {renderProjects()}
      </div>
    </div>
  );
});
