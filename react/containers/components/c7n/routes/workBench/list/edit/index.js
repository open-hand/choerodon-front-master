import React from 'react';
import { StoreProvider } from '../../stores';
import WorkBenchSetting from './WorkBenchSetting';

const index = (props) => (
  <StoreProvider {...props}>
    <WorkBenchSetting />
  </StoreProvider>
);

export default index;
