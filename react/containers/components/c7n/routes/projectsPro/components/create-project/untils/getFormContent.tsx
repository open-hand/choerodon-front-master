import React from 'react';
import {
  TextField, TextArea, DateTimePicker, Select, TreeSelect, NumberField, TimePicker, DatePicker, SelectBox, DataSet,
} from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { selectTypeArr, userSelectArr } from './getCustomFieldDsProps';
import { userOptionRender } from '../../AllProjects/config/querybarConfig';

const renderTreeSelect = ({ text }: { text: string }) => (
  <span className="tree-select-text">{text}</span>
);

const nodeCover = ({ record: iRecord }: { record: Record }) => ({
  disabled: iRecord?.get('hasChildren') || iRecord?.get('children'),
});

export const formContentMap:any = new Map([
  ['input', TextField],
  ['member', Select],
  ['radio', SelectBox],
  ['checkbox', SelectBox],
  ['time', TimePicker],
  ['datetime', DateTimePicker],
  ['number', NumberField],
  ['single', Select],
  ['multiple', Select],
  ['text', TextArea],
  ['date', DatePicker],
  ['multiMember', Select],
]);

const specialFormContentMap: any = new Map([ // 系统字段原本的逻辑
  ['statusId',
    <Select
      name="statusId"
      onOption={({ record: record1 }) => ({
        disabled: !record1?.get('enable'),
      })}
    />,
  ],
  ['workGroup',
    <TreeSelect name="workGroup" optionRenderer={renderTreeSelect} />,
  ],
  ['classify',
    <TreeSelect name="classify" onOption={nodeCover} optionRenderer={renderTreeSelect} />,
  ],
  ['creationDate',
    <TextField name="creationDate" disabled />,
  ],
  ['creator',
    <TextField name="creator" disabled />,
  ],
]);

const getEleProps = (fieldConfig: any, preFieldConfig: any, index: number, formDs :DataSet) => {
  const { fieldType, fieldCode } = fieldConfig;
  let obj: any = {};

  if (['text'].includes(fieldType)) {
    obj.colSpan = 100;
    obj.newLine = true;
    obj.rows = 3;
    obj.resize = 'vertical';
  } else {
    if (preFieldConfig?.fieldType !== 'text' && index % 2 !== 0) {
      obj.className = 'form-item-offset';
    }
    obj.colSpan = 50;
    obj.style = {
      width: 340,
    };
  }

  if (selectTypeArr.includes(fieldType)) {
    if (!['radio', 'checkbox'].includes(fieldType)) {
      obj.searchable = true;
    }
    const option = formDs?.getField(fieldCode)?.options;
    if (option) {
      obj.onChange = (v:any) => {
        option.setState('selectids', Array.isArray(v) ? [...v] : [v]);
      };
    }
  }

  if (userSelectArr.includes(fieldType)) {
    obj = {
      ...obj,
      optionRenderer: userOptionRender,
      searchMatcher: 'params',
    };
  }

  return obj;
};

const getFormContent = (fieldsConfig: any[], func:any, currentRoleLabels:any, formDs:DataSet) => {
  if (func && !specialFormContentMap.get('totalDay')) { // 海天加的字段 后面升级后端需要返回
    specialFormContentMap.set('totalDay', func.default(!currentRoleLabels?.includes('TENANT_ADMIN')));
  }

  const arr: JSX.Element[] = [];
  fieldsConfig.forEach((item: any, index: number) => {
    if ([...specialFormContentMap.keys()].includes(item.fieldCode)) {
      const SpecialEle = specialFormContentMap.get(item.fieldCode)!;
      arr.push(
        React.cloneElement(SpecialEle, { ...getEleProps(item, fieldsConfig[index - 1], index, formDs) }),
      );
      return;
    }

    const Ele = formContentMap.get(item.fieldType)!;
    arr.push(
      <Ele
        name={item.fieldCode}
        {...getEleProps(item, fieldsConfig[index - 1], index, formDs)}
      />,
    );
  });

  return arr;
};

export default getFormContent;
