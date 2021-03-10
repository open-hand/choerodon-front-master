import React, { useEffect, useCallback, useMemo } from 'react';
import {
  DataSet, Modal, Form, Select, TextArea, SelectBox,
} from 'choerodon-ui/pro';
import { IModalProps } from '@/types';
import { ResizeType } from 'choerodon-ui/pro/lib/text-area/enum';

interface Props {
  modal?: IModalProps,
}

const AddApproverModal: React.FC<Props> = (props) => {
  const { modal } = props;
  const dataSet = useMemo(() => new DataSet({
    fields: [{
      name: 'type',
      label: '加签类型',
      required: true,
    }, {
      name: 'approver',
      label: '选择审批人',
    }, {
      name: 'remark',
      label: '加签备注',
    }, {
      name: 'task',
      label: '当前任务',
    }, {
      name: 'opinion',
      label: '点击添加处理意见',
    }],
  }), []);
  const handleSubmit = useCallback(async () => false, []);
  useEffect(() => {
    modal?.handleOk(handleSubmit);
  }, [handleSubmit, modal]);

  return (
    <Form dataSet={dataSet}>
      <Select name="type" />
      <Select name="approver" />
      <TextArea name="remark" rows={1} resize={'vertical' as ResizeType} />
      当前任务
      <SelectBox name="task">
        <SelectBox.Option value="jack">审批同意</SelectBox.Option>
        <SelectBox.Option value="lucy">暂不处理</SelectBox.Option>
      </SelectBox>
      <div>处理意见</div>
      <TextArea name="opinion" resize={'vertical' as ResizeType} />
    </Form>
  );
};

const openAddApproverModal = (props: Props) => {
  Modal.open({
    key: 'AddApproverModal',
    title: '加签',
    children: <AddApproverModal {...props} />,
  });
};
export default openAddApproverModal;
