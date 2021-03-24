import React, {
  useState, memo, useMemo, useEffect,
} from 'react';
import { Button, Spin, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import LoadingBar from '../../../../tools/loading-bar';

import './index.less';
import { useIssueTypeChartStore } from './stores';

const DeployChart = () => {
  const clsPrefix = 'c7n-project-overview-deploy-chart';
  const {
    startSprintDs,
    startedRecord,
  } = useProjectOverviewStore();

  const {
    issueTypeChartDs,
  } = useIssueTypeChartStore()

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>迭代问题类型分布</span>
    </div>
  );
  function getCategoryCount(code) {
    const issueTypeInfo = issueTypeChartDs.toData();
    const datas = [];
    const typeCodes = ['story', 'bug', 'task', 'sub_task'];
    for (let i = 0; i < typeCodes.length; i += 1) {
      const typeIndex = issueTypeInfo.findIndex((item) => item.typeCode === typeCodes[i]);
      if (typeIndex === -1) {
        datas[i] = 0;
      } else {
        const statusData = issueTypeInfo[typeIndex].issueStatus.filter((status) => (
          status.categoryCode === code
        ));
        if (statusData.length === 0) {
          datas[i] = 0;
        } else {
          datas[i] = statusData.reduce((sum, data) => sum + data.issueNum, 0);
        }
      }
    }
    return datas;
  }

  function getOption() {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        backgroundColor: '#fff',
        textStyle: {
          color: 'rgba(0,0,0,0.64)',
        },
        formatter: (params) => {
          let content = '';
          params.forEach((item) => {
            content = `<div>
            <span>${params[0].axisValue}</span>
            <br />
            <div style="font-size: 11px"><div style="display:inline-block; width: 10px; height: 10px; margin-right: 3px; border-radius: 50%; background:${params[0].color}"></div>处理中：${getCategoryCount('doing')[item.dataIndex]} ${getCategoryCount('doing')[item.dataIndex] ? ' 个' : ''}</div>
            <div style="font-size: 11px"><div style="display:inline-block; width: 10px; height: 10px; margin-right: 3px; border-radius: 50%; background:${params[1].color}"></div>待处理：${getCategoryCount('todo')[item.dataIndex]} ${getCategoryCount('todo')[item.dataIndex] ? ' 个' : ''}</div>
            <div style="font-size: 11px"><div style="display:inline-block; width: 10px; height: 10px; margin-right: 3px; border-radius: 50%; background:${params[2].color}"></div>已完成：${getCategoryCount('done')[item.dataIndex]} ${getCategoryCount('done')[item.dataIndex] ? ' 个' : ''}</div>
          </div>`;
          });
          return content;
        },
      },
      legend: {
        // orient: 'vertical',
        data: ['待处理', '处理中', '已完成'],
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 18,
        icon: 'rect',
        right: '10px',
        top: '-5px',
      },
      grid: {
        left: '10',
        top: '35px',
        right: '10px',
        // right: '28%',
        bottom: '14px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['故事', '缺陷', '任务', '子任务'],
        axisLabel: {
          margin: 15,
        },
      },
      yAxis: {
        name: '问题计数',
        minInterval: 1,
        nameTextStyle: {
          color: 'rgba(0,0,0,0.64)',
        },
        type: 'value',
        itemStyle: {
          color: 'rgba(0,0,0,0.64)',
        },
        splitLine: {
          // show: true,
          //  改变轴线颜色
          lineStyle: {
            // 使用深浅的间隔色
            color: 'rgba(0,0,0,0.12)',
          },
        },
      },
      axisLine: {
        lineStyle: {
          opacity: 0,
        },
      },
      axisTick: {
        lineStyle: {
          color: 'transparent',
        },
      },
      axisLabel: {
        color: 'rgba(0,0,0,0.64)',
      },
      series: [
        {
          name: '处理中',
          type: 'bar',
          stack: '计数',
          barCategoryGap: '28px',
          data: getCategoryCount('doing'),
          itemStyle: {
            color: '#45A3FC',
          },
          barWidth: 24,
        },
        {
          name: '待处理',
          type: 'bar',
          stack: '计数',
          data: getCategoryCount('todo'),
          itemStyle: {
            color: ' #FFB100',
          },
          barWidth: 24,

        },
        {
          name: '已完成',
          type: 'bar',
          stack: '计数',
          data: getCategoryCount('done'),
          itemStyle: {
            color: '#00BFA5',
          },
          barWidth: 24,

        },
      ],
    };
    return option;
  }

  function getContent() {
    if (startSprintDs.status === 'loading') {
      return <LoadingBar display />;
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

export default observer(DeployChart);
