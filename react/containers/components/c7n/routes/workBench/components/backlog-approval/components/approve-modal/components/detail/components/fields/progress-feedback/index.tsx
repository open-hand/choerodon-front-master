import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import './index.less';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

const ProgressFeedback: React.FC<{
  store: DemandDetailStore
}> = ({ store }) => {
  const { demand: { progressFeedback } } = store;
  return (
    <Field label="需求进度反馈">
      { progressFeedback ? '需要' : '不需要'}
    </Field>
  );
};

export default observer(ProgressFeedback);
