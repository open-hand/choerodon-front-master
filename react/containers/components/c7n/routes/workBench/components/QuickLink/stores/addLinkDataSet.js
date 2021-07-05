/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';

const linkValidate = (value) => {
  if (!value) {
    return '链接必输。';
  }
  // eslint-disable-next-line no-useless-escape
  const reg = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
  if (!reg.test(value)) {
    return '链接地址必须以http或者https开头。';
  }
  return true;
};

export default (AppState) => ({
  autoCreate: true,
  fields: [{
    type: 'string',
    name: 'scope',
    defaultValue: 'project',
  }, {
    name: 'size',
    type: 'number',
    defaultValue: 10,
  }, {
    name: 'projectId',
    type: 'string',
    label: '项目',
    textField: 'name',
    valueField: 'id',
    dynamicProps: {
      required: ({ record }) => record.get('scope') === 'project',
    },
    lookupAxiosConfig: (data) => ({
      method: 'get',
      url: `/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/users/${AppState.getUserId}/projects/paging?page=0&size=${
        (function () {
          if (data && data.record && data.record.get) {
            return data.record.get('size');
          }
          return 10;
        }())
      }`,
      data: {
        param: [],
        searchParams: {
          name: data.params.name,
        },
      },
      transformResponse(res) {
        let newRes;
        try {
          newRes = JSONbig.parse(res);
          if (newRes.content.length % 10 === 0 && newRes.content.length !== 0) {
            newRes.content.push({
              id: 'more',
              name: '加载更多',
            });
          }
          return newRes;
        } catch (e) {
          return res;
        }
      },
    }),
  }, {
    name: 'name',
    type: 'string',
    label: '链接名称',
    required: true,
    maxLength: 30,
  }, {
    name: 'linkUrl',
    type: 'string',
    label: '链接地址',
    required: true,
    validator: linkValidate,
  }],
});
