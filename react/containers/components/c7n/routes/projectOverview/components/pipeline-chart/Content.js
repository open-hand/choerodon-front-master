import React from 'react';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import { AnimationLoading } from '@choerodon/components';
import { useIntl } from 'react-intl';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';

import './index.less';
import { usePipelineChartStore } from './stores';

const PipelineChart = () => {
  const { formatMessage } = useIntl();
  const clsPrefix = 'c7n-project-overview-pipeline-chart';
  const {
    startedRecord,
    startSprintDs,
  } = useProjectOverviewStore();

  const {
    pipelineDs,
  } = usePipelineChartStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatMessage({ id: 'agile.projectOverview.pipeline' })}</span>
    </div>
  );

  function getOption() {
    const xAxis = pipelineDs.current ? pipelineDs.current.get('date') || [] : [];
    const yAxis = pipelineDs.current ? pipelineDs.current.get('count') || [] : [];
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
          return `时间：${obj.name}<br/>触发次数：${obj.value}`;
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
        bottom: xAxis.length ? 10 : 16,
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
        name: formatMessage({ id: 'agile.projectOverview.trigger.times' }),
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
          name: formatMessage({ id: 'agile.projectOverview.total.trigger.times' }),
          type: 'line',
          color: 'transparent',
          stack: 'total',
        },
      ],
    };
  }

  function getContent() {
    if (startSprintDs === 'loading') {
      return <AnimationLoading display />;
    }
    if (!startedRecord) {
      return <EmptyPage />;
    }
    return <Echart option={getOption()} style={{ height: '100%' }} />;
  }

  return (
    <OverviewWrap>
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      />
      {getContent()}
    </OverviewWrap>
  );
};

export default observer(PipelineChart);
