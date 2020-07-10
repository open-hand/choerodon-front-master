import forEach from 'lodash/index';

export default ({ projectId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/devops/v1/projects/${projectId}/overview/deploy_count`,
      method: 'get',
      transformResponse: (response) => {
        try {
          const res = JSON.parse(response);
          if (res && res.failed) {
            return res;
          } else {
            const date = [];
            const newValue = [];
            forEach(res, (value, key) => {
              date.push(key);
              newValue.push(value);
            });
            return ({
              date,
              value: newValue,
            });
          }
        } catch (e) {
          return response;
        }
      },
    },
  },
});
