import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';

const index = (props) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default index;
