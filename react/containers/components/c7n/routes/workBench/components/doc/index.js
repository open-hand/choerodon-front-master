import React from 'react';
import { StoreProvider } from './stores';
import Doc from './Doc';

const index = (props) => (
  <StoreProvider {...props}>
    <Doc />
  </StoreProvider>
);

export default index;
