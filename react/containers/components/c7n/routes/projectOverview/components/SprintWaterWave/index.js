import React, { useState, memo, useEffect } from 'react';
import { Tooltip, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import './index.less';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import OverviewWrap from '../OverviewWrap';
import WaterWave from './components/WaterWave';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import normalToSvg from '../number-font';

const clsPrefix = 'c7n-project-overview-sprint-water-wave';
const SprintWaterWave = observer(() => {
  const { sprintWaterWaveDataSet, projectOverviewStore } = useProjectOverviewStore();
  useEffect(() => {
    if (projectOverviewStore.getStaredSprint) {
      sprintWaterWaveDataSet.query();
    }
  }, [projectOverviewStore.getIsFinishLoad]);
  function render() {
    if (sprintWaterWaveDataSet.current) {
      const remainingDays = sprintWaterWaveDataSet.current ? sprintWaterWaveDataSet.current.get('remainingDays') : 0;
      const totalDays = sprintWaterWaveDataSet.current ? sprintWaterWaveDataSet.current.get('totalDays') : 0;
      return (
        <React.Fragment>
          <div className={`${clsPrefix}-content-left`}>
            <WaterWave
              height={120}
              // color="rgba(77, 144, 254, 1)"
              title="剩余时间"
              percent={totalDays && remainingDays > 0 ? ((totalDays - remainingDays) / totalDays) * 100 : 100} // "totalDays": remainingDays
              percentRender={() => (
                <div className={`${clsPrefix}-percent`}>
                  {normalToSvg(sprintWaterWaveDataSet.current ? sprintWaterWaveDataSet.current.get('remainingDays') : '', 20)}
                  <span>天</span>
                </div>
              )}
            />
          </div>
          <ul className={`${clsPrefix}-content-right`}>
            <li>
              <label>问题数</label>
              <span>{sprintWaterWaveDataSet.current.get('issueCount')}(个)</span>
            </li>
            <li>
              <label>故事点</label>
              <span>{sprintWaterWaveDataSet.current.get('storyPoints')}(个)</span>
            </li>
            <li>
              <label>剩余工时</label>
              <span>{sprintWaterWaveDataSet.current.get('remainingEstimatedTime')}(小时)</span>
            </li>
          </ul>
        </React.Fragment>
      );
    } else if (projectOverviewStore.getStaredSprint) {
      return <LoadingBar display />;
    } else if (!sprintWaterWaveDataSet.status !== 'loading' && projectOverviewStore.getIsFinishLoad) {
      return <EmptyPage content="暂无活跃的冲刺" />;
    }
    return '';
  }
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>冲刺未完成统计</span>
      <Tooltip title="统计当前迭代未完成的工作项数量、故事点数量、工时数量，以及当前迭代剩余天数。" placement="top">
        <Icon type="help" className={`${clsPrefix}-icon`} />
      </Tooltip>
    </div>
  );
  return (
    <OverviewWrap height={225}>
      <OverviewWrap.Header title={renderTitle()} />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        {render()}
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default SprintWaterWave;
