/* eslint-disable import/no-anonymous-default-export */
export default (({ url }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  dataKey: null,
  transport: {
    read: {
      url,
      method: 'get',
    },
  },
  fields: [],
}));
