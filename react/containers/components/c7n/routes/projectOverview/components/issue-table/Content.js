import React, { useState } from 'react';
import { Tooltip } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { Table, Tabs } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { get } from '@choerodon/inject';

import queryString from 'query-string';
import { Loading } from '@choerodon/components';
import { useIntl } from 'react-intl';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import StatusTag from './components/StatusTag';
import PriorityTag from './components/PriorityTag';
import TypeTag from './components/TypeTag';
import { useIssueTableChartStore } from './stores';
import './index.less';

const { TabPane } = Tabs;
const { Column } = Table;
function IssueTable({ dataSet, onClickSummary }) {
  return (
    <Table
      dataSet={dataSet}
      queryBar="none"
      className="c7n-project-overview-issue-table-content-table"
    >
      <Column
        name="summary"
        width={300}
        renderer={({ text: summary, record }) => (
          <Tooltip title={`概要：${summary}`}>
            <div
              role="none"
              style={{
                maxWidth: '250px',
                minWidth: '50px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              className="c7n-project-overview-issue-table-content-summary"
              onClick={() => onClickSummary({
                issueId: record.get('issueId'),
                issueNum: record.get('issueNum'),
              })}
            >
              {summary}
            </div>
          </Tooltip>
        )}
      />
      <Column
        name="issueNum"
        width={100}
        renderer={({ text, record }) => (
          <Tooltip mouseEnterDelay={0.5} title={`问题编号：${text}`}>
            <span style={{ color: 'rgba(0,0,0,.65)' }}>
              {/* <span> */}
              {text}
              {' '}
              {record.get('addIssue') ? '*' : ''}
              {/* </span> */}
            </span>
          </Tooltip>
        )}
      />
      <Column
        name="typeCode"
        width={100}
        renderer={({ record }) => {
          const issueTypeVO = record.get('issueTypeVO');
          return (
            <div>
              <Tooltip
                mouseEnterDelay={0.5}
                title={`任务类型： ${issueTypeVO.name}`}
              >
                <div>
                  <TypeTag
                    style={{ minWidth: 100 }}
                    data={issueTypeVO}
                    showName
                  />
                </div>
              </Tooltip>
            </div>
          );
        }}
      />
      <Column
        name="priority"
        width={100}
        renderer={({ record }) => {
          const priorityVO = record.get('priorityVO');
          return (
            <div
              style={{ display: 'flex', alignItems: 'center', height: '100%' }}
            >
              <Tooltip
                mouseEnterDelay={0.5}
                title={`优先级： ${priorityVO.name}`}
              >
                <div style={{ marginRight: 12 }}>
                  <PriorityTag style={{ minWidth: 40 }} priority={priorityVO} />
                </div>
              </Tooltip>
            </div>
          );
        }}
      />
      <Column
        name="status"
        // width={120}
        renderer={({ record }) => {
          const statusVO = record.get('statusVO');
          return (
            <div
              style={{ display: 'flex', alignItems: 'center', height: '100%' }}
            >
              <Tooltip
                mouseEnterDelay={0.5}
                title={`任务状态： ${statusVO.name}`}
              >
                <div>
                  <StatusTag
                    style={{ minWidth: 40, maxWidth: 110 }}
                    data={statusVO}
                  />
                </div>
              </Tooltip>
            </div>
          );
        }}
      />
      <Column
        name="remainingTime"
        // width={130}
        renderer={({ text, value }) => (
          <span
            style={{
              display: 'inline-block',
              minWidth: 15,
              color: 'rgba(0,0,0,.65)',
            }}
          >
            {`${isEmpty(value) ? '' : `${value}`}`}
          </span>
        )}
      />
      <Column
        name="storyPoints"
        // width={70}
        renderer={({ record, text }) => (
          <div style={{ minWidth: 15, color: 'rgba(0,0,0,.65)' }}>
            {record.get('typeCode') === 'story' ? text || '0' : ''}
          </div>
        )}
      />
    </Table>
  );
}
const DeployChart = () => {
  const { formatMessage } = useIntl();
  const clsPrefix = 'c7n-project-overview-issue-table';
  const {
    startSprintDs,
    startedRecord,
    history,
    AppState,
  } = useProjectOverviewStore();

  const {
    issueTableDs,
  } = useIssueTableChartStore();

  const [activeKey, setActiveKey] = useState('done');
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatMessage({ id: 'agile.projectOverview.sprintSituation' })}</span>
    </div>
  );
  const handleToIssue = ({ issueId, issueNum }) => {
    const {
      id: projectId,
      name,
      category,
      organizationId,
    } = AppState.currentMenuType;
    const params = {
      type: 'project',
      id: String(projectId),
      name,
      category,
      organizationId: String(organizationId),
      paramIssueId: issueId,
      paramName: issueNum,
    };
    window.open(`#/agile/work-list/issue?${queryString.stringify(params)}`);
  };
  const handleTabChange = (key) => {
    // const { sprintId } = this.state;
    setActiveKey(key);
    issueTableDs.setQueryParameter('status', key);
    issueTableDs.query();
    const ARRAY = {
      done: 'loadDoneIssues',
      undo: 'loadUndoIssues',
      undoAndNotEstimated: 'loadUndoAndNotEstimatedIssues',
    };
    // if (!this.state[key]) {
    //   this[ARRAY[key]](sprintId);
    // } else {
    //   this.setState({
    //     // eslint-disable-next-line react/no-access-state-in-setstate
    //     pagination: this.state[_.lowerFirst(_.trim(ARRAY[key], 'load'))].length > 10 ? { current: 1, pageSize: 10 } : false,
    //   });
    // }
  };
  function getContent() {
    if (startSprintDs.status === 'loading') {
      return <Loading display type={get('configuration.master-global:loadingType') || 'c7n'} />;
    }
    if (!startedRecord) {
      return <EmptyPage />;
    }
    return (
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          <TabPane tab={formatMessage({ id: 'agile.projectOverview.completedIssue' })} key="done">
            {/* <Table dataSet={issueTableDs}>
                  <Column name="summary" />
                </Table> */}
            <IssueTable dataSet={issueTableDs} onClickSummary={handleToIssue} />
            {/* {this.renderDoneIssues(column)} */}
          </TabPane>
          <TabPane tab={formatMessage({ id: 'agile.projectOverview.inCompletedIssue' })} key="unfinished">
            <IssueTable dataSet={issueTableDs} onClickSummary={handleToIssue} />

            {/* {this.renderUndoIssues(column)} */}
          </TabPane>
        </Tabs>
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
