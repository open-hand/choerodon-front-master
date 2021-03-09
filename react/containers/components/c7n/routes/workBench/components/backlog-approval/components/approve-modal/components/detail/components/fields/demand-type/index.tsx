import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

interface Props {
  store: DemandDetailStore,
}
const DemandType: React.FC<Props> = ({ store }) => {
  const { demand } = store;
  const backlogTypeDTO = demand.backlogTypeDTO || {};
  const { name } = backlogTypeDTO;
  return (
    <Field label="需求类型">
      <div>
        {name || '无'}
      </div>
    </Field>
  );
};

export default observer(DemandType);
