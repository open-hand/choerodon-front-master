import React, { useCallback, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Droppable, Draggable, DragDropContext,
} from 'react-beautiful-dnd';
import { Icon, Button } from 'choerodon-ui/pro';
import { Animate } from 'choerodon-ui';
import handleClickProject from '@/utils/gotoProject';
import { useProjectsProStore } from '../../stores';
import ProjectTaskContent from '../projectTaskContent';

import './index.less';
import { useFormatMessage, useFormatCommon } from '@/hooks';

export default observer(() => {
  const {
    ProjectsProUseStore,
    AppState,
    history,
  } = useProjectsProStore();

  const workbenchIntlPrefix = 'workbench';

  const formatWorkbench = useFormatMessage(workbenchIntlPrefix);
  const formatCommon = useFormatCommon();

  const [rencentArrsForshow, setRencentArrsForshow] = useState([]);
  const [expand, setExpand] = useState(true);

  useEffect(() => {
    if (expand) {
      setRencentArrsForshow(ProjectsProUseStore.getRecentProjects);
    } else {
      setRencentArrsForshow([]);
    }
  }, [ProjectsProUseStore.getRecentProjects]);

  const handleExpandClick = () => {
    if (expand) {
      setRencentArrsForshow([]);
    } else {
      setRencentArrsForshow(ProjectsProUseStore.getRecentProjects);
    }
    setExpand(!expand);
  };

  const renderProjects = useCallback(() => (
    <Animate component="div" transitionName={expand ? 'slide-down' : 'slide-up'}>
      { rencentArrsForshow.map((p, index) => (
        <div
          role="none"
          onClick={() => {
            if (p?.projectDTO?.enabled) {
              handleClickProject(p?.projectDTO, history);
            }
          }}
          className="recentProjects-items"
          key={`star${p.projectId}`}
        >
          <div className="recentProjects-items-topborder" />
          <ProjectTaskContent data={p.projectDTO || {}} lastVisitTime={p.lastVisitTime} />
        </div>
      ))}
    </Animate>
  ), [rencentArrsForshow, history]);

  return (
    <div className="recentProjects">
      <div className="recentProjects-title-wrap">
        <p className="recentProjects-title">
          <span>最近使用项目</span>
          <span>
            {ProjectsProUseStore.getRecentProjects.length ? <Button icon={!expand ? 'expand_more' : 'expand_less'} size="small" onClick={handleExpandClick} /> : ''}
          </span>
        </p>
      </div>
      <div
        className="recentProjects-content-wrap"
      >
        {renderProjects()}
      </div>

    </div>
  );
});
