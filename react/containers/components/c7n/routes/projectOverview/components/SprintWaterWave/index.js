import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import './index.less';
import OverviewWrap from '../OverviewWrap';
import WaterWave from './components/WaterWave';

const SprintPie = memo(({
  imageUrl,
  realName = '王王王',
  roles = ['admin', 'admin'],
}) => {
  const clsPrefix = 'c7n-project-overview-sprint-water-wave';
  const [url, setUrl] = useState(0);
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

  return (
    <OverviewWrap>
      <OverviewWrap.Header title="冲刺未完成情况" />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <div className={`${clsPrefix}-content-left`}>
          {/* <Echart option={getOptions()} /> */}
          <WaterWave
            height={161}
            title="剩余时间"
            percent={36}
            percentRender={() => (
              <div className={`${clsPrefix}-percent`}>
                1
                <span>天</span>
              </div>
            )}
          />
        </div>
        <ul className={`${clsPrefix}-content-right`}>
          <li>
            <label>问题数</label>
            <span>30(个)</span>
          </li>
          <li>
            <label>故事点</label>
            <span>30(个)</span>
          </li>
          <li>
            <label>剩余工时</label>
            <span>30(个)</span>
          </li>
        </ul>
      </OverviewWrap.Content>

    </OverviewWrap>

  );
});

export default SprintPie;
