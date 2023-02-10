import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import { Loading } from '@zknow/components';
import { get } from '@choerodon/inject';

import { useIntl } from 'react-intl';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';

import './index.less';
import { useIssueTypeChartStore } from './stores';

const DeployChart = () => {
  const { formatMessage } = useIntl();
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
      <span>{formatMessage({ id: 'agile.projectOverview.issueTypeDistribution' })}</span>
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
        data: [formatMessage({ id: 'agile.projectOverview.pending' }), formatMessage({ id: 'agile.projectOverview.doing' }), formatMessage({ id: 'agile.projectOverview.complete' })],
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
        bottom: data.length > 8 ? 34 : 14, // 14
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
        name: formatMessage({ id: 'agile.projectOverview.issueCount' }),
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
          name: formatMessage({ id: 'agile.projectOverview.doing' }),
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
          name: formatMessage({ id: 'agile.projectOverview.pending' }),
          type: 'bar',
          stack: '计数',
          data: todoCountArr,
          itemStyle: {
            color: ' #FFB100',
          },
          barWidth: 24,

        },
        {
          name: formatMessage({ id: 'agile.projectOverview.complete' }),
          type: 'bar',
          stack: '计数',
          data: doneCountArr,
          itemStyle: {
            color: '#00BFA5',
          },
          barWidth: 24,

        },
      ],
      dataZoom: [{
        bottom: 0,
        show: data.length > 8,
        type: 'slider',
        height: 15,
        width: '85%',
        left: 60,
        startValue: 0,
        endValue: 7,
        zoomLock: true,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '100%',
        handleStyle: {
          color: '#fff',
          borderType: 'dashed',
          shadowBlur: 4,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },

      }],
    };
    return option;
  }, [getCategoryAndCategoryCount]);

  function getContent() {
    if (startSprintDs.status === 'loading') {
      return <Loading display type={get('configuration.master-global:loadingType') || 'c7n'} />;
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
