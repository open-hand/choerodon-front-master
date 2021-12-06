import React from 'react';
import { Button, Tooltip, Spin } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import { useIntl } from 'react-intl';
import { AnimationLoading } from '@choerodon/components';
import OverviewWrap from '../OverviewWrap';
import './index.less';
import EmptyPage from '../EmptyPage';
import { useProjectOverviewStore } from '../../stores';
import { useDefectChartStore } from './stores';

const DefectChart = observer(() => {
  const { formatMessage } = useIntl();
  const clsPrefix = 'c7n-project-overview-defect-chart';
  const { startedRecord, startSprintDs } = useProjectOverviewStore();
  const {
    defectCountDs,
  } = useDefectChartStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatMessage({ id: 'agile.projectOverview.bugTrend' })}</span>
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
        top: 0,
        zlevel: 5,
        right: '3.2%',
        data: [{
          name: formatMessage({ id: 'agile.projectOverview.newDefects' }),
          icon: 'line',
        }, {
          name: formatMessage({ id: 'agile.projectOverview.resolvedDefects' }),
          icon: 'line',
        }],
      },
      dataset: {
        source: defectCountDs.toData()[0] || [],
        dimensions: [
          { name: 'date', type: 'ordinal' },
          { name: 'create', type: 'number' },
          { name: 'complete', type: 'number' },
        ],
      },
      grid: {
        left: 5,
        right: 19,
        bottom: 10,
        top: 37,
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
      },
      yAxis: {
        name: formatMessage({ id: 'agile.projectOverview.bugs' }),
        nameTextStyle: {
          color: '#000',
        },
        minInterval: 1,
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
          name: formatMessage({ id: 'agile.projectOverview.newDefects' }),
          type: 'line',
          lineStyle: {
            color: 'rgba(244, 133, 144, 1)',
          },
          itemStyle: {
            normal: {
              color: 'rgba(244, 133, 144, 1)',
            },
          },
          symbol: 'circle',
        },
        {
          name: formatMessage({ id: 'agile.projectOverview.resolvedDefects' }),
          type: 'line',
          lineStyle: {
            // type: 'dotted',
            color: 'rgba(136, 223, 240, 1)',
          },
          itemStyle: {
            normal: {
              color: 'rgba(136, 223, 240, 1)',
            },
          },
          symbol: 'circle',
        },
      ],
    };
  }
  function render() {
    if (defectCountDs.status === 'loading' || startSprintDs.status === 'loading') {
      return <AnimationLoading display />;
    }
    if (startedRecord) {
      return (
        <OverviewWrap.Content className={`${clsPrefix}-content`}>
          <Echart option={getOptions()} style={{ height: '100%' }} />
        </OverviewWrap.Content>
      );
    }
    if (startSprintDs.status !== 'loading') {
      return <EmptyPage />;// 暂无活跃的冲刺"
    }
    return <AnimationLoading display />;
  }
  return (
    <OverviewWrap>
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      />
      {render()}
    </OverviewWrap>
  );
});

export default DefectChart;
