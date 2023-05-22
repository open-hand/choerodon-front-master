import React, {
  useEffect, useCallback,
} from 'react';
import {
  Select, CheckBox, Spin,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import { get as choerodonGet } from '@choerodon/inject';
import { get } from 'lodash';
import { Loading } from '@zknow/components';
import { useIntl } from 'react-intl';
import { localPageCacheStore } from '@/containers/stores/c7n/LocalPageCacheStore';
import { useBurnDownChartStore } from './stores';
import './index.less';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';

import EmptyPage from '../EmptyPage';

const { Option } = Select;
const BurnDownChart = observer(() => {
  const { formatMessage } = useIntl();
  const clsPrefix = 'c7n-project-overview-burn-down-chart';
  const {
    burnDownChartStore,
    chartDs,
    loadBurnDownData,
  } = useBurnDownChartStore();

  const {
    startedRecord,
    startSprintDs,
  } = useProjectOverviewStore();

  useEffect(() => {
    if (startedRecord) {
      loadBurnDownData();
    }
  }, [startedRecord]);

  const {
    selectValue,
    setSelectValue,
    checkedValue,
    setCheckedValue,
  } = burnDownChartStore;

  function handleSelect(value) {
    setSelectValue(value);
    localPageCacheStore.setItem('project.overview.selectType', value);
    chartDs.setQueryParameter('selectType', value);
    chartDs.query();
  }

  function handleCheckValueSelect(value) {
    setCheckedValue(value);
    chartDs.setQueryParameter('checkedValue', value);
    chartDs.query();
  }

  function renderChartTitle() {
    let result = '';
    if (selectValue === 'remainingEstimatedTime') {
      result = formatMessage({ id: 'agile.projectOverview.remainingTime' });
    }
    if (selectValue === 'storyPoints') {
      result = formatMessage({ id: 'agile.projectOverview.storyPoints' });
    }
    if (selectValue === 'issueCount') {
      result = formatMessage({ id: 'agile.projectOverview.issueCount' });
    }
    return result;
  }

  function getOption() {
    if (!chartDs.length) {
      return {};
    }
    const {
      xAxis,
      exportAxis,
      yAxis,
      markArea,
    } = chartDs.toData()[0];

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        textStyle: {
          color: '#000',
        },
        extraCssText:
          'box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2); border: 1px solid #ddd; border-radius: 0;',
        formatter(params) {
          let content = '';
          let unit = '';
          let titleContent = '';
          let remainingContent = '';
          let estimatedContent = '';
          params.forEach((item) => {
            if (item.seriesName === '剩余值') {
              if (item.value && selectValue === 'remainingEstimatedTime') {
                unit = ' 小时';
              }
              if (item.value && selectValue === 'storyPoints') {
                unit = ' 点';
              }
              if (item.value && selectValue === 'issueCount') {
                unit = ' 个';
              }
              titleContent = `${item.axisValue || '冲刺开启'}<br />`;
              remainingContent = `${item.marker}${item.seriesName} : ${(item.value || item.value === 0) ? item.value : '-'}${unit && unit}<br/>`;
            }
            if (item.seriesName === '期望值') {
              if (item.value && selectValue === 'remainingEstimatedTime') {
                unit = ' 小时';
              }
              if (item.value && selectValue === 'storyPoints') {
                unit = ' 点';
              }
              if (item.value && selectValue === 'issueCount') {
                unit = ' 个';
              }
              estimatedContent = `${item.marker}${item.seriesName} : ${(item.value || item.value === 0) ? (unit !== ' 个' ? item.value.toFixed(1) * 1 : Math.round(item.value)) : '-'}${unit && unit}`;
            }
          });
          if (remainingContent.length !== 0 || estimatedContent.length !== 0) {
            content = `${titleContent}${remainingContent}${estimatedContent}`;
          }
          return content;
        },
      },
      legend: {
        top: 0,
        right: 15,
        data: [{
          name: formatMessage({ id: 'agile.projectOverview.guideline' }),
          icon: 'line',
        }, {
          name: formatMessage({ id: 'agile.projectOverview.remainingValues' }),
          icon: 'line',
        }],
      },
      grid: {
        top: 40,
        bottom: 10,
        left: 5,
        right: 16,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis,
        axisTick: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#eee',
          },
        },
        axisLabel: {
          show: true,
          // eslint-disable-next-line radix
          interval: parseInt(get(xAxis, 'length') / 7) ? parseInt(get(xAxis, 'length') / 7) - 1 : 0,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
            fontStyle: 'normal',
          },
        },
        splitLine: {
          show: true,
          onGap: false,
          interval: 0,
          lineStyle: {
            color: ['#eee'],
          },
        },
      },
      yAxis: {
        name: renderChartTitle(),
        nameTextStyle: {
          color: '#000',
          padding: [0, 0, 0, 20],
        },
        nameGap: 22,
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eee',
            type: 'solid',
            width: 1,
          },
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
        axisLabel: {
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
          },
          formatter(value, index) {
            if (selectValue === 'remainingEstimatedTime' && value) {
              return `${value}h`;
            }
            return value;
          },
        },
      },
      series: [
        {
          symbol: 'none',
          name: formatMessage({ id: 'agile.projectOverview.guideline' }),
          type: 'line',
          data: exportAxis,
          itemStyle: {
            color: 'rgba(0,0,0,0.65)',
          },
          lineStyle: {
            type: 'dotted',
            color: 'rgba(0,0,0,0.65)',
          },
        },
        {
          symbol: 'none',
          name: '非工作区',
          type: 'line',
          // data: exportAxis,
          itemStyle: {
            color: 'rgba(0,0,0,0.65)',
          },
          lineStyle: {
            type: 'dotted',
            color: 'rgba(0,0,0,0.65)',
          },
          markArea: {
            itemStyle: {
              color: 'rgba(235,235,235,0.65)',
            },
            emphasis: {
              itemStyle: {
                color: 'rgba(220,220,220,0.65)',
              },
            },
            data: markArea,
          },
        },
        {
          symbol: 'none',
          name: formatMessage({ id: 'agile.projectOverview.remainingValues' }),
          type: 'line',
          itemStyle: {
            color: '#4D90FE',
          },
          // stack: '总量',
          data: yAxis,
        },
      ],
    };
  }

  function render() {
    if (!chartDs.status === 'loading' || startSprintDs.status === 'loading') {
      return <Loading display type={choerodonGet('configuration.master-global:loadingType') || 'c7n'} />;
    }
    if (startedRecord) {
      return <Echart option={getOption()} style={{ height: '100%' }} />;
    }
    if (startSprintDs.status !== 'loading') {
      return <EmptyPage height={259} />;
    }
    return '';
  }

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatMessage({ id: 'agile.projectOverview.burndown' })}</span>
      {startedRecord ? (
        <>
          <Select
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            style={{ width: 100, marginLeft: 34 }}
            className="c7n-project-overview-SelectTheme"
            label="单位"
            clearButton={false}
            value={selectValue}
            onChange={handleSelect}
          >
            <Option value="remainingEstimatedTime">{formatMessage({ id: 'agile.projectOverview.remainingTime' })}</Option>
            <Option value="storyPoints">{formatMessage({ id: 'agile.projectOverview.storyPoints' })}</Option>
            <Option value="issueCount">{formatMessage({ id: 'agile.projectOverview.issueCount' })}</Option>
          </Select>
          <CheckBox
            style={{ marginLeft: 24 }}
            checked={checkedValue}
            onChange={handleCheckValueSelect}
          >
            {formatMessage({ id: 'agile.projectOverview.show.Non-Working.days' })}
          </CheckBox>
        </>
      )
        : ''}
    </div>
  );

  return (
    <OverviewWrap style={{
      paddingTop: '16px',
    }}
    >
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '2px 0 10px 4px',
        }}
      />
      <OverviewWrap.Content className={`${clsPrefix}-content`}>
        {render()}
      </OverviewWrap.Content>
    </OverviewWrap>

  );
});

export default BurnDownChart;
