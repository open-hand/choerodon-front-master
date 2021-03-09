import React from 'react';
import { observer } from 'mobx-react-lite';
import './index.less';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

const prefix = 'c7n-backlogApprove-backlogDetail';

const Summary: React.FC<{
  store: DemandDetailStore
}> = ({ store }) => {
  const { summary } = store.demand;
  return (
    <div className={`${prefix}-summary`}>
      <div className="summary_text">
        {summary || '无'}
      </div>
    </div>
  );
};

export default observer(Summary);
