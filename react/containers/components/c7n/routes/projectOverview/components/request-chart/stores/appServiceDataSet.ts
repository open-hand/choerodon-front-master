/* eslint-disable import/no-anonymous-default-export */

export default ({ AppServiceOptionDs }:any) => ({
  autoQuery: true,
  pageSize: 10,
  fields: [
    {
      name: 'appService',
      type: 'object',
      textField: 'name',
      valueField: 'id',
      options: AppServiceOptionDs,
    },
  ],
});
