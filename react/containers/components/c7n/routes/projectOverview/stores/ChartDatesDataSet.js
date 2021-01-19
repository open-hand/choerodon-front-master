import Moment from 'moment';
import { extendMoment } from 'moment-range';
import Jsonbig from 'json-bigint';
import { get } from 'lodash';

const moment = extendMoment(Moment);

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, organizationId, startedRecord }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: ({ params, data }) => ({
      url: `/agile/v1/projects/${projectId}/sprint/query_non_workdays/${get(startedRecord, 'sprintId')}/${organizationId}`,
      method: 'get',
      transformResponse: (value) => {
        try {
          const res = Jsonbig.parse(value);
          if (res && res.failed) {
            return res;
          }
          const mainData = res.map((date) => moment(date).format('YYYY-MM-DD'));
          return mainData;
        } catch (error) {
          throw new Error(Error);
        }
      },
    }),
  },
});
