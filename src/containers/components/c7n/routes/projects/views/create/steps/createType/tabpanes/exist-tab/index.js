import React from 'react';
import { StoreProvider } from './stores';
import TabWrap from './TabWrap';

export default props => (
  <StoreProvider {...props}>
    <TabWrap />
  </StoreProvider>
);
