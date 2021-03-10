import {
  DataSet, Form, TextArea, Select, Button,
} from 'choerodon-ui/pro';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { ResizeType } from 'choerodon-ui/pro/lib/text-area/enum';
import React, { useMemo } from 'react';
import openAddApproverModal from '../addApprover';

const Suggest = () => {
  const dataSet = useMemo(() => new DataSet({
    fields: [{
      name: 'name',
      required: true,
      label: '审批意见',
    }, {
      name: 'text',
      label: '点击添加审批意见',
    }],
  }), []);
  return (
    <Form dataSet={dataSet} style={{ width: 500 }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Select name="name" style={{ width: '100%' }} />
        </div>
        <Button icon="settings" color={'blue' as ButtonColor} style={{ marginLeft: 20 }}>审批意见管理</Button>
      </div>
      <TextArea name="text" resize={'vertical' as ResizeType} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color={'blue' as ButtonColor}
          funcType={'raised' as FuncType}
          onClick={() => {
            openAddApproverModal({});
          }}
        >
          保留审批意见
        </Button>
        <Button color={'blue' as ButtonColor}>取消</Button>
      </div>
    </Form>
  );
};

export default Suggest;
