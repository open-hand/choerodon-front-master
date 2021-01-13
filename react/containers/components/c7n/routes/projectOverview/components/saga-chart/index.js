import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Tooltip, Spin } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import OverviewWrap from '../OverviewWrap';
import DaysPicker from '../days-picker';
import { useProjectOverviewStore } from '../../stores';

import './index.less';

const SagaChart = () => {
  const clsPrefix = 'c7n-project-overview-saga-chart';
  const {
    asgardDs,
  } = useProjectOverviewStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>事务执行情况</span>
    </div>
  );

  function loadData(days = 7) {
    asgardDs.setQueryParameter('date', days);
    asgardDs.query();
  }

  function getOption() {
    const color = '#F48590';
    const date = asgardDs.current ? asgardDs.current.get('date') : [];
    const failureCount = asgardDs.current ? asgardDs.current.get('failureCount') : [];
    const percentage = asgardDs.current ? asgardDs.current.get('percentage') : [];
    const totalCount = asgardDs.current ? asgardDs.current.get('totalCount') : [];

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
        formatter(params) {
          return `
            日期: ${params.name}</br>
            事务失败率: ${percentage[params.dataIndex]}%</br>
            失败次数: ${params.value}</br>
            总次数: ${totalCount[params.dataIndex]}
          `;
        },
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
        data: date,
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
        data: failureCount,
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
    <OverviewWrap>
      <OverviewWrap.Header title={renderTitle()}>
        <DaysPicker handleChangeDays={loadData} />
      </OverviewWrap.Header>
      <Spin spinning={asgardDs.status === 'loading'}>
        <Echart
          option={getOption()}
          style={{ height: '100%' }}
        />
      </Spin>
    </OverviewWrap>
  );
};

export default observer(SagaChart);
