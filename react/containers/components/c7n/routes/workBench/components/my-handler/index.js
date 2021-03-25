import React from 'react';
import { StoreProvider } from './stores';
import MyHandler from './MyHandler';

const index = (props) => (
  <StoreProvider {...props}>
    <MyHandler />
  </StoreProvider>
);

export default index;
