import React, { useState, useCallback } from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { useProjectsProStore } from "../../stores";
import ProjectTaskContent from '../projectTaskContent';

import './index.less';

export default observer(() => {
  const {
    ProjectsProUseStore,
  } = useProjectsProStore();
  // const [projects, setProjects] = useState([{
  //   title: 'Choerodon持续交付',
  //   code: 'C7NCD',
  //   status: '启用',
  //   time: '3月',
  //   text1: 'DevOps全流程',
  //   text2: '中台研发项目群',
  // }]);

  const renderProjects = useCallback(() => {
    return ProjectsProUseStore.getStarProjectsList.slice(0, 6).map(p => (
      <div onClick={() => ProjectsProUseStore.handleClickProject(p)} className="starProjects-items">
        <div className="starProjects-items-topborder"></div>
        <ProjectTaskContent alltrue data={p} />
      </div>
    ))
  }, [ProjectsProUseStore.getStarProjectsList])

  return (
    <div className="starProjects">
      <p className="starProjects-title">星标项目
        <span>{
          ProjectsProUseStore.getStarProjectsList.length > 6
          ? 6
            :ProjectsProUseStore.getStarProjectsList.length
        }</span>
      </p>
      {renderProjects()}
    </div>
  )
});
