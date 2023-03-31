import { DataSet } from 'choerodon-ui/pro';
import JSONbig from 'json-bigint';
import { getOrganizationId } from '@/utils/getId';
import { cbaseApiConfig, organizationsApiConfig } from '@/apis';

export const fieldTypeMap = new Map([
  // 文本框（多行）
  ['text', 'string'],

  // 单选框
  ['radio', 'string'],

  // 复选框
  ['checkbox', 'string'],

  // 时间选择器
  ['time', 'string'],

  // 日期时间选择器
  ['datetime', 'string'],

  // 数字输入框
  ['number', 'number'],

  // 文本框（单行）
  ['input', 'string'],

  // 选择器（单选）
  ['single', 'string'],

  //  选择器（多选）
  ['multiple', 'string'],

  // 人员
  ['member', 'string'],

  // 日期选择器
  ['date', 'string'],

  // 人员(多选)
  ['multiMember', 'string'],
]);

export const singleSelectArr = ['radio', 'single', 'member'];
export const multipleSelectArr = ['checkbox', 'multiple', 'multiMember'];
export const userSelectArr = ['member', 'multiMember'];
export const selectTypeArr = singleSelectArr.concat(multipleSelectArr);
export const timeTypeArr = ['time', 'datetime', 'date'];

export const getCustomFieldDsType = (fieldConfig:any) => fieldTypeMap.get(fieldConfig.fieldType);

const getCustomFieldDsMultiple = (fieldConfig:any) => multipleSelectArr.includes(fieldConfig.fieldType);

const getCustomFieldDsOptions = (fieldConfig:any, onlyEnabled = true) => {
  const { fieldType, fieldId } = fieldConfig;
  if (userSelectArr.includes(fieldType)) {
    return new DataSet({
      autoQuery: true,
      autoCreate: true,
      transport: {
        read: ({ params, data }) => ({
          url: organizationsApiConfig.getprojUsers().url,
          method: 'get',
          transformResponse: (res) => {
            const newData = JSONbig.parse(res);
            return newData;
          },
        }),
      },
    });
  }
  if (selectTypeArr.includes(fieldType)) {
    return new DataSet({
      autoQuery: true,
      autoCreate: true,
      transport: {
        // 创建、修改不展示禁用选项, 筛选的时候要展示禁用选项
        read: ({ dataSet, params, data }) => ({
          url: cbaseApiConfig.getCustomFieldsOptions(getOrganizationId(), fieldId, {
            searchValue: data.searchValue,
            onlyEnabled,
          }).url,
          method: 'post',
          data: dataSet?.getState('selectids') || [],
          transformResponse: (res) => {
            const newData = JSONbig.parse(res);
            return newData;
          },
        })
        ,
      },
    });
  }
  return null;
};

const getCustomFieldDsTextField = (fieldConfig:any) => (userSelectArr.includes(fieldConfig.fieldType) ? 'realName' : 'value');

const getCustomFieldDsValueField = (fieldConfig:any) => (userSelectArr.includes(fieldConfig.fieldType) ? 'id' : 'id');

const getCustomFieldDsProps = (fieldConfig:any) => ({
  type: getCustomFieldDsType(fieldConfig),
  multiple: getCustomFieldDsMultiple(fieldConfig),
  options: getCustomFieldDsOptions(fieldConfig),
  textField: getCustomFieldDsTextField(fieldConfig),
  valueField: getCustomFieldDsValueField(fieldConfig),
});

export { getCustomFieldDsProps, getCustomFieldDsOptions };
