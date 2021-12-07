import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Droppable, Draggable, DragDropContext,
} from 'react-beautiful-dnd';
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

  const getItemStyle = (isDragging, draggableStyle, enabled) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // styles we need to apply on draggables
    ...draggableStyle,
    cursor: enabled ? 'all-scroll' : 'not-allowed',
  });

  const renderProjects = useCallback(() => ProjectsProUseStore.getStarProjectsList.map((p, index) => (
    <Draggable key={`pre-${p.id}`} draggableId={`pre-${p.id}`} index={index}>
      {
        (dragProvided, snapshotinner) => (
          <div
            onClick={() => {
              if (p.enabled) {
                handleClickProject(p, history, AppState);
              }
            }}
            className="starProjects-items"
            role="none"
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
            style={getItemStyle(
              snapshotinner.isDragging,
              dragProvided.draggableProps.style,
              p.enabled,
            )}
          >
            <div className="starProjects-items-topborder" />
            <ProjectTaskContent alltrue data={p} />
          </div>
        )
      }
    </Draggable>

  )), [ProjectsProUseStore.getStarProjectsList, history]);

  function swap(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
  }

  const onDragEnd = (data) => {
    const { source, destination } = data;
    const temp = ProjectsProUseStore.getStarProjectsList.slice();
    const arr = [...swap(temp, source.index, destination.index)];
    ProjectsProUseStore.setStarProjectsList(arr);
    ProjectsProUseStore.changeStarProjectPos(arr);
  };

  const getListStyle = (isDraggingOver) => ({
    border: isDraggingOver ? '2px dotted #5266d4' : 'none',
    borderRadius: isDraggingOver ? '3px' : '0',
    padding: isDraggingOver ? '4px' : 0,
    background: isDraggingOver ? 'rgba(82, 102, 212, 0.1)' : 'none',
  });

  return (
    <div className="starProjects">
      <div className="starProjects-title-wrap">
        <p className="starProjects-title">
          {formatCommon({ id: 'starProjects' })}
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
            (provided, snapshot) => (
              <div
                className="starProjects-content-wrap"
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >

                {renderProjects()}
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    </div>
  );
});
