import React from 'react';
import { observer } from 'mobx-react-lite';
import { mount } from '@choerodon/inject';

const PersonalWorkload = () => (
  <div>{mount('agile:PersonalWorkload', {})}</div>
);

export default observer(PersonalWorkload);
