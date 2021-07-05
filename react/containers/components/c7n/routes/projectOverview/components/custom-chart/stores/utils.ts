import { map } from 'lodash';

export type IChartUnit = 'storyPoints' | 'quantity';
export type IChartType = 'line' | 'bar' | 'pie' | 'stackedBar';
export interface IChartData {
  comparedId: null | string,
  comparedValue: null | number | string,
  pointList: {
    analysisValue: string,
    analysisId: string,
    value: number,
    comparedValue: null | number | string,
    comparedId: null | string,
    percentage: number
  }[]
}

const xAxis = {
  type: 'category',
  boundaryGap: true,
  axisTick: { show: false },
  axisLine: {
    show: false,
    // lineStyle: {
    //   color: '#eee',
    //   type: 'solid',
    //   width: 2,
    // },
  },
  axisLabel: {
    show: true,
    color: '#0F1358',
    fontStyle: 'normal',
  },
  splitLine: {
    show: false,
    // interval: 0,
    // lineStyle: {
    //   color: '#eee',
    //   width: 1,
    //   type: 'solid',
    // },
  },
};

const yAxis = {
  type: 'value',
  nameTextStyle: {
    color: 'rgba(15, 19, 88, 0.65)',
  },
  // nameGap: 22,
  axisTick: { show: false },
  axisLine: {
    show: false,
    // lineStyle: {
    //   color: '#eee',
    //   type: 'solid',
    //   // width: 2,
    // },
  },
  axisLabel: {
    show: true,
    margin: 18,
    color: '#0F1358',
    fontStyle: 'normal',
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: '#eee',
      type: 'solid',
      width: 1,
    },
  },
};

const dataZoom = {
  bottom: 0,
  type: 'slider',
  // @ts-ignore
  height: 15,
  width: '85%',
  left: 60,
  startValue: 0,
  endValue: 11,
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
};

const color = ['#4E70F0', '#07C5D1', '#97F4F1', '#FF812C', '#F9513E', '#FF71D9', '#9928FC', '#7C83FF',
  '#028390', '#FDDD39', '#8BC34A', '#4CAF50', '#029688', '#4050B5', '#3D7ADB', '#03A9F4',
  '#871984', '#BC0F6A', '#FD634E', '#F8A1AC', '#FFBF33', '#FC9A4D', '#02AECD', '#5AD5E0'];

const legend = {
  formatter(name: string) {
    return `${name.slice(0, 10)}${name.length > 10 ? '...' : ''}`;
  },
  tooltip: {
    show: true,
  },
  textStyle: {
    color: '#0F1358',
  },
  pageButtonItemGap: 10,
  pageIconSize: [10, 12],
  pageIconColor: '#5365EA',
  pageIconInactiveColor: 'rgba(83, 101, 234, 0.5)',
  pageTextStyle: {
    color: 'rgba(15, 19, 88, 0.65)',
  },
};

const grid = {
  top: 40,
  left: 15,
  right: 10,
  containLabel: true,
};

const tooltip = {
  confine: true,
  enterable: true,
  extraCssText: 'max-height: 600px; overflow-y: auto',
};

const getOptions = (chartType: IChartType, unit: IChartUnit, data: IChartData[], maxShow: number): any => {
  const unitZ = unit === 'quantity' ? '个' : '点';
  const xAxisData = map((data && data[0].pointList) || [], 'analysisValue');
  if (chartType === 'line' || chartType === 'bar') {
    return ({
      tooltip: {
        ...tooltip,
        formatter(params: any) {
          const content = `${params.marker}${params.name}: ${(params.value || params.value === 0) ? params.value : '-'}${unitZ}`;
          return content;
        },
      },
      xAxis: {
        ...xAxis,
        data: xAxisData,
      },
      yAxis: {
        ...yAxis,
        name: `单位：${unit === 'storyPoints' ? '故事点' : '问题计数'}`,
      },
      series: {
        type: chartType,
        data: map((data && data[0].pointList) || [], 'value'),
      },
      dataZoom: [{ ...dataZoom, show: xAxisData.length > maxShow }],
      grid: {
        ...grid,
        bottom: xAxisData.length > maxShow ? 20 : 0,
      },
      color,
    });
  } if (chartType === 'pie') {
    return {
      tooltip: {
        ...tooltip,
        trigger: 'item',
        formatter(params: any) {
          const content = `${params.marker}${params.name}: ${(params.value || params.value === 0) ? params.value : '-'}${unitZ}（${parseFloat(params.percent)}%）`;
          return content;
        },
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 'middle',
        ...legend,
      },
      series: [
        {
          type: 'pie',
          radius: '100%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          minShowLabelAngle: 5,
          top: 20,
          bottom: 10,
          data: map((data && data[0].pointList) || [], (point) => ({
            name: point.analysisValue,
            value: point.value,
          })),
        },
      ],
      color,
    };
  } if (chartType === 'stackedBar') {
    return {
      tooltip: {
        ...tooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params: any[]) {
          let content = '';
          content += `${params[0].axisValue}<br/>`;
          for (let i = 0; i < params.length; i += 1) {
            content += `${params[i].marker}${params[i].seriesName}: ${(params[i].value || params[i].value === 0) ? params[i].value : '-'}${unitZ}`;
            if (i !== params[i].length - 1) {
              content += '<br/ >';
            }
          }
          return content;
        },
      },
      legend: {
        type: 'scroll',
        top: 0,
        ...legend,
      },
      xAxis: {
        ...xAxis,
        data: xAxisData,
      },
      yAxis: {
        ...yAxis,
        name: unit === 'storyPoints' ? '故事点' : '问题计数',
      },
      series: (data || []).map((item) => ({
        name: item.comparedValue,
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: map((item.pointList || []), 'value'),
      })),
      dataZoom: [{ ...dataZoom, show: xAxisData.length > maxShow }],
      grid: {
        ...grid,
        top: data.length > maxShow ? 60 : 40, // 图例过长，留足空间
        bottom: xAxisData.length > maxShow ? 20 : 0, // x轴过长，留横向滚动条的位置
      },
      color,
    };
  }
  return {};
};

export default getOptions;
