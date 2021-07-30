import React, {
  useState, memo, useMemo, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import Echart from 'echarts-for-react';
import './index.less';
import { Spin } from 'choerodon-ui';

import { AnimationLoading } from '@choerodon/components';
import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import EmptyPage from '../EmptyPage';
import { useDefectTreatmentStore } from './stores';

const DefectTreatment = observer(() => {
  const options = useMemo(() => [{ value: 'created', text: '提出' }, { value: 'completed', text: '解决' }], []);
  const clsPrefix = 'c7n-project-overview-defect-treatment';
  const [charOption, setCharOption] = useState('created'); // createdList completedList
  const { startedRecord, startSprintDs } = useProjectOverviewStore();
  const {
    defectTreatDs,
  } = useDefectTreatmentStore();

  function getOptions() {
    return {
      legend: {
        zlevel: 5,
        icon: 'path://m 7.25,0.018229 h 5.5 c 3.878,0 7,2.1928333 7,4.9166665 0,2.7238333 -3.122,4.9166665 -7,4.9166665 h -5.5 c -3.878,0 -7,-2.1928332 -7,-4.9166665 0,-2.7238332 3.122,-4.9166665 7,-4.9166665 z',
        itemWidth: 20,
        itemHeight: 10,
        borderRadius: 20,
        top: 0,
        right: 8,
      },
      grid: {
        left: 30,
        right: 8,
        top: 37,
        bottom: defectTreatDs.length > 8 ? 40 : 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        textStyle: {
          color: '#FFF',
        },
      },
      dataset: {
        source: defectTreatDs.toData() || [],
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        interval: 0,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#eee',
          },
          onZero: true,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
            fontStyle: 'normal',
          },
          formatter(value, index) {
            if (!value) {
              return value;
            }
            return value.split('（')[0];
          },
        },
      },
      yAxis: {
        name: '问题计数',
        nameTextStyle: {
          color: '#000',
        },
        minInterval: 1,
        nameGap: 23,
        axisTick: { show: false },
        axisLine: {
          show: false,

        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(238, 238, 238, 1)',
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
            fontStyle: 'normal',
          },
        },
      },

      series: [
        {
          type: 'bar',
          name: charOption === 'created' ? '提出' : '解决',
          color: charOption === 'created' ? 'rgba(249, 136, 148, 1)' : 'rgba(136, 223, 240, 1)',
          barWidth: 10,
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0],
          },
          dimensions: [
            { name: 'worker', type: 'ordinal' },
            { name: charOption, type: 'number' },
          ],
        },
      ],
      dataZoom: [{
        bottom: 0,
        show: defectTreatDs.length > 8,
        type: 'slider',
        height: 15,
        width: '80%',
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
  }
  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>缺陷提出与解决</span>
      {startedRecord && defectTreatDs.length ? <OverviewWrap.Switch defaultValue="created" onChange={setCharOption} options={options} /> : ''}
    </div>
  );
  function render() {
    if (defectTreatDs.status === 'loading') {
      return <AnimationLoading display />;
    }
    if (startedRecord) {
      return (
        <OverviewWrap.Content className={`${clsPrefix}-content`}>
          {
              defectTreatDs.length > 0
                ? <Echart style={{ width: '100%', height: '100%' }} option={getOptions()} /> : <EmptyPage height={274} content="暂无数据" />
            }

        </OverviewWrap.Content>
      );
    }
    if (startSprintDs.status !== 'loading') {
      return <EmptyPage />;// 暂无活跃的冲刺"
    }
    return <LoadingBar display />;
  }
  return (
    <OverviewWrap style={{
      paddingTop: '13px',
    }}
    >
      <OverviewWrap.Header
        title={renderTitle()}
        style={{
          margin: '6px 0 10px 4px',
        }}
      />
      {render()}
    </OverviewWrap>
  );
});

export default DefectTreatment;
