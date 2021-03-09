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
  const { demand: { lastUpdateDate } } = store;
  return (
    <Field label={field.fieldName}>
      <div style={{ padding: '0 0.05rem 0 0.05rem' }}>
        {lastUpdateDate ? (
          <Tooltip placement="top" title={lastUpdateDate}>
            <TimeAgo
              datetime={lastUpdateDate}
              locale="zh_CN"
            />
          </Tooltip>
        ) : '-'}
      </div>
    </Field>
  );
};

export default observer(CreateDate);
