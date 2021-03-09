import React from 'react';
import { observer } from 'mobx-react-lite';
import Status from './status';
import Priority from './priority';
import DemandType from './demand-type';
import Assignees from './assignees';
import Email from './email';
import ProgressFeedback from './progress-feedback';
import DemandClassification from './demand-classification';
import CustomFields from './custom-fields';
import BelongProject from './belong-project';
import { DemandDetailStore } from '../../../../../../stores/DetailStore';
import './index.less';

interface Props {
  store: DemandDetailStore,
}
const Fields: React.FC<Props> = ({ store }) => {
  const source = store.demand?.source;
  return (
    <div className="c7n-backlogApprove-backlogDetail-fields">
      <Status store={store} />
      <Priority store={store} />
      <DemandType store={store} />
      <DemandClassification store={store} />
      <Assignees store={store} />
      <ProgressFeedback store={store} />
      <BelongProject store={store} />
      {source === 'outside' ? <Email store={store} /> : null}
      <CustomFields store={store} />
    </div>
  );
};

export default observer(Fields);
