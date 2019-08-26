import React from 'react';
import { StoreProvider } from './stores';
import ListView from './ListView';

const Index = props => (
  <StoreProvider {...props}>
    <ListView />
  </StoreProvider>
);

export default Index;
