import queryString from 'query-string';
import { DataSet } from 'choerodon-ui/pro/lib';
import PROJECT_TYPE from '../constant';

// 项目编码只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾且不能连续出现两个"-"  /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/
// 项目名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成   /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/

const codeValidator = async (value) => {
  if (!value) {
    return '请输入编码。';
  }
  if (value.length > 32) {
    return '编码长度不能超过32！';
  } else if (value.trim() === '') {
    return '编码不能全为空！';
  }
  const reg = /^[a-z]([_\-/a-z0-9]*[a-z0-9])?$/;
  if (!reg.test(value)) {
    return '项目编码只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾且不能连续出现两个"-"。';
  }
  // try {
  //   const params = { code: `${placeholder}${value}` };
  //   const res = await axios.post('/iam/v1/roles/check', JSON.stringify(params));
  //   if (res.failed) {
  //     return '编码已存在。';
  //   } else {
  //     return true;
  //   }
  // } catch (err) {
  //   return '编码重名校验失败，请稍后再试。';
  // }
  return true;
};

const nameValidator = (value, name, record) => {
  if (!value) {
    return '名称必输。';
  }
  if (value.trim() === '') {
    return '名称不能全为空。';
  }
  // eslint-disable-next-line no-useless-escape
  const reg = /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/;
  if (!reg.test(value)) {
    return '项目名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成';
  }
  return true;
};

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
    submit: ({ dataSet }) => ({
      url: `/base/v1/organizations/${queryString.parse(history.location.search).orgId}/projects/${dataSet.current.get('id')}`,
      method: 'put',
      data: dataSet.current.toData(),
    }),
  },
  fields: [
    { name: 'name', type: 'string', label: '项目名称', required: true, validator: nameValidator },
    { name: 'code', type: 'string', label: '项目编码', required: true, validator: codeValidator },
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
