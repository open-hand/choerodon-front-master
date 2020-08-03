import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Spin, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import LoadingBar from '../../../../tools/loading-bar';

import './index.less';

const CommitChart = () => {
  const clsPrefix = 'c7n-project-overview-commit-chart';
  const {
    projectOverviewStore,
    commitDs,
  } = useProjectOverviewStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>迭代代码提交次数</span>
    </div>
  );

  function getOption() {
    const xAxis = commitDs.current ? commitDs.current.get('date') || [] : [];
    const yAxis = commitDs.current ? commitDs.current.get('count') || [] : [];
    const color = '#6887E8';
    const count = yAxis.reduce((sum, value) => sum + value, 0);
    return {
      title: {
        show: false,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.75)',
        textStyle: {
          color: '#fff',
        },
        extraCssText: '0px 2px 8px 0px rgba(0,0,0,0.12);padding:15px 17px',
        formatter(obj) {
          return `时间：${obj.name}<br/>提交次数：${obj.value}`;
        },
      },
      legend: {
        left: 'right',
        itemWidth: 14,
        itemGap: 20,
        formatter(nameCurrent) {
          // 在series中必须有对应的name，否则不显示
          return `${nameCurrent}：${count || 0} commits`;
        },
        selectedMode: false,
        textStyle: {
          color: '#3A345F',
        },
      },
      grid: {
        top: 33,
        left: 5,
        right: 10,
        bottom: xAxis.length > 0 ? 70 : 76,
        containLabel: true,
      },
      xAxis: {
        boundaryGap: false,
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
        data: xAxis,
      },
      yAxis: {
        name: '提交次数',
        min: Math.max(...yAxis) > 3 ? null : 0,
        max: Math.max(...yAxis) > 3 ? null : 4,
        minInterval: 1,
        nameTextStyle: {
          color: '#000',
          padding: [0, 0, 0, 10],
        },
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
        type: 'value',
      },
      series: [
        {
          data: yAxis,
          type: 'line',
          smooth: true,
          smoothMonotone: 'x',
          symbol: 'circle',
          itemStyle: {
            normal: {
              color,
            },
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 1, color: 'rgba(117, 137, 242, 0)', // 0% 处的颜色
              }, {
                offset: 0, color: 'rgba(117, 137, 242, 1)', // 100% 处的颜色
              }],
              global: false,
            },
          },
          lineStyle: {
            color,
          },
        },
        {
          name: '总提交次数',
          type: 'line',
          color: 'transparent',
          stack: 'total',
        },
      ],
    };
  }

  function getContent() {
    if (!projectOverviewStore.getIsFinishLoad) {
      return <LoadingBar display />;
    }
    if (!projectOverviewStore.getStaredSprint) {
      return <EmptyPage />;
    }
    return <Echart option={getOption()} />;
  }

  return (
    <OverviewWrap width="calc(57% - 20px)" height={302} marginRight=".2rem">
      <OverviewWrap.Header title={renderTitle()} />
      {getContent()}
    </OverviewWrap>
  );
};

export default observer(CommitChart);
