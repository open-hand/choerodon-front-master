import React from 'react';
import { StoreProvider } from "./stores";
import BurnDownChart from './BurnDownChart';

const index = (props) => (
  <StoreProvider {...props}>
    <BurnDownChart />
  </StoreProvider>
)

export default index
