import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import './index.less';
import { Spin, Icon } from 'choerodon-ui';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import OverviewWrap from '../OverviewWrap';
import IssueType from './components/IssueType';
import PriorityTag from './components/PriorityTag';
import StatusTag from './components/StatusTag';
import { useDelayIssueStore } from './stores';

const prefixCls = 'c7n-project-overview-delay-issue';
const DelayIssue = observer(() => {
  const [loading, setLoading] = useState();
  console.log('useDelayIssueStore()', useDelayIssueStore());
  const { delayIssueStore } = useDelayIssueStore();

  const renderIssue = (issueData = {}) => {
    const { realName, loginName, imageUrl } = issueData;
    const status = {};
    return (
      <div className={`${prefixCls}-item`}>
        <IssueType typeCode="story" />
        <span role="none" className={`${prefixCls}-item-summary`}>#238 添加成员按钮点击失效添加成员按</span>
        <div className={`${prefixCls}-item-days`}>
          延期13天
        </div>
        <Tooltip title={`${realName} (${loginName})`} placement="top">
          <span
            className={`${prefixCls}-item-avatar`}
            style={{
              backgroundImage: imageUrl ? `url(${imageUrl})` : '',
            }}
          >
            {!imageUrl && realName && realName.slice(0, 1)}
          </span>
          <span>{`${realName} (${loginName})`}</span>
        </Tooltip>
        <StatusTag />
        <PriorityTag />
        <div />
      </div>
    );
  };
  return (
    <OverviewWrap width="57%" height={428}>
      <OverviewWrap.Header title="任务延期情况" />
      <OverviewWrap.Content className={`${prefixCls}-content`}>
        <Spin spinning={loading}>
          {delayIssueStore.getList.map(item => renderIssue(item))}
        </Spin>
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default DelayIssue;
