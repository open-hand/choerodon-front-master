import React from 'react';
import {
  TextField, TextArea, DateTimePicker, Select, TreeSelect, NumberField, TimePicker, DatePicker, SelectBox,
} from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';

const renderTreeSelect = ({ text }: { text: string }) => (
  <span className="tree-select-text">{text}</span>
);

const nodeCover = ({ record: iRecord }: { record: Record }) => ({
  disabled: iRecord?.get('hasChildren') || iRecord?.get('children'),
});

/**
 * 需要特殊处理的form字段
 */

const specialFormFieldsArr = ['statusId', 'workGroupId', 'projectClassficationId'];

const formContentMap = new Map([
  ['text', TextArea],
  ['radio', SelectBox], // TODO
  ['checkbox', SelectBox], // TODO
  ['time', TimePicker],
  ['datetime', DateTimePicker],
  ['number', NumberField],
  ['input', TextField],
  ['single', Select],
  ['multiple', Select],
  ['member', Select],
  ['date', DatePicker],
  ['multiMember', Select],
]);

const specialFormContentMap: any = new Map([
  ['statusId',
    <Select
      name="statusId"
      onOption={({ record: record1 }) => ({
        disabled: !record1?.get('enable'),
      })}
    />,
  ],
  ['workGroupId',
    <TreeSelect name="workGroupId" optionRenderer={renderTreeSelect} />,
  ],
  ['projectClassficationId',
    <TreeSelect name="projectClassficationId" onOption={nodeCover} optionRenderer={renderTreeSelect} />,
  ],
  // creationDate   createUserName 是不是也要加上
]);

const getEleProps = (fieldConfig: any, preFieldConfig: any, index: number) => {
  const { fieldType } = fieldConfig;
  const obj: any = {};

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

  if (['single', 'multiple'].includes(fieldType)) {
    obj.searchable = true;
  }
  if (['multiMember', 'multiple'].includes(fieldType)) {
    obj.multiple = true;
  }

  return obj;
};

const getFormContent = (fieldsConfig: any[], func:any, currentRoleLabels:any) => {
  if (func && !specialFormContentMap.get('totalDay')) { // 海天加的字段
    specialFormContentMap.set('totalDay', func.default(!currentRoleLabels?.includes('TENANT_ADMIN')));
  }

  const arr: JSX.Element[] = [];

  fieldsConfig.forEach((item: any, index: number) => {
    let Ele;
    if (specialFormFieldsArr.includes(item.fieldType)) {
      Ele = specialFormContentMap.get(item.fieldType)!;
    } else {
      Ele = formContentMap.get(item.fieldType)!;
    }
    arr.push(<Ele name={item.fieldCode} {...getEleProps(item, fieldsConfig[index - 1], index)} />);
  });

  return arr;
};

export default getFormContent;
