import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

interface Props {
  store: DemandDetailStore,
}
const Priority: React.FC<Props> = ({ store }) => {
  const { demand } = store;
  const backlogPriority = demand.backlogPriority || {};
  const { id, color, name } = backlogPriority;
  return (
    <Field label="紧急程度">
      {id ? (
        <div
          className="c7n-level"
          style={{
            backgroundColor: `${color}1F`,
            color,
            borderRadius: '2px',
            padding: '0 8px',
            display: 'inline-block',
          }}
        >
          {name}
        </div>
      ) : (
        <div>
          无
        </div>
      )}
    </Field>
  );
};

export default observer(Priority);
