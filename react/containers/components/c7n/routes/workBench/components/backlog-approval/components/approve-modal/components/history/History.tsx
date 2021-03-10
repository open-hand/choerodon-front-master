import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'choerodon-ui/pro';
import { DemandDetailStore } from '../../../../stores/DetailStore';
import HistoryList from './components/HistoryList';

import './History.less';

const prefix = 'c7n-backlogApprove-approveHistory';

const History: React.FC<{
  store: DemandDetailStore
}> = ({ store }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const { approveLogs } = store;
  useEffect(() => {
    store.getApproveLogs();
  }, [store]);

  const handleExpandBtnClick = () => {
    setExpand(!expand);
  };

  return (
    <div className={prefix}>
      <HistoryList
        expand={expand}
        store={store}
      />
      {
        approveLogs.length > 5 && (
          <Button
            className={`${prefix}-expandBtn`}
            onClick={handleExpandBtnClick}
            icon={expand ? 'baseline-arrow_drop_up icon' : 'baseline-arrow_right icon'}
          >
            {
              expand ? '折叠' : '展开'
            }
          </Button>
        )
      }
    </div>
  );
};

export default observer(History);
