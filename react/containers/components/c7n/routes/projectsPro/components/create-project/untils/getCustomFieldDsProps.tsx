import { DataSet } from 'choerodon-ui/pro';
import JSONbig from 'json-bigint';
import moment from 'moment';
import { getOrganizationId } from '@/utils/getId';
import { cbaseApiConfig, organizationsApiConfig } from '@/apis';
import { getSelectids } from '../../AllProjects/config/querybarConfig';

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
export const numberTypeArr = ['number'];

export const getDateTypeValue = (value:any, fieldType:any) => {
  if (fieldType === 'time') {
    return moment(value).format('HH:mm:ss');
  } if (fieldType === 'date') {
    return moment(value).format('YYYY-MM-DD');
  }
  return value;
};

export const getCustomFieldDsType = (fieldConfig:any) => fieldTypeMap.get(fieldConfig.fieldType);

const getCustomFieldDsMultiple = (fieldConfig:any) => multipleSelectArr.includes(fieldConfig.fieldType);

const getCustomFieldDsOptions = (fieldConfig:any, onlyEnabled = true, autoQuery = true) => {
  const { fieldType, fieldId } = fieldConfig;
  if (userSelectArr.includes(fieldType)) {
    return new DataSet({
      autoQuery,
      autoCreate: true,
      transport: {
        read: ({ dataSet, params, data }) => ({
          ...organizationsApiConfig.getOrgUsers(
            {
              selectedUserIds: getSelectids(dataSet?.getState('selectids')),
              params: data.params,
            },
            getOrganizationId(),
          ),
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
      autoQuery,
      autoCreate: true,
      transport: {
        // 创建、修改不展示禁用选项, 筛选的时候要展示禁用选项
        read: ({ dataSet, params, data }) => ({
          ...cbaseApiConfig.getCustomFieldsOptions(
            getOrganizationId(),
            fieldId,
            {
              searchValue: data.searchValue,
              onlyEnabled,
            },
            getSelectids(dataSet?.getState('selectids')),
          ),
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

const getCustomFieldDsProps = ({
  fieldConfig, onlyEnabled = true, autoQuery = true,
}:{fieldConfig:any, onlyEnabled:boolean, autoQuery :boolean}) => ({
  type: getCustomFieldDsType(fieldConfig),
  multiple: getCustomFieldDsMultiple(fieldConfig),
  options: getCustomFieldDsOptions(fieldConfig, onlyEnabled, autoQuery),
  textField: getCustomFieldDsTextField(fieldConfig),
  valueField: getCustomFieldDsValueField(fieldConfig),
});

export { getCustomFieldDsProps, getCustomFieldDsOptions };
