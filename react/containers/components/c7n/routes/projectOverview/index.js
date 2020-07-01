import React from 'react';
import { StoreProvider } from './stores';
import ProjectOverview from './ProjectOverview';

const index = (props) => (
  <StoreProvider {...props}>
    <ProjectOverview />
  </StoreProvider>
);

export default index;
