import axios from '@/components/axios';

// 项目编码只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾且不能连续出现两个"-"  /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/
// 项目名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成   /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/
// 瀑布项目 结项时间最小为今天+1， 立项时间与结项时间最小间隔一天
const nameValidator = (value) => {
  if (!value) {
    return '名称必输。';
  }
  if (value.trim() === '') {
    return '名称不能全为空。';
  }
  if (value.length > 110) {
    return '名称长度不能超过110！';
  }
  // eslint-disable-next-line no-useless-escape
  const reg = /^[-—.\w\s\u0800-\u9fa5]{1,110}$/;
  if (!reg.test(value)) {
    return '名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成';
  }
  return true;
};

const HAS_BASE_BUSINESS = C7NHasModule('@choerodon/base-business');

// eslint-disable-next-line import/no-anonymous-default-export
export default ({
  organizationId, categoryDs, projectId, categoryCodes, inNewUserGuideStepOne = false, statusDs,
}) => {
  const codeValidator = async (value, name, record) => {
    if (record.status !== 'add') {
      return true;
    }
    if (!value) {
      return '请输入编码。';
    }
    if (value.length > 14) {
      return '编码长度不能超过14！';
    } if (value.trim() === '') {
      return '编码不能全为空！';
    }
    // eslint-disable-next-line no-useless-escape
    const reg = /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/;
    if (!reg.test(value)) {
      return '编码只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾且不能连续出现两个"-"。';
    }
    try {
      const url = name === 'code'
        ? `/iam/choerodon/v1/organizations/${organizationId}/projects/check`
        : `/iam/choerodon/v1/organizations/${organizationId}/applications/check/${value}`;
      const params = { code: value };
      const res = await axios({
        method: name === 'code' ? 'post' : 'get',
        url,
        data: name === 'code' ? params : undefined,
      });
      if (res === false) {
        return '项目编码已存在';
      } if (res && res.failed) {
        return res.message;
      }
      return true;
    } catch (err) {
      return '编码已存在或编码重名校验失败，请稍后再试';
    }
  };

  let newUserGuideDefaultValue = {};
  if (inNewUserGuideStepOne) {
    newUserGuideDefaultValue = {
      name: '全流程示例项目',
      code: 'proj-demo',
    };
  }

  const fields = [
    {
      name: 'name',
      type: 'string',
      label: '项目名称',
      required: true,
      validator: nameValidator,
      defaultValue: newUserGuideDefaultValue.name,
    },
    {
      name: 'code',
      type: 'string',
      label: '项目编码',
      required: true,
      validator: codeValidator,
      defaultValue: newUserGuideDefaultValue.code,
    },
    // {
    //   name: 'aaa',
    //   type: 'string',
    //   label: '项目类型',
    //   required: true,
    // },
    // {
    //   name: 'bbb',
    //   type: 'string',
    //   label: '产品',
    //   required: true,
    // },
    {
      name: 'agileWaterfall',
      type: 'boolean',
      label: '启用冲刺',
      defaultValue: false,
    },
    {
      name: 'description',
      type: 'string',
      label: '项目描述',
      maxLength: 1000,
      defaultValue: newUserGuideDefaultValue.description,
    },
    { name: 'enabled', type: 'boolean', label: '项目状态' },
    {
      name: 'categories', label: '项目类型', required: true,
    },
    { name: 'createUserName', type: 'string', label: '创建人' },
    { name: 'imageUrl', type: 'string' },
    { name: 'creationDate', type: 'date', label: '创建时间' },
    { name: 'useTemplate', defaultValue: true },
  ];

  // 合并时候改成window.baseBusiness
  if (HAS_BASE_BUSINESS) {
    fields.push({
      name: 'statusId',
      type: 'object',
      label: '项目状态',
      textField: 'name',
      valueField: 'id',
      options: statusDs,
      dynamicProps: {
        required: ({ record }) => record?.status !== 'add'
        ,
      },
    });
  }

  return {
    autoQuery: false,
    selection: false,
    autoCreate: false,
    paging: false,
    autoQueryAfterSubmit: false,
    feedback: {
      submitSuccess() { },
    },
    transport: {
      read: () => ({
        url: `/iam/choerodon/v1/projects/${projectId}`,
        method: 'get',
      }),
      create: ({ data: [data] }) => ({
        url: `/iam/choerodon/v1/organizations/${organizationId}/projects`,
        method: 'post',
        data: { ...data, operateType: 'create' },
      }),
      update: ({ data: [data] }) => ({
        url: `/iam/choerodon/v1/organizations/${organizationId}/projects/${data.id}`,
        method: 'put',
        data: { ...data, operateType: 'update' },
      }),
    },
    fields,
  };
};
