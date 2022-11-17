/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from 'react';
import StarProjects from './components/StarProjects';
import AllProjects from './components/AllProjects';
import RecentProjects from './components/RecentProjects';
import { useProjectsProStore } from './stores';

import './index.less';

export default () => {
  const {
    ProjectsProUseStore,
    AppState: {
      currentMenuType: { organizationId },
    },
    AppState,
    projectListDataSet,
  } = useProjectsProStore();

  useEffect(() => {
    AppState.getProjects();
    // ProjectsProUseStore.axiosGetProjects();
    ProjectsProUseStore.checkCreate(organizationId);
    ProjectsProUseStore.axiosGetStarProjects();
    ProjectsProUseStore.axiosGetRecentProjects();
    AppState.setCurrentProject(null);
  }, []);

  const refreshAllView = () => {
    ProjectsProUseStore.axiosGetStarProjects();
    ProjectsProUseStore.axiosGetRecentProjects();
    projectListDataSet.query();
  };

  return (
    <div className="projectsPro">
      <div className="projectsPro-left">
        <StarProjects />
        <RecentProjects />
      </div>
      <AllProjects />
    </div>
  );
};
