import React from 'react';
import { Content, Page } from '../../../../../index';
import StarTargetPro from './components/StarTargetPro';
import WorkBenchAgile from './components/WorkBenchAgile';
import SelfIntro from './components/SelfIntro';
import ServiceList from './components/ServiceList';
import Card from './components/card';
import Doc from './components/doc';
import EnvList from './components/EnvList';
import QuickLink from './components/WorkBenchAgile/components/QuickLink';

import './WorkBench.less';

const WorkBench = () => (
  <Page className="c7n-workbench">
    <div className="c7n-workbench-left">
      <Content style={{ paddingRight: 0 }}>
        <StarTargetPro />
        <WorkBenchAgile />
        <div style={{ display: 'flex' }}>
          <QuickLink />
          <Card
            title="文档"
            showLink
            pathname="/ddd"
            className="c7n-workbench-doc"
          >
            <Doc />
          </Card>
        </div>
      </Content>
    </div>
    <div className="c7n-workbench-right">
      <SelfIntro />
      <ServiceList />
      <EnvList />
    </div>
  </Page>
);

export default WorkBench;
