import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import moment from 'moment';
import OverviewWrap from '../OverviewWrap';
import DaysPicker from '../days-picker';

import './index.less';

const SagaChart = memo(() => {
  const options = useMemo(() => [{ value: 'todo', text: '提出' }, { value: 'complete', text: '解决' }], []);
  const clsPrefix = 'c7n-project-overview-saga-chart';
  const [charOption, setCharOption] = useState('todo'); // todo complete

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>事务执行情况</span>
    </div>
  );

  function loadData(days = 7) {
    const startTime = moment().subtract(days, 'days').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
  }

  function getOption() {
    const xAxis = ['2020-06-25', '2020-06-26', '2020-06-27', '2020-06-28', '2020-06-29', '2020-06-30', '2020-07-01', '2020-07-02'];
    const yAxis = [20, 50, 10, 20, 30, 20, 5, 15];
    const color = '#F48590';
    const count = yAxis.reduce((sum, value) => sum + value, 0);
    return {
      grid: {
        top: 33,
        left: 5,
        right: 18,
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.75)',
        textStyle: {
          color: '#FFF',
        },
        extraCssText: '0px 2px 8px 0px rgba(0,0,0,0.12);padding:15px 17px',
        // formatter(params) {
        //   return `
        //     日期: ${`${xAxis[0].split('-')[0]}-${params[0].name}`}</br>
        //     事务失败率: ${percentage[params[0].dataIndex]}%</br>
        //     失败次数: ${params[0].value}</br>
        //     总次数: ${totalCount[params[0].dataIndex]}
        //   `;
        // },
        formatter(obj) {
          return `时间：${obj.name}<br/>失败次数：${obj.value}`;
        },
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
        data: xAxis,
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
          formatter(item, idx) {
            return item
              .split('-')
              .slice(1)
              .join('/');
          },
        },
      },
      yAxis: {
        nameTextStyle: {
          color: 'rgba(0,0,0,1)',
        },
        name: '失败次数',
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
      series: [{
        data: yAxis,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 1, color: 'rgba(244, 133, 144, 0)', // 0% 处的颜色
            }, {
              offset: 0, color: 'rgba(244, 133, 144, 1)', // 100% 处的颜色
            }],
          },
        },
        itemStyle: {
          normal: {
            color,
          },
        },
      }],
    };
  }

  return (
    <OverviewWrap width="43%" height={302} marginRight=".2rem">
      <OverviewWrap.Header title={renderTitle()}>
        <DaysPicker handleChangeDays={loadData} />
      </OverviewWrap.Header>
      <Echart
        option={getOption()}
        style={{ height: '280px' }}
      />
    </OverviewWrap>
  );
});

export default SagaChart;
