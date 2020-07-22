import React from 'react';
import { StoreProvider } from './stores';
import DefectChart from './DefectChart';

const index = (props) => (
  <StoreProvider {...props}>
    <DefectChart />
  </StoreProvider>
);

export default index;
