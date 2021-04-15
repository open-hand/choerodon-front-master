import React, { useCallback } from 'react';
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
  } = useIssueTypeChartStore();

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>迭代问题类型分布</span>
    </div>
  );
  const getCategoryAndCategoryCount = useCallback(() => {
    const issueTypeInfo = issueTypeChartDs.toData();
    const data = [];
    const xAxisData = [];
    issueTypeInfo?.forEach((item) => {
      const statusNum = { todo: 0, doing: 0, done: 0 };
      item.issueStatus?.forEach((status) => {
        statusNum[status.categoryCode] += status.issueNum;
      });
      xAxisData.push(item.name);
      data.push(statusNum);
    });
    return { data, xAxisData };
  }, [issueTypeChartDs]);

  const getOption = useCallback(() => {
    const { xAxisData, data } = getCategoryAndCategoryCount();
    const doingCountArr = data.map((i) => i.doing);
    const todoCountArr = data.map((i) => i.todo);
    const doneCountArr = data.map((i) => i.done);

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
            <div style="font-size: 11px"><div style="display:inline-block; width: 10px; height: 10px; margin-right: 3px; border-radius: 50%; background:${params[0].color}"></div>处理中：${doingCountArr[item.dataIndex]} ${doingCountArr[item.dataIndex] ? ' 个' : ''}</div>
            <div style="font-size: 11px"><div style="display:inline-block; width: 10px; height: 10px; margin-right: 3px; border-radius: 50%; background:${params[1].color}"></div>待处理：${todoCountArr[item.dataIndex]} ${todoCountArr[item.dataIndex] ? ' 个' : ''}</div>
            <div style="font-size: 11px"><div style="display:inline-block; width: 10px; height: 10px; margin-right: 3px; border-radius: 50%; background:${params[2].color}"></div>已完成：${doneCountArr[item.dataIndex]} ${doneCountArr[item.dataIndex] ? ' 个' : ''}</div>
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
        data: xAxisData,
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
          data: doingCountArr,
          itemStyle: {
            color: '#45A3FC',
          },
          barWidth: 24,
        },
        {
          name: '待处理',
          type: 'bar',
          stack: '计数',
          data: todoCountArr,
          itemStyle: {
            color: ' #FFB100',
          },
          barWidth: 24,

        },
        {
          name: '已完成',
          type: 'bar',
          stack: '计数',
          data: doneCountArr,
          itemStyle: {
            color: '#00BFA5',
          },
          barWidth: 24,

        },
      ],
    };
    return option;
  }, [getCategoryAndCategoryCount]);

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
