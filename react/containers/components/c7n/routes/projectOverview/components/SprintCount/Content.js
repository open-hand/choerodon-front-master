import React from 'react';
import {
  Tooltip, Icon, Spin,
} from 'choerodon-ui/pro';

import queryString from 'querystring';
import { observer } from 'mobx-react-lite';
import { get } from '@choerodon/inject';

import { useHistory } from 'react-router';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import { Loading } from '@choerodon/components';
import useQueryString from '@/hooks/useQueryString';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import { useSprintCountChartStore } from './stores';
import normalToSvg from '../number-font';
import './index.less';

import EmptyPage from '../EmptyPage';

const clsPrefix = 'c7n-project-overview-sprint-count';
const SprintCount = observer(() => {
  const { formatMessage } = useIntl();
  const { startSprintDs, startedRecord } = useProjectOverviewStore();
  const {
    sprintCountDataSet,
  } = useSprintCountChartStore();
  const history = useHistory();
  const urlParams = useQueryString();
  const {
    type, id, name, organizationId, category,
  } = urlParams;

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatMessage({ id: 'agile.projectOverview.issueStatus' })}</span>
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
        const ignoreStatusKeys = ['unassignCount'];
        const { count } = sprintCountDataSet.current.get(key);
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
                const statusIds = !ignoreStatusKeys.includes(key) ? sprintCountDataSet.current.get(key).statusIds ?? [] : [];
                const issueTypeIds = sprintCountDataSet.current.get(key).issueTypeIds ?? [];
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
                if (issueTypeIds.length > 0) {
                  search.issueTypeId = issueTypeIds.join(',');
                }

                history.push({
                  pathname: '/agile/work-list/issue',
                  search: queryString.stringify(search),
                });
              }}
            >
              {normalToSvg(count)}
            </h3>
            <div className={classnames(`${clsPrefix}-issue-progress`, `${clsPrefix}-issue-${key}`)}>
              <span className={`${clsPrefix}-issue-progress-inner`} style={{ width: `${(count > 0 ? count / total * 100 : 0)}%` }} />
            </div>
          </div>,
        );
      }
    }
    return progressArr;
  };

  function render() {
    if (startSprintDs.status === 'loading' || sprintCountDataSet.status === 'loading') {
      return <Loading display type={get('configuration.master-global:loadingType') || 'c7n'} />;
    }
    if (startedRecord) {
      return (
        <OverviewWrap.Content className={`${clsPrefix}-content`} style={{ padding: '0 .14rem' }}>
          {renderStatusProgress()}
        </OverviewWrap.Content>
      );
    }
    return <EmptyPage />;
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
