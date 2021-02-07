import Moment from 'moment';
import { extendMoment } from 'moment-range';
import Jsonbig from 'json-bigint';
import { get, map } from 'lodash';
import { localPageCacheStore } from './LocalPageCacheStore';

const moment = extendMoment(Moment);

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, startedRecord }) => {
  function getBetweenDateStr(start, end, datesData) {
    // 是否显示非工作日
    const range = moment.range(start, end);
    const days = Array.from(range.by('day'));
    const result = days.map((day) => day.format('YYYY-MM-DD'));
    const rest = days.filter((day) => datesData.includes(day.format('YYYY-MM-DD'))).map((day) => day.format('YYYY-MM-DD'));
    return { result, rest };
  }

  return {
    autoQuery: false,
    selection: false,
    paging: false,
    transport: {
      read: ({ params, data }) => {
        const { selectType = (localPageCacheStore.getItem('project.overview.selectType') || 'remainingEstimatedTime'), checkedValue = true, datesData = [] } = data || {};
        return {
          url: `/agile/v1/projects/${projectId}/reports/${get(startedRecord, 'sprintId')}/burn_down_report/coordinate`,
          method: 'post',
          data: {
            type: selectType,
          },
          transformResponse: (value) => {
            try {
              const res = Jsonbig.parse(value);
              const coordinate = get(res, 'coordinate');
              const expectCount = get(res, 'expectCount');
              const keys = coordinate && Object.keys(coordinate);
              if (get(keys, 'length')) {
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
                const { endDate } = startedRecord;
                if (moment(maxDate).isBefore(endDate.split(' ')[0])) {
                  const result = getBetweenDateStr(minDate, endDate.split(' ')[0], datesData);
                  allDate = result.result;
                  rest = result.rest;
                } else if (moment(minDate).isSame(maxDate)) {
                  allDate = [minDate];
                } else {
                  const result = getBetweenDateStr(minDate, maxDate, datesData);
                  allDate = result.result;
                  rest = result.rest;
                }
                // const allDate = getBetweenDateStr(minDate, maxDate);
                const allDateValues = [expectCount];
                const markAreaData = [];
                let exportAxisData = [expectCount];
                // 如果展示非工作日，期望为一条连续斜线
                if (!checkedValue) {
                  if (allDate.length) {
                    exportAxisData = [
                      ['', expectCount],
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
                    const dayAmount = expectCount / countWorkDay;
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
                  if (Object.prototype.hasOwnProperty.call(coordinate, nowKey)) {
                    allDateValues.push(coordinate[allDate[b]]);
                  } else if (moment(nowKey).isAfter(moment())) {
                    allDateValues.push(null);
                  } else {
                    const beforeKey = allDate[b - 1];
                    allDateValues.push(coordinate[beforeKey]);
                    coordinate[nowKey] = coordinate[beforeKey];
                  }
                }
                const sliceDate = map(allDate, (item) => item.slice(5).replace('-', '/'));
                return {
                  xAxis: ['', ...sliceDate],
                  yAxis: allDateValues,
                  exportAxis: exportAxisData,
                  markArea: markAreaData,
                };
              }
              return {};
            } catch (error) {
              throw new Error(error);
            }
          },
        };
      },
    },
  };
};
