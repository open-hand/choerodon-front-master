import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

const BelongFeedback: React.FC<{
  store: DemandDetailStore
}> = ({ store }) => {
  const { demand: { backlogName } } = store;
  return (
    <Field label="所属需求池">
      {backlogName || '-'}
    </Field>
  );
};

export default observer(BelongFeedback);
