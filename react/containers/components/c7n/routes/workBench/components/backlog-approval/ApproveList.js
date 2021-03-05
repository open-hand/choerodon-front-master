import React from 'react';
import { observer } from 'mobx-react-lite';
import Card from '../card';
import { useWorkBenchStore } from '../../stores';

const prefixCls = 'c7ncd-workbench-approve-list';

const ApproveList = () => {
  const {
    approveListDs,
  } = useWorkBenchStore();

  return (
    <div className={prefixCls}>
      <Card
        title="需求待审核"
        className={`${prefixCls}-issueContent`}
      >
        approvalList
      </Card>
    </div>
  );
};

export default observer(ApproveList);
