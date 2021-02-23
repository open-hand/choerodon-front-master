import React, {
  useState, memo, useMemo, useEffect,
} from 'react';
import { Button, Tooltip, Spin } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import OverviewWrap from '../OverviewWrap';
import './index.less';
import EmptyPage from '../EmptyPage';
import { useProjectOverviewStore } from '../../stores';

const DefectChart = observer(() => {
  const clsPrefix = 'c7n-project-overview-defect-chart';
  const { startedRecord, startSprintDs, defectCountDs } = useProjectOverviewStore();

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
              color: 'rgba(244, 133, 144, 1)',
            },
          },
          symbol: 'circle',
        },
        {
          name: '累计修复缺陷',
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
    if (startedRecord) {
      return (
        <OverviewWrap.Content className={`${clsPrefix}-content`}>
          <Spin spinning={defectCountDs.status === 'loading'}>
            <Echart option={getOptions()} style={{ height: '100%' }} />
          </Spin>
        </OverviewWrap.Content>
      );
    }
    if (startSprintDs.status !== 'loading') {
      return <EmptyPage />;// 暂无活跃的冲刺"
    }
    return <LoadingBar display />;
  }
  return (
    <OverviewWrap>
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '0 0 10px 10px',
        }}
      />
      {render()}
    </OverviewWrap>
  );
});

export default DefectChart;
