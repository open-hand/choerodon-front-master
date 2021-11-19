// 用户视图tabs
import JsonBig from 'json-bigint';

function isDashboardPageData(data) {
  const dashboardPageData = [{ dashboardType: 'INTERNAL', dashboardName: '甘特图' },
    { dashboardType: 'INTERNAL', dashboardName: '工时' },
  ];
  return dashboardPageData.some((item) => item.dashboardType === data.dashboardType && item.dashboardName === data.dashboardName);
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
          const res = (JsonBig.parse(value) || []).map((item) => ({ ...item, dashboardPageMode: isDashboardPageData(item) }));
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
