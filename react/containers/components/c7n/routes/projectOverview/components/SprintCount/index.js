import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Select, Progress, Icon, Spin } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import normalToSvg from '../number-font';
import './index.less';
import EmptyPage from '../EmptyPage';

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
    const progressArr = [];
    // 根据dataSet内的filed进行渲染
    if (sprintCountDataSet.current) {
      const keys = sprintCountDataSet.current.fields.keys();
      for (const key of keys) {
        progressArr.push(<div className={`${clsPrefix}-issue`}>
          <span className={`${clsPrefix}-issue-name`}>{sprintCountDataSet.getField(key).pristineProps.label}</span>
          <h3 className={`${clsPrefix}-issue-number`}>{normalToSvg(sprintCountDataSet.current.get(key))}</h3>
          <Progress
            value={sprintCountDataSet.current.get(key) > 0 ? sprintCountDataSet.current.get(key) / sprintCountDataSet.current.get('total') * 100 : 0}
            className={`${clsPrefix}-issue-${key}`}
            strokeWidth={4}
            showInfo={false}
          />
                         </div>);
      }
    }
    return progressArr;
  };
  useEffect(() => {
    if (projectOverviewStore.getStaredSprint) {
      sprintCountDataSet.query();
    }
  }, [projectOverviewStore.getStaredSprint]);

  return (
    <OverviewWrap height={137}>
      <OverviewWrap.Header titleMarginBottom={12} title={renderTitle()} />
      {
        projectOverviewStore.getStaredSprint ? (
          <Spin dataSet={sprintCountDataSet}>
            <OverviewWrap.Content className={`${clsPrefix}-content`}>
              {renderStatusProgress()}
            </OverviewWrap.Content>
          </Spin>
        ) : <EmptyPage />
      }

    </OverviewWrap>
  );
});

export default SprintCount;
