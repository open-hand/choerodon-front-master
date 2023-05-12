import React from 'react';
import { observer } from 'mobx-react-lite';
import { mount } from '@choerodon/inject';
import ExternalComponent from '@/components/external-component';
import { useProjectOverviewStore } from '../../stores';

const PersonalWorkload = () => {
  const {
    startSprintDs,
    startedRecord,
  } = useProjectOverviewStore();
  return (
    <div>
      <ExternalComponent
        system={{ scope: 'agile', module: 'agile:PersonalWorkload' }}
        startSprintDs={startSprintDs}
        startedRecord={startedRecord}
      />
    </div>
  );
};

export default observer(PersonalWorkload);
