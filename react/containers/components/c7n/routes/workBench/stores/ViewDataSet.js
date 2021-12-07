// 用户视图tabs
import JsonBig from 'json-bigint';

function getDashboardPageData(data) {
  const dashboardPageData = [{
    dashboardType: 'INTERNAL', sourceDashboardName: '甘特图', dashboardPageCode: 'gantt', dashboardPageMode: true,
  },
  {
    dashboardType: 'INTERNAL', sourceDashboardName: '工时', dashboardPageCode: 'workTime', dashboardPageMode: true,
  },
  ];
  const dashboardPage = dashboardPageData.find((item) => item.dashboardType === data.dashboardType && item.sourceDashboardName === data.sourceDashboardName) || {};
  return { ...dashboardPage };
}
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
          const res = (JsonBig.parse(value) || []).map((item) => ({ ...getDashboardPageData(item), ...item }));
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
