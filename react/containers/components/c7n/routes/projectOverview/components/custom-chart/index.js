import React from 'react';
import { StoreProvider } from './stores';
import CustomChart from './CustomChart';

const index = (props) => (
  <StoreProvider {...props}>
    <CustomChart />
  </StoreProvider>
);

export default index;
