import React from 'react';
import { StoreProvider } from "./stores";
import WorkBench from './WorkBench';

const index = (props) => (
  <StoreProvider {...props}>
    <WorkBench />
  </StoreProvider>
)

export default index
