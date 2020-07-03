import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import OverviewWrap from '../OverviewWrap';

import './index.less';

const DefectChart = memo(() => {
  const clsPrefix = 'c7n-project-overview-defect-chart';
  const [charOption, setCharOption] = useState('todo'); // todo complete

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>缺陷累积趋势图</span>
    </div>

  );
  function getOptions() {
    return {
      tooltip: {
        trigger: 'axis',
        // trigger: 'item',

        backgroundColor: 'rgba(0,0,0,0.75)',
        textStyle: {
          color: '#FFF',
        },
        extraCssText: '0px 2px 8px 0px rgba(0,0,0,0.12);padding:15px 17px',
      },
      legend: {
        top: '-3px',
        zlevel: 5,
        right: '3.2%',
        data: [{
          name: '累计新增缺陷',
          icon: 'line',
        }, {
          name: '累计修复缺陷',
          icon: 'line',
        }],
      },
      // dataSet: {
      //   dimensions: [
      //     { name: 'date', type: 'ordinal' },
      //     { name: 'add', type: 'number' },
      //     { name: 'score', type: 'number' },
      //   ],
      //   source: [
      //     { date: '2020-08-09', add: 12, score: 12 },
      //     { date: '2020-08-10', add: 23, score: 22 },
      //     { date: '2020-08-11', add: 12, score: 15 },
      //     { date: '2020-08-12', add: 23, score: 12 }],
      // },
      grid: {
        y2: 35,

        left: 20,
        right: '40',
        containLabel: true,
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#eee',
          },
          onZero: true,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#eee'],
          },
        },
        axisLabel: {
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
          },
        },
        data: ['2020-08-09', '2020-08-09', '2020-08-09', '2020-08-09', '2020-08-09']
      },
      yAxis: {
        name: '缺陷数',
        nameTextStyle: {
          color: '#000',
        },
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#eee',
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#eee'],
          },
        },
        axisLabel: {
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
          },
        },
      },
      series: [
        {
          name: '累计新增缺陷',
          type: 'line',
          lineStyle: {
            color: 'rgba(244, 133, 144, 1)',
          },
          itemStyle: {
            normal: {
              color:'rgba(244, 133, 144, 1)',
            },
          },
          symbol: 'circle',
      
          data: [120, 132, 101, 134, 90]
        },
        {
          name: "累计修复缺陷",
          type: 'line',
          lineStyle: {
            // type: 'dotted',
            color: 'rgba(136, 223, 240, 1)',
          },
          itemStyle: {
            normal: {
              color:'rgba(136, 223, 240, 1)',
            },
          },
          symbol: 'circle',
      
          data: [220, 182, 191, 234, 290]
        },
      ]
    };

  }
  return (
    <OverviewWrap width="57%" height={302}>
      <OverviewWrap.Header title={renderTitle()} />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <Echart option={getOptions()} />
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default DefectChart;
