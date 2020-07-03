import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select, Progress, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import normalToSvg from '../number-font';
import './index.less';

const { Option } = Select;
const clsPrefix = 'c7n-project-overview-sprint-count';
const SprintCount = observer(({
  issues = { complete: 10, todo: 10, uncompleted: 20, noAssignee: 5 },
}) => {
  const { sprintCountDataSet } = useProjectOverviewStore();
  const [selectValue, setSelectValue] = useState('exist');
  const handleChangeSelect = () => {
    // setSelectValue
  };
  const renderTitle = () => (
    <div>迭代问题统计
      <Tooltip title="当前迭代各个工作项在不同状态下的数量统计。">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip>

    </div>
  );
  const renderStatusProgress = (name = '22', issueCount = 3) => {

    const keys = sprintCountDataSet.current.fields.keys();
    const progressArr = [];

    for (const key of keys) {
      progressArr.push(<div className={`${clsPrefix}-issue`}>
        <span className={`${clsPrefix}-issue-name`}>{sprintCountDataSet.getField(key).pristineProps.label}</span>
        <h3 className={`${clsPrefix}-issue-number`}>{normalToSvg(sprintCountDataSet.current.get(key))}</h3>
        <Progress
          value={sprintCountDataSet.current.get(key) > 0 ? sprintCountDataSet.current.get(key) / sprintCountDataSet.current.get("total") *100 : 0}
          className={`${clsPrefix}-issue-${key}`}
          strokeWidth={4}
          showInfo={false}
        />
      </div>)
    }
    return progressArr;
  };
  return (
    sprintCountDataSet.current &&
    <OverviewWrap>
      <OverviewWrap.Header title={renderTitle()} />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        {renderStatusProgress()}
      </OverviewWrap.Content>

    </OverviewWrap>
  );
});

export default SprintCount;
