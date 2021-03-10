import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

interface Props {
  store: DemandDetailStore
}
const StartTime: React.FC<Props> = ({ store }) => {
  const { demand } = store;
  const { estimatedStartTime } = demand;
  return (
    <Field label="预计开始时间">
      {
          estimatedStartTime || '无'
        }
    </Field>
  );
};

export default observer(StartTime);
