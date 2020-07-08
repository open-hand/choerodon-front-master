import React, { useEffect } from 'react';
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
import './ProjectOverview.less';

const ProjectOverview = () => {
  return (
    <Page className="c7n-project-overview">
      <Breadcrumb />
      <Content>

        <div className="c7n-project-overview-content">
          <div className="c7n-project-overview-content-left">
            <ServiceInfo />
            <BurnDownChart />
            <DefectTreatment />
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
        <div className="c7n-project-overview-item">
          <CommitChart />
          <DeployChart />
        </div>
      </Content>
    </Page>
  );
};

export default ProjectOverview;
