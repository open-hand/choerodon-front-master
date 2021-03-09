import React from 'react';
import { observer } from 'mobx-react-lite';
// import CKEditorViewer from '@choerodon/agile/lib/components/CKEditorViewer';

import { DemandDetailStore } from '../../../../../../stores/DetailStore';

const Description: React.FC<{
  store: DemandDetailStore
}> = ({ store }) => {
  const { description } = store.demand;
  return (
    <div>
      {/* <CKEditorViewer value={description} /> */}
      {description}
    </div>
  );
};

export default observer(Description);
