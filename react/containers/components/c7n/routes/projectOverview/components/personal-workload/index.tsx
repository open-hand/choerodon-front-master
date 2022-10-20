import React from 'react';
import { observer } from 'mobx-react-lite';
import { mount } from '@choerodon/inject';
import { useProjectOverviewStore } from '../../stores';

const PersonalWorkload = () => {
  const {
    startSprintDs,
    startedRecord,
  } = useProjectOverviewStore();
  return (
    <div>
      {mount('agile:PersonalWorkload', {
        startSprintDs,
        startedRecord,
      })}
    </div>
  );
};

export default observer(PersonalWorkload);
