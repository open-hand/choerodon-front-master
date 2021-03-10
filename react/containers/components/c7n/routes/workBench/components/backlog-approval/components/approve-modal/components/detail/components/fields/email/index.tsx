import React from 'react';
import { observer } from 'mobx-react-lite';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

interface Props {
  store: DemandDetailStore
}
const Email: React.FC<Props> = ({ store }) => {
  const { demand } = store;
  return (
    <Field label="邮箱">
      {demand.createUser?.email || '无'}
    </Field>
  );
};

export default observer(Email);
