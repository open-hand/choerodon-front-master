import React from 'react';
import { StoreProvider } from "./stores";
import Workload from './Workload';

const index = (props) => (
  <StoreProvider {...props}>
    <Workload />
  </StoreProvider>
)

export default index
