import React from 'react';
import { StoreProvider } from './stores';
import QuickLink from './QuickLink';

const index = (props) => (
  <StoreProvider {...props}>
    <QuickLink />
  </StoreProvider>
);

export default index;
