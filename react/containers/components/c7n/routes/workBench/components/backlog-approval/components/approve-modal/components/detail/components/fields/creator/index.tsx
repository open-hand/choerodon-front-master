import React from 'react';
import { observer } from 'mobx-react-lite';
import UserInfo from '@/containers/components/c7n/components/user-info';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';
import { IField } from '../../../../../../../common/types';

interface CreatorProps {
  field: IField
  store: DemandDetailStore
}
const Creator: React.FC<CreatorProps> = ({ field, store }) => {
  const { demand: { createUser } } = store;
  return (
    <Field label={field.fieldName}>
      <div style={{ padding: '0 0.05rem 0 0.05rem' }}>
        {
          createUser ? (
            <UserInfo
              {...(createUser || {})}
            />
          ) : (
            <div>
              无
            </div>
          )
        }
      </div>
    </Field>
  );
};

export default observer(Creator);
