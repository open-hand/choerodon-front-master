/* eslint-disable import/no-anonymous-default-export */
export default (({ url, cacheStore }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  dataKey: null,
  transport: {
    read: {
      url,
      method: 'get',
      transformResponse: (value) => {
        const data = JSON.parse(value);
        cacheStore.setCacheAppServiceData(data);
      },
    },
  },
  fields: [],
}));
