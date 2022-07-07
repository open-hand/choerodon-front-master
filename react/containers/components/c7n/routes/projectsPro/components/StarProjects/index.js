import React, { useCallback, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Droppable, Draggable, DragDropContext,
} from 'react-beautiful-dnd';
import { Animate } from 'choerodon-ui';
import { Icon, Button } from 'choerodon-ui/pro';
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

  const [starArrsForshow, setStarArrsForshow] = useState([]);
  const [expand, setExpand] = useState(true);
  const [haveLoadAll, setHaveLoadAll] = useState(false);

  const getItemStyle = (isDragging, draggableStyle, enabled) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // styles we need to apply on draggables
    ...draggableStyle,
    cursor: enabled ? 'all-scroll' : 'not-allowed',
  });

  useEffect(() => {
    if (expand) {
      haveLoadAll ? setStarArrsForshow(ProjectsProUseStore.getStarProjectsList) : setStarArrsForshow(ProjectsProUseStore.getStarProjectsList.slice(0, 3));
    } else {
      setStarArrsForshow([]);
    }
  }, [ProjectsProUseStore.getStarProjectsList]);

  const handleExpandClick = () => {
    if (expand) {
      setStarArrsForshow([]);
    } else {
      haveLoadAll ? setStarArrsForshow(ProjectsProUseStore.getStarProjectsList) : setStarArrsForshow(ProjectsProUseStore.getStarProjectsList.slice(0, 3));
    }
    setExpand(!expand);
  };

  const handleLoadmoreClick = () => {
    setHaveLoadAll(true);
    setStarArrsForshow(ProjectsProUseStore.getStarProjectsList);
  };

  const renderProjects = useCallback(() => (
    <Animate component="div" transitionName={expand ? 'slide-down' : 'slide-up'}>
      {starArrsForshow.map((p, index) => (
        <Draggable key={`pre-${p.id}`} draggableId={`pre-${p.id}`} index={index}>
          {
        (dragProvided, snapshotinner) => (
          <div
            onClick={() => {
              if (p.enabled) {
                handleClickProject(p, history);
              }
            }}
            key={`star${p.id}`}
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
      ))}
    </Animate>
  ), [starArrsForshow, history]);

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
          <div className="starProjects-title-left">
            <span>{formatCommon({ id: 'starProjects' })}</span>
            <span className="number">
              {
              ProjectsProUseStore.getStarProjectsList.length || 0
            }
            </span>
          </div>
          <div className="starProjects-title-right">
            {ProjectsProUseStore.getStarProjectsList.length
            && <Button icon={!expand ? 'expand_more' : 'expand_less'} size="small" onClick={handleExpandClick} />}
          </div>
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
      {
        (ProjectsProUseStore.getStarProjectsList.length > 3 && !haveLoadAll && expand)
        && (
        <div className="starProjects-loadmore" role="none" onClick={handleLoadmoreClick}>
          查看所有星标项目
          <Icon type="expand_more" />
        </div>
        )
      }
    </div>
  );
});
