import React from 'react';
import { observer } from 'mobx-react-lite';
import { Tooltip } from 'choerodon-ui';
import TimeAgo from 'timeago-react';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';
import { IField } from '../../../../../../../common/types';

interface Props {
  field: IField
  store: DemandDetailStore
}
const CreateDate: React.FC<Props> = ({ field, store }) => {
  const { demand: { creationDate } } = store;
  return (
    <Field label={field.fieldName}>
      <div style={{ padding: '0 0.05rem 0 0.05rem' }}>
        {creationDate ? (
          <Tooltip placement="top" title={creationDate}>
            <TimeAgo
              datetime={creationDate}
              locale="zh_CN"
            />
          </Tooltip>
        ) : '-'}
      </div>

    </Field>
  );
};

export default observer(CreateDate);
