import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { NewTips } from '@zknow/components';
import { organizationsApiConfig } from '@/apis';
import axios from '@/components/axios';
import transformResponseTreeData from '@/utils/transformResponseTreeData';

function cleanString(inputString) {
  // 将所有非数字、字母和-的字符替换为空字符串
  let outputString = inputString.replace(/[^a-zA-Z0-9-]/g, '');
  // 将大写字母转换为小写字母
  outputString = outputString.toLowerCase();
  // 如果以数字开头，则删除数字直到出现字母为止
  outputString = outputString.replace(/^\d+/, '');
  outputString = outputString.replace(/--/g, '-');
  return outputString;
}

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

function trimSpecial(string) {
  let newString;
  // 替换字符串中的所有特殊字符（包含空格）
  if (string !== '') {
    const pattern = /[`%~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~_！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
    newString = string.replace(pattern, '');
  }
  return newString;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({
  organizationId, categoryDs, templateDs, projectId, categoryCodes, inNewUserGuideStepOne = false, statusDs, func, setFlags,
}) => {
  const codeValidator = async (value, name, record) => {
    if (record.status !== 'add') {
      return true;
    }
    if (!value) {
      return '请输入编码。';
    }
    if (value.length > 40) {
      return '编码长度不能超过40！';
    } if (value.trim() === '') {
      return '编码不能全为空！';
    }
    // eslint-disable-next-line no-useless-escape
    const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/;
    const reg1 = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g;
    if (reg.test(value)) {
      return '编码不能包含汉字';
    }
    if (reg1.test(value)) {
      return '编码不能包含Emoji';
    }
    try {
      const url = name === 'code'
        ? `/cbase/choerodon/v1/organizations/${organizationId}/projects/check`
        : `/cbase/choerodon/v1/organizations/${organizationId}/applications/check/${value}`;
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

  const extraFields = [];

  // if (func) {
  //   extraFields = func.default();
  // }

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
        url: `/cbase/choerodon/v1/organizations/${organizationId}/project_template/${projectId}`,
        method: 'get',
      }),
      create: ({ data: [data] }) => ({
        url: `/cbase/choerodon/v1/organizations/${organizationId}/project_template`,
        method: 'post',
        data: { ...data, operateType: 'create' },
      }),
      update: ({ data: [data] }) => ({
        url: `/cbase/choerodon/v1/organizations/${organizationId}/project_template/${data.id}`,
        method: 'put',
        data: { ...data, operateType: 'update' },
      }),
    },
    fields: [
      {
        name: 'customFields', label: '自定义字段', defaultValue: [],
      },
      {
        name: 'healthStatus',
        label: '健康状态',
      },
      {
        name: 'name',
        type: 'string',
        label: '名称',
        required: true,
        validator: nameValidator,
        defaultValue: newUserGuideDefaultValue.name,
      },
      {
        name: 'code',
        type: 'string',
        label: '项目编码',
        // required: true,
        // validator: codeValidator,
        maxLength: 40,
        defaultValue: newUserGuideDefaultValue.code,
      },
      {
        name: 'statusId',
        label: '项目状态',
        textField: 'name',
        valueField: 'id',
        options: statusDs,
        dynamicProps: {
          required: ({ record }) => record?.status !== 'add'
          ,
        },
      },
      {
        name: 'templateClassficationId',
        label: '模板分类',
        textField: 'name',
        valueField: 'id',
        options: templateDs,
      },
      {
        name: 'workGroupId',
        type: 'string',
        label: '工作组',
        textField: 'name',
        valueField: 'id',
        options: new DataSet({
          autoCreate: true,
          autoQuery: true,
          idField: 'id',
          parentField: 'parentId',
          transport: {
            read: ({ data }) => ({
              method: 'get',
              url: organizationsApiConfig.getprojWorkGroup('', true).url,
              transformResponse: (res) => transformResponseTreeData(res, 'workGroupVOS'),
            }),
          },
        }),
      },
      // 项目模板对象
      {
        name: 'projectTemplateInfo',
        label: '项目模板',
      },

      {
        name: 'projectClassficationId',
        type: 'string',
        label: '项目分类',
        textField: 'name',
        valueField: 'id',
        options: new DataSet({
          autoCreate: true,
          autoQuery: true,
          idField: 'id',
          parentField: 'parentId',
          transport: {
            read: ({ data }) => ({
              method: 'post',
              url: organizationsApiConfig.getprojClassification('').url,
              transformResponse: (res) => transformResponseTreeData(res, 'treeProjectClassfication'),
            }),
          },
        }),
      },
      {
        name: 'categories', label: '项目类型',
      },
      {
        name: 'devopsComponentCode',
        type: 'string',
        label: 'DevOps组件编码',
        validator: async (value, name, record) => {
          const values = ['N_DEVOPS', 'N_OPERATIONS'];
          const flag1 = categoryDs.selected.some((categoryRecord) => values.includes(categoryRecord.get('code')));
          if (flag1) {
            if (value.length > 40) {
              return '编码长度不能超过40！';
            }
            const reg = /^[a-z](?!.*--)[a-z0-9-]*[a-z0-9]$/g;
            if (!reg.test(value)) {
              return '只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾且不能连续出现两个"-"';
            }
            try {
              const flag = await axios({
                url: `/cbase/choerodon/v1/organizations/${organizationId}/projects/check_devops_code_exist`,
                params: {
                  devops_component_code: value,
                  ...record?.get('id') ? {
                    project_id: record?.get('id'),
                  } : {},
                },
              });
              if (flag) {
                return true;
              }
              return 'DevOps组件编码已存在';
            } catch (err) {
              return '编码已存在或编码重名校验失败，请稍后再试';
            }
          }
          return true;
        },
        dynamicProps: {
          required: ({ record }) => {
            const values = ['N_DEVOPS', 'N_OPERATIONS'];
            const flag = categoryDs.selected.some((categoryRecord) => values.includes(categoryRecord.get('code')));
            return flag;
          },
        },
      },
      {
        name: 'agileWaterfall',
        type: 'boolean',
        label: '启用冲刺',
        defaultValue: false,
      },
      {
        name: 'agileProgram',
        type: 'boolean',
        label: '启用冲刺',
        defaultValue: false,
      },
      {
        name: 'description',
        type: 'string',
        label: '描述',
        maxLength: 1000,
        defaultValue: newUserGuideDefaultValue.description,
      },
      {
        name: 'connectKnowledgeSpaceFlag',
        type: 'boolean',
        label: '连接燕千知识空间',
      },
      {
        name: 'knowledgeSpaceId',
        type: 'string',
        textField: 'text',
        valueField: 'id',
        label: '关联知识空间',
        options: new DataSet({
          selection: 'single',
          autoQuery: true,
          transport: {
            read: {
              // url: `/iam/choerodon/v1/organizations/${organizationId}/list_user_labels`,
              // method: 'get',
            },
          },
          data: [
            {
              text: '测试1',
              id: '1',
            },
            {
              text: '测试2',
              id: '2',
            },
            {
              text: '测试3',
              id: '3',
            },
            {
              text: '测试4',
              id: '4',
            },
            {
              text: '测试5',
              id: '5',
            },
          ],
        }),
      },
      { name: 'enabled', type: 'boolean', label: '项目状态' },
      { name: 'createUserName', type: 'string', label: '创建人' },
      { name: 'imageUrl', type: 'string' },
      { name: 'creationDate', type: 'date', label: '创建时间' },
      { name: 'useTemplate', defaultValue: true },
      {
        name: 'allowLink',
        type: 'boolean',
        label: (
          <div>
            允许其他项目关联此项目工作项/需求
            <NewTips helpText="开启后，组织内其他项目的工作项（或需求）可关联当前项目的工作项（或需求）" />
          </div>
        ),
        defaultValue: false,
      },
      ...extraFields,
    ],
    events: {
      load: ({ dataSet }) => {
        if (dataSet && dataSet?.current?.get('devopsComponentCode')) {
          dataSet?.current?.getField('devopsComponentCode').set('disabled', true);
        }
        if (dataSet && dataSet?.current?.get('code') && !dataSet?.current?.get('devopsComponentCode')) {
          const output = cleanString(dataSet?.current?.get('code'));
          // const devopsCode = trimSpecial(dataSet?.current?.get('code'));
          // const lowerCode = devopsCode?.toLowerCase();
          // const finalCode = lowerCode.replace(/^(\s|[0-9]+.{0,1}[0-9]{0,2})/g, '');
          // const reg = /[\u4e00-\u9fa5]/g;
          // const removeChinese = finalCode.replace(reg, '');
          dataSet.current?.set('devopsComponentCode', output);
        }
      },
      update: ({
        dataSet, record, name, value, oldValue,
      }) => {
        if (name === 'code') {
          const output = cleanString(value);
          // const devopsCode = trimSpecial(dataSet?.current?.get('code'));
          // const lowerCode = devopsCode?.toLowerCase();
          // const finalCode = lowerCode.replace(/^(\s|[0-9]+.{0,1}[0-9]{0,2})/g, '');
          // const reg = /[\u4e00-\u9fa5]/g;
          // const removeChinese = finalCode.replace(reg, '');
          dataSet.current?.set('devopsComponentCode', output);
        }
      },
    },
  };
};
