import React from 'react';
import TodoThings from '@/containers/components/c7n/routes/workBench/components/TodoThings';
import TodoQuestion from '@/containers/components/c7n/routes/workBench/components/TodoQuestion';

import './index.less';

const WorkBenchAgile = () => (
  <div className="c7n-workbenchAgile">
    <TodoQuestion />
    <TodoThings />
  </div>
);

export default WorkBenchAgile;
