import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip, Spin, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import './index.less';
import OverviewWrap from '../OverviewWrap';
import WaterWave from './components/WaterWave';
import { useProjectOverviewStore } from '../../stores';
import { EmptyPage } from '../EmptyPage';
const clsPrefix = 'c7n-project-overview-sprint-water-wave';
const SprintWaterWave = observer(({
}) => {
  const [loading, setLoading] = useState(false);
  const { sprintWaterWaveDataSet, projectOverviewStore } = useProjectOverviewStore();
  function getOptions() {
    return {
      series: [{
        type: 'liquidFill',
        data: [0.6],
        center: ['28%', '50%'],
        radius: '50%',
        color: ['rgba(77, 144, 254, 1)', 'rgba(132, 195, 255, 1)'],
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderColor: 'rgba(132, 195, 255, 1)',
            borderWidth: 2,
          },
        },
        label: {
          show: false,
          color: 'red',

          normal: {
            color: 'rgba(132, 195, 255, 1)',
            // baseline: 'top',
            position: ['50%', '20%'],
            formatter: '{a|剩余时间}\n1{b|天}',
            rich: {
              a: {
                color: 'rgba(58,52,95,0.65)',
                lineHeight: 36,
                fontSize: 12,
              },
              b: {
                color: 'rgba(58,52,95,1)',
                lineHeight: 18,
                fontSize: 13,
              },
            },
            textStyle: {
              color: 'rgba(58,52,95,1)',
              fontSize: 24,
            },
          },
        },
        backgroundStyle: { // rgba(77, 144, 254, 1)
          // borderWidth: 1,
          color: 'rgba(255, 255, 255, 1)',
          itemStyle: {
            opacity: 0,
            shadowColor: 'red',
          },
        },
        itemStyle: {
          shadowColor: 'rgba(255, 255, 255, 0)',
        },
      }],

    };
  }
  useEffect(() => {
    if (projectOverviewStore.getStaredSprint) {
      setLoading(true);
      sprintWaterWaveDataSet.query().then(() => setLoading(false));
    }
  }, [projectOverviewStore.getIsFinishLoad]);
  function render() {

    if (!loading && sprintWaterWaveDataSet.current) {
      const remainingDays = sprintWaterWaveDataSet.current ? sprintWaterWaveDataSet.current.get('remainingDays') : 0;
      const totalDays = sprintWaterWaveDataSet.current ? sprintWaterWaveDataSet.current.get('totalDays') : 0;
      return <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <div className={`${clsPrefix}-content-left`}>
          {/* <Echart option={getOptions()} /> */}
          <WaterWave
            height={120}
            // color="rgba(77, 144, 254, 1)"
            title="剩余时间"
            percent={totalDays && remainingDays > 0 ? (totalDays - remainingDays) / totalDays * 100 : 100} // "totalDays": remainingDays
            percentRender={() => (
              <div className={`${clsPrefix}-percent`}>
                {sprintWaterWaveDataSet.current.get('remainingDays')}
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
      </OverviewWrap.Content>
    }
    return <EmptyPage content="暂无活跃的冲刺" />
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
        <Spin dataSet={sprintWaterWaveDataSet}>
          {render()}
        </Spin>

    </OverviewWrap>

  );
});

export default SprintWaterWave;
