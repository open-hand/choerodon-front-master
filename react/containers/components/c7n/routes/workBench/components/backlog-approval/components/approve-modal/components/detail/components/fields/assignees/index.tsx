import React from 'react';
import { observer } from 'mobx-react-lite';
import UserInfo from '@/containers/components/c7n/components/user-info';
import Field from '../field';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

const Assignees: React.FC<{
  store: DemandDetailStore
}> = ({ store }) => {
  const { demand: { assignees } } = store;
  return (
    <Field label="处理人">
      {
        assignees && assignees.length > 0
        // @ts-ignore
          ? (<UserInfo {...(assignees || {})} />
          )
          : (
            <div>
              无
            </div>
          )
      }
    </Field>
  );
};

export default observer(Assignees);
