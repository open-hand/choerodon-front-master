import React from 'react';
import { StoreProvider } from './stores';
import ApproveList from './ApproveList';

const index = (props) => (
  <StoreProvider {...props}>
    <ApproveList />
  </StoreProvider>
);

export default index;
