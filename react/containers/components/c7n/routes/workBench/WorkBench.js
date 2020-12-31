import React from 'react';
import { Page } from '../../../../../index';
import StarTargetPro from './components/StarTargetPro';
import WorkBenchAgile from './components/WorkBenchAgile';
import SelfIntro from './components/SelfIntro';
import ServiceList from './components/ServiceList';
import Doc from './components/doc';
import EnvList from './components/EnvList';
import QuickLink from './components/QuickLink';

import './WorkBench.less';

const WorkBench = () => (
  <Page className="c7n-workbench">
    <div className="c7n-workbench-left">
      <StarTargetPro />
      <WorkBenchAgile />
      <div style={{ display: 'flex' }}>
        <QuickLink />
        <Doc />
      </div>
    </div>
    <div className="c7n-workbench-right">
      <SelfIntro />
      <ServiceList />
      <EnvList />
    </div>
  </Page>
);

export default WorkBench;
