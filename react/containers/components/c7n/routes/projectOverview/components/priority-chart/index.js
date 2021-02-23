import React, {
  useState, memo, useMemo, useEffect,
} from 'react';
import { Button, Spin, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import LoadingBar from '../../../../tools/loading-bar';

import './index.less';

const DeployChart = () => {
  const clsPrefix = 'c7n-project-overview-priority-chart';
  const {
    startSprintDs,
    startedRecord,
    priorityChartDs,
  } = useProjectOverviewStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>优先级分布</span>
    </div>
  );

  function renderList(priority) {
    return (
      <div className="list" key={priority.priorityVO.id}>
        <div className="tip">
          {`${priority.completedNum}/${priority.totalNum}`}
        </div>
        <div className="body">
          <div>
            <span
              className={`${clsPrefix}-content-priority-tag`}
              style={{
                backgroundColor: `${priority.priorityVO ? priority.priorityVO.colour : '#FFFFFF'}1F`,
                color: priority.priorityVO ? priority.priorityVO.colour : '#FFFFFF',
              }}
            >
              {priority.priorityVO ? priority.priorityVO.name : '无'}
            </span>
          </div>
          <div className="progress">
            <div
              className="progress-bg"
              style={{ background: `${priority.priorityVO.colour}1F` }}
            />
            <div
              className="progress-inner"
              style={{
                background: priority.priorityVO.colour,
                width: `${priority.completedNum / priority.totalNum * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
  function getContent() {
    if (startSprintDs.status === 'loading') {
      return <LoadingBar display />;
    }
    if (!startedRecord) {
      return <EmptyPage />;
    }
    const priorityInfo = priorityChartDs.toData();
    return (
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <div className="lists">
          <h3 className="title">已完成/总计数</h3>
          <div className="wrapper">
            {priorityInfo.map((priority) => renderList(priority))}
          </div>
        </div>
      </OverviewWrap.Content>
    );
  }

  return (
    <OverviewWrap>
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '0 0 10px 10px',
        }}
      />
      {getContent()}
    </OverviewWrap>

  );
};

export default observer(DeployChart);
