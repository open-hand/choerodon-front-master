import React, { useState, memo, useEffect } from 'react';
import {
  Tooltip, Progress, Icon, Spin,
} from 'choerodon-ui/pro';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';

import { observer } from 'mobx-react-lite';
import OverviewWrap from '../OverviewWrap';

import { useProjectOverviewStore } from '../../stores';
import normalToSvg from '../number-font';
import './index.less';

import EmptyPage from '../EmptyPage';

const clsPrefix = 'c7n-project-overview-sprint-count';
const SprintCount = observer(() => {
  const { sprintCountDataSet, startSprintDs, startedRecord } = useProjectOverviewStore();
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
      // eslint-disable-next-line no-restricted-syntax
      for (const key of keys) {
        progressArr.push(
          <div className={`${clsPrefix}-issue`}>
            <span className={`${clsPrefix}-issue-name`}>{sprintCountDataSet.getField(key).pristineProps.label}</span>
            <h3 className={`${clsPrefix}-issue-number`}>{normalToSvg(sprintCountDataSet.current.get(key))}</h3>
            <Progress
              value={sprintCountDataSet.current.get(key) > 0 ? sprintCountDataSet.current.get(key) / sprintCountDataSet.current.get('total') * 100 : 0}
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
  useEffect(() => {
    if (startedRecord) {
      sprintCountDataSet.query();
    }
  }, [startedRecord]);

  function render() {
    if (startedRecord) {
      return (
        <Spin dataSet={sprintCountDataSet}>
          <OverviewWrap.Content className={`${clsPrefix}-content`}>
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
      <OverviewWrap.Header titleMarginBottom={12} title={renderTitle()} />
      {render()}
    </OverviewWrap>
  );
});

export default SprintCount;
