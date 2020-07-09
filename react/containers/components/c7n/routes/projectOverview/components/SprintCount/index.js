import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select, Progress, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import normalToSvg from '../number-font';
import './index.less';
import { EmptyPage } from '../EmptyPage';

const { Option } = Select;
const clsPrefix = 'c7n-project-overview-sprint-count';
const SprintCount = observer(({
}) => {
  const { sprintCountDataSet, projectOverviewStore } = useProjectOverviewStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>迭代问题统计</span>
      <Tooltip title="当前迭代各个工作项在不同状态下的数量统计。" placement="top">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip>
    </div>
  );
  const renderStatusProgress = () => {
    // 根据dataSet内的filed进行渲染
    const keys = sprintCountDataSet.current.fields.keys();
    const progressArr = [];
    for (const key of keys) {
      progressArr.push(<div className={`${clsPrefix}-issue`}>
        <span className={`${clsPrefix}-issue-name`}>{sprintCountDataSet.getField(key).pristineProps.label}</span>
        <h3 className={`${clsPrefix}-issue-number`}>{normalToSvg(sprintCountDataSet.current.get(key))}</h3>
        <Progress
          value={sprintCountDataSet.current.get(key) > 0 ? sprintCountDataSet.current.get(key) / sprintCountDataSet.current.get("total") * 100 : 0}
          className={`${clsPrefix}-issue-${key}`}
          strokeWidth={4}
          showInfo={false}
        />
      </div>)
    }
    return progressArr;
  };
  useEffect(() => {
    if(projectOverviewStore.getStaredSprint){
      sprintCountDataSet.query();
    }
  }, [projectOverviewStore.getStaredSprint]);
  function render() {
    if(projectOverviewStore.getStaredSprint && sprintCountDataSet.current){
      return renderStatusProgress();
    } else {
      return <EmptyPage imgHeight={80} imgWidth={100} />
    }
  }
  return (
    <OverviewWrap height={137}>
      <OverviewWrap.Header title={renderTitle()} />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        {render()}
      </OverviewWrap.Content>
    </OverviewWrap>
  );
});

export default SprintCount;
