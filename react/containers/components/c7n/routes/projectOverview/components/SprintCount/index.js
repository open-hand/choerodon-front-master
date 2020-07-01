import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select, Progress, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import './index.less';
import OverviewWrap from '../OverviewWrap';

const { Option } = Select;
const SprintCount = memo(({
  issues = { complete: 10, todo: 10, uncompleted: 20, noAssignee: 5 },
}) => {
  const clsPrefix = 'c7n-project-overview-sprint-count';
  const [selectValue, setSelectValue] = useState('exist');
  const handleChangeSelect = () => {
    console.log('handleChangeSelect');
    // setSelectValue
  };
  const renderTitle = () => (
    <div>迭代问题统计
      <Tooltip title="当前迭代各个工作项在不同状态下的数量统计。">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip>

    </div>
  );
  const renderStatusProgress = (type, issueCount) => {
    if (type) {
      return (
        <div className={`${clsPrefix}-issue`}>
          <span className={`${clsPrefix}-issue-name`}>已完成</span>
          <h3 className={`${clsPrefix}-issue-number`}>{issueCount}</h3>
          <Progress
            value={40}
            strokeWidth={4}
            showInfo={false}
          />
        </div>
      );
    }
  };
  return (
    <OverviewWrap>
      <OverviewWrap.Header title={renderTitle()} />
      {renderStatusProgress('complete', issues.complete)}
    </OverviewWrap>
  );
});

export default SprintCount;
