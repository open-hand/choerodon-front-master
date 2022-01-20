import React from 'react';
import { observer } from 'mobx-react-lite';
import { Loading } from '@choerodon/components';
import { useIntl } from 'react-intl';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import { usePriorityChartStore } from './stores';

import './index.less';

const DeployChart = () => {
  const { formatMessage } = useIntl();
  const clsPrefix = 'c7n-project-overview-priority-chart';
  const {
    startSprintDs,
    startedRecord,
  } = useProjectOverviewStore();

  const {
    priorityChartDs,
  } = usePriorityChartStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatMessage({ id: 'agile.projectOverview.priorityDistribution' })}</span>
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
      return <Loading display type="c7n" />;
    }
    if (!startedRecord) {
      return <EmptyPage />;
    }
    const priorityInfo = priorityChartDs.toData();
    return (
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <h3 className="title">
          {formatMessage({ id: 'agile.projectOverview.complete' })}
          /
          {formatMessage({ id: 'agile.projectOverview.allIssues' })}
        </h3>
        <div className="wrapper">
          {priorityInfo.map((priority) => renderList(priority))}
        </div>
      </OverviewWrap.Content>
    );
  }

  return (
    <OverviewWrap>
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      />
      {getContent()}
    </OverviewWrap>

  );
};

export default observer(DeployChart);
