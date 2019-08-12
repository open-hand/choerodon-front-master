import queryString from 'query-string';
import { DataSet } from 'choerodon-ui/pro/lib';
import PROJECT_TYPE from '../constant';

const categoryDs = new DataSet({
  autoQuery: false,
  selection: false,
  fields: [
    { name: 'key', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  data: Object.keys(PROJECT_TYPE).map(k => ({
    key: k,
    value: PROJECT_TYPE[k],
  })),
});

export default (AppState, history) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/base/v1/organizations/${queryString.parse(history.location.search).orgId}/users/${AppState.getUserId}/enableProjects`,
      method: 'post',
    },
    submit: {
      url: 'xxx',
      method: 'post',
    },
  },
  fields: [
    { name: 'name', type: 'string', label: '项目名称', required: true },
    { name: 'code', type: 'string', label: '项目编码', required: true },
    { name: 'applicationCode', type: 'string', label: '应用编码', required: false },
    { name: 'applicationName', type: 'string', label: '应用名称', required: false },
    { name: 'category', type: 'string', label: '项目类型', required: true, textField: 'value', valueField: 'key', options: categoryDs, defaultValue: 'AGILE' },
    { name: 'programName', type: 'string', label: '项目群' },
    { name: 'createUserName', type: 'string', label: '创建人' },
    { name: 'createUserImageUrl', type: 'string' },
    { name: 'creationDate', type: 'date', label: '创建时间' },
    { name: 'createType', type: 'string' },
    { name: 'createByExist', type: 'number' },
  ],
});
