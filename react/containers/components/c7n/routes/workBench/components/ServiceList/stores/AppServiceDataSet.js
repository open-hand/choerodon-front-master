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
        try {
          const data = JSON.parse(value);
          cacheStore.setCacheAppServiceData(data);
          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  },
  fields: [],
}));
