import React from 'react';
import {
  Tooltip, Progress, Icon, Spin,
} from 'choerodon-ui/pro';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import queryString from 'querystring';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router';
import useQueryString from '@/hooks/useQueryString';
import OverviewWrap from '../OverviewWrap';

import { useProjectOverviewStore } from '../../stores';
import normalToSvg from '../number-font';
import './index.less';

import EmptyPage from '../EmptyPage';

const clsPrefix = 'c7n-project-overview-sprint-count';
const SprintCount = observer(() => {
  const { sprintCountDataSet, startSprintDs, startedRecord } = useProjectOverviewStore();
  const history = useHistory();
  const urlParams = useQueryString();
  const {
    type, id, name, organizationId, category,
  } = urlParams;

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>迭代问题统计</span>
      <Tooltip title="当前迭代各个工作项在不同状态下的数量统计。" placement="top">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip>
    </div>
  );
  const renderStatusProgress = () => {
    const progressArr = [];
    // 根据dataSet内的filed进行渲染
    if (sprintCountDataSet.current) {
      const keys = sprintCountDataSet.current.fields.keys();
      const total = sprintCountDataSet.current.get('total');
      const sprint = sprintCountDataSet.current.get('sprintId');
      for (const key of keys) {
        const { label } = sprintCountDataSet.getField(key).pristineProps;
        const objectKey = ['completedCount', 'todoCount', 'uncompletedCount'];
        const count = objectKey.includes(key) ? sprintCountDataSet.current.get(key).count : sprintCountDataSet.current.get(key);
        const clickable = count > 0;
        progressArr.push(
          <div className={`${clsPrefix}-issue`}>
            <span className={`${clsPrefix}-issue-name`}>{label}</span>
            <h3
              role="none"
              className={`${clsPrefix}-issue-number ${clickable ? `${clsPrefix}-issue-number-clickable` : ''}`}
              onClick={() => {
                if (!clickable) {
                  return;
                }
                const statusIds = objectKey.includes(key) ? sprintCountDataSet.current.get(key).statusIds ?? [] : [];
                const search = {
                  type,
                  id,
                  name,
                  category,
                  organizationId,
                  sprint,
                  tableListMode: 'list',
                };
                if (statusIds.length > 0) {
                  search.statusId = statusIds.join(',');
                }
                if (key === 'unassignCount') {
                  search.assigneeId = '0';
                }
                history.push({
                  pathname: '/agile/work-list/issue',
                  search: queryString.stringify(search),
                });
              }}
            >
              {normalToSvg(count)}
            </h3>
            <Progress
              value={count > 0 ? count / total * 100 : 0}
              className={`${clsPrefix}-issue-${key}`}
              strokeWidth={4}
              showInfo={false}
            />
          </div>,
        );
      }
    }
    return progressArr;
  };

  function render() {
    if (startedRecord) {
      return (
        <Spin dataSet={sprintCountDataSet}>
          <OverviewWrap.Content className={`${clsPrefix}-content`} style={{ padding: '0 .14rem' }}>
            {renderStatusProgress()}
          </OverviewWrap.Content>
        </Spin>
      );
    } if (startSprintDs.status !== 'loading') {
      return <EmptyPage />;
    }
    return <LoadingBar display />;
  }

  return (
    <OverviewWrap>
      <OverviewWrap.Header
        titleMarginBottom={12}
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      />
      {render()}
    </OverviewWrap>
  );
});

export default SprintCount;
