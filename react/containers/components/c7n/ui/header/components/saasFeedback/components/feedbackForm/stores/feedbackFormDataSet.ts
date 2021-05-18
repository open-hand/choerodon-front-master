import { DataSet } from 'choerodon-ui/pro/lib';
import demandTypes from './demandTypes';
import emergencyTypes from './emergencyTypes';

/* eslint-disable import/no-anonymous-default-export */
export default (():any => ({
  autoCreate: true,
  fields: [
    {
      label: '问题类型',
      required: true,
      name: 'issueType',
      defaultValue: 'advisory',
    },
    {
      label: '紧急程度',
      required: true,
      name: 'emergency',
      valueField: 'value',
      textField: 'name',
      options: new DataSet({
        data: emergencyTypes,
      }),
    },
    {
      label: '问题标题',
      required: true,
      name: 'title',
    },
    {
      label: '需求类型',
      name: 'demandType',
      dynamicProps: {
        required: ({ record }:any) => record.get('issueType') === 'demand',
      },
      valueField: 'value',
      textField: 'name',
      options: new DataSet({
        data: demandTypes,
      }),
    },
  ],
}));
