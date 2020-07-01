import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import OverviewWrap from '../OverviewWrap';

import './index.less';

const SagaChart = memo(() => {
  const options = useMemo(() => [{ value: 'todo', text: '提出' }, { value: 'complete', text: '解决' }], []);
  const clsPrefix = 'c7n-project-overview-saga-chart';
  const [charOption, setCharOption] = useState('todo'); // todo complete

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>事务执行情况</span>
    </div>
  );

  return (
    <OverviewWrap width="43%" height={302} marginRight=".2rem">
      <OverviewWrap.Header title={renderTitle()} />
    </OverviewWrap>
  );
});

export default SagaChart;
