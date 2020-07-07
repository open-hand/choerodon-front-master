import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Tooltip, Spin } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import moment from 'moment';
import OverviewWrap from '../OverviewWrap';
import { useDefectChartStore } from './stores';
import './index.less';
import { EmptyPage } from '../EmptyPage';
import { useProjectOverviewStore } from '../../stores';

const DefectChart = observer(() => {
  const clsPrefix = 'c7n-project-overview-defect-chart';
  const { defectChartStore } = useDefectChartStore();
  const { projectOverviewStore } = useProjectOverviewStore();
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState({ date: [], complete: [], create: [] });
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>缺陷累积趋势图</span>
    </div>

  );
  useEffect(() => {
    if (projectOverviewStore.getStaredSprint) {
      setLoading(true);
      defectChartStore.axiosGetChartData(projectOverviewStore.getStaredSprint.sprintId).then(() => {
        setLoading(false);
      });
    }
  }, [projectOverviewStore.getStaredSprint]);
  useEffect(() => {
    if (defectChartStore.getChartList) {
      let maps = new Map();
      defectChartStore.getChartList.completedList.forEach(obj => {
        const date = Object.keys(obj)[0].substring(5).replace(/-/g, '/');
        maps.set(date, { complete: Object.values(obj)[0], create: 0 })
      });
      defectChartStore.getChartList.createdList.forEach(obj => {
        const date = Object.keys(obj)[0].substring(5).replace(/-/g, '/');
        if (maps.has(date)) {
          const map = maps.get(date);
          maps.set(date, { ...map, create: Object.values(obj)[0] });
        } else {
          maps.set(date, { complete: 0, create: Object.values(obj)[0] });
        }
      });
      const chartDataArr = Array.from(maps);
      chartDataArr.sort(function (a, b) {
        return moment(a[0], 'MM/DD').isAfter(moment(b[0], 'MM/DD')) ? 1 : -1;
      })
      const date = [];
      const complete = [];
      const create = [];
      for (let i = 0; i < chartDataArr.length; i++) {
        const item = chartDataArr[i];
        date.push(item[0]);
        complete.push(item[1].complete);
        create.push(item[1].create);
      }
      setDataset({ date, complete, create });
    }
  }, [defectChartStore.getChartList]);
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
        source: dataset,
        dimensions: [
          { name: 'date', type: 'ordinal' },
          { name: 'create', type: 'number' },
          { name: 'complete', type: 'number' },
        ],
      },
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
          name: "累计修复缺陷",
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
      ]
    };

  }


  return (
    <OverviewWrap width="57%" height={302}>
      <OverviewWrap.Header title={renderTitle()} />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        <Spin spinning={loading}>
          {projectOverviewStore.getStaredSprint ? <Echart option={getOptions()} /> : <EmptyPage content="暂无活跃的冲刺" />}
        </Spin>
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default DefectChart;
