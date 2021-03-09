/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import UserInfo from '@/containers/components/c7n/components/user-info';
import Field from '../field';
import StartTime from '../start-time';
import EndTime from '../end-time';
import Creator from '../creator';
import Updater from '../updater';
import CreateDate from '../create-date';
import UpdateDate from '../update-date';
import { IField } from '../../../../../../../common/types';
import { DemandDetailStore } from '../../../../../../../stores/DetailStore';

const filterFields = ['summary', 'belongToBacklog', 'backlogType', 'backlogClassification', 'description', 'urgent', 'progressFeedback', 'email'];
const CustomFields: React.FC<{
  store: DemandDetailStore,
}> = ({ store }) => {
  useEffect(() => {
    if (store.demand.issueTypeId) {
      store.getCustomFields(store.selected);
    }
  }, [store, store.demand.issueTypeId]);

  const renderFields = () => (
    <>
      {store.customFields
        .filter((field: IField) => !filterFields.includes(field.fieldCode))
        .map((field: IField) => {
          const { fieldType, valueStr, fieldCode } = field;
          console.log(field);
          if (fieldCode === 'estimatedStartTime') {
            return <StartTime store={store} />;
          } if (fieldCode === 'estimatedEndTime') {
            return <EndTime store={store} />;
          }
          if (fieldCode === 'created_user') {
            return <Creator field={field} store={store} />;
          }
          if (fieldCode === 'last_updated_user') {
            return <Updater field={field} store={store} />;
          }
          if (fieldCode === 'creationDate') {
            return <CreateDate field={field} store={store} />;
          }
          if (fieldCode === 'lastUpdateDate') {
            return <UpdateDate field={field} store={store} />;
          }
          return (
            <Field label={field.fieldName} key={field.fieldId}>
              <div style={{ maxWidth: 200, wordBreak: 'break-all', whiteSpace: 'pre-line' }}>
                {['member', 'multiMember'].includes(fieldType) && valueStr
                  ? (fieldType === 'member' ? (
                    <UserInfo
                      {...(valueStr || {})}
                      showName={false}
                    />
                  ) : valueStr.map((item: any) => <UserInfo {...(item || {})} showName={false} />)) : (valueStr || '无')}
              </div>
            </Field>
          );
        })}
    </>
  );
  return renderFields();
};

export default observer(CustomFields);
