import moment from 'moment';
import { isNil } from 'lodash';
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

const normalContrastMap = new Map([
  ['input', 'string'],
  ['text', 'text'],
  ['number', 'number'],
]);

const dateContrastMap = new Map([
  ['date', 'date'],
  ['datetime', 'date'],
  ['time', 'dateHms'],
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
        options: getCustomFieldDsOptions(item, false, false),
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

const getQueryObj = (data, customFields) => {
  const queryObj = {
    projectCustomFieldSearchVO: {
      option: [],
    },
  };
  const customFieldsKeysArr = [];

  customFields.forEach((item) => {
    const { fieldType, fieldId, fieldCode } = item;
    const value = data[fieldCode];
    customFieldsKeysArr.push(fieldCode);
    if (value) {
      const normalKey = normalContrastMap.get(fieldType);
      const dateKey = dateContrastMap.get(fieldType);
      if (normalKey) {
        queryObj.projectCustomFieldSearchVO[normalKey] = [
          {
            fieldId,
            value,
          },
        ];
      } else if (dateKey) {
        queryObj.projectCustomFieldSearchVO[dateKey] = [
          {
            fieldId,
            ...getSearchDateValue(value, fieldType),
          },
        ];
      } else {
        // 有option的类型 是一个[]
        const arr = [];
        value.forEach((v) => {
          arr.push(v);
        });
        queryObj.projectCustomFieldSearchVO.option.push({
          fieldId,
          value: arr,
        });
      }
    }
  });

  Object.keys(data).forEach((key) => {
    if (customFieldsKeysArr.includes(key)) {
      return;
    }
    const value = data[key];
    if (isNil(value) || (Array.isArray(value) && !value.length)) {
      return;
    }
    if (key === 'updateTime') {
      queryObj.lastUpdateDateStart = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
      queryObj.lastUpdateDateEnd = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
    } else if (key === 'createTime') {
      queryObj.creationDateStart = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
      queryObj.creationDateEnd = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
    } else {
      queryObj[key] = value;
    }
  });

  return queryObj;
};

export {
  transformColumnDataToSubmit,
  transformToSearchFieldsConfig,
  transformToFilterFieldsConfig,
  getSearchDateValue,
  getQueryObj,
};
