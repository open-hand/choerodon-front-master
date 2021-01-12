import React, {
  useState, memo, useMemo, useEffect,
} from 'react';
import { Button, Tooltip, Table } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import './index.less';
import { Spin, Icon } from 'choerodon-ui';
import moment from 'moment';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import OverviewWrap from '../OverviewWrap';
import IssueType from './components/IssueType';
import PriorityTag from './components/PriorityTag';
import StatusTag from './components/StatusTag';
import EmptyPage from '../EmptyPage';
import { useProjectOverviewStore } from '../../stores';

const { Column } = Table;

function calcDays(endDate, startDate) {
  return moment(endDate).diff(startDate, 'seconds') / 60 / 60 / 24;
}

const prefixCls = 'c7n-project-overview-delay-issue';
const DelayIssue = observer(() => {
  const [loading, setLoading] = useState(false);

  const renderSummary = ({
    value, text, name, record, dataSet,
  }) => (
    <div className={`${prefixCls}-summaryColumn`}>
      <span className={`${prefixCls}-summaryColumn-issueType`}><IssueType typeCode={record.get('issueTypeVO') && record.get('issueTypeVO').typeCode} /></span>
      <span className={`${prefixCls}-summaryColumn-issueNum`}>{record.get('issueNum')}</span>
      <Tooltip title={text}>
        <span className={`${prefixCls}-summaryColumn-summary`}>{text}</span>
      </Tooltip>
    </div>
  );

  const renderDelay = ({
    value, text, name, record, dataSet,
  }) => {
    const { issueEndDate } = record.data;
    let diffDays = 0;
    if (issueEndDate) {
      diffDays = calcDays(moment(), issueEndDate);
    }
    return (
      <div className={`${prefixCls}-delayColumn`}>
        {
          issueEndDate && (
            diffDays > 0 || (diffDays >= -1 || diffDays < 0)) && (
            <div className={`${prefixCls}-delayColumn-${diffDays > 0 ? 'delay' : 'soonDelay'}`}>
              {
              diffDays > 0 ? `延期${Math.ceil(diffDays)}天` : '即将到期'
            }
            </div>
          )
      }
      </div>
    );
  };

  const renderAssignee = ({
    value, text, name, record, dataSet,
  }) => {
    const { realName, loginName, imageUrl } = record.data;
    return (
      <div className={`${prefixCls}-assigneeColumn`}>
        <Tooltip title={`${realName} (${loginName})`} placement="top">
          <span
            className={`${prefixCls}-assigneeColumn-avatar`}
            style={{
              background: imageUrl ? `url(${imageUrl})` : '#b3bac5',
            }}
          >
            {!imageUrl && realName && realName.slice(0, 1)}
          </span>
          <span>{`${loginName} ${realName}`}</span>
        </Tooltip>
      </div>
    );
  };

  const { delayIssueDs, startedRecord } = useProjectOverviewStore();

  useEffect(() => {
    const loadDelayIssue = async () => {
      setLoading(true);
      await delayIssueDs.query();
      setLoading(false);
    };
    if (startedRecord) {
      loadDelayIssue();
    }
  }, [startedRecord]);

  return (
    <OverviewWrap>
      <OverviewWrap.Header title="任务延期情况" />
      <OverviewWrap.Content className={`${prefixCls}-content`}>
        <Spin spinning={loading}>
          {
              startedRecord ? (
                <Table dataSet={delayIssueDs} queryBar="none">
                  <Column name="summary" renderer={renderSummary} />
                  <Column name="delay" width={100} renderer={renderDelay} />
                  <Column name="assigneeId" width={130} renderer={renderAssignee} />
                  <Column
                    name="statusVO"
                    width={80}
                    renderer={({
                      value, text, name, record, dataSet,
                    }) => <span style={{ display: 'inline-block' }}><StatusTag {...record.get('statusVO')} /></span>}
                  />
                  <Column
                    name="priorityVO"
                    width={70}
                    renderer={({
                      value, text, name, record, dataSet,
                    }) => <span style={{ display: 'inline-block' }}><PriorityTag priority={record.get('priorityVO')} /></span>}
                  />
                </Table>
              ) : (
                <EmptyPage height={259} />
              )
            }
        </Spin>
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default DelayIssue;
