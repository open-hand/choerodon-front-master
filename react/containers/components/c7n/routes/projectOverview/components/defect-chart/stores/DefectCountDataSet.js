import { get } from 'lodash';
import Jsonbig from 'json-bigint';
import moment from 'moment';

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, startedRecord }) => ({
  paging: false,
  autoQuery: true,
  transport: {
    read: ({ data }) => (startedRecord ? {
      method: 'get',
      url: `/agile/v1/projects/${projectId}/project_overview/${get(startedRecord, 'sprintId')}/issue_count`,
      transformResponse: (value) => {
        try {
          const getChartList = Jsonbig.parse(value);
          if (getChartList) {
            const range = moment.range(startedRecord.startDate, moment());
            const days = Array.from(range.by('day'));
            const maps = new Map(days.map((day) => [day.format('MM/DD'), { complete: 0, create: 0 }]));
            getChartList.completedList.forEach((obj) => {
              const date = Object.keys(obj)[0].substring(5).replace(/-/g, '/');
              maps.set(date, { complete: Object.values(obj)[0], create: 0 });
            });
            getChartList.createdList.forEach((obj) => {
              const date = Object.keys(obj)[0].substring(5).replace(/-/g, '/');
              const map = maps.get(date);
              maps.set(date, { ...map, create: Object.values(obj)[0] });
            });
            const chartDataArr = Array.from(maps);
            const date = [];
            const complete = [];
            const create = [];
            for (let i = 0; i < chartDataArr.length; i += 1) {
              const item = chartDataArr[i];
              date.push(item[0]);
              complete.push(item[1].complete);
              create.push(item[1].create);
            }
            return { date, complete, create };
          }
          return {};
        } catch (error) {
          throw new Error(error);
        }
      },
    } : {}),
  },
});
