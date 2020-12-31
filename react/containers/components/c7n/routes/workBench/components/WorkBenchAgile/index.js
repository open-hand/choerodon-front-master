import React from 'react';
import { StoreProvider } from './stores';
import WorkBenchAgile from './WorkBenchAgile';

const index = (props) => (
  <StoreProvider {...props}>
    <WorkBenchAgile />
  </StoreProvider>
);

export default index;
