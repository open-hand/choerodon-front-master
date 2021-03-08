/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId }) => ({
  autoQuery: true,
  selection: false,
  pageSize: 15,
  transport: {
    read: {
      url: `/iam/choerodon/v1/projects/${projectId}/user_count`,
      method: 'get',
      transformResponse: (response) => {
        try {
          const res = JSON.parse(response);
          if (res && res.failed) {
            return res;
          }
          return res.onlineUserList;
        } catch (e) {
          return response;
        }
      },
    },
  },
  fields: [
    { name: 'summary', type: 'string' },
    { name: 'node', type: 'string' },
    { name: 'createdBy', type: 'string' },
    { name: 'backlogPriority', type: 'string' },
    { name: 'approveBtn', type: 'string' },
  ],
  queryFields: [
    { name: 'summary', type: 'string', label: '概要' },
  ],
  data: [
    {
      summary: '需求11111111111111111111111111111111111需求需求需求需求需求111111111',
      node: '开始',
      createdBy: '李文斐',
      creator: {
        id: '=wbA0bW2MeAbXSQwPrHxf5MxqCXVlGB5ZRM6THFEcqw4==',
        organizationId: 2,
        loginName: '25287',
        email: 'chihao.ran@hand-china.com',
        realName: '冉驰昊',
        phone: '17761258395',
        imageUrl: null,
        language: 'zh_CN',
        timeZone: 'CTT',
        locked: null,
        ldap: true,
        enabled: true,
        password: null,
        admin: null,
        objectVersionNumber: null,
        param: null,
      },
      backlogPriority: {
        creationDate: '2020-08-01 13:00:30',
        createdBy: 1878,
        lastUpdateDate: '2020-08-01 13:00:30',
        lastUpdatedBy: 1878,
        objectVersionNumber: 1,
        _token: 'NW38gXdlAMjrLClrCKPF2qEoMJfQ+HRXHKozgRb3fMJsWHLXD3pA0Rc0ivEtQgMuCxto6Vhz62ZMywJmRNWCSzgH76wWjqsYng1AV0f0rJS2ccifOC7V+nrn+k2Z8OY9',
        id: '=QZqJxWnrI8ch7SFKN-oLIyBkz3dgOZlJSQXAMLVWFUg==',
        organizationId: 7,
        name: '普通',
        description: null,
        color: '#3575DF',
        sequence: 2,
        default: true,
      },
    },
    {
      summary: '需求11111111111111111111111111111111111需求需求111111111',
      node: '开始',
      createdBy: '李文斐',
      creator: {
        id: '=wbA0bW2MeAbXSQwPrHxf5MxqCXVlGB5ZRM6THFEcqw4==',
        organizationId: 2,
        loginName: '25287',
        email: 'chihao.ran@hand-china.com',
        realName: '冉驰昊',
        phone: '17761258395',
        imageUrl: null,
        language: 'zh_CN',
        timeZone: 'CTT',
        locked: null,
        ldap: true,
        enabled: true,
        password: null,
        admin: null,
        objectVersionNumber: null,
        param: null,
      },
      backlogPriority: {
        creationDate: '2020-08-01 13:00:30',
        createdBy: 1878,
        lastUpdateDate: '2020-08-01 13:00:30',
        lastUpdatedBy: 1878,
        objectVersionNumber: 1,
        _token: 'NW38gXdlAMjrLClrCKPF2qEoMJfQ+HRXHKozgRb3fMJsWHLXD3pA0Rc0ivEtQgMuCxto6Vhz62ZMywJmRNWCSzgH76wWjqsYng1AV0f0rJS2ccifOC7V+nrn+k2Z8OY9',
        id: '=QZqJxWnrI8ch7SFKN-oLIyBkz3dgOZlJSQXAMLVWFUg==',
        organizationId: 7,
        name: '普通',
        description: null,
        color: '#3575DF',
        sequence: 2,
        default: true,
      },
    },
  ],
});
