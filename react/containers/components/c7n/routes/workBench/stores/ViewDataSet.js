// 用户视图tabs
import JsonBig from 'json-bigint';

const fakeData = [{
  creationDate: null,
  createdBy: -1,
  lastUpdateDate: null,
  lastUpdatedBy: null,
  objectVersionNumber: 1,
  /** 前端数据标记 编辑为本地读取 不可操作 */
  fakeFlag: true,
  dashboardId: 'gantt',
  dashboardType: 'INTERNAL',
  dashboardName: '甘特图',
  defaultFlag: 1,
  dashboardUserId: '248020192671543296',
},
{
  creationDate: null,
  createdBy: -1,
  lastUpdateDate: null,
  lastUpdatedBy: null,
  objectVersionNumber: 1,
  fakeFlag: true,
  dashboardId: 'workTime',
  dashboardType: 'INTERNAL',
  dashboardName: '工时',
  defaultFlag: 1,
  dashboardUserId: '248020192671543296',
},
];
/* eslint-disable import/no-anonymous-default-export */
export default ({
  workBenchUseStore,
}) => ({
  paging: false,
  autoQuery: true,
  fields: [{
    name: 'dashboardId',
  }],
  transport: {
    read: ({ data }) => ({
      url: 'iam/v1/dashboards',
      method: 'get',
      transformResponse: (value) => {
        try {
          const res = JsonBig.parse(value) || [];
          res.splice(1, 0, ...fakeData);
          workBenchUseStore.setViewData(res);
          return res;
        } catch (error) {
          return error;
        }
      },
    }),
    destroy: ({ data }) => {
      const dashboardIds = data.map((dashboard) => dashboard.dashboardId);
      return {
        url: 'iam/v1/dashboards',
        method: 'delete',
        data: dashboardIds,
      };
    },
  },
});
