import React from 'react';
import {
  TextField, TextArea, DateTimePicker, Select, TreeSelect, NumberField, TimePicker, DatePicker, SelectBox, DataSet,
} from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { selectTypeArr, userSelectArr, multipleSelectArr } from './getCustomFieldDsProps';
import { userOptionRender } from '../../AllProjects/config/querybarConfig';

export const contrastMapToFormDsMap = new Map([ // 后端返回字段code 和 创建修改表单 ds 不一样
  ['creator', 'createUserName'],
  ['classify', 'projectClassficationId'],
  ['workGroup', 'workGroupId'],
  ['status', 'statusId'],
]);

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
  ['workGroupId',
    <TreeSelect name="workGroupId" optionRenderer={renderTreeSelect} />,
  ],
  ['projectClassficationId',
    <TreeSelect name="projectClassficationId" onOption={nodeCover} optionRenderer={renderTreeSelect} />,
  ],
  ['creationDate',
    <TextField name="creationDate" disabled />,
  ],
  ['createUserName',
    <TextField name="createUserName" disabled />,
  ],
]);

const getEleProps = (fieldConfig: any, calculateIndex: number, index: number, formDs :DataSet, isModify:boolean) => {
  const { fieldType, fieldCode } = fieldConfig;
  let obj: any = {};

  if (['text'].includes(fieldType)) {
    obj.colSpan = 100;
    obj.newLine = true;
    obj.rows = 3;
    obj.resize = 'vertical';
  } else {
    if (calculateIndex % 2 === 0) {
      obj.className = 'form-item-offset';
    }
    obj.colSpan = 50;
    obj.style = {
      width: 340,
    };
  }

  if (isModify && fieldCode === 'code') {
    obj.disabled = true;
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

  if (multipleSelectArr.includes(fieldType)) {
    obj = {
      ...obj,
      maxTagCount: 3,
      maxTagTextLength: 3,
    };
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

const getFormContent = (fieldsConfig: any[], func:any, currentRoleLabels:any, formDs:DataSet, isModify:boolean) => {
  const healthState = formDs?.current?.get('healthState');
  const healthStateDto = formDs?.current?.get('healthStateDTO');
  if (func && !specialFormContentMap.get('totalDay')) { // 海天加的字段 后面升级后端需要返回
    specialFormContentMap.set('totalDay', func.default(!currentRoleLabels?.includes('TENANT_ADMIN')));
  }
  const arr: JSX.Element[] = [];
  let calculateIndex = 0;
  fieldsConfig.forEach((item: any, index: number) => {
    if (fieldsConfig[index - 1]?.fieldType === 'text') {
      calculateIndex = 1;
    } else {
      calculateIndex += 1;
    }
    if (item.fieldCode === 'healthStatus') {
      arr.push(
        // @ts-ignore
        <div className="c7ncd-operation-form-item-healthStatus" colSpan={50}>
          <div className="c7ncd-operation-form-item-healthStatus-label">健康状态:</div>
          <div className="c7ncd-operation-form-item-healthStatus-content">
            <div
              className="ring"
              style={{
                border: `2px solid ${healthState?.color || healthStateDto?.color}`,
              }}
            />
            <span className="text">{healthState?.name || healthStateDto?.name}</span>
          </div>
        </div>,
      );
      return;
    }
    if ([...specialFormContentMap.keys()].includes(item.fieldCode)) {
      const SpecialEle = specialFormContentMap.get(item.fieldCode)!;
      arr.push(
        React.cloneElement(SpecialEle, {
          ...getEleProps(
            item,
            calculateIndex,
            index,
            formDs,
            isModify,
          ),
        }),
      );
      return;
    }

    const Ele = formContentMap.get(item.fieldType)!;
    arr.push(
      <Ele
        name={item.fieldCode}
        {...getEleProps(item, calculateIndex, index, formDs, isModify)}
      />,
    );
  });

  return arr;
};

export default getFormContent;
