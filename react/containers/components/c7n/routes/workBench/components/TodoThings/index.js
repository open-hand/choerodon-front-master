import React from 'react';
import { observer } from 'mobx-react-lite';
import Card from '../card';
import Check from '../check';
import { useWorkBenchStore } from '../../stores';

import './index.less';

const StarTargetPro = observer(() => {
  const {
    auditDs,
  } = useWorkBenchStore();
  
  return (
    <div className="c7n-workbench-todo">
      <Card
        title="待审核"
        showCount
        count={auditDs.length}
        className="c7n-workbench-check"
      >
        <Check />
      </Card>
    </div>
  );
});

export default StarTargetPro;
