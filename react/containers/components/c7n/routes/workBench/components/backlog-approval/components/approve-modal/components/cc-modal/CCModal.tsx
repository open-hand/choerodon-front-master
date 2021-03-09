import React, { useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  DataSet, Modal, Select, Form,
} from 'choerodon-ui/pro';
import { IModalProps } from '@/types';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import './CCModal.less';

const prefix = 'c7n-backlogApprove-ccModal';

interface Props {
  modal?: IModalProps
  record: Record
}

const CCModal:React.FC<Props> = ({ modal, record }) => {
  const ccDataSet = useMemo(() => new DataSet({
    fields: [{
      name: 'cc',
      label: '选择成员',
      required: true,
      multiple: true,
    }],
  }), []);

  const handleSubmit = useCallback(async () => {
    const validate = await ccDataSet.validate();
    if (validate) {
      console.log(ccDataSet.current?.get('cc'));
      return true;
    }
    return false;
  }, [ccDataSet]);
  useEffect(() => {
    modal?.handleOk(handleSubmit);
  }, [handleSubmit, modal]);
  return (
    <div className={`${prefix}-container`}>
      <Form>
        <Select dataSet={ccDataSet} name="cc" />
      </Form>
    </div>
  );
};

const ObserverCCModal = observer(CCModal);

const openCCModal = (props: Props) => {
  Modal.open({
    key: 'backlogApproveCCModal',
    title: '选择抄送人',
    className: prefix,
    style: {
      width: 520,
    },
    children: <ObserverCCModal {...props} />,
    cancelProps: {
      style: {
        color: '#000',
      },
    },
  });
};

export default openCCModal;
