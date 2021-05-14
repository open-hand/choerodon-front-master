import { DataSet } from 'choerodon-ui/pro/lib';

/* eslint-disable import/no-anonymous-default-export */
export default (():any => ({
  autoQuery: true,
  paging: false,
  transport: {
    read: {
      url: 'http://192.168.17.180:8080/hsqa/v1/3/sla/enabled-priority',
      method: 'get',
      headers: {
        Authorization: 'bearer b219a321-3961-44be-89ce-1cbe33cc06d2',
      },
      transformResponse: (value: any) => {
        console.log(JSON.parse(value));
        return value;
      },
    },
  },
}));
