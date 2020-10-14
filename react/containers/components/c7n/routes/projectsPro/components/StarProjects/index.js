import React, { useState, useCallback } from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import {
  Droppable, Draggable, DragDropContext,
} from 'react-beautiful-dnd';
import { useProjectsProStore } from '../../stores';
import ProjectTaskContent from '../projectTaskContent';

import './index.less';

export default observer(() => {
  const {
    ProjectsProUseStore,
  } = useProjectsProStore();

  const renderProjects = useCallback(() => ProjectsProUseStore.getStarProjectsList.map((p, index) => (
    <Draggable key={`pre-${p.id}`} draggableId={`pre-${p.id}`} index={index}>
      {
        (dragProvided, snapshotinner) => (
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
            role="none"
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
          >
            <div className="starProjects-items-topborder" />
            <ProjectTaskContent alltrue data={p} />
          </div>
        )
      }
    </Draggable>

  )), [ProjectsProUseStore.getStarProjectsList]);

  const onDragEnd = (data) => {
    const { source, destination } = data;
  };

  return (
    <div className="starProjects">
      <div className="starProjects-title-wrap">
        <p className="starProjects-title">
          星标项目
          <span>
            {
            ProjectsProUseStore.getStarProjectsList.length || 0
          }
          </span>
        </p>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dropPreStep" isDropDisabled={false}>
          {
            (provided) => (
              <div className="starProjects-content-wrap" ref={provided.innerRef}>
                {renderProjects()}
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    </div>
  );
});
