/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { Tooltip, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import './index.less';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import OverviewWrap from '../OverviewWrap';
import WaterWave from './components/WaterWave';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import normalToSvg from '../number-font';
import { useSprintWaterChartStore } from './stores';

const clsPrefix = 'c7n-project-overview-sprint-water-wave';

const SprintWaterWave = observer(() => {
  const {
    startedRecord,
    startSprintDs,
  } = useProjectOverviewStore();

  const {
    sprintWaterWaveDataSet,
  } = useSprintWaterChartStore();

  function render() {
    const { current } = sprintWaterWaveDataSet;
    if (current) {
      const remainingDays = current.get('remainingDays') || 0;
      const totalDays = current.get('totalDays') || 0;
      return (
        <>
          <div className={`${clsPrefix}-content-left`}>
            <WaterWave
              height={120}
              title="剩余时间"
              percent={totalDays && remainingDays > 0 ? (remainingDays / totalDays) * 100 : 0} // "totalDays": remainingDays
              percentRender={() => (
                <div className={`${clsPrefix}-percent`}>
                  {normalToSvg(current ? current.get('remainingDays') : '', 20)}
                  <span>天</span>
                </div>
              )}
            />
          </div>
          <ul className={`${clsPrefix}-content-right`}>
            <li>
              <label>问题数</label>
              <span>
                {`${current.get('remainingIssueCount')}/${current.get('totalIssueCount')}`}
                (个)
              </span>
            </li>
            <li>
              <label>故事点</label>
              <span>
                {`${current.get('remainingStoryPoints')}/${current.get('totalStoryPoints')}`}
                (个)
              </span>
            </li>
            <li>
              <label>剩余工时</label>
              <span>
                {`${current.get('remainingEstimatedTime')}/${current.get('totalEstimatedTime')}`}
                (小时)
              </span>
            </li>
          </ul>
        </>
      );
    }
    if (startedRecord) {
      return <LoadingBar display />;
    }
    if (startSprintDs.status !== 'loading') {
      return <EmptyPage />;
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
    <OverviewWrap>
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        {render()}
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default SprintWaterWave;
