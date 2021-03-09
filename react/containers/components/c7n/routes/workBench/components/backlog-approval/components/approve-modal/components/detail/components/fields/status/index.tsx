import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

interface IStatus {
  [type: string]: string
}

const STATUS: IStatus = {
  todo: '#ffb100',
  doing: '#4d90fe',
  done: '#00bfa5',
  prepare: '#F67F5A',
  backlog_rejected: '#F44336',
  wait_confirm: '#F67F5A',
  backlog_publish: '#ffb100',
  backlog_developed: '#00bfa5',
  backlog_planning: '#4d90fe',
};

const Status: React.FC<{ store: DemandDetailStore }> = ({ store }) => {
  const { demand: { id, statusId, statusVO } } = store;
  const name = statusVO?.name;
  const type = statusVO?.type;
  if (!statusId || !id) {
    return null;
  }

  return (
    <Field label="状态">
      {
        statusId ? (
          <div
            style={{
              background: STATUS[type],
              color: '#fff',
              borderRadius: '2px',
              padding: '0 8px',
              display: 'inline-block',
              margin: '2px auto 2px 0',
            }}
          >
            {name}
          </div>
        ) : (
          <div>
            无
          </div>
        )
      }
    </Field>
  );
};

export default observer(Status);
