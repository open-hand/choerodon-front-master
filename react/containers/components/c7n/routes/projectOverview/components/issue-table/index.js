import React, {
  useState, memo, useMemo, useEffect,
} from 'react';
import {
  Tooltip, Pagination,
} from 'choerodon-ui';
import { isEmpty } from 'lodash';
import {
  Table, Button, Spin, DataSet, Tabs,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import LoadingBar from '../../../../tools/loading-bar';
import StatusTag from './StatusTag';
import PriorityTag from './PriorityTag';
import TypeTag from './TypeTag';
import './index.less';

const { TabPane } = Tabs;
const { Column } = Table;
function IssueTable({ dataSet }) {
  return (
    <Table dataSet={dataSet} queryBar="none">
      <Column
        name="summary"
        width={200}
        renderer={({ text: summary }) => (
          <Tooltip title={`概要：${summary}`}>
            <div
              role="none"
              style={{
                maxWidth: '250px', minWidth: '50px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
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
            <span>
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
              <Tooltip mouseEnterDelay={0.5} title={`任务类型： ${issueTypeVO.name}`}>
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
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Tooltip mouseEnterDelay={0.5} title={`优先级： ${priorityVO.name}`}>
                <div style={{ marginRight: 12 }}>
                  <PriorityTag
                    style={{ minWidth: 40 }}
                    priority={priorityVO}
                  />
                </div>
              </Tooltip>
            </div>
          );
        }}
      />
      <Column
        name="status"
        width={120}
        renderer={({ record }) => {
          const statusVO = record.get('statusVO');
          return (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Tooltip mouseEnterDelay={0.5} title={`任务状态： ${statusVO.name}`}>
                <div>
                  <StatusTag
                    style={{ minWidth: 40, width: 50 }}
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
        // width={90}
        renderer={({ text, value }) => <span style={{ display: 'inline-block', minWidth: 15 }}>{`${isEmpty(value) ? '' : (`${value}`)}`}</span>}
      />
      <Column
        name="storyPoints"
        // width={70}
        renderer={({ record, text }) => (
          <div style={{ minWidth: 15 }}>
            {record.get('typeCode') === 'story' ? text || '0' : ''}
          </div>
        )}
      />

    </Table>
  );
}
const DeployChart = () => {
  const clsPrefix = 'c7n-project-overview-issue-table';
  const {
    startSprintDs,
    startedRecord,
    issueTableDs,
  } = useProjectOverviewStore();
  const [activeKey, setActiveKey] = useState('done');
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>冲刺详情</span>
    </div>
  );

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
  console.log('issueTableDs..', issueTableDs);
  function getContent() {
    if (startSprintDs.status === 'loading') {
      return <LoadingBar display />;
    }
    if (!startedRecord) {
      return <EmptyPage />;
    }
    return (
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <div className="c7n-SprintDetails">
          <div className="c7n-SprintDetails-tabs">

            <Tabs activeKey={activeKey} onChange={handleTabChange}>
              <TabPane tab="已完成的问题" key="done">
                {/* <Table dataSet={issueTableDs}>
                  <Column name="summary" />
                </Table> */}
                <IssueTable dataSet={issueTableDs} />
                {/* {this.renderDoneIssues(column)} */}
              </TabPane>
              <TabPane tab="未完成的问题" key="unfinished">
                <IssueTable dataSet={issueTableDs} />

                {/* {this.renderUndoIssues(column)} */}
              </TabPane>
              <TabPane tab="未完成的未预估问题" key="unfinished">
                <IssueTable dataSet={issueTableDs} />

                {/* {getTable()} */}
                {/* {this.renderUndoAndNotEstimatedIssues(column)} */}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </OverviewWrap.Content>
    );
  }
  return (
    <OverviewWrap>
      <OverviewWrap.Header title={renderTitle()} />
      {getContent()}

    </OverviewWrap>

  );
};

export default observer(DeployChart);
