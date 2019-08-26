import React from 'react';
import { StoreProvider } from './stores';
import ListViewWrap from './ListViewWrap';

const Index = props => (
  <StoreProvider {...props}>
    <ListViewWrap />
  </StoreProvider>
);

export default Index;
