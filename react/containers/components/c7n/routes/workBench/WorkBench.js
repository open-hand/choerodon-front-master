import React from 'react';
import { Content, Page } from '../../../../../index';
import StarTargetPro from "./components/StarTargetPro";
import WorkBenchAgile from './components/WorkBenchAgile';
import TodoThings from './components/TodoThings';
import SelfIntro from './components/SelfIntro';
import ServiceList from './components/ServiceList';

import './WorkBench.less';

const WorkBench = () => (
  <Page className="c7n-workbench">
    <div className="c7n-workbench-left">
      <Content style={{ paddingRight: 0 }}>
        <StarTargetPro />
        <WorkBenchAgile />
        <TodoThings />
      </Content>
    </div>
    <div className="c7n-workbench-right">
      <SelfIntro />
      <ServiceList />
    </div>
  </Page>
)

export default WorkBench;
