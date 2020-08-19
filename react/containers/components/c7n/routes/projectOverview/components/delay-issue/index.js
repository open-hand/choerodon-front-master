import React from 'react';
import { StoreProvider } from './stores';
import DelayIssue from './DelayIssue';

const index = (props) => (
  <StoreProvider {...props}>
    <DelayIssue />
  </StoreProvider>
);

export default index;
