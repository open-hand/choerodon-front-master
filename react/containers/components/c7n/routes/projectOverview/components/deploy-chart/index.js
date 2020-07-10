import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Spin, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import LoadingBar from '../../../../tools/loading-bar';

import './index.less';

const DeployChart = () => {
  const clsPrefix = 'c7n-project-overview-deploy-chart';
  const {
    projectOverviewStore,
    deployDs,
  } = useProjectOverviewStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>迭代部署次数</span>
    </div>
  );

  function getOption() {
    const xAxis = ['2020-06-25', '2020-06-26', '2020-06-27', '2020-06-28', '2020-06-29', '2020-06-30', '2020-07-01', '2020-07-02'];
    const yAxis = [20, 50, 10, 20, 30, 20, 5, 15];
    const color = '#7589F2';
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
          return `时间：${obj.name}<br/>部署次数：${obj.value}`;
        },
      },
      legend: {
        left: 'right',
        itemWidth: 14,
        itemGap: 20,
        formatter(nameCurrent) {
          // 在series中必须有对应的name，否则不显示
          return `${nameCurrent}：${count || 0}`;
        },
        selectedMode: false,
        textStyle: {
          color: '#3A345F',
        },
      },
      grid: {
        top: 33,
        left: 5,
        right: 18,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        interval: 0,
        axisTick: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#eee',
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
        name: '部署次数',
        min: Math.max(...yAxis) > 3 ? null : 0,
        max: Math.max(...yAxis) > 3 ? null : 4,
        minInterval: 1,
        nameTextStyle: {
          color: '#000',
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
          type: 'bar',
          itemStyle: {
            color,
            barBorderRadius: [5, 5, 0, 0],
          },
          barWidth: 10,
          stack: 'total',
        },
        {
          name: '总部署次数',
          type: 'bar',
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
    <OverviewWrap width="43%" height={302}>
      <OverviewWrap.Header title={renderTitle()} />
      {getContent()}
    </OverviewWrap>

  );
};

export default observer(DeployChart);
