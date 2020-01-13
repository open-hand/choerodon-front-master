import queryString from 'query-string';
import { DataSet } from 'choerodon-ui/pro/lib';
import { PROJECT_TYPE } from '../constant';
import axios from '../../../tools/axios';

// 项目编码只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾且不能连续出现两个"-"  /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/
// 项目名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成   /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/

const nameValidator = (value) => {
  if (!value) {
    return '名称必输。';
  }
  if (value.trim() === '') {
    return '名称不能全为空。';
  }
  if (value.length > 32) {
    return '名称长度不能超过32！';
  }
  // eslint-disable-next-line no-useless-escape
  const reg = /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/;
  if (!reg.test(value)) {
    return '名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成';
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

const statusDs = new DataSet({
  autoQuery: false,
  selection: false,
  fields: [
    { name: 'key', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  data: [
    { key: 'true', value: '启用' },
    { key: 'false', value: '停用' },
  ],
});


export default (AppState, history) => {
  const codeValidator = async (value, name, record) => {
    if (record.status !== 'add') {
      return true;
    }
    if (!value) {
      return '请输入编码。';
    }
    if (value.length > 14) {
      return '编码长度不能超过14！';
    } else if (value.trim() === '') {
      return '编码不能全为空！';
    }
    // eslint-disable-next-line no-useless-escape
    const reg = /^[a-z]([\-/a-z0-9]*[a-z0-9])?$/;
    if (!reg.test(value)) {
      return '编码只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾且不能连续出现两个"-"。';
    }
    try {
      const { currentMenuType: { id, type, organizationId } } = AppState;
      let apiOrgId = organizationId;
      if (type === 'organization') {
        apiOrgId = id || organizationId;
      } else if (type === 'project') {
        apiOrgId = organizationId;
      }
      const url = name === 'code'
        ? `/base/v1/organizations/${apiOrgId}/projects/check`
        : `/base/v1/organizations/${apiOrgId}/applications/check/${value}`;
      const params = { code: value };
      const res = await axios({
        method: name === 'code' ? 'post' : 'get',
        url,
        data: name === 'code' ? params : undefined,
      });
      if (res === false) {
        return '编码已存在。';
      } else if (res && res.failed) {
        return res.message;
      } else {
        return true;
      }
    } catch (err) {
      return '编码已存在或编码重名校验失败，请稍后再试。';
    }
  };

  return {
    autoQuery: true,
    selection: false,
    paging: false,
    transport: {
      read: {
        url: `/base/v1/organizations/${queryString.parse(history.location.search).organizationId}/users/${AppState.getUserId}/projects`,
        method: 'get',
      },
      submit: ({ dataSet }) => ({
        url: `/base/v1/organizations/${queryString.parse(history.location.search).organizationId}/projects/${dataSet.current.get('id')}`,
        method: 'put',
        data: dataSet.current.toData(),
      }),
    },
    fields: [
      { name: 'name', type: 'string', label: '项目名称', required: true, validator: nameValidator },
      { name: 'code', type: 'string', label: '项目编码', required: true, validator: codeValidator },
      { name: 'enabled', type: 'boolean', label: '状态' },
      // { name: 'applicationCode', type: 'string', label: '应用编码', required: true, validator: codeValidator },
      // { name: 'applicationName', type: 'string', label: '应用名称', required: true, validator: nameValidator },
      { name: 'category', type: 'string', label: '项目类型', required: true, textField: 'value', valueField: 'key', options: categoryDs, defaultValue: 'GENERAL' },
      { name: 'programName', type: 'string', label: '项目群' },
      { name: 'createUserName', type: 'string', label: '创建人' },
      { name: 'createUserImageUrl', type: 'string' },
      { name: 'creationDate', type: 'date', label: '创建时间' },
      { name: 'createType', type: 'string' },
      { name: 'createByExist', type: 'number' },
    ],
    queryFields: [
      { name: 'name', type: 'string', label: '项目名称' },
      { name: 'code', type: 'string', label: '项目编码' },
      { name: 'category', type: 'string', label: '项目类型', textField: 'value', valueField: 'key', options: categoryDs },
      { name: 'enabled', type: 'auto', label: '状态', textField: 'value', valueField: 'key', options: statusDs },
    ],
    events: {
      update: ({ record, name, value }) => {
        if (record.status === 'add' && name === 'code' && !record.get('applicationCode')) {
          record.set('applicationCode', value);
        }
        if (record.status === 'add' && name === 'name' && !record.get('applicationName')) {
          record.set('applicationName', value);
        }
      },
    },
  };
};
