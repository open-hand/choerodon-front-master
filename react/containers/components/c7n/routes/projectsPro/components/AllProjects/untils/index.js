import moment from 'moment';
import { getCustomFieldDsOptions, getCustomFieldDsType } from '@/containers/components/c7n/routes/projectsPro/components/create-project/untils/getCustomFieldDsProps';
import { defaultSelectEleConfig, userOptionRender } from '../config/querybarConfig';
import { selectTypeArr, timeTypeArr, userSelectArr } from '../../create-project/untils/getCustomFieldDsProps';

const searchFieldsTypeMap = new Map([
  // 文本框（多行）
  ['text', 'TextField'],

  // 单选框
  ['radio', 'FlatSelect'],

  // 复选框
  ['checkbox', 'FlatSelect'],

  // 时间选择器
  ['time', 'TimePicker'],

  // 日期时间选择器
  ['datetime', 'DateTimePicker'],

  // 数字输入框
  ['number', 'NumberField'],

  // 文本框（单行）
  ['input', 'TextField'],

  // 选择器（单选）
  ['single', 'FlatSelect'],

  //  选择器（多选）
  ['multiple', 'FlatSelect'],

  // 人员
  ['member', 'FlatSelect'],

  // 日期选择器
  ['date', 'DatePicker'],

  // 人员(多选)
  ['multiMember', 'FlatSelect'],
]);

function transformColumnDataToSubmit(columnsData) {
  const listLayoutColumnRelVOS = [];
  columnsData.forEach((item, index) => {
    const iObj = {
      columnCode: item.name,
      display: item.isSelected,
      sort: index,
      width: item.width || 0,
      label: item.label,
    };
    listLayoutColumnRelVOS.push(iObj);
  });
  const postObj = {
    applyType: 'projectView',
    listLayoutColumnRelVOS,
  };
  return postObj;
}

function transformToSearchFieldsConfig(systemConfig, customFields) {
  const arr = [];

  customFields.forEach((item) => {
    const obj = {
      type: searchFieldsTypeMap.get(item.fieldType),
      initial: false,
      dsProps: {
        name: item.fieldCode,
        options: getCustomFieldDsOptions(item, false),
        type: getCustomFieldDsType(item),
        textField: 'value', // 针对下拉
        valueField: 'id',
        range: timeTypeArr.includes(item.fieldType),
      },
      eleProps: {
        placeholder: item.fieldName,
        ...defaultSelectEleConfig, // 筛选的select都可以多选
        searchMatcher: 'searchValue',
        multiple: selectTypeArr.includes(item.fieldType),
        isFlat: timeTypeArr.includes(item.fieldType),
      },
    };

    if (userSelectArr.includes(item.fieldType)) {
      obj.dsProps = {
        ...obj.dsProps,
        textField: 'realName',
        valueField: 'id',
      };
      obj.eleProps = {
        ...obj.eleProps,
        optionRenderer: userOptionRender,
        searchMatcher: 'params',
      };
    }
    arr.push(obj);
  });
  return systemConfig.concat(arr);
}

function transformToFilterFieldsConfig(data) {
  const newData = [];
  data.forEach((item) => {
    newData.push({
      name: item.fieldCode,
      label: item.fieldName,
    });
  });
  return newData;
}

const getSearchDateValue = (value, fieldType) => {
  if (fieldType === 'time') {
    return {
      startDate: moment(value[0]).format('HH:mm:ss'),
      endDate: moment(value[1]).format('HH:mm:ss'),
    };
  } if (fieldType === 'date') {
    return {
      startDate: `${moment(value[0]).format('YYYY-MM-DD')} 00:00:00`,
      endDate: `${moment(value[1]).format('YYYY-MM-DD')} 00:00:00`,
    };
  }
  return {
    startDate: value[0],
    endDate: value[1],
  };
};

export {
  transformColumnDataToSubmit,
  transformToSearchFieldsConfig,
  transformToFilterFieldsConfig,
  getSearchDateValue,
};
