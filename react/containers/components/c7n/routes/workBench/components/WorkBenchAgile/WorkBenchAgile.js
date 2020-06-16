import React, {Content} from 'react';
import TodoQuestion from './components/TodoQuestion';

import './index.less';
import TodoThings from "@/containers/components/c7n/routes/workBench/components/TodoThings";

const WorkBenchAgile = () => (
  <div className="c7n-workbenchAgile">
    <TodoQuestion />
    <TodoThings />
  </div>
)

export default WorkBenchAgile;
