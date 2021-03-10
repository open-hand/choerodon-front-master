import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

interface Props {
  store: DemandDetailStore
}
const StartTime: React.FC<Props> = ({ store }) => {
  const { demand } = store;
  const { estimatedEndTime } = demand;
  return (
    <Field label="预计结束时间">
      {
        estimatedEndTime || '无'
      }
    </Field>
  );
};

export default observer(StartTime);
