import React from 'react';
import { StoreProvider } from './stores';
import CreateViewDrawer from './CreateViewDrawer';

const index = (props) => (
  <StoreProvider {...props}>
    <CreateViewDrawer />
  </StoreProvider>
);

export default index;
