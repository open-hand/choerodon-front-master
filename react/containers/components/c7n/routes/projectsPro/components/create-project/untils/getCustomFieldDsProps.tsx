import { DataSet } from 'choerodon-ui/pro';
import { getOrganizationId } from '@/utils/getId';
import { cbaseApiConfig } from '@/apis';

export const fieldTypeMap = new Map([
  // 文本框（多行）
  ['text', 'string'],

  // 单选框
  ['radio', 'object'],

  // 复选框
  ['checkbox', 'object'],

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

export const singleSelectArr = ['radio', 'single', 'member'];
export const multipleSelectArr = ['checkbox', 'multiple', 'multiMember'];
export const selectTypeArr = singleSelectArr.concat(multipleSelectArr);
export const timeTypeArr = ['time', 'datetime', 'date'];

export const getCustomFieldDsType = (fieldConfig:any) => fieldTypeMap.get(fieldConfig.fieldType);

const getCustomFieldDsMultiple = (fieldConfig:any) => multipleSelectArr.includes(fieldConfig.fieldType);

const getCustomFieldDsOptions = (fieldConfig:any) => {
  const { fieldType, id } = fieldConfig;
  if (selectTypeArr.includes(fieldType)) {
    return new DataSet({
      autoQuery: true,
      autoCreate: true,
      transport: {
        // 看下prd 禁用的要展示吗，这里的onlyEnabled暂时写成true
        read: ({ params, data }) => ({
          url: cbaseApiConfig.getCustomFieldsOptions(getOrganizationId(), id, data.searchValue).url,
          method: 'post',
          data: [],
        }),
      },
    });
  }
  return null;
};

const getCustomFieldDsProps = (fieldConfig:any) => ({
  type: getCustomFieldDsType(fieldConfig),
  multiple: getCustomFieldDsMultiple(fieldConfig),
  options: getCustomFieldDsOptions(fieldConfig),
});

export { getCustomFieldDsProps, getCustomFieldDsOptions };
