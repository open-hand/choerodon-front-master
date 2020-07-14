import React, { useEffect, useMemo } from 'react';
import { Content, Breadcrumb, Header, Page } from '../../../../../index';
import ServiceInfo from './components/ServiceInfo';
import BurnDownChart from './components/BurnDownChart';
import DefectTreatment from './components/DefectTreatment';
import SprintWaterWave from './components/SprintWaterWave';
import UserList from './components/UserList';
import SprintCount from './components/SprintCount';
import Workload from './components/Workload';
import SagaChart from './components/saga-chart';
import DeployChart from './components/deploy-chart';
import CommitChart from './components/commit-chart';
import DefectChart from './components/defect-chart';
import { useProjectOverviewStore } from './stores';

import './ProjectOverview.less';

const ProjectOverview = () => {
  const {
    AppState: { currentMenuType: { category } },
  } = useProjectOverviewStore();
  const showDevops = useMemo(() => category === 'GENERAL' || category === 'OPERATIONS', [category]);
  
  return (
    <Page className="c7n-project-overview">
      <Breadcrumb />
      <Content>
        <div className="c7n-project-overview-content">
          <div className="c7n-project-overview-content-left">
            {showDevops ? <ServiceInfo /> : null}
            <BurnDownChart showDevops={showDevops} />
            <DefectTreatment showDevops={showDevops} />
          </div>
          <div className="c7n-project-overview-content-right">
            <SprintWaterWave />
            <SprintCount />
            <UserList />
          </div>

        </div>
        <div className="c7n-project-overview-item">
          <Workload />
        </div>
        <div className="c7n-project-overview-item">
          <SagaChart />
          <DefectChart />
        </div>
        {showDevops ? (
          <div className="c7n-project-overview-item">
            <CommitChart />
            <DeployChart />
          </div>
        ) : null}
      </Content>
    </Page>
  );
};

export default ProjectOverview;
