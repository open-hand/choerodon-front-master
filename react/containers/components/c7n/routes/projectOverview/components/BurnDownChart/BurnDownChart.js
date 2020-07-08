import React, { useState, memo, useEffect } from 'react';
import { Button, Select, CheckBox, Spin, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { useBurnDownChartStore } from './stores';
import './index.less';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import { EmptyPage } from '../EmptyPage';
const moment = extendMoment(Moment);

const { Option } = Select;
const BurnDownChart = observer(({

}) => {
  const clsPrefix = 'c7n-project-overview-burn-down-chart';
  const { burnDownChartStore } = useBurnDownChartStore();
  const { projectOverviewStore } = useProjectOverviewStore();
  const [loading, setLoading] = useState(true);
  const [xAxis, setXAxis] = useState([]);
  const [yAxis, setYAxis] = useState([]);
  const [markArea, setMarkArea] = useState([]);
  const [exportAxis, setExportAxis] = useState([]);
  const [selectValue, setSelectValue] = useState('remainingEstimatedTime');
  const [checkedValue, setCheckedValue] = useState(true);
  function getBetweenDateStr(start, end) {
    // 是否显示非工作日
    const range = moment.range(start, end);
    const days = Array.from(range.by('day'));
    const result = days.map(day => day.format('YYYY-MM-DD'));
    const rest = days.filter(day => burnDownChartStore.getRestDays.includes(day.format('YYYY-MM-DD'))).map(day => day.format('YYYY-MM-DD'));
    return { result, rest };
  }

  function loadChartCoordinate() {
    setLoading(true);
    burnDownChartStore.axiosGetChartData(projectOverviewStore.getStaredSprint.sprintId, selectValue).then((res) => {
      const keys = Object.keys(res.coordinate);
      let [minDate, maxDate] = [keys[0], keys[0]];
      for (let a = 1, len = keys.length; a < len; a += 1) {
        if (moment(keys[a]).isAfter(maxDate)) {
          maxDate = keys[a];
        }
        if (moment(keys[a]).isBefore(minDate)) {
          minDate = keys[a];
        }
      }
      // 如果后端给的最大日期小于结束日期
      let allDate;
      let rest = [];
      const endDate = projectOverviewStore.getStaredSprint.endDate;
      /* eslint-disable */
      if (moment(maxDate).isBefore(endDate.split(' ')[0])) {
        const result = getBetweenDateStr(minDate, endDate.split(' ')[0]);
        allDate = result.result;
        rest = result.rest;
      } else if (moment(minDate).isSame(maxDate)) {
        allDate = [minDate];
      } else {
        const result = getBetweenDateStr(minDate, maxDate);
        allDate = result.result;
        rest = result.rest;
      }
      // const allDate = getBetweenDateStr(minDate, maxDate);
      const allDateValues = [res.expectCount];
      const markAreaData = [];
      let exportAxisData = [res.expectCount];
      // 如果展示非工作日，期望为一条连续斜线
      if (!checkedValue) {
        if (allDate.length) {
          exportAxisData = [
            ['', res.expectCount],
            [allDate[allDate.length - 1].split(' ')[0].slice(5).replace('-', '/'), 0],
          ];
        }
      }
      for (let b = 0, len = allDate.length; b < len; b += 1) {
        const nowKey = allDate[b];
        // 显示非工作日，则非工作日期望为水平线
        if (checkedValue) {
          // 工作日天数
          const countWorkDay = (allDate.length - rest.length) || 1;
          // 日工作量
          const dayAmount = res.expectCount / countWorkDay;
          if (rest.includes(allDate[b])) {
            // 非工作日
            if (b < len) {
              markAreaData.push([
                {
                  xAxis: b === 0 ? '' : allDate[b - 1].split(' ')[0].slice(5).replace('-', '/'),
                },
                {
                  xAxis: allDate[b].split(' ')[0].slice(5).replace('-', '/'),
                },
              ]);
            }
            exportAxisData[b + 1] = exportAxisData[b];
          } else {
            // 工作量取整
            exportAxisData[b + 1] = (exportAxisData[b] - dayAmount) < 0 ? 0 : exportAxisData[b] - dayAmount;
          }
        }
        if (res.coordinate.hasOwnProperty(nowKey)) {
          allDateValues.push(res.coordinate[allDate[b]]);
        } else if (moment(nowKey).isAfter(moment())) {
          allDateValues.push(null);
        } else {
          const beforeKey = allDate[b - 1];
          allDateValues.push(res.coordinate[beforeKey]);
          res.coordinate[nowKey] = res.coordinate[beforeKey];
        }
      }
      const sliceDate = _.map(allDate, item => item.slice(5).replace('-', '/'));
      setXAxis(['', ...sliceDate]);
      setYAxis(allDateValues);
      setExportAxis(exportAxisData);
      setMarkArea(markAreaData);
      setLoading(false);
    });
  }
  useEffect(() => {
    if (projectOverviewStore.getStaredSprint) {
      burnDownChartStore.axiosGetRestDays(projectOverviewStore.getStaredSprint.sprintId).then(res => {
        burnDownChartStore.setRestDays(res.map(date => moment(date).format('YYYY-MM-DD')));
        loadChartCoordinate();
      });
    }
    setLoading(false);
  }, [projectOverviewStore.getIsFinishLoad]);
  useEffect(() => {
    if (projectOverviewStore.getStaredSprint) {
      loadChartCoordinate();
    }

  }, [selectValue, checkedValue]);
  function renderChartTitle() {
    let result = '';
    if (selectValue === 'remainingEstimatedTime') {
      result = '剩余时间';
    }
    if (selectValue === 'storyPoints') {
      result = '故事点';
    }
    if (selectValue === 'issueCount') {
      result = '问题计数';
    }
    return result;
  }

  function getOption() {
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
              content = `${item.axisValue || '冲刺开启'}<br />${item.marker}${item.seriesName} : ${(item.value || item.value === 0) ? item.value : '-'}${unit && unit}`;
            }
          });
          return content;
        },
      },
      legend: {
        top: '24px',
        right: '3.2%',
        data: [{
          name: '期望值',
          icon: 'line',
        }, {
          name: '剩余值',
          icon: 'line',
        }],
      },
      grid: {
        bottom: 50,
        left: 5,
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
          interval: parseInt(xAxis.length / 7) ? parseInt(xAxis.length / 7) - 1 : 0,
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
          formatter(value, index) {
            if (selectValue === 'remainingEstimatedTime' && value) {
              return `${value}h`;
            } else {
              return value;
            }
          },
        },
      },
      series: [
        {
          symbol: 'none',
          name: '期望值',
          type: 'line',
          data: exportAxis,
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
          name: '剩余值',
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
    if (projectOverviewStore.getStaredSprint) {
      return <Echart option={getOption()} />
    }
    return <EmptyPage imgHeight={200} imgWidth={300} />
  }
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>燃尽图</span>
      {projectOverviewStore.getStaredSprint ? <React.Fragment>
        <Select
          getPopupContainer={triggerNode => triggerNode.parentNode}
          style={{ width: 100, marginLeft: 34 }}
          className="c7n-project-overview-SelectTheme"
          label="单位"
          clearButton={false}
          defaultValue={selectValue}
          onChange={setSelectValue}
        >
          <Option value="remainingEstimatedTime">剩余时间</Option>
          <Option value="storyPoints">故事点</Option>
          <Option value="issueCount">问题计数</Option>
        </Select>
        <CheckBox
          style={{ marginLeft: 24 }}
          // value={checkedValue}
          checked={checkedValue}
          onChange={setCheckedValue}
        >
          显示非工作日
      </CheckBox>
      </React.Fragment>
        : ''}
    </div>
  );
  return (
    <OverviewWrap height={333}>
      <OverviewWrap.Header title={renderTitle()} />
      <Spin spinning={projectOverviewStore.getIsFinishLoad && loading}>
        {render()}
      </Spin>
    </OverviewWrap>

  );
});

export default BurnDownChart;
