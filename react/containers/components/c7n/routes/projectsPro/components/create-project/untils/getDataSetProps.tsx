import { DataSet } from 'choerodon-ui/pro';
import { getOrganizationId } from '@/utils/getId';

const fieldTypeMap = new Map([
  // 文本框（多行）
  ['text', 'string'],

  // 单选框
  ['radio', 'string'],

  // 复选框
  ['checkbox', 'string'], // 这个啥类型

  // 时间选择器
  ['time', 'string'],

  // 日期时间选择器
  ['datetime', 'string'],

  // 数字输入框
  ['number', 'number'],

  // 文本框（单行）
  ['input', 'string'],

  // 选择器（单选）
  ['single', 'object'],

  //  选择器（多选）
  ['multiple', 'object'],

  // 人员
  ['member', 'object'],

  // 日期选择器
  ['date', 'string'],

  // 人员(多选)
  ['multiMember', 'object'],
]);

const getDataSetFieldsType = (fieldConfig:any) => fieldTypeMap.get(fieldConfig.fieldType);

const getDataSetFieldsMultiple = (fieldConfig:any) => ['multiple', 'multiMember', 'checkbox'].includes(fieldConfig.fieldType);

const getDataSetFieldsOptions = (fieldConfig:any) => {
  const { fieldType, id } = fieldConfig;
  const isSelect = ['single', 'multiple'];
  const isUser = ['member', 'multiMember'];
  if (isSelect.includes(fieldType) || isUser.includes(fieldType)) {
    return new DataSet({
      autoQuery: true,
      autoCreate: true,
      transport: {
        // 看下prd 禁用的要展示吗，这里的onlyEnabled暂时写成true
        read: ({ params, data }) => {
          console.log(data, 'xxxxx');
          return {
            url: `/cbase/choerodon/v1/organizations/${getOrganizationId()}/project_field/${id}/options?page=0&size=50&onlyEnabled=&searchValue=${data.searchValue || ''}`,
            method: 'post',
            data: [],
          };
        },
      },
    });
  }
  return null;
};

const getDataSetProps = (fieldConfig:any) => ({
  type: getDataSetFieldsType(fieldConfig),
  multiple: getDataSetFieldsMultiple(fieldConfig),
  options: getDataSetFieldsOptions(fieldConfig),
});

export { getDataSetProps, getDataSetFieldsOptions };
