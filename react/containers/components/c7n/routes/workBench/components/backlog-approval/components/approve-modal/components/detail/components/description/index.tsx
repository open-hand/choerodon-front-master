import React from 'react';
import { observer } from 'mobx-react-lite';
import { CKEditorViewer } from '@choerodon/components';

import { DemandDetailStore } from '../../../../../../stores/DetailStore';

const Description: React.FC<{
  store: DemandDetailStore
}> = ({ store }) => {
  const { description } = store.demand;
  return (
    <div>
      <CKEditorViewer value={description} />
    </div>
  );
};

export default observer(Description);
